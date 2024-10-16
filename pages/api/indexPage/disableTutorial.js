import { connect } from '../../../utils/db'
import { verify, sign } from 'jsonwebtoken'
import { ObjectId, ObjectID } from 'bson'
import cookie from 'cookie'

const authenticated = fn => async (req, res) => {
    verify(req.cookies.auth, process.env.JWT_SECRET, async function (err, decoded) {
        if (!err && decoded) {
            return await fn(req, res)
        }
        res.status(500).json({ message: 'You are not authenticated.' })
    })
}

export default authenticated(async (req, res) => {

    if (req.method === "POST") {

        console.log('vai')

        const { user_id } = req.body

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required.' })
        } else {

            const { db } = await connect()

            const response = await db.collection('users').updateOne(
                { _id: ObjectId(user_id) },
                { $set: { tutorial: false } }
            )
        }
    }



})