import { connect } from '../../../utils/db'
import { verify, sign } from 'jsonwebtoken'
import { ObjectId, ObjectID } from 'bson'
import cookie from 'cookie'
import baseUrl from '../../../utils/baseUrl'
import bcrypt from 'bcrypt'
import randomPassword from '../../../utils/randomPassword'
import { Resend } from 'resend';
import { newUserEmail } from '../../../src/emails/newUserEmail';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);


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

        const { company_id, user_id, firstName, lastName, email, userStatus } = req.body

        if (!company_id || !user_id || !firstName || !email || !userStatus) {
            res.status(400).json({ message: "Missing parameters on request body" })
        } else {

            const { db } = await connect()

            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })
            const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) })
            const newUserExist = await db.collection('users').findOne({ email })

            if (!companyExist || !userExist) {

                res.status(400).json({ error: "Company or user does not exist" })

            } else {


                if (newUserExist) {
                    res.status(400).json({ error: "User already exists" })
                } else {

                    const subscriptionId = companyExist.paymentData?.subscriptionId
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    const existingProductId = subscription.items.data[0].price.product; // Obtém o ID do produto

                    console.log("subscription.items.data[0].price", subscription.items.data[0].price)

                    try {
                        // Recuperar a assinatura existente
                        const usersCount = +companyExist.paymentData?.usersCount + 1 || 1;
                        const valuePerUser = +usersCount <= 5 ? 19.90 : 14.90;
                        const newValue = (valuePerUser * (usersCount - 1) + 79.90).toFixed(2);


                        // Atualize a quantidade de usuários na assinatura
                        const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
                            items: [
                                {
                                    id: subscription.items.data[0].id, // ID do item de assinatura
                                    quantity: usersCount, // totalUsers representa o número total de usuários (incluindo adicionais)
                                },
                            ],
                        });

                        console.log("updatedSubscription", updatedSubscription);
                        // res.status(200).json({ message: "Subscription updated successfully" });

                        // console.log("updatedSubscription", updatedSubscription);
                        // res.status(200).json({ message: "Subscription updated successfully" });

                        if (updatedSubscription) {
                            const password = randomPassword()

                            const saltPassword = await bcrypt.genSalt(10)
                            const securePassword = await bcrypt.hash(password, saltPassword)

                            const notifications = [
                                {
                                    _id: ObjectId(),
                                    dateAdded: new Date(),
                                    subject: 'star',
                                    text: "Bem vindo ao Avalia Imobi! Clique aqui para fazer um tour pela plataforma!",
                                    link: `https://app.avaliaimobi.com.br/companyEdit`,
                                    imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1693963692/PUBLIC/TEMPLATE_IMG_shcaor.png',
                                    user_id: '',
                                    checked: false
                                },
                                {
                                    _id: ObjectId(),
                                    dateAdded: new Date(),
                                    subject: 'star',
                                    text: "Configure o seu perfil.",
                                    link: `https://app.avaliaimobi.com.br/editProfile`,
                                    imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1695601556/PUBLIC/2_fbxre3.png',
                                    user_id: '',
                                    checked: false
                                }
                            ]

                            const newUser = await db.collection('users').insertOne({
                                firstName: firstName,
                                lastName: lastName,
                                cpf: '',
                                email: email,
                                workEmail: email,
                                creci: '',
                                telefone: '',
                                celular: '',
                                cep: '',
                                logradouro: '',
                                numero: '',
                                cidade: '',
                                estado: '',
                                company_id: company_id,
                                userStatus: userStatus,
                                profileImageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1692760589/PUBLIC/user_template_ocrbrg.png',
                                password: securePassword,
                                // permissions: false,
                                dateAdd: new Date(),
                                dateLimit: false,
                                dateUpdated: '',
                                passwordResetToken: '',
                                passwordResetExpires: '',
                                accessCount: 0,
                                active: true,
                                deleted: false,
                                notifications: notifications,
                                history: []
                            })


                            if (newUser.insertedId) {

                                const data = await resend.emails.send({
                                    from: 'Bem vindo ao Avalia Imobi! 🎉 <notificacao@avaliaimobi.com.br>',
                                    to: [email],
                                    subject: 'Avalia Imobi',
                                    react: newUserEmail({ firstName: firstName, email: email, password: password }),
                                });

                                const companyUpdate = await db.collection('companies').updateOne({ _id: ObjectId(company_id) }, {
                                    $set: {
                                        "paymentData.usersCount": usersCount
                                    }
                                })

                                res.status(200).json({ message: "User registered" })

                            } else {
                                res.status(400).json({ error: "Trouble in connect to database" })

                            }
                        }

                    } catch (error) {
                        console.error("Error updating subscription:", error);
                        res.status(500).json({ error: "Failed to update subscription" });
                    }











                }
            }
        }


    } else if (req.method === "GET") {

        const { company_id } = req.query

        if (!company_id) {
            res.status(400).json({ error: 'Missing parameters on request body' })
        } else {

            const { db } = await connect()

            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })
            const usersArrayCount = await db.collection('users').find({ company_id: company_id }).toArray()

            console.log("usersArrayCount", usersArrayCount, companyExist.paymentData)
            if (!companyExist) {

                res.status(400).json({ error: 'Company does not exist' })

            } else {

                const data = {
                    subscriptionValue: companyExist.paymentData?.subscriptionValue,
                    usersCount: usersArrayCount.length,
                }


                res.status(200).json({ data })

            }
        }
    } else {

        res.status(400).json({ error: 'Wrong request method' })

    }



})