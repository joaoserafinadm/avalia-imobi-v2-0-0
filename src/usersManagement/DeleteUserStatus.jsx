import { useEffect, useState } from "react"
import { SpinnerSM } from "../components/loading/Spinners"
import axios from "axios"
import baseUrl from "../../utils/baseUrl"
import { useDispatch, useSelector } from "react-redux"
import { addAlert } from "../../store/Alerts/Alerts.actions"
import { maskNumberMoney } from "../../utils/mask"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightLong } from "@fortawesome/free-solid-svg-icons"




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


        let valuePerUser = +usersCount <= 5 ? 19.90 : 14.90
        let tax = +usersCount <= 5 ? 60 : 65

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
            // setSaveError(e.response.data.message)
        })


    }


    return (
        <>
            <div className="modal-body">
                <div className="row my-4">
                    <div className="col-12 justify-content-center">
                        <span className="bold">Tem certeza que deseja excluir "{user?.firstName} {user?.lastName}"?</span><br />
                    </div>
                    <div className="col-12 my-3">
                        <span className="small fw-bold">
                            Atualização da assinatura:
                        </span>

                    </div>
                    <div className="col-12">
                        &#x2022; {usersCount} usuários <FontAwesomeIcon icon={faRightLong} className="mx-2" /> {usersCount - 1} usuário{usersCount - 1 === 1 ? '' : 's'}
                    </div>
                    <div className="col-12">
                        &#x2022; <b> {+usersCount - 1}</b> usuários: R$79,90 + ({+usersCount - 1} x R${maskNumberMoney(userValue)}) = <b>R${maskNumberMoney(newValue)}/mês</b>
                    </div>
                    <div className="col-12">
                        <small className="text-danger">{saveError}</small>

                    </div>
                </div>
            </div>
            <div className="modal-footer">

                <button className="btn btn-sm btn-outline-secondary" onClick={() => props.setDeleteStatus(false)}>Cancelar</button>
                {loadingSave ?
                    <button className="btn btn-sm btn-outline-danger px-4" disabled>
                        <SpinnerSM />
                    </button>
                    :
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleSave()} data-bs-dismiss="modal">Excluir</button>
                }

            </div>
        </>
    )
}