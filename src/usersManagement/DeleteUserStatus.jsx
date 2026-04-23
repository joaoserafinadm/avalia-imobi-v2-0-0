import { useEffect, useState } from "react"
import { SpinnerSM } from "../components/loading/Spinners"
import axios from "axios"
import baseUrl from "../../utils/baseUrl"
import { useDispatch, useSelector } from "react-redux"
import { addAlert } from "../../store/Alerts/Alerts.actions"
import { maskNumberMoney } from "../../utils/mask"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationTriangle, faCircleExclamation, faArrowRight, faUsers, faReceipt } from "@fortawesome/free-solid-svg-icons"
import { ModalBtnDanger, ModalBtnSecondary } from "../components/Modal"
import styles from "./viewUserModal.module.scss"

export default function DeleteUserStatus(props) {

    const { user, token, usersCount } = props
    const dispatch = useDispatch()
    const alertsArray = useSelector(state => state.alerts)

    const [newValue, setNewValue] = useState(0)
    const [userValue, setUserValue] = useState(0)
    const [saveError, setSaveError] = useState('')
    const [loadingSave, setLoadingSave] = useState(false)

    useEffect(() => {
        if (usersCount) {
            const valuePerUser = 19.90
            const tax = 20
            setNewValue(((valuePerUser * (usersCount - 1)) + tax).toFixed(2))
            setUserValue(valuePerUser.toFixed(2))
        }
    }, [usersCount])

    const handleSave = async () => {
        setLoadingSave(true)
        setSaveError('')

        await axios.delete(`${baseUrl()}/api/usersManagement`, {
            data: { company_id: token.company_id, user_id: token.sub, userSelected: user?._id }
        }).then(res => {
            dispatch(addAlert(alertsArray, [{ type: 'alert', message: `${user?.firstName} excluído com sucesso!`, link: res.data }]))
            props.handleCloseModal()
        }).then(() => {
            props.dataFunction()
        }).catch(() => {
            setSaveError('O usuário não pode ser excluído')
            setLoadingSave(false)
        })
    }

    return (
        <div>
            {/* ── Warning block ── */}
            <div className={styles.warningBlock}>
                <span className={styles.warningIcon}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                </span>
                <div>
                    <p className={styles.warningTitle}>Atenção — ação irreversível</p>
                    <p className={styles.warningText}>
                        Tem certeza que deseja excluir <strong>{user?.firstName} {user?.lastName}</strong>?
                        Esta ação não pode ser desfeita.
                    </p>
                </div>
            </div>

            {/* ── Subscription update ── */}
            <p className={styles.sectionLabel}>
                <FontAwesomeIcon icon={faReceipt} />
                Atualização da assinatura
            </p>

            <div className={styles.infoSection}>
                <div className={styles.infoRow}>
                    <span className={styles.infoIcon}>
                        <FontAwesomeIcon icon={faUsers} />
                    </span>
                    <div className={styles.infoContent}>
                        <p className={styles.infoLabel}>Usuários</p>
                        <p className={styles.infoValue}>
                            {usersCount} usuários
                            <FontAwesomeIcon icon={faArrowRight} style={{ margin: '0 8px', opacity: 0.4, fontSize: '0.65rem' }} />
                            {usersCount - 1} usuário{usersCount - 1 === 1 ? '' : 's'}
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.priceCard}>
                <div className={styles.priceRow}>
                    <span>Base</span>
                    <span>R$ 20,00</span>
                </div>
                <div className={styles.priceRow}>
                    <span>{usersCount - 1} × R$ {maskNumberMoney(userValue)}</span>
                    <span>R$ {maskNumberMoney((19.90 * (usersCount - 1)).toFixed(2))}</span>
                </div>
                <div className={styles.priceTotal}>
                    Novo total: R$ {maskNumberMoney(newValue)}/mês
                </div>
            </div>

            {saveError && (
                <div className={styles.errorAlert}>
                    <FontAwesomeIcon icon={faCircleExclamation} />
                    {saveError}
                </div>
            )}

            {/* ── Footer ── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: '1.25rem' }}>
                <ModalBtnSecondary dismiss={false} onClick={() => props.setDeleteStatus(false)}>
                    Cancelar
                </ModalBtnSecondary>
                <ModalBtnDanger dismiss={false} onClick={handleSave} disabled={loadingSave}>
                    {loadingSave ? <SpinnerSM /> : 'Excluir usuário'}
                </ModalBtnDanger>
            </div>
        </div>
    )
}
