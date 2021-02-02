import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import './VRGroup.js'
import { Employee } from '../collections/Employee.js';

SimpleSchema.extendOptions(['autoform'])

//create  Roles object if not exist 
if (!Roles) {
    Roles = {}
}

Roles.INSERTER = "_INSERTER"
Roles.UPDATER = "_UPDATER"
Roles.REMOVER = "_REMOVER"
Roles.VIEWER = "_VIEWER"
Roles.userRoles = ['_MANAGER', '_SUPERVISOR', '_CAPTURE' , '_VIEWER']
Roles.ADMIN = "ADMIN"

if (Meteor.isClient) {
    Tracker.autorun(function() {
        Roles.subscription = Meteor.subscribe("allRoles")
    })

    Template.registerHelper('isInThisRole', function(templateName) {
        return Roles.isInThisRole(Meteor.userId(), Roles.VIEWER, templateName)
    })
    Template.registerHelper('isAdministrative', function() {
        return Roles.isAdmin() || Roles.isManager()
    })
    Template.registerHelper('isAdmin', function() {
        return Roles.isAdmin()
    })
    Template.registerHelper('isManager', function() {
        return Roles.isManager()
    })
    Template.registerHelper('isSupervisor', function() {
        return Roles.isSupervisor()
    })
    Template.registerHelper('isCapture', function() {
        return Roles.isCapture()
    })
    Template.registerHelper('isViewer', function() {
        return Roles.isViewer()
    })


    Template.registerHelper('menuItems', () => {
        const user = Meteor.user();
        if (user && user.roles) {
            
            const offer = {route:'/offer' , name : 'offer'}
            const dashboard = { route: '/dashboard', name: 'dashboard', class: '' }
            const calendar = { route: '/calendar', name: 'calendar', class: '' }
         //   const memberMenuItem = { route: '/members', name: 'members', class: '' }
            const guests = { route: '/guests', name: 'guests', class: '' }
            const employeMenuItem = { route: '/users', name: 'users', class: '' }
            //const employeNewMenuItem = { route: '/employees', name: 'employees', class: '' }
            const clubMenuItem = { route: '/clubs', name: 'company', class: '' }
           // const serviceMenuItem = { route: '/services', name: 'services', class: '' }
            // if (Roles.isCapture()) return [memberMenuItem];
            // if (Roles.isSupervisor()) return [memberMenuItem];
            // if (Roles.isAdmin() || Roles.isManager() || Roles.isViewer()) return [dashboard , offer, guests , employeMenuItem ,calendar   ];
            // if(Roles.isAdmin()) return [offer];
            return [dashboard , offer, guests , employeMenuItem ,calendar]
        } else return;
    });
}

if (Meteor.isServer) {

    Meteor.publish("allRoles", function() {
        return (Roles.isAdmin(this.userId)) ? Meteor.roles.find() : false
    })

    Meteor.methods({
        insertRole(doc) {
            if (Roles.isAdmin()) {
                Roles.createRole(doc.name)
                    // console.log("insert", doc);
            }
        },
        updateRole(doc) {
            // console.log("update", doc);
        },
        removeRole(doc) {
            // console.log("remove", doc);
            if (Roles.isAdmin()) {
                try {
                    Roles.deleteRole(doc.name)
                } catch (e) {
                    console.log(e)
                }
            }
        }
    })

    var email = Meteor.settings.private.adminEmail;
    var user = {
        active: true,
        firstName: 'Administrator',
        lastName: 'Admin/Manager',
        username: 'admin',
        email: email,
        type: Roles.ADMIN,
        owner: 'default_Owner',
        createdAt: 'default_Date',
        phone: '15231263',
        address: 'Vacancyrewards address',
        city: 'Cancun',
        state: 'Cancun',
        country: 'Mexico',
        zip: '654423',
        root: true
    }

    
    // if no users, create a new Admin user
     if (Meteor.users.find().count() === 0) {
         //insert admin_user into employee collection
         Employee.insert(user)  //Meteor.call('newAccount', user);

         //if no roles, creates a new Admin role
         if (Meteor.roles.find({ name: Roles.ADMIN }).count() < 1) {
             Roles.createRole(Roles.ADMIN);
         }
        
     } else if (!Employee.findOne({ email: Meteor.settings.private.adminEmail })) {       
         Employee.insert(user)
     }
     
}

Roles.name = function(rol, collectionName) {
    return collectionName + rol
}

//
Roles.isInThisRole = function(userId, actionRol, collectionName) {
    if (userId && Roles.isAdmin(userId)) {
        return true
    }

    var rol = Roles.name(actionRol, collectionName)
    var group = Roles.name(Roles.MANAGER_GROUP, collectionName)

    if (Meteor.isServer) {
        //
        var user = Meteor.users.findOne({ _id: userId })
        if (user) {
            var userRoles = user.roles
            if (userRoles) {
                for (let groupIterator in userRoles) {
                    // console.log(groupIterator, rol);
                    if (Roles.userIsInRole(userId, [rol], groupIterator)) {
                        return true
                    }
                }
            }
        }
    }

    return false
}


//server-side
Roles.registerRole = function(collectionName) {
    var collectionRoles = [
        Roles.name(Roles.INSERTER, collectionName),
        Roles.name(Roles.UPDATER, collectionName),
        Roles.name(Roles.REMOVER, collectionName),
        Roles.name(Roles.VIEWER, collectionName)
    ]
    var group = {
        name: Roles.name(Roles.MANAGER_GROUP, collectionName),
        roles: collectionRoles
    }

    if (!Meteor.groups.findOne({ name: group.name })) {
        Meteor.groups.insert(group)
    }
    for (let rolName of collectionRoles) {
        var rol = Meteor.roles.findOne({ name: rolName })
        if (!rol) {
            Roles.createRole(rolName)
        }
    }
}

Roles.isAdmin = function(userId) {
    let userid = userId || Meteor.userId()
    return isInRole(userid, Roles.ADMIN)
}

Roles.isManager = function(userId) {
    let userid = userId || Meteor.userId()
    return isInRole(userid, Roles.userRoles[0])
}
Roles.isSupervisor = function(userId) {
    let userid = userId || Meteor.userId()
    return isInRole(userid, Roles.userRoles[1])
}
Roles.isCapture = function(userId) {
    let userid = userId || Meteor.userId()
    return isInRole(userid, Roles.userRoles[2])
}
Roles.isViewer = function(userId) {
    let userid = userId || Meteor.userId()
    return isInRole(userid, Roles.userRoles[3])
}
Roles.preventAutoDelete = function(userId) {
    let userid = userId || Meteor.userId()
    return userid !== Meteor.userId()
}

function isInRole(userId, role) {
    return Roles.userIsInRole(userId, [role])
}

if (typeof Schema === 'undefined') {
    Schema = {}
}

Schema.VRRole = new SimpleSchema({
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
        optional: true,
        autoValue: function() {
            return moment().format("YYYY-MM-DD HH:mm:SS")
        },
        autoform: {
            type: "hidden"
        }
    },
    name: {
        label: "name",
        type: String,
    }
}, { tracker: Tracker })