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
    getusers: function (filter) {
      return Meteor.users.find(filter ? filter : {}, { sort: { vpnip: 1 } }).fetch()
    },
    setOnlineVPN: function (id, datachange) {
      return Meteor.users.update(id, { $set: datachange })
    },
    addUser: function (user) {
      try {
        let id = Accounts.createUser(user)
        return id ? "Usuario agregado correctamente!!!" : ""
      } catch (error) {
        return error
      }

    },
    sendemail: function (user, text, subject) {
      let admin = Meteor.users.findOne({ _id: user.bloqueadoDesbloqueadoPor, "profile.role": "admin" })
      // let emails = (admin
      //   ? (admin.emails[0]
      //     ? (admin.emails[0].address
      //       ? ['carlosmbinf9405@icloud.com', admin.emails[0].address]
      //       : ['carlosmbinf9405@icloud.com'])
      //     : ['carlosmbinf9405@icloud.com']
      //   )
      //   : ['carlosmbinf9405@icloud.com'])
      let emails = (admin && admin.emails[0] && admin.emails[0].address != 'carlosmbinf@gmail.com')
        ? ((user.emails[0] && user.emails[0].address)
          ? ['carlosmbinf@gmail.com', admin.emails[0].address, user.emails[0].address]
          : ['carlosmbinf@gmail.com', admin.emails[0].address])
        : ((user.emails[0] && user.emails[0].address && user.emails[0].address != 'carlosmbinf@gmail.com')
          ? ['carlosmbinf@gmail.com', user.emails[0].address]
          : ['carlosmbinf@gmail.com'])
      require('gmail-send')({
        user: 'carlosmbinf@gmail.com',
        pass: 'Lastunas@123',
        to: emails,
        subject: subject
      })(
        text,
        (error, result, fullResult) => {
          if (error) console.error(error);
          // console.log(result);
          console.log(fullResult);
        }
      )


    },
    sendMensaje: function (user, text, subject) {

      MensajesCollection.insert({
        from: user.bloqueadoDesbloqueadoPor
          ? user.bloqueadoDesbloqueadoPor
          : Meteor.users.findOne({ username: "carlosmbinf" })._id,
        to: user._id,
        mensaje: text.text
      });
      // console.log(text);

    },





    insertPelis: async function (pelicula) {


      // console.log(req)
      // console.log(peli)
      //  const insertPeli = async () => {
      let exist = await PelisCollection.findOne({ urlPeli: pelicula.peli })
      let id = exist ? exist._id : await PelisCollection.insert({
        nombrePeli: pelicula.nombre,
        urlPeli: pelicula.peli,
        urlBackground: pelicula.poster,
        descripcion: pelicula.nombre,
        tamano: 797,
        mostrar: true,
        subtitulo: pelicula.subtitle,
        year: pelicula.year
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
        peli && peli.subtitulo && await https.get(peli.subtitulo, async (response) => {
          try {
            var stream = response.pipe(srt2vtt());
            // stream.on("finish", function () {});
            streamToString(stream).then(data => {
              data && PelisCollection.update(
                { _id: id },
                {
                  $set: {
                    textSubtitle: data.toString("utf8"),
                  },
                },
                { multi: true }
              );
              console.log(`Actualizado subtitulo de la Peli: ${peli.nombrePeli}`);
            }
            )
          } catch (error) {
            console.log(error.message)
          }


        });

        const imdbId = require('imdb-id');
        const IMDb = require('imdb-light');

        let idimdb = await imdbId(peli.nombrePeli)
        // console.log("ID de IMDB => " + idimdb)

        PelisCollection.update(
          { _id: id },
          {
            $set: {
              idimdb: idimdb
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
        })

        await IMDb.fetch(idimdb, (details) => {
          // console.log(details)  // etc...
          PelisCollection.update(
            { _id: id },
            {
              $set: {
                descripcion: details.Plot,
                clasificacion: details.Genres.split(", ")
              },
            },
            { multi: true }
          );
        })



        return {
          message: exist?`Actualizada la Pelicula: ${exist.nombrePeli}`:"Se Insertó Correctamente la Película",
        }
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
        }
      }

    }



  });




}