import bcrypt from 'bcrypt'
import { connect } from '../../../utils/db'
import { Code } from 'bson'
import randomPassword from '../../../utils/randomPassword'
import { Resend } from 'resend';
import { AuthEmail } from '../../../src/emails/AuthEmail';


const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req, res) => {


    if (req.method === "POST") {

        const { email, firstName } = req.body

        console.log( email, firstName)

        if (!email || !firstName) {

            res.status(400).json({ error: "Missing parameters on request body" })
        } else {

            const { db } = await connect()

            const emailExists = await db.collection('users').findOne({ email })

            if (emailExists) {

                res.status(400).json({ error: "User already exists" })
            } else {

                const code = randomPassword(5)

                const saltCode = await bcrypt.genSalt(10)
                const secureCode = await bcrypt.hash(code, saltCode)

                const data = await resend.emails.send({
                    from: 'Avalia Imobi <autenticacao@avaliaimobi.com.br>',
                    to: [email],
                    subject: 'Autenticação',
                    react: AuthEmail({ firstName: firstName, code }),
                });

                res.status(200).json({ secureCode })


            }

        }


    } else {
        res.status(400).json({ error: 'Wrong request method' })
    }








    // const body = JSON.parse(req.body);

    // const { db } = await connect()

    // const userEmail = body.email
    // const emailExists = await db.collection('users').findOne({ userEmail })

    // if (emailExists) {
    //     res.status(400).json({ message: 'E-mail já cadastrado.' })
    // } else {
    //     const randomPassword = len => {
    //         let passwd = ''
    //         do {
    //             passwd += Math.random().toString(36).substr(2)
    //         } while (passwd.length < len)
    //         passwd = passwd.substr(0, len)
    //         return passwd.toUpperCase()
    //     }
    //     const code = randomPassword(5)

    //     const saltCode = await bcrypt.genSalt(10)
    //     const secureCode = await bcrypt.hash(code, saltCode)

    //     // console.log(code)

    //     const data = {
    //         to: body.email,
    //         from: {
    //             email: 'notification@akvo-esg.com.br',
    //             name: 'AKVO ESG'
    //         },
    //         templateId: 'd-ce2eb6a29c094b8b954818b4a08da898',
    //         dynamic_template_data: {
    //             firstName: body.firstName,
    //             code: code
    //         }
    //     }

    //     // console.log(code)


    //     await mail.send(data)

    //     res.status(200).json({ code: secureCode })

    // }

}