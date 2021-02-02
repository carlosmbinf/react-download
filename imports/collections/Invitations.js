import {
    Tracker
} from 'meteor/tracker'
import SimpleSchema from 'simpl-schema'

import {
    Index,
    MinimongoEngine
} from 'meteor/easy:search'

import {
    getCountryByCode,
    getStateByCode
} from '../startup/countries.js';


import { Offer } from '../collections/Offer';
import { from } from 'zen-observable';

if (Meteor.isClient) {
    intlTelInput = require('intl-tel-input');
}

const milisecondsPerMonth = [2678400000, 2419200000, 2592000000, 2505600000]
let toBeInsertedId = 'defaultMid'
SimpleSchema.extendOptions(['autoform'])


export const Invitations = new Mongo.Collection(`invitations`)

export const InvitationsIndex = new Index({
    collection: Invitations,
    fields: ['Guests.firstName', 'Guests.lastName', 'Guests.email'],
    engine: new MinimongoEngine({}),
    defaultSearchOptions: {
        limit: 8
    }
})

if (Meteor.isClient) {
    Template.registerHelper('collectionInvitations', () => Invitations)


}

if (Meteor.isServer) {

    Meteor.publish("Invitations", (selector = {}) => {

        return Invitations.find(selector)
    })

    Meteor.publish("singleInvitations", id => {

        return Invitaions.find({
            _id: id
        })
    })
 
    Meteor.methods({
        'updateInvitations'(doc) {
            console.log(doc);

            date = (doc.Guests.visitDate).toISOString();
            date = date.split('T')[0];
            date += "T" + doc.Guests.visitTime + ":00";
        
            time = doc.Guests.visitTime;
            h = time.split(':')[0];
        
            h = parseInt(h) + 1 + "";
        
            endDate = date.split('T')[0];
            endDate += "T" + h + ":" + time.split(':')[1] + ":00";
        
            Appointments = {
                title: "\n" + doc.Guests.firstName + " " + doc.Guests.lastName,
                start: date,
                end: endDate,
                allDay: false,
                description: '\n' + doc.Guests.firstName + " " + doc.Guests.lastName + "\n"
                    + "\n" + "Phone 1: " + doc.Guests.phone + "\n Phone 2: " + doc.Guests.phone1 + "\n"
                    + "start: " + date.split("T")[1] + "\n" + "end: " + endDate.split("T")[1] + "\n date: " + date.split("T")[0]
            };
        
               doc.Appointments = Appointments;
           
                Invitations.update({_id : doc._id} , {$set : doc})
        }
    })
 
}

Invitations.allow({
    insert: function () {
        return true
    },
    update: function () {
        return true

    },
    remove: function () {
        return Roles.isAdmin() || Roles.isSupervisor()
    }
})



Schema.Guests = new SimpleSchema({
    firstName: {
        type: String,

        autoform: {
            id: 'idName'
        }
    },
    lastName: {
        type: String,

        autoform: {
            id: 'idLastname'
        }
    },
    age: {
        type: Number,
        min: 0,
    },

    ocupation: {
        type: String,
    },
    income: {
        type: Number,
        autoform: {
            required: true,
            step: '.01',
        }

    },
    // birthDate: {
    //     type: Date,
    //     label: 'Fecha de Nacimiento'
    // },
    phone: {
        type: SimpleSchema.RegEx.Phone,
        optional: true,
        label: false,
        autoform: {

            afFieldInput: {
                type: "intl-tel",
                autocomplete: "tel"
            }
        },
    },

    phone1: {
        type: SimpleSchema.RegEx.Phone,
        optional: true,
        label: false,
        autoform: {

            afFieldInput: {
                type: "intl-tel",
                autocomplete: "tel"
            }
        },
    },

    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        autoform: {
            id: 'idEmail',
        }
    },
    visitDate: {
        type: Date,
    },
    visitTime: {
        type: String,
    },

    address: {
        type: String,

    },
    zip: {
        type: SimpleSchema.RegEx.ZipCode,

    },
    city: {
        type: String,


    },
    country: {
        type: String,

        autoform: {
            type: 'select',
            options: Data.getCountries()
        }
    },
    // nationality:{
    //     type : String,


    agentName: {
        type: String,
    },
    agentLastName: {
        type: String,
    },
    teamName: {
        type: String,
    },


    // },
    state: {
        type: String,
        optional: true,
        // autoform: {
        //     type: 'select',
        //     options: function () {
        //         let country = AutoForm.getFieldValue('country')
        //         return Data.getState(country)
        //     }
        // },
        custom: function () {
            let shouldBeRequired =
                this.field('country').value === "US" ||
                this.field('country').value === "AR" ||
                this.field('country').value === "AU" ||
                this.field('country').value === "BR" ||
                this.field('country').value === "CA" ||
                this.field('country').value === "CO" ||
                this.field('country').value === "MX" ||
                this.field('country').value === "VE";

            if (shouldBeRequired) {
                if (!this.operator) {
                    if (!this.isSet || this.value === null || this.value === "") return SimpleSchema.ErrorTypes.REQUIRED;
                }
            }
        }
    },

    guestsAmount: {
        type: Number,

    },

    guestsAdults: {
        type: Number,
    },

    guestsMinours: {
        type: Number,
    },

    gifts: {
        type: String,
    },


    //credit card

    visa: {
        label: "VISA",
        type: Boolean,
    },
    amex: {
        label: "AMEX",
        type: Boolean,
    },
    mastercard: {
        label: "MASTERCARD",
        type: Boolean,
    },
    other: {
        label: "OTHER",
        type: Boolean,
    },

    preQ: {
        label: "PRE-Q",
        type: Boolean,
    },

    nQ: {
        label: "NQ",
        type: Boolean,
    },

    ct: {
        label: "CT",
        type: Boolean,
    },

    idOffer: {
        optional: true,
        type: String,
    },

    offer: {
        type: Schema.Offer,
        optional: true,
    },

    "offer._id": {
        type: String,
    },


    attendee: {
        type: String,
        optional: true,
    },

    user: {
        type: String,
        optional: true,

    },

    appInstance: {
        type: String,
        optional: true,
    }


}, {
        tracker: Tracker
    })



Schema.Appointments = new SimpleSchema({
    title: {
        type: String,
    },
    start: {
        type: String,
    },
    end: {
        type: String,
    },
    allDay: {
        type: Boolean,
    },
    description: {
        type: String,
    }

}, { tracker: Tracker });


Schema.Invitations = new SimpleSchema({

    Guests: {
        type: Schema.Guests,
    },
    Appointments: {
        type: Schema.Appointments,
        optional: true,
    },

    createdAt: {
        type: String,
        autoValue() {
            return this.value || moment().format("YYYY-MM-DD HH:mm:ss")
        },
        autoform: {
            type: "hidden"
        }
    },
    owner: {
        type: String,
        autoValue() {
            return this.value || this.userId;
        },
        autoform: {
            type: 'hidden'
        }
    },

}, { tracker: Tracker });

Invitations.attachSchema(Schema.Invitations)



if (Meteor.isClient) {
    AutoForm.hooks({
        insertInvitations: {


            before: {
                insert: function (doc, result) {

                    // let guests = Invitations.findOne({
                    //     email: doc.Guests.email
                    // });

                    // if (guests) {
                    //     throw new Meteor.Error('EMAIL EXIST', "the given email already exists", "There is another guests with same email")
                    // }


                    date = (doc.Guests.visitDate).toISOString();
                    date = date.split('T')[0];
                    date += "T" + doc.Guests.visitTime + ":00";

                    time = doc.Guests.visitTime;
                    h = time.split(':')[0];

                    h = parseInt(h) + 1 + "";

                    endDate = date.split('T')[0];
                    endDate += "T" + h + ":" + time.split(':')[1] + ":00";

                    Appointments = {
                        title: "\n" + doc.Guests.firstName + " " + doc.Guests.lastName,
                        start: date,
                        end: endDate,
                        allDay: false,
                        description: '\n' + doc.Guests.firstName + " " + doc.Guests.lastName + "\n"
                            + "\n" + "Phone 1: " + doc.Guests.phone + "\n Phone 2: " + doc.Guests.phone1 + "\n"
                            + "start: " + date.split("T")[1] + "\n" + "end: " + endDate.split("T")[1] + "\n date: " + date.split("T")[0]
                    };

                    doc.Appointments = Appointments;
                    return this.result(doc);
                }
            },
            onError: function (method, err, doc) {

                sAlert.error(err.message, {
                    effect: 'slide'
                });
            },
            onSuccess: function (insert, result, doc) {

                sAlert.success('guests added successfully', {
                    effect: 'slide'
                })


                FlowRouter.go('/guests');
            },


        }
    })
}









