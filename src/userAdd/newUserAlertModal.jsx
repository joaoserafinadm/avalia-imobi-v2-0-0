import { faUserGear, faUserTie } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { maskNumberMoney } from "../../utils/mask"



export default function NewUserAlertModal(props) {

    const { paymentData, handleSave, firstName, lastName, email, userStatus, usersCount } = props

    console.log("paymentData", paymentData)

    const [subsValue, setSubsValue] = useState(0)
    const [newValue, setNewValue] = useState(0)
    const [userValue, setUserValue] = useState(0)

    useEffect(() => {

        paymentCalc()
    }, [paymentData])

    const paymentCalc = () => {

        const usersCount = +paymentData.usersCount

        let valuePerUser = +usersCount <= 5 ? 19.90 : 14.90
        let tax = +usersCount <= 5 ? 60 : 65

        const newValueResult = valuePerUser * (usersCount + 1) + tax

        setNewValue(newValueResult.toFixed(2))

        setUserValue(valuePerUser.toFixed(2))


    }




    return (
        <div className="modal fade" id="newUserAlertModal" tabIndex="-1" aria-labelledby="Modal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title title-dark bold">Alerta!</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-12">
                                <span>Você está prestes a cadastrar um novo usuário na sua conta! </span>
                            </div>
                            <div className="col-12">
                                {usersCount <= 5 ?
                                    <>
                                        <span>Será acrescentado R$ {maskNumberMoney(userValue)} no valor da sua assinatura.</span>
                                    </>
                                    :
                                    <>
                                        <span>Será acrescentado R${maskNumberMoney(userValue)} no valor da sua assinatura.</span>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="row my-3">
                            <div className="col-12">
                                <span className="small fw-bold">
                                    Verifique os dados do usuário:
                                </span>
                            </div>
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12">
                                                <span className="small me-1">Nome: </span><span className="fw-bold">{firstName} {lastName}</span>
                                            </div>
                                            <div className="col-12 d-flex align-items-center">
                                                <span className="small me-1">E-mail: </span><span className="fw-bold">{email}</span>
                                            </div>
                                            <div className="col-12 d-flex align-items-center">
                                                <span className="small me-1">Categoria: </span>
                                                {userStatus === "admGlobal" ? <FontAwesomeIcon icon={faUserGear} className="me-1" /> : <FontAwesomeIcon icon={faUserTie} className="me-1" />} {userStatus === 'admGlobal' ? 'Administrador' : 'Corretor'}

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className="row my-3">
                            <div className="col-12">
                                <span className="small fw-bold">
                                    Detalhes da assinatura:
                                </span>

                            </div>
                            <div className="col-12 my-2">
                                &#x2022; <b> {+paymentData.usersCount + 1}</b> usuários: R$79.90 + ({+paymentData.usersCount} x R${maskNumberMoney(userValue)}) = <b>R${maskNumberMoney(newValue)}/mês</b>
                            </div>
                            <div className="col-12 my-2">
                                &#x2022; Será adicionado um valor proporcional na próxima fatura referente ao uso do novo usuário até o final do período de faturamento atual.
                            </div>
                            {/* <div className="col-12 my-2">
                                &#x2022; Para acessar os detalhes da assinatura, vá em: Configurações {'->'} Configuração da conta {'->'} Assinatura
                            </div> */}
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button className="btn btn-orange" onClick={() => handleSave()} data-bs-dismiss="modal">Cadastrar usuário</button>
                    </div>
                </div>
            </div>
        </div>
    )


}