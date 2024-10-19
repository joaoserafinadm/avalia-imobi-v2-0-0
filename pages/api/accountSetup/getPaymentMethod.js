import { connect } from '../../../utils/db'
import { verify, sign } from 'jsonwebtoken'
import { ObjectId, ObjectID } from 'bson'
import cookie from 'cookie'
import baseUrl from '../../../utils/baseUrl'
import e from 'express'
import axios from 'axios'


const authenticated = fn => async (req, res) => {
    verify(req.cookies.auth, process.env.JWT_SECRET, async function (err, decoded) {
        if (!err && decoded) {
            return await fn(req, res)
        }
        res.status(500).json({ message: 'You are not authenticated.' });
    })
}

export default authenticated(async (req, res) => {

    const { cardNumberCleaned } = req.query

    console.log('cardNumberCleaned:', cardNumberCleaned);

    const bin = cardNumberCleaned.substring(0, 6);

    const paymentMethodResponse = await axios.get('https://api.mercadopago.com/v1/payment_methods/search', {
        headers: {
            'Content-Type': 'application/json', // Inclua o content-type se necessário
            Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`, // Substitua por sua variável de ambiente ou token direto
        }
    });



    // const paymentMethodResponse = await axios.get(`https://api.mercadopago.com/v1/payment_methods/search`, {
    //     params: { bin },
    //     headers: {
    //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN}`
    //     }
    // });
    const paymentMethods = paymentMethodResponse.data.results;

    // console.log('paymentMethods:', paymentMethods);


    const matchingPaymentMethod = paymentMethods.find(method =>
        method.id === 'master'
    );

    // console.log('matchingPaymentMethod:', matchingPaymentMethod.bins);

    // const paymentMethodId = paymentMethod.find((method) => method.bins?.find((elem) => elem === bin));
    // console.log('paymentMethodId:', paymentMethodResponse.data);

    res.status(200).json('master');



})