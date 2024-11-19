import bcrypt from 'bcrypt'
import { connect } from '../../../utils/db'
import { ObjectID, ObjectId } from 'bson'
import { sign } from 'jsonwebtoken'
import cookie from 'cookie'
import axios from 'axios'
import baseUrl from '../../../utils/baseUrl'

export default async (req, res) => {

    if (req.method === 'GET') {

        const { user_id, client_id } = req.query


        if (!user_id || !client_id) {
            res.status(400).json({ error: 'Missing parameters on request body.' })
        } else {

            const { db } = await connect()
            const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) })

            const company_id = userExist?.company_id

            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })

            const clientExist = companyExist?.clients?.find(elem => elem._id.toString() === client_id)


            if (!userExist || !companyExist || !clientExist) {

                res.status(400).json({ error: 'User or company or client does not exist' })

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
                    backgroundImageUrl: companyExist.backgroundImages.find(elem => elem._id.toString() === companyExist.backgroundImg_id)?.imageUrl,
                }

                res.status(200).json({ client: clientExist, user: userData })

            }
        }

    } else if (req.method === "POST") {

        const { user_id, client_id, valueSelected, customValue, valueComment } = req.body

        if (!user_id || !client_id || !valueSelected) {

            res.status(400).json({ error: 'Missing parameters on request body.' })

        } else {

            const { db } = await connect()

            const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) })

            const company_id = userExist?.company_id

            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })

            const clientExist = companyExist?.clients?.find(elem => elem._id.toString() === client_id)

            if (!userExist || !companyExist || !clientExist) {

                res.status(400).json({ error: 'User or company or client does not exist' })

            } else {
                console.log("clientExist?.valuation", clientExist?.valuation)

                console.log("clientExist?.valuation?.valueSelected", clientExist?.valuation?.valueSelected, valueSelected)
                console.log("clientExist?.valuation?.valueComment", clientExist?.valuation?.valueComment, valueComment)
                console.log("clientExist?.valuation?.valuationCalc?.customValue", clientExist?.valuation?.valuationCalc?.customValue, customValue)

                if (valueSelected === clientExist?.valuation?.valueSelected &&
                    valueComment === clientExist?.valuation?.valueComment &&
                    (customValue === clientExist?.valuation?.valuationCalc?.customValue || !customValue )
                ) {
                    res.status(200).json({ message: "valuation viewed" })
                } else {


                    const valuationCalc = {
                        ...clientExist?.valuation?.valuationCalc,
                        customValue: valueSelected === "customValue" ? customValue : ''
                    }

                    const result = await db.collection('companies').updateOne(
                        { _id: ObjectId(company_id), "clients._id": ObjectId(client_id) },
                        {

                            $set: {
                                "clients.$.valuation.valueSelected": valueSelected,
                                "clients.$.valuation.valueComment": valueComment,
                                "clients.$.valuation.valuationCalc": valuationCalc,
                                "clients.$.status": 'answered',
                                "clients.$.valuation.status": 'answered'
                            },


                        })

                    if (result.matchedCount > 0) {

                        let notification

                        if (clientExist?.valuation?.valueSelected) {
                            notification = {
                                user_id: userExist._id,
                                subject: "clientUpdated",
                                title: 'Avaliação respondida!',
                                text: `A avaliação de '${clientExist.clientName}' foi atualizada! Clique aqui para visualizá-la`,
                                imageUrl: "https://res.cloudinary.com/joaoserafinadm/image/upload/v1718336973/AVALIA%20IMOBI/NOTIFICATION_IMG/jtfhhsqrgg5xar3nnhvh.png",
                                link: "https://app.avaliaimobi.com.br/clientsManagement?client_id=" + client_id,
                            }
                        } else {
                            notification = {
                                user_id: userExist._id,
                                subject: "clientUpdated",
                                title: 'Avaliação respondida!',
                                text: `A avaliação de '${clientExist.clientName}' foi respondida! Clique aqui para visualizá-la`,
                                imageUrl: "https://res.cloudinary.com/joaoserafinadm/image/upload/v1718336973/AVALIA%20IMOBI/NOTIFICATION_IMG/jtfhhsqrgg5xar3nnhvh.png",
                                link: "https://app.avaliaimobi.com.br/clientsManagement?client_id=" + client_id,
                            }
                        }

                        await axios.post(`${baseUrl()}/api/notifications`, {
                            user_id: userExist._id,
                            notification: notification
                        })


                        res.status(200).json({ message: "valuation updated" })

                    } else {

                        res.status(400).json({ error: 'Error on updating valuation' })
                    }

                }



            }
        }



    }




}