import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'
import execute from './Ejecutar'
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

  function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
  }

  console.log("Cargando Métodos...");
  Meteor.methods({
    execute: async function (command) {
      try {
        let result = await execute(command);
        return result
      } catch (error) {
        console.log(error.message);
        return error.message
      }
    },
    getusers: function (filter) {
      return Meteor.users
        .find(filter ? filter : {}, { sort: { vpnip: 1 } })
        .fetch();
    },
    setOnlineVPN: function (id, datachange) {
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
    sendemail: function (user, text, subject) {
      let admin = Meteor.users.findOne({
        _id: user.bloqueadoDesbloqueadoPor,
        "profile.role": "admin",
      });
      // let emails = (admin
      //   ? (admin.emails[0]
      //     ? (admin.emails[0].address
      //       ? ['carlosmbinf9405@icloud.com', admin.emails[0].address]
      //       : ['carlosmbinf9405@icloud.com'])
      //     : ['carlosmbinf9405@icloud.com']
      //   )
      //   : ['carlosmbinf9405@icloud.com'])
      let emails =
        admin &&
          admin.emails[0] &&
          admin.emails[0].address != "carlosmbinf@gmail.com"
          ? user.emails[0] && user.emails[0].address
            ? [
              "carlosmbinf@gmail.com",
              admin.emails[0].address,
              user.emails[0].address,
            ]
            : ["carlosmbinf@gmail.com", admin.emails[0].address]
          : user.emails[0] &&
            user.emails[0].address &&
            user.emails[0].address != "carlosmbinf@gmail.com"
            ? ["carlosmbinf@gmail.com", user.emails[0].address]
            : ["carlosmbinf@gmail.com"];
      require("gmail-send")({
        user: "carlosmbinf@gmail.com",
        pass: "Lastunas@123",
        to: emails,
        subject: subject,
      })(text, (error, result, fullResult) => {
        if (error) console.error(error);
        // console.log(result);
        console.log(fullResult);
      });
    },
    sendMensaje: function (user, text, subject) {
      MensajesCollection.insert({
        from: user.bloqueadoDesbloqueadoPor
          ? user.bloqueadoDesbloqueadoPor
          : Meteor.users.findOne({ username: Array(Meteor.settings.public.administradores)[0][0] })._id,
        to: user._id,
        mensaje: text.text,
      });
      // console.log(text);
    },
    
    insertPelis: async function (pelicula) {
      // console.log(req)
      // console.log(peli)
      //  const insertPeli = async () => {
      let exist = await PelisCollection.findOne({ urlPeli: pelicula.peli });
      let id = exist
        ? exist._id
        : await PelisCollection.insert({
          nombrePeli: pelicula.nombre,
          urlPeli: pelicula.peli,
          urlBackground: pelicula.poster,
          descripcion: pelicula.nombre,
          tamano: 797,
          mostrar: true,
          subtitulo: pelicula.subtitle,
          year: pelicula.year,
        });
      let peli = await PelisCollection.findOne({ _id: id });
      // console.log(peli);
      try {
        var srt2vtt = await require("srt-to-vtt");
        var fs = await require("fs");
        var appRoot = await require("app-root-path");
        var subtituloFile =
          appRoot.path + "/public/videos/subtitulo/" + id + ".vtt";
        const https = await require("https");

        // !fs.existsSync(appRoot.path + "/public/videos/subtitulo")
        //   ? fs.mkdirSync(appRoot.path + "/public/videos/subtitulo/")
        //   : "";

        // const file = fs.createWriteStream(subtituloFile);
        // /////////////////////////////////////////////
        peli &&
          peli.subtitulo &&
          (await https.get(peli.subtitulo, async (response) => {
            try {
              var stream = response.pipe(srt2vtt());
              // stream.on("finish", function () {});
              streamToString(stream).then((data) => {
                data &&
                  PelisCollection.update(
                    { _id: id },
                    {
                      $set: {
                        textSubtitle: data.toString("utf8"),
                      },
                    },
                    { multi: true }
                  );
                console.log(
                  `Actualizado subtitulo de la Peli: ${peli.nombrePeli}`
                );
              });
            } catch (error) {
              console.log(error.message);
            }
          }));

        const imdbId = require("imdb-id");
        const IMDb = require("imdb-light");

        let idimdb = await imdbId(peli.nombrePeli);
        // console.log("ID de IMDB => " + idimdb)

        PelisCollection.update(
          { _id: id },
          {
            $set: {
              idimdb: idimdb,
            },
          },
          { multi: true }
        );

        await IMDb.trailer(idimdb, (url) => {
          // console.log(url)  // output is direct mp4 url (also have expiration timeout)

          PelisCollection.update(
            { _id: id },
            {
              $set: {
                urlTrailer: url,
                // clasificacion: details.Genres.split(", ")
              },
            }
          );
        });

        await IMDb.fetch(idimdb, (details) => {
          // console.log(details)  // etc...
          PelisCollection.update(
            { _id: id },
            {
              $set: {
                descripcion: details.Plot,
                clasificacion: details.Genres.split(", "),
              },
            },
            { multi: true }
          );
        });

        return {
          message: exist
            ? `Actualizada la Pelicula: ${exist.nombrePeli}`
            : "Se Insertó Correctamente la Película",
        };
      } catch (error) {
        console.log("--------------------------------------");
        // console.log("error.error :> " + error.error);
        // console.log("error.reason :> " + error.reason);
        console.log(`error.message :> ${error.message}\n
              error.reason :> ${error.reason}`);
        // console.log("error.errorType :> " + error.errorType);
        console.log("--------------------------------------");

        return {
          reason: error.reason,
          message: error.message,
          errorType: error.type,
        };
      }
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
    addVentasOnly: async (userChangeid, adminId,compra) => {

      ///////REVISAR EN ADDVENTASONLY  el descuento que se debe de hacer
      let userChange = await Meteor.users.findOne(userChangeid)
      // let admin = await Meteor.users.findOne(adminId)
      // let precio = PreciosCollection.findOne(precioid)
      let adminPrincipal = await Meteor.users.findOne({ username: Meteor.settings.public.administradores[0] })

      let precioOficial = await Meteor.call('getPrecioOficial', compra );

      try {
                  
        compra && await VentasCollection.insert({
            adminId: adminId,
            userId: userChangeid,
            precio: precioOficial ? precioOficial.precio : compra.precio,
            gananciasAdmin: precioOficial ? compra.precio - precioOficial.precio : 0,
            comentario: compra.comentario
          })

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
            ? precio = await PreciosCollection.findOne({ type: "fecha-proxy" })
            : precio = await PreciosCollection.findOne({ type: "megas", megas: userChange.megas })


      try {
        if (!userChange.baneado ) {
          await Meteor.call("desabilitarProxyUser", userChangeid, userId)
          return null
        } else if( precio || Array(Meteor.settings.public.administradores)[0].includes(user.username) ){
          await Meteor.call("habilitarProxyUser", userChangeid, userId)


          
            precio && await VentasCollection.insert({
            adminId: userId,
            userId: userChangeid,
            precio: (precio.precio - user.descuentoproxy > 0) ? (precio.precio - user.descuentoproxy) : 0,
            comentario: precio.comentario
          })

        }

        return precio?precio.comentario:`No se encontro Precio a la oferta de Proxy establecida en el usuario: ${userChange.username}`
      } catch (error) {
        return error.message
      }


    },
    desabilitarProxyUser: async (userChangeid, userId) => {

      let userChange = await Meteor.users.findOne(userChangeid)
      let user = await Meteor.users.findOne(userId)

      await Meteor.users.update(userChangeid, {
        $set: {
          baneado: true,
          bloqueadoDesbloqueadoPor: userId
        },
      })
      await LogsCollection.insert({
        type: "Proxy",
        userAfectado: userChangeid,
        userAdmin: userId,
        message:
          "Ha sido Desactivado el proxy por un Admin"
      })
      // Meteor.call('sendemail', userChange, {
      //   text: "Ha sido " +
      //     (!userChange.baneado ? "Desactivado" : "Activado") +
      //     ` el proxy del usuario ${userChange.username}`
      // },
      //  (!userChange.baneado ? "Desactivado " + user.username : "Activado " + user.username)),
      await Meteor.call('sendMensaje', userChange, {
        text: "Ha sido Desactivado el proxy"
      }, ("Desactivado " + user.username))

    },
    habilitarProxyUser: async (userChangeid, userId) => {

      let userChange = await Meteor.users.findOne(userChangeid)
      let user = await Meteor.users.findOne(userId)



      await Meteor.users.update(userChangeid, {
        $set: {
          baneado: userChange.baneado ? false : true,
          bloqueadoDesbloqueadoPor: userId
        },
      })
      await LogsCollection.insert({
        type: "Proxy",
        userAfectado: userChangeid,
        userAdmin: userId,
        message: "Ha sido Activado el proxy por un Admin"
      })
      // Meteor.call('sendemail', userChange, {
      //   text: "Ha sido " +
      //     (!userChange.baneado ? "Desactivado" : "Activado") +
      //     ` el proxy del usuario ${userChange.username}`
      // }, (!userChange.baneado ? "Desactivado " + user.username : "Activado " + user.username)),
      await Meteor.call('sendMensaje', userChange, {
        text: "Ha sido " +
          (!userChange.baneado ? "Desactivado" : "Activado") +
          ` el proxy`
      }, (!userChange.baneado ? "Desactivado " + user.username : "Activado " + user.username))

    },    
    addVentasVPN: async (userChangeid, userId) => {
      let userChange = await Meteor.users.findOne(userChangeid)
      let user = await Meteor.users.findOne(userId)
      // let precio = PreciosCollection.findOne(precioid)
      let precio;

      await userChange.vpnisIlimitado
            ? precio = await PreciosCollection.findOne({ type: "fecha-vpn" })
            : (userChange.vpnplus
              ? precio = await PreciosCollection.findOne({ type: "vpnplus", megas: userChange.vpnmegas })
              : precio = await PreciosCollection.findOne({ type: "vpn2mb", megas: userChange.vpnmegas })
            )

      try {
        if (userChange.vpn) {
          await Meteor.call("desabilitarVPNUser", userChangeid, userId)
          return null
        } else if(precio || Array(Meteor.settings.public.administradores)[0].includes(user.username)){
          await Meteor.call("habilitarVPNUser", userChangeid, userId)

          await VentasCollection.insert({
            adminId: userId,
            userId: userChangeid,
            precio: (precio.precio - user.descuentovpn > 0) ? (precio.precio - user.descuentovpn) : 0,
            comentario: precio.comentario
          })

        }

        return precio?precio.comentario:`No se encontro Precio a la oferta de VPN establecida en el usuario: ${userChange.username}`
        
      } catch (error) {
        return error.message
      }

    },
    desabilitarVPNUser: async (userChangeid, userId) => {

      let userChange = await Meteor.users.findOne(userChangeid)
      let user = await Meteor.users.findOne(userId)


      await Meteor.users.update(userChangeid, {
        $set: {
          vpn: false,
          bloqueadoDesbloqueadoPor: userId
        },
      })
      LogsCollection.insert({
        type: 'VPN',
        userAfectado: userChangeid,
        userAdmin: userId,
        message:
          `Se Desactivó la VPN`
      });
      // Meteor.call('sendemail', userChange, {
      //   text: "Ha sido " +
      //     (!userChange.baneado ? "Desactivado" : "Activado") +
      //     ` el proxy del usuario ${userChange.username}`
      // },
      //  (!userChange.baneado ? "Desactivado " + user.username : "Activado " + user.username)),
      await Meteor.call('sendMensaje', userChange, {
        text: "Ha sido Desactivado el proxy"
      }, ("Desactivado " + user.username))


    },
    habilitarVPNUser: async (userChangeid, userId) => {

      let userChange = await Meteor.users.findOne(userChangeid)
      let user = await Meteor.users.findOne(userId)




      if (userChange.vpn || userChange.vpnplus || userChange.vpn2mb) {


        let nextIp = Meteor.users.findOne({}, { sort: { vpnip: -1 } }) ? Meteor.users.findOne({}, { sort: { vpnip: -1 } }).vpnip : 1

        !userChange.vpnip &&
          Meteor.users.update(userChangeid, {
            $set: {
              vpnip: nextIp + 1
            },
          })
        Meteor.users.update(userChangeid, {
          $set: {
            vpn: true
          },
        });
        LogsCollection.insert({
          type: 'VPN',
          userAfectado: userChangeid,
          userAdmin: userId,
          message:
            `Se Activo la VPN`
        });
        // Meteor.call('sendemail', users, { text: `Se ${!users.vpn ? "Activo" : "Desactivó"} la VPN para el usuario: ${users.username}${users.descuentovpn ? ` Con un descuento de: ${users.descuentovpn}CUP` : ""}` }, `VPN ${user.username}`)
        Meteor.call('sendMensaje', userChange, { text: `Se ${!userChange.vpn ? "Activo" : "Desactivó"} la VPN` }, `VPN ${user.username}`)

      }
      else {
        setMensaje("INFO!!!\nPrimeramente debe seleccionar una oferta de VPN!!!"),
          handleClickOpen()
        // alert("INFO!!!\nPrimeramente debe seleccionar una oferta de VPN!!!")
      }

    }, setConsumoProxy:async (user,status)=>{
      try {
        let count = await Meteor.users.update(
          user ? user : {},
          {
            $set: { contandoProxy: status },
          },
          { multi: true }
        );
        return `Se actualizaron ${count} usuarios`
      } catch (error) {
        return error.message
      }
    },getUrlTriller: (id) => {
      let peli = PelisCollection.findOne(id)
      return peli.urlTrailer?peli.urlTrailer:null;
    }

  });

}