import { Meteor } from 'meteor/meteor';
import { ArchivoCollection } from '../collections/collections';

import { WebApp } from "meteor/webapp"
import bodyParser from "body-parser"
import router from "router"
const endpoint = router()

function insertLink({ title, url }) {
  ArchivoCollection.insert({title, url, createdAt: new Date()});
}

if (Meteor.isClient){
    Group.subscription = Meteor.subscribe("links")
}



if (Meteor.isServer) {

endpoint.post("/hello", (req, res) => {
  // console.log(req)
  // console.log(req.body)
  try {

    Accounts.createUser(req.body);
    console.log("Usuario Creado" + JSON.stringify(req.body));
    
    res.writeHead(200,{
      "message" : "Usuario Creado",
    });
    
  } catch (error) {
    console.log("error.error :> " + error.error)
    console.log("error.reason :> " +error.reason)
    console.log("error.message :> " +error.message)
    console.log("error.errorType :> " +error.errorType)
    console.log("--------------------------------------")

    res.writeHead(error.error, {
      "error" : error.error,
      "reason" :error.reason,
      "message" : error.message,
      "errorType" : error.errorType,
    });
  }
  
  res.end()
})
WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: true }))
WebApp.connectHandlers.use(endpoint)




  ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: '791588638231790',
    secret: 'dbbc29b71bd070164abbb13845fa1d4a'
});


  Meteor.publish("archivo", function () {
    return ArchivoCollection.find({})
  })
  Meteor.publish("user", function () {
    return Meteor.users.find({})
  })
  Meteor.publish("user", function (id) {
    return Meteor.users.find({_id:id})
  })


}

Meteor.startup(() => {
  
})
  // If the Links collection is empty, add some data.
 


// Meteor.users.allow({
//   instert() { return true; }
// });

Accounts.onCreateUser(function (options, user) {
  // console.log("options > " + JSON.stringify(options))
  // console.log("user > " + JSON.stringify(user))
  
  if (!user.services.facebook) {

    const  profile= {
        firstName: options.firstName,
        lastName: options.lastName,
        role:options.role,
      };

      // user.username = options.firstName + options.lastName
      user.profile = profile
      user.creadoPor = options.creadoPor
      user.edad = options.edad

      return user;
  }

  user.username = user.services.facebook.name;
  user.emails = [{address: user.services.facebook.email}];
  user.profile = {firstName:user.services.facebook.first_name,lastName:user.services.facebook.last_name,name:user.services.facebook.name,role:"admin"}; 
  
 

  return user;
});
