import { Meteor } from "meteor/meteor";
import { ArchivoCollection } from "../imports/ui/pages/collections/collections";
import { DescargasCollection } from "../imports/ui/pages/collections/collections";
import { WebApp } from "meteor/webapp";
import bodyParser from "body-parser";
import router from "router";
import youtubeDownload from "./downloader";

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

if (Meteor.isClient) {
  Group.subscription = Meteor.subscribe("links");
}

if (Meteor.isServer) {
  endpoint.post("/hello", (req, res) => {
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
  endpoint.post("/eliminar", (req, res) => {
    // console.log(req)
    // console.log(req.body)
    let id = req.body.idFile
    try {
      if (DescargasCollection.findOne({ idFile: id })) {
        
        var fs = require("fs");
        var appRoot = require("app-root-path");
        var videoFile =
          appRoot.path + "/public/videos/" + id + ".mp4";

        fs.unlinkSync(videoFile);
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
          tamanoFile: info.filesize + "kb",
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
  WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: true }));
  WebApp.connectHandlers.use(endpoint);

  ServiceConfiguration.configurations.remove({
    service: "facebook",
  });

  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: "1756389617873422",
    secret: "bad3765f23dbbec2e3299e206eebcc44",
  });

  Meteor.publish("archivo", function () {
    return ArchivoCollection.find({});
  });
  Meteor.publish("descargas", function () {
    return DescargasCollection.find({});
  });
  Meteor.publish("user", function () {
    return Meteor.users.find({});
  });
  Meteor.publish("user", function (id) {
    return Meteor.users.find({ _id: id });
  });
}

Meteor.startup(() => {
  // const youtubedl = require('youtube-dl')
  // const url = 'http://www.youtube.com/watch?v=WKsjaOqDXgg'
  // youtubedl.exec(url, ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
  //   if (err) throw err
  //   // console.log(output.join('\n'))
  // })
});
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

    return user;
  }

  user.username = user.services.facebook.name;
  user.emails = [{ address: user.services.facebook.email }];
  user.profile = {
    firstName: user.services.facebook.first_name,
    lastName: user.services.facebook.last_name,
    name: user.services.facebook.name,
    role: "admin",
  };

  return user;
});
