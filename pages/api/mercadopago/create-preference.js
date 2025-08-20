import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PRODUCTS } from '@/lib/products';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { productId, userId } = req.body;
    
    // Verificar se o productId é válido
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
      return res.status(400).json({ error: 'Produto inválido' });
    }

    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    });
    
    const preference = new Preference(client);
    
    // Criar a preferência
    const result = await preference.create({
      body: {
        items: [
          {
            id: product.id,
            title: product.title,
            description: product.description,
            quantity: 1,
            currency_id: 'BRL', // ou 'USD' se preferir dólares
            unit_price: product.price
          }
        ],
        back_url: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/failure`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/pending`
        },
        // auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook`,
        external_reference: JSON.stringify({
          userId,
          productId,
          credits: product.credits
        })
      }
    });

    return res.status(200).json({ preferenceId: result.id });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return res.status(500).json({ error: 'Erro ao criar preferência de pagamento' });
  }
}