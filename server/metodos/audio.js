import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { AudiosCollection } from "/imports/ui/pages/collections/collections";



Meteor.methods({
  "enviarAudioFragmento"(fragmento,idUser) {
    if (!fragmento) throw new Meteor.Error("No hay datos de audio");

    console.log("Fragmento recibido");

    // Guardar en MongoDB
    AudiosCollection.insert({
      fragmento,
      idUser
    });

    // Publicar en tiempo real
    Meteor.publish("streamAudio", function () {
      return AudiosCollection.find({}, { sort: { createdAt: -1 }, limit: 10 });
    });
  },
});
