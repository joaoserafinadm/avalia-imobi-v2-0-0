import { connect } from '../../../utils/db'
import { verify, sign } from 'jsonwebtoken'
import { ObjectId } from 'bson'
import cookie from 'cookie'

const authenticated = fn => async (req, res) => {
    verify(req.cookies.auth, process.env.JWT_SECRET, async function (err, decoded) {
        if (!err && decoded) {
            return await fn(req, res)
        }
        res.status(401).json({ message: 'You are not authenticated.' })
    })
}

export default authenticated(async (req, res) => {
    if (req.method === 'GET') {
        const { user_id, company_id } = req.query

        if (!user_id || !company_id) {
            return res.status(400).json({ error: 'Missing parameters on request body' })
        }

        // Validate ObjectId
        if (!ObjectId.isValid(user_id) || !ObjectId.isValid(company_id)) {
            return res.status(400).json({ error: 'Invalid ObjectId format.' })
        }

        const { db } = await connect()

        const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })
        const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) })

        if (!userExist || !companyExist) {
            return res.status(400).json({ error: 'User or company does not exist.' })
        }

        let { active, errorStatus, dateLimit } = companyExist

        const dateLimitValid = dateLimitValidate(dateLimit)

        console.log("dateLimitValid", dateLimitValid)

        if (active && !errorStatus && !dateLimitValid) {
            await db.collection('companies').updateOne(
                { "_id": ObjectId(companyExist._id) },
                {
                    $set: {
                        "active": false,
                        "errorStatus": 1,
                        "dateLimit": false
                    }
                }
            )
            dateLimit = false
            active = false
            errorStatus = 1
        }

        const clains = {
            sub: userExist._id,
            firstName: userExist.firstName,
            lastName: userExist.lastName,
            company_id: userExist.company_id,
            companyName: companyExist.companyName,
            profileImageUrl: userExist.profileImageUrl,
            userStatus: userExist.userStatus,
            dateLimit: dateLimit,
            headerImg: companyExist.headerImg,
            logo: companyExist.logo,
            active: active,
            errorStatus: errorStatus
        }

        const jwt = sign(clains, process.env.JWT_SECRET, {})

        const response = res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
            httpOnly: false,
            secure: process.env.NODE_ENV !== 'production', //em produção usar true
            sameSite: 'strict',
            path: '/',
            maxAge: 31536000
        }))


        return res.status(200).json({ active, errorStatus })
    }
})

const dateLimitValidate = (dateLimit) => {
    if (!dateLimit) return true

    const dateObj = new Date(dateLimit)
    if (isNaN(dateObj)) {
        throw new Error("Invalid date")
    }

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0) // Remove time part

    console.log("dateLimit", dateObj, currentDate)

    return dateObj >= currentDate
}
