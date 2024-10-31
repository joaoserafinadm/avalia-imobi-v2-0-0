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
    if (req.method === 'POST') {
        let event;
        const buf = await buffer(req); // Captura o buffer da requisição
        const sig = req.headers['stripe-signature']; // Pega o header de assinatura do Stripe

        try {
            // Verifica a assinatura do evento
            event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Processa o evento
        if (event.type === 'invoice.payment_succeeded') {

            const invoice = event.data.object;

            const status = invoice.status;
            const subscriptionId = invoice.subscription;
            const invoiceData = {
                date: new Date(),
                id: invoice.id,
                url: invoice.invoice_pdf,
                total: invoice.total,
            };

            const subscriptionValue = invoice.total;

            const customer = invoice.customer;

            console.log(`Payment for subscription ${subscriptionId} was successful.`);


            const { db } = await connect();

            // Verifica se a empresa existe
            const company = await db.collection('companies').findOne(
                {
                    "paymentData.customerId": customer
                }
            );

            if (company) {
                // Se paymentData.invoices não existir, cria um array vazio
                const updatedInvoices = company.paymentData.invoices || [];

                // Adiciona o invoiceData ao array de invoices
                updatedInvoices.push(invoiceData);

                // Atualiza o status, subscriptionId e invoices no campo paymentData
                await db.collection('companies').updateOne(
                    { "_id": company._id },
                    {
                        $set: {
                            "paymentData.status": status,
                            "paymentData.subscriptionId": subscriptionId,
                            "paymentData.invoices": updatedInvoices,
                            "paymentData.subscriptionValue": subscriptionValue,
                            "active": true,
                            "errorStatus": false,
                            "dateLimit": false
                        }
                    }
                );

                console.log('Company payment data updated successfully.');
            } else {
                console.error('Company not found for customer:', customer);
            }







            if (invoice.collection_method === 'send_invoice') {
                await stripe.invoices.sendInvoice(invoice.id);
            }


        }

        if (event.type === 'invoice.payment_failed') {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;
            console.log(invoice);
            console.log(`Payment for subscription ${subscriptionId} failed.`);
        }

        res.status(200).json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};

export default webhookHandler;
