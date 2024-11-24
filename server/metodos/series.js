import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
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
  RegisterDataUsersCollection,
  CapitulosCollection,
  SeriesCollection,
  TemporadasCollection,
} from "/imports/ui/pages/collections/collections";
import moment from "moment";
import { log } from "console";

if (Meteor.isServer) {
  const got = require("got");
  const htmlUrls = require("html-urls");

  const streamToString = (stream) => {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on("error", (err) => reject(err));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
  };

  function parseFilename(filename) {
    // console.log("parseFilename: ", filename);
    // Expresión regular para detectar S01E01, [S01.E01], S01.E01
    const match = filename.split("/").pop().match(/(?:[sS](\d{2})[eE](\d{3}))|(?:[sS](\d{2})[eE](\d{2}))|(?:sS(\d{2})[.\-Ee](\d{2}))|(?:\S(\d{2})E(\d{2}))|(?:\S(\d{2}).E(\d{2}))|(?:(\d{2})[xX](\d{2}))|(?:(\d{1})[xX](\d{2}))|(?:(\d{1})[xX](\d{1}))/);
    

    if (match) {
      const season = parseInt(match[3] || match[5] || match[7] || match[9] || match[11] || match[13] || match[15], 10);
      const episode = parseInt(match[4] || match[6] || match[8] || match[10] || match[12] || match[14] || match[16], 10);

      if(Number.isNaN(season)){
        log("match fallido: ", match);
        log("filename fallido: ", filename);
      }

      return { season, episode };
    }else{
      log("match fallido para: ", filename);
    }
  
    return null;
  }

function extractSeriesName(filename) {
    const match = filename.match(/.*\/(.*?)[sS]\d{2}[eE]\d{2}/);
    if (match) {
        let seriesName = match[1]
            .replace(/%20/g, ' ') // Reemplazar %20 con espacios
            .replace(/\./g, ' ') // Reemplazar puntos con espacios
            .trim() // Quitar espacios en los extremos
            .replace(/\b\w/g, first => first.toUpperCase()); // Capitalizar primera letra de cada palabra

        return seriesName;
    }
    return null;
}

function formatSeriesName(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function groupFilesByEpisode(fileList,seriesName) {
  const groupedFiles = {};

  fileList.forEach((file) => {
    let filename = file.url;
    const parsed = parseFilename(filename);
    if (parsed) {
      const { season, episode } = parsed;
      const key = `S${season.toString().padStart(2, "0")}E${episode
        .toString()
        .padStart(2, "0")}`;
      // const seriesName = formatSeriesName(
      //   extractSeriesName(filename).toLowerCase()
      // );
      // console.log("seriesName: ", seriesName);
      if (!groupedFiles[key]) {
        groupedFiles[key] = {
          seriesName: seriesName,
          thumb: null,
          video: null,
          nfo: null,
          srt: null,
          capitulo: episode,
          temporada: season,
          extension: null,	
        };
      }

      if (filename.endsWith(".jpg")) {
        groupedFiles[key].thumb = filename;
      } else if (
        filename.endsWith(".mkv") ||
        filename.endsWith(".mp4") ||
        filename.endsWith(".avi")
      ) {
        groupedFiles[key].video = filename;

        //especificar la extencion del video  
        groupedFiles[key].extension = filename.split('.').pop();
      } else if (filename.endsWith(".nfo")) {
        groupedFiles[key].nfo = filename;
      } else if (filename.endsWith(".srt")) {
        groupedFiles[key].srt = filename;
      }
    }
  });

  for (let key in groupedFiles) {
    if (!groupedFiles[key].video) {
      delete groupedFiles[key];
    }
  }

  // log("groupFilesByEpisode: ", groupedFiles);


  return groupedFiles;
}

  function eliminarNombreArchivo(url) {
    // Encuentra la última barra diagonal (/) en la URL
    const lastIndex = url.lastIndexOf("/");

    // Si no se encuentra la barra diagonal, devuelve la URL original
    if (lastIndex === -1) {
      return url;
    }

    // Obtiene la subcadena de la URL desde el inicio hasta la posición de la última barra diagonal
    const nuevaUrl = url.substring(0, lastIndex + 1); // +1 para incluir la barra diagonal

    return nuevaUrl;
  }

  console.log("Cargando Métodos de series...");
  Meteor.methods({
    insertSeriesByTemporadasURL: async function ({ urlSerie, year, seriesName }) {
      console.log("insertSeriesByTemporadasURL " + urlSerie);

      if (!urlSerie)
        throw new TypeError("Need to provide an url as first argument.");
      const { body: html } = await got(urlSerie);
      const links = await htmlUrls({ html, url: urlSerie });

      let series = await groupFilesByEpisode(links,seriesName);

      if (typeof series !== "object" || series === null) {
        console.error("El parámetro series no es un objeto válido:", series);
        return;
      }

      // Obtén las claves (S02E01, S02E02, ...) del objeto series
      const keys = Object.keys(series);

      // Itera sobre las claves y procesa cada serie
      keys.forEach((key) => {
        const element = series[key];
        // Aquí puedes realizar operaciones con cada serie individualmente
        console.log(`Procesando serie ${key}:`, element);

        let serieData = {
          nombre: element.seriesName,
          nombreCapitulo:
            element.seriesName +
            " S" +
            element.temporada.toString().padStart(2, "0") +
            "E" +
            element.capitulo.toString().padStart(2, "0"),
          url: element.video,
          poster: element.thumb,
          subtitle: element.srt,
          year: year,
          temporada: element.temporada,
          capitulo: element.capitulo,
          extension: element.extension,
        };
        Meteor.call("insertSeries", serieData);
      });
    },
    insertSeries: async function (serieArg) {
      // console.log(req)
      // console.log(peli)
      //  const insertPeli = async () => {
      //picar la url para quitar el nombre de la peli, ejemplo https://www.vidkar.com:3005/Peliculas/Extranjeras/2021/2021_The_Father_(2021).mkv, quitar el 2021_The_Father_(2021).mkv

      let capitulo = null;
      let temporada = null;
      let serie = null;

      let exist = await CapitulosCollection.findOne({ url: serieArg.url });
      let id = null;
      if (exist) {
        console.log(
          `El Capitulo ${serieArg.nombre} - ${serieArg.capitulo} ya existe`
        );
        id = exist._id;
      } else {
        console.log(
          `El Capitulo ${serieArg.nombre} - ${serieArg.capitulo} no existe, agregandola...`
        );

        serie = SeriesCollection.findOne({ nombre: serieArg.nombre });
        let idSerie = serie
          ? serie._id
          : await SeriesCollection.insert({
              nombre: serieArg.nombre,
              urlBackground: serieArg.poster,
              anoLanzamiento: serieArg.year,
              descripcion: serieArg.nombre,
              mostrar: serieArg.mostrar,
            });
        temporada = TemporadasCollection.findOne({
          idSerie: idSerie,
          numeroTemporada: serieArg.temporada,
        });
        let idTemporada = temporada
          ? temporada._id
          : await TemporadasCollection.insert({
              idSerie: idSerie,
              numeroTemporada: serieArg.temporada,
              url: eliminarNombreArchivo(serieArg.url),
            });

        id = await CapitulosCollection.insert({
          nombre: serieArg.nombreCapitulo,
          url: serieArg.url,
          urlBackground: serieArg.poster,
          descripcion: serieArg.nombre,
          subtitulo: serieArg.subtitle,
          idTemporada: idTemporada,
          capitulo: serieArg.capitulo,
          extension: serieArg.extension,
        });

        // try {
          log("Se ha registrado un nuevo capitulo de la serie: " + serieArg.nombre);
          let message = `Serie:${serieArg.nombre}\nTemporada: ${serieArg.temporada}\nCapitulo: ${serieArg.capitulo}`;
          await Meteor.call("enviarMensajeTelegram", "Capitulo Nuevo Registrado", "", message,null);
        // } catch (error) {
        //   console.log("Error al enviar mensaje a telegram para notificar que se inserto un capitulo nuevo de la serie: " + serieArg.nombre);
        // }
      }

      capitulo = await CapitulosCollection.findOne({ _id: id });
      temporada =
        capitulo && TemporadasCollection.findOne({ _id: capitulo.idTemporada });
      serie = temporada && SeriesCollection.findOne({ _id: temporada.idSerie });
      // console.log(peli);
      var srt2vtt = await require("srt-to-vtt");
      var fs = await require("fs");
      var appRoot = await require("app-root-path");
      var subtituloFile =
        appRoot.path + "/public/videos/subtitulo/" + id + ".vtt";
      const https = await require("http");

      // !fs.existsSync(appRoot.path + "/public/videos/subtitulo")
      //   ? fs.mkdirSync(appRoot.path + "/public/videos/subtitulo/")
      //   : "";

      // const file = fs.createWriteStream(subtituloFile);
      // /////////////////////////////////////////////
      try {
        capitulo &&
          capitulo.subtitulo &&
          (capitulo.textSubtitle == null || capitulo.textSubtitle == "") &&
          https.get(capitulo.subtitulo, async (response) => {
            try {
              var stream = response.pipe(srt2vtt());
              // stream.on("finish", function () {});
              await streamToString(stream).then(async (data) => {
                data &&
                  (await CapitulosCollection.update(
                    { _id: id },
                    {
                      $set: {
                        extension: serieArg.extension,
                        textSubtitle: data.toString("utf8"),
                      },
                    },
                    { multi: true }
                  ));

                !data
                  ? console.log(
                      "No se pudo obtener subtitulo de la Peli " +
                        capitulo.nombre
                    )
                  : console.log(
                      `Actualizado subtitulo de la Peli: ${capitulo.nombre}`
                    );
              });
            } catch (error) {
              console.log(error.message);
            }
          });
      } catch (error) {
        console.log(
          "no se pudo Actualizado subtitulo de la Peli " + serieArg.nombre
        );
        console.log(error.message);
      }

      var nameToImdb = require("name-to-imdb");
      const IMDb = require("imdb-light");

      console.log("Nombre Peli: " + serie.nombre);
      var idimdb = serie.idimdb;
      // try {
      //   await nameToImdb(
      //     { name: pelicula.nombre, year: pelicula.year },
      //     async (err, res, inf) => {
      //       err && console.log(`err IMDB de ${pelicula.nombre} =>  `,err);
      //       await console.log(`id IMDB de ${pelicula.nombre} =>  `,res); // "tt0121955"
      //       // inf contains info on where we matched that name - e.g. metadata, or on imdb
      //       // and the meta object with all the available data
      //       await console.log(`info IMDB de ${pelicula.nombre} =>  `,inf);
      //       if (res) {
      //         idimdb = res;
      //       }
      //     }
      //   );
      //   //////ACTUALIZANDO IDIMDB EN PELI
      //   console.log(`Update IDIMDB - Nombre Peli: ${peli.nombrePeli}`);
      //   idimdb &&
      //     (await CapitulosCollection.update(
      //       { _id: id },
      //       {
      //         $set: {
      //           idimdb: idimdb,
      //         },
      //       },
      //       { multi: true }
      //     ));
      // } catch (error) {
      //   console.log("no se pudo actualizar en nameToImdb " + pelicula.nombre);
      //   console.log(error.message);
      // }

      /////////ACTUALIZANDO TRILERS
      // try {
      //   console.log(`Update urlTrailer - Nombre Peli: ${peli.nombrePeli}`);
      //   idimdb &&
      //     (await IMDb.trailer(idimdb, async (url) => {
      //     //   console.log(url)  // output is direct mp4 url (also have expiration timeout)
      //         console.log("URL Trailer de " + idimdb +" URL: \n",url)  // etc...
      //       await CapitulosCollection.update(
      //         { _id: id },
      //         {
      //           $set: {
      //             urlTrailer: url,
      //             // clasificacion: details.Genres.split(", ")
      //           },
      //         }
      //       );
      //     }));
      // } catch (error) {
      //     console.log("no se pudo actualizar en IMDb.trailer " + pelicula.nombre);
      //   console.log(error.message);
      // }

      //////ACTUALIZANDO CLASIFICACION
      console.log(
        `Update descripcion y clasificacion - Nombre Peli: ${serie.nombre}`
      );
      try {
        const imdba = require("imdb-api");

        (idimdb || (serie && serie.nombre)) &&
          (serie.clasificacion == null ||
            serie.clasificacion.length == 0 ||
            serie.actors == null ||
            serie.actors.length == 0) &&
          (await imdba
            .get(idimdb ? { id: idimdb } : { name: serie.nombre }, {
              apiKey: Meteor.settings.public.imdbApiKey,
            })
            .then(async (element) => {
              console.log("Se encontro el imdba de " + capitulo._id  ); // etc...
              console.log("Detalles de ", capitulo, " Detalles: \n", element); // etc...
              element &&
                (await CapitulosCollection.update(
                  { _id: capitulo._id },
                  {
                    $set: {
                      // extension: serieArg.extension,
                      descripcion: element.plot,
                    },
                  },
                  { multi: true }
                ));
              element &&
                (await SeriesCollection.update(
                  { _id: serie._id },
                  {
                    $set: {
                      descripcion: element.plot,
                      clasificacion: element.genres.split(", "),
                      actors: element.actors.split(", "),
                      idimdb: element.imdbid,
                      year: element.start_year,
                    },
                  },
                  { multi: true }
                ));
            }));
      } catch (error) {
        console.log("no se pudo actualizar en IMDb.fetch " + serieArg.nombre);
        console.log(error.message);
      }
    },
    getUrlTrillerSeries: (id) => {
      let serie = SeriesCollection.findOne(id);
      return serie.urlTrailer ? serie.urlTrailer : null;
    },
    addVistasSeries: (id) => {
      CapitulosCollection.update(id, { $inc: { vistas: 1 } })
    },
    changeStatusSubscripcion: (userId,AdminId) => {
      let user = Meteor.users.findOne(userId);
      let admin = Meteor.users.findOne(AdminId);
      if(user && admin){
        Meteor.users.update(userId, { $set: { subscipcionPelis: !user.subscipcionPelis } });
        Meteor.call(
          "registrarLog",
          "Servicio de Películas",
          userId,
          AdminId,
          `Cambio de estado de suscripción de Películas y Series de ${user.subscipcionPelis ? "ACTIVO" : "INACTIVO"} a ${!user.subscipcionPelis ? "ACTIVO" : "INACTIVO"}`,
        );
        return true;
      }
      return false;
    }, 
    getSeriesClasificacion: () => {
      let series = SeriesCollection.find({},{fields:{clasificacion:1}}).fetch();
      let clasificacion = [];
      series.forEach((serie) => {
        serie.clasificacion.forEach((clas) => {
          if (!clasificacion.includes(clas)) {
            clasificacion.push(clas);
          }
        });
      });
      return clasificacion;
    }
  });
}
