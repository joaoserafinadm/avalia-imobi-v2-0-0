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
    // export default async function (req, res) {


    if (req.method === 'GET') {

        const { company_id, user_id } = req.query


        if (!user_id) {
            res.status(400).json({ error: 'Missing parameters on request body.' })
        } else {

            const { db } = await connect()

            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })

            const response = await db.collection('users').findOne({ _id: ObjectId(user_id) })

            const headerImg = companyExist.backgroundImages?.find(elem => elem._id.toString() === companyExist.backgroundImg_id)?.imageUrl

            const data = {
                ...response,
                headerImg: headerImg,
                logo: companyExist.logo,
                telefone: response.telefone ? response.telefone : companyExist.telefone,
                logradouro: companyExist.logradouro,
                numero: companyExist.numero,
                cidade: companyExist.cidade,
                estado: companyExist.estado,
            }

            if (!response) {
                res.status(400).json({ error: 'User do not exists.' })
            } else {
                res.status(200).json(data)
            }
        }
    }

    // else if (req.method === "POST") {


    //     const { company_id,
    //         user_id,
    //         profileImageUrl,
    //         firstName,
    //         lastName,
    //         workEmail,
    //         creci,
    //         telefone,
    //         celular } = req.body

    //     if (!company_id || !user_id || !profileImageUrl || !firstName || !lastName || !workEmail || !creci || !celular || !telefone) {

    //         res.status(400).json({ error: 'Missing parameters on request body.' })
    //     }
    //     else {

    //         const { db } = await connect()


    //     }
    // }

    else if (req.method === 'PATCH') {

        const updateObject = req.body

        const { db } = await connect()

        await db.collection('users').updateOne(
            { _id: ObjectId(updateObject.user_id) },
            {
                $set: updateObject
            })

            const token = updateObject.token

        const clains = {
            ...token,
            profileImageUrl: updateObject.profileImageUrl
        }

        const jwt = sign(clains, process.env.JWT_SECRET, {})

        const response2 = res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
            httpOnly: false,
            secure: process.env.NODE_ENV !== "production", //em produção usar true
            sameSite: 'strict',
            // maxAge: 3600,
            path: '/'
        }))
        res.status(200).json({ message: 'Profile Updated.' })

    }

    else {
        res.status(400).json({ error: 'Wrong request method.' })
    }

})