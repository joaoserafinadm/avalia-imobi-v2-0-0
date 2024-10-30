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
        const { company_id, user_id } = req.body; // O ID e o email do usuário da sua aplicação

        if (!company_id || !user_id) {
            res.status(400).json({ message: "Missing parameters on request body" })
        } else {

            const { db } = await connect()


            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })
            const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) })

            if (!companyExist || !userExist) {
                res.status(400).json({ message: "Company or user not found" })
            } else {

                try {
                    // Passo 1: Verifique se o cliente já existe no Stripe, caso contrário, crie um novo cliente
                    let customer;

                    const existingCustomers = await stripe.customers.list({
                        email: companyExist.email ? companyExist.email : userExist.email,
                        limit: 1,
                    });

                    if (existingCustomers.data.length > 0) {
                        customer = existingCustomers.data[0]; // O cliente já existe
                        res.status(200).json({ customer });
                    } else {
                        customer = await stripe.customers.create({
                            email: companyExist.email ? companyExist.email : userExist.email,
                            metadata: {
                                company_id: company_id, // Salva o _id do usuário no metadata do cliente no Stripe
                            },
                        });
                    }

                    // Passo 2: Crie a sessão de checkout vinculada ao cliente
                    const session = await stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        mode: 'subscription',
                        customer: customer.id, // Vincula a sessão ao cliente do Stripe
                        line_items: [
                            {
                                price_data: {
                                    currency: 'brl',
                                    product_data: {
                                        name: 'Assinatura Avalia Imobi',
                                    },
                                    unit_amount: 7990, // O valor em centavos (R$79,90)
                                    recurring: {
                                        interval: 'month',
                                    },
                                },
                                quantity: 1,
                            },
                        ],
                        success_url: `${req.headers.origin}/accountSetup`,
                        cancel_url: `${req.headers.origin}/accountSetup`,
                        locale: 'pt-BR', // Define o idioma para português
                    });

                    console.log("session", session)

                    if (!session.url) {
                        res.status(500).json({ error: 'Error creating Stripe checkout session' });
                    } else {

                        const response = await db.collection('companies').updateOne(
                            { _id: ObjectId(company_id) },
                            {
                                $set: {
                                    paymentData: {
                                        customerId: customer.id,
                                        // subscriptionId: session.subscription,
                                        sessionId: session.id
                                    }
                                }
                            }
                        )
                    }



                    // Passo 3: Salve no banco de dados o customerId e o company_id associados ao cliente e assinatura
                    // Exemplo: await saveToDatabase({ company_id, customerId: customer.id });

                    res.status(200).json({ sessionId: session.id });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }


            }
        }



    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }



})