import { useEffect, useState } from "react"
import { SpinnerSM } from "../components/loading/Spinners"
import axios from "axios"
import baseUrl from "../../utils/baseUrl"
import { useDispatch, useSelector } from "react-redux"
import { addAlert } from "../../store/Alerts/Alerts.actions"
import { maskNumberMoney } from "../../utils/mask"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightLong, faExclamationTriangle, faUser, faCalculator, faMoneyBill } from "@fortawesome/free-solid-svg-icons"

export default function DeleteUserStatus(props) {

    const user = props.user
    const token = props.token
    const usersCount = props.usersCount

    const dispatch = useDispatch()
    const alertsArray = useSelector(state => state.alerts)

    const [newValue, setNewValue] = useState(0)
    const [userValue, setUserValue] = useState(0)

    const [saveError, setSaveError] = useState('')

    const [loadingSave, setLoadingSave] = useState(false)

    useEffect(() => {
        if (usersCount) paymentCalc()
    }, [usersCount])

    const paymentCalc = () => {
        let valuePerUser = 19.90
        let tax = 20

        const newValueResult = valuePerUser * (usersCount - 1) + tax

        setNewValue(newValueResult.toFixed(2))
        setUserValue(valuePerUser.toFixed(2))
    }

    const handleSave = async () => {
        setLoadingSave(true)
        setSaveError('')

        await axios.delete(`${baseUrl()}/api/usersManagement`, {
            data: {
                company_id: token.company_id,
                user_id: token.sub,
                userSelected: user?._id
            }
        }).then(res => {
            const alert = {
                type: 'alert',
                message: `${user?.firstName} excluído com sucesso!`,
                link: res.data
            }

            dispatch(addAlert(alertsArray, [alert]))
            props.handleCloseModal()
        }).then(res => {
            props.dataFunction()
        }).catch(e => {
            setSaveError('O usuário não pode ser excluído')
        })
    }

    return (
        <>
            <style jsx>{`
                .delete-modal-body {
                    padding: 2rem;
                }

                .warning-card {
                    background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
                    border: 2px solid #fee;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }

                .warning-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .warning-icon {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
                    color: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }

                .warning-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #721c24;
                    margin: 0;
                }

                .user-delete-info {
                    font-size: 1rem;
                    color: #721c24;
                    line-height: 1.6;
                }

                .user-delete-info strong {
                    color: #dc3545;
                    font-weight: 700;
                }

                .section-divider {
                    margin: 2rem 0;
                    border: none;
                    height: 2px;
                    background: linear-gradient(to right, transparent, #dee2e6, transparent);
                }

                .subscription-section {
                    margin-top: 2rem;
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #2c3e50;
                    margin-bottom: 1.5rem;
                }

                .section-icon {
                    width: 35px;
                    height: 35px;
                    background: linear-gradient(135deg, #f5874f 0%, #ff9d6e 100%);
                    color: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .info-item {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 1rem 1.25rem;
                    margin-bottom: 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    transition: all 0.3s ease;
                }

                .info-item:hover {
                    background: #fff3ed;
                    transform: translateX(4px);
                }

                .info-bullet {
                    width: 8px;
                    height: 8px;
                    background: #f5874f;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .info-text {
                    flex: 1;
                    color: #495057;
                    font-size: 0.95rem;
                }

                .arrow-icon {
                    color: #f5874f;
                    margin: 0 0.5rem;
                }

                .price-highlight {
                    background: linear-gradient(135deg, #fff3ed 0%, #ffe8d9 100%);
                    border: 2px solid #f5874f;
                    border-radius: 12px;
                    padding: 1.25rem;
                    margin-top: 1rem;
                }

                .price-calculation {
                    color: #2c3e50;
                    font-size: 1rem;
                    line-height: 1.8;
                }

                .final-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #f5874f;
                    margin-top: 0.5rem;
                }

                .error-message {
                    background: #fee;
                    border: 2px solid #dc3545;
                    border-radius: 12px;
                    padding: 1rem 1.25rem;
                    margin-top: 1.5rem;
                    color: #dc3545;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .custom-footer {
                    padding: 1.5rem 2rem;
                    border-top: 2px solid #f0f0f0;
                    background: #fafafa;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }

                .footer-btn {
                    padding: 0.75rem 2rem;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid;
                    min-width: 120px;
                }

                .btn-cancel {
                    background: white;
                    border-color: #dee2e6;
                    color: #6c757d;
                }

                .btn-cancel:hover {
                    border-color: #f5874f;
                    color: #f5874f;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(245, 135, 79, 0.2);
                }

                .btn-delete {
                    background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
                    border-color: #dc3545;
                    color: white;
                }

                .btn-delete:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(220, 53, 69, 0.4);
                }

                .btn-delete:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .delete-modal-body {
                        padding: 1.5rem;
                    }

                    .warning-card {
                        padding: 1.25rem;
                    }

                    .warning-title {
                        font-size: 1.1rem;
                    }

                    .custom-footer {
                        padding: 1rem 1.5rem;
                        flex-direction: column;
                    }

                    .footer-btn {
                        width: 100%;
                        max-width: none;
                    }
                }
            `}</style>

            <div className="modal-body delete-modal-body">
                <div className="warning-card">
                    <div className="warning-header">
                        <div className="warning-icon">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                        </div>
                        <h3 className="warning-title">Atenção!</h3>
                    </div>
                    <p className="user-delete-info">
                        Tem certeza que deseja deletar <strong>"{user?.firstName} {user?.lastName}"</strong>?
                        <br />
                        Esta ação não pode ser desfeita.
                    </p>
                </div>

                <div className="subscription-section">
                    <div className="section-title">
                        <div className="section-icon">
                            <FontAwesomeIcon icon={faCalculator} />
                        </div>
                        Atualização da assinatura
                    </div>

                    <div className="info-item">
                        <div className="info-bullet"></div>
                        <div className="info-text">
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            <strong>{usersCount}</strong> usuários 
                            <FontAwesomeIcon icon={faRightLong} className="arrow-icon mx-2" /> 
                            <strong>{usersCount - 1}</strong> usuário{usersCount - 1 === 1 ? '' : 's'}
                        </div>
                    </div>

                    <div className="price-highlight">
                        <div className="section-title mb-3" style={{marginBottom: '1rem'}}>
                            <div className="section-icon" style={{width: '30px', height: '30px', fontSize: '0.9rem'}}>
                                <FontAwesomeIcon icon={faMoneyBill} />
                            </div>
                            <span style={{fontSize: '1rem'}}>Novo valor da assinatura</span>
                        </div>
                        <div className="price-calculation">
                            <strong>{+usersCount - 1}</strong> usuário{+usersCount - 1 === 1 ? '' : 's'}: 
                            <br />
                            R$20,00 + ({+usersCount - 1} × R${maskNumberMoney(userValue)})
                        </div>
                        <div className="final-price">
                            = R${maskNumberMoney(newValue)}/mês
                        </div>
                    </div>

                    {saveError && (
                        <div className="error-message">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                            {saveError}
                        </div>
                    )}
                </div>
            </div>

            <div className="modal-footer custom-footer">
                <button 
                    className="footer-btn btn-cancel" 
                    onClick={() => props.setDeleteStatus(false)}
                >
                    Cancelar
                </button>
                {loadingSave ? (
                    <button className="footer-btn btn-delete" disabled>
                        <SpinnerSM />
                    </button>
                ) : (
                    <button 
                        className="footer-btn btn-delete" 
                        onClick={() => handleSave()} 
                        data-bs-dismiss="modal"
                    >
                        Excluir usuário
                    </button>
                )}
            </div>
        </>
    )
}