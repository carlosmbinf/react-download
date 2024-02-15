import { Meteor } from "meteor/meteor";
import { LogsCollection, PelisCollection, RegisterDataUsersCollection, VentasCollection } from "../imports/ui/pages/collections/collections";
import moment from 'moment';

var cron = require("node-cron");

///////METODOS//////

const reiniciarConsumoYGuardarDatos = async () => {
  console.log(`Reiniciar Consumo - DATE: ${new Date()}`);
  let users = await Meteor.users.find({
    $or: [
      // { baneado: false },
      { megasGastadosinBytes: { $gte: 1 } },
      { megasGastadosinBytesGeneral: { $gte: 1 } },
      // { vpn: true },
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
        vpnMbGastados: user.vpnMbGastados
      }));

    ///////////////Dejar en cero el consumo de los usuarios
    await Meteor.users.update(user._id, {
      $set: {
        megasGastadosinBytes: 0,
        megasGastadosinBytesGeneral: 0,
        vpnMbGastados: 0
      },
    });

    
  });
}


////////////////CRONES////////////

if (Meteor.isServer) {
  console.log("Cargando Tareas...");

  try {
    cron
      .schedule(
        // "1-59 * * * *",
        "0 0 1 1-12 *",
        reiniciarConsumoYGuardarDatos,
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
          
          await users.forEach(async (user) => {
            const ultimaVentaProxy = getLastPurchaseDate(user._id, 'PROXY'); // Función para obtener la última compra de proxy
            const haceUnMes = ultimaVentaProxy ? moment(ultimaVentaProxy).add(1, 'months') < moment(new Date()) : false;
            // console.log("PROXY HACE UN MES? " + haceUnMes + " ultimaVentaProxy" + ultimaVentaProxy)
            if (user.isIlimitado && user.fechaSubscripcion && new Date() >= new Date(user.fechaSubscripcion)) {
              await bloquearUsuarioProxy(user, "porque llegó a la fecha límite");
            } else if (!user.isIlimitado) {
              const megasGastados = user.megasGastadosinBytes ? user.megasGastadosinBytes / 1024000 : 0;
              const megasContratados = user.megas ? Number(user.megas) : 0;
              if ((megasGastados >= megasContratados || haceUnMes) && !user.baneado) {
                let motivo = "";
                if (megasGastados >= megasContratados) {
                  motivo = `porque consumió ${megasContratados} MB`;
                }
                if (haceUnMes) {
                  motivo += motivo ? " y " : "";
                  motivo += "hace más de un mes desde la última compra";
                }
                await bloquearUsuarioProxy(user, motivo);
              }
            }
          });
          
          function getLastPurchaseDate(userId, type) {
            const ventas = VentasCollection.find({ userId, type }, { sort: { createdAt: -1 }, limit: 1 }).fetch();
            return ventas.length > 0 ? new Date(ventas[0].createdAt) : null;
          }
          
          async function bloquearUsuarioProxy(user, motivo) {
            if (!user) return; // Validación contra null
            await Meteor.users.update(user._id, { $set: { baneado: true } });
            LogsCollection.insert({
              type: "Bloqueo Proxy",
              userAfectado: user._id,
              userAdmin: "server",
              message: `El servidor ${process.env.ROOT_URL} bloqueó automáticamente el proxy ${motivo}`,
            });
            try {
              await Meteor.call("sendMensaje", user, {
                text: `El servidor ${process.env.ROOT_URL} bloqueó automáticamente el proxy de ${user.profile.firstName} ${user.profile.lastName} ${motivo}`,
              }, 'VidKar Bloqueo de Proxy');
            } catch (error) {
              console.log("Error al enviar el mensaje: ", error);
            }
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

  try {
    //////////Banear VPN //////////////
    cron
      .schedule(
        "0-59 * * * *",
        async () => {
          let users = await Meteor.users.find({ vpn: true }, {
            fields: {
              _id: 1,
              profile: 1,
              vpnisIlimitado: 1,
              vpnfechaSubscripcion: 1,
              vpnMbGastados: 1,
              vpnmegas: 1,
              vpn: 1,
              bloqueadoDesbloqueadoPor: 1,
              emails: 1,
            }
          });
          
          await users.forEach((user) => {
            const ultimaVentaVPN = getLastPurchaseDate(user._id, 'VPN'); // Función para obtener la última compra de VPN
            const haceUnMes = ultimaVentaVPN ? moment(ultimaVentaVPN).add(1, 'months') < moment(new Date()) : false;
            // console.log("VPN HACE UN MES? " + haceUnMes + " ultimaVentaVPN: " + ultimaVentaVPN)
            if (user.vpnisIlimitado && user.vpnfechaSubscripcion && new Date() > user.vpnfechaSubscripcion) {
              bloquearUsuarioVPN(user, "porque llegó a la fecha límite");
            } else if (!user.vpnisIlimitado && (user.vpnMbGastados ? user.vpnMbGastados : 0) >= ((user.vpnmegas ? Number(user.vpnmegas) : 0) * 1024000)) {
              bloquearUsuarioVPN(user, `porque consumió ${user.vpnmegas} MB`);
            } else if (haceUnMes) {
              bloquearUsuarioVPN(user, "hace más de un mes desde la última compra");
            }
          });
          
          function getLastPurchaseDate(userId, type) {
            const ventas = VentasCollection.find({ userId, type }, { sort: { createdAt: -1 }, limit: 1 }).fetch();
            return ventas.length > 0 ? new Date(ventas[0].createdAt) : null;
          }
          
          function bloquearUsuarioVPN(user, motivo) {
            if (!user) return; // Validación contra null
            if (!user.vpn) return; // Si esta bloqueada la VPN que no actualice nada
            Meteor.users.update(user._id, { $set: { vpn: false } });
            LogsCollection.insert({
              type: "Bloqueo VPN",
              userAfectado: user._id,
              userAdmin: "server",
              message: `El servidor ${process.env.ROOT_URL} bloqueó automáticamente la VPN ${motivo}`,
            });
            try {
              Meteor.call("sendMensaje", user, {
                text: `El servidor ${process.env.ROOT_URL} bloqueó automáticamente la VPN de ${user.profile.firstName} ${user.profile.lastName} ${motivo}`,
              }, 'VidKar Bloqueo de VPN');
            } catch (error) {
              console.log("Error al enviar el mensaje: ", error);
            }
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

              peli.idimdb && await IMDb.trailer(peli.idimdb, (url) => {
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

  try {
    //////////ACTUALIZAR TRAILERS //////////////
    cron
      .schedule(
        "30 0 * * *",
        async () => {
          try {
            await Meteor.call('closeproxy', function (error, result) {
              console.log(`${result} a las ${new Date()}`)
            });

            await Meteor.call('listenproxy', function (error, result) {
              console.log(`${result} a las ${new Date()}`)
            });

          } catch (error) {
            console.log(error)
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

