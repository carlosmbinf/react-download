import { Meteor } from "meteor/meteor";
import { LogsCollection, PelisCollection, RegisterDataUsersCollection } from "../imports/ui/pages/collections/collections";

var cron = require("node-cron");


if (Meteor.isServer) {


  try {
    cron
      .schedule(
        // "1-59 * * * *",
        "0 0 1 1-12 *",
        async () => {
          console.log(new Date());
          let users = await Meteor.users.find({
            $or: [
              { baneado: false },
              { megasGastadosinBytes: { $gte: 1 } },
              { megasGastadosinBytesGeneral: { $gte: 1 } },
              { vpn: true },
              { vpnMbGastados: { $gte: 1 } },
            ],
          });
          await console.log("Count " + users.count());
          // await console.log("running every minute to 1 from 5");

          await users.forEach(async (user) => {
            ////////////CONSUMOS PROXY/////////////
            console.log(`REVISANDO A => ${user.username}`);

            user.megasGastadosinBytes > 0 &&
              (await RegisterDataUsersCollection.insert({
                userId: user._id,
                type: "proxy",
                megasGastadosinBytes: user.megasGastadosinBytes,
                megasGastadosinBytesGeneral:
                  user.megasGastadosinBytesGeneral,
              }));

            user.vpnMbGastados > 0 &&
              (await RegisterDataUsersCollection.insert({
                userId: user._id,
                type: "vpn",
                vpnMbGastados: user.vpnMbGastados,
              }));

            ///////////////Dejar en cero el consumo de los usuarios
            await Meteor.users.update(user._id, {
              $set: {
                megasGastadosinBytes: 0,
                megasGastadosinBytesGeneral: 0,
                vpnMbGastados: 0,
              },
            });

            ////////////////Banear PROXY/////////////
            !user.isIlimitado &&
              user.baneado == false &&
              user.profile.role !== "admin" &&
              (await (Meteor.users.update(user._id, {
                $set: {
                  baneado: true,
                },
              }),
                LogsCollection.insert({
                  type: "Bloqueo Proxy",
                  userAfectado: user._id,
                  userAdmin: "server",
                  message:
                    "El server " +
                    process.env.ROOT_URL +
                    " Bloqueo automaticamente el proxy por ser dia Primero de cada Mes",
                }),
                Meteor.call(
                  "sendMensaje",
                  user,
                  {
                    text: `El server Bloqueo automaticamente el proxy a: ${user.profile.firstName} ${user.profile.lastName} por ser dia Primero de cada Mes`,
                  },
                  "VidKar Bloqueo de Proxy"
                )));
            ////////////////Banear VPN/////////////
            !user.vpnisIlimitado &&
              user.vpn == true &&
              user.profile.role !== "admin" &&
              (await (Meteor.users.update(user._id, {
                $set: {
                  vpn: false,
                },
              }),
                LogsCollection.insert({
                  type: "VPN",
                  userAfectado: user._id,
                  userAdmin: "server",
                  message: `El server ${process.env.ROOT_URL} Desactivó la VPN para ${user.profile.firstName} ${user.profile.lastName} dia Primero de cada Mes`,
                }),
                Meteor.call(
                  "sendMensaje",
                  user,
                  {
                    text: `El server Desactivó la VPN para ${user.profile.firstName} ${user.profile.lastName} por ser dia Primero de cada Mes`,
                  },
                  "VidKar Bloqueo de VPN"
                )));
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

  try {
    //////////////////Banear proxy ///////////////////
    cron
      .schedule(
        "0-59 * * * *",
        async () => {
          let users = await Meteor.users.find({ baneado: false }, {
            fields: {
              _id: 1,
              profile: 1,
              isIlimitado: 1,
              fechaSubscripcion: 1,
              megasGastadosinBytes: 1,
              megas: 1,
              baneado: 1,
              bloqueadoDesbloqueadoPor: 1,
              emails: 1,
            }
          });
          await users.forEach((user) => {
            // !(user.username == "carlosmbinf") &&
            // user.profile.role != "admin" &&
            (user.isIlimitado
              ? new Date() >=
              new Date(
                user.fechaSubscripcion
                  ? user.fechaSubscripcion
                  : new Date()
              ) &&
              !user.baneado &&
              (Meteor.users.update(user._id, {
                $set: { baneado: true },
              }),
                (LogsCollection.insert({
                  type: "Bloqueo Proxy",
                  userAfectado: user._id,
                  userAdmin: "server",
                  message:
                    "El server " + process.env.ROOT_URL + " Bloqueo automaticamente el proxy porque llego a la fecha limite"
                })),
                Meteor.call("sendMensaje",
                  user,
                  {
                    text: `El server ${process.env.ROOT_URL} Bloqueo automaticamente el proxy de ${user.profile.firstName} ${user.profile.lastName}  porque llego a la fecha limite.`,
                  },
                  'VidKar Bloqueo de Proxy')
              )
              : (user.megasGastadosinBytes ? user.megasGastadosinBytes : 0) >= ((user.megas ? Number(user.megas) : 0) * 1024000) &&
              !user.baneado &&
              (Meteor.users.update(user._id, {
                $set: { baneado: true },
              }),
                LogsCollection.insert({
                  type: "Bloqueo Proxy",
                  userAfectado: user._id,
                  userAdmin: "server",
                  message:
                    "El server " + process.env.ROOT_URL + " Bloqueo automaticamente el proxy porque consumio: " + user.megas + " MB"
                }), Meteor.call("sendMensaje",
                  user,
                  {
                    text: `El server  ${process.env.ROOT_URL} Bloqueo automaticamente el proxy a: ${user.profile.firstName} ${user.profile.lastName} porque consumio: ${user.megas} MB`,
                  },
                  'VidKar Bloqueo de Proxy')
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

  try {
    //////////Banear VPN //////////////
    cron
      .schedule(
        "0-59 * * * *",
        async () => {
          let users = await Meteor.users.find({ vpn: true }
            , {
              fields: {
                _id: 1,
                vpnMbGastados: 1,
                profile: 1,
                vpnmegas: 1,
                vpn: 1,
                bloqueadoDesbloqueadoPor: 1,
                emails: 1,
                vpnisIlimitado: 1,
                vpnfechaSubscripcion: 1
              }
            }
          );
          await users.map((user) => {
            // (new Date(new Date()) > user.vpnfechaSubscripcion) &&  console.log(user)
            // console.log(new Date(new Date()));
            // console.log(user.vpnfechaSubscripcion);
            // console.log((new Date(new Date()) > user.vpnfechaSubscripcion))
            // !(user.username == "carlosmbinf") &&
            user.vpnisIlimitado && user.vpnfechaSubscripcion &&
              new Date(new Date()) > user.vpnfechaSubscripcion &&
              (Meteor.users.update(user._id, {
                $set: { vpn: false },
              }), LogsCollection.insert({
                type: "Bloqueo VPN",
                userAfectado: user._id,
                userAdmin: "server",
                message:
                  "El server " + process.env.ROOT_URL + " Bloqueo automaticamente la VPN porque llego a la fecha limite"
              }))
            try {
              user.vpnisIlimitado && user.vpnfechaSubscripcion &&
                new Date(new Date()) > user.vpnfechaSubscripcion &&
                Meteor.call("sendMensaje",
                  user,
                  {
                    text: `El server Bloqueo automaticamente la VPN a: ${user.profile.firstName} ${user.profile.lastName} porque paso la fecha limite: ${user.vpnfechaSubscripcion}`,
                  },
                  'VidKar Bloqueo de VPN')
            } catch (error) {
              console.log("NO SE PUDO ENVIAR EL EMAIL")
            }



            !user.vpnisIlimitado && (user.vpnMbGastados ? user.vpnMbGastados : 0) >= ((user.vpnmegas ? Number(user.vpnmegas) : 0) * 1024000) &&
              (Meteor.users.update(user._id, {
                $set: { vpn: false },
              }),
                LogsCollection.insert({
                  type: "Bloqueo VPN",
                  userAfectado: user._id,
                  userAdmin: "server",
                  message:
                    "El server " + process.env.ROOT_URL + " Bloqueo automaticamente la VPN porque consumio: " + user.vpnmegas + " MB"
                }), Meteor.call("sendMensaje",
                  user,
                  {
                    text: `El server Bloqueo automaticamente la VPN a: ${user.profile.firstName} ${user.profile.lastName} porque consumio sus: ${user.vpnmegas} MB`,
                  },
                  'VidKar Bloqueo de VPN')
              );
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

  try {
    //////////ACTUALIZAR TRAILERS //////////////
    cron
      .schedule(
        "0 * * * *",
        async () => {
           try {
            const IMDb = await require('imdb-light');

            await PelisCollection.find({}, { fields: { _id: 1, nombrePeli: 1, idimdb: 1 } }).forEach(async (peli) => {

              await console.log(`Actualizando a ${peli.nombrePeli}`)

               peli.idimdb && await IMDb.trailer(peli.idimdb,  (url) => {
                   console.log(peli.nombrePeli + " => Actualizando URL Pelicula")  // output is direct mp4 url (also have expiration timeout)

                   url && PelisCollection.update(
                     { _id: peli._id },
                     {
                       $set: {
                         urlTrailer: url
                         // clasificacion: details.Genres.split(", ")
                       },
                     }
                   );
               })

             })

          } catch (error) {

          }

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

}