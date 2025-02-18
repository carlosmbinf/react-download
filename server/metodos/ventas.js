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
      const venta = await VentasCollection.findOne(
        { userId, type },
        { sort: { createdAt: -1 }, limit: 1 }
      );
      return venta ? venta : null;
    },
    actualizarPrecio: async (id, values) => {
      try {
        await VentasCollection.update(id, {
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
        let adminPrincipal = await Meteor.users.findOne({ username: Meteor.settings.public.administradores[0] })

        let precioOficial = await PreciosCollection.findOne({
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
      let userChange = await Meteor.users.findOne(userChangeid)
      // let admin = await Meteor.users.findOne(adminId)
      // let precio = PreciosCollection.findOne(precioid)
      let adminPrincipal = await Meteor.users.findOne({ username: Meteor.settings.public.administradores[0] })
      let admin = await Meteor.users.findOne(adminId)
      let precioOficial = await Meteor.call('getPrecioOficial', compra);

      console.log("Entrando a REALIZAR una COMPRA", `\nuserChange(${userChange?.username})`, `\nadmin(${admin?.username})`, `\ncompra(${JSON.stringify(compra)})`, `\ntype(${type})`)

      try {

        let precio = 0; //es precio en el insert
        let gananciasAdmin = 0; // es gananciasAdmin en el insert

        if(type == "VPN"){
          console.log("es VPN")
          let preciototal = (precioOficial ? precioOficial.precio : compra.precio);
          console.log("preciototal",preciototal);
          let gananciasTotal = (precioOficial ? (compra.precio - precioOficial.precio) : 0);
          console.log("gananciasTotal",gananciasTotal);
          let descuento = (admin.descuentovpn ? admin.descuentovpn : 0);
          console.log("descuento",descuento);
          console.log ("calculo preciototal >= descuento => ",preciototal >= descuento);
          if(preciototal >= descuento) {
            console.log("La compra es mayor al descuento");
            precio = preciototal - descuento;
            gananciasAdmin = Number(gananciasTotal) + Number(descuento);
          }else{
            console.log("La compra es menor al descuento");
            precio = 0;
            gananciasAdmin = Number(gananciasTotal) + Number(preciototal);
          }

        }else{
          console.log("es PROXY")
          let preciototal = (precioOficial ? precioOficial.precio : compra.precio);
          let gananciasTotal = (precioOficial ? (compra.precio - precioOficial.precio) : 0);
          let descuento = (admin.descuentoproxy ? admin.descuentoproxy : 0);
          console.log ("calculo preciototal >= descuento => ",preciototal >= descuento)
          if(preciototal >= descuento) {
            console.log("La compra es mayor al descuento")
            precio = preciototal - descuento;
            gananciasAdmin = Number(gananciasTotal) + Number(descuento)
          }else{
            console.log("La compra es menor al descuento")
            precio = 0
            gananciasAdmin = Number(gananciasTotal) + Number(preciototal)
          }

        }
        console.log("precio", precio)
        console.log("gananciasAdmin", gananciasAdmin)

        compra && await VentasCollection.insert({
          adminId: adminId,
          userId: userChangeid,
          precio: precio,
          gananciasAdmin: gananciasAdmin,
          comentario: compra.comentario,
          type: type
        })

        await Meteor.call('enviarMensajeTelegram', "VENTAS", userChangeid, `Se ha realizado una venta de ${type} a ${userChange.username} por un precio de ${precioOficial ? precioOficial.precio : compra.precio}CUP`,
          compra.comentario)


        return compra ? compra.comentario : `No se encontro Precio a la oferta establecida en el usuario: ${userChange.username}`
      } catch (error) {
        return error.message
      }


    },
    addVentasProxy: async (userChangeid, userId) => {
      let userChange = await Meteor.users.findOne(userChangeid)
      let user = await Meteor.users.findOne(userId)
      // let precio = PreciosCollection.findOne(precioid)
      let precio;

      await userChange.isIlimitado
        ? precio = await PreciosCollection.findOne({ userId: userId, type: "fecha-proxy" })
        : precio = await PreciosCollection.findOne({ userId: userId, type: "megas", megas: userChange.megas })


      try {
        if (!userChange.baneado) {
          await Meteor.call("desabilitarProxyUser", userChangeid, userId)
          return null
        } else if (precio || Array(Meteor.settings.public.administradores)[0].includes(user.username)) {
          precio && await Meteor.call("addVentasOnly", userChangeid, userId, precio, "PROXY")
          await Meteor.call("habilitarProxyUser", userChangeid, userId)

          //   await VentasCollection.insert({
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
        await VentasCollection.remove(id)
        return "Venta Eliminada"
      } catch (error) {
        return error.message
      }

    },
    //changeStatusVenta -- cambia el estado de la venta, se le pasa ID de la venta
    changeStatusVenta: async (id) => {
      let venta = await VentasCollection.findOne(id)
      try {
        await VentasCollection.update(id, {
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