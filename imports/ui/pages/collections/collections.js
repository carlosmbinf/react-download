import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { Meteor } from "meteor/meteor";

SimpleSchema.extendOptions(["autoform"]);

export const PelisCollection = new Mongo.Collection("pelisRegister");

export const DescargasCollection = new Mongo.Collection("descargasRegister");
export const TVCollection = new Mongo.Collection("tvRegister");
export const OnlineCollection = new Mongo.Collection("online");
export const MensajesCollection = new Mongo.Collection("mensajes");
export const RegisterDataUsersCollection = new Mongo.Collection(
  "registerDataUsers"
);
export const LogsCollection = new Mongo.Collection("Logs");
export const ServersCollection = new Mongo.Collection("servers");
export const PreciosCollection = new Mongo.Collection("precios");
export const VentasCollection = new Mongo.Collection("ventas");
export const FilesCollection = new Mongo.Collection("files");
export const VersionsCollection = new Mongo.Collection("versions");

export const CapitulosCollection = new Mongo.Collection("seriesCapitulos");
export const TemporadasCollection = new Mongo.Collection("seriesTemporadas");
export const SeriesCollection = new Mongo.Collection("series");

Meteor.methods({
  async exportDataTo(urlMongoDB) {
    var mi = require("mongoimport");
    try {
      await mi({
        fields: PelisCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "pelisRegister", // {string|function} name of collection, or use a function to
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
        fields: SeriesCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "series", // {string|function} name of collection, or use a function to
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
        fields: TemporadasCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "temporadasSeries", // {string|function} name of collection, or use a function to
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
        fields: CapitulosCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "capitulosSeries", // {string|function} name of collection, or use a function to
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
        collection: "descargasRegister", // {string|function} name of collection, or use a function to
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
        collection: "tvRegister", // {string|function} name of collection, or use a function to
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
        collection: "mensajes", // {string|function} name of collection, or use a function to
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
        collection: "registerDataUsers", // {string|function} name of collection, or use a function to
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
        collection: "Logs", // {string|function} name of collection, or use a function to
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
        collection: "servers", // {string|function} name of collection, or use a function to
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
        collection: "precios", // {string|function} name of collection, or use a function to
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
        collection: "ventas", // {string|function} name of collection, or use a function to
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
        collection: "users", // {string|function} name of collection, or use a function to
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
        fields: FilesCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "files", // {string|function} name of collection, or use a function to
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
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: true,
  },
  vpnMbGastados: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  megasGastadosinBytes: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  type: {
    type: String,
    defaultValue: "proxy",
    optional: false,
  },
  register: {
    type: String,
    optional: false,
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
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  cobrado: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  cobradoAlAdmin: {
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
  gananciasAdmin: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  type: {
    type: String,
    optional: false,
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
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  precio: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  type: {
    type: String,
    optional: false,
  },
  megas: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  heredaDe: {
    type: String,
    optional: true,
    defaultValue: null,
  },
  comentario: {
    type: String,
    optional: true,
  },
  detalles: {
    type: String,
    optional: true,
  },
});

PreciosCollection.attachSchema(SchemaPreciosCollection);

export const SchemaLogsCollection = new SimpleSchema({
  type: {
    type: String,
  },
  userAdmin: {
    type: String,
  },
  userAfectado: {
    type: String,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
});

LogsCollection.attachSchema(SchemaLogsCollection);

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
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
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
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  mensaje: {
    type: String,
    optional: true,
  },
  leido: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
  type: {
    type: String,
    defaultValue: "text",
    optional: true,
  },
});

MensajesCollection.attachSchema(SchemaMensajesCollection);
export const SchemaTVCollection = new SimpleSchema({
  nombreTV: {
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
  mostrar: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
  vistas: {
    type: Number,
    defaultValue: 0,
  },
});

TVCollection.attachSchema(SchemaTVCollection);

export const SchemaPelisCollection = new SimpleSchema({
  nombrePeli: {
    type: String,
  },
  urlPadre: {
    type: String,
    optional: true
  },
  urlPeli: {
    type: String,
  },
  urlPeliHTTPS: {
    type: String,
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        const urlPeli = this.field("urlPeli");
        if (urlPeli.isSet) {
          return urlPeli.value.replace(
            "http://vidkar.ddns.net:3005",
            "https://vidkar.ddns.net:3006"
          );
        }
      } else if (this.isUpdate) {
        const urlPeli = this.field("urlPeli");
        if (urlPeli.isSet) {
          return {
            $set: urlPeli.value.replace(
              "http://vidkar.ddns.net:3005",
              "https://vidkar.ddns.net:3006"
            ),
          };
        } else {
          this.unset(); // Prevent user from supplying their own value
        }
      } else if (this.isUpsert) {
        const urlPeli = this.field("urlPeli");
        if (urlPeli.isSet) {
          return {
            $setOnInsert: urlPeli.value.replace(
              "http://vidkar.ddns.net:3005",
              "https://vidkar.ddns.net:3006"
            ),
          };
        } else {
          this.unset(); // Prevent user from supplying their own value
        }
      }
    },
  },
  urlBackground: {
    type: String,
  },
  urlBackgroundHTTPS: {
    type: String,
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        const urlBackground = this.field("urlBackground");
        if (urlBackground.isSet) {
          return urlBackground.value.replace(
            "http://vidkar.ddns.net:3005",
            "https://vidkar.ddns.net:3006"
          );
        }
      } else if (this.isUpdate) {
        const urlBackground = this.field("urlBackground");
        if (urlBackground.isSet) {
          return {
            $set: urlBackground.value.replace(
              "http://vidkar.ddns.net:3005",
              "https://vidkar.ddns.net:3006"
            ),
          };
        } else {
          this.unset(); // Prevent user from supplying their own value
        }
      } else if (this.isUpsert) {
        const urlBackground = this.field("urlBackground");
        if (urlBackground.isSet) {
          return {
            $setOnInsert: urlBackground.value.replace(
              "http://vidkar.ddns.net:3005",
              "https://vidkar.ddns.net:3006"
            ),
          };
        } else {
          this.unset(); // Prevent user from supplying their own value
        }
      }
    },
  },
  descripcion: {
    type: String,
  },
  urlTrailer: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  tamano: {
    type: String,
  },
  mostrar: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
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
    // min: 1900,
  },
  textSubtitle: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  clasificacion: {
    type: Array,
    defaultValue: [],
  },
  "clasificacion.$": { type: String },
  idimdb: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  actors: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  "actors.$": { type: String },
  extension: {
    type: String,
    optional: true,
  },
});

PelisCollection.attachSchema(SchemaPelisCollection);

export const SchemaSeriesCollection = new SimpleSchema({
  nombre: {
    type: String,
  },
  descripcion: {
    type: String,
    optional: true,
  },
  urlTrailer: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  anoLanzamiento: {
    type: Number,
    defaultValue: 1900,
    // min: 1900,
  },
  mostrar: {
    type: Boolean,
    optional: true,
    defaultValue: true,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
  urlBackground: {
    type: String,
    optional: true,
  },
  urlBackgroundHTTPS: {
    type: String,
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        const urlBackground = this.field("urlBackground");
        if (urlBackground.isSet) {
          return urlBackground.value ? urlBackground.value.replace(
            "http://vidkar.ddns.net:3005",
            "https://vidkar.ddns.net:3006"
          ):null;
        }
      } else if (this.isUpdate) {
        const urlBackground = this.field("urlBackground");
        if (urlBackground.isSet) {
          return {
            $set: urlBackground.value
              ? urlBackground.value.replace(
                  "http://vidkar.ddns.net:3005",
                  "https://vidkar.ddns.net:3006"
                )
              : null,
          };
        } else {
          this.unset(); // Prevent user from supplying their own value
        }
      } else if (this.isUpsert) {
        const urlBackground = this.field("urlBackground");
        if (urlBackground.isSet) {
          return {
            $setOnInsert: urlBackground.value
              ? urlBackground.value.replace(
                  "http://vidkar.ddns.net:3005",
                  "https://vidkar.ddns.net:3006"
                )
              : null,
          };
        } else {
          this.unset(); // Prevent user from supplying their own value
        }
      }
    },
  },
  clasificacion: {
    type: Array,
    defaultValue: [],
  },
  "clasificacion.$": { type: String },
  idimdb: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  actors: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  "actors.$": { type: String },
});

SeriesCollection.attachSchema(SchemaSeriesCollection);

export const SchemaTemporadasCollection = new SimpleSchema({
  idSerie: {
    type: String,
    optional: false
  },
  numeroTemporada: {
    type: Number,
    optional: false,
  },
  url: {
    type: String,
    optional: true,
  },
  actualizar: {
    type: Boolean,
    optional: true,
    defaultValue: true,
  },
});

TemporadasCollection.attachSchema(SchemaTemporadasCollection);


export const SchemaCapitulosCollection = new SimpleSchema({
  nombre: {
    type: String,
  },
  url: {
    type: String,
  },
  idTemporada: {
    type: String,
    optional: false
  },
  urlHTTPS: {
    type: String,
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        const url = this.field("url");
        if (url.isSet) {
          return url.value.replace(
            "http://vidkar.ddns.net:3005",
            "https://vidkar.ddns.net:3006"
          );
        }
      } else if (this.isUpdate) {
        const url = this.field("url");
        if (url.isSet) {
          return {
            $set: url.value.replace(
              "http://vidkar.ddns.net:3005",
              "https://vidkar.ddns.net:3006"
            ),
          };
        } else {
          this.unset(); // Prevent user from supplying their own value
        }
      } else if (this.isUpsert) {
        const url = this.field("url");
        if (url.isSet) {
          return {
            $setOnInsert: url.value.replace(
              "http://vidkar.ddns.net:3005",
              "https://vidkar.ddns.net:3006"
            ),
          };
        } else {
          this.unset(); // Prevent user from supplying their own value
        }
      }
    },
  },
  urlBackground: {
    type: String,
    optional: true,
  },
  urlBackgroundHTTPS: {
    type: String,
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        const urlBackground = this.field("urlBackground");
        if (urlBackground.isSet) {
          return urlBackground.value
            ? urlBackground.value.replace(
                "http://vidkar.ddns.net:3005",
                "https://vidkar.ddns.net:3006"
              )
            : null;
        }
      } else if (this.isUpdate) {
        const urlBackground = this.field("urlBackground");
        if (urlBackground.isSet) {
          return {
            $set: urlBackground.value
              ? urlBackground.value.replace(
                  "http://vidkar.ddns.net:3005",
                  "https://vidkar.ddns.net:3006"
                )
              : null,
          };
        } else {
          this.unset(); // Prevent user from supplying their own value
        }
      } else if (this.isUpsert) {
        const urlBackground = this.field("urlBackground");
        if (urlBackground.isSet) {
          return {
            $setOnInsert: urlBackground.value
              ? urlBackground.value.replace(
                  "http://vidkar.ddns.net:3005",
                  "https://vidkar.ddns.net:3006"
                )
              : null,
          };
        } else {
          this.unset(); // Prevent user from supplying their own value
        }
      }
    },
  },
  descripcion: {
    type: String,
  },
  urlTrailer: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  mostrar: {
    type: Boolean,
    optional: true,
    defaultValue: true,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
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
  textSubtitle: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  capitulo: {
    type: Number,
    optional: false,
  },
  extension: {
    type: String,
    optional: true,
  },
});

CapitulosCollection.attachSchema(SchemaCapitulosCollection);

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
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
  descargadoPor: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  urlReal: {
    type: String,
  },
  url: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  vistas: {
    type: Number,
    defaultValue: 0,
  },
});

DescargasCollection.attachSchema(SchemaDescargaCollection);

export const SchemaServersCollection = new SimpleSchema({
  domain: {
    type: String,
  },
  ip: {
    type: String,
  },
  active: {
    type: Boolean,
    defaultValue: true,
    optional: true,
  },
  details: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
  estado:{
    type: String,
    defaultValue: "ACTIVO", //ACTIVO, INACTIVO, PENTIENTE_A_REINICIAR
    optional: true,
  },
  lastUpdate: {
    type: Date,
    optional: true,
    autoValue: function () {
      //si inserta o actualiza que se actualice la fecha
      if (this.isInsert || this.isModifier) {
        return new Date();
      }
      
    },
  },
});

ServersCollection.attachSchema(SchemaServersCollection);

export const SchemaFilesCollection = new SimpleSchema({
  nombre: {
    type: String,
    optional: false,
  },
  url: {
    type: String,
    optional: false,
  },
  details: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
});

FilesCollection.attachSchema(SchemaFilesCollection);

FilesCollection.allow({
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
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

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
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
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
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
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
});
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
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
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
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
CapitulosCollection.allow({
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
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
TemporadasCollection.allow({
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
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
SeriesCollection.allow({
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
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
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
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
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
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
VentasCollection.allow({
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
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
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
});
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
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
