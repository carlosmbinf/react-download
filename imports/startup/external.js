
import { Employee } from "../collections/Employee";
import {Offer} from "../collections/Offer";
import {Invitations} from "../collections/Invitations";

import { Connections } from "../collections/Connections";
import { log } from "./nameSpace";

if (Meteor.isServer) {
    Meteor.publish('external.Offer.all', (credentials) => {
        check(credentials, Object);
        console.log('publishing Offer to external app')
        try {
            Meteor.call('checkCredentials', credentials);
            return Offer.find();
        } catch (e) {
            console.log(e)
            throw new Meteor.Error(e, e.message, e.reason)
        }
    });

    Meteor.publish('external.Invitations.all', (credentials) => {
        check(credentials, Object);
        console.log('publishing Invitations to external app')
        try {
            Meteor.call('checkCredentials', credentials);
            return Invitations.find();
        } catch (e) {
            console.log(e)
            throw new Meteor.Error(e, e.message, e.reason)
        }
    });

    
    Meteor.publish('external.employees.all', (credentials) => {
        check(credentials, Object);
        console.log('publishing employees to external app')
        try {
            Meteor.call('checkCredentials', credentials);
            return Employee.find();
        } catch (e) {
            console.log(e)
            throw new Meteor.Error(e, e.message, e.reason)
        }
    });



    Meteor.publish('external.users.all', (credentials) => {
        check(credentials, Object);
        console.log('publishing users to external app')
        try {
            Meteor.call('checkCredentials', credentials);
            return Meteor.users.find();
        } catch (e) {
            console.log(e)
            throw new Meteor.Error(e, e.message, e.reason)
        }
    });
   
  
   
    
   
  
    

    Meteor.methods({
        passwordSent(credentials, _id) {
            console.log('external app passwordSent for: ', _id)
            this.unblock();
            try {
                Meteor.call('checkCredentials', credentials);
                return Member.update({ _id }, { $set: { passwordSent: true } });
            } catch (e) {
                console.log(e)
                throw new Meteor.Error(e, e.message, e.reason)
            }
        },
        resendWelcomeCallEmail(credentials, _id) {
            this.unblock();
            check(credentials, Object);
            check(_id, String);
            try {
                Meteor.call('checkCredentials', credentials);
                return Member.update({ _id, welcomeCall: { $exists: true } }, { $set: { passwordSent: false } })
            } catch (error) {
                throw new Meteor.Error('memberUpdateError', error.message);
            }
        },
        resetUploadedDoc(credentials, memberId, scanType) {
            this.unblock();
            check(credentials, Object)
            check(memberId, String);
            check(scanType, String);
            try {
                Meteor.call('checkCredentials', credentials);
                return ScannedAgreements.collection.remove({ 'meta.memberId': memberId, 'meta.scanType': scanType, 'meta.type': 'scanDoc' });
            } catch (error) {
                throw new Meteor.Error('400', error.message);
            }
        },
        resetUploadedExtraDoc(credentials, safeword, _id) {
            this.unblock();
            check(credentials, Object)
            check(safeword, String);
            check(_id, String);
            console.log('Id:', _id)
            try {
                Meteor.call('checkCredentials', credentials);
                return ScannedAgreements.collection.remove({ _id });
            } catch (error) {
                throw new Meteor.Error('400', error.message);
            }
        },
        updateMemberData(credentials, document) {
            this.unblock();
            check(credentials, Object);
            check(document, Object);
            try {
                Meteor.call('checkCredentials', credentials);
                return Member.update({ _id: document._id }, { $set: { ...document } });
            } catch (error) {
                log(error)
                throw new Meteor.Error('memberUpdateError', error.message);
            }
        },
        extDiscardMember(credentials, { _id, reason, owner } = {}) {
            check(_id, String);
            check(reason, String);
            check(owner, String);
            check(credentials, Object);
            try {
                Meteor.call('checkCredentials', credentials);
                const discarded = {
                    reason,
                    status: true,
                    owner: owner,
                    date: new Date(),
                }
                Member.update({ _id }, { $set: { discarded } });
            } catch (error) {
                throw new Meteor.Error('memberDiscard', error.message);
            }
        },
    })
}