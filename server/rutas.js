import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'

import bodyParser from "body-parser";
import { WebApp } from "meteor/webapp";
import router from "router";
const endpoint = router();

// import youtubeDownload from "./downloader";

var http = require("http");
http.post = require("http-post");

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
    CapitulosCollection
} from "../imports/ui/pages/collections/collections";
import { Telegraf } from "telegraf";



if (Meteor.isServer) {

    console.log("Cargando Rutas...");
    var conteoPost = 0;
    function streamToString(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        })
    }

    endpoint.post("/enviaraudio", (req, res) => {
        //imprimir audio
        console.log(req._readableState.buffer.head.data);
        //create file con el audio
        var fs = require("fs");
        var appRoot = require("app-root-path");
        var audioFile = appRoot.path + "/public/audios/" + Date.now() + ".ogg";

        //si no existe audioFile lo crea
        !fs.existsSync(appRoot.path + "/public/audios") &&
            fs.mkdirSync(appRoot.path + "/public/audios/");
        //escribe el audio en el archivo
        fs.writeFileSync(audioFile,
            req._readableState.buffer.head.data
        );

        console.log("Audio Guardado en: " + audioFile);

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end("ok");
    });	
    ////////////////////////INSERTAR PELICUALAS PASANDOLE EL AÑO////////////
    
    endpoint.get("/getsubtitle", (req, res) => {
        let pelisubtitle = PelisCollection.findOne(req.query.idPeli);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(pelisubtitle ? pelisubtitle.textSubtitle : "");

    });
    endpoint.get("/getsubtitleSeries", (req, res) => {
        let serieSubtitle = CapitulosCollection.findOne(req.query.idSeries);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(serieSubtitle ? serieSubtitle.textSubtitle : "");
    });


    endpoint.post("/convertsrttovtt", async (req, res) => {
        // console.log(req)
        // console.log(req.body)
        let id = req.body.idPeli;
        let peli = await PelisCollection.findOne({ _id: id });

        try {
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
            peli && peli.subtitulo && await https.get(peli.subtitulo, async (response) => {

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

            });

            res.writeHead(200, {
                message: "todo OK",
            });
            res.end();
        } catch (error) {
            console.log("--------------------------------------");
            // console.log("error.error :> " + error.error);
            // console.log("error.reason :> " + error.reason);
            console.log("error.message :> " + error.message);
            // console.log("error.errorType :> " + error.errorType);
            console.log("--------------------------------------");

            // res.writeHead(error.error, {
            //   error: error.error,
            //   reason: error.reason,
            //   message: error.message,
            //   errorType: error.errorType,
            // });
            res.writeHead(200, {
                message: "Error:\n" + error.message,
            });
            res.end();
        }


    });


    // endpoint.post("/insertPelis", async (req, res) => {
    //     // console.log(req)
    //     // console.log(req.body)
    //     //  const insertPeli = async () => {
    //     let exist = await PelisCollection.findOne({ urlPeli: req.body.peli })
    //     let id = exist ? exist._id : await PelisCollection.insert({
    //         nombrePeli: req.body.nombre,
    //         urlPeli: req.body.peli,
    //         urlBackground: req.body.poster,
    //         descripcion: req.body.nombre,
    //         tamano: 797,
    //         mostrar: true,
    //         subtitulo: req.body.subtitle,
    //         year: req.body.year
    //     });
    //     let peli = await PelisCollection.findOne({ _id: id });
    //     // console.log(peli);
    //     try {
    //         var srt2vtt = await require("srt-to-vtt");
    //         var fs = await require("fs");
    //         var appRoot = await require("app-root-path");
    //         var subtituloFile =
    //             appRoot.path + "/public/videos/subtitulo/" + id + ".vtt";
    //         const https = await require("https");

    //         // !fs.existsSync(appRoot.path + "/public/videos/subtitulo")
    //         //   ? fs.mkdirSync(appRoot.path + "/public/videos/subtitulo/")
    //         //   : "";


    //         // const file = fs.createWriteStream(subtituloFile);
    //         // /////////////////////////////////////////////
    //         peli && peli.subtitulo && await https.get(peli.subtitulo, async (response) => {
    //             try {
    //                 var stream = response.pipe(srt2vtt());
    //                 // stream.on("finish", function () {});
    //                 streamToString(stream).then(data => {
    //                     data && PelisCollection.update(
    //                         { _id: id },
    //                         {
    //                             $set: {
    //                                 textSubtitle: data.toString("utf8"),
    //                             },
    //                         },
    //                         { multi: true }
    //                     );
    //                     console.log(`Actualizado subtitulo de la Peli: ${peli.nombrePeli}`);
    //                 }
    //                 )
    //             } catch (error) {
    //                 console.log(error.message)
    //             }


    //         });

    //         var nameToImdb = require("name-to-imdb");
    //         const IMDb = require('imdb-light');


    //         // console.log("ID de IMDB => " + idimdb)
    //         var idimdb;
    //         nameToImdb(peli.nombrePeli, function (err, res, inf) {
    //             console.log(res); // "tt0121955"
    //             // inf contains info on where we matched that name - e.g. metadata, or on imdb
    //             // and the meta object with all the available data
    //             console.log(inf);
    //             idimdb = res && res
    //         })
    //             // try {
    //             //     var result = await nameToImdb({ name: peli.nombrePeli, year: peli.year });
    //             //     console.log(result.res); // "tt0133093"
    //             //     console.log(result.inf); // {match: 'metadata', isCached: false, meta: {...}}    
    //             //     idimdb = result.res && result.res
    //             // } catch (error) {
    //             //     console.log(error);
    //             // }
                

    //         //////ACTUALIZANDO IDIMDB EN PELI
    //         try {
    //             idimdb && PelisCollection.update(
    //                 { _id: id },
    //                 {
    //                     $set: {
    //                         idimdb: idimdb,
    //                     },
    //                 },
    //                 { multi: true }
    //             );
    //         } catch (error) {
    //             console.log(error.message);
    //         }




    //         /////////ACTUALIZANDO TRILERS
    //         try {
    //             idimdb && await IMDb.trailer(idimdb, (url) => {
    //                 // console.log(url)  // output is direct mp4 url (also have expiration timeout)

    //                 PelisCollection.update(
    //                     { _id: id },
    //                     {
    //                         $set: {
    //                             urlTrailer: url,
    //                             // clasificacion: details.Genres.split(", ")
    //                         },
    //                     }
    //                 );
    //             });
    //         } catch (error) {
    //             console.log(error.message);
    //         }


    //         //////ACTUALIZANDO CLASIFICACION
    //         try {
    //             idimdb && await IMDb.fetch(idimdb, (details) => {
    //                 // console.log(details)  // etc...
    //                 PelisCollection.update(
    //                     { _id: id },
    //                     {
    //                         $set: {
    //                             descripcion: details.Plot,
    //                             clasificacion: details.Genres.split(", "),
    //                         },
    //                     },
    //                     { multi: true }
    //                 );
    //             });
    //         } catch (error) {
    //             console.log(error.message);
    //         }


    //         res.writeHead(200, {
    //             message: "todo OK",
    //         });
    //     } catch (error) {
    //         console.log("--------------------------------------");
    //         // console.log("error.error :> " + error.error);
    //         // console.log("error.reason :> " + error.reason);
    //         console.log(`error.message :> ${error.message}\n
    //         error.reason :> ${error.reason}`);
    //         // console.log("error.errorType :> " + error.errorType);
    //         console.log("--------------------------------------");

    //         res.writeHead(200, {
    //             reason: error.reason,
    //             message: error.message,
    //             errorType: error.type,
    //         });
    //     }

    //     res.end();
    //     // }

    //     // PelisCollection.find({urlPeli:req.body.peli}).count() == 0 && await insertPeli()

    // });


    endpoint.post("/getUsersVPN", async (req, res) => {
        // console.log(req)
        // console.log(req.body)
        try {
            let usuarios = []
            let result = ""
            await Meteor.users.find({ vpn: true }).forEach((user, index) => {
                usuarios.push({
                    username: user.username,
                    pass: user.passvpn,
                    ip: `192.168.18.${index}`
                })

            })
            result = usuarios.map(u => `${result}${u.username} l2tpd ${u.pass} ${u.ip}\n`)
            await console.log("Result: " + JSON.stringify(result));

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: result
            }));


        } catch (error) {
            console.log("error.error :> " + error.error);
            console.log("error.reason :> " + error.reason);
            console.log("error.message :> " + error.message);
            console.log("error.errorType :> " + error.errorType);
            console.log("--------------------------------------");

            res.end(error);
        }


    });
    endpoint.post("/getUsers", async (req, res) => {
        // console.log(req)
        // console.log(req.body)
        req.headers.username
        try {
            let usuarios = []
            let result = ""
            await Meteor.users.find(req.headers.username?{username:req.headers.username}:{},{
                // fields: {
                //   _id: 1,
                //   username: 1
                // },
                sort:{ megasGastadosinBytes: -1, vpnMbGastados: -1 }
              }).forEach((user) => {
                usuarios.push(user)
            })
            await console.log("Result: " + JSON.stringify(usuarios));

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(usuarios));


        } catch (error) {
            console.log("error.error :> " + error.error);
            console.log("error.reason :> " + error.reason);
            console.log("error.message :> " + error.message);
            console.log("error.errorType :> " + error.errorType);
            console.log("--------------------------------------");

            res.end(error);
        }


    });

    endpoint.post("/getfile", async (req, res) => {
        // console.log(req)
        // console.log(req.body)
        try {
            console.log("Get File " + JSON.stringify(req.body.nombre));

            await fs.readFile(req.body.url, "utf-8", (err, data) => {
                if (err) res.end("Error: " + err);
                // console.log(data);

                res.end(data);
            });

        } catch (error) {
            console.log("error.error :> " + error.error);
            console.log("error.reason :> " + error.reason);
            console.log("error.message :> " + error.message);
            console.log("error.errorType :> " + error.errorType);
            console.log("--------------------------------------");

            res.end(error);
        }


    });


    endpoint.post("/setfile", async (req, res) => {
        // console.log(req)
        // console.log(req.body)
        try {
            console.log("Set File " + JSON.stringify(req.body));

            await fs.writeFile(req.body.url, req.body.data, (err) => {
                if (err) res.end("Error: " + err);
                res.end("Datos Guardados Correctamente!!!")
            });

        } catch (error) {
            console.log("error.error :> " + error.error);
            console.log("error.reason :> " + error.reason);
            console.log("error.message :> " + error.message);
            console.log("error.errorType :> " + error.errorType);
            console.log("--------------------------------------");

            res.writeHead(error.error, {
                error: error.error,
                reason: error.reason,
                message: error.message,
                errorType: error.errorType,
            });

            res.end(error);

        }


    });

    endpoint.post("/createuser", (req, res) => {
        // console.log(req)
        // console.log(req.body)
        try {
            Accounts.createUser(req.body);
            console.log("Usuario Creado" + JSON.stringify(req.body));

            res.writeHead(200, {
                message: "Usuario Creado",
            });
        } catch (error) {
            console.log("error.error :> " + error.error);
            console.log("error.reason :> " + error.reason);
            console.log("error.message :> " + error.message);
            console.log("error.errorType :> " + error.errorType);
            console.log("--------------------------------------");

            res.writeHead(error.error, {
                error: error.error,
                reason: error.reason,
                message: error.message,
                errorType: error.errorType,
            });
        }

        res.end();
    });
    endpoint.post("/userpass", (req, res) => {
        // console.log(req)
        // console.log(req.body)
        try {
            req.body.username && Accounts.setUsername(req.body.id, req.body.username);

            req.body.password &&
                (Accounts.setPassword(req.body.id, req.body.password),
                    Meteor.users.update(req.body.id, { $set: { "passvpn": req.body.password } }));

            req.body.email &&
                Meteor.users.update(req.body.id, { $set: { "emails": [{ address: req.body.email }] } });

            req.body.movil &&
                Meteor.users.update(req.body.id, { $set: { "movil": req.body.movil } });

            console.log(
                "Usuario actualizado " + req.body.id
            );

            res.writeHead(200, {
                message: "Usuario actualizado",
            });
        } catch (error) {
            console.log("error.error :> " + error.error);
            console.log("error.reason :> " + error.reason);
            console.log("error.message :> " + error.message);
            console.log("error.errorType :> " + error.errorType);
            console.log("--------------------------------------");

            res.writeHead(error.error, {
                error: error.error,
                reason: error.reason,
                message: error.message,
                errorType: error.errorType,
            });
        }

        res.end();
    });

    endpoint.post("/eliminar", (req, res) => {
        // console.log(req)
        console.log(req.body);
        let id = req.body.id;
        try {
            if (DescargasCollection.findOne({ idFile: id })) {
                var fs = require("fs");
                var appRoot = require("app-root-path");
                var videoFile = appRoot.path + "/public/videos/" + id + ".mp4";

                fs.existsSync(videoFile)
                    ? fs.unlinkSync(videoFile, (err) => {
                        err
                            ? console.error(err)
                            : console.log("ARCHIVO " + videoFile + " Eliminado");
                        //file removed
                    })
                    : console.log("no existe el fichero");

                DescargasCollection.remove({ idFile: id });
                //file removed
                // res.writeHead(200, {
                //   message: "Eliminado el Archivo" + req.body.idVideo,
                // });
            }
        } catch (error) {
            console.log("error.error :> " + error.error);
            console.log("error.reason :> " + error.reason);
            console.log("error.message :> " + error.message);
            console.log("error.errorType :> " + error.errorType);
            console.log("--------------------------------------");

            // res.writeHead(error.error, {
            //   error: error.error,
            //   reason: error.reason,
            //   message: error.message,
            //   errorType: error.errorType,
            // });
        }

        res.end();
    });
    // endpoint.post("/descarga", (req, res) => {
    //     const youtubedl = require("youtube-dl");

    //     const url = "http://www.youtube.com/watch?v=" + req.body.idVideo;
    //     // Optional arguments passed to youtube-dl.
    //     const options = ["--username=user", "--password=hunter2"];

    //     if (!DescargasCollection.findOne({ idFile: req.body.idVideo })) {
    //         try {
    //             res.writeHead(200, {
    //                 message: "Descargando:" + req.body.idVideo,
    //             });
    //             youtubeDownload(req.body.idVideo, () => {
    //                 console.log("ADD VIDEO: " + JSON.stringify(req.body.idVideo));
    //             });
    //         } catch (error) {
    //             console.log("error.error :> " + error);
    //             // console.log("error.reason :> " +error.reason)
    //             // console.log("error.message :> " +error.message)
    //             // console.log("error.errorType :> " +error.errorType)
    //             // console.log("--------------------------------------")
    //         }

    //         youtubedl.getInfo(url, options, function (err, info) {
    //             if (err) throw err;

    //             DescargasCollection.insert({
    //                 idFile: req.body.idVideo,
    //                 nombreFile: info.title,
    //                 tamanoFile: info.filesize,
    //                 comentarios: info.description,
    //                 descargadoPor: req.body.creadoPor,
    //                 thumbnail: info.thumbnail,
    //                 urlReal: "/videos/" + req.body.idVideo + ".mp4",
    //                 url: info.url,
    //             });
    //         });
    //     } else {
    //         res.writeHead(200, {
    //             message: "El fichero " + req.body.idVideo + " ya existe",
    //         });
    //     }
    //     // console.log('id:', info.id)
    //     // console.log('title:', info.title)
    //     // console.log('url:', info.url)
    //     // console.log('thumbnail:', info.thumbnail)
    //     // console.log('description:', info.description)
    //     // console.log('filename:', info._filename)
    //     // console.log('format id:', info)
    //     // console.log('filesize id:', info.filesize)

    //     res.end();
    // });
    endpoint.post("/pelis", (req, res) => {
        // console.log(req)
        // console.log(req.body)
        // console.log(PelisCollection.find({}, { descripcion: 0 }).fetch());
        try {
            let a = [];
            PelisCollection.find({}).map((peliGeneral, i) => {
                // console.log(peliGeneral);
                a.push({
                    _id: peliGeneral._id,
                    nombrePeli: peliGeneral.nombrePeli,
                    tamano: peliGeneral.tamano,
                    urlBackground: peliGeneral.urlBackground,
                    urlPeli: peliGeneral.urlPeli,
                    // descripcion: descripcion,
                    // vistas:vistas,
                    // year:year,
                    // clasificacion:clasificacion,
                });
            });
            conteoPost = conteoPost + 1;
            console.log(conteoPost + " peticion");

            res.writeHead(200, {
                json: JSON.stringify(a),
            });
        } catch (error) {
            console.log("error.error :> " + error.error);
            console.log("error.reason :> " + error.reason);
            console.log("error.message :> " + error.message);
            console.log("error.errorType :> " + error.errorType);
            console.log("--------------------------------------");

            res.writeHead(error.error, {
                error: error.error,
                reason: error.reason,
                message: error.message,
                errorType: error.errorType,
            });
        }

        res.end();
    });

    endpoint.route('/ventasjson')
        .get(function (req, res) {
            const gastos = (id) => {
                let totalAPagar = 0;
                VentasCollection.find({}).map(element => {
                    element.adminId == id && !element.cobrado && (totalAPagar += element.precio)
                })
                return totalAPagar
            };
            // this is GET /pet/:id
            let resultado = []
            Meteor.users.find().map(usuario => {
                let pago = gastos(usuario._id)
                pago && resultado.push({ usuario: `${usuario.profile.firstName} ${usuario.profile.lastName}`, debe: pago })
            })

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(resultado))
        })

    endpoint.route('/usersjson')
        .get(function (req, res) {
            // this is GET /pet/:id
            console.log(req.query);
            let q = req.query ? req.query : {}
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(Meteor.users.find(q).fetch()))
        })


    endpoint.route('/updateuser')
        .post(function (req, res) {
            // this is DELETE /pet/:id

            // try {
            let query = req.query.id ? req.query.id : {}
            let data = req.query ? req.query : {}
            delete data[0]
            console.log(query);
            console.log(data);


            var update = Meteor.users.update(
                query,
                { $set: data },
                {
                    multi: true,
                    upsert: true
                }
            )
            console.log(update);
            // console.log(req.query);
            res.end(JSON.stringify({
                result: update
            }))
            // } catch (error) {
            //   res.end(JSON.stringify({
            //     error: `Error: ${error}`
            //   }))
            // }

        })
    endpoint.route('/prueba')
        .post(async function (req, res) {
            console.log("req.query", req.headers.id)

            //call meteor method getDatosDashboardByUser
            try {
                const result = await new Promise((resolve, reject) => {
                    Meteor.call('getDatosDashboardByUser', "MENSUAL", req.headers.id?req.headers.id:null, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                });
                console.log("result", result);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    result: result
                }));
            } catch (error) {
                console.log("error", error);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    error: error
                }));
            }
        //     Meteor.call('getDatosDashboardByUser', "MENSUAL", "WwX53qa95tmhuJSrP", (error, result) => {
        //         if (error) {
        //             console.log("error")
        //             res.setHeader('Content-Type', 'application/json')
        //             res.end(JSON.stringify({
        //                 error: error
        //             }))
        //         } else {
        //             console.log("result")
        //             res.setHeader('Content-Type', 'application/json')
        //             res.end(JSON.stringify({
        //                 result: result
        //             }))
        //         }
        //     })
         })



    WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: true }));
    WebApp.connectHandlers.use(endpoint);
}