import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'
import {
  OnlineCollection
} from "../imports/ui/pages/collections/collections";

import "./startup";
import "./metodos";
import "./publicaciones";
import "./serverproxy3002";
import "./tareas";
import "./rutas";
import "./bot";
import "./videoCalls";

var http = require("http");
http.post = require("http-post");

if (Meteor.isClient) {
  // Group.subscription = Meteor.subscribe("links");
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

// var PATH_TO_KEY =
//   appRoot.path + "/server/conf/vidkar.key";
// var PATH_TO_CERT =
//   appRoot.path + "/server/conf/vidkar.crt";
// var httpProxy = require("http-proxy");
// var options = {
//   ssl: {
//     key: fs.readFileSync(PATH_TO_KEY, "utf8"),
//     cert: fs.readFileSync(PATH_TO_CERT, "utf8"),
//   },
//   target: "http://localhost:6000",
//   ws: true,
//   xfwd: true,
// };
// var server = httpProxy.createProxyServer(options).listen(5000);
// console.log("httpProxy running with target at " + options.target);

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
if (Meteor.isServer) {

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
    // Meteor.users.update(userId, {
    //   $set: {
    //     online: true,
    //   },
    // });
  });

  Accounts.onLogout(function (info) {
    var connectionId = info.connection.id;
    OnlineCollection.update(connectionId, {
      $set: {
        userId: "",
      },
    });
    // Meteor.users.update(info.user._id, {
    //   $set: {
    //     online: false,
    //   },
    // });
  });

  Accounts.onCreateUser(function (options, user) {
    // console.log("options > " + JSON.stringify(options))
    // console.log("user > " + JSON.stringify(user))
    if (user.services.facebook) {
  
      //  user.username = user.services.facebook.name;
      // let usuario =  Meteor.users.findOne({ "services.facebook.name": user.services.facebook.name })
      let usuario = user.services.facebook.email ? Meteor.users.findOne({ "emails.address": user.services.facebook.email }) : Meteor.users.findOne({ "services.facebook.first_name": user.services.facebook.first_name, "services.facebook.last_name": user.services.facebook.last_name })
  
      usuario ?
        (console.log(`Usuario de FACEBOOK ${usuario._id} actualizado`),
          usuario.services.facebook = user.services.facebook,
          user = usuario,
          user.profile = {
            firstName: user.services.facebook.first_name,
            lastName: user.services.facebook.last_name,
            name: user.services.facebook.name,
            role: user.profile.role,
          },
          user.picture = user.services.facebook.picture.data.url,
      Meteor.users.remove(usuario._id)
  
        )
        : (console.log(`Usuario de FACEBOOK ${user._id} Creado`),
          (user.emails = [{ address: user.services.facebook.email }]),
          (user.profile = {
            firstName: user.services.facebook.first_name,
            lastName: user.services.facebook.last_name,
            name: user.services.facebook.name,
            role: "user",
          }),
          (user.online = false),
          (user.creadoPor = "Facebook"),
          (user.baneado = true),
          (user.picture = user.services.facebook.picture.data.url),
          (user.descuentoproxy = 0),
          (user.descuentovpn = 0),
          (user.contandoProxy = true),
          (user.contandoVPN = true)
          );
  
      return user;
  
    } else if (user.services.google) {
      //  user.username = user.services.facebook.name;
  
      let usuario = user.services.google.email && Meteor.users.findOne({ "emails.address": user.services.google.email })
      usuario ?
        (console.log(`Usuario de GOOGLE ${usuario._id} actualizado`),
          usuario.services.google = user.services.google,
          user = usuario,
          user.profile = {
            firstName: user.services.google.given_name,
            lastName: user.services.google.family_name,
            name: user.services.google.name,
            role: user.profile.role,
          },
          user.picture = user.services.google.picture,
          Meteor.users.remove(usuario._id)       
          )
        : (console.log(`Usuario de GOOGLE ${user._id} Creado`),
          (user.emails = [{ address: user.services.google.email }]),
          (user.profile = {
            firstName: user.services.google.given_name,
            lastName: user.services.google.family_name,
            name: user.services.google.name,
            role: "user",
          }),
          (user.online = false),
          (user.creadoPor = "Google"),
          (user.baneado = true),
          (user.picture = user.services.google.picture),
          (user.descuentoproxy = 0),
          (user.descuentovpn = 0),
          (user.contandoProxy = true),
          (user.contandoVPN = true));
      return user;
  
    } else {
      const profile = {
        firstName: options.firstName,
        lastName: options.lastName,
        role: options.role,
      };
  
      // user.username = options.firstName + options.lastName
      user.profile = profile;
      user.creadoPor = options.creadoPor;
      user.bloqueadoDesbloqueadoPor = options.creadoPor;
      user.edad = options.edad;
      user.online = false;
      user.baneado = true;
      user.descuentoproxy = 0;
      user.descuentovpn = 0;
      user.contandoProxy = true;
      user.contandoVPN = true;
      console.log(`user: \n${JSON.stringify(user)}\n-----------------------\n`)
      console.log(`options: \n${JSON.stringify(options)}\n-----------------------\n`)
  
      return user;
    }
  
  });

  Meteor.users.after.insert(function (userId, doc) {
    // console.log(userId);
    console.log(`Usuario Creado con id => ${doc._id}`);
  });
}




