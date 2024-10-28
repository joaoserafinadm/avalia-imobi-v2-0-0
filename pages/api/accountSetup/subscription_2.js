import { connect } from '../../../utils/db'
import { verify } from 'jsonwebtoken'
import { ObjectId } from 'bson'
import fetch from 'node-fetch'; // Para realizar chamadas HTTP para a API REST
import mercadopago from 'mercadopago';



const authenticated = fn => async (req, res) => {
    verify(req.cookies.auth, process.env.JWT_SECRET, async function (err, decoded) {
        if (!err && decoded) {
            return await fn(req, res)
        }
        res.status(500).json({ message: 'You are not authenticated.' });
    })
}

export default authenticated(async (req, res) => {

    console.dir(mercadopago, { depth: null });

    if (req.method === "POST") {


        // mercadopago.configurations.setAccessToken('<ACCESS_TOKEN>');

        mercadopago.payment.create({
            transaction_amount: req.transaction_amount,
            token: req.token,
            description: req.description,
            installments: req.installments,
            payment_method_id: req.paymentMethodId,
            issuer_id: req.issuer,
            payer: {
                email: req.email,
                identification: {
                    type: req.identificationType,
                    number: req.number
                }
            }
        }, {
            idempotencyKey: '<SOME_UNIQUE_VALUE>'
        })
            .then((result) => console.log(result))
            .catch((error) => console.log(error));

    }




})