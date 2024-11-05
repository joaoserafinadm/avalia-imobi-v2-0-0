import { connect } from '../../../utils/db'
import { verify, sign } from 'jsonwebtoken'
import { ObjectId, ObjectID } from 'bson'
import cookie from 'cookie'
import baseUrl from '../../../utils/baseUrl'
import e from 'express'
import axios from 'axios'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const authenticated = fn => async (req, res) => {
    verify(req.cookies.auth, process.env.JWT_SECRET, async function (err, decoded) {
        if (!err && decoded) {
            return await fn(req, res)
        }
        res.status(500).json({ message: 'You are not authenticated.' });
    })
}

export default authenticated(async (req, res) => {
    if (req.method === 'POST') {
        const { company_id, user_id } = req.body;

        if (!company_id || !user_id) {
            return res.status(400).json({ message: "Missing parameters on request body" });
        }

        const { db } = await connect();

        const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) });
        const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) });

        if (!companyExist || !userExist) {
            return res.status(400).json({ message: "Company or user not found" });
        }

        try {
            // Passo 1: Verificar se o customerId já está salvo no banco de dados
            let customer;

            if (companyExist.paymentData && companyExist.paymentData.customerId) {
                try {
                    // Buscar o cliente diretamente usando o customerId salvo
                    customer = await stripe.customers.retrieve(companyExist.paymentData.customerId);
                } catch (err) {
                    if (err.type === 'StripeInvalidRequestError' && err.message.includes('No such customer')) {
                        console.log('Customer ID is invalid or does not exist. Creating a new customer...');
                    } else {
                        throw err; // Outros erros inesperados
                    }
                }
            }

            // Se o cliente não foi encontrado ou o customerId for inválido, crie um novo cliente
            if (!customer) {
                const existingCustomers = await stripe.customers.list({
                    email: companyExist.email ? companyExist.email : userExist.email,
                    limit: 1,
                });

                if (existingCustomers.data.length > 0) {
                    customer = existingCustomers.data[0]; // O cliente já existe
                } else {
                    // Criar um novo cliente se não houver
                    customer = await stripe.customers.create({
                        email: companyExist.email ? companyExist.email : userExist.email,
                        metadata: { company_id: company_id },
                    });
                }

                // Atualizar o banco de dados com o customerId recém-criado
                await db.collection('companies').updateOne(
                    { _id: ObjectId(company_id) },
                    {
                        $set: {
                            'paymentData.customerId': customer.id,
                            'paymentData.email': companyExist.email ? companyExist.email : userExist.email,
                        },
                    }
                );
            }

            // Passo 2: Verificar se o cliente já tem uma assinatura ativa
            const subscriptions = await stripe.subscriptions.list({
                customer: customer.id,
                status: 'active',
                limit: 1,
            });

            if (subscriptions.data.length > 0) {
                return res.status(200).json({
                    message: 'Customer already has an active subscription.',
                    subscription: subscriptions.data[0],
                });
            }

            let priceId = company_id === "6668c78b5d0dfeb36eb9b008" || company_id === "66ec648cff4710f7aca19d1b" || company_id === "66fc999740dd9fbacc21060e" ? "price_1QGAmyAtBT5rPxqpqxLOoTDF" : "price_1QG0jUAtBT5rPxqpQCXP2ahk"

            // Passo 3: Criar a sessão de checkout para uma nova assinatura
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'subscription',
                customer: customer.id,
                line_items: [
                    {
                        price: priceId || "price_1QG0jUAtBT5rPxqpQCXP2ahk", // ID do preço que você já criou
                        // price: "price_1QFpnoAtBT5rPxqpGUp7j2qc", // ID do preço que você já criou
                        quantity: 1,
                    },
                ],
                metadata: { company_id: company_id },
                success_url: `${req.headers.origin}/accountSetup`,
                cancel_url: `${req.headers.origin}/accountSetup`,
                locale: 'pt-BR',
            });

            if (!session.url) {
                return res.status(500).json({ error: 'Error creating Stripe checkout session' });
            }

            await db.collection('companies').updateOne(
                { _id: ObjectId(company_id) },
                {
                    $set: {
                        'paymentData.sessionId': session.id,
                        'paymentData.usersCount': 1,
                    },
                }
            );

            res.status(200).json({ sessionId: session.id });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
});


