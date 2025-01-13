import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import execute from "./Ejecutar";
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
} from "../imports/ui/pages/collections/collections";
import moment from "moment";

if (Meteor.isServer) {
  console.log("Cargando Métodos...");

  Meteor.methods({
    execute: async function (command) {
      try {
        let result = await execute(command);
        return result;
      } catch (error) {
        console.log(error.message);
        return error.message;
      }
    },

    sendemail: function (user, text, subject) {
      let admin = Meteor.users.findOne({
        _id: user.bloqueadoDesbloqueadoPor,
        "profile.role": "admin",
      });
      // let emails = (admin
      //   ? (admin.emails[0]
      //     ? (admin.emails[0].address
      //       ? ['carlosmbinf9405@icloud.com', admin.emails[0].address]
      //       : ['carlosmbinf9405@icloud.com'])
      //     : ['carlosmbinf9405@icloud.com']
      //   )
      //   : ['carlosmbinf9405@icloud.com'])
      let emails =
        admin &&
          admin.emails[0] &&
          admin.emails[0].address != "carlosmbinf@gmail.com"
          ? user.emails[0] && user.emails[0].address
            ? [
              "carlosmbinf@gmail.com",
              admin.emails[0].address,
              user.emails[0].address,
            ]
            : ["carlosmbinf@gmail.com", admin.emails[0].address]
          : user.emails[0] &&
            user.emails[0].address &&
            user.emails[0].address != "carlosmbinf@gmail.com"
            ? ["carlosmbinf@gmail.com", user.emails[0].address]
            : ["carlosmbinf@gmail.com"];
      require("gmail-send")({
        user: "carlosmbinf@gmail.com",
        pass: "Lastunas@123",
        to: emails,
        subject: subject,
      })(text, (error, result, fullResult) => {
        if (error) console.error(error);
        // console.log(result);
        console.log(fullResult);
      });
    },
    sendMensaje: function (user, text, subject) {
      MensajesCollection.insert({
        from: user.bloqueadoDesbloqueadoPor
          ? user.bloqueadoDesbloqueadoPor
          : Meteor.users.findOne({
            username: Array(Meteor.settings.public.administradores)[0][0],
          })._id,
        to: user._id,
        mensaje: text.text,
      });
      // console.log(text);
    },

    getDatosDashboardByUser: async (tipoDeDashboard, idUser) => {
      //tipoDeDashboard = "DIARIO" || "MENSUAL" || "HORA"
      const aporte = async (type, fechaStart, fechaEnd) => {
        // console.log("tipoDeDashboard: " + tipoDeDashboard);

        let totalConsumo = 0;
        let fechaInicial = new Date(fechaStart);
        let fechaFinal = new Date(fechaEnd);

        await RegisterDataUsersCollection.rawCollection()
          .aggregate([
            {
              $match: idUser
                ? {
                  userId: idUser,
                  fecha: {
                    $gte: new Date(fechaInicial),
                    $lte: new Date(fechaFinal),
                  },
                }
                : {
                  fecha: {
                    $gte: new Date(fechaInicial),
                    $lte: new Date(fechaFinal),
                  },
                },
            },
            {
              $group: {
                _id: "$userId", // Agrupar por userId
                totalBytesVPN: { $sum: "$vpnMbGastados" }, // Sumar los valores de vpnMbGastados
                totalBytesPROXY: { $sum: "$megasGastadosinBytes" }, // Sumar los valores de vpnMbGastados
              },
            },
            {
              $lookup: {
                from: "users", // Nombre de la colección users
                localField: "_id", // userId en registerDataUsers
                foreignField: "_id", // Campo _id en users
                as: "userInfo", // Nombre del campo que contendrá los datos relacionados
              },
            },
            {
              $unwind: "$userInfo", // Descomponer el array userInfo
            },
            {
              $project: {
                _id: 0,
                username: "$userInfo.username", // Proyectar username desde users
                totalBytesVPN: {
                  $round: [
                    { $divide: ["$totalBytesVPN", 1024000000] }, // Convertir de bytes a gigabytes
                    2, // Limitar a 2 decimales
                  ],
                },
                totalBytesPROXY: {
                  $round: [
                    { $divide: ["$totalBytesPROXY", 1024000000] }, // Convertir de bytes a gigabytes
                    2, // Limitar a 2 decimales
                  ],
                },
                fecha: fechaFinal
              },
            },
          ])
          .forEach((element) => {
            // console.log("element", element)
            let fechaElement = new Date(element.fecha);

            // if (element.type == type) {
            let suma;
            switch (type) {
              case "proxy":
                suma = element.totalBytesPROXY
                  ? element.totalBytesPROXY
                  : 0;
                break;
              case "vpn":
                suma = element.totalBytesVPN ? element.totalBytesVPN : 0;
              default:
                break;
            }

            fechaElement > fechaInicial &&
              fechaElement <= fechaFinal &&
            (totalConsumo += suma);
            // }
          });
          // console.log("SUMA " + type + ": ", totalConsumo, "FECHA INICIAL: ", fechaInicial, "FECHA FINAL: ", fechaFinal);

        return Number(( totalConsumo).toFixed(2));
      };

      let data01 = [];
      if (tipoDeDashboard == "HORA") {
        let dateStartDay = moment(new Date()).startOf("day");
        let dateEndDay = moment(new Date()).endOf("day");

        for (let hour = 0; hour < 24; hour++) {
          let dateStartHour = moment(dateStartDay).hour(hour).startOf("hour");
          let dateEndHour = moment(dateStartDay).hour(hour).endOf("hour");

          let hourlyData = {
            name: dateStartHour.format("HH:mm"),
            PROXY: await aporte(
              "proxy",
              dateStartHour.toISOString(),
              dateEndHour.toISOString()
            ),
            VPN: await aporte(
              "vpn",
              dateStartHour.toISOString(),
              dateEndHour.toISOString()
            ),
          };

          data01.push(hourlyData);
        }
      } else if (tipoDeDashboard == "DIARIO") {
        let dateStartMonth = moment(new Date()).startOf("month");
        let daysInMonth = dateStartMonth.daysInMonth();

        for (let day = 1; day <= daysInMonth; day++) {
          let dateStartDay = moment(dateStartMonth).date(day).startOf("day");
          let dateEndDay = moment(dateStartMonth).date(day).endOf("day");

          let dailyData = {
            name: dateStartDay.format("DD"),
            PROXY: await aporte(
              "proxy",
              dateStartDay.toISOString(),
              dateEndDay.toISOString()
            ),
            VPN: await aporte(
              "vpn",
              dateStartDay.toISOString(),
              dateEndDay.toISOString()
            ),
          };

          data01.push(dailyData);
        }
      } else if (tipoDeDashboard == "MENSUAL") {
        for (let month = 11; month >= 0; month--) {
          let dateStartMonth = moment(new Date())
            .startOf("month")
            .subtract(month, "months")
            .add(1, "days");
          let daysInMonth = dateStartMonth.daysInMonth();

          let monthlyData = {
            name: dateStartMonth.format("MM/YYYY"),
            PROXY: await aporte(
              "proxy",
              dateStartMonth.toISOString(),
              moment(dateStartMonth).endOf("month").add(1, "days").toISOString()
            ),
            VPN: await aporte(
              "vpn",
              dateStartMonth.toISOString(),
              moment(dateStartMonth).endOf("month").add(1, "days").toISOString()
            ),
          };

          data01.push(monthlyData);
        }
      }

      return data01;
    },
    actualizarEstadoServer: function (serverId, data) {
      ServersCollection.update(serverId, {
        $set: data ? data : { idUserSolicitandoReinicio: null, estado: 'ACTIVO' },
      });
    },
    getServer: function (ip) {
      return ServersCollection.findOne({ ip: ip });
    },

  });
}

//importar todos los .js de la carpeta metodos
import "./metodos/logs.js";
import "./metodos/peliculas.js";
import "./metodos/series.js";
import "./metodos/proxy.js";
import "./metodos/usuarios.js";
import "./metodos/ventas";
import "./metodos/vpn.js";
