import { buffer } from 'micro';
import Stripe from 'stripe';
import { connect } from '../../../utils/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
        bodyParser: false, // Desativa o bodyParser para trabalhar com raw body
    },
};

const webhookHandler = async (req, res) => {
    // if (req.method === 'POST') {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error('Webhook signature verification failed.', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Processar o evento
        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;

            
            console.log(`Payment for subscription ${subscriptionId} was successful.`);
        }

        if (event.type === 'invoice.payment_failed') {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;

            // Atualize o status da assinatura para "falha"
            // Exemplo: await updateSubscriptionStatus(subscriptionId, 'payment_failed');
            console.log(`Payment for subscription ${subscriptionId} failed.`);
        }

        res.status(200).json({ received: true });
    // } else {
    //     res.setHeader('Allow', 'POST');
    //     res.status(405).end('Method Not Allowed');
    // }
};

export default webhookHandler;