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

    if (req.method === "GET") {

        const { user_id, company_id } = req.query

        if (!user_id || !company_id) {
            res.status(400).json({ message: "Missing parameters on request body" })
        } else {

            const { db } = await connect()


            const companyExist = await db.collection('companies').findOne(
                { _id: ObjectId(company_id) },
                {
                    projection: {
                        companyName: 1,
                        cep: 1,
                        logradouro: 1,
                        numero: 1,
                        cidade: 1,
                        estado: 1,
                        email: 1,
                        celular: 1,
                        telefone: 1,
                        companyCreci: 1,
                        paymentData: 1
                    }
                }
            )

            let paymentHistoryResponse
            let customer;

            if (companyExist?.paymentData) {
                // paymentHistoryResponse = await fetch(`https://api.mercadopago.com/preapproval/search?q=${companyExist?.paymentData?.subscription_id}`, {
                //     method: 'GET',
                //     headers: {
                //         'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                //         'Content-Type': 'application/json'
                //     }
                // });


                const existingCustomer = await stripe.customers.retrieve(companyExist?.paymentData?.customerId);
                customer = existingCustomer?.data[0];
            }

            const subscriptionData = customer || '';

            res.status(200).json(subscriptionData)

            const history = subscriptionData?.results?.map(elem => {
                return {
                    date: elem.date_created,
                    status: elem.status,
                    summarized: elem.summarized
                }
            })

            if (!companyExist.paymentData?.subscriptionId) {

                const companyUpdate = await db.collection('companies').updateOne(
                    { _id: ObjectId(company_id) },
                    {
                        $set: {
                            "paymentData.subscriptionId": subscriptionData.subscription
                            // "paymentData.subscriptionValue": subscriptionData.value
                        }
                    })
            }


            const userExist = await db.collection('users').findOne(
                { _id: ObjectId(user_id) },
                {
                    projection: {
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        workEmail: 1,
                        celular: 1,
                        telefone: 1,
                        userStatus: 1,
                        creci: 1
                    }
                }
            )

            //            const paymentMethodResponse = await axios.get('https://api.mercadopago.com/v1/payment_methods/search', {
            //              headers: {
            //                'Content-Type': 'application/json', // Inclua o content-type se necessário
            //              Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`, // Substitua por sua variável de ambiente ou token direto
            //        }
            //  });

            // const paymentMethods = paymentMethodResponse.data.results

            if (!companyExist || !userExist) {
                res.status(400).json({ message: "Company or user does not exist" })
            } else {

                res.status(200).json({ company: companyExist, user: userExist, paymentHistory: [], paymentMethods: [] })



            }

        }
    }


})
