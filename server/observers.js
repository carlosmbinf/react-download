import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { NotificacionUsersConectadosVPNCollection } from '/imports/ui/pages/collections/collections';

const Users = Meteor.users;

Meteor.startup(() => {
    console.log("INICIANDO OBSERVERS");
    Users.find({ vpn: true },{fields:{vpnplusConnected:1,_id:1}}).observeChanges({
        changed: async (id, fields) => {
            if ('vpnplusConnected' in fields) { //vpnplusConnected
                let usuario = Meteor.users.findOne(id, { fields: { _id: 1, username: 1, vpnplusConnected: 1, bloqueadoDesbloqueadoPor: 1 } });
                NotificacionUsersConectadosVPNCollection.find({ userIdConnected: id }).forEach(notifica => {
                    let usuarioAdmin = usuario && Meteor.users.findOne(notifica.adminIdSolicitud, { fields: { _id: 1, username: 1, vpnplusConnected: 1, idtelegram: 1 } });
                    if (usuarioAdmin && Meteor.callAsync("estaRegistradoEnTelegram", usuarioAdmin._id)) {
                        if (fields.vpnplusConnected) {
                            Meteor.callAsync("enviarMensajeDirecto", usuarioAdmin._id, notifica.mensajeaenviarConnected);
                        } else {
                            Meteor.callAsync("enviarMensajeDirecto", usuarioAdmin._id, notifica.mensajeaenviarDisconnected);
                        }
                    }
                })
            }
        }
    });
});
