import { connect } from '../../../utils/db'
import { verify } from 'jsonwebtoken'
import { ObjectId } from 'bson'
import fetch from 'node-fetch'; // Para realizar chamadas HTTP para a API REST
import { MercadoPagoConfig, Payment } from 'mercadopago';



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


        const client = new MercadoPagoConfig({ accessToken: 'access_token', options: { timeout: 5000, idempotencyKey: 'abc' } });

        const payment = new Payment(client);

        const body = {
            transaction_amount: 10,
            description: req.description,
            payment_method_id: req.paymentMethodId,
            payer: {
                email: req.email
            },
        };

        const requestOptions = {
            idempotencyKey: '<IDEMPOTENCY_KEY>',
        };

        // Step 6: Make the request
        payment.create({ body, requestOptions }).then(console.log).catch(console.log);

        res.status(200).json({ message: 'ok' })

    }




})