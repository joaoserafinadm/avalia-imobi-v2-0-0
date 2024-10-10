import { connect } from '../../../utils/db'
import { verify, sign } from 'jsonwebtoken'
import { ObjectId, ObjectID } from 'bson'
import cookie from 'cookie'

import { Payment, MercadoPagoConfig } from 'mercadopago';


const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });

const payment = new Payment(client);

const authenticated = fn => async (req, res) => {
    verify(req.cookies.auth, process.env.JWT_SECRET, async function (err, decoded) {
        if (!err && decoded) {
            return await fn(req, res)
        }
        res.status(500).json({ message: 'You are not authenticated.' });
    })
}

export default authenticated(async (req, res) => {

    if (req.method === 'POST') {

        const { company_id, user_id, cardTokenId, last4, cardholderName, email } = req.body

        payment.create({
            body: {
                transaction_amount: 10,
                token: cardTokenId,
                description: 'teste',
                installments: 1,
                // payment_method_id: req.paymentMethodId,
                // issuer_id: req.issuer,
                payer: {
                    email: email,
                    // identification: {
                    //     type: req.identificationType,
                    //     number: req.number
                    // }
                }
            },
            requestOptions: { idempotencyKey: '123' }
        })
            .then((result) => console.log("result", result))
            .catch((error) => console.log("error", error));






    }




})