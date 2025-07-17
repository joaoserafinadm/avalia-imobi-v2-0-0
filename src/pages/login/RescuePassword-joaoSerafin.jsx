import { faLeftLong } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AiOutlineLeft } from "@react-icons/all-files/ai/AiOutlineLeft";
import { useState } from "react";
import { SpinnerSM } from "../../components/loading/Spinners";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";





export default function RescuePassword(props) {

    const [email, setEmail] = useState('')

    const [emailError, setEmailError] = useState('')
    const [emailSuccess, setEmailSuccess] = useState('')

    const [loadingSend, setLoadingSend] = useState(false)

    const handleSendToken = async (email) => {

        setLoadingSend(true)

        if (!email) {
            setLoadingSend(false)
            setEmailError("Insira um e-mail válido")
        } else {

            await axios.post(`${baseUrl()}/api/recoverPassword`, { email })
                .then(res => {
                    setLoadingSend(false)
                    setEmailSuccess("Verifique seu e-mail!")
                    setEmailError('')
                }).catch(e => {
                    setLoadingSend(false)
                    setEmailSuccess('')
                    setEmailError(e.response.data.error)
                })
        }


    }





    return (
        <div className="row fadeItem" style={{ height: '100%' }}>
            <div className="d-flex justify-content-center align-items-center">

                <div className="card p-2">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <h5 className="title-primary">Recuperar senha</h5>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-12">
                                <span className="title-primary">Insira o endereço de e-mail associado à sua conta Avalia Imobi.</span>
                            </div>
                        </div>
                        <div className="row my-3">
                            <input type="email"
                                className="form-control"
                                id="loginEmail"
                                placeholder="E-mail"
                                value={email} onChange={e => setEmail(e.target.value)} />
                            {emailSuccess ?
                                <small className="text-success fadeItem">{emailSuccess}</small>
                                :
                                <small className="text-danger fadeItem">{emailError}</small>
                            }
                        </div>
                        <div className="row my-1">
                            {loadingSend ?
                                <button className='btn btn-orange ' disabled><SpinnerSM /></button>
                                :
                                <button className='btn btn-orange ' onClick={() => handleSendToken(email)}>Enviar</button>
                            }
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-start">
                                <span className="span" type='button' onClick={() => { props.setSection('signIn') }}><AiOutlineLeft className="me-2" />  Voltar</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>





        </div>
    )
}