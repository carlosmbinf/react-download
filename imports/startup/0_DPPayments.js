if (Meteor.isServer) {
    Meteor.methods({
        makeCheckout(payment, memberId) {
            this.unblock();
            try {
                let members = Meteor.call('getMembersWithSelector', { _id: memberId });
                if (members && members[0]) {

                    const checkoutAPI = Meteor.settings.private.secureApiForDPPayments;
                    const { uri, user, password } = checkoutAPI;

                    const { firstName, lastName, membershipType } = members[0];

                    let [first, middle = ''] = splitStringBySpace(firstName);

                    const params = {
                        LoginUser: user,
                        LoginPassword: password,
                        CCFname: first,
                        CCMname: middle,
                        CCLname: lastName,
                        CCConcept: membershipType,
                        CCAmount: payment.qty,
                        CCNumber: payment.num,
                        CCExpiration: payment.expDate,
                        CCSecCode: payment.code,
                        CCVISAMC: 'Visa',
                        UserID: '',
                    }
                    return HTTP.call('GET', uri, {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                        },
                        params
                    });
                };
            } catch (error) {
                throw new Meteor.Error(error.message);
            }
        }
    });
}

const splitStringBySpace = string => {
    const stringsArr = string.split(' ', 2);
    return stringsArr;
};

export const errorsMap = {
    201: 'Error: Indica que se detecto un error general en el sistema de Visa o Master Card, se recomienda esperar unos momentos para reintentar la transacción.',
    421: 'Error: Indica que el servicio 3D Secure no está disponible, se recomienda esperar unos momentos para reintentar la transacción.',
    422: 'Error: Indica que hubo un problema genérico al momento de realizar la Autenticación, no se debe enviar la transacción a Payworks.',
    423: 'Error: Indica que la Autenticación no fue exitosa, no se debe enviar la transacción a Payworks ya que el comprador no se pudo autenticar con éxito.',
    424: 'Error: Autenticación 3D Secure no fue completada. NO se debe enviar a procesar la transacción al motor de pagos Payworks, ya que la persona no está ingresando correctamente la contraseña 3D Secure.',
    425: 'Error: Autenticación Inválida. Indica que definitivamente NO se debe enviar a procesar la transacción a Payworks, ya que la persona no está ingresando correctamente la contraseña3D Secure.',
    430: 'Error: Tarjeta de Crédito nulo, la variable Card se envió vacía.',
    431: 'Error: Fecha de expiración nulo, la variable Expires se envió vacía.',
    432: 'Error: Monto nulo, la variable Total se envió vacía.',
    433: 'Error: Id del comercio nulo, la variable MerchantId se envió vacía.',
    434: 'Error: Liga de retorno nula, la variable ForwardPath se envió vacía.',
    435: 'Error: Nombre del comercio nulo, la variable MerchantName se envió vacía.',
    436: 'Error: Formato de TC incorrecto, la variable Card debe ser de 16 dígitos.',
    437: 'Error: Formato de Fecha de Expiración incorrecto, la variable Expires debe tener el siguiente formato: YY/MM donde YY se refiere al año y MM se refiere al mes de vencimiento de la tarjeta.',
    438: 'Error: Fecha de Expiración incorrecto, indica que el plástico esta vencido.',
    439: 'Error: Monto incorrecto, la variable Total debe ser un número menor a 999,999,999,999.## con la fracción decimal opcional, esta debe ser a lo más de 2 décimas.',
    440: 'Error: Formato de nombre del comercio incorrecto, debe ser una cadena de máximo 25 caracteres alfanuméricos.',
    441: 'Error: Marca de Tarjeta nulo, la variable CardType se envió vacía.',
    442: 'Error: Marca de Tarjeta incorrecta, debe ser uno de los siguientes valores: VISA (para tarjetas Visa) o MC (para tarjetas Master Card).',
    443: 'Error: CardType incorrecto, se ha especificado el CardType como VISA, sin embargo, el Bin de la tarjeta indica que esta no es Visa.',
    444: 'Error: CardType incorrecto, se ha especificado el CardType como MC, sin embargo, el Bin de la tarjeta indica que esta no es Master Card.',
    999: 'Error: Vacancyservices no disponible.',
}
