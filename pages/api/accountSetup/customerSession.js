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

    if (req.method === "POST") {

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

            const session = await stripe.billingPortal.sessions.create({
                customer: customer.id,
                return_url: `${req.headers.origin}/accountSetup?status=Assinatura`,
                locale: 'pt-BR', // URL para onde o usuário será redirecionado após sair do portal
            });
        
            // Passo 3: Redirecionar o usuário para o portal
            res.status(200).json({ url: session.url });






        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }



})