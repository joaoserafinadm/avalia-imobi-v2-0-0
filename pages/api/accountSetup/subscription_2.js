import { connect } from '../../../utils/db'
import { verify } from 'jsonwebtoken'
import { ObjectId } from 'bson'
import fetch from 'node-fetch'; // Para realizar chamadas HTTP para a API REST
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';

const authenticated = fn => async (req, res) => {
    verify(req.cookies.auth, process.env.JWT_SECRET, async function (err, decoded) {
        if (!err && decoded) {
            return await fn(req, res)
        }
        res.status(500).json({ message: 'You are not authenticated.' });
    })
}

export default authenticated(async (req, res) => {

    if (req.method === "POST") {
        const {
            token,
            issuer_id,
            payment_method_id,
            transaction_amount,
            installments,
            description,
            payer,
            deviceId,
            external_reference,
            company_id
        } = req.body

        const client = new MercadoPagoConfig({
            accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
        });
        const payment = new PreApproval(client);

        const body = {
            card_token_id: token,
            payment_method_id: payment_method_id,
            payer_email: 'joaoserafin.adm@gmail.com', //TESTE
            reason: 'Assinatura Avalia Imobi',
            auto_recurring: {
                frequency: 1,
                frequency_type: 'months', // Frequência mensal
                transaction_amount: 10,
                currency_id: "BRL", // Moeda
                // start_date: startDate.toISOString(), 
            },
            back_url: 'https://avaliaimobi.com.br',
            external_reference: external_reference, //TESTE
            status: "authorized", // Definindo o status como autorizado

        };

        // Step 6: Make the request with custom headers
        const requestOptions = {
            headers: {
                'X-meli-session-id': deviceId, // Custom header for device ID
                'Content-Type': 'application/json', // Make sure to set the Content-Type header as well
                'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                // "Idempotency-Key": uuidv4(), // Adding idempotency key if needed
            }
        };

        try {
            const response = await payment.create({
                body,
                requestOptions // Pass the options with headers
            });

            // const subscriptionResponse = await fetch(`https://api.mercadopago.com/preapproval/${response.data.id}`, {
            //     method: 'GET',
            //     headers: {
            //         'X-meli-session-id': deviceId, // Custom header for device ID
            //         'Content-Type': 'application/json', // Make sure to set the Content-Type header as well
            //         'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
            //         "Idempotency-Key": uuidv4(), // Adding idempotency key if needed
            //     }
            // })

            res.status(200).json({ message: 'Payment created successfully', data: response });


            // if (!subscriptionData?.id) {
            //     return res.status(400).json({ message: "Error creating subscription", details: response })
            // } else {


            //     const data = {
            //         // user_id,
            //         cardToken: token,
            //         // last4,
            //         // cardholderName,
            //         // email,
            //         subscription_id: response, // ID da assinatura
            //         // customer_status: subscriptionData.status,
            //         // paymentMethod_id: subscriptionData.payment_method_id,
            //         // amount: 79.90,
            //         // usersCount: 1,
            //         // amountPerUser: 0,
            //         // dateCreated: new Date(),
            //         // dateUpdated: new Date()
            //     };


            //     const db = await connect();

            //     const DBresponse = await db.collection('companies').updateOne(
            //         { _id: ObjectId("67142d17e50f180bbe8a1162") },
            //         {
            //             $set: {
            //                 "active": true,
            //                 "errorStatus": false,
            //                 "dateLimit": false,
            //                 "paymentData": data
            //             }
            //         }
            //     );


            //     res.status(200).json({ message: 'Payment created successfully', data: response });
            // }

        } catch (error) {
            console.error('Payment Error:', error);
            res.status(500).json({ message: 'Payment failed', error });
        }

    } else if (req.method === "GET") {

        const { response } = req.query

        res.status(200).json({ response })



    }
});



// import { connect } from '../../../utils/db'
// import { verify } from 'jsonwebtoken'
// import { ObjectId } from 'bson'
// import fetch from 'node-fetch'; // Para realizar chamadas HTTP para a API REST
// import { MercadoPagoConfig, Payment } from 'mercadopago';
// import { v4 as uuidv4 } from 'uuid';

// const authenticated = fn => async (req, res) => {
//     verify(req.cookies.auth, process.env.JWT_SECRET, async function (err, decoded) {
//         if (!err && decoded) {
//             return await fn(req, res)
//         }
//         res.status(500).json({ message: 'You are not authenticated.' });
//     })
// }

// export default authenticated(async (req, res) => {

//     if (req.method === "POST") {
//         console.log("", req.body)

//         const client = new MercadoPagoConfig({
//             accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
//         });
//         const payment = new Payment(client);

//         const body = {
//             token: token,
//             transaction_amount: 12.34,
//             description: 'Payment description',
//             payment_method_id: payment_method_id,
//             payer: {
//                 email: 'joaoserafin.adm@gmail.com'
//             },
//             installments: 1,
//             statement_descriptor: 'Mercado Pago',
//             external_reference: '123'
//         };

//         // Step 6: Make the request with custom headers
//         const requestOptions = {
//             headers: {
//                 'X-meli-session-id': deviceId, // Custom header for device ID
//                 'Content-Type': 'application/json', // Make sure to set the Content-Type header as well
//                 'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
//             }
//             // idempotencyKey: uuidv4(), // Adding idempotency key if needed
//         };

//         try {
//             const response = await payment.create({
//                 body,
//                 requestOptions // Pass the options with headers
//             });
//             res.status(200).json({ message: 'Payment created successfully', data: response });
//         } catch (error) {
//             console.error('Payment Error:', error);
//             res.status(500).json({ message: 'Payment failed', error });
//         }

//     }
// });
