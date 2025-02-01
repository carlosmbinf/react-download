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
  console.log("Cargando Métodos de Ventas...");
  Meteor.methods({
    ultimaCompraByUserId: async (userId, type) => {
      const venta = await VentasCollection.findOneAsync(
        { userId, type },
        { sort: { createdAt: -1 }, limit: 1 }
      );
      return venta ? venta : null;
    },
    actualizarPrecio: async (id, values) => {
      try {
        await VentasCollection.updateAsync(id, {
          $set: {
            precio: values.precio,
            comentario: values.comentario,
            gananciasAdmin: values.ganancias,
          },
        });
        return "Precio Actualizado";
      } catch (error) {
        return error.message;
      }
    },
    getListadosPreciosOficiales: async () => {

      try {
        // let userAdmin = await Meteor.call('getAdminPrincipal');
        return await PreciosCollection.find({}).fetch()
      } catch (error) {
        console.log(error);
      }
    },

    getPrecioOficial: async (compra) => {

      try {
        let adminPrincipal = await Meteor.users.findOneAsync({ username: Meteor.settings.public.administradores[0] })

        let precioOficial = await PreciosCollection.findOneAsync({
          userId: adminPrincipal._id,
          type: compra.type,
          megas: compra.megas
        })

        return precioOficial ? precioOficial : null
      } catch (error) {
        return error.message
      }


    },
    addVentasOnly: async (userChangeid, adminId, compra, type) => {

      ///////REVISAR EN ADDVENTASONLY  el descuento que se debe de hacer
      let userChange = await Meteor.users.findOneAsync(userChangeid)
      // let admin = await Meteor.users.findOneAsync(adminId)
      // let precio = PreciosCollection.findOneAsync(precioid)
      let adminPrincipal = await Meteor.users.findOneAsync({ username: Meteor.settings.public.administradores[0] })

      let precioOficial = await Meteor.call('getPrecioOficial', compra);

      try {

        compra && await VentasCollection.insertAsync({
          adminId: adminId,
          userId: userChangeid,
          precio: precioOficial ? precioOficial.precio : compra.precio,
          gananciasAdmin: precioOficial ? compra.precio - precioOficial.precio : 0,
          comentario: compra.comentario,
          type: type
        })

        Meteor.call('enviarMensajeTelegram', "VENTAS", userChangeid, `Se ha realizado una venta de ${type} a ${userChange.username} por un precio de ${precioOficial ? precioOficial.precio : compra.precio}CUP`,
          compra.comentario)


        return compra ? compra.comentario : `No se encontro Precio a la oferta establecida en el usuario: ${userChange.username}`
      } catch (error) {
        return error.message
      }


    },
    addVentasProxy: async (userChangeid, userId) => {
      let userChange = await Meteor.users.findOneAsync(userChangeid)
      let user = await Meteor.users.findOneAsync(userId)
      // let precio = PreciosCollection.findOneAsync(precioid)
      let precio;

      await userChange.isIlimitado
        ? precio = await PreciosCollection.findOneAsync({ userId: userId, type: "fecha-proxy" })
        : precio = await PreciosCollection.findOneAsync({ userId: userId, type: "megas", megas: userChange.megas })


      try {
        if (!userChange.baneado) {
          await Meteor.call("desabilitarProxyUser", userChangeid, userId)
          return null
        } else if (precio || Array(Meteor.settings.public.administradores)[0].includes(user.username)) {
          await Meteor.call("habilitarProxyUser", userChangeid, userId)
          precio && await Meteor.call("addVentasOnly", userChangeid, userId, precio, "PROXY")

          //   await VentasCollection.insertAsync({
          //   adminId: userId,
          //   userId: userChangeid,
          //   precio: (precio.precio - user.descuentoproxy > 0) ? (precio.precio - user.descuentoproxy) : 0,
          //   comentario: precio.comentario
          // })

        }

        return precio ? precio.comentario : `No se encontro Precio a la oferta de Proxy del usuario: ${userChange.username}`
      } catch (error) {
        return error.message
      }


    },
    //eliminarVenta -- se le pasa el id de la venta
    eliminarVenta: async (id) => {
      try {
        await VentasCollection.removeAsync(id)
        return "Venta Eliminada"
      } catch (error) {
        return error.message
      }

    },
    //changeStatusVenta -- cambia el estado de la venta, se le pasa ID de la venta
    changeStatusVenta: async (id) => {
      let venta = await VentasCollection.findOneAsync(id)
      try {
        await VentasCollection.updateAsync(id, {
          $set: {
            cobradoAlAdmin: true,
            cobrado: !venta.cobrado
          }
        })
        return "Venta Actualizada"
      } catch (error) {
        return error.message
      }
    },
  });
}