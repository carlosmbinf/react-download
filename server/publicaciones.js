import { Meteor } from "meteor/meteor";
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
  } from "../imports/ui/pages/collections/collections";

if (Meteor.isServer) {
    console.log("Cargando Publicaciones...");


    Meteor.publish("logs", function (selector,option) {
        return LogsCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("logsId", function (id) {
        return LogsCollection.find({ userAfectado: id });
      });
      Meteor.publish("registerDataUser", function (selector,option) {
        return RegisterDataUsersCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("registerDataUserId", function (id) {
        return RegisterDataUsersCollection.find({ userAfectado: id });
      });
      Meteor.publish("pelis", function (selector,option) {
        return PelisCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("peli", function (id) {
        return PelisCollection.find({ _id: id });
      });
      Meteor.publish("tvs", function (selector,option) {
        return TVCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("tv", function (id) {
        return TVCollection.find({ _id: id });
      });
      Meteor.publish("descargas", function (selector,option) {
        return DescargasCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("descarga", function (id) {
        return DescargasCollection.find({ _id: id });
      });
      Meteor.publish("user", function (selector,option) {
        return Meteor.users.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("userID", function (id) {
        return Meteor.users.find({ _id: id });
      });
      Meteor.publish("userRole", function (role) {
        return Meteor.users.find({ "profile.role": role });
      });
      Meteor.publish("conexionesUser", function (id) {
        return OnlineCollection.find({ userId: id });
      });
      Meteor.publish("conexiones", function (selector,option) {
        return OnlineCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("mensajes", function (selector,option) {
        return MensajesCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("server", function (id) {
        return ServersCollection.find(id);
      });
      Meteor.publish("servers", function (selector,option) {
        return ServersCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("precios", function (selector,option) {
        return PreciosCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("ventas", function (selector,option) {
        return VentasCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("files", function (selector,option) {
        return FilesCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("versions", function (selector,option) {
        return VersionsCollection.find(selector?selector:{},option?option:{});
      });
}