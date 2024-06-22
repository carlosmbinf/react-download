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

  async function getSeries(nombre, year, url) {
    let peli = "";
    let subtitle = "";
    let poster = "";
    if (!url) throw new TypeError("Need to provide an url as first argument.");
    const { body: html } = await got(url);
    const linksPeli = htmlUrls({ html, url });

    // for (var j = 5; j < linksPeli.length-6; j++) {
    //   // console.log(`Links de peliculas ${JSON.stringify(linksPeli[j])}`);
    // }
    var filter = require("simple-text-search");
    var get = filter(linksPeli, "url");
    var peliurl = get(".mkv") || get(".mp4") ;
    var subtitleurl = get(".srt");
    var posterurl = get(".jpg") || get(".png");

    peli = peliurl[0] && peliurl[0].url;
    subtitle = subtitleurl[0] && subtitleurl[0].url;
    poster = posterurl[0] && posterurl[0].url;

    const insertPeli = peli && { nombre, year, peli, subtitle, poster, urlPadre: url};
    return insertPeli;
  }

  console.log("Cargando Métodos de series...");
  Meteor.methods({
    insertseriesbyyears: async function ({year}) {
      console.log("insertpelisbyyears" + year);

      var pelis = [];
      const url = `http://vidkar.ddns.net:3005/Peliculas/Extranjeras/${year}/`;
      if (!url)
        throw new TypeError("Need to provide an url as first argument.");
      const { body: html } = await got(url);
      const links = await htmlUrls({ html, url });

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

      for (var i = 5; i <= links.length - 4; i++) {
        // console.log("links lista" , links[i]);
        let nombre = links[i].value
          .replace(`${year}_`, "")
          .replace(/%20/g, " ")
          .replace(/\./g, " ")
          .replace(`/`, "")
          .replace(`(${year})`, "");
        // console.log(`Name: ${nombre}`);
        // console.log(links[i]);
        let a;
        let pelicula = await CapitulosCollection.findOne({urlPadre: links[i].url})
        if(pelicula){
          a = {
            nombre: pelicula.nombrePeli,
            year: pelicula.year,
            peli: pelicula.urlPeli,
            subtitle: pelicula.subtitulo,
            poster:pelicula.urlBackground,
            urlPadre: links[i].url,
          };
          
        }else{
           a = await getSeries(nombre, year, links[i].url);
        }

          
      // console.log(pelis.length)
      try {
        // pelis && (await Meteor.call("insertPelis", pelis[0]));

        a && a.nombre && a.year && a.peli && a.poster &&  Meteor.call("insertSeries", a)

      } catch (error) {
        console.log("Ocurrio un error => " + error.message);
      }
    }

      // res.writeHead(200, {
      //   message: "todo OK",
      // });
      // res.end("todo OK")
    },
    insertSeries: async function (serieArg) {
      console.log(`Peli `, serieArg);
      // console.log(req)
      // console.log(peli)
      //  const insertPeli = async () => {
        //picar la url para quitar el nombre de la peli, ejemplo https://vidkar.ddns.net:3005/Peliculas/Extranjeras/2021/2021_The_Father_(2021).mkv, quitar el 2021_The_Father_(2021).mkv

      let exist = await CapitulosCollection.findOne({ url: serieArg.url, });
      let id = null;
      if(exist){
        console.log(`La serie ${serieArg.nombre} ya existe`);
        id = exist._id;
      }else{
        id = await CapitulosCollection.insert({
          nombre: serieArg.nombre,
          url: serieArg.url,
          urlBackground: serieArg.poster,
          descripcion: serieArg.nombre,
          subtitulo: serieArg.subtitle,
          year: serieArg.year,
        });
      }

      let capitulo = await CapitulosCollection.findOne({ _id: id });
      let temporada = capitulo && capitulo.idTemporada;
      let serie = temporada && temporada.idSerie;
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
          capitulo.subtitulo && (capitulo.textSubtitle == null || capitulo.textSubtitle == "") &&
          (https.get(capitulo.subtitulo, async (response) => {
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
                    "No se pudo obtener subtitulo de la Peli " + capitulo.nombre
                  )
                : console.log(
                    `Actualizado subtitulo de la Peli: ${capitulo.nombre}`
                  );

              });
            } catch (error) {
              console.log(error.message);
            }
          }));
        } catch (error) {
            console.log("no se pudo Actualizado subtitulo de la Peli " + serieArg.nombre);
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

            const imdba = require('imdb-api');  

            (idimdb || (serie && serie.nombre)) && (serie.clasificacion == null || serie.clasificacion.length == 0 || serie.actors == null || serie.actors.length == 0  ) &&
              (await imdba
                .get(idimdb ? {id: idimdb} :{ name: serie.nombre }, { apiKey: "99b0df89" })
                .then(async (element) => {
                  
                      console.log(
                        "Detalles de " + idimdb + " Detalles: \n",
                        element
                      ); // etc...
                      element &&
                        (await CapitulosCollection.update(
                          { _id: id },
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
