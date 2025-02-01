import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'
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
  RegisterDataUsersCollection
} from "/imports/ui/pages/collections/collections";
import moment from "moment";

if (Meteor.isServer) {
    console.log("Cargando Métodos de proxy...");
    Meteor.methods({
      reiniciarConsumoDeDatosPROXY: async (user) => {
        console.log(`reiniciarConsumoDeDatosPROXY user: ${user}`);
        /////////////Dejar en cero el consumo de los usuarios
        await Meteor.users.update(user._id, {
          $set: {
            megasGastadosinBytes: 0,
            megasGastadosinBytesGeneral: 0,
          },
        });
      },
      desactivarUserProxy: async (user) => {
        console.log(`desactivarUserProxy user: ${user}`);
        /////////////Dejar en cero el consumo de los usuarios
        await Meteor.users.update(user._id, {
          $set: {
            baneado: true,
          },
        });
      },
    desabilitarProxyUser: async (userChangeid, userId) => {

      let userChange = await Meteor.users.findOne(userChangeid)
      let user = await Meteor.users.findOne(userId)

      let baneado = userChange.baneado

      !baneado &&
        await Meteor.users.update(userChangeid, {
          $set: {
            baneado: true,
            bloqueadoDesbloqueadoPor: userId
          },
        })

      !baneado &&
        await Meteor.call('registrarLog', 'Proxy', userChangeid, userId, `Ha sido Desactivado el proxy por un Admin`);

      // Meteor.call('sendemail', userChange, {
      //   text: "Ha sido " +
      //     (!userChange.baneado ? "Desactivado" : "Activado") +
      //     ` el proxy del usuario ${userChange.username}`
      // },
      //  (!userChange.baneado ? "Desactivado " + user.username : "Activado " + user.username)),

      !baneado &&
        await Meteor.call('sendMensaje', userChange, {
          text: "Ha sido Desactivado el proxy"
        }, ("Desactivado " + user.username))

    },
    habilitarProxyUser: async (userChangeid, userId) => {

      let userChange = await Meteor.users.findOne(userChangeid)
      let user = await Meteor.users.findOne(userId)
      console.log(userChange);
      let baneado = userChange.baneado
      baneado &&
        await Meteor.users.update(userChangeid, {
          $set: {
            baneado: false,
            bloqueadoDesbloqueadoPor: userId
          },
        })

      baneado &&
        await Meteor.call('registrarLog', 'Proxy', userChangeid, userId, `Ha sido Activado el proxy por un Admin`);
      // Meteor.call('sendemail', userChange, {
      //   text: "Ha sido " +
      //     (!userChange.baneado ? "Desactivado" : "Activado") +
      //     ` el proxy del usuario ${userChange.username}`
      // }, (!userChange.baneado ? "Desactivado " + user.username : "Activado " + user.username)),

      baneado &&
        await Meteor.call('sendMensaje', userChange, {
          text: "Ha sido " +
            (!userChange.baneado ? "Desactivado" : "Activado") +
            ` el proxy`
        }, (!userChange.baneado ? "Desactivado " + user.username : "Activado " + user.username))

    },
    habilitarProxyUserinVentas: async (userUsername, adminusername) => {

      let userChange = await Meteor.users.findOne({ username: userUsername })
      let admin = await Meteor.users.findOne({ username: adminusername })
      let baneado = userChange.baneado
      baneado &&
        await Meteor.users.update(userChange._id, {
          $set: {
            baneado: false,
            bloqueadoDesbloqueadoPor: admin._id
          },
        })

      baneado &&
        await Meteor.call('registrarLog', 'Proxy', userChange._id, admin._id, `Ha sido Activado el proxy por un Admin`);
      // Meteor.call('sendemail', userChange, {
      //   text: "Ha sido " +
      //     (!userChange.baneado ? "Desactivado" : "Activado") +
      //     ` el proxy del usuario ${userChange.username}`
      // }, (!userChange.baneado ? "Desactivado " + user.username : "Activado " + user.username)),

      baneado &&
        await Meteor.call('sendMensaje', userChange, {
          text: "Ha sido " +
            (!userChange.baneado ? "Desactivado" : "Activado") +
            ` el proxy`
        }, (!userChange.baneado ? "Desactivado " + admin.username : "Activado " + admin.username))

    },
    desabilitarProxyUserinVentas: async (userUsername, adminusername) => {

      let userChange = await Meteor.users.findOne({ username: userUsername })
      let admin = await Meteor.users.findOne({ username: adminusername })
      let baneado = userChange.baneado
      !baneado &&
        await Meteor.users.update(userChange._id, {
          $set: {
            baneado: true,
            bloqueadoDesbloqueadoPor: admin._id
          },
        })

      !baneado &&
        await Meteor.call('registrarLog', 'Proxy', userChange._id, admin._id, `Ha sido Desactivado el proxy por un Admin`);
      // Meteor.call('sendemail', userChange, {
      //   text: "Ha sido " +
      //     (!userChange.baneado ? "Desactivado" : "Activado") +
      //     ` el proxy del usuario ${userChange.username}`
      // }, (!userChange.baneado ? "Desactivado " + user.username : "Activado " + user.username)),

      !baneado &&
        await Meteor.call('sendMensaje', userChange, {
          text: "Ha sido " +
            (!userChange.baneado ? "Desactivado" : "Activado") +
            ` el proxy`
        }, (!userChange.baneado ? "Desactivado " + admin.username : "Activado " + admin.username))

    },
guardarDatosConsumidosByUserPROXYMensual: async (user) => {
    console.log("guardarDatosConsumidosByUserPROXYMensual");

    ////////////CONSUMOS PROXY/////////////   
  
  try{
    const ultimaCompraFecha = await Meteor.call("ultimaCompraByUserId",user._id, "PROXY");

    if (ultimaCompraFecha ) {

    // Encuentra todos los documentos que coincidan con los criterios de búsqueda
    const registrosPROXY = await RegisterDataUsersCollection.find({
      userId: user._id,
      type: "proxy",
      fecha: { $gt: ultimaCompraFecha.createdAt },
      register:"mensual"
    });

    
    // Inicializa una variable para almacenar la sumatoria de megasGastadosinBytes
    let consumidosPROXY = 0;
  
    // Itera sobre los resultados y suma los valores de megasGastadosinBytes
    await registrosPROXY.forEachAsync(registro => {
      consumidosPROXY += registro.megasGastadosinBytes;
    });
  
    //REGISTRAR DATOS CONSUMIDOS EN PROXY
    const proxyMbRestantes = user.megasGastadosinBytes - consumidosPROXY
    
    if (proxyMbRestantes > 0) {
      console.log("Registro Proxy Mensual, megas: " + user.username + " con: " + proxyMbRestantes + "byte, -> " + (proxyMbRestantes / 1024000) + "MB")
      await RegisterDataUsersCollection.insert({
        userId: user._id,
        type: "proxy",
        megasGastadosinBytes: proxyMbRestantes,
        register: "mensual"
      });
    }
    }else{
      console.log(`Revisar el usuario no tiene ultima compra Proxy Mensual, USER: ${user.username ? user.username : user._id}`)
      await RegisterDataUsersCollection.insert({
        userId: user._id,
        type: "proxy",
        megasGastadosinBytes: user.megasGastadosinBytes,
        register:"mensual"
      })
      await Meteor.call("reiniciarConsumoDeDatosPROXY",user);
      await Meteor.call("desactivarUserProxy",user)
    }
    } catch (error) {
      console.log(error)
    }
  }
});
}