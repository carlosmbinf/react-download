SearchIndex = {}
Schema = {}
Collection = {}

routesToText = {
    members: 'members',
    users: 'employees',
   
}

fixDateTimezone = date => {
    const timezoneOffset = date.getTimezoneOffset() / 60;
    date.setHours(date.getHours() + timezoneOffset)
    return date;
}

export const injectStrings = (target_string, r_strings, i_strings) => {
    for (let i = 0; i < r_strings.length; i++) {
        target_string = target_string.replace(RegExp(r_strings[i], 'gi'), i_strings[i]);
    }
    return target_string;
}

export const injectStringsTwo = (target_string, r_strings, i_strings) => {
    for (prop in r_strings) {
        target_string = target_string.replace(RegExp(r_strings[prop], 'gi'), i_strings[prop]);
    }
    return target_string;
}
export const removelinesBreaks = (cad) => {
    //check(cad, String)
    cad += ' '
    cad = cad.replace(/(\r\n|\n|\r)/gm, " ");
    cad = cad.replace(/\s+/g, " ");
    return cad;
}

export const getMonthName = function (month, language) {
    switch (month) {
        case 0:
            return language === 'en_EN' ? 'January' : 'Enero';
        case 1:
            return language === 'en_EN' ? 'February' : 'Febrero';
        case 2:
            return language === 'en_EN' ? 'March' : 'Marzo';
        case 3:
            return language === 'en_EN' ? 'April' : 'Abril';
        case 4:
            return language === 'en_EN' ? 'May' : 'Mayo';
        case 5:
            return language === 'en_EN' ? 'June' : 'Junio';
        case 6:
            return language === 'en_EN' ? 'July' : 'Julio';
        case 7:
            return language === 'en_EN' ? 'August' : 'Agosto';
        case 8:
            return language === 'en_EN' ? 'September' : 'Septiembre';
        case 9:
            return language === 'en_EN' ? 'October' : 'Octubre';
        case 10:
            return language === 'en_EN' ? 'November' : 'Noviembre';
        case 11:
            return language === 'en_EN' ? 'December' : 'Diciembre';
        default:
    }
}

export const setDefaultCountry = (templateInstance, countryCode) => {
    Meteor.setTimeout(function () {
        let itiElemJQ = templateInstance.$(".intl-tel-input input");
        itiElemJQ.each(function () {
            let currentEl = $(this);
            if (currentEl.val() === "") { // set the initial country if there's no value already
                let itiElement = currentEl[0];
                let iti = window.intlTelInputGlobals.getInstance(itiElement);
                iti.setCountry(countryCode);
            }
        })
    }, 500);
}

export const allDocTypes = ['DP', 'MP', 'ADP', 'PF'];

export const floor2Decimals = number => Math.floor(number * 100) / 100;

if (Meteor.isServer) {
    Meteor.methods({
        getAuthToken() {
            let baseUri = Meteor.settings.public.secureApiForMembersData.baseUri;
            let credentials = Meteor.settings.private.secureApiForMembersData.credentials;
            return HTTP.call('POST', `${baseUri}/in/login`, {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                data: {
                    username: credentials.username,
                    password: credentials.password
                }
            });
        }
    });
} else {

    Template.registerHelper('formatDate', date => {
        return date.toLocaleDateString();
    });

    Template.registerHelper('isDiscarded', doc => {
        return doc && doc.discarded && doc.discarded.status;
    });
}

export const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
export const curry = (f, arr = []) => (...args) => (a => a.length === f.length ? f(...a) : curry(f, a))([...arr, ...args]);
export const addProperty = curry((obj, property) => ({
    ...obj,
    ...property
}));

const compare = curry((fn, reference, toCompare) => fn(reference, toCompare));

const errorThrower = ({
    error,
    message,
    details
} = {}) => {
    throw new Meteor.Error(error, message, details)
};

const compareCredentials = ({
        user: apiUser,
        password: apiPassword
    } = {}, {
        user,
        password
    } = {}) =>
    user === apiUser && password === apiPassword ? 'OK Pass' : errorThrower({
        error: 'invalidCredentials',
        message: 'Credentials do not match',
        details: 'Unauthorize Credentials'
    })

if (Meteor.isServer) {
    export const isAuthorize = compare(compareCredentials, Meteor.settings.private.api);
}
export const log = console.log;
export const makeFooter = function (currentPage, pageCount, language) {
    let page = {
        'en_EN': 'Page',
        'es_ES': 'Página'
    }
    let prep = {
        'en_EN': 'of',
        'es_ES': 'de'
    }
    return {
        margin: 10,
        columns: [{
            fontSize: 9,
            text: [{
                    text: '--------------------------------------------------------------------------' +
                        '\n',
                    margin: [0, 20]
                },
                {
                    text: `${page[language]}  ${currentPage.toString()}  ${prep[language]}  ${pageCount}`,
                    style: 'footer'
                }
            ],
            alignment: 'center'
        }]
    };
}