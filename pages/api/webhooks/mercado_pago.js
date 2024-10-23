

export default async (req, res) => {


    console.log(req.body)


    res.status(200).json(req.body)




}