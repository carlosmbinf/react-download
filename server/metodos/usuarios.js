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
  console.log("Cargando Métodos de usuarios...");
  Meteor.methods({
    setConsumoProxy: async (user, status) => {
      try {
        let count = await Meteor.users.update(
          user ? user : {},
          {
            $set: { contandoProxy: status },
          },
          { multi: true }
        );
        return `Se actualizaron ${count} usuarios`;
      } catch (error) {
        return error.message;
      }
    },
    guardarDatosConsumidosByUserVPNMensual: async (user) => {
      console.log("guardarDatosConsumidosByUserVPNMensual");

      ///////CONSUMO VPN
      try {
        const ultimaCompraFechaVPN = await Meteor.call(
          "ultimaCompraByUserId",
          user._id,
          "VPN"
        );

        if (ultimaCompraFechaVPN) {
          // Encuentra todos los documentos que coincidan con los criterios de búsqueda
          const registrosVPN = await RegisterDataUsersCollection.find({
            userId: user._id,
            type: "vpn",
            fecha: { $gt: ultimaCompraFechaVPN.createdAt },
            register: "mensual",
          });

          // Inicializa una variable para almacenar la sumatoria de vpnMbGastados
          let consumidosVPN = 0;

          // Itera sobre los resultados y suma los valores de vpnMbGastados
          await registrosVPN.forEach((registro) => {
            consumidosVPN += registro.vpnMbGastados;
          });

          //REGISTRAR DATOS CONSUMIDOS EN VPN
          // Calcular el total de vpnMbGastados restantes y actualizar la colección
          const vpnMbRestantes = user.vpnMbGastados - consumidosVPN;

          if (vpnMbRestantes > 0) {
            console.log(
              "Registro VPN Mensual, megas: " +
                user.username +
                " con: " +
                vpnMbRestantes +
                "byte, -> " +
                vpnMbRestantes / 1024000 +
                "MB"
            );
            await RegisterDataUsersCollection.insert({
              userId: user._id,
              type: "vpn",
              vpnMbGastados: vpnMbRestantes,
              register: "mensual",
            });
          }
        } else {
          console.log(
            `Revisar el usuario no tiene ultima compra VPN Mensual, USER: ${
              user.username ? user.username : user._id
            }`
          );
          await RegisterDataUsersCollection.insert({
            userId: user._id,
            type: "vpn",
            vpnMbGastados: user.vpnMbGastados,
            register: "mensual",
          });
          await Meteor.call("reiniciarConsumoDeDatosVPN", user);
          await Meteor.call("desactivarUserVPN", user);
        }
      } catch (error) {
        console.log(error);
      }
    },
    guardarDatosConsumidosByUserPROXYHoras: async (user) => {
      ////////////CONSUMOS PROXY/////////////

      try {
        const ultimaCompraFecha = await Meteor.call(
          "ultimaCompraByUserId",
          user._id,
          "PROXY"
        );

        if (ultimaCompraFecha) {
          // Encuentra todos los documentos que coincidan con los criterios de búsqueda
          const registrosPROXY = await RegisterDataUsersCollection.find({
            userId: user._id,
            type: "proxy",
            fecha: { $gt: ultimaCompraFecha.createdAt },
          });

          // Inicializa una variable para almacenar la sumatoria de megasGastadosinBytes
          let consumidosPROXY = 0;

          // Itera sobre los resultados y suma los valores de megasGastadosinBytes
          await registrosPROXY.forEachAsync((registro) => {
            consumidosPROXY += registro.megasGastadosinBytes;
          });

          //REGISTRAR DATOS CONSUMIDOS EN PROXY
          const proxyMbRestantes = user.megasGastadosinBytes - consumidosPROXY;

          if (proxyMbRestantes > 0) {
            console.log(
              "Registro Proxy Horas, megas: " +
                user.username +
                " con: " +
                proxyMbRestantes +
                "byte, -> " +
                proxyMbRestantes / 1024000 +
                "MB"
            );
            await RegisterDataUsersCollection.insert({
              userId: user._id,
              type: "proxy",
              megasGastadosinBytes: proxyMbRestantes,
              register: "hora",
            });
          }
        } else {
          console.log(
            `Revisar el usuario no tiene ultima compra Proxy Diario, USER: ${
              user.username ? user.username : user._id
            }`
          );
          await RegisterDataUsersCollection.insert({
            userId: user._id,
            type: "proxy",
            megasGastadosinBytes: user.megasGastadosinBytes,
            register: "hora",
          });
          await Meteor.call("reiniciarConsumoDeDatosPROXY", user);
          await Meteor.call("desactivarUserProxy", user);
        }
      } catch (error) {
        console.log(error);
      }
    },
    guardarDatosConsumidosByUserVPNHoras: async (user) => {
      try {
        ///////CONSUMO VPN
        const ultimaCompraFechaVPN = await Meteor.call(
          "ultimaCompraByUserId",
          user._id,
          "VPN"
        );

        if (ultimaCompraFechaVPN) {
          // Encuentra todos los documentos que coincidan con los criterios de búsqueda
          const registrosVPN = await RegisterDataUsersCollection.find({
            userId: user._id,
            type: "vpn",
            fecha: { $gt: ultimaCompraFechaVPN.createdAt },
          });
          // Inicializa una variable para almacenar la sumatoria de vpnMbGastados
          let consumidosVPN = 0;

          // Itera sobre los resultados y suma los valores de vpnMbGastados
          await registrosVPN.forEach((registro) => {
            consumidosVPN += registro.vpnMbGastados;
          });

          //REGISTRAR DATOS CONSUMIDOS EN VPN
          // Calcular el total de vpnMbGastados restantes y actualizar la colección
          const vpnMbRestantes = user.vpnMbGastados - consumidosVPN;

          if (vpnMbRestantes > 0) {
            console.log(
              "Registro VPN Hora, megas: " +
                user.username +
                " con: " +
                vpnMbRestantes +
                "byte, -> " +
                vpnMbRestantes / 1024000 +
                "MB"
            );
            await RegisterDataUsersCollection.insert({
              userId: user._id,
              type: "vpn",
              vpnMbGastados: vpnMbRestantes,
              register: "hora",
            });
          }
        } else {
          console.log(
            `Revisar el usuario no tiene ultima compra VPN Diario, USER: ${
              user.username ? user.username : user._id
            }`
          );
          await RegisterDataUsersCollection.insert({
            userId: user._id,
            type: "vpn",
            vpnMbGastados: user.vpnMbGastados,
            register: "hora",
          });
          await Meteor.call("reiniciarConsumoDeDatosVPN", user);
          await Meteor.call("desactivarUserVPN", user);
        }
      } catch (error) {
        console.log(error);
      }
    },
    guardarDatosConsumidosByUserPROXYDiario: async (user) => {
      ////////////CONSUMOS PROXY/////////////

      try {
        const ultimaCompraFecha = await Meteor.call(
          "ultimaCompraByUserId",
          user._id,
          "PROXY"
        );

        if (ultimaCompraFecha) {
          // Encuentra todos los documentos que coincidan con los criterios de búsqueda
          const registrosPROXY = await RegisterDataUsersCollection.find({
            userId: user._id,
            type: "proxy",
            fecha: { $gt: ultimaCompraFecha.createdAt },
            register: "diario",
          });

          // Inicializa una variable para almacenar la sumatoria de megasGastadosinBytes
          let consumidosPROXY = 0;

          // Itera sobre los resultados y suma los valores de megasGastadosinBytes
          await registrosPROXY.forEachAsync((registro) => {
            consumidosPROXY += registro.megasGastadosinBytes;
          });

          //REGISTRAR DATOS CONSUMIDOS EN PROXY
          const proxyMbRestantes = user.megasGastadosinBytes - consumidosPROXY;

          if (proxyMbRestantes > 0) {
            console.log(
              "Registro Proxy Diario, megas: " +
                user.username +
                " con: " +
                proxyMbRestantes +
                "byte, -> " +
                proxyMbRestantes / 1024000 +
                "MB"
            );
            await RegisterDataUsersCollection.insert({
              userId: user._id,
              type: "proxy",
              megasGastadosinBytes: proxyMbRestantes,
              register: "diario",
            });
          }
        } else {
          console.log(
            `Revisar el usuario no tiene ultima compra Proxy Diario, USER: ${
              user.username ? user.username : user._id
            }`
          );
          await RegisterDataUsersCollection.insert({
            userId: user._id,
            type: "proxy",
            megasGastadosinBytes: user.megasGastadosinBytes,
            register: "diario",
          });
          await Meteor.call("reiniciarConsumoDeDatosPROXY", user);
          await Meteor.call("desactivarUserProxy", user);
        }
      } catch (error) {
        console.log(error);
      }
    },
    guardarDatosConsumidosByUserVPNDiario: async (user) => {
      try {
        ///////CONSUMO VPN
        const ultimaCompraFechaVPN = await Meteor.call(
          "ultimaCompraByUserId",
          user._id,
          "VPN"
        );

        if (ultimaCompraFechaVPN) {
          // Encuentra todos los documentos que coincidan con los criterios de búsqueda
          const registrosVPN = await RegisterDataUsersCollection.find({
            userId: user._id,
            type: "vpn",
            fecha: { $gt: ultimaCompraFechaVPN.createdAt },
            register: "diario",
          });
          // Inicializa una variable para almacenar la sumatoria de vpnMbGastados
          let consumidosVPN = 0;

          // Itera sobre los resultados y suma los valores de vpnMbGastados
          await registrosVPN.forEach((registro) => {
            consumidosVPN += registro.vpnMbGastados;
          });

          //REGISTRAR DATOS CONSUMIDOS EN VPN
          // Calcular el total de vpnMbGastados restantes y actualizar la colección
          const vpnMbRestantes = user.vpnMbGastados - consumidosVPN;

          if (vpnMbRestantes > 0) {
            console.log(
              "Registro VPN Diario, megas: " +
                user.username +
                " con: " +
                vpnMbRestantes +
                "byte, -> " +
                vpnMbRestantes / 1024000 +
                "MB"
            );
            await RegisterDataUsersCollection.insert({
              userId: user._id,
              type: "vpn",
              vpnMbGastados: vpnMbRestantes,
              register: "diario",
            });
          }
        } else {
          console.log(
            `Revisar el usuario no tiene ultima compra VPN Diario, USER: ${
              user.username ? user.username : user._id
            }`
          );
          await RegisterDataUsersCollection.insert({
            userId: user._id,
            type: "vpn",
            vpnMbGastados: user.vpnMbGastados,
            register: "diario",
          });
          await Meteor.call("reiniciarConsumoDeDatosVPN", user);
          await Meteor.call("desactivarUserVPN", user);
        }
      } catch (error) {
        console.log(error);
      }
    },
    setOnlineVPN: function (id, datachange) {
      console.log("HACIENDO UN SET AL USUARIO: ", id, " con cambio: ",datachange )
      return Meteor.users.update(id, { $set: datachange });
    },
    addUser: function (user) {
      try {
        let id = Accounts.createUser(user);
        return id ? "Usuario agregado correctamente!!!" : "";
      } catch (error) {
        return error;
      }
    },
    getusers: function (filter,options) {
      return Meteor.users
        .find(filter ? filter : {}, options ? options : { sort: { vpnip: 1 } })
        .fetch();
    },
    getusersAll: function (filter, option) {
      return Meteor.users
        .find(filter ? filter : {}, option ? option : {})
        .fetch();
    },
    updateUsersAll: function (id, datachange) {
      return Meteor.users.update(id, { $set: datachange });
    },
    getAdminPrincipal: async () => {
      ///////REVISAR EN ADDVENTASONLY  el descuento que se debe de hacer
      // let admin = await Meteor.users.findOne(adminId)
      // let precio = PreciosCollection.findOne(precioid)

      try {
        let adminPrincipal = await Meteor.users.findOne({
          username: Meteor.settings.public.administradores[0],
        });
        return adminPrincipal ? adminPrincipal : null;
      } catch (error) {
        return error.message;
      }
    },
    guardarDatosConsumidosByUserHoras: async (user) => {
      console.log(
        `Consumo Horas - DATE: ${new Date()}, USER: ${
          user.username ? user.username : user._id
        }`
      );

      user.megasGastadosinBytes > 0 &&
        (await Meteor.call("guardarDatosConsumidosByUserPROXYHoras", user));
      user.vpnMbGastados > 0 &&
        (await Meteor.call("guardarDatosConsumidosByUserVPNHoras", user));
    },
    guardarDatosConsumidosByUserDiario: async (user) => {
      console.log(
        `Reiniciar Consumo Diario - DATE: ${new Date()}, USER: ${
          user.username ? user.username : user._id
        }`
      );

      user.megasGastadosinBytes > 0 &&
        (await Meteor.call("guardarDatosConsumidosByUserPROXYDiario", user));
      user.vpnMbGastados > 0 &&
        (await Meteor.call("guardarDatosConsumidosByUserVPNDiario", user));
    },
    guardarDatosConsumidosByUserMensual: async (user) => {
      console.log(
        `Reiniciar Consumo Mensual - DATE: ${new Date()}, USER: ${
          user.username ? user.username : user._id
        }`
      );
      user.megasGastadosinBytes > 0 &&
        (await Meteor.call("guardarDatosConsumidosByUserPROXYMensual", user));
      user.vpnMbGastados > 0 &&
        (await Meteor.call("guardarDatosConsumidosByUserVPNMensual", user));
    },
    //changeNotificacionTelegram -- se le pasa el id del usuario a cambiar notificación de telegram
    changeNotificacionTelegram: function (id) {
      let usuario = Meteor.users.findOne(id);
      try {
         Meteor.users.update(id, { $set: {notificarByTelegram: !usuario.notificarByTelegram} });
         console.log("Notificación de Telegram actualizada para el usuario: " + (usuario ? usuario.username : ""));
         return "Notificación de Telegram actualizada";
      } catch (error) {
        return error.message;
      }
    },
    changePasswordServer: function (id,userCambioId, password) {
      try {
        Accounts.setPassword(id, password);
        Meteor.users.update(id, { $set: { "passvpn": password } });
        Meteor.call("registrarLog","Cambio de contraseña", id,userCambioId, "Cambio de contraseña");
        return "Contraseña actualizada";
      } catch (error) {
        return error.message;
      }
    },
  });
}
