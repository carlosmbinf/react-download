
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
    const  streamToString = (stream) => {
        const chunks = [];
        return new Promise((resolve, reject) => {
          stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          stream.on('error', (err) => reject(err));
          stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        })
      }
    console.log("Cargando Métodos de peliculas...");
    Meteor.methods({
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
                            await streamToString(stream).then(async (data) => {
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
                    idimdb && await IMDb.fetch(idimdb, async (details) => {
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
        getUrlTriller: (id) => {
            let peli = PelisCollection.findOne(id)
            return peli.urlTrailer ? peli.urlTrailer : null;
        },
    });
}
