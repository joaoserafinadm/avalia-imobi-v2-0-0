import { connect } from '../../../utils/db'
import { verify, sign } from 'jsonwebtoken'
import { ObjectId, ObjectID } from 'bson'
import cookie from 'cookie'
import baseUrl from '../../../utils/baseUrl'
import bcrypt from 'bcrypt'
import randomPassword from '../../../utils/randomPassword'
import { Resend } from 'resend';
import { newUserEmail } from '../../../src/emails/newUserEmail';


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

    if (req.method === "GET") {

        const { company_id, user_id, client_id } = req.query

        if (!company_id || !user_id || !client_id) {
            res.status(400).json({ message: "Missing parameters on request body" })
        } else {

            const { db } = await connect()

            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })
            const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) })
            const clientExist = companyExist.clients.find(elem => elem._id.toString() === client_id)



            if (!companyExist || !userExist || !clientExist) {
                res.status(400).json({ message: "Company or user or client does not exist" })
            } else {

                const userData = {
                    firstName: userExist?.firstName,
                    lastName: userExist?.lastName,
                    workEmail: userExist?.workEmail,
                    creci: userExist?.creci,
                    telefone: userExist?.telefone,
                    celular: userExist?.celular,
                    profileImageUrl: userExist?.profileImageUrl,
                    companyName: companyExist?.companyName,
                    logo: companyExist?.logo,
                    backgroundImageUrl: companyExist?.backgroundImages.find(elem => elem._id.toString() === companyExist.backgroundImg_id)?.imageUrl,
                }

                res.status(200).json({ client: clientExist, userData })
            }
        }




    } else if (req.method === "POST") {

        const { company_id, user_id, client_id, propertyArray, calcVariables, valuationCalc } = req.body



        if (!company_id || !user_id || !client_id || !propertyArray?.length || !calcVariables || !valuationCalc) {

            res.status(400).json({ message: "Missing parameters on request body" })


        } else {


            const { db } = await connect()


            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })

            const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) })


            if (!companyExist || !userExist) {

                res.status(400).json({ message: "Company or user does not exist" })

            } else {

                const clientExist = companyExist.clients.find(elem => elem._id.toString() === client_id)

                if (!clientExist) {

                    res.status(400).json({ message: "Client does not exist" })

                } else {

                    const urlToken = `${baseUrl()}/valuation/params?clientId=${client_id}`


                    const data = {
                        user_id,
                        dateAdded: new Date(),
                        dateUpdated: new Date(),
                        status: "pending",
                        propertyArray,
                        calcVariables,
                        valuationCalc,
                        urlToken
                    }


                    const result = await db.collection('companies').findOneAndUpdate(
                        { _id: ObjectId(company_id), "clients._id": ObjectId(client_id) },
                        {
                            $set: {
                                "clients.$.valuation": data,
                                "clients.$.status": "evaluated"
                            }
                        },
                        { returnDocument: 'after' } // Retorna o documento atualizado
                    );

                    console.log(result.value)

                    const userData = {
                        firstName: userExist?.firstName,
                        lastName: userExist?.lastName,
                        workEmail: userExist?.workEmail,
                        creci: userExist?.creci,
                        telefone: userExist?.telefone,
                        celular: userExist?.celular,
                        profileImageUrl: userExist?.profileImageUrl,
                        companyName: companyExist?.companyName,
                        logo: companyExist?.logo,
                        backgroundImageUrl: companyExist?.backgroundImages.find(elem => elem._id.toString() === companyExist.backgroundImg_id)?.imageUrl,
                    }


                    if (result) {
                        res.status(200).json({ urlToken, userData, client: clientExist })
                    } else {
                        res.status(400).json({ message: "Valuation not created" })
                    }
                }


            }
        }


    }




})