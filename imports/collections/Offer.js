import {
    Tracker
} from 'meteor/tracker'
import SimpleSchema from 'simpl-schema'
import '../startup/nameSpace.js'

import {
    Index,
    MinimongoEngine
} from 'meteor/easy:search'


SimpleSchema.extendOptions(['autoform'])

let name = Meteor.settings.public.invitation
export const Offer = new Mongo.Collection(`offer`)

export const OfferIndex = new Index({
    collection: Offer,
    fields: ['name'],
    engine: new MinimongoEngine({}),
    defaultSearchOptions: {
        limit: 8,
    }
})

if (Meteor.isClient) {
    Template.registerHelper('collectionOffer', () => Offer)
 
}

if (Meteor.isServer) {

    Meteor.publish("Offer", (selector = {}) => {
      
        return Offer.find(selector)
    })

    Meteor.publish("singleOffer", id => {
       
        return Offer.find({
            _id: id
        })
    })

    Meteor.methods({
       
        insertOffer(cre , element) {
             
            if(element) {
               offer = {
                "_id" : element.id,
                "name" : element.name,
                "description" : element.contract,
                "price" : element.cost,
                "publicPrice" : element.publicPrice,
                "discount" : element.discountPrice,
                "currency" : element.currency
            }

            if(!Offer.findOne({_id : element.id})) {
                Offer.insert(offer)
            }
   
            else {
                Offer.update({_id : element.id} , {$set : offer})
            }

                
            


            }

        },
        getOfferAll() {
            return Offer.find().fetch();
        },
        getOfferWithSelector(selector) {
            check(selector, Object);
            return Offer.find(selector).fetch();
        },
       
       
      
    });
}

Offer.allow({
    insert: function () {
        return true
    },
    update: function () {
        return Roles.isAdmin() || Roles.isSupervisor()

    },
    remove: function () {
        return Roles.isAdmin() || Roles.isSupervisor()
    }
})



/////////////////////////Member Schema/////////////////
Schema.Offer = new SimpleSchema({
   
    name: {
        type: String,
    },
    description: {
        type: String,
        autoform: {
            rows: '10',
            type: 'textarea'
        }
    },

    price : {
        type : Number,
        autoform: {
            required: true,
            step: '0.01',
        }
    },

    publicPrice : {
        type : Number,
        autoform: {
            required: true,
            step: '0.01',
        }
    },
    discount : {
        type : Number,
        autoform: {
            required: true,
            step: '0.01',
        }
    },
    currency : {
        type : String
    }
   
}, {
        tracker: Tracker
    })

Offer.attachSchema(Schema.Offer)




////////////////////methods////////////////////////////////////

if (Meteor.isClient) {
    AutoForm.hooks({
        insertOffer: {
            onError: function (method, err) {
                sAlert.error(err.message, {
                    effect: 'slide'
                });
            },
            onSuccess: function () {
                sAlert.success('offer added successfully', {
                    effect: 'slide'
                })
               
               
                FlowRouter.go('/offer');
            }
        }
    })
}





