import { Mongo } from "meteor/mongo";
import SimpleSchema from 'simpl-schema'

SimpleSchema.extendOptions(['autoform'])


export const Connections = new Mongo.Collection('Connections');

Connections.attachSchema(new SimpleSchema({
    publicKey: {
        type: String,
    },
    secretKey: {
        type: String,
    },
    url: {
        type: String
    },
    createdAt: {
        type: Date,
        defaultValue: new Date()
    }
}))

if (Meteor.isServer) {
    Meteor.methods({
        /**
         * Check the caller's credentials before accessing any method from this app
         * This method must be called by every method in this API
         * @param {Object} credentials Object containing the caller's URL, public and secrets keys
         * @returns {Object} The credentials object if they exist, else undefined
         */
        checkCredentials(credentials) {
            const apiCredentials = Meteor.settings.private.api;
            if (credentials.user !== apiCredentials.user || credentials.password !== apiCredentials.password)
                throw new Meteor.Error('invalidCredentials', 'Credentials do not match', 'Credentials do not match');
            else
                console.log('Valid credentials for: ', credentials.user);
        }
    });
}