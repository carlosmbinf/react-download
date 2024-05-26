import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import {
  OnlineCollection,
  PelisCollection,
  MensajesCollection,
  ServersCollection,
  PreciosCollection,
  VentasCollection,
  FilesCollection,
  VersionsCollection,
  LogsCollection,
  DescargasCollection,
  TVCollection,
  RegisterDataUsersCollection,
} from "/imports/ui/pages/collections/collections";
import moment from "moment";

if (Meteor.isServer) {
  console.log("Cargando Métodos de VPN...");
  Meteor.methods({

    reiniciarConsumoDeDatosVPN: async (user) => {
        console.log(`reiniciarConsumoDeDatosVPN user: `, user._id);
        /////////////Dejar en cero el consumo de los usuarios
        await Meteor.users.update(user._id, {
          $set: {
            vpnMbGastados: 0,
          },
        });
      },
    desactivarUserVPN: async (user) => {
        console.log(`desactivarUserVPN user: ${user}`);
        /////////////Dejar en cero el consumo de los usuarios
        await Meteor.users.update(user._id, {
          $set: {
            vpn: false,
          },
        });
      },
    addVentasVPN: async (userChangeid, userId) => {
      let userChange = await Meteor.users.findOne(userChangeid);
      let user = await Meteor.users.findOne(userId);
      // let precio = PreciosCollection.findOne(precioid)
      let precio;

      (await userChange.vpnisIlimitado)
        ? (precio = await PreciosCollection.findOne({
            userId: userId,
            type: "fecha-vpn",
          }))
        : userChange.vpnplus
        ? (precio = await PreciosCollection.findOne({
            userId: userId,
            type: "vpnplus",
            megas: userChange.vpnmegas,
          }))
        : (precio = await PreciosCollection.findOne({
            userId: userId,
            type: "vpn2mb",
            megas: userChange.vpnmegas,
          }));

      try {
        if (userChange.vpn) {
          await Meteor.call("desabilitarVPNUser", userChangeid, userId);
          return null;
        } else if (
          precio ||
          Array(Meteor.settings.public.administradores)[0].includes(
            user.username
          )
        ) {
          await Meteor.call("habilitarVPNUser", userChangeid, userId);

          precio &&
            (await Meteor.call(
              "addVentasOnly",
              userChangeid,
              userId,
              precio,
              "VPN"
            ));
          // VentasCollection.insert({
          //   adminId: userId,
          //   userId: userChangeid,
          //   precio: (precio.precio - user.descuentovpn > 0) ? (precio.precio - user.descuentovpn) : 0,
          //   comentario: precio.comentario
          // })
        }

        return precio
          ? precio.comentario
          : `No se encontro Precio a la oferta de VPN del usuario: ${userChange.username}`;
      } catch (error) {
        return error.message;
      }
    },
    desabilitarVPNUser: async (userChangeid, userId) => {
      let userChange = await Meteor.users.findOne(userChangeid);
      let user = await Meteor.users.findOne(userId);

      await Meteor.users.update(userChangeid, {
        $set: {
          vpn: false,
          bloqueadoDesbloqueadoPor: userId,
        },
      });
      Meteor.call(
        "registrarLog",
        "VPN",
        userChangeid,
        userId,
        `Se Desactivó la VPN`
      );
      // Meteor.call('sendemail', userChange, {
      //   text: "Ha sido " +
      //     (!userChange.baneado ? "Desactivado" : "Activado") +
      //     ` el proxy del usuario ${userChange.username}`
      // },
      //  (!userChange.baneado ? "Desactivado " + user.username : "Activado " + user.username)),
      await Meteor.call(
        "sendMensaje",
        userChange,
        {
          text: "Ha sido Desactivado el proxy",
        },
        "Desactivado " + user.username
      );
    },
    habilitarVPNUser: async (userChangeid, userId) => {
      let userChange = await Meteor.users.findOne(userChangeid);
      let user = await Meteor.users.findOne(userId);

      if (userChange.vpn || userChange.vpnplus || userChange.vpn2mb) {
        let nextIp = Meteor.users.findOne({}, { sort: { vpnip: -1 } })
          ? Meteor.users.findOne({}, { sort: { vpnip: -1 } }).vpnip
          : 1;

        !userChange.vpnip &&
          Meteor.users.update(userChangeid, {
            $set: {
              vpnip: nextIp + 1,
            },
          });
        Meteor.users.update(userChangeid, {
          $set: {
            vpn: true,
          },
        });
        Meteor.call(
          "registrarLog",
          "VPN",
          userChangeid,
          userId,
          `Se Activo la VPN`
        );
        // Meteor.call('sendemail', users, { text: `Se ${!users.vpn ? "Activo" : "Desactivó"} la VPN para el usuario: ${users.username}${users.descuentovpn ? ` Con un descuento de: ${users.descuentovpn}CUP` : ""}` }, `VPN ${user.username}`)
        Meteor.call(
          "sendMensaje",
          userChange,
          { text: `Se ${!userChange.vpn ? "Activo" : "Desactivó"} la VPN` },
          `VPN ${user.username}`
        );
      } else {
        setMensaje(
          "INFO!!!\nPrimeramente debe seleccionar una oferta de VPN!!!"
        ),
          handleClickOpen();
        // alert("INFO!!!\nPrimeramente debe seleccionar una oferta de VPN!!!")
      }
    },
  });
}
