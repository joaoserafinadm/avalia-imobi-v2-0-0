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


    if (req.method === 'GET') {

        const { company_id, user_id } = req.query

        if (!company_id) {
            res.status(400).json({ error: 'Missing parameters on request body.' })
        } else {
            const { db } = await connect()

            const companyExist = await db.collection('companies').findOne({ _id: ObjectId(company_id) })

            const userExist = await db.collection('users').findOne({ _id: ObjectId(user_id) })

            if (!companyExist || !userExist) {
                res.status(400).json({ error: 'Company or user does not exist' })
            } else {

                const userCaptures = companyExist.clients.reduce((acc, client) => {
                    const userId = client.user_id;
                    if (!acc[userId]) {
                        acc[userId] = 0;
                    }
                    acc[userId]++;
                    return acc;
                }, {});

                const userValuation = companyExist.clients.reduce((acc, client) => {
                    const userId = client.valuation?.user_id ? client.valuation?.user_id : '';
                    if (!userId) return acc
                    if (!acc[userId]) {
                        acc[userId] = 0;
                    }
                    acc[userId]++;
                    return acc;
                }, {})

                const clients = companyExist.clients.length ? companyExist.clients : []

                // 2. Converter o objeto em um array de pares [user_id, count]
                const userCaptureArray = Object.entries(userCaptures);

                const userValuationArray = Object.entries(userValuation);

                // 3. Ordenar o array de pares com base na contagem de imóveis (count) em ordem decrescente
                userCaptureArray.sort((a, b) => b[1] - a[1]);

                userValuationArray.sort((a, b) => b[1] - a[1]);

                // 4. Transformar o array ordenado em um array de objetos para melhor visualização
                const rankedUser = userCaptureArray.map(([user_id, count]) => ({ user_id, count }))[0]

                const rankedUserValuation = userValuationArray.map(([user_id, count]) => ({ user_id, count }))[0]

                const rankedUserClients = clients.filter(elem => elem.user_id === rankedUser?.user_id)

                const rankedUserValuationClients = clients.filter(elem => elem?.valuation?.user_id === rankedUserValuation?.user_id)

                let rankedUserResults = {
                    clientsLength: rankedUserClients?.length,
                    clientsRating: rankedUserClients.filter(elem => elem?.valuation?.stars).reduce((a, b) => a + b.valuation?.stars, 0) / rankedUserValuationClients.filter(elem => elem?.valuation?.stars).length || 0
                }

                let rankedUserValuationResults = {
                    clientsValuations: rankedUserValuationClients?.length,
                    averageTicket: handleAverageTicket(rankedUserValuationClients)
                }


                const usersArray = await db.collection('users').find({ company_id: company_id })
                    .project({ firstName: 1, lastName: 1, profileImageUrl: 1 }).toArray()


                const rankedUserFind = usersArray.find(elem => elem._id.toString() === rankedUser?.user_id)

                const rankedUserValuationFind = usersArray.find(elem => elem._id.toString() === rankedUserValuation?.user_id)


                rankedUserResults = {
                    ...rankedUserResults,
                    firstName: rankedUserFind?.firstName,
                    lastName: rankedUserFind?.lastName,
                    profileImageUrl: rankedUserFind?.profileImageUrl
                }



                rankedUserValuationResults = {
                    ...rankedUserValuationResults,
                    firstName: rankedUserValuationFind?.firstName,
                    lastName: rankedUserValuationFind?.lastName,
                    profileImageUrl: rankedUserValuationFind?.profileImageUrl
                }












                const myClients = clients.filter(elem => elem.user_id === user_id)

                const myValuations = clients.filter(elem => elem?.valuation?.user_id === user_id)





                const clientsArray = clients.slice(0, 5)



                // const bestPickup = handleBestPickup(clients)





                const userResults = {
                    clientsLength: myClients.length,
                    clientsValuations: myValuations.length,
                    clientsRating: (myClients.filter(elem => elem?.valuation?.stars).reduce((a, b) => a + b.valuation?.stars, 0) / clientsArray.filter(elem => elem?.valuation?.stars).length) || 0,
                    averageTicket: handleAverageTicket(myValuations)
                    // averageTicket: myValuations.filter(elem => elem?.valuation?.valueSelected).reduce((a, b) => a + (+b.valuation?.valueSelected.replace('.', '') || 0), 0) / myValuations.filter(elem => elem?.valuation?.valueSelected).length || 0
                }


                const companyData = {
                    companyName: companyExist.companyName,
                    logo: companyExist.logo,
                    usersArray: usersArray
                }

                const firstNotifications = {
                    companyEdit: !companyExist?.companyName || !companyExist?.logo || !companyExist?.backgroundImg_id,
                    profileEdit: !userExist?.firstName || !userExist?.lastName || !userExist?.profileImageUrl || !userExist?.celular,
                    dateLimit: companyExist?.dateLimit,
                    tutorial: userExist?.tutorial
                }


                res.status(200).json({ userResults, clientsArray, rankedUserResults, rankedUserValuationResults, companyData, firstNotifications })

            }
        }




    }






})


const handleAverageTicket = (valuation) => {

    let result = 0

    const valuationsAnswered = valuation.filter(elem => elem?.valuation?.valueSelected)

    if (valuationsAnswered.length === 0) return result
    else {

        const totalValue = valuationsAnswered.reduce((a, b) => {

            let value = +(b.valuation?.valuationCalc[b.valuation.valueSelected]?.replaceAll('.', ''))

            return a + value

        }, 0)


        result = totalValue / valuationsAnswered.length


        return result

    }




}
