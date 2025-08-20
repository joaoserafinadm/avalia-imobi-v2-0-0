// import { connect } from "@/utils/db";
import { verify } from "jsonwebtoken";
import { ObjectId } from "bson";
import { Preference } from "mercadopago";
import mpClient from "@/lib/mercado-pago";

const dolar = 5.85;

const authenticated = (fn) => async (req, res) => {
  verify(
    req.cookies.auth,
    process.env.JWT_SECRET,
    async function (err, decoded) {
      if (!err && decoded) {
        return await fn(req, res);
      }
      res.status(500).json({ message: "You are not authenticated." });
    }
  );
};

export default authenticated(async (req, res) => {
  if (req.method === "POST") {
    try {
      const { user_id, email } = req.body;
      const preference = new Preference(mpClient);

      const productSelected = {
        id: "avalia-1",
        title: "Assinatura Avalia Imobi PIX",
        description:
          "Assinatura da plataforma Avalia Imobi por 30 dias",
        // price: 79.90,
        price: 1,
        recommended: false,
      }

      const createdPreference = await preference.create({
        body: {
          external_reference: new ObjectId().toString(), // IMPORTANTE: Isso aumenta a pontuação da sua integração com o Mercado Pago - É o id da compra no nosso sistema
          metadata: {
            user_id, // O Mercado Pago converte para snake_case, ou seja, testeId vai virar teste_id
            // userEmail: userEmail,
            // plan: '123'
            //etc
          },
          ...(email && {
            payer: {
              email: email,
            },
          }),

          items: [
            {
              id: productSelected.id,
              description: productSelected.description,
              title: productSelected.title,
              quantity: 1,
              unit_price: +productSelected.price,
              currency_id: "BRL",
              category_id: productSelected.id, // Recomendado inserir, mesmo que não tenha categoria - Aumenta a pontuação da sua integração com o Mercado Pago
            },
          ],
          payment_methods: {
            // Descomente para desativar métodos de pagamento
            //   excluded_payment_methods: [
            //     {
            //       id: "bolbradesco",
            //     },
            //     {
            //       id: "pec",
            //     },
            //   ],
            //   excluded_payment_types: [
            //     {
            //       id: "debit_card",
            //     },
            //     {
            //       id: "credit_card",
            //     },
            //   ],
            installments: 12, // Número máximo de parcelas permitidas - calculo feito automaticamente
          },
          auto_return: "approved",
          back_urls: {
            success: `https://app.avaliaimobi.com.br/accountSetup?status=Assinatura`,
            failure: `https://app.avaliaimobi.com.br/accountSetup?status=Assinatura`,
            pending: `https://app.avaliaimobi.com.br/api/mercadopago/pending`, // Criamos uma rota para lidar com pagamentos pendentes
          },
        },
      });

      if (!createdPreference.id) {
        throw new Error("No preferenceID");
      }

      return res.status(200).json({
        preferenceId: createdPreference.id,
        initPoint: createdPreference.init_point,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
  }
});