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
  SeriesCollection,
} from "/imports/ui/pages/collections/collections";
import moment from "moment";

import movieTrailer from 'movie-trailer' // or import movieTrailer from 'movie-trailer'

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

  async function getPeli(nombre, year, url) {
    let peli = "";
    let subtitle = "";
    let poster = "";
    if (!url || !nombre)
      throw new TypeError("Need to provide an url as first argument.");
    
    try {
      const { body: html } = await got(url);
    const linksPeli = await htmlUrls({ html, url });

    // for (var j = 5; j < linksPeli.length-6; j++) {
    //   // console.log(`Links de peliculas ${JSON.stringify(linksPeli[j])}`);
    // }
    var filter = require("simple-text-search");
    var get = await filter(linksPeli, "url");
    var peliurlmp4 = await get(".mp4");
    var peliurlmkv = await get(".mkv");
    var peliurlavi = await get(".avi");
    var subtitleurl = await get(".srt");
    var posterurl = (await get(".jpg")) || (await get(".png"));

    var peliurl = peliurlmp4[0] || peliurlmkv[0] || peliurlavi[0];
    peli = peliurl && peliurl.url;
    subtitle = subtitleurl[0] && subtitleurl[0].url;
    poster = posterurl[0] && posterurl[0].url;
    const insertPeli = peli && {
      nombre,
      year,
      peli,
      subtitle,
      poster,
      urlPadre: url,
    };

    return insertPeli;

    } catch (error) {
    return null;      
    }
    
  }

  console.log("Cargando Métodos de peliculas...");
  Meteor.methods({
    getPelicula: async function (id) {
      return await PelisCollection.findOneAsync(id,{fields:
        {
          "_id" : 1,
          "nombrePeli" : 1,
          "urlPadre" : 1,
          "urlPeli" : 1,
          "urlBackground" : 1,
          "descripcion" : 1,
          "tamano" : 1,
          "mostrar" : 1,
          "subtitulo" : 1,
          "year" : 1,
          "urlPeliHTTPS" : 1,
          "extension" : 1,
          "urlBackgroundHTTPS" : 1,
          "urlTrailer" : 1,
          "createdAt" : 1,
          "vistas" : 1,
          "textSubtitle" : 1,
          "clasificacion" : 1,
          "idimdb" :1,
          "actors" : 1
      }
      });
    },
    insertpelisbyyears: async function ({ year }) {
      console.log("insertpelisbyyears" + year);

      var pelis = [];
      const url = `http://www.vidkar.com:3005/Peliculas/Extranjeras/${year}/`;
      if (!url)
        throw new TypeError("Need to provide an url as first argument.");
      
      try {
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
        console.log(links)
  
        for (var i = 9; i <= links.length - 4; i++) {
          // console.log("links lista" , links[i]);
          let nombre = links[i].value
            .replace(`${year}_`, "")
            .replace(/%20/g, " ")
            .replace(/\./g, " ")
            .replace(`/`, "")
            .replace(`(${year})`, "")
            .replace(`%28${year}%29`, "");

          console.log(`Comenzando INSERCION de la Pelicula: ${nombre}`);
          // console.log(links[i].value);
          let a;
          let pelicula = await PelisCollection.findOneAsync({
            urlPadre: links[i].url,
          },{fields:
            {
              "_id" : 1,
              "nombrePeli" : 1,
              "urlPeli" : 1,
              "urlBackground" : 1,
              "subtitulo" : 1,
              "year" : 1
          }
          });
          let existe = pelicula ? true : false;
          if (pelicula) {
            a = {
              nombre: pelicula.nombrePeli,
              year: pelicula.year,
              peli: pelicula.urlPeli,
              subtitle: pelicula.subtitulo,
              poster: pelicula.urlBackground,
              urlPadre: links[i].url,
            };
          } else {
            a = await getPeli(nombre, year, links[i].url);
          }
  
          // console.log(pelis.length)
          try {
            // pelis && (await Meteor.call("insertPelis", pelis[0]));
            !pelicula &&
              console.log(`Pelicula ${a.nombre} no existe en la base de datos`);
            pelicula &&
              console.log(`Pelicula ${a.nombre} ya existe en la base de datos`);
              
              a &&
              a.nombre &&
              a.year &&
              a.peli &&
              a.poster &&
              (await Meteor.call("insertPelis", a, false));
  
            let peli = await PelisCollection.findOneAsync({ urlPadre: links[i].url },{fields:
              {
                "_id" : 1,
                nombrePeli:1,
                clasificacion:1,
                actors:1,
                year:1,
                urlBackground:1,
                urlPeli:1
            }
            });
            peli && !existe && pelis.push(peli);
          } catch (error) {
            console.log("Ocurrio un error => " + error.message);
          }
        }
      } catch (error) {
        console.log(error)
      }
        
     

      pelis.length > 0 &&
        pelis.forEach(async (peli) => {
          console.log(`Peli ${peli.nombrePeli} insertada`);
          console.log(
            `Peli ${peli.urlPeli} se va a notificar a los administradores`
          );
          await Meteor.call(
            "enviarMensajeDirectoaAdministradores",
            `Nueva Peli en Vidkar:\nNombre: ${peli.nombrePeli}\nClasificacion: ${peli.clasificacion}\nActores: ${peli.actors}\nAño: ${peli.year}`,
            peli.urlBackground
          );
          await Meteor.call("actualizarSubtitulos", peli._id)
           
        });
      // res.writeHead(200, {
      //   message: "todo OK",
      // });
      // res.end("todo OK")
    },
    insertPelis: async function (pelicula, actualizarSubtitulos) {
      console.log(`Peli `, pelicula);
      // console.log(req)
      // console.log(peli)
      //  const insertPeli = async () => {
      let exist = await PelisCollection.findOneAsync({ urlPeli: pelicula.peli },{fields:
        {
          "_id" : 1
      }
      });
      let id = exist
        ? exist._id
        : await PelisCollection.insertAsync({
            nombrePeli: pelicula.nombre,
            urlPadre: pelicula.urlPadre,
            urlPeli: pelicula.peli,
            urlBackground: pelicula.poster,
            descripcion: pelicula.nombre,
            tamano: 797,
            mostrar: true,
            subtitulo: pelicula.subtitle,
            year: pelicula.year,
          });
      let peli = await PelisCollection.findOneAsync({ _id: id },{fields:
        {
          "_id" : 1,
          "nombrePeli" : 1,
          "urlPadre" : 1,
          "urlPeli" : 1,
          "urlBackground" : 1,
          "descripcion" : 1,
          "tamano" : 1,
          "mostrar" : 1,
          "subtitulo" : 1,
          "year" : 1,
          "urlPeliHTTPS" : 1,
          "extension" : 1,
          "urlBackgroundHTTPS" : 1,
          "urlTrailer" : 1,
          "createdAt" : 1,
          "vistas" : 1,
          "clasificacion" : 1,
          "idimdb" :1,
          "actors" : 1
      }
      });

      

      // !fs.existsSync(appRoot.path + "/public/videos/subtitulo")
      //   ? fs.mkdirSync(appRoot.path + "/public/videos/subtitulo/")
      //   : "";

      // const file = fs.createWriteStream(subtituloFile);
      // /////////////////////////////////////////////
      

      var nameToImdb = require("name-to-imdb");
      const IMDb = require("imdb-light");

      console.log("Nombre Peli: " + peli.nombrePeli);
      var idimdb = peli.idimdb;
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
      //     (await PelisCollection.updateAsync(
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

     

      /////////ACTUALIZANDO SUBTITULOS
      actualizarSubtitulos && (await Meteor.call("actualizarSubtitulos", id));

      //////ACTUALIZANDO CLASIFICACION
      console.log(
        `Update descripcion y clasificacion - Nombre Peli: ${peli.nombrePeli}`
      );
      try {
        const imdba = require("imdb-api");

        (idimdb || (peli && peli.nombrePeli)) &&
          (peli.clasificacion == null ||
            peli.clasificacion.length == 0 ||
            peli.actors == null ||
            peli.actors.length == 0) &&
          (await imdba
            .get(idimdb ? { id: idimdb } : { name: peli.nombrePeli }, {
              apiKey: "95b342ae", //esta sirve 99b0df89
            })
            .then(async (element) => {
              console.log("Se encontro en imdb la peli " + peli.nombrePeli);
              // console.log(
              //   "Detalles de " + idimdb + " Detalles: \n",
              //   element
              // ); // etc...
              element &&
                (await PelisCollection.updateAsync(
                  { _id: id },
                  {
                    $set: {
                      descripcion: element.plot,
                      clasificacion: element.genres.split(", "),
                      actors: element.actors.split(", "),
                      idimdb: element.imdbid,
                      ...element
                    },
                  },
                  { multi: true }
                ));
 ///////ACTUALIZANDO TRILERS

                !peli.urlTrailer && await Meteor.call("movieTrailer", element.imdbid, id);
                
                 /////// FIN ACTUALIZANDO TRILERS
                      

            }));
      } catch (error) {
        console.log("no se pudo actualizar en IMDb.fetch " + pelicula.nombre);
        console.log(error.message);
      }


      console.log("---------------------------------------------------------------------");
    },
    actualizarSubtitulos: async function (id) {
      
      let peli = await PelisCollection.findOneAsync(id,{fields:
        {
          "_id" : 1,
          "nombrePeli" : 1,
          "subtitulo" : 1,
          "textSubtitle" : 1,
      }
      });

      try {
// console.log(peli);
        var srt2vtt = await require("srt-to-vtt");
        var fs = await require("fs");
        var appRoot = await require("app-root-path");
        var subtituloFile =
          appRoot.path + "/public/videos/subtitulo/" + id + ".vtt";
        const https = await require("http");

        peli && console.log(`Verificando actualizacion del subtitulo de la Peli: ${peli && peli.nombrePeli}`);

        peli &&
          peli.subtitulo &&
          (peli.textSubtitle == null || peli.textSubtitle == "") ?
          
          (await https.get(peli.subtitulo, async (response) => {
            try {
              var stream = response.pipe(srt2vtt());
              // stream.on("finish", function () {});
              await streamToString(stream).then(async (data) => {
                data &&
                  (await PelisCollection.updateAsync(
                    { _id: id },
                    {
                      $set: {
                        textSubtitle: data.toString("utf8"),
                      },
                    },
                    { multi: true }
                  ));
                console.log(
                  `Actualizado subtitulo de la Peli: ${peli.nombrePeli}`
                );
              });
            } catch (error) {
              console.log(error.message);
            }
          })) : (console.log("No se Actualizo el subtitulo de la Peli " + peli ? peli.nombrePeli : ""))
      } catch (error) {
        console.log(
          "no se pudo Actualizado subtitulo de la Peli " + peli ? peli.nombrePeli : ""
        );
        console.log(error.message);
      }
    },
    getUrlTriller: (id) => {
      let peli = PelisCollection.findOneAsync(id,{fields:
        {
          "urlTrailer" : 1,
      }
      });
      return peli.urlTrailer ? peli.urlTrailer : null;
    },
    addVistas: (id) => {
      PelisCollection.updateAsync(id, { $inc: { vistas: 1 } });
    },
    movieTrailer: (tmdbId,idPelis) => {
      ///////ACTUALIZANDO TRILERS

      tmdbId && idPelis && movieTrailer( null, { tmdbId: tmdbId } )  
      .then( async (url) => {
        //   console.log(url)  // output is direct mp4 url (also have expiration timeout)
            console.log("URL Trailer de " + tmdbId +" URL: \n",url)  // etc...
          await PelisCollection.updateAsync(
            { _id: idPelis },
            {
              $set: {
                urlTrailer: url,
                // clasificacion: details.Genres.split(", ")
              },
            }
          );
        } )        
       /////// FIN ACTUALIZANDO TRILERS
    }
  });
}
