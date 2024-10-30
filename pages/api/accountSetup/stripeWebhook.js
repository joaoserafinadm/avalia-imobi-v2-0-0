import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verifique a assinatura do webhook para garantir que veio do Stripe
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Processando eventos específicos
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Verifique se o pagamento foi bem-sucedido
    const paymentStatus = session.payment_status;

    if (paymentStatus === 'paid') {
      // O pagamento foi aprovado, você pode atualizar seu banco de dados
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      // Atualize o status da assinatura no seu banco de dados
      // Exemplo: await updateSubscriptionStatus(customerId, subscriptionId, 'active');

      console.log('Pagamento aprovado para o cliente:', customerId);
    }
  } else if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    const customerId = invoice.customer;

    // O pagamento falhou, você pode registrar o erro no seu banco de dados
    console.log('Pagamento falhou para o cliente:', customerId);
  }

  // Retorne uma resposta 200 para o Stripe confirmar que o evento foi recebido com sucesso
  res.status(200).json({event});
}
