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
    const match = filename.match(/[sS](\d{2})[eE](\d{2})/);
    if (match) {
        const season = parseInt(match[1], 10);
        const episode = parseInt(match[2], 10);
        return { season, episode };
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

function groupFilesByEpisode(fileList) {
  const groupedFiles = {};

  fileList.forEach(file => {
      let filename = file.url;
      const parsed = parseFilename(filename);
      if (parsed) {
        const { season, episode } = parsed;
        const key = `S${season.toString().padStart(2, "0")}E${episode
          .toString()
          .padStart(2, "0")}`;
        const seriesName = formatSeriesName(
          extractSeriesName(filename).toLowerCase()
        );

        if (!groupedFiles[key]) {
          groupedFiles[key] = {
            seriesName: seriesName,
            thumb: null,
            video: null,
            nfo: null,
            srt: null,
            capitulo: episode,
            temporada: season,
          };
        }

        if (filename.endsWith(".jpg")) {
          groupedFiles[key].thumb = filename;
        } else if (filename.endsWith(".mkv") || filename.endsWith(".mp4")) {
          groupedFiles[key].video = filename;
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
  console.log("groupedFiles", groupedFiles);

  // if (!groupedFiles[key].video) {
  //   delete groupedFiles[key];
  // }



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
    insertSeriesByTemporadasURL: async function ({ urlSerie, year }) {
      console.log("insertSeriesByTemporadasURL " + urlSerie);

      var pelis = [];
      if (!urlSerie)
        throw new TypeError("Need to provide an url as first argument.");
      const { body: html } = await got(urlSerie);
      const links = await htmlUrls({ html, url: urlSerie });

      let series = await groupFilesByEpisode(links);

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
        };
        Meteor.call("insertSeries", serieData);
      });

      //   links.forEach(({ url }) => console.log(url))

      //   // => [
      //   //   'https://microlink.io/component---src-layouts-index-js-86b5f94dfa48cb04ae41.js',
      //   //   'https://microlink.io/component---src-pages-index-js-a302027ab59365471b7d.js',
      //   //   'https://microlink.io/path---index-709b6cf5b986a710cc3a.js',
      //   //   'https://microlink.io/app-8b4269e1fadd08e6ea1e.js',
      //   //   'https://microlink.io/commons-8b286eac293678e1c98c.js',
      //   //   'https://microlink.io',
      //   //   ...
      //   // ]
      // console.log(links)

      // for (var i = 5; i <= links.length - 4; i++) {
      //   // console.log("links lista" , links[i]);
      //   let nombre = links[i].value
      //     .replace(`${year}_`, "")
      //     .replace(/%20/g, " ")
      //     .replace(/\./g, " ")
      //     .replace(`/`, "")
      //     .replace(`(${year})`, "");
      //   // console.log(`Name: ${nombre}`);
      //   // console.log(links[i]);
      //   let a;
      //   let pelicula = await CapitulosCollection.findOne({
      //     urlPadre: links[i].url,
      //   });

      //   if (pelicula) {
      //     a = {
      //       nombre: pelicula.nombrePeli,
      //       year: pelicula.year,
      //       peli: pelicula.urlPeli,
      //       subtitle: pelicula.subtitulo,
      //       poster: pelicula.urlBackground,
      //       urlPadre: links[i].url,
      //     };
      //   } else {
      //     a = await getSeries(nombre, year, links[i].url);
      //   }

      //   // console.log(pelis.length)
      //   try {
      //     // pelis && (await Meteor.call("insertPelis", pelis[0]));

      //     a &&
      //       a.nombre &&
      //       a.year &&
      //       a.peli &&
      //       a.poster &&
      //       Meteor.call("insertSeries", a);
      //   } catch (error) {
      //     console.log("Ocurrio un error => " + error.message);
      //   }
      // }

      // res.writeHead(200, {
      //   message: "todo OK",
      // });
      // res.end("todo OK")
    },
    insertSeries: async function (serieArg) {
      console.log(`Serie `, serieArg);
      // console.log(req)
      // console.log(peli)
      //  const insertPeli = async () => {
      //picar la url para quitar el nombre de la peli, ejemplo https://vidkar.ddns.net:3005/Peliculas/Extranjeras/2021/2021_The_Father_(2021).mkv, quitar el 2021_The_Father_(2021).mkv

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
        });
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
              console.log("Detalles de ", capitulo, " Detalles: \n", element); // etc...
              element &&
                (await CapitulosCollection.update(
                  { _id: capitulo._id },
                  {
                    $set: {
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
      let serie = CapitulosCollection.findOne(id);
      return serie.urlTrailer ? serie.urlTrailer : null;
    },
  });
}
