import { connect } from '../../../utils/db'
import { verify } from 'jsonwebtoken'
import { ObjectId } from 'bson'
import fetch from 'node-fetch'; // Para realizar chamadas HTTP para a API REST
import { MercadoPagoConfig, Payment } from 'mercadopago';
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
        console.log("req.body.", req.body)

        const client = new MercadoPagoConfig({
            accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
        });
        const payment = new Payment(client);

        const body = {
            token: req.body.token,
            transaction_amount: 12.34,
            description: 'Payment description',
            payment_method_id: req.body.payment_method_id,
            payer: {
                email: 'joaoserafin.adm@gmail.com'
            },
            installments: 1,
            statement_descriptor: 'Mercado Pago',
            external_reference: '123'
        };

        // Step 6: Make the request with custom headers
        const requestOptions = {
            headers: {
                'X-meli-session-id': req.body.deviceId, // Custom header for device ID
                'Content-Type': 'application/json', // Make sure to set the Content-Type header as well
            },
            idempotencyKey: uuidv4(), // Adding idempotency key if needed
        };

        try {
            const response = await payment.create({
                body, 
                requestOptions // Pass the options with headers
            });
            res.status(200).json({ message: 'Payment created successfully', data: response });
        } catch (error) {
            console.error('Payment Error:', error);
            res.status(500).json({ message: 'Payment failed', error });
        }

    }
});
