import bcrypt from 'bcrypt'
import { connect } from '../../../utils/db'
import { ObjectID, ObjectId } from 'bson'
import { sign } from 'jsonwebtoken'
import cookie from 'cookie'

export default async (req, res) => {

    if (req.method === 'PATCH') {

        const { user_id, client_id, stars, comment } = req.body

        if (!user_id || !client_id || !stars) {
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

                if (clientExist?.valuation?.stars === stars && clientExist?.valuation?.valuationComment === comment) {
                    res.status(200).json({ message: "valuation viewed" })

                } else {


                    const result = await db.collection('companies').updateOne(
                        { _id: ObjectId(company_id), "clients._id": ObjectId(client_id) },
                        {

                            $set: {
                                "clients.$.valuation.stars": stars,
                                "clients.$.valuation.valuationComment": comment
                            },


                        })

                    if (result.matchedCount > 0) {

                        res.status(200).json({ message: "valuation updated" })
                    } else {

                        res.status(400).json({ error: 'Error on updating valuation' })
                    }

                }



            }
        }



    }






}