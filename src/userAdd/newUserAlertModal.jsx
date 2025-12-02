import { faUserGear, faUserTie, faInfoCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons"
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

        let valuePerUser = 19.90
        let tax = 20

        const newValueResult = valuePerUser * (usersCount + 1) + tax

        setNewValue(newValueResult.toFixed(2))

        setUserValue(valuePerUser.toFixed(2))


    }




    return (
        <div className="modal fade" id="newUserAlertModal" tabIndex="-1" aria-labelledby="Modal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header border-0 bg-light pb-3">
                        <div>
                            <h5 className="modal-title fw-bold mb-1" style={{ color: '#2c3e50' }}>
                                <FontAwesomeIcon icon={faInfoCircle} className="text-orange me-2" />
                                Confirmar novo usuário
                            </h5>
                            <p className="text-muted small mb-0">Revise as informações antes de prosseguir</p>
                        </div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    
                    <div className="modal-body px-4 py-4">
                        {/* Alerta Info */}
                        <div className="alert alert-info border-0 d-flex align-items-start mb-4" style={{ backgroundColor: '#e8f4f8' }}>
                            <FontAwesomeIcon icon={faInfoCircle} className="text-info mt-1 me-2" />
                            <div>
                                <span className="fw-semibold">Novo usuário será adicionado à sua conta</span>
                                <div className="small mt-1">
                                    Será acrescentado <span className="fw-bold text-primary">R$ {maskNumberMoney(userValue)}</span> no valor da sua assinatura mensal.
                                </div>
                            </div>
                        </div>

                        {/* Dados do Usuário */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-3 text-secondary">
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2" style={{ fontSize: '0.9rem' }} />
                                Dados do usuário
                            </h6>
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3" 
                                                     style={{ width: '45px', height: '45px' }}>
                                                    <FontAwesomeIcon 
                                                        icon={userStatus === "admGlobal" ? faUserGear : faUserTie} 
                                                        className="text-orange" 
                                                        style={{ fontSize: '1.2rem' }}
                                                    />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold" style={{ fontSize: '1.1rem' }}>
                                                        {firstName} {lastName}
                                                    </div>
                                                    <div className="text-muted small">{email}</div>
                                                    <span className="badge bg-orange px-3 py-2 mt-2">
                                                        {userStatus === 'admGlobal' ? 'Administrador' : 'Corretor'}
                                                    </span>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detalhes da Assinatura */}
                        <div className="mb-3">
                            <h6 className="fw-bold mb-3 text-secondary">
                                <FontAwesomeIcon icon={faInfoCircle} className="me-2" style={{ fontSize: '0.9rem' }} />
                                Detalhes da assinatura
                            </h6>
                            <div className="card border-0" style={{ backgroundColor: '#fff9f0' }}>
                                <div className="card-body p-4">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                                <div>
                                                    <div className="text-muted small mb-1">Usuários ativos</div>
                                                    <div className="fw-bold" style={{ fontSize: '1.1rem' }}>
                                                        {+paymentData.usersCount} → {+paymentData.usersCount + 1}
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="text-muted small mb-1">Novo valor mensal</div>
                                                    <div className="fw-bold text-orange" style={{ fontSize: '1.3rem' }}>
                                                        R$ {maskNumberMoney(newValue)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="small">
                                                <div className="d-flex mb-2">
                                                    <span className="text-orange me-2">•</span>
                                                    <span>
                                                        <strong>Cálculo:</strong> R$ 39,90 (taxa base) + ({+paymentData.usersCount} usuários × R$ {maskNumberMoney(userValue)}) = 
                                                        <span className="fw-bold text-primary ms-1">R$ {maskNumberMoney(newValue)}/mês</span>
                                                    </span>
                                                </div>
                                                <div className="d-flex">
                                                    <span className="text-orange me-2">•</span>
                                                    <span className="text-muted">
                                                        Será cobrado um valor proporcional na próxima fatura referente ao período restante do ciclo atual.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    <div className="modal-footer border-0 bg-light px-4 py-3">
                        <button type="button" className="btn btn-outline-secondary px-4" data-bs-dismiss="modal">
                            Cancelar
                        </button>
                        <button className="btn btn-orange px-4 shadow-sm" onClick={() => handleSave()} data-bs-dismiss="modal">
                            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                            Confirmar e cadastrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )


}