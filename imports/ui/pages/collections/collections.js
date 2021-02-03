import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const ArchivoCollection = new Mongo.Collection('archivoRegister');
export const DescargasCollection = new Mongo.Collection('descargasRegister');

export const SchemaArchivoCollection = new SimpleSchema({
  regEntrada: {
    type: Number,
  },
  regSalida: {
    type: Number,
  },
  estante: {
    type: Number,
  },
  comentarios: {
    type: String,
  },
  clasificado: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    defaultValue: new Date(),
  },
});

ArchivoCollection.attachSchema(SchemaArchivoCollection);

export const SchemaDescargaCollection = new SimpleSchema({
  idFile: {
    type: String,
  },
  nombreFile: {
    type: String,
  },
  tamanoFile: {
    type: String,
  },
  comentarios: {
    type: String,
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
  },
});

DescargasCollection.attachSchema(SchemaDescargaCollection)

ArchivoCollection.allow({
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