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
import moment from "moment";

if (Meteor.isServer) {
  console.log("Cargando Métodos...");
  function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
  }

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
              await streamToString(stream).then( async (data) => {
                data &&
                  await PelisCollection.update(
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


          var nameToImdb = require("name-to-imdb");
          const IMDb = require('imdb-light');


          console.log("Nombre Peli: " + peli.nombrePeli)
          var idimdb;
        await nameToImdb({ name: pelicula.nombre, year: pelicula.year }, async (err, res, inf) => {
            err && console.log(`err IMDB de ${pelicula.nombre} =>  ${err}`)
             await console.log(`id IMDB de ${pelicula.nombre} =>  ${res}`); // "tt0121955"
              // inf contains info on where we matched that name - e.g. metadata, or on imdb
              // and the meta object with all the available data
              await console.log(`info IMDB de ${pelicula.nombre} =>  ${inf}`);
              idimdb = res && res;
          })

        //////ACTUALIZANDO IDIMDB EN PELI
        try {
          console.log(`Update IDIMDB - Nombre Peli: ${peli.nombrePeli}`)
          idimdb && await PelisCollection.update(
            { _id: id },
            {
              $set: {
                idimdb: idimdb,
              },
            },
            { multi: true }
          );
        } catch (error) {
          console.log(error.message);
        }




        /////////ACTUALIZANDO TRILERS
        try {
          console.log(`Update urlTrailer - Nombre Peli: ${peli.nombrePeli}`)
          idimdb && await IMDb.trailer(idimdb, async (url) => {
            // console.log(url)  // output is direct mp4 url (also have expiration timeout)

           await PelisCollection.update(
              { _id: id },
              {
                $set: {
                  urlTrailer: url,
                  // clasificacion: details.Genres.split(", ")
                },
              }
            );
          });
        } catch (error) {
          console.log(error.message);
        }


        //////ACTUALIZANDO CLASIFICACION
        console.log(`Update descripcion y clasificacion - Nombre Peli: ${peli.nombrePeli}`)
        try {
          idimdb && await IMDb.fetch(idimdb,async (details) => {
            // console.log(details)  // etc...
            await PelisCollection.update(
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
        } catch (error) {
          console.log(error.message);
        }


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
    getListadosPreciosOficiales: async () => {

      try {
        // let userAdmin = await Meteor.call('getAdminPrincipal');
        return await PreciosCollection.find({}).fetch()
      } catch (error) {
        console.log(error);
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
    addVentasOnly: async (userChangeid, adminId, compra,type) => {

      ///////REVISAR EN ADDVENTASONLY  el descuento que se debe de hacer
      let userChange = await Meteor.users.findOne(userChangeid)
      // let admin = await Meteor.users.findOne(adminId)
      // let precio = PreciosCollection.findOne(precioid)
      let adminPrincipal = await Meteor.users.findOne({ username: Meteor.settings.public.administradores[0] })

      let precioOficial = await Meteor.call('getPrecioOficial', compra);

      try {

        compra && await VentasCollection.insert({
          adminId: adminId,
          userId: userChangeid,
          precio: precioOficial ? precioOficial.precio : compra.precio,
          gananciasAdmin: precioOficial ? compra.precio - precioOficial.precio : 0,
          comentario: compra.comentario,
          type:type
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
        ? precio = await PreciosCollection.findOne({ userId: userId, type: "fecha-proxy" })
        : precio = await PreciosCollection.findOne({ userId: userId, type: "megas", megas: userChange.megas })


      try {
        if (!userChange.baneado) {
          await Meteor.call("desabilitarProxyUser", userChangeid, userId)
          return null
        } else if (precio || Array(Meteor.settings.public.administradores)[0].includes(user.username)) {
          await Meteor.call("habilitarProxyUser", userChangeid, userId)
          precio && await Meteor.call("addVentasOnly", userChangeid, userId, precio, "PROXY")

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
        await LogsCollection.insert({
          type: "Proxy",
          userAfectado: userChange._id,
          userAdmin: admin._id,
          message: "Ha sido Activado el proxy por un Admin"
        })
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
        await LogsCollection.insert({
          type: "Proxy",
          userAfectado: userChange._id,
          userAdmin: admin._id,
          message: "Ha sido Desactivado el proxy por un Admin"
        })
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
    addVentasVPN: async (userChangeid, userId) => {
      let userChange = await Meteor.users.findOne(userChangeid)
      let user = await Meteor.users.findOne(userId)
      // let precio = PreciosCollection.findOne(precioid)
      let precio;

      await userChange.vpnisIlimitado
        ? precio = await PreciosCollection.findOne({ userId: userId, type: "fecha-vpn" })
        : (userChange.vpnplus
          ? precio = await PreciosCollection.findOne({ userId: userId, type: "vpnplus", megas: userChange.vpnmegas })
          : precio = await PreciosCollection.findOne({ userId: userId, type: "vpn2mb", megas: userChange.vpnmegas })
        )

      try {
        if (userChange.vpn) {
          await Meteor.call("desabilitarVPNUser", userChangeid, userId)
          return null
        } else if (precio || Array(Meteor.settings.public.administradores)[0].includes(user.username)) {
          await Meteor.call("habilitarVPNUser", userChangeid, userId)

          precio && await Meteor.call("addVentasOnly", userChangeid, userId, precio, "VPN")
          // VentasCollection.insert({
          //   adminId: userId,
          //   userId: userChangeid,
          //   precio: (precio.precio - user.descuentovpn > 0) ? (precio.precio - user.descuentovpn) : 0,
          //   comentario: precio.comentario
          // })

        }

        return precio ? precio.comentario : `No se encontro Precio a la oferta de VPN del usuario: ${userChange.username}`

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

    }, setConsumoProxy: async (user, status) => {
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
    }, getUrlTriller: (id) => {
      let peli = PelisCollection.findOne(id)
      return peli.urlTrailer ? peli.urlTrailer : null;
    },
    ultimaCompraByUserId : async (userId, type) => {
      const venta = await VentasCollection.findOne({ userId, type }, { sort: { createdAt: -1 }, limit: 1 });
      return venta?venta:null;
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
    },
    guardarDatosConsumidosByUserVPNMensual : async (user) => {
      console.log("guardarDatosConsumidosByUserVPNMensual");
    
      ///////CONSUMO VPN
    try{
      const ultimaCompraFechaVPN = await Meteor.call("ultimaCompraByUserId",user._id, "VPN");

      if (ultimaCompraFechaVPN ) {

      // Encuentra todos los documentos que coincidan con los criterios de búsqueda
      const registrosVPN = await RegisterDataUsersCollection.find({
        userId: user._id,
        type: "vpn",
        fecha: { $gt: ultimaCompraFechaVPN.createdAt },
        register:"mensual"
      });
    
      // Inicializa una variable para almacenar la sumatoria de vpnMbGastados
      let consumidosVPN = 0;
    
      // Itera sobre los resultados y suma los valores de vpnMbGastados
      await registrosVPN.forEach(registro => {
        consumidosVPN += registro.vpnMbGastados;
      });
    
    
      //REGISTRAR DATOS CONSUMIDOS EN VPN
      // Calcular el total de vpnMbGastados restantes y actualizar la colección
      const vpnMbRestantes =  user.vpnMbGastados - consumidosVPN;
     
      if (vpnMbRestantes > 0) {
        console.log("Registro VPN Mensual, megas: " + user.username + " con: " + vpnMbRestantes + "byte, -> " + (vpnMbRestantes / 1024 / 1024) + "MB")
        await RegisterDataUsersCollection.insert({
          userId: user._id,
          type: "vpn",
          vpnMbGastados: vpnMbRestantes,
          register:"mensual"
        });
      }
    }else{
      console.log(`Revisar el usuario no tiene ultima compra VPN Mensual, USER: ${user.username ? user.username : user._id}`)
      await RegisterDataUsersCollection.insert({
        userId: user._id,
        type: "vpn",
        vpnMbGastados: user.vpnMbGastados,
        register:"mensual"
      })
      await Meteor.call("reiniciarConsumoDeDatosVPN",user)
      await Meteor.call("desactivarUserVPN",user)
    }
    } catch (error) {
      console.log(error)
    }
    },
    guardarDatosConsumidosByUserPROXYHoras: async (user) => {
      ////////////CONSUMOS PROXY/////////////   
    
    try{
      const ultimaCompraFecha = await Meteor.call("ultimaCompraByUserId",user._id, "PROXY");

      if (ultimaCompraFecha ) {

      // Encuentra todos los documentos que coincidan con los criterios de búsqueda
      const registrosPROXY = await RegisterDataUsersCollection.find({
        userId: user._id,
        type: "proxy",
        fecha: { $gt: ultimaCompraFecha.createdAt }
      });

      // Inicializa una variable para almacenar la sumatoria de megasGastadosinBytes
      let consumidosPROXY = 0;
    
      // Itera sobre los resultados y suma los valores de megasGastadosinBytes
      await registrosPROXY.forEachAsync(registro => {
        consumidosPROXY += registro.megasGastadosinBytes;
      });
      
    
      //REGISTRAR DATOS CONSUMIDOS EN PROXY
      const proxyMbRestantes = user.megasGastadosinBytes - consumidosPROXY;
     
      if (proxyMbRestantes > 0) {
        console.log("Registro Proxy Horas, megas: " + user.username + " con: " + proxyMbRestantes + "byte, -> " + (proxyMbRestantes / 1024 / 1024) + "MB")
        await RegisterDataUsersCollection.insert({
          userId: user._id,
          type: "proxy",
          megasGastadosinBytes: proxyMbRestantes,
          register:"hora"
        });}
      }else{
        console.log(`Revisar el usuario no tiene ultima compra Proxy Diario, USER: ${user.username ? user.username : user._id}`)
        await RegisterDataUsersCollection.insert({
          userId: user._id,
          type: "proxy",
          megasGastadosinBytes: user.megasGastadosinBytes,
          register:"hora"
        })
        await Meteor.call("reiniciarConsumoDeDatosPROXY",user)
        await Meteor.call("desactivarUserProxy",user)
      }
      } catch (error) {
        console.log(error)
      }
    },
    guardarDatosConsumidosByUserVPNHoras : async (user) => {

      try {
        ///////CONSUMO VPN
        const ultimaCompraFechaVPN = await Meteor.call("ultimaCompraByUserId",user._id, "VPN");
  
        if (ultimaCompraFechaVPN ) {
  
        // Encuentra todos los documentos que coincidan con los criterios de búsqueda
        const registrosVPN = await RegisterDataUsersCollection.find({
          userId: user._id,
          type: "vpn",
          fecha: { $gt: ultimaCompraFechaVPN.createdAt }
        });
        // Inicializa una variable para almacenar la sumatoria de vpnMbGastados
        let consumidosVPN = 0;
      
        // Itera sobre los resultados y suma los valores de vpnMbGastados
        await registrosVPN.forEach(registro => {
          consumidosVPN += registro.vpnMbGastados;
        });
      
        //REGISTRAR DATOS CONSUMIDOS EN VPN
        // Calcular el total de vpnMbGastados restantes y actualizar la colección
        const vpnMbRestantes = user.vpnMbGastados - consumidosVPN;
       
        if (vpnMbRestantes > 0) {
          console.log("Registro VPN Hora, megas: " + user.username + " con: " + vpnMbRestantes  + "byte, -> " + (vpnMbRestantes / 1024 / 1024) + "MB")
          await RegisterDataUsersCollection.insert({
            userId: user._id,
            type: "vpn",
            vpnMbGastados: vpnMbRestantes,
            register:"hora"
          });
        }
      }else{
        console.log(`Revisar el usuario no tiene ultima compra VPN Diario, USER: ${user.username ? user.username : user._id}`)
        await RegisterDataUsersCollection.insert({
          userId: user._id,
          type: "vpn",
          vpnMbGastados: user.vpnMbGastados,
          register:"hora"
        })
        await Meteor.call("reiniciarConsumoDeDatosVPN",user)
        await Meteor.call("desactivarUserVPN",user)
      }
      } catch (error) {
        console.log(error)
      }
        
      },
    guardarDatosConsumidosByUserPROXYDiario: async (user) => {
      ////////////CONSUMOS PROXY/////////////   
    
    try{
      const ultimaCompraFecha = await Meteor.call("ultimaCompraByUserId",user._id, "PROXY");

      if (ultimaCompraFecha ) {

      // Encuentra todos los documentos que coincidan con los criterios de búsqueda
      const registrosPROXY = await RegisterDataUsersCollection.find({
        userId: user._id,
        type: "proxy",
        fecha: { $gt: ultimaCompraFecha.createdAt },
        register:"diario"
      });

      // Inicializa una variable para almacenar la sumatoria de megasGastadosinBytes
      let consumidosPROXY = 0;
    
      // Itera sobre los resultados y suma los valores de megasGastadosinBytes
      await registrosPROXY.forEachAsync(registro => {
        consumidosPROXY += registro.megasGastadosinBytes;
      });
      
    
      //REGISTRAR DATOS CONSUMIDOS EN PROXY
      const proxyMbRestantes = user.megasGastadosinBytes - consumidosPROXY;
     
      if (proxyMbRestantes > 0) {
        console.log("Registro Proxy Diario, megas: " + user.username + " con: " + proxyMbRestantes + "byte, -> " + (proxyMbRestantes / 1024 / 1024) + "MB")
        await RegisterDataUsersCollection.insert({
          userId: user._id,
          type: "proxy",
          megasGastadosinBytes: proxyMbRestantes,
          register:"diario"
        });}
      }else{
        console.log(`Revisar el usuario no tiene ultima compra Proxy Diario, USER: ${user.username ? user.username : user._id}`)
        await RegisterDataUsersCollection.insert({
          userId: user._id,
          type: "proxy",
          megasGastadosinBytes: user.megasGastadosinBytes,
          register:"diario"
        })
        await Meteor.call("reiniciarConsumoDeDatosPROXY",user)
        await Meteor.call("desactivarUserProxy",user)
      }
      } catch (error) {
        console.log(error)
      }
    },
    guardarDatosConsumidosByUserVPNDiario : async (user) => {

    try {
      ///////CONSUMO VPN
      const ultimaCompraFechaVPN = await Meteor.call("ultimaCompraByUserId",user._id, "VPN");

      if (ultimaCompraFechaVPN ) {

      // Encuentra todos los documentos que coincidan con los criterios de búsqueda
      const registrosVPN = await RegisterDataUsersCollection.find({
        userId: user._id,
        type: "vpn",
        fecha: { $gt: ultimaCompraFechaVPN.createdAt },
        register:"diario"
      });
      // Inicializa una variable para almacenar la sumatoria de vpnMbGastados
      let consumidosVPN = 0;
    
      // Itera sobre los resultados y suma los valores de vpnMbGastados
      await registrosVPN.forEach(registro => {
        consumidosVPN += registro.vpnMbGastados;
      });
    
      //REGISTRAR DATOS CONSUMIDOS EN VPN
      // Calcular el total de vpnMbGastados restantes y actualizar la colección
      const vpnMbRestantes = user.vpnMbGastados - consumidosVPN;
     
      if (vpnMbRestantes > 0) {
        console.log("Registro VPN Diario, megas: " + user.username + " con: " + vpnMbRestantes  + "byte, -> " + (vpnMbRestantes / 1024 / 1024) + "MB")
        await RegisterDataUsersCollection.insert({
          userId: user._id,
          type: "vpn",
          vpnMbGastados: vpnMbRestantes,
          register:"diario"
        });
      }
    }else{
      console.log(`Revisar el usuario no tiene ultima compra VPN Diario, USER: ${user.username ? user.username : user._id}`)
      await RegisterDataUsersCollection.insert({
        userId: user._id,
        type: "vpn",
        vpnMbGastados: user.vpnMbGastados,
        register:"diario"
      })
      await Meteor.call("reiniciarConsumoDeDatosVPN",user)
      await Meteor.call("desactivarUserVPN",user)
    }
    } catch (error) {
      console.log(error)
    }
      
    },
    reiniciarConsumoDeDatosVPN : async (user) => {
      console.log(`reiniciarConsumoDeDatosVPN user: ${user}`)
      /////////////Dejar en cero el consumo de los usuarios
      await Meteor.users.update(user._id, {
        $set: {
          vpnMbGastados: 0
        },
      });
    },
    reiniciarConsumoDeDatosPROXY : async (user) => {
      console.log(`reiniciarConsumoDeDatosPROXY user: ${user}`)
      /////////////Dejar en cero el consumo de los usuarios
      await Meteor.users.update(user._id, {
        $set: {
          megasGastadosinBytes: 0,
          megasGastadosinBytesGeneral: 0
        },
      });
    },
    desactivarUserProxy : async (user) => {
      console.log(`desactivarUserProxy user: ${user}`)
      /////////////Dejar en cero el consumo de los usuarios
      await Meteor.users.update(user._id, {
        $set: {
          baneado: true
        },
      });
    },
    desactivarUserVPN : async (user) => {
      console.log(`desactivarUserVPN user: ${user}`)
      /////////////Dejar en cero el consumo de los usuarios
      await Meteor.users.update(user._id, {
        $set: {
          vpn: false
        },
      });
    },
    getDatosDashboardByUser: async (tipoDeDashboard, idUser) => {
      //tipoDeDashboard = "DIARIO" || "MENSUAL" || "HORA"


      const aporte = (type, fechaStart, fechaEnd) => {
        let totalConsumo = 0;
        let fechaInicial = new Date(fechaStart)
        let fechaFinal = new Date(fechaEnd)


        const consumo = RegisterDataUsersCollection.find((idUser ? {
          userId: idUser, fecha: {
            $gte: fechaInicial,
            $lt: fechaFinal
          }
        } : {
          fecha: {
            $gte: fechaInicial,
            $lt: fechaFinal
          }
        }), {
          fields: {
            userId: 1,
            megasGastadosinBytes: 1,
            fecha: 1,
            type: 1,
            vpnMbGastados: 1
          }
        }).fetch()
        
        consumo.forEach((element) => {
          let fechaElement = new Date(element.fecha)

         if (element.type == type) {
          let suma
          switch (element.type) {
            case "proxy":
              suma = (element.megasGastadosinBytes ? element.megasGastadosinBytes : 0)
              break;
            case "vpn":
              suma = (element.vpnMbGastados ? element.vpnMbGastados : 0)
            default:
              break;
          }

         fechaElement >= fechaInicial && fechaElement < fechaFinal &&
           (totalConsumo += suma)

       }
        })

        return Number((totalConsumo / 1024000000).toFixed(2))
      }

        let data01 = [];
        if (tipoDeDashboard == "HORA") {
          let dateStartDay = moment(new Date()).startOf('day');
          let dateEndDay = moment(new Date()).endOf('day');

          for (let hour = 0; hour < 24; hour++) {
            let dateStartHour = moment(dateStartDay).hour(hour).startOf('hour');
            let dateEndHour = moment(dateStartDay).hour(hour).endOf('hour');

            let hourlyData = {
              name: dateStartHour.format("HH:mm"),
              PROXY: aporte("proxy", dateStartHour.toISOString(), dateEndHour.toISOString()),
              VPN: aporte("vpn", dateStartHour.toISOString(), dateEndHour.toISOString())
            };

            data01.push(hourlyData);
          }
        } else if (tipoDeDashboard == "DIARIO") {
          let dateStartMonth = moment(new Date()).startOf('month');
          let daysInMonth = dateStartMonth.daysInMonth();


          for (let day = 1; day <= daysInMonth; day++) {
            let dateStartDay = moment(dateStartMonth).date(day).startOf('day');
            let dateEndDay = moment(dateStartMonth).date(day).endOf('day');

            let dailyData = {
              name: dateStartDay.format("DD"),
              PROXY: aporte("proxy", dateStartDay.toISOString(), dateEndDay.toISOString()),
              VPN: aporte("vpn", dateStartDay.toISOString(), dateEndDay.toISOString())
            };

            data01.push(dailyData);
          }
        } else if (tipoDeDashboard == "MENSUAL") {
          for (let month = 11; month >= 0; month--) {
            let dateStartMonth = moment(new Date()).startOf('month').subtract(month, 'months').add(1, 'days');
            let daysInMonth = dateStartMonth.daysInMonth();

            let monthlyData = {
              name: dateStartMonth.format("MM/YYYY"),
              PROXY: aporte("proxy", dateStartMonth.toISOString(), moment(dateStartMonth).endOf('month').add(1, 'days').toISOString()),
              VPN: aporte("vpn", dateStartMonth.toISOString(), moment(dateStartMonth).endOf('month').add(1, 'days').toISOString())
            };

            data01.push(monthlyData);
          }
        }

        return data01;
    },
    actualizarPrecio: async (id,values) => {
      try {
        await VentasCollection.update(id, {
          $set: {
            precio: values.precio,
            comentario: values.comentario,
            gananciasAdmin: values.ganancias
          },
        });
        return "Precio Actualizado"
      } catch (error) {
        return error.message
      }
    }
    

  });

}