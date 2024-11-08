import bcrypt from 'bcrypt'
import { connect } from '../../../utils/db'
import { ObjectId, ObjectID } from 'bson'
import { sign } from 'jsonwebtoken'
import cookie from 'cookie'

export default async (req, res) => {

    if (req.method === 'POST') {

        const { user } = req.body

        if (!user) {
            res.status(400).json({ error: 'Missing body parameters.' });
        } else {

            const { db } = await connect();

            const userExists = await db.collection('users').findOne({ email: user.email });

            if (!userExists) {

                req.status(400).json({ error: 'User not found.' });


            } else {

                const companyExist = await db.collection('companies').findOne({ _id: ObjectId(userExists.company_id) })

                if (!companyExist) {
                    res.status(400).json({ error: 'Company not found.' });
                } else {
                    Date.prototype.addDays = function (days) {
                        var date = new Date(this.valueOf());
                        date.setDate(date.getDate() + days);
                        return date;
                    };

                    let date = new Date();

                    const styles = {
                        primaryColor: '',
                        secundaryColor: '',
                        terciaryColor: '',
                        backgroundImage: '',
                        logo: ''
                    };

                    const notifications = [
                        {
                            _id: ObjectId(),
                            dateAdded: new Date(),
                            subject: 'star',
                            text: "Configure a sua imobiliaria.",
                            link: `https://app.avaliaimobi.com.br/companyEdit`,
                            imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1717456528/AVALIA%20IMOBI/NOTIFICATION_IMG/kwg5mqypafhmbxnt5sv8.png',
                            user_id: '',
                            checked: false
                        },
                        {
                            _id: ObjectId(),
                            dateAdded: new Date(),
                            subject: 'star',
                            text: "Configure o seu perfil.",
                            link: `https://app.avaliaimobi.com.br/editProfile`,
                            imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1717456528/AVALIA%20IMOBI/NOTIFICATION_IMG/vnz7fkp5hvfty4hnahcq.png',
                            user_id: '',
                            checked: false
                        }
                    ];

                    const backgroundImages = [
                        {
                            _id: ObjectId(),
                            imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1696809593/AVALIA%20IMOBI/BACKGROUND_IMAGES/1_rdqugq.png',
                            user_id: ''
                        },
                        {
                            _id: ObjectId(),
                            imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1696809594/AVALIA%20IMOBI/BACKGROUND_IMAGES/bg1_qevnqz.png',
                            user_id: ''
                        },
                        {
                            _id: ObjectId(),
                            imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1696809594/AVALIA%20IMOBI/BACKGROUND_IMAGES/bg2_odug7b.png',
                            user_id: ''
                        },
                        {
                            _id: ObjectId(),
                            imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1696809594/AVALIA%20IMOBI/BACKGROUND_IMAGES/8_fym2vs.png',
                            user_id: ''
                        },
                        {
                            _id: ObjectId(),
                            imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1696809593/AVALIA%20IMOBI/BACKGROUND_IMAGES/bg3_bjwf6x.png',
                            user_id: ''
                        },
                        {
                            _id: ObjectId(),
                            imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1696809593/AVALIA%20IMOBI/BACKGROUND_IMAGES/4_xnjdaa.png',
                            user_id: ''
                        },
                        {
                            _id: ObjectId(),
                            imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1696809593/AVALIA%20IMOBI/BACKGROUND_IMAGES/7_ucmfzk.png',
                            user_id: ''
                        },
                        {
                            _id: ObjectId(),
                            imageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1696809593/AVALIA%20IMOBI/BACKGROUND_IMAGES/5_bxgph5.png',
                            user_id: ''
                        },
                    ];

                    // Insere a nova companhia e armazena o ID inserido
                    const { insertedId: companyId } = await db.collection('companies').insertOne({
                        companyName: '',
                        companyCreci: '',
                        email: '',
                        celular: '',
                        telefone: '',
                        cep: '',
                        logradouro: '',
                        numero: '',
                        cidade: '',
                        estado: '',
                        backgroundImages: backgroundImages,
                        backgroundImg_id: '',
                        logo: '',
                        active: true,
                        dateAdded: new Date(),
                        dateLimit: date.addDays(7),
                        dateUpdate: '',
                        active: true,
                        errorStatus: false,
                        styles: styles,
                        clients: [],
                    });

                    // Insere o novo usuário e armazena o ID inserido
                    const { insertedId: userId } = await db.collection('users').insertOne({
                        firstName: firstName,
                        lastName: lastName,
                        cpf: '',
                        email: email,
                        workEmail: email,
                        creci: '',
                        telefone: '',
                        celular: '',
                        cep: '',
                        logradouro: '',
                        numero: '',
                        cidade: '',
                        estado: '',
                        company_id: companyId.toString(),
                        userStatus: 'admGlobal',
                        profileImageUrl: 'https://res.cloudinary.com/joaoserafinadm/image/upload/v1692760589/PUBLIC/user_template_ocrbrg.png',
                        password: 'google',
                        permissions: false,
                        dateAdd: new Date(),
                        dateUpdated: '',
                        passwordResetToken: '',
                        passwordResetExpires: '',
                        accessCount: 0,
                        active: true,
                        deleted: false,
                        notifications: notifications,
                        history: [],
                        tutorial: true
                    });

                    // Recupera o documento da companhia recém-criada
                    const newCompany = await db.collection('companies').findOne({ _id: companyId });

                    // Recupera o documento do usuário recém-criado
                    const newUser = await db.collection('users').findOne({ _id: userId });

                    if (companyId && userId) {

                        // Constrói os claims com os dados completos
                        const clains = {
                            sub: newUser._id,
                            firstName: newUser.firstName,
                            lastName: newUser.lastName,
                            company_id: newUser.company_id,
                            companyName: newCompany.companyName,
                            profileImageUrl: newUser.profileImageUrl,
                            userStatus: newUser.userStatus,
                            dateLimit: newCompany.dateLimit,
                            headerImg: newCompany.headerImg,
                            logo: newCompany.logo,
                            active: newCompany.active,
                            errorStatus: newCompany.errorStatus,
                            tutorial: true
                        }

                        const jwt = sign(clains, process.env.JWT_SECRET, {})

                        const response = res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
                            httpOnly: false,
                            secure: process.env.NODE_ENV !== 'production', //em produção usar true
                            sameSite: 'strict',
                            path: '/',
                            maxAge: 31536000
                        }))

                        res.status(200).json({ message: "User registered" });
                    }

                }

            }




        }





    }
}