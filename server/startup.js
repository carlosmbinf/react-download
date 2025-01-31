import { Meteor } from "meteor/meteor";

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
    RegisterDataUsersCollection
  } from "../imports/ui/pages/collections/collections";


    if (Meteor.isServer) {
        Meteor.startup(async () => {
            console.log("Iniciando Server Meteor...");

            /////// mover todas las imagenes para user.picture
            await Meteor.users.find({}).map(async (us) => {
              us.services && us.services.facebook && us.services.facebook.picture.data.url &&
                (await Meteor.users.updateAsync(us._id, { $set: { picture: us.services.facebook.picture.data.url } }))
        
                us.services && us.services.google && us.services.google.picture &&
                (await Meteor.users.updateAsync(us._id, { $set: { picture: us.services.google.picture } }))
            })
        
        
            process.env.ROOT_URL = Meteor.settings.public.ROOT_URL;
            // process.env.MONGO_URL = Meteor.settings.public.MONGO_URL;
        
            console.log("ROOT_URL: " + process.env.ROOT_URL);
            console.log("MONGO_URL: " + process.env.MONGO_URL);
        
           await  OnlineCollection.removeAsync({});
           // OnlineCollection.removeAsync({address: `127.0.0.1`});
        
           const settings = Meteor.settings;
        
           if (settings) {
           
           await  ServiceConfiguration.configurations.removeAsync({
              service: 'google'
            });
          
            await ServiceConfiguration.configurations.insertAsync({
              service: 'google',
              clientId: settings.google.client_id,
              secret: settings.google.client_secret,
              validClientIds: settings.google.validClientIds
            });
          
            await ServiceConfiguration.configurations.removeAsync({
                service: "facebook",
              });
          
              await ServiceConfiguration.configurations.insertAsync({
                service: "facebook",
                appId: settings.facebook.appId,
                secret: settings.facebook.secret,
              });
        
          }
            if ((await Meteor.users.find({ "profile.role": "admin" }).countAsync()) == 0) {
              console.log("CREANDO USER ADMIN");
              const user = {
                email: "carlosmbinf@gmail.com",
                password: "lastunas123",
                firstName: "Carlos",
                lastName: "Medina",
                role: "admin",
                creadoPor: "Server",
                baneado: false,
                edad: 26,
                username:"carlosmbinf"
              };
              try {
                Accounts.createUser(user);
                console.log("ADD OK");
              } catch (error) {
                console.log("NO SE PUDO CREAR EL USER ADMIN");
              }
            }
            console.log("YA HAY UN USER ADMIN");
            // const youtubedl = require('youtube-dl')
            // const url = 'http://www.youtube.com/watch?v=WKsjaOqDXgg'
            // youtubedl.exec(url, ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
            //   if (err) throw err
            //   // console.log(output.join('\n'))
            // })
          });
    }