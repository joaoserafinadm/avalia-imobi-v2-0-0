import { connect } from '../../../utils/db'
import { verify, sign } from 'jsonwebtoken'
import { ObjectId, ObjectID } from 'bson'
import cookie from 'cookie'
import baseUrl from '../../../utils/baseUrl'


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

        const { company_id, user_id } = req.query

        if (!company_id) {
            res.status(400).json({ message: "Missing parameters on request body" })
        } else {

            const { db } = await connect()

            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })

            const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) })

            const usersArray = await db.collection('users').find({ company_id: company_id })
                .project({ firstName: 1, lastName: 1, profileImageUrl: 1 }).toArray()


            if (!companyExist || !userExist) {
                res.status(400).json({ message: "Company or user does not exist" })
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


                const clients = companyExist.clients

                res.status(200).json({ clients, users: usersArray, userData })

            }
        }
    }


    else if (req.method === "DELETE") {

        const { company_id, user_id, clientId } = req.query

        console.log(company_id, user_id, clientId)

        if (!company_id || !user_id || !clientId) {
            res.status(400).json({ message: "Missing parameters on request body" })
        } else {

            const { db } = await connect()

            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })

            if (!companyExist) {
                res.status(400).json({ message: "Company does not exist" })
            } else {

                const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) })

                if (!userExist) {
                    res.status(400).json({ message: "User does not exist" })
                } else {

                    const clientExist = companyExist.clients.find(elem => elem._id.toString() === clientId)

                    if (!clientExist) {
                        res.status(400).json({ message: "Client does not exist" })
                    } else {

                        const response = await db.collection('companies').updateOne(
                            { _id: ObjectId(company_id) },
                            { $pull: { clients: { _id: ObjectId(clientId) } } }
                        )

                        console.log(response)

                        if (response.modifiedCount === 0) {
                            res.status(400).json({ message: "Client does not exist" })
                        } else {
                            res.status(200).json({ message: "Client deleted" })
                        }
                    }
                }


            }
        }



    }



})