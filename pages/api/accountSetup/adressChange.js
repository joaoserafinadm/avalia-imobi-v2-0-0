import { connect } from '../../../utils/db'
import { verify, sign } from 'jsonwebtoken'
import { ObjectId, ObjectID } from 'bson'
import cookie from 'cookie'
import baseUrl from '../../../utils/baseUrl'
import e from 'express'


const authenticated = fn => async (req, res) => {
    verify(req.cookies.auth, process.env.JWT_SECRET, async function (err, decoded) {
        if (!err && decoded) {
            return await fn(req, res)
        }
        res.status(500).json({ message: 'You are not authenticated.' });
    })
}

export default authenticated(async (req, res) => {


    if (req.method === "PATCH") {

        const { company_id, user_id, email, address } = req.body

        if (!company_id || !user_id || !email) {
            res.status(400).json({ error: "Missing parameters on request body" })

        } else {

            const { db } = await connect()

            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })

            const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) })

            if (!companyExist || !userExist) {
                res.status(400).json({ error: "Company or user does not exist" })
            } else {


                const response = await db.collection('companies').updateOne(
                    { _id: ObjectId(company_id) },
                    {
                        $set: {
                            "paymentData.email": email, "paymentData.address": address
                        }
                    }

                )

                if (response.modifiedCount) {
                    res.status(200).json({ message: "Adress changed" })
                } else {
                    res.status(400).json({ error: "Adress not changed" })
                }


            }
        }





    }






})