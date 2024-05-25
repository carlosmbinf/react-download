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
      console.log("Registro Proxy Mensual, megas: " + user.username + " con: " + proxyMbRestantes + "byte, -> " + (proxyMbRestantes / 1024 / 1024) + "MB")
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