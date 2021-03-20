import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const PelisCollection = new Mongo.Collection('pelisRegister');
export const DescargasCollection = new Mongo.Collection('descargasRegister');
export const TVCollection = new Mongo.Collection('tvRegister');
export const OnlineCollection = new Mongo.Collection('online');

export const SchemaOnlineCollection = new SimpleSchema({
  address : {
    type: String,
  },
  userId : {
    type: String,
    optional: true,
  },
  loginAt: {
    type: Date,
    optional: true,
  },
});

OnlineCollection.attachSchema(SchemaOnlineCollection);
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
    defaultValue: new Date(),
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
    defaultValue: new Date(),
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
    defaultValue: new Date(),
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