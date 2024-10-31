import { set } from "lodash"
import { useEffect, useState } from "react"
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken';
import axios from "axios";



export default function ChargeAdressModal(props) {

    const token = jwt.decode(Cookie.get('auth'))


    const { companyData } = props

    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')

    useEffect(() => {

        setEmail(companyData?.paymentData?.email)
        setAddress(companyData?.paymentData?.adress)

    }, [companyData])


    const handleSave = async () => {


        const data = {
            company_id: token.company_id,
            user_id: token.sub,
            email: email,
            address: address
        }

        await axios.patch(`/api/accountSetup/adressChange`, data)
            .then(res => {
                props.dataFunction()
            })
            .catch(e => {
                console.log(e)
            })




    }


    return (
        <div className="modal fade" id="chargeAdressModal" tabIndex="-1" aria-labelledby="Modal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title title-dark bold">Endereço de cobrança</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-12">
                                <label className="small fw-bold">E-mail de cobrança</label>
                                <input disabled
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="col-12 mt-3">
                                <label className="small fw-bold" htmlFor="adress">Endereço de cobrança</label>
                                <textarea rows={3}
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button
                            type="button"
                            className="btn btn-sm btn-orange"
                            data-bs-dismiss="modal"
                            onClick={handleSave}
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )


}