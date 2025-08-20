import { Payment } from "mercadopago";
import mpClient from "@/lib/mercado-pago";
import { connect } from "@/utils/db";

export default async function handler(req, res) {
  // Aceita apenas requisições GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rota para lidar com pagamentos pendentes do Mercado Pago (i.e Pix)
  // Quando o cliente clica no botão 'Voltar para o site' no Checkout depois de pagar (ou não) o Pix
  const {
    payment_id: paymentId,
    external_reference: externalReference,
    collection_status,
    preference_id: preferenceId
  } = req.query;

  console.log('Pending payment params:', { paymentId, externalReference, collection_status, preferenceId });

  if (!paymentId) {
    console.log('Payment ID não fornecido, redirecionando para home');
    return res.redirect(302, "/?status=erro&message=payment_id_missing");
  }

  try {
    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    console.log('Payment status:', paymentData.status);
    console.log('Payment metadata:', paymentData.metadata);

    // Verifica se o pagamento foi aprovado
    if (paymentData.status === "approved" && paymentData.date_approved !== null) {
      console.log('Pagamento aprovado! Webhook já processou ou processará os créditos.');

      // Verifica se tem presentation_id nos metadados para redirecionar corretamente
      const user_id = paymentData.metadata?.user_id;

      const successUrl = `https://app.avaliaimobi.com.br/accountSetup?status=Assinatura`

      return res.redirect(302, successUrl);
    }

    // Verifica se o pagamento foi rejeitado
    if (paymentData.status === "rejected" || paymentData.status === "cancelled") {
      console.log('Pagamento rejeitado/cancelado');

      const user_id = paymentData.metadata?.user_id;
      const failureUrl = `https://app.avaliaimobi.com.br/accountSetup?status=Assinatura`

      return res.redirect(302, failureUrl);
    }

    // Pagamento ainda pendente (aguardando pagamento do Pix)
    console.log('Pagamento ainda pendente');

    const user_id = paymentData.metadata?.user_id;
    const pendingUrl = `https://app.avaliaimobi.com.br/accountSetup?status=Assinatura`

    return res.redirect(302, pendingUrl);

  } catch (error) {
    console.error("Erro ao verificar pagamento:", error);

    // Em caso de erro, redireciona para página inicial com status de erro
    return res.redirect(302, "/?status=erro&message=server_error");
  }
}