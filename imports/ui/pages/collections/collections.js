import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from "meteor/meteor";


SimpleSchema.extendOptions(['autoform']);

export const PelisCollection = new Mongo.Collection('pelisRegister');
export const DescargasCollection = new Mongo.Collection('descargasRegister');
export const TVCollection = new Mongo.Collection('tvRegister');
export const OnlineCollection = new Mongo.Collection('online');
export const MensajesCollection = new Mongo.Collection('mensajes');
export const RegisterDataUsersCollection = new Mongo.Collection('registerDataUsers');
export const LogsCollection = new Mongo.Collection('Logs');
export const ServersCollection = new Mongo.Collection('servers');
export const PreciosCollection = new Mongo.Collection('precios');
export const VentasCollection = new Mongo.Collection('ventas');



Meteor.methods({
 async exportDataTo(urlMongoDB) {
  var mi = require("mongoimport");
   try {
    await mi({
       fields: PelisCollection.find().fetch(), // {array} data to import
       db: "meteor", // {string} name of db
       collection: 'pelisRegister', // {string|function} name of collection, or use a function to
       //  return a name, accept one param - [fields] the fields to import
       host: urlMongoDB,
       callback: (err, db) => {
         err && console.error(err);
       },
     });
   } catch (error) {
     console.log(error);
   }
  
   try {
    await mi({
      fields: DescargasCollection.find().fetch(), // {array} data to import
      db: "meteor", // {string} name of db
      collection: 'descargasRegister', // {string|function} name of collection, or use a function to
      //  return a name, accept one param - [fields] the fields to import
      host: urlMongoDB,
      callback: (err, db) => {
        err && console.error(err);
      },
    });
  } catch (error) {
    console.log(error);
    
  }

  try {
    await mi({
      fields: TVCollection.find().fetch(), // {array} data to import
      db: "meteor", // {string} name of db
      collection: 'tvRegister', // {string|function} name of collection, or use a function to
      //  return a name, accept one param - [fields] the fields to import
      host: urlMongoDB,
      callback: (err, db) => {
        err && console.error(err);
      },
    });
  } catch (error) {
    console.log(error);
    
  }

  // try {
  //   await mi({
  //     fields: OnlineCollection.find().fetch(), // {array} data to import
  //     db: "meteor", // {string} name of db
  //     collection: 'online', // {string|function} name of collection, or use a function to
  //     //  return a name, accept one param - [fields] the fields to import
  //     host: urlMongoDB,
  //     callback: (err, db) => {
  //       err && console.error(err);
  //     },
  //   });
  // } catch (error) {
  //   console.log(error);
    
  // }

  try {
    await mi({
      fields: MensajesCollection.find().fetch(), // {array} data to import
      db: "meteor", // {string} name of db
      collection: 'mensajes', // {string|function} name of collection, or use a function to
      //  return a name, accept one param - [fields] the fields to import
      host: urlMongoDB,
      callback: (err, db) => {
        err && console.error(err);
      },
    });
  } catch (error) {
    console.log(error);
    
  }

  try {
    await mi({
      fields: RegisterDataUsersCollection.find().fetch(), // {array} data to import
      db: "meteor", // {string} name of db
      collection: 'registerDataUsers', // {string|function} name of collection, or use a function to
      //  return a name, accept one param - [fields] the fields to import
      host: urlMongoDB,
      callback: (err, db) => {
        err && console.error(err);
      },
    });
  } catch (error) {
    console.log(error);
    
  }

  try {
    await mi({
      fields: LogsCollection.find().fetch(), // {array} data to import
      db: "meteor", // {string} name of db
      collection: 'Logs', // {string|function} name of collection, or use a function to
      //  return a name, accept one param - [fields] the fields to import
      host: urlMongoDB,
      callback: (err, db) => {
        err && console.error(err);
      },
    });
  } catch (error) {
    console.log(error);
    
  }

  try {
    await mi({
      fields: ServersCollection.find().fetch(), // {array} data to import
      db: "meteor", // {string} name of db
      collection: 'servers', // {string|function} name of collection, or use a function to
      //  return a name, accept one param - [fields] the fields to import
      host: urlMongoDB,
      callback: (err, db) => {
        err && console.error(err);
      },
    });
  } catch (error) {
    console.log(error);
    
  }

  try {
    await mi({
      fields: PreciosCollection.find().fetch(), // {array} data to import
      db: "meteor", // {string} name of db
      collection: 'precios', // {string|function} name of collection, or use a function to
      //  return a name, accept one param - [fields] the fields to import
      host: urlMongoDB,
      callback: (err, db) => {
        err && console.error(err);
      },
    });
  } catch (error) {
    console.log(error);
    
  }

  try {
    await mi({
      fields: VentasCollection.find().fetch(), // {array} data to import
      db: "meteor", // {string} name of db
      collection: 'ventas', // {string|function} name of collection, or use a function to
      //  return a name, accept one param - [fields] the fields to import
      host: urlMongoDB,
      callback: (err, db) => {
        err && console.error(err);
      },
    });
  } catch (error) {
    console.log(error);
    
  }

  try {
    await mi({
      fields: Meteor.users.find().fetch(), // {array} data to import
      db: "meteor", // {string} name of db
      collection: 'users', // {string|function} name of collection, or use a function to
      //  return a name, accept one param - [fields] the fields to import
      host: urlMongoDB,
      callback: (err, db) => {
        err && console.error(err);
      },
    });
  } catch (error) {
    console.log(error);
    
  }
    

  },
});
export const SchemaRegisterDataUsersCollection = new SimpleSchema({
  userId: {
    type: String,
    optional: false,
  },
  fecha: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    optional: true,
  },
  megasGastadosinBytes: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  megasGastadosinBytesGeneral: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
});

RegisterDataUsersCollection.attachSchema(SchemaRegisterDataUsersCollection);

export const SchemaVentasCollection = new SimpleSchema({
  adminId: {
    type: String,
    optional: false,
  },
  userId: {
    type: String,
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  cobrado: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  precio: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  comentario: {
    type: String,
    optional: true,
  },
});

VentasCollection.attachSchema(SchemaVentasCollection);

export const SchemaPreciosCollection = new SimpleSchema({
  userId: {
    type: String,
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  precio: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  fecha: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  megas: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  comentario: {
    type: String,
    optional: true,
  },
});

PreciosCollection.attachSchema(SchemaPreciosCollection);

export const SchemaOnlineCollection = new SimpleSchema({
  address: {
    type: String,
  },
  connectionId: {
    type: String,
    optional: true,
  },
  userId: {
    type: String,
    optional: true,
  },
  loginAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    optional: true,
  },
  hostname: {
    type: String,
    optional: true,
  },
  megasGastadosinBytes: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  megasGastadosinBytesGeneral: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
});

OnlineCollection.attachSchema(SchemaOnlineCollection);

export const SchemaMensajesCollection = new SimpleSchema({
  from : {
    type: String,
  },
  to : {
    type: String,
  },
  mensaje : {
    type: String,
    optional: true,
  },
  leido : {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  type:{
    type: String,
    defaultValue: "text",
    optional: true,
  }
});

MensajesCollection.attachSchema(SchemaMensajesCollection);
export const SchemaTVCollection = new SimpleSchema({
  nombreTV:{
    type: String,
  },
  urlTV: {
    type: String,
  },
  urlBackground: {
    type: String,    
    defaultValue: "",
  },
  descripcion: {
    type: String,
    defaultValue: "",
  },
  mostrar:{
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  vistas: {
    type: Number,
    defaultValue: 0,
  },
});

TVCollection.attachSchema(SchemaTVCollection);

export const SchemaPelisCollection = new SimpleSchema({
  nombrePeli:{
    type: String,
  },
  urlPeli: {
    type: String,
  },
  urlBackground: {
    type: String,
  },
  descripcion: {
    type: String,
  },
  urlTrailer: {
    type: String,
    defaultValue: "",
  },
  tamano:{
    type: String,
  },
  mostrar:{
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  subtitulo: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  vistas: {
    type: Number,
    defaultValue: 0,
  },
  year: {
    type: Number,
    defaultValue: 1900,
    min: 1900,
  },
  clasificacion: {
    type: Array,
    defaultValue: [],
  },
  'clasificacion.$': { type: String },
});

PelisCollection.attachSchema(SchemaPelisCollection);

export const SchemaDescargaCollection = new SimpleSchema({
  idFile: {
    type: String,
  },
  nombreFile: {
    type: String,
  },
  tamanoFile: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  comentarios: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  descargadoPor:{
    type: String,
  },
  thumbnail:{
    type: String,
  },
  urlReal:{
    type: String,
  },
  url:{
    type: String,
    defaultValue: "",
    optional: true,
  },
  vistas: {
    type: Number,
    defaultValue: 0,
  },
});

DescargasCollection.attachSchema(SchemaDescargaCollection)

export const SchemaServersCollection = new SimpleSchema({
  domain: {
    type: String,
  },
  ip: {
    type: String,
  },
  active:{
    type: Boolean,
    defaultValue: true,
    optional: true,
  },
  details:{
    type: String,
    defaultValue: "",
    optional:true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
});

ServersCollection.attachSchema(SchemaServersCollection)

LogsCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update() {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return true;
  },
});

RegisterDataUsersCollection.allow({
  insert(doc) {
      // The user must be logged in and the document must be owned by the user.
      return true;
    },
  
    update() {
      // Can only change your own documents.
      return true;
    },
  
    remove(userId, doc) {
      // Can only remove your own documents.
      return true;
    },
})
OnlineCollection.allow({
  insert(doc) {
      // The user must be logged in and the document must be owned by the user.
      return true;
    },
  
    update() {
      // Can only change your own documents.
      return true;
    },
  
    remove(userId, doc) {
      // Can only remove your own documents.
      return true;
    },
})
TVCollection.allow({
  insert(doc) {
      // The user must be logged in and the document must be owned by the user.
      return true;
    },
  
    update() {
      // Can only change your own documents.
      return true;
    },
  
    remove(userId, doc) {
      // Can only remove your own documents.
      return Meteor.users.findOne({_id:Meteor.userId()}).profile.role == "admin";
    },
})
PelisCollection.allow({
    insert(doc) {
        // The user must be logged in and the document must be owned by the user.
        return true;
      },
    
      update() {
        // Can only change your own documents.
        return true;
      },
    
      remove(userId, doc) {
        // Can only remove your own documents.
        return Meteor.users.findOne({_id:Meteor.userId()}).profile.role == "admin";
      },
})
DescargasCollection.allow({
  insert(doc) {
      // The user must be logged in and the document must be owned by the user.
      return true;
    },
  
    update(userId, doc, fields, modifier) {
      // Can only change your own documents.
      return true;
    },
  
    remove(userId, doc) {
      // Can only remove your own documents.
      return true;
    },
})
Meteor.users.allow({
  insert(doc) {
      // The user must be logged in and the document must be owned by the user.
      return true;
    },
  
    update(userId, doc, fields, modifier) {
      // Can only change your own documents.
      return true;
    },
  
    remove(userId, doc) {
      // Can only remove your own documents.
      return Meteor.users.findOne({_id:Meteor.userId()}).profile.role == "admin";
    },
})
MensajesCollection.allow({
  insert(doc) {
      // The user must be logged in and the document must be owned by the user.
      return true;
    },
  
    update(userId, doc, fields, modifier) {
      // Can only change your own documents.
      return true;
    },
  
    remove(userId, doc) {
      // Can only remove your own documents.
      return true;
    },
})
ServersCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return true;
  },
});

PreciosCollection.allow({
  insert(userId,doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return true;
  },
});
