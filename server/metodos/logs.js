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
    console.log("Cargando Métodos de Logs...");
    Meteor.methods({
      registrarLog: async (type, userAfectado, userAdmin, message) => {
        try {
          let id = await LogsCollection.insert({
            type: type,
            userAfectado: userAfectado,
            userAdmin: userAdmin,
            message: message,
          });
  
          "Log Registrado con Id: " + id;
  
          Meteor.call("enviarMensajeTelegram", type, userAfectado, message);
        } catch (error) {
          console.log(error);
        }
      }


    });
}