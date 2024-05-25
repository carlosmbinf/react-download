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



    });
}