import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { NotificacionUsersConectadosVPNCollection } from '/imports/ui/pages/collections/collections';



Meteor.startup(() => {
    console.log("INICIANDO OBSERVERS");
    const Users = Meteor.users;
    Users.find({ vpn: true },{fields:{vpnplusConnected:1,_id:1}}).observeChanges({ //observeChangesAsync
        changed: async (id, fields) => {
            console.log("Hubo un cambio en el usuario con id: " + id);
            if ('vpnplusConnected' in fields) { //vpnplusConnected
                console.log("id: ", id, " fields" , fields)
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
        },

    });
});
