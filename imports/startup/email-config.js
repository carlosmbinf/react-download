import { check } from 'meteor/check';
import { Random } from 'meteor/random'
import { Accounts } from 'meteor/accounts-base'

Accounts.emailTemplates.enrollAccount.subject = (user) => {
    return `[Vacancy Rewards] Verify Your Email Address`;
};

Accounts.emailTemplates.enrollAccount.text = (user, url) => {
    return `To verify your email address (${user.emails[0].address}) visit the following link:\n\n`
        + url
        + `\n\nIf you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${Meteor.settings.private.SES.supportEmail}.`
};
Accounts.emailTemplates.resetPassword.subject = (user) => {
    return `[Vacancy Rewards] Verify Your Email Address`;
};

Accounts.emailTemplates.resetPassword.text = (user, url) => {
    return `To verify your email address (${user.emails[0].address}) visit the following link:\n\n`
        + url
        + `\n\nIf you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${Meteor.settings.private.SES.supportEmail}.`
};

Accounts.emailTemplates.resetPassword.from = () => {
    // Overrides the value set in `Accounts.emailTemplates.from` when resetting
    // passwords.
    return `${Meteor.settings.private.SES.from}`;
};
Accounts.emailTemplates.verifyEmail = {
    subject() {
        return `[Vacancy Rewards] Verify Your Email Address`;
    },
    text(user, url) {
        return `To verify your email address (${user.emails[0].address}) visit the following link:\n\n`
            + url
            + `\n\nIf you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${Meteor.settings.private.SES.supportEmail}.`
    }
};

Email.setting = {
    region: Meteor.settings.private.SES.region,
    accessKeyId: Meteor.settings.private.SES.accessKeyId,
    secretAccessKey: Meteor.settings.private.SES.secretAccessKey
};

Meteor.methods({
    sendWelcomeEmailToNewMember(member) {
        try {

            const letter = Meteor.call('getWelcomeLetter');

          const clubName = Meteor.settings.public.clubName;
          const baseURL = Meteor.settings.public.baseURL;

            if (letter) {
                let lang = member.language;
                
                let emailContent = {
                    to: member.email,
                    subject: letter.subject[lang],
                    html: ` <div>
                                <div style='background-color: #255C9C; color: white;'>
                                    <h1>${letter.greeting[lang]} ${member.firstName} ${member.lastName}</h1>
                                </div>
                                <div style="text-align: justify; width: 80%; padding-top: 20px;">
                                   
                                    <p>${letter.textOne[lang] || ''}</p>
                                    <p>${letter.urlOne || ''}</p>
                                    <p>${letter.textTwo && letter.textTwo[lang] || ''}</p>
                                    <p>${letter.urlTwo || ''}</p>
                                    <p>${letter.footer && letter.footer[lang] || ''}</p>
                                </div>
                            </div>`
                }

                Meteor.call('sendWelcomeEmail', emailContent);
                console.log(emailContent);
            } else throw new Error('No welcome email is assigned to this Membership instance');
        } catch (error) {
            throw new Meteor.Error('400', error.message);
        }
    },
    sendWelcomeEmail(emailContent) {
        check(emailContent, Object);
        try {
            const { to, subject, text, html } = emailContent;
            Email.send({
                from: Meteor.settings.private.SES.from,
                to,
                subject,
                text,
                html
            });
        } catch (error) {
            throw new Meteor.Error('welcomeEmailDelivaryFailure', error.message, error.message);
        }
    },
    'sendVerificationEmail': (id, extraTokenData) => {
        let newUser = Meteor.users.findOne({ _id: id });
        var email = newUser.emails[0].address
        const { email: realEmail, user, token } = Accounts.generateVerificationToken(newUser._id, email, extraTokenData);

        const url = Accounts.urls.verifyEmail(token);

        const supportEmail = "support-vacancyrewards@gmail.com";
        const emailBody = `To verify your email address (${email}) visit the following link:\n\n ` + url + `\n\nIf you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

        var mailOptions = {
            from: Meteor.settings.private.SES.from,
            to: newUser.emails[0].address,
            subject: "[Vacancy Rewards] Verify Your Email Address",
            text: emailBody,
        };

        Email.send(mailOptions);
    },
    'sendVerificationEnrollEmail': (id, email) => {
        var user = Meteor.users.findOne(id);
        if (!user) throw new Error("Can't find user");
        if (!email && user.emails && user.emails[0])
            email = user.emails[0].address;
        if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email))
            throw new Error("No such email for user.");

        const { email: realEmail, u, token } = Accounts.generateVerificationToken(user._id, email);

        var when = new Date();
        Meteor.users.update(user._id, {
            $set: {
                "services.password.reset": {
                    token: token,
                    email: email,
                    when: when,
                    reason: 'enroll'
                }
            }
        });

        var enrollAccountUrl = Accounts.urls.enrollAccount(token);
        const supportEmail = "support-vacancyrewards@gmail.com";
        const emailBody = `To verify your email address (${email}) visit the following link:\n\n ` + enrollAccountUrl + `\n\nIf you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;
        var options = {
            to: email,
            from: Accounts.emailTemplates.from,
            subject: Accounts.emailTemplates.enrollAccount.subject(user),
            text: Accounts.emailTemplates.enrollAccount.text(user, enrollAccountUrl)
        };
        console.log(options.text);

        try {
            Email.send(options);
        } catch (e) {
            throw new Meteor.Error(500, e);
        }

    },
    'sendResetPasswordEmail': (id) => {
        // let newUser = Meteor.users.findOne({"emails.address": email});
        var user = Meteor.users.findOne(id);
        if (!user)
            throw new Error("Can't find user");
        var email = user.emails[0].address;

        const { email: realEmail, u, token } = Accounts.generateVerificationToken(user._id, email);

        var when = new Date();
        Meteor.users.update(user._id, {
            $set: {
                "services.password.reset": {
                    token: token,
                    email: email,
                    when: when,
                    reason: 'reset'
                }
            }
        });

        var AccountUrl = Accounts.urls.resetPassword(token);
        const supportEmail = "support-vacancyrewards@gmail.com";
        const emailBody = `To verify your email address (${email}) visit the following link:\n\n ` + AccountUrl + `\n\nIf you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;
        var options = {
            to: email,
            from: Accounts.emailTemplates.from,
            subject: Accounts.emailTemplates.resetPassword.subject(user),
            text: Accounts.emailTemplates.resetPassword.text(user, AccountUrl)
        };

        Email.send(options);
    },
    'verifyProfileEmail': (token) => {
        check(token, String);
        let user = Meteor.users.findOne({ _id: Meteor.userId(), 'profile.tokenRecords.token': token });
        if (!user) throw new Meteor.Error('403', 'Verify email link is for unknown address');

        let tokenRecord = user.profile.tokenRecords.find((t) => {
            return t.token === token;
        })

        return Meteor.users.update(
            {
                _id: user._id,
                'profile.emails.address': tokenRecord.address
            },
            {
                $set: { 'profile.emails.$.verified': true },
                $pull: { 'profile.tokenRecords': { address: tokenRecord.address } }
            });
    },
    'sendAdminPassword': (password) => {
        check(password, String);
        let admin = Meteor.settings.private.adminEmail;
        loginAt = Meteor.settings.private.site;
        let site = Meteor.settings.public.site;
        let baseURL = Meteor.settings.public.baseURL;
        Email.send({
            from: Meteor.settings.private.SES.from,
            to: Meteor.settings.private.emailToSendInitialUser,
            subject: "[Vacancy Rewards] New Admin Account For "+site+" APP was created",
            text: `You have to create a new password for admin user in ${site} APP. Your user is: ${admin} and your password: ${password} you can login at ${baseURL}`
        })
    },
    'sendSuccessfulEnrollmentEmail'(id) {
        //id <= this is the _id of the user who set his password for the first time
        check(id, String);
        let user = Meteor.users.findOne({ _id: id });
        let when = user.services.resume.loginTokens[0].when;
        let admin = Meteor.users.findOne({});
        if (!user) {
            throw new Error(`Can't find user`);
        } else {
            let clientOptions = {
                from: Meteor.settings.private.SES.from,
                to: user.emails[0].address,
                subject: '[Vacancy Rewards] Successful Account Activation',
                text: 'By setting a new password for your account you have completed the enrollment process in our site, thanks!'
            };
            let adminOptions = {
                from: Meteor.settings.private.SES.from,
                to: admin.emails[0].address,
                subject: '[Vacancy Rewards] Successful Account Activation',
                text: `The user with email: ${user.emails[0].address} has completed the enrollment process 
        by setting the password on: ${when.toLocaleString()}`
            }
            Email.send(clientOptions);
            Email.send(adminOptions);
        }
    },
    'sendPasswordToNewUser'(userId) {
        check(userId, String);
        try {
            let password = Random.id();
            Accounts.setPassword(userId, password);
            let user = Meteor.users.findOne({ _id: userId });
            let baseURL = Meteor.settings.public.baseURL;
            const clubName = Meteor.settings.public.clubName;
            let site = Meteor.settings.public.site;

            let mailOptions = {
                from: Meteor.settings.private.SES.from,
                to: user.emails[0].address,
                subject: `[Vacancy Rewards] New User's Account For ${site} APP was created`,
                text: `Hello ${user.profile.first_name}:
                Here's your new user: ${user.emails[0].address} and password: '${password}', now you can use it to login at ${baseURL}.`
            };
            console.log(`Password: ${password}`);
            Email.send(mailOptions);
        } catch (error) {
            throw Meteor.Error('400', error.message);
        }
    }
})
