import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { Meteor } from "meteor/meteor";

console.log(
  `Cargando Bot Telegram vidkar_bot +${Meteor.settings.public.tokenBotTelegram}`
);
const bot = new Telegraf(Meteor.settings.public.tokenBotTelegram);

const buscarUsuarioPorNombre = async (nombreUsuario) => {
  return await Meteor.call("getusers", { username: nombreUsuario });
};
const buscarUsuarioPoridtelegram = async (id) => {
  return await Meteor.call("getusersAll", { idtelegram: id });
};
const buscarAdminPrincipal = async () => {
  return await Meteor.call("getAdminPrincipal");
};
const actualizarUsuario = async (id, cambio) => {
  return await Meteor.call("updateUsersAll", id, cambio);
};
const registrarLog = async (campo, idUsuarioAfectado, admin, mensaje) => {
  await Meteor.call("registrarLog", campo, idUsuarioAfectado, admin, mensaje);
};

const estaRegistrado = async (campo, idTelegram) => {
  await Meteor.call("estaRegistradoEnTelegram", idTelegram);
};

const registrarUser = async (ctx) => {
    // Obtener la respuesta del usuario
    const nombreUsuario = ctx.message.text;
    // Procesar el nombre de usuario y realizar la acción deseada
    console.log(
      `Registro de Usuario: (${nombreUsuario}) con id: (${ctx.chat.id})`
    );

    let usuarios = await buscarUsuarioPorNombre(nombreUsuario);

    let existe = usuarios != null && usuarios.length > 0;
    if (existe) {
      try {
        await actualizarUsuario(usuarios[0]._id, { idtelegram: ctx.chat.id });
        await registrarLog(
          "IdTelegram",
          usuarios[0]._id,
          "SERVER",
          `Se cambio el id de telegram de (${usuarios[0].idtelegram}) => (${ctx.chat.id})`
        );
        ctx.reply(
          `Listo, quedo registrado el usuario ${nombreUsuario} con el id de telegram ${ctx.chat.id}`
        );
      } catch (error) {
        ctx.reply(
          `No se pudo vincular la cuenta ${nombreUsuario} con el id de telegram ${ctx.chat.id} contacte al Administrador`
        );
      }
    } else {
      ctx.reply(
        `el usuario no existe, debe registrarse primero en VidKar, \nsi ya lo hizo verifique que el usuario sea correcto`
      );
    }

    // Procesar la respuesta según la opción seleccionada
    // if (respuesta === 'Opción 1') {
    //     // Actualizar el estado de la conversación
    //     state[ctx.message.chat.id] = 'esperando_dato_opcion_1';
    //     await ctx.reply('Por favor, ingresa el dato relacionado con la Opción 1:');
    // } else if (respuesta === 'Opción 2') {
    //     // Actualizar el estado de la conversación
    //     state[ctx.message.chat.id] = 'esperando_dato_opcion_2';
    //     await ctx.reply('Por favor, ingresa el dato relacionado con la Opción 2:');
    // }
}

if (Meteor.isServer) {
  Meteor.methods({
    enviarFileTelegram: async (type, message, file) => {
      try {
        let adminGeneral = await buscarAdminPrincipal();
         if(adminGeneral && adminGeneral.idtelegram){
          console.log(`Enviando mensaje Telegram:\n Admin General: ${adminGeneral.username} - Message: ${message}`);
          console.log(file.byteLength);
          //Leyendo el Buffer de Uint8Array file
          const buffer = Buffer.from(file);
          await bot.telegram.sendMessage(adminGeneral.idtelegram, message);
          await bot.telegram.sendVoice(adminGeneral.idtelegram, {
            source: buffer,
            filename: message,
          });
          console.log(buffer)
         }

      } catch (error) {
        console.error(error);
      }
    },
    enviarMensajeTelegram: async (type, userId, message, ventaComentario) => {
      try {
        let usuarioAfect = userId ? await Meteor.users.findOne(userId) : null;
        let administrador = usuarioAfect
          ? await Meteor.users.findOne(usuarioAfect.bloqueadoDesbloqueadoPor)
          : null;
        let adminGeneral = await buscarAdminPrincipal();

       
        //ENVIAR MENSAJE A USUARIO AFECTADO
        if (
          usuarioAfect && usuarioAfect.idtelegram &&  usuarioAfect.notificarByTelegram && 
          (administrador == null || usuarioAfect._id != administrador._id)
        ) {
          console.log(
            `Enviando mensaje Telegram:\n Usuario Afectado: ${
              usuarioAfect.username
            } - Admin: ${
              administrador ? administrador.username : "N/A"
            } - Message: ${message}`
          );
          bot.telegram.sendMessage(
            usuarioAfect.idtelegram,
            type != "VENTAS" ? message : ventaComentario
          );
        }


        //ENVIAR MENSAJE A ADMINISTRADOR DEL USUARIO AFECTADO
        if (administrador && administrador.idtelegram && administrador.notificarByTelegram && usuarioAfect) {
          let mensaje = `${type}\nAdmin: ${administrador.username}\nUsuario: ${
            usuarioAfect.username
          }\nMensaje: \n${message}\n${
            ventaComentario ? "Comentario de la venta: " + ventaComentario : ""
          }`;
          bot.telegram.sendMessage(administrador.idtelegram, mensaje);
        }

        //ENVIAR MENSAJE A ADMINISTRADOR GENERAL
        if (
          adminGeneral && adminGeneral.idtelegram && adminGeneral.notificarByTelegram && usuarioAfect &&
          (administrador == null || adminGeneral._id != administrador._id)
        ) {

          let mensaje = `${type}\nAdmin: ${administrador ? administrador.username: "N/A"}\nUsuario: ${
            usuarioAfect.username
          }\nMensaje: \n${message}\n${
            ventaComentario ? "Comentario de la venta: " + ventaComentario : ""
          }`;

            await bot.telegram.sendMessage(adminGeneral.idtelegram, mensaje);
        }


         //ENVIAR MENSAJE SOLO A ADMINISTRADOR para - Capitulo Nuevo Registrado
         if (type == "Capitulo Nuevo Registrado") {
           //id Telegram  no null
           Meteor.users
             .find({ 'profile.role': "admin", idtelegram: { $ne: null, $ne: '' }, notificarByTelegram : true})
             .forEach((admin) => {
               let mensaje = `${type}\n${message}\n${
                 ventaComentario
                   ? "Comentario de la venta: " + ventaComentario
                   : ""
               }`;
               bot.telegram.sendMessage(admin.idtelegram, mensaje);
             });
         }

      } catch (error) {
        console.error(error);
      }
    },
    estaRegistradoEnTelegram: function (idTelegram) {
      return Meteor.users.find({ idtelegram: idTelegram }).count() > 0;
    },
  });
}

var state = [];

const property = {
  registrarse: "registrar_usuario",
  consumoVpn: "consumo_vpn",
  consumoProxy: "consumo_proxy",
  
};

///////metodos
var cambiarEstado = (id, estado) => {
  state[id] = estado;
};
var reiniciarEstado = (id) => {
  state[id] = null;
};

var getEstado = (id) => {
  return state[id];
};

//iconos
const cuidadoEmoji = "⚠️"; // Código Unicode del emoji de "cuidado"

bot.start(async (ctx) => {
  try {
    // Explicit usage
    await ctx.reply(
      `Welcome! ${ctx.message.from.first_name} ${ctx.message.from.last_name}`
    );

    buscarUsuarioPoridtelegram(ctx.message.from.id).then(async (usuario) => {
      console.log(ctx.message.from.id);
      if (usuario != null && usuario.length > 0) {
        await ctx.reply(
          `Ya tiene vinculado su usuario de VidKar con su cuenta de Telegram`
        );
        await ctx.reply(
          `Su cuenta de Telegram esta vinculada al usuario de VidKar : ${usuario.map(
            (user) => user.username + " "
          )}`
        );

        let botones = [
          { text: "Consumo de VPN", callback_data: property.consumoVpn },
          { text: "Consumo de Proxy", callback_data: property.consumoProxy },
        ];

        // Send the message with the inline keyboard
        ctx.reply("Selecciona una opción:", {
          reply_markup: {
            inline_keyboard: [botones],
            one_time_keyboard: true,
          },
        });
      } else {
        await ctx.reply(
          `Vamos a comenzar a vincular su usuario de Telegram con su cuenta de VidKar`
        );
        let usuarios = await buscarUsuarioPoridtelegram(ctx.chat.id);
        let botones;

        botones = [
          { text: "Registrarse", callback_data: property.registrarse },
        ];

        // Send the message with the inline keyboard
        ctx.reply("Presione 👇 para comenzar:", {
          reply_markup: {
            inline_keyboard: [botones],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Comando para iniciar la conversación
bot.command("opciones", async (ctx) => {
  try {
    let usuarios = await buscarUsuarioPoridtelegram(ctx.chat.id);
    let botones;
    if (usuarios !== null && usuarios.length > 0) {
      botones = [
        { text: "Consumo de VPN", callback_data: property.consumoVpn },
        { text: "Consumo de Proxy", callback_data: property.consumoProxy },
      ];

      // Send the message with the inline keyboard
      ctx.reply("Selecciona una opción:", {
        reply_markup: {
          inline_keyboard: [botones],
          one_time_keyboard: true,
        },
      });
    } else {
      botones = [{ text: "Registrarse", callback_data: property.registrarse }];

      // Send the message with the inline keyboard
      ctx.reply("Selecciona una opción:", {
        reply_markup: {
          inline_keyboard: [botones],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });
    }

    // Establecer el estado de la conversación para esperar la siguiente respuesta
    // cambiarEstado(ctx.message.chat.id,'esperando_opcion');
  } catch (error) {
    console.log(error);
  }
});

// Manejar la respuesta del usuario después de seleccionar una opción
bot.on("text", async (ctx) => {
  try {
    const estado = await getEstado(ctx.chat.id);
    // Verificar el estado de la conversación
    if (estado === property.registrarse) {
      registrarUser(ctx)
    }
    reiniciarEstado(ctx.chat.id);
  } catch (error) {
    console.log(error);
  }
});

//cuando selecciona una opcion del teclado in linea
bot.on("callback_query", async (ctx) => {
  try {
    // Explicit usage
    let estado = ctx.callbackQuery.data;
    cambiarEstado(ctx.chat.id, estado);

    switch (estado) {
      case property.registrarse:
        ctx.reply(
          `Cual es tu usuario?\n${cuidadoEmoji}Ten cuidado con las Mayúsculas y minúsculas${cuidadoEmoji}`
        );
        break;
      case property.consumoVpn:
        const nombreUsuarioVpn = await buscarUsuarioPoridtelegram(ctx.chat.id); // Obtener el segundo valor (nombre de usuario)

        // Procesar el nombre de usuario y realizar la acción deseada
        var usuarioVPN = await buscarUsuarioPorNombre(
          nombreUsuarioVpn[0].username
        ); //{ username: nombreUsuarioVpn }, { fields: { username: 1, _id: 1, vpnMbGastados: 1, idtelegram: 1 } })
        let existeUsuarioVPN = usuarioVPN != null && usuarioVPN.length > 0;
        let tieneIdTelegramVpn =
          existeUsuarioVPN &&
          usuarioVPN[0].idtelegram != null &&
          usuarioVPN[0].idtelegram != "";
        let idTelegramEsCorrectoVpn =
          tieneIdTelegramVpn && usuarioVPN[0].idtelegram == ctx.chat.id;
        let tieneConsumoDeDatosVpn =
          idTelegramEsCorrectoVpn &&
          usuarioVPN[0].vpnMbGastados != null &&
          usuarioVPN[0].vpnMbGastados != 0;

        if (tieneConsumoDeDatosVpn) {
          ctx.reply(
            `Consumo VPN:\n${(
              (usuarioVPN[0].vpnMbGastados ? usuarioVPN[0].vpnMbGastados : 0) /
              1024000
            ).toFixed(2)}Mb\n${(
              (usuarioVPN[0].vpnMbGastados ? usuarioVPN[0].vpnMbGastados : 0) /
              1024000000
            ).toFixed(2)}Gb`
          );
        } else {
          if (!existeUsuarioVPN) {
            ctx.reply(
              `el usuario no existe, debe registrarse primero en VidKar, \nsi ya lo hizo verifique que el usuario sea correcto`
            );
          } else if (!tieneIdTelegramVpn) {
            ctx.reply(
              `el usuario no tiene vinculado su ID de telegram, por favor vinculelo primero`
            );
          } else if (!idTelegramEsCorrectoVpn) {
            ctx.reply(
              `No tiene acceso a esta información, por favor verifique que el usuario sea correcto`
            );
          } else if (!tieneConsumoDeDatosVpn) {
            ctx.reply(`No ha consumido datos de VPN`);
          }
        }

        break;
      case property.consumoProxy:
        const nombreUsuarioProxy = await buscarUsuarioPoridtelegram(
          ctx.chat.id
        ); // Obtener el segundo valor (nombre de usuario)

        // Procesar el nombre de usuario y realizar la acción deseada
        let usuarioProxy = await buscarUsuarioPorNombre(
          nombreUsuarioProxy[0].username
        ); //{ username: nombreUsuarioProxy }, { fields: { username: 1, _id: 1, vpnMbGastados: 1, idtelegram: 1 } })
        let existeProxy = usuarioProxy != null && usuarioProxy.length > 0;
        let tieneIdTelegramProxy =
          existeProxy &&
          usuarioProxy[0].idtelegram != null &&
          usuarioProxy[0].idtelegram != "";
        let idTelegramEsCorrectoProxy =
          tieneIdTelegramProxy && usuarioProxy[0].idtelegram == ctx.chat.id;
        let tieneConsumoDeDatosProxy =
          idTelegramEsCorrectoProxy &&
          usuarioProxy[0].megasGastadosinBytes != null &&
          usuarioProxy[0].megasGastadosinBytes != 0;

        if (tieneConsumoDeDatosProxy) {
          ctx.reply(
            `Consumo Proxy:\n${(
              (usuarioProxy[0].megasGastadosinBytes
                ? usuarioProxy[0].megasGastadosinBytes
                : 0) / 1024000
            ).toFixed(2)}Mb\n${(
              (usuarioProxy[0].megasGastadosinBytes
                ? usuarioProxy[0].megasGastadosinBytes
                : 0) / 1024000000
            ).toFixed(2)}Gb`
          );
        } else {
          if (!existeProxy) {
            ctx.reply(
              `el usuario no existe, debe registrarse primero en VidKar, \nsi ya lo hizo verifique que el usuario sea correcto`
            );
          } else if (!tieneIdTelegramProxy) {
            ctx.reply(
              `el usuario no tiene vinculado su ID de telegram, por favor vinculelo primero`
            );
          } else if (!idTelegramEsCorrectoProxy) {
            ctx.reply(
              `No tiene acceso a esta información, por favor verifique que el usuario sea correcto`
            );
          } else if (!tieneConsumoDeDatosProxy) {
            ctx.reply(`No ha consumido datos de Proxy`);
          }
        }

        break;
      default:
        break;
    }
    // muestra un mensaje en telegram
    // await ctx.answerCbQuery('PRUEBA',{text: 'Hello World!'})
  } catch (error) {
    console.log(error);
  }
});

// bot.on('inline_query', async (ctx) => {
//     const result = ["HOLA"]
//     console.log(`message{`)
//     console.log(ctx.inlineQuery)
//     console.log(`}`)
//     console.log(`--------------------------------------`)
//     // Explicit usage
//     // await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

//     // Using context shortcut
//     await ctx.answerInlineQuery(result)
// })

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
