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
    console.log("Cargando Métodos de usuarios...");
    Meteor.methods({
        addUser: function (user) {
            try {
              let id = Accounts.createUser(user);
              return id ? "Usuario agregado correctamente!!!" : "";
            } catch (error) {
              return error;
            }
          },
          getusers: function (filter) {
            return Meteor.users
              .find(filter ? filter : {}, { sort: { vpnip: 1 } })
              .fetch();
          },
          getusersAll: function (filter,option) {
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
              let adminPrincipal = await Meteor.users.findOne({ username: Meteor.settings.public.administradores[0] })
              return adminPrincipal ? adminPrincipal : null
            } catch (error) {
              return error.message
            }
      
      
          },
          guardarDatosConsumidosByUserHoras : async (user) => {
            console.log(`Consumo Horas - DATE: ${new Date()}, USER: ${user.username ? user.username : user._id}`);
              
            user.megasGastadosinBytes > 0 && await Meteor.call("guardarDatosConsumidosByUserPROXYHoras",user)
            user.vpnMbGastados > 0 && await Meteor.call("guardarDatosConsumidosByUserVPNHoras",user)
          },
          guardarDatosConsumidosByUserDiario : async (user) => {
          console.log(`Reiniciar Consumo Diario - DATE: ${new Date()}, USER: ${user.username ? user.username : user._id}`);
            
          user.megasGastadosinBytes > 0 && await Meteor.call("guardarDatosConsumidosByUserPROXYDiario",user)
          user.vpnMbGastados > 0 && await Meteor.call("guardarDatosConsumidosByUserVPNDiario",user)
            
          },
          guardarDatosConsumidosByUserMensual : async (user) => {
          console.log(`Reiniciar Consumo Mensual - DATE: ${new Date()}, USER: ${user.username ? user.username : user._id}`);
          user.megasGastadosinBytes > 0 && await Meteor.call("guardarDatosConsumidosByUserPROXYMensual",user)
          user.vpnMbGastados > 0 && await Meteor.call("guardarDatosConsumidosByUserVPNMensual",user)
          },
    });
};