import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'
import {
  OnlineCollection,
  PelisCollection,
  MensajesCollection,
  ServersCollection
} from "../imports/ui/pages/collections/collections";
import { TVCollection } from "../imports/ui/pages/collections/collections";
import { DescargasCollection } from "../imports/ui/pages/collections/collections";
import { RegisterDataUsersCollection, LogsCollection } from "../imports/ui/pages/collections/collections";
import { WebApp } from "meteor/webapp";
import bodyParser from "body-parser";
import router from "router";
import youtubeDownload from "./downloader";
import fs from "fs";


const endpoint = router();

function insertLink({ title, url }) {
  ArchivoCollection.insert({ title, url, createdAt: new Date() });
}
function insertDescarga({
  idFile,
  nombreFile,
  tamanoFile,
  comentarios,
  descargadoPor,
  thumbnail,
}) {
  DescargasCollection.insert({
    idFile,
    nombreFile,
    tamanoFile,
    comentarios,
    createdAt: new Date(),
    descargadoPor,
    thumbnail,
  });
}


const tarea = async() => {
  var users = Meteor.users.find({})
  console.log('Count ' + users.count());
  console.log('running every minute to 1 from 5');

  users.fetch().map((user) => {
    console.log({
      userId: user._id,
      megasGastadosinBytes: user.megasGastadosinBytes,
      megasGastadosinBytesGeneral: user.megasGastadosinBytesGeneral,
    });
    RegisterDataUsersCollection.insert({
      userId: user._id,
      megasGastadosinBytes: user.megasGastadosinBytes,
      megasGastadosinBytesGeneral: user.megasGastadosinBytesGeneral,
      fecha: new Date(),
      
    });
    Meteor.users.update(user._id, {
      $set: { megasGastadosinBytes: 0, megasGastadosinBytesGeneral: 0 },
    });
  });
} 

if (Meteor.isClient) {
  Group.subscription = Meteor.subscribe("links");
}

if (Meteor.isServer) {

  Meteor.startup(() => {
    
    process.env.ROOT_URL = Meteor.settings.public.ROOT_URL;
    // process.env.MONGO_URL = Meteor.settings.public.MONGO_URL;

    console.log("ROOT_URL: " + process.env.ROOT_URL);
    console.log("MONGO_URL: " + process.env.MONGO_URL);

    OnlineCollection.remove({});
   // OnlineCollection.remove({address: `127.0.0.1`});

    ServiceConfiguration.configurations.remove({
      service: "facebook",
    });

    ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: "581482823014129",
      secret: "aeeca3e355143de86008e194c31fb691",
    });
    if (Meteor.users.find({ "profile.role": "admin" }).count() == 0) {
      console.log("CREANDO USER ADMIN");
      const user = {
        email: "carlosmbinf@nauta.cu",
        password: "lastunas123",
        firstName: "Carlos",
        lastName: "Medina",
        role: "admin",
        creadoPor: "N/A",
        baneado: false,
        edad: 26,
      };
      try {
        Accounts.createUser(user);
        console.log("ADD OK");
      } catch (error) {
        console.log("NO SE PUDO CREAR EL USER ADMIN");
      }
    }
    console.log("YA HAY UN USER ADMIN");
    // const youtubedl = require('youtube-dl')
    // const url = 'http://www.youtube.com/watch?v=WKsjaOqDXgg'
    // youtubedl.exec(url, ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
    //   if (err) throw err
    //   // console.log(output.join('\n'))
    // })
  });

  var cron = require("node-cron");
  // console.log(` la fecha inicial es mayor q la segunda ` + (new Date() > new Date()));
  const send = require('gmail-send')({
    user: 'carlosmbinf@gmail.com',
    pass: 'Lastunas@123',
    to:   'carlosmbinf9405@icloud.com',
    subject: 'VidKar Reporte',
  });
  try {
    cron
      .schedule(
        "1 0 1 1-12 *",
        async () => {
          console.log(new Date())
          let users = await Meteor.users.find({});
          // await console.log("Count " + users.count());
          // await console.log("running every minute to 1 from 5");

          await users.fetch().map((user) => {
            user.megasGastadosinBytes > 0 &&
              //   console.log({
              //   userId: user._id,
              //   megasGastadosinBytes: user.megasGastadosinBytes,
              //   megasGastadosinBytesGeneral: user.megasGastadosinBytesGeneral,
              // }),
              RegisterDataUsersCollection.insert({
                userId: user._id,
                megasGastadosinBytes: user.megasGastadosinBytes,
                megasGastadosinBytesGeneral: user.megasGastadosinBytesGeneral,
                fecha: new Date(),
              })
              user.profile.role == 'admin' &&
                Meteor.users.update(user._id, {
                  $set: {
                    megasGastadosinBytes: 0,
                    megasGastadosinBytesGeneral: 0,
                  },
                })
              user.baneado == false && user.profile.role !== 'admin' &&
                (Meteor.users.update(user._id, {
                  $set: {
                    megasGastadosinBytes: 0,
                    megasGastadosinBytesGeneral: 0,
                    baneado: true,
                  },
                }),
                LogsCollection.insert({
                  type: "Bloqueado",
                  userAfectado: user._id,
                  userAdmin: "server",
                  message:
                    "El server " +
                    process.env.ROOT_URL +
                    " Bloqueo automaticamente el proxy por ser dia Primero de cada Mes",
                  createdAt: new Date(),
                }),
                send(
                  {
                    text:
                      "El server " +
                      process.env.ROOT_URL +
                      " Bloqueo automaticamente el proxy a: " +
                      user.profile.firstName +
                      " " +
                      user.profile.lastName +
                      " por ser dia Primero de cada Mes ",
                  },
                  (error, result, fullResult) => {
                    if (error) console.error(error);
                    console.log(result);
                  }
                ));
          });
        },
        {
          scheduled: true,
          timezone: "America/Havana",
        }
      )
      .start();

    cron
      .schedule(
        "0-59 * * * *",
        async () => {
          let users = await Meteor.users.find({});
          await users.forEach((user) => {
            // !(user.username == "carlosmbinf") &&
            user.profile.role != "admin" &&
              (user.isIlimitado
                ? new Date() >=
                    new Date(
                      user.fechaSubscripcion
                        ? user.fechaSubscripcion
                        : new Date()
                    ) &&
                  !user.baneado &&
                  (Meteor.users.update(user._id, {
                    $set: { baneado: true, bloqueadoDesbloqueadoPor: "server" },
                  }),
                  LogsCollection.insert({
                    type: "Bloqueado",
                    userAfectado: user._id,
                    userAdmin: "server",
                    message:
                      "El server " + process.env.ROOT_URL +" Bloqueo automaticamente el proxy porque llego a la fecha limite",
                    createdAt: new Date(),
                  }),
                  send({
                    text:    'El server ' + process.env.ROOT_URL +' Bloqueo automaticamente el proxy de ' + user.profile.firstName + " " + user.profile.lastName + ' porque llego a la fecha limite.' ,  
                  }, (error, result, fullResult) => {
                    if (error) console.error(error);
                    console.log(result);
                  })
                  )
                : (user.megasGastadosinBytes?user.megasGastadosinBytes:0) >= ((user.megas?Number(user.megas):0) * 1000000) &&
                  !user.baneado &&
                  (Meteor.users.update(user._id, {
                    $set: { baneado: true, bloqueadoDesbloqueadoPor: "server" },
                  }),
                  LogsCollection.insert({
                    type: "Bloqueado",
                    userAfectado: user._id,
                    userAdmin: "server",
                    message:
                      "El server " + process.env.ROOT_URL +" Bloqueo automaticamente el proxy porque consumio los " + user.megas + " MB",
                    createdAt: new Date(),
                  }),
                  send({
                    text:    "El server " + process.env.ROOT_URL +" Bloqueo automaticamente el proxy a: " + user.profile.firstName + " " + user.profile.lastName + " porque consumio los " + user.megas + "MB",  
                  }, (error, result, fullResult) => {
                    if (error) console.error(error);
                    console.log(result);
                  })
                  ));
          });
        },
        {
          scheduled: true,
          timezone: "America/Havana",
        }
      )
      .start();
  } catch (error) {
    console.log(error);
  }

  var conteoPost = 0;

  endpoint.post("/convertsrttovtt", (req, res) => {
    // console.log(req)
    // console.log(req.body)
    let id = req.body.idPeli;
    let peli = PelisCollection.findOne({ _id: id });
    console.log(peli);
    try {
      var srt2vtt = require("srt-to-vtt");
      var fs = require("fs");
      var appRoot = require("app-root-path");
      var subtituloFile =
        appRoot.path + "/public/videos/subtitulo/" + id + ".vtt";
      const https = require("https");
      !fs.existsSync(appRoot.path + "/public/videos/subtitulo")
        ? fs.mkdirSync(appRoot.path + "/public/videos/subtitulo/")
        : "";

      const file = fs.createWriteStream(subtituloFile);
      // /////////////////////////////////////////////
      https.get(peli.subtitulo, (response) => {
        var stream = response.pipe(srt2vtt()).pipe(file);
        stream.on("finish", function () {});
      });
      PelisCollection.update(
        { _id: req.body.idPeli },
        {
          $set: {
            subtitulo: "/videos/subtitulo/" + id + ".vtt",
          },
        }
      );
      // ///////////////////////////////////////
      // fs.createReadStream(peli.subtitulo)
      // .pipe(srt2vtt())
      // .pipe(fs.createWriteStream(subtituloFile))

      // PelisCollection.remove({ idFile: id });
      //file removed
      res.writeHead(200, {
        message: "todo OK",
      });
    } catch (error) {
      console.log("--------------------------------------");
      // console.log("error.error :> " + error.error);
      // console.log("error.reason :> " + error.reason);
      console.log("error.message :> " + error.message);
      // console.log("error.errorType :> " + error.errorType);
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


  endpoint.post("/insertPelis", (req, res) => {
    // console.log(req)
    console.log(req.body)
    let id = PelisCollection.insert({
      nombrePeli:req.body.nombre,
      urlPeli:req.body.peli,
      urlBackground:req.body.poster,
      descripcion:req.body.nombre,
      tamano:797,
      mostrar:true,
      subtitulo:req.body.subtitle,
      year:req.body.year
    });
    let peli = PelisCollection.findOne({ _id: id });
    console.log(peli);
    try {
      var srt2vtt = require("srt-to-vtt");
      var fs = require("fs");
      var appRoot = require("app-root-path");
      var subtituloFile =
        appRoot.path + "/public/videos/subtitulo/" + id + ".vtt";
      const https = require("https");
      !fs.existsSync(appRoot.path + "/public/videos/subtitulo")
        ? fs.mkdirSync(appRoot.path + "/public/videos/subtitulo/")
        : "";

      const file = fs.createWriteStream(subtituloFile);
      // /////////////////////////////////////////////
      https.get(peli.subtitulo, (response) => {
        var stream = response.pipe(srt2vtt()).pipe(file);
        stream.on("finish", function () {});
      });
      PelisCollection.update(
        { _id: req.body.idPeli },
        {
          $set: {
            subtitulo: "/videos/subtitulo/" + id + ".vtt",
          },
        }
      );
      // ///////////////////////////////////////
      // fs.createReadStream(peli.subtitulo)
      // .pipe(srt2vtt())
      // .pipe(fs.createWriteStream(subtituloFile))

      // PelisCollection.remove({ idFile: id });
      //file removed
      res.writeHead(200, {
        message: "todo OK",
      });
    } catch (error) {
      console.log("--------------------------------------");
      // console.log("error.error :> " + error.error);
      // console.log("error.reason :> " + error.reason);
      console.log("error.message :> " + error.message);
      // console.log("error.errorType :> " + error.errorType);
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
      req.body.password && Accounts.setPassword(req.body.id, req.body.password);
      console.log(
        "Usuario actualizado" + req.body.id + " " + req.body.username + " "
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
  endpoint.post("/descarga", (req, res) => {
    const youtubedl = require("youtube-dl");

    const url = "http://www.youtube.com/watch?v=" + req.body.idVideo;
    // Optional arguments passed to youtube-dl.
    const options = ["--username=user", "--password=hunter2"];

    if (!DescargasCollection.findOne({ idFile: req.body.idVideo })) {
      try {
        res.writeHead(200, {
          message: "Descargando:" + req.body.idVideo,
        });
        youtubeDownload(req.body.idVideo, () => {
          console.log("ADD VIDEO: " + JSON.stringify(req.body.idVideo));
        });
      } catch (error) {
        console.log("error.error :> " + error);
        // console.log("error.reason :> " +error.reason)
        // console.log("error.message :> " +error.message)
        // console.log("error.errorType :> " +error.errorType)
        // console.log("--------------------------------------")
      }

      youtubedl.getInfo(url, options, function (err, info) {
        if (err) throw err;

        DescargasCollection.insert({
          idFile: req.body.idVideo,
          nombreFile: info.title,
          tamanoFile: info.filesize,
          comentarios: info.description,
          descargadoPor: req.body.creadoPor,
          thumbnail: info.thumbnail,
          urlReal: "/videos/" + req.body.idVideo + ".mp4",
          url: info.url,
        });
      });
    } else {
      res.writeHead(200, {
        message: "El fichero " + req.body.idVideo + " ya existe",
      });
    }
    // console.log('id:', info.id)
    // console.log('title:', info.title)
    // console.log('url:', info.url)
    // console.log('thumbnail:', info.thumbnail)
    // console.log('description:', info.description)
    // console.log('filename:', info._filename)
    // console.log('format id:', info)
    // console.log('filesize id:', info.filesize)

    res.end();
  });
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
  

  endpoint.route('/users')
  .get(function (req, res) {
    // this is GET /pet/:id
    console.log(req.query);
    let q = req.query?req.query:{}
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(Meteor.users.find(q).fetch()))
  })
  

  endpoint.route('/updateuser')
  .post(function (req, res) {
    // this is DELETE /pet/:id

// try {
  let query = req.query.id?req.query.id:{}
let data = req.query?req.query:{}
delete data[0]
console.log(query);
console.log(data);


  var update =  Meteor.users.update(
      query,
     {$set: data},
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



  WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: true }));
  WebApp.connectHandlers.use(endpoint);

  // ServiceConfiguration.configurations.remove({
  //   service: "google"
  // });
  // ServiceConfiguration.configurations.insert({
  //   service: "google",
  //   clientId: "????????????????.apps.googleusercontent.com",
  //   secret: "????????????????"
  // });
  Meteor.publish("logs", function () {
    return LogsCollection.find({});
  });
  Meteor.publish("logsId", function (id) {
    return LogsCollection.find({ userAfectado: id });
  });
  Meteor.publish("registerDataUser", function () {
    return RegisterDataUsersCollection.find({});
  });
  Meteor.publish("registerDataUserId", function (id) {
    return RegisterDataUsersCollection.find({ userAfectado: id });
  });
  Meteor.publish("pelis", function () {
    return PelisCollection.find({});
  });
  Meteor.publish("peli", function (id) {
    return PelisCollection.find({ _id: id });
  });
  Meteor.publish("tvs", function () {
    return TVCollection.find({});
  });
  Meteor.publish("tv", function (id) {
    return TVCollection.find({ _id: id });
  });
  Meteor.publish("descargas", function () {
    return DescargasCollection.find({});
  });
  Meteor.publish("descarga", function (id) {
    return DescargasCollection.find({ _id: id });
  });
  Meteor.publish("user", function (selector) {
    return Meteor.users.find(selector?selector:{});
  });
  Meteor.publish("userID", function (id) {
    return Meteor.users.find({ _id: id });
  });
  Meteor.publish("userRole", function (role) {
    return Meteor.users.find({ "profile.role": role });
  });
  Meteor.publish("conexionesUser", function (id) {
    return OnlineCollection.find({ userId: id });
  });
  Meteor.publish("conexiones", function () {
    return OnlineCollection.find({});
  });
  Meteor.publish("mensajes", function (id) {
    return MensajesCollection.find({ to: id });
  });
  Meteor.publish("server", function (id) {
    return ServersCollection.find(id);
  });
  Meteor.publish("servers", function () {
    return ServersCollection.find({});
  });

  Meteor.onConnection(function (connection) {
    OnlineCollection.insert({
      _id: connection.id,
      address: connection.clientAddress,
    });

    connection.onClose(function () {
      OnlineCollection.remove(connection.id);
    });
  });

  Accounts.onLogin(function (info) {
    var connectionId = info.connection.id;
    var user = info.user;
    var userId = user._id;

    OnlineCollection.update(connectionId, {
      $set: {
        userId: userId,
        loginAt: new Date(),
      },
    });
    Meteor.users.update(userId, {
      $set: {
        online: true,
      },
    });
  });

  Accounts.onLogout(function (info) {
    var connectionId = info.connection.id;
    OnlineCollection.update(connectionId, {
      $set: {
        userId: "",
      },
    });
    Meteor.users.update(info.user._id, {
      $set: {
        online: false,
      },
    });
  });
}

var appRoot = require("app-root-path");
//   try{
//     SSLProxy({
//         port: 8080, //or 443 (normal port/requires sudo)
//         ssl : {
//           key: fs.readFileSync(appRoot.path + '/server/conf/key.pem'),
//           cert: fs.readFileSync(appRoot.path + '/server/conf/cert.pem')

//             //Optional CA
//             //Assets.getText("ca.pem")
//         }
//     });
//   }catch(error){
//     console.error(error)
//   }

var PATH_TO_KEY =
  appRoot.path + "/server/conf/28459803_srv5119-206152.vps.etecsa.cu.key";
var PATH_TO_CERT =
  appRoot.path + "/server/conf/28459803_srv5119-206152.vps.etecsa.cu.cert";
var httpProxy = require("http-proxy");
var options = {
  ssl: {
    key: fs.readFileSync(PATH_TO_KEY, "utf8"),
    cert: fs.readFileSync(PATH_TO_CERT, "utf8"),
  },
  target: "http://localhost:3000",
  ws: true,
  xfwd: true,
};
var server = httpProxy.createProxyServer(options).listen(5000);
console.log("httpProxy running with target at " + options.target);

// -------------------Este Proxy Funciona al FULLLLLLLLL-----------
// const proxy = require('@ucipass/proxy')
// const proxyPort = 3002
// proxy(proxyPort)
//   .then(() => {
//     // Use it for a while....
//   })
//   .then((server) => {
//     // console.log(server);
//     // server.stop()
//   })

// -------------------Este Proxy Funciona al FULLLLLLLLL-----------
async function conect(connectionId, userId, hostname) {
  try {
    await OnlineCollection.insert({
      connectionId: connectionId.toString(),
      address: "proxy: " + Meteor.settings.public.IP,
      userId: userId,
      loginAt: new Date(),
      hostname: hostname,
    });
  } catch (error) {
    console.log(error);
  }

  // await Meteor.users.update(userId, {
  //   $set: {
  //     online: true,
  //   },
  // });
  // return true
}
async function disconect(connectionId, stats) {
  try {
    // await console.log('remove ' + connectionId);
    const conn = await OnlineCollection.findOne({
      connectionId: connectionId.toString()
      // server: process.env.ROOT_URL
    });
    const user = conn&&conn.userId && Meteor.users.findOne(conn.userId);
    let bytesGastados = Number(stats.srcTxBytes) + Number(stats.srcRxBytes);
    // + Number(stats.trgTxBytes) + Number(stats. trgRxBytes)
    let bytesGastadosGeneral =
      Number(stats.srcTxBytes) +
      Number(stats.srcRxBytes) +
      Number(stats.trgTxBytes) +
      Number(stats.trgRxBytes);
      user&&user._id &&
      (await Meteor.users.update(user._id, {
        $inc: { megasGastadosinBytes: bytesGastados },
      }));
      user&&user._id &&
      (await Meteor.users.update(user._id, {
        $inc: { megasGastadosinBytesGeneral: bytesGastadosGeneral },
      }));
      conn&&conn._id&&(await OnlineCollection.remove(conn._id));
    // await console.log(idofconn&&idofconn._id);
    // await Meteor.users.update(userId, {
    //   $set: {
    //     online: true,
    //   },
    // });
  } catch (error) {
    console.log(error);
  }
}
const ProxyChain = require("proxy-chain");
var bcrypt = require("bcrypt");
// var sha256 = require("sha256");
const crypto = require("crypto");
const server2 = new ProxyChain.Server({
  // Port where the server will listen. By default 8000.
  port: 3002,

  // Enables verbose logging
  // verbose: true,

  // Custom user-defined function to authenticate incoming proxy requests,
  // and optionally provide the URL to chained upstream proxy.
  // The function must return an object (or promise resolving to the object) with the following signature:
  // { requestAuthentication: Boolean, upstreamProxyUrl: String }
  // If the function is not defined or is null, the server runs in simple mode.
  // Note that the function takes a single argument with the following properties:
  // * request      - An instance of http.IncomingMessage class with information about the client request
  //                  (which is either HTTP CONNECT for SSL protocol, or other HTTP request)
  // * username     - Username parsed from the Proxy-Authorization header. Might be empty string.
  // * password     - Password parsed from the Proxy-Authorization header. Might be empty string.
  // * hostname     - Hostname of the target server
  // * port         - Port of the target server
  // * isHttp       - If true, this is a HTTP request, otherwise it's a HTTP CONNECT tunnel for SSL
  //                  or other protocols
  // * connectionId - Unique ID of the HTTP connection. It can be used to obtain traffic statistics.
  prepareRequestFunction: async ({
    request,
    username,
    password,
    hostname,
    port,
    isHttp,
    connectionId,
  }) => {
    try {
      const b = await Meteor.users.findOne({ "username": username });
      if (b) {
        const userInput = crypto.Hash("sha256").update(password).digest("hex");
        const a = await bcrypt.compareSync(
          userInput,
          b && b.services.password.bcrypt
        );
        if ((!a)||b.baneado||(b.ip?!(b.ip==Meteor.settings.public.IP):(false))) {
          return {
            requestAuthentication: true,
            failMsg: "Contraseña incorrecta, Vuelva a intentarlo nuevamente",
          };
        } else {        
        try {
          connectionId&& conect(connectionId, b._id, hostname);
        // if( await conect(connectionId,b&&b._id))
          return {};
        } catch (error) {
          console.log(error);
        }  
        }
      } else {
        return {
          requestAuthentication: true,
          failMsg: "Usuario no Existe",
        };
      }
    } catch (error) {
      // console.log(error.message);
      return {
        // If set to true, the client is sent HTTP 407 resposne with the Proxy-Authenticate header set,
        // requiring Basic authentication. Here you can verify user credentials.
        requestAuthentication: true,
        // requestAuthentication: username !== 'bob' || password !== '123',

        // Sets up an upstream HTTP proxy to which all the requests are forwarded.
        // If null, the proxy works in direct mode, i.e. the connection is forwarded directly
        // to the target server. This field is ignored if "requestAuthentication" is true.
        // The username and password should be URI-encoded, in case it contains some special characters.
        // See `parseUrl()` function for details.
        // upstreamProxyUrl: `http://username:password@proxy.example.com:3128`,

        // If "requestAuthentication" is true, you can use the following property
        // to define a custom error message to return to the client instead of the default "Proxy credentials required"
        failMsg: "Por Favor, reintentelo de nuevo, ocurrio un problema en el servidor",
      };
    }
  },
});

server2.listen(() => {
  console.log(`Proxy server is listening on port ${server2.port}`);
});

// Emitted when HTTP connection is closed
server2.on("connectionClosed", ({ connectionId, stats }) => {
  // console.log(`Connection ${connectionId} closed`);
  // console.dir(stats);
  disconect(connectionId,stats);
});
// Emitted when HTTP request fails
server2.on("requestFailed", ({ request, error }) => {
  console.log(`Request ${request.url} failed`);
  console.error(error);
});

///////////SERVER3///////////////////
const server3 = new ProxyChain.Server({
  // Port where the server will listen. By default 8000.
  port: 80,

  // Enables verbose logging
  // verbose: true,

  // Custom user-defined function to authenticate incoming proxy requests,
  // and optionally provide the URL to chained upstream proxy.
  // The function must return an object (or promise resolving to the object) with the following signature:
  // { requestAuthentication: Boolean, upstreamProxyUrl: String }
  // If the function is not defined or is null, the server runs in simple mode.
  // Note that the function takes a single argument with the following properties:
  // * request      - An instance of http.IncomingMessage class with information about the client request
  //                  (which is either HTTP CONNECT for SSL protocol, or other HTTP request)
  // * username     - Username parsed from the Proxy-Authorization header. Might be empty string.
  // * password     - Password parsed from the Proxy-Authorization header. Might be empty string.
  // * hostname     - Hostname of the target server
  // * port         - Port of the target server
  // * isHttp       - If true, this is a HTTP request, otherwise it's a HTTP CONNECT tunnel for SSL
  //                  or other protocols
  // * connectionId - Unique ID of the HTTP connection. It can be used to obtain traffic statistics.
  prepareRequestFunction: async ({
    request,
    username,
    password,
    hostname,
    port,
    isHttp,
    connectionId,
  }) => {
    try {
      const b = await Meteor.users.findOne({ "username": username });
      if (b) {
        const userInput = crypto.Hash("sha256").update(password).digest("hex");
        const a = await bcrypt.compareSync(
          userInput,
          b && b.services.password.bcrypt
        );
        if ((!a)||b.baneado) {
          return {
            requestAuthentication: true,
            failMsg: "Contraseña incorrecta, Vuelva a intentarlo nuevamente",
          };
        } else {        
        try {
          connectionId&& conect(connectionId, b._id, hostname);
        // if( await conect(connectionId,b&&b._id))
          return {};
        } catch (error) {
          console.log(error);
        }  
        }
      } else {
        return {
          requestAuthentication: true,
          failMsg: "Usuario no Existe",
        };
      }
    } catch (error) {
      // console.log(error.message);
      return {
        // If set to true, the client is sent HTTP 407 resposne with the Proxy-Authenticate header set,
        // requiring Basic authentication. Here you can verify user credentials.
        requestAuthentication: true,
        // requestAuthentication: username !== 'bob' || password !== '123',

        // Sets up an upstream HTTP proxy to which all the requests are forwarded.
        // If null, the proxy works in direct mode, i.e. the connection is forwarded directly
        // to the target server. This field is ignored if "requestAuthentication" is true.
        // The username and password should be URI-encoded, in case it contains some special characters.
        // See `parseUrl()` function for details.
        // upstreamProxyUrl: `http://username:password@proxy.example.com:3128`,

        // If "requestAuthentication" is true, you can use the following property
        // to define a custom error message to return to the client instead of the default "Proxy credentials required"
        failMsg: "Por Favor, reintentelo de nuevo, ocurrio un problema en el servidor",
      };
    }
  },
});

server3.listen(() => {
  console.log(`Proxy server is listening on port ${server3.port}`);
});

// Emitted when HTTP connection is closed
server3.on("connectionClosed", ({ connectionId, stats }) => {
  // console.log(`Connection ${connectionId} closed`);
  // console.dir(stats);
  disconect(connectionId,stats);
});
// Emitted when HTTP request fails
server3.on("requestFailed", ({ request, error }) => {
  console.log(`Request ${request.url} failed`);
  console.error(error);
});

try {
  cron
    .schedule(
      "0-59 0-23 1-31 1-12 *",
      async () => {
        let arrayIds = await server2.getConnectionIds();
        await server3.getConnectionIds() && arrayIds.push( await server3.getConnectionIds())
        await OnlineCollection.find({ address: "proxy: " + Meteor.settings.public.IP }).forEach(
          async (connection) => {
           await !arrayIds.find((id) => connection.connectionId == id) &&
              (await OnlineCollection.remove({
                connectionId: connection.connectionId,
              }));
          }
        );
      },
      {
        scheduled: true,
        timezone: "America/Havana",
      }
    )
    .start();
    // cron
    // .schedule(
    //   "0-59 0-23 1-31 1-12 *",
    //   async () => {
    //     let arrayIds = await server3.getConnectionIds();
    //     await OnlineCollection.find({ address: "proxy" }).forEach(
    //       async (connection) => {
    //        await !arrayIds.find((id) => connection.connectionId == id) &&
    //           (await OnlineCollection.remove({
    //             connectionId: connection.connectionId,
    //           }));
    //       }
    //     );
    //   },
    //   {
    //     scheduled: true,
    //     timezone: "America/Havana",
    //   }
    // )
    // .start();
} catch (error) {
  console.log(error);
}


// var httpProxy = require('http-proxy');
// const http = require("http");
// const basicAuth = require("basic-auth");
//   const port = 3003;
//   const target = "https://www.google.es";
//   const auth = "krly:lastunas123";

//   if (!(target && port && auth)) {
//     console.log("Usage: basic-auth-proxy-server <port> <backend> <auth>");
//     console.log(" - port       : port for proxy server e.g. 8000");
//     console.log(" - backend    : proxy target address e.g. http://localhost:3000");
//     console.log(" - auth       : {user}:{password} e.g. tom:12341234");
//     process.exit(1);
//   }

//   const proxy2 = httpProxy.createProxyServer();

//   http
//     .createServer(
//       {
//         ssl: {
//           key: fs.readFileSync(PATH_TO_KEY, "utf8"),
//           cert: fs.readFileSync(PATH_TO_CERT, "utf8"),
//         },
//       },
//       (req, res) => {
//         const [name, password] = auth.split(":");
//         const credential = basicAuth(req);
//         console.log(credential);

//         if (
//           !(
//             credential &&
//             credential.name === name &&
//             credential.pass === password
//           )
//         ) {
//           res.writeHead(401, {
//             "WWW-Authenticate": 'Basic realm="secret zone"',
//           });
//           res.end("Access denied");
//         } else {
//           //  console.log(req)
//           console.log(req.url);
//           // console.log(req.hostname)
//           var option = {
//             ssl: {
//               key: fs.readFileSync(PATH_TO_KEY, "utf8"),
//               cert: fs.readFileSync(PATH_TO_CERT, "utf8"),
//             },
//             ws: true,
//             xfwd: true,
//             // secure:true,
//             followRedirects: true,
//             hostRewrite: true,
//             autoRewrite: true,
//             changeOrigin: true,
//             ignorePath: true,
//             // selfHandleResponse:true,

//             target: req.url,
//           };
//           try {
//             proxy2.web(req, res, option);
//           } catch (error) {
//             console.log(error);
//           }
//           // console.log(req)
//         }
//       }
//     )
//     .listen(port);

// If the Links collection is empty, add some data.

// Meteor.users.allow({
//   instert() { return true; }
// });
Accounts.onCreateUser(function (options, user) {
  // console.log("options > " + JSON.stringify(options))
  // console.log("user > " + JSON.stringify(user))

  if (!user.services.facebook) {
    const profile = {
      firstName: options.firstName,
      lastName: options.lastName,
      role: options.role,
    };

    // user.username = options.firstName + options.lastName
    user.profile = profile;
    user.creadoPor = options.creadoPor;
    user.edad = options.edad;
    user.online = false;
    user.baneado = true;

    return user;
  }

  //  user.username = user.services.facebook.name;

  Meteor.users
    .find({ "services.facebook.name": user.services.facebook.name })
    .count() > 0
    ? (console.log(user),
      Meteor.users.update(
        { "services.facebook.name": user.services.facebook.name },
        { $set: { "services.facebook.name": user.services.facebook.name } }
      ))
    : (console.log(user),
      (user.emails = [{ address: user.services.facebook.email }]),
      (user.profile = {
        firstName: user.services.facebook.first_name,
        lastName: user.services.facebook.last_name,
        name: user.services.facebook.name,
        role: "user",
      }),
      (user.online = false),
      (user.baneado = true));
  return user;
});
