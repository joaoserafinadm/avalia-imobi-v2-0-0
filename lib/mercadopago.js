import { MercadoPagoConfig, Preference } from 'mercadopago';

// Inicialize o client do Mercado Pago com sua chave de acesso
// Obtenha suas credenciais em: https://www.mercadopago.com.br/developers/panel/credentials
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});