import { Meteor } from "meteor/meteor";

    var cron = require("node-cron");

    if (Meteor.isServer) {


        try {
    
          
            
              cron
                .schedule(
                  "1 0 1 1-12 *",
                  async () => {
                    console.log(new Date())
                    let users = await Meteor.users.find({});
                    // await console.log("Count " + users.count());
                    // await console.log("running every minute to 1 from 5");
          
                    await users.fetch().map((user) => {
          
                      ////////////CONSUMOS/////////////
                      user.megasGastadosinBytes > 0 &&
                        RegisterDataUsersCollection.insert({
                          userId: user._id,
                          type: "proxy",
                          megasGastadosinBytes: user.megasGastadosinBytes,
                          megasGastadosinBytesGeneral: user.megasGastadosinBytesGeneral
                        }),
          
                        user.vpnMbGastados > 0 &&
                        RegisterDataUsersCollection.insert({
                          userId: user._id,
                          type: "vpn",
                          vpnMbGastados: user.vpnMbGastados
                        }),
          
                        ///////////////Dejar en cero el consumo de los usuarios
                        Meteor.users.update(user._id, {
                          $set: {
                            megasGastadosinBytes: 0,
                            megasGastadosinBytesGeneral: 0,
                            vpnMbGastados: 0
                          },
                        })
          
          
                      ////////////////Banear /////////////
                      user.isIlimitado == false && user.baneado == false && user.profile.role !== 'admin' &&
                        (Meteor.users.update(user._id, {
                          $set: {
                            baneado: true,
                          },
                        }),
                          LogsCollection.insert({
                            type: "Bloqueo Proxy",
                            userAfectado: user._id,
                            userAdmin: "server",
                            message:
                              "El server " +
                              process.env.ROOT_URL +
                              " Bloqueo automaticamente el proxy por ser dia Primero de cada Mes"
                          }),
                          sendemail(
                            user,
                            {
                              text:
                                "El server Bloqueo automaticamente el proxy a: " +
                                user.profile.firstName +
                                " " +
                                user.profile.lastName +
                                " por ser dia Primero de cada Mes ",
                            },
                            'VidKar Bloqueo de Proxy')
                        );
          
                        vpnisIlimitado == false && user.vpn == true && user.username !== 'carlosmbinf' &&
                        (Meteor.users.update(user._id, {
                          $set: {
                            vpn: false
                          },
                        }),
                          LogsCollection.insert({
                            type: "VPN",
                            userAfectado: user._id,
                            userAdmin: "server",
                            message:
                              `El server ${process.env.ROOT_URL} Desactivó la VPN para ${user.profile.firstName} ${user.profile.lastName} dia Primero de cada Mes`
                          }),
                          sendemail(
                            user,
                            {
                              text:
                                `El server Desactivó la VPN para ${user.profile.firstName} ${user.profile.lastName} dia Primero de cada Mes`,
                            },
                            'VidKar Bloqueo de VPN')
                        );
                    });
                  },
                  {
                    scheduled: true,
                    timezone: "America/Havana",
                  }
                )
                .start();
          
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
                    await users.forEach((user) => {
                      // !(user.username == "carlosmbinf") &&
                      // user.profile.role != "admin" &&
                        (user.isIlimitado
                          ? new Date() >=
                              new Date(
                                user.fechaSubscripcion
                                  ? user.fechaSubscripcion
                                  : new Date()
                              ) &&
                            !user.baneado &&
                            (Meteor.users.update(user._id, {
                              $set: { baneado: true},
                            }),
                            (LogsCollection.insert({
                              type: "Bloqueo Proxy",
                              userAfectado: user._id,
                              userAdmin: "server",
                              message:
                                "El server " + process.env.ROOT_URL +" Bloqueo automaticamente el proxy porque llego a la fecha limite"
                            })),
                            sendemail(
                              user,
                              {
                                text:    'El server ' + process.env.ROOT_URL +' Bloqueo automaticamente el proxy de ' + user.profile.firstName + " " + user.profile.lastName + ' porque llego a la fecha limite.' ,  
                              },
                              'VidKar Bloqueo de Proxy')
                            )
                          : (user.megasGastadosinBytes?user.megasGastadosinBytes:0) >= ((user.megas?Number(user.megas):0) * 1024000) &&
                            !user.baneado &&
                            (Meteor.users.update(user._id, {
                              $set: { baneado: true},
                            }),
                            LogsCollection.insert({
                              type: "Bloqueo Proxy",
                              userAfectado: user._id,
                              userAdmin: "server",
                              message:
                                "El server " + process.env.ROOT_URL +" Bloqueo automaticamente el proxy porque consumio: " + user.megas + " MB"
                            }),sendemail(
                              user,
                              {
                                text:    "El server " + process.env.ROOT_URL +" Bloqueo automaticamente el proxy a: " + user.profile.firstName + " " + user.profile.lastName + " porque consumio: " + user.megas + "MB",  
                              },
                              'VidKar Bloqueo de Proxy')
                            ));
                    });
                  },
                  {
                    scheduled: true,
                    timezone: "America/Havana",
                  }
                )
                .start();
          
                //////////Banear VPN //////////////
                cron
                .schedule(
                  "0-59 * * * *",
                  async () => {
                    let users = await Meteor.users.find({ vpn: true }
                      , {
                      fields: {
                        _id: 1,
                        vpnMbGastados: 1,
                        profile: 1,
                        vpnmegas: 1,
                        vpn: 1,
                        bloqueadoDesbloqueadoPor: 1,
                        emails: 1,
                        vpnisIlimitado: 1,
                        vpnfechaSubscripcion: 1
                      }
                    }
                    );
                    await users.map((user) => {
                      // (new Date(new Date()) > user.vpnfechaSubscripcion) &&  console.log(user)
                      // console.log(new Date(new Date()));
                      // console.log(user.vpnfechaSubscripcion);
                      // console.log((new Date(new Date()) > user.vpnfechaSubscripcion))
                      // !(user.username == "carlosmbinf") &&
                      user.vpnisIlimitado && user.vpnfechaSubscripcion &&
                      new Date(new Date()) > user.vpnfechaSubscripcion &&
                       (Meteor.users.update(user._id, {
                        $set: { vpn: false},
                      }), LogsCollection.insert({
                        type: "Bloqueo VPN",
                        userAfectado: user._id,
                        userAdmin: "server",
                        message:
                          "El server " + process.env.ROOT_URL +" Bloqueo automaticamente la VPN porque llego a la fecha limite"
                      }))
                      try {
                        user.vpnisIlimitado && user.vpnfechaSubscripcion &&
                      new Date(new Date()) > user.vpnfechaSubscripcion &&
                      sendemail(
                        user,
                        {
                          text: "El server Bloqueo automaticamente la VPN a: " + user.profile.firstName + " " + user.profile.lastName + " porque paso la fecha limite: " + user.vpnfechaSubscripcion,  
                        },
                        'VidKar Bloqueo de VPN')
                      } catch (error) {
                        console.log("NO SE PUDO ENVIAR EL EMAIL")
                      }
                      
                      
          
                     !user.vpnisIlimitado && (user.vpnMbGastados?user.vpnMbGastados:0) >= ((user.vpnmegas?Number(user.vpnmegas):0) * 1024000) &&
                            (Meteor.users.update(user._id, {
                              $set: { vpn: false},
                            }),
                            LogsCollection.insert({
                              type: "Bloqueo VPN",
                              userAfectado: user._id,
                              userAdmin: "server",
                              message:
                                "El server " + process.env.ROOT_URL +" Bloqueo automaticamente la VPN porque consumio: " + user.vpnmegas + " MB"
                            }),sendemail(
                              user,
                              {
                                text: "El server Bloqueo automaticamente la VPN a: " + user.profile.firstName + " " + user.profile.lastName + " porque consumio sus: " + user.vpnmegas + "MB",  
                              },
                              'VidKar Bloqueo de VPN')
                            );
                    });
                  },
                  {
                    scheduled: true,
                    timezone: "America/Havana",
                  }
                )
                .start();
          
          
                 //////////ACTUALIZAR TRAILERS //////////////
              cron
                .schedule(
                  "0,30 * * * *",
                 async () => {
          
                  const IMDb = await require('imdb-light');
          
                  await PelisCollection.find({}, { fields: {_id:1, nombrePeli:1, idimdb: 1 } }).map((peli) => {
                      try {
                        peli.idimdb && IMDb.trailer(peli.idimdb, (url) => {
                          console.log(peli.nombrePeli + " => Actualizando URL Pelicula")  // output is direct mp4 url (also have expiration timeout)
          
                          url && PelisCollection.update(
                            { _id: peli._id },
                            {
                              $set: {
                                urlTrailer: url,
                                fechaDeDescargaTriller: new Date()
                                // clasificacion: details.Genres.split(", ")
                              },
                            }
                          );
                        })
                      } catch (error) {
                        console.log(error)
                      }
          
          
          
                    })
          
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