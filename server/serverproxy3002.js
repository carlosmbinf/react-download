import { Meteor } from "meteor/meteor";
import { OnlineCollection } from "../imports/ui/pages/collections/collections";

import router from "router";

const endpoint = router();

// -------------------Este Proxy Funciona al FULLLLLLLLL-----------

async function conect(server, connectionId, userId, hostname) {
  try {
    await OnlineCollection.insert({
      connectionId: `${server}${connectionId.toString()}`,
      address: "proxy: " + Meteor.settings.public.IP,
      userId: userId,
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
async function disconect(server, connectionId, stats) {
  try {
    // await console.log('remove ' + connectionId);
    const conn = await OnlineCollection.findOne({
      connectionId: `${server}${connectionId.toString()}`,
      // server: process.env.ROOT_URL
    });
    const user = conn && conn.userId && Meteor.users.findOne(conn.userId);
    let bytesGastados = Number(stats.srcTxBytes) + Number(stats.srcRxBytes);
    // + Number(stats.trgTxBytes) + Number(stats. trgRxBytes)
    let bytesGastadosGeneral =
      Number(stats.srcTxBytes) +
      Number(stats.srcRxBytes) +
      Number(stats.trgTxBytes) +
      Number(stats.trgRxBytes);
    user &&
      user._id &&
      user.contandoProxy &&
      (await Meteor.users.update(user._id, {
        $inc: { megasGastadosinBytes: bytesGastados },
      }));
    user &&
      user._id &&
      user.contandoProxy &&
      (await Meteor.users.update(user._id, {
        $inc: { megasGastadosinBytesGeneral: bytesGastadosGeneral },
      }));
    conn && conn._id && (await OnlineCollection.remove(conn._id));
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

if (Meteor.isServer) {
  
  console.log("Iniciando Proxy por el puerto 3002");
  var cron = require("node-cron");

  const ProxyChain = require("proxy-chain");
  var bcrypt = require("bcrypt");
  // var sha256 = require("sha256");
  const crypto = require("crypto");

  var server2 
  = new ProxyChain.Server({
    // Port where the server will listen. By default 8000.
    port: 3002,
    authRealm: "Service VidKar",
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
        const b = await Meteor.users.findOne({ username: username });
        if (b) {
          const userInput = crypto
            .Hash("sha256")
            .update(password)
            .digest("hex");
          const a = await bcrypt.compareSync(
            userInput,
            b && b.services.password.bcrypt
          );
          if (
            !a ||
            b.baneado ||
            (b.ip ? !(b.ip == Meteor.settings.public.IP) : false)
          ) {
            return {
              requestAuthentication: true,
              failMsg: "Contraseña incorrecta, Vuelva a intentarlo nuevamente",
            };
          } else {
            try {
              connectionId && conect("3002:", connectionId, b._id, hostname);
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
          failMsg:
            "Por Favor, reintentelo de nuevo, ocurrio un problema en el servidor",
        };
      }
    },
  });

  server2.listen(() => {
    console.log(`Servidor Proxy iniciado por el puerto: ${server2.port}`);
  });

  // Emitted when HTTP connection is closed
  server2.on("connectionClosed", ({ connectionId, stats }) => {
    // console.log(`Connection ${connectionId} closed`);
    // console.dir(stats);
    disconect("3002:", connectionId, stats);
  });
  // Emitted when HTTP request fails
  server2.on("requestFailed", ({ request, error }) => {
    console.log(`Request ${request.url} failed`);
    console.error(error);
  });

  cron
    .schedule(
      "0-59 0-23 1-31 1-12 *",
      async () => {
        ///////////ACTUALIZAR VPN CONNECTADAS MIRANDO PARA EL CUERPO 135
        // Meteor.users.find({ vpn: true }).forEach(async (user) => {

        //   let disponible = false
        //   try {
        //     await tcpp.probe(`192.168.18.${user.vpnip}`, 135, async function (err, available) {
        //       err && console.error(err)
        //       disponible = available;
        //       Meteor.users.update(user._id, {
        //         $set: { vpnConnected: disponible }
        //       })
        //     })
        //   } catch (error) {
        //     console.error(error)
        //   }
        // })
        ///////////////////////////////////////////////////////////////
        try{
          let arrayIds = [];
          await server2.getConnectionIds().map((id) => {
            arrayIds.push("3002:" + id);
          });
          await OnlineCollection.find({
            address: "proxy: " + Meteor.settings.public.IP,
          }).forEach((connection) => {
            !arrayIds.find((id) => connection.connectionId == id) && (
              // console.log( connection.connectionId + " NO ESTA CONECTADO"),
              OnlineCollection.remove(connection._id))
          });
        }catch(error){
          console.error(error)
        }
       
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
  Meteor.methods({
    closeproxy: ()=>{

    // console.log(req)
    // console.log(req.body)
    // console.log(PelisCollection.find({}, { descripcion: 0 }).fetch());
    try {
      server2.close(true, () => {
        console.log(`Proxy server2 Port:${server2.port} was closed.`);
      });

      return "Se detuvo correctamente el proxy"
    } catch (error) {
      console.log("----------------ERROR----------------------");
      console.log(error.error);
      console.log("--------------------------------------");

      return `Hubo errores al detener el proxy!`

      // res.send(error.error, {
      //   error: error.error,
      //   reason: error.reason,
      //   message: error.message,
      //   errorType: error.errorType,
      // });
    }

    },
    listenproxy:()=>{

      
    // console.log(req)
    // console.log(req.body)
    // console.log(PelisCollection.find({}, { descripcion: 0 }).fetch());
    try {
      server2 = new ProxyChain.Server({
        // Port where the server will listen. By default 8000.
        port: 3002,
        authRealm: "Service VidKar",
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
            const b = await Meteor.users.findOne({ username: username });
            if (b) {
              const userInput = crypto
                .Hash("sha256")
                .update(password)
                .digest("hex");
              const a = await bcrypt.compareSync(
                userInput,
                b && b.services.password.bcrypt
              );
              if (
                !a ||
                b.baneado ||
                (b.ip ? !(b.ip == Meteor.settings.public.IP) : false)
              ) {
                return {
                  requestAuthentication: true,
                  failMsg:
                    "Contraseña incorrecta, Vuelva a intentarlo nuevamente",
                };
              } else {
                try {
                  connectionId &&
                    conect("3002:", connectionId, b._id, hostname);
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
              failMsg:
                "Por Favor, reintentelo de nuevo, ocurrio un problema en el servidor",
            };
          }
        },
      });

      server2.listen(() => {
        console.log(`Servidor Proxy iniciado por el puerto: ${server2.port}`);
      });

      // Emitted when HTTP connection is closed
      server2.on("connectionClosed", ({ connectionId, stats }) => {
        // console.log(`Connection ${connectionId} closed`);
        // console.dir(stats);
        disconect("3002:", connectionId, stats);
      });
      // Emitted when HTTP request fails
      server2.on("requestFailed", ({ request, error }) => {
        console.log(`Request ${request.url} failed`);
        console.error(error);
      });

      return "Se inicio correctamente el proxy"

    } catch (error) {
      console.log("----------------ERROR----------------------");
      console.log(error);
      console.log("--------------------------------------");

      return "Hubo errores al iniciar el proxy!"

      // res.end(error.error, {
      //   error: error.error,
      //   reason: error.reason,
      //   message: error.message,
      //   errorType: error.errorType,
      // });
    }

    }
  });

  // Meteor.call("listenproxy",(error,result)=>{
  //   console.log(result)
  // })
}
