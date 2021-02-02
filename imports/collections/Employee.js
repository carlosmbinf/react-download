import { Tracker } from 'meteor/tracker'
import { Roles } from 'meteor/alanning:roles'
import SimpleSchema from 'simpl-schema'
import { Template } from 'meteor/templating'
import '../startup/nameSpace.js'

import { Index, MinimongoEngine } from 'meteor/easy:search'
import '../collections/Connections'

if (Meteor.isClient) {
    intlTelInput = require('intl-tel-input');
}

SimpleSchema.extendOptions(['autoform'])

SimpleSchema.defineValidationErrorTransform(error => {
    const Error = new Meteor.Error(error.message);
    Error.error = 'validation-error';
    Error.details = error.details;
    return Error;
});


export const Employee = new Mongo.Collection(`employees`)

export const EmployeeIndex = new Index({
    collection: Employee,
    fields: ['firstName', 'lastName', 'email'],
    // engine: new MinimongoEngine({}),
    engine: new MinimongoEngine({
        selector(searchObject, options, aggregation) {
            let selector = this.defaultConfiguration().selector(searchObject, options, aggregation)
            if (options.search.props.showInactive) {
                // selector.active = false;
                selector.type = {
                    $in: ['_SUPERVISOR', '_CAPTURE', '_VIEWER']
                }
            } else {
                selector.type = {
                    $in: ['_SUPERVISOR', '_CAPTURE', '_VIEWER']
                }
                selector.active = true;
            }
            return selector
        }
    }),
    defaultSearchOptions: {
        limit: 6
    }

})

Employee.before.insert((userid, doc) => {
    try {
        console.log('before insert: ', userid, doc);

        // Setting noAdmin_User properties
        doc.owner = userid;
        doc.createdAt = fixDateTimezone(new Date());
        doc.root = false;
        // doc.clubId = (Club.findOne() && Club.findOne({})._id) ? Club.findOne({})._id : 'default Club Id';

        //Setting Admin_User properties
        if (doc.type === Roles.ADMIN) {
            doc.active = true;
            doc.root = true;
            doc.owner = 'vrAdmin';
           
        }

        //trying create user, insert into employee collection
        //and set a user_role
        console.log('insert employee');

        if (!Meteor.users.findOne({
            'emails.address': doc.email
        })) {
            let credentials = Meteor.isServer && Meteor.settings.private.api
            console.log('credentials: ', credentials);
            doc.userId = newAccount(credentials, doc)

        }

        else {

            throw new Meteor.Error("email exists, you must use another email")

        }

    } catch (e) {
        console.log(e)
        throw new Meteor.Error('EmployeeInsertionError', e.message, e.reason);
    }
})

if (Meteor.isClient) {
    Template.registerHelper('collectionEmployee', () => Employee)
    AutoForm.hooks({
        insertNewEmployee: {
            onError: function (method, err) {
                sAlert.error(err.message, {
                    effect: 'slide'
                });
            },
            onSuccess: function () {
                sAlert.success('Employee added successfully', {
                    effect: 'slide'
                })

                FlowRouter.go('/users');
            }
        }
    })
}

if (Meteor.isServer) {

    Accounts.validateLoginAttempt(function (attempt) {
        if (!attempt.allowed) {
            return false;
        }
        const employee = Employee.findOne({
            userId: attempt.user._id
        })
        if (employee && employee.active === false) {
            attempt.allowed = false;
            throw new Meteor.Error(403, "User account is inactive!");
        }
        return true;
    });

    Meteor.publish("Employees", () => Employee.find())

    Meteor.publish("singleEmployee", id => Employee.find({
        _id: id
    }))

    Meteor.publish("employeeByUser", userId => Employee.find({
        userId: userId
    }))

    // export const getEmployee = userId => {
    //     return Employee.findOne({ userId });
    // } 

    Meteor.methods({
        getManager({
            secretKey,
            publicKey
        }) {
            Meteor.call('checkCredentials', {
                secretKey,
                publicKey
            });
            return Employee.findOne({
                type: Roles.ADMIN
            })
        },
        updateManager(credentials, doc) {
            setUser = {
                modifiedAt: doc.modifier.$set.createdAt,
                username: doc.modifier.$set.username,
                profile: {
                    firstName: doc.modifier.$set.firstName,
                    lastName: doc.modifier.$set.lastName,
                    
                }
            }
            Meteor.call('checkCredentials', credentials);
            Meteor.users.update({
                _id: doc.modifier.$set.userId
            }, {
                    $set: setUser
                })
            return Employee.update({
                _id: doc._id
            }, {
                    $set: doc.modifier.$set
                });
        },
        getEmployees() {
            try {
                return Employee.find().fetch();
            } catch (error) {

            }
        },


        removeEmployee(_id) {
            console.log(_id);
            try {
                Meteor.users.remove(_id)
                Employee.remove({
                    userId: _id
                })
             
            } catch (e) {
                console.log(e)
                throw new Meteor.Error(e)
            }




        },
        toggleActiveEmployee(_id, status) {
            Employee.update({
                _id
            }, {
                    $set: {
                        active: status
                    }
                })
        },


        updateUser(doc) {

            Employee.update({
                userId: doc.userId
            }, {
                    $set: doc
                })

        },




    });
}

Employee.allow({
    insert: function (doc) {
        return Roles.isAdmin() || Roles.isManager();
    },
    update: function (doc) {
        return Roles.isAdmin() || Roles.isManager();

    },
    remove: function () {
        return Roles.isAdmin() || Roles.isManager();
    }
})

// new Tabular.Table({
//     name: "Employees",
//     collection: Employee,
//     responsive: true,
//     autoWidth: false,
//     columns: [{
//         data: 'active',
//         title: 'Active',
//         render(val, type, doc) {
//             return `<span class='badge alert-${val ? 'success' : 'danger'}'>${val ? 'active' : 'inactive'}</span>`
//         }
//     },
//     {
//         data: 'getFullName()',
//         title: 'Full Name'
//     },
//     {
//         data: 'email',
//         title: 'Email'
//     },
//     {
//         data: 'phone',
//         title: 'Phone'
//     },
//     {
//         data: 'city',
//         title: 'City'
//     },
//     {
//         data: 'type',
//         title: 'User Role'
//     },
//     {
//         title: 'Action',
//         render(row, type, document) {
//             return `<a class='btn btn-info' href='users/details/${document._id}'>Details</a>`
//         }
//     }
//     ],
//     extraFields: ['firstName', 'lastName', 'userId']
// })

export const Schema = {}

Schema.Employee = new SimpleSchema({

    firstName: {
        type: String,
        autoform: {
            id: 'idName',
        }
    },
    lastName: {
        type: String,
        autoform: {
            id: 'idLastName',
        }
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.EmailWithTLD,
        autoform: {
            id: 'idEmail',
            group: "Corporative Data"
        }
    },
    phone: {
        type: SimpleSchema.RegEx.Phone,
        autoform: {
            afFieldInput: {
                type: "intl-tel",
                autocomplete: "tel"
            }
        },
        custom: function () {
            if (Meteor.isClient && this.isSet && window.intlTelInputUtils) {
                const valid = window.intlTelInputUtils.isValidNumber(this.value);
                if (!valid) {
                    return SimpleSchema.ErrorTypes.VALUE_NOT_ALLOWED;
                }
            }
        }
    },
    address: {
        type: String,
        autoform: {
            id: 'idAddress'
        }
    },
    city: {
        type: String,
        autoform: {
            id: 'idCity'
        }
    },
    country: {
        type: String,
        optional: true,
        autoform: {
            type: 'select',
            options: Data.getCountries()
        }
    },
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
                this.field('country').value === "VE";

            if (shouldBeRequired) {
                if (!this.operator) {
                    if (!this.isSet || this.value === null || this.value === "") return SimpleSchema.ErrorTypes.REQUIRED;
                }
            }
        }
    },
    zip: {
        type: SimpleSchema.RegEx.ZipCode,
        label: 'ZIP/Postal Code'
    },
    active: {
        type: Boolean,
        defaultValue: true,
        label: 'Active',
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
    type: {
        type: String,
        autoform: {
            options: function () {
                return [{
                    label: 'Supervisor',
                    value: Roles.userRoles[1]
                },
                {
                    label: 'Capture',
                    value: Roles.userRoles[2]
                },
                {
                    label: 'Viewer',
                    value: Roles.userRoles[3]
                },
                ]
            }
        }
    },
    userId: {
        type: String,
        label: 'ID de Usuario',
        optional: true,
        autoform: {
            type: 'hidden'
        }
    },
    comissionType: {
        type: String,
        optional: true,
        autoform: {
            type: 'select',
            options: function () {
                const comission = Comission.findOne();
                console.log(comission);
                return comission.sales.map(sale => {
                    return {
                        label: _.capitalize(sale.type),
                        value: sale.type
                    }
                })

            }
        }
    }
}, {
        tracker: Tracker
    })

Employee.attachSchema(Schema.Employee)

Employee.helpers({
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
})

function newAccount(credentials, doc) {
    try {
        if (!this.userId)
            Meteor.call('checkCredentials', credentials);
        else if (this.userId !== doc.owner)
            return

    } catch (error) {
        console.log('error on newAccount: ', error);
        return
    }

    let password = Random.id();

    let user = {
        email: doc.email,
        password: password,
        root: doc.root,
        profile: {
            first_name: doc.firstName,
            last_name: doc.lastName,
        },
        type: doc.type,
    }

    let id = (!Meteor.users.findOne({
        'emails.address': doc.email
    })) ? Accounts.createUser(user) : null;


    if (id && Meteor.isServer) {
        Roles.addUsersToRoles(id, doc.type);
        if (doc.type === Roles.ADMIN) {
            console.log(`${'Admin User:'} ${user.email} ${'\n'} ${'Admin Password:'} ${password}`)
            Meteor.call('sendAdminPassword', password);
        } else {
            Meteor.call('sendPasswordToNewUser', id);
            // Meteor.call('insertEmployeeNotUser', doc, id);
        }
    }

    return id
}