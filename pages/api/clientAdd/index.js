import { connect } from '../../../utils/db'
import bcrypt from 'bcrypt'
import { ObjectId } from 'bson'

export default async function (req, res) {

    if (req.method === "POST") {

        const data = req.body

        if (!data.user_id) {

            res.status(400).json({ error: 'Missing parameters on request body' })
        } else {

            const { db } = await connect()

            const userExist = await db.collection('users').findOne({ _id: ObjectId(data.user_id) })

            if (!userExist) {
                res.status(400).json({ error: 'User does not exist' })
            } else {

                const companyExist = await db.collection('companies').findOne({ _id: ObjectId(userExist?.company_id) })

                if (!companyExist) {
                    res.status(400).json({ error: 'Company does not exist' })
                } else {


                    const {
                        slide,
                        client_id,
                        styles,
                        logo,
                        backgroundImg,
                        companyName,
                        userFirstName,
                        userLastName,
                        profileImageUrl,

                        ...dataFilter
                    } = data

                const newId = ObjectId()


                    const newData = {
                        // ...clientExist,
                        ...dataFilter,
                        _id: newId,
                        active: true,
                        status: 'active',
                        dateAdded: new Date(),
                        dateUpdated: new Date()
                    }


                    const result = await db.collection('companies').updateOne(
                        { _id: ObjectId(companyExist._id) }, {
                        $push: {
                            clients: {
                                $each: [newData],
                                $position: 0
                            }
                        }
                    })


                    if (result.matchedCount > 0) {
                        res.status(200).json({ success: 'Client updated successfully', id:newId })
                    } else {
                        res.status(400).json({ error: 'Error updating client' })
                    }
                }

            }





        }
    } else {

        res.status(400).json({ error: 'Method not allowed' })
    }




}