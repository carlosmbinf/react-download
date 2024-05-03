import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { Meteor } from 'meteor/meteor'

console.log(`Cargando Bot Telegram vidkar_bot +${Meteor.settings.public.tokenBotTelegram}`)
const bot = new Telegraf(Meteor.settings.public.tokenBotTelegram)

if (Meteor.isServer) {

    Meteor.methods({
        enviarMensajeTelegram: async (type, userId, message,ventaComentario) => {
            try {
                let usuarioAfect = Meteor.users.findOne(userId);
                let administrador = usuarioAfect ? Meteor.users.findOne(usuarioAfect.bloqueadoDesbloqueadoPor) : null;

                console.log(`Enviando mensaje Telegram:\n Usuario Afectado: ${usuarioAfect.username} - Admin: ${administrador.username} - Message: ${message}`)
                if (usuarioAfect && administrador != null && usuarioAfect._id != administrador._id) {
                    //enviarMensajeTelegram: async (idtelegram, message)
                    bot.telegram.sendMessage(usuarioAfect.idtelegram, type != 'VENTAS' ? message : ventaComentario)
                }
                
                if (administrador) {
                    //enviarMensajeTelegram: async (idtelegram, message)
                    let mensaje = `${type}\nAdmin: ${administrador.username}\nUsuario: ${usuarioAfect.username}\nMensaje: \n${message}\n${ventaComentario?'Comentario de la venta: '+ventaComentario:''}`
                    bot.telegram.sendMessage(administrador.idtelegram, mensaje)
                }

                Array(Meteor.settings.public.administradores).forEach(async (admin) => {
                    let adminGeneral = Meteor.users.findOne({ username: admin });
                    //enviarMensajeTelegram: async (idtelegram, message)
                    let mensaje = `${type}\nAdmin: ${administrador.username}\nUsuario: ${usuarioAfect.username}\nMensaje: \n${message}\n${ventaComentario?'Comentario de la venta: '+ventaComentario:''}`
                    adminGeneral && adminGeneral.idtelegran && bot.telegram.sendMessage(adminGeneral.idtelegram, mensaje)
                    // Meteor.call('enviarMensajeTelegram', admin, message)
                });



                //Enviar mensaje con "telegraf": "^4.16.3",

            } catch (error) {
                console.error(error);
            }
        },
    });

}
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))