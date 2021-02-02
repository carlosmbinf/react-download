import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
SimpleSchema.extendOptions(['autoform'])

Group = {}

if (!Meteor.groups) {
  Meteor.groups = new Mongo.Collection('groups')
  //Meteor.groups._ensureIndex('name', {unique: 1})
}

if (Meteor.isClient){
  Tracker.autorun(function () {
    Group.subscription = Meteor.subscribe("allGroups")
  })
}

if (Meteor.isServer){

  Meteor.publish("allGroups", function () {
    return (Roles.isAdmin(this.userId))? Meteor.groups.find() : false
  })

  Meteor.methods({
    insertGroup(doc){
      Meteor.groups.insert(doc)
      // console.log("insert", doc);
    },
    updateGroup(doc){
      // console.log("update", doc);
    },
    removeGroup(doc){
      // console.log("remove", doc);
    },
  })

  Meteor.groups.allow({
    insert: function(userId) {
      return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
      return Roles.isAdmin() || Roles.isAdminOperator();
    },
    remove: function (userId, doc){
      return Roles.isAdmin() || Roles.isAdminOperator();
    }
  })
}

Meteor.groups.before.update(function(userId, doc, fieldNames, modifier, options){

})

if (typeof Schema === 'undefined'){
  Schema = {}
}

Schema.VRGroups = new SimpleSchema({
  owner: {
		type: String,
		label: "Author",
    optional: true,
    autoValue: function() {
			return this.userId
		},
    autoform: {
			type: "hidden"
		}
	},
	createdAt: {
		type: String,
    optional: false,
		autoValue: function() {
			return moment().format("YYYY-MM-DD HH:mm:SS")
		},
		autoform: {
			type: "hidden"
		}
	},
  roles: {
    type: Array,
    optional: true,
    autoform: {
       type: 'select-checkbox-inline',
       options: getRoles
    }
  },
  'roles.$': {
    type: String
  },
	name: {
		label: "name",
	  type: String,
	}
}, { tracker: Tracker })

Meteor.groups.attachSchema(Schema.VRGroups)

function getRoles() {
  var rolesList = Meteor.roles.find().map(function (rol, index) {
    return {label: rol.name, value: rol.name}
  })
  return rolesList
}
