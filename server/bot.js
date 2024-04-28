import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { Meteor } from 'meteor/meteor'

console.log(`Cargando Bot Telegram vidkar_bot +${Meteor.settings.public.tokenBotTelegram}`)
const bot = new Telegraf(Meteor.settings.public.tokenBotTelegram)
bot.start((ctx) => {
    const cuidadoEmoji = '⚠️'; // Código Unicode del emoji de "cuidado"
    console.log(`message{`)
    console.log(ctx.message)
    console.log(`}`)
    console.log(`--------------------------------------`)
    // Explicit usage
    ctx.reply(`Welcome! ${ctx.message.from.first_name} ${ctx.message.from.last_name}`)
    ctx.reply(`Vamos a comenzar a vincular su usuario de Telegram con su cuenta de VidKar`)
    ctx.reply(`Si es tan amable, inserte su usuario de VidKar de la siguiente manera: \n/vincular_usuario usuario_vidkar`)
    ctx.reply(`Verifique las mayusculas y minusculas Por favor!!! ${cuidadoEmoji}`);



})
bot.command(['quit'], async (ctx) => {
    // Explicit usage
    console.log(`message{`)
    console.log(ctx.message)
    console.log(`}`)
    console.log(`--------------------------------------`)

    // await ctx.telegram.leaveChat(ctx.message.chat.id)

    // Using context shortcut
    await ctx.leaveChat()
})

bot.command('poll', async (ctx) => {
    const pollQuestion = '¿Cuál es tu color favorito?';
    const pollOptions = [
      'Azul',
      'Rojo',
      'Verde',
      'Amarillo',
    ];
    const isAnonymous = false; // Indica si la encuesta es anónima
    await ctx.replyWithPoll(pollQuestion, pollOptions, {
        is_anonymous: isAnonymous
      });
        // Explicit usage
        console.log(`message{`)
        console.log(ctx.message)
        console.log(`}`)
        console.log(`--------------------------------------`)

});

bot.command('vincular_usuario', async (ctx) => {
    const match = ctx.payload.split(' '); // Dividir el comando en partes

    if (match != null && match.length == 1 && match[0] != "") {
        const nombreUsuario = match[0]; // Obtener el segundo valor (nombre de usuario)

        // Procesar el nombre de usuario y realizar la acción deseada
        console.log(`Usuario: (${nombreUsuario})`);

        var usuarios = Meteor.users.findOne({username:nombreUsuario}, { fields: { username: 1, _id:1, idtelegram:1 } })
        let existe = usuarios != null
        !existe && ctx.reply(`el usuario no existe, debe registrarse primero en VidKar, \nsi ya lo hizo verifique que el usuario sea correcto`);
        try {
            existe && await Meteor.users.update(usuarios._id, { $set: { idtelegram: ctx.message.from.id } })
            console.log(await Meteor.call('registrarLog', 'IdTelegram', usuarios._id,"SERVER", `Se cambio el id de telegram de (${usuarios.idtelegram}) => (${ctx.message.from.id})`));
            existe && ctx.reply(`Listo, quedo registrado el usuario ${nombreUsuario} con el id de telegram ${ctx.message.from.id}`)
        } catch (error) {
            existe && ctx.reply(`No se pudo vincular la cuenta ${nombreUsuario} con el id de telegram ${ctx.message.from.id} contacte al Administrador`)
        }
       
        // Puedes realizar acciones como:
        // - Consultar la base de datos para obtener el consumo de datos del usuario
        // - Enviar un mensaje al usuario con información sobre su consumo
        // - Realizar otras acciones relacionadas con el consumo de datos del usuario
    } else {
      // Enviar un mensaje de error si el comando no tiene el formato correcto
      await ctx.reply('Comando inválido. Use\n/vincular_usuario NOMBRE_USUARIO.');
    }
  });
bot.command('consumo_vpn', async (ctx) => {
    const match = ctx.payload.split(' '); // Dividir el comando en partes

    if (match != null && match.length == 1 && match[0] != "") {
        const nombreUsuario = match[0]; // Obtener el segundo valor (nombre de usuario)

        // Procesar el nombre de usuario y realizar la acción deseada
        console.log(`Usuario: (${nombreUsuario})`);

        var usuario = Meteor.users.findOne({username:nombreUsuario}, { fields: { username: 1, _id:1, vpnMbGastados:1, idtelegram:1 } })
        let existe = usuario != null
        let tieneIdTelegram = existe && usuario.idtelegram != null && usuario.idtelegram != ""
        let idTelegramEsCorrecto = tieneIdTelegram && usuario.idtelegram == ctx.message.from.id
        let tieneConsumoDeDatos = idTelegramEsCorrecto && usuario.vpnMbGastados != null && usuario.vpnMbGastados != 0
        if (tieneConsumoDeDatos) {
            ctx.reply(`Consumo VPN:\n${((usuario.vpnMbGastados ? usuario.vpnMbGastados : 0) / 1024000).toFixed(2)}Mb\n${((usuario.vpnMbGastados ? usuario.vpnMbGastados : 0) / 1024000000).toFixed(2)}Gb`)
        } else {
            if (!existe) {
                ctx.reply(`el usuario no existe, debe registrarse primero en VidKar, \nsi ya lo hizo verifique que el usuario sea correcto`);
            } else if (!tieneIdTelegram) {
                ctx.reply(`el usuario no tiene vinculado su ID de telegram, por favor vinculelo primero`);
            } else if (!idTelegramEsCorrecto) {
                ctx.reply(`No tiene acceso a esta información, por favor verifique que el usuario sea correcto`);
            }else if(!tieneConsumoDeDatos){
                ctx.reply(`No ha consumido datos de VPN`)
            }
        }
        // Puedes realizar acciones como:
        // - Consultar la base de datos para obtener el consumo de datos del usuario
        // - Enviar un mensaje al usuario con información sobre su consumo
        // - Realizar otras acciones relacionadas con el consumo de datos del usuario
    } else {
      // Enviar un mensaje de error si el comando no tiene el formato correcto
      await ctx.reply('Comando inválido. Use: \n/consumo_vpn NOMBRE_USUARIO.');
    }
  });

//si el texto es igual a la palabra clave se ejecuta la accion
bot.on('text', async (ctx) => {
   ctx.reply(`Comando no reconocido, por favor verifique el comando y vuelva a intentarlo`);
});

bot.on('poll_answer', async (ctx) => {
    const pollUpdate = ctx.update;
    // const pollId = pollUpdate;
    // const messageId = pollUpdate.message_id;
    // const chatId = pollUpdate.chat_id;
  console.log(`message{`)
    console.log(ctx)
    console.log(`}`)
    console.log(`--------------------------------------`)
    // Procesar el evento de cambio de la encuesta
    // console.log(`Evento de cambio en la encuesta: ${pollId} (mensaje: ${messageId}, chat: ${chatId})`);
  
    // Aquí puedes agregar tu código personalizado para manejar el evento, como:
    // - Registrar los votos
    // - Enviar mensajes de notificación
    // - Actualizar la información de la encuesta
  });

//si el usuario envia un mensaje de texto se ejecuta la accion
bot.on('text', async (ctx) => {

    const messageText = ctx.message.text;

    if (messageText.toLowerCase().includes('palabra')) {
        // Ejecutar código cuando se detecte la palabra clave
        console.log('¡Se encontró la palabra clave!');
        // Aquí puedes agregar tu código personalizado, como enviar una respuesta, realizar una acción, etc.
    }
});

//si el usuario envia un sticker se ejecuta la accion
bot.on('sticker', async (ctx) => {
    const messageText = ctx.message;
    console.log(`message{`)
    console.log(ctx.message)
    console.log(`}`)
    console.log(`--------------------------------------`)
});

bot.mention('vidkar_bot', (ctx) => {
    // Explicit usage
    console.log(`message{`)
    console.log(ctx.message)
    console.log(`}`)
    console.log(`--------------------------------------`)
});
bot.phone('+1-541-754-3010', (ctx) => {
    // Explicit usage
    console.log(`message{`)
    console.log(ctx.message)
    console.log(`}`)
    console.log(`--------------------------------------`)
});

bot.hashtag('vidkar_bot', (ctx) => {
    // Explicit usage
    console.log(`message{`)
    console.log(ctx.message)
    console.log(`}`)
    console.log(`--------------------------------------`)
});

// bot.on(message('text'), async (ctx) => {
//     // Explicit usage
//     console.log(`message{`)
//     console.log(ctx.message)
//     console.log(`}`)
//     console.log(`--------------------------------------`)

//     // await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.message.from.username}`)

//     // Using context shortcut
//     await ctx.reply(`Hello ${ctx.message.from.username}`)
// })

// bot.on('callback_query', async (ctx) => {
//     // Explicit usage
//     console.log(`message{`)
//     console.log(ctx.callbackQuery)
//     console.log(`}`)
//     console.log(`--------------------------------------`)

//     await ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

//     // Using context shortcut
//     await ctx.answerCbQuery()
// })

// bot.on('inline_query', async (ctx) => {
//     const result = []
//     console.log(`message{`)
//     console.log(ctx.inlineQuery)
//     console.log(`}`)
//     console.log(`--------------------------------------`)
//     // Explicit usage
//     await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

//     // Using context shortcut
//     await ctx.answerInlineQuery(result)
// })

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))