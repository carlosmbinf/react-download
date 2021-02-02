if (Meteor.isClient) {
    import ApolloClient from "apollo-boost/lib/index";
    import gql from "graphql-tag";

    const baseUri = Meteor.settings.public.secureApiForMembersData.baseUri;

    const ADD_DOCUMENT = gql`
        mutation addDocument($input: DocumentInput){
            addDocument(input: $input)
        }
    `;

    const ADD_PAYMENT = gql`
        mutation addPayment($inputPayment: PaymentInput){
            addPayment(input: $inputPayment)
        }
    `;

    const createGraphQLClient = token => {
        return new ApolloClient({
            uri: `${baseUri}/in`,
            fetchOptions: {
                credentials: 'include'
            },
            request: operation => {
                operation.setContext({
                    headers: {
                        authorization: token || `Bearer ${token}`,
                    }
                });
            }
        });
    }

    /**
     * 
     * @param {Object} document Object containing { referenceID, type, content }
     * @param {Function} callback Called with error or success
     */
    export const addDocument = (document, callback) => {
        const { referenceID, content, type } = document;

        //Uncomment for testing only
        /* callback(null, `secured doc: ${referenceID} - ${type}`); */

        Meteor.call('getAuthToken', (error, result) => {
            if (error) sAlert.error('Failed to retrieve auth token from api');
            if (result && result.data && result.data.success) {
                let token = result.data.token;

                let apolloClient = createGraphQLClient(token);
                apolloClient.mutate({ mutation: ADD_DOCUMENT, variables: { input: { referenceID, content, type } } })
                    .then(result => callback(null, result))
                    .catch(error => callback(error));
            }
        })
    }

    export const addPayment = (payment, callback) => {
        let { referenceID, num, expDate, responsable, bank, qty, date, code } = payment;
        let creditCard = num;
        let responsible = responsable;
        let amount = qty;

        let inputPayment = { referenceID, creditCard, expDate, responsible, bank, amount, date, code }

        if (payment.type === 'MP') {
            inputPayment.noPayments = payment.NoPayments;
        }

        //Uncomment for testing only
        /* callback(null, `secured payment: ${referenceID} - ${responsible}`); */

        Meteor.call('getAuthToken', (error, result) => {
            if (error) sAlert.error('Failed to retrieve auth token from api');
            if (result && result.data && result.data.success) {
                let token = result.data.token;
                let apolloClient = createGraphQLClient(token);

                apolloClient.mutate({ mutation: ADD_PAYMENT, variables: { inputPayment } })
                    .then(result => {
                        if (result && result.data && result.data.addPayment) {
                            callback(null, result)
                        } else {
                            callback('There was an error securing payment, try again... ')
                        };
                    })
                    .catch(error => callback(error));
            }
        });
    }
}