import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { AudiosCollection } from "/imports/ui/pages/collections/collections";


if (Meteor.isServer) {
Meteor.methods({
  "enviarAudioFragmento"(fragmento,idUser) {
    if (!fragmento) throw new Meteor.Error("No hay datos de audio");

    console.log("Fragmento recibido");

    // Guardar en MongoDB
    AudiosCollection.upsertAsync({idUser:idUser}, {
      $set: {
        fragmento,
        idUser
      }
    });

    
  },
});

// Publicar en tiempo real
Meteor.publish("streamAudio", function (idUser) {
  return AudiosCollection.find({idUser:idUser}, { sort: { createdAt: -1 }, limit: 10 });
});
}

