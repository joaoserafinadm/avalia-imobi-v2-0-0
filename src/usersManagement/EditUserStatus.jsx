import axios from "axios"
import { useState } from "react"
import { SpinnerSM } from "../components/loading/Spinners"
import baseUrl from "../../utils/baseUrl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserShield, faUserTie, faCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { ModalBtnPrimary, ModalBtnSecondary } from "../components/Modal"
import styles from "./viewUserModal.module.scss"

const userRoles = [
    { value: 'admGlobal', label: 'Administrador', icon: faUserShield, description: 'Acesso total ao sistema' },
    { value: 'user',      label: 'Corretor',       icon: faUserTie,    description: 'Acesso padrão de corretor' },
]

export default function EditUserStatus(props) {

    const { user, token } = props
    const [userStatusEdit, setUserStatusEdit] = useState(user.userStatus)
    const [saveError, setSaveError] = useState('')
    const [loadingSave, setLoadingSave] = useState(false)

    const handleSave = async () => {
        setLoadingSave(true)
        setSaveError('')

        await axios.patch(`${baseUrl()}/api/usersManagement`, {
            company_id: token.company_id,
            user_id: token.sub,
            userSelected: user._id,
            userStatus: userStatusEdit
        }).then(() => {
            props.setEditStatus(false)
            props.dataFunction()
        }).catch(() => {
            setSaveError('O usuário não pode ser editado')
            setLoadingSave(false)
        })
    }

    return (
        <div>
            {/* ── User header ── */}
            <div className={styles.editHeader}>
                <img
                    src={user.profileImageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className={styles.editAvatar}
                />
                <p className={styles.editName}>{user.firstName} {user.lastName}</p>
            </div>

            {/* ── Role selection ── */}
            <p className={styles.sectionLabel}>
                <FontAwesomeIcon icon={faUserShield} />
                Categoria do usuário
            </p>
            <div className={styles.roleGrid}>
                {userRoles.map(role => (
                    <div
                        key={role.value}
                        className={userStatusEdit === role.value ? styles.roleCardActive : styles.roleCard}
                        onClick={() => setUserStatusEdit(role.value)}
                    >
                        <span className={styles.roleIconWrap}>
                            <FontAwesomeIcon icon={role.icon} />
                        </span>
                        <div className={styles.roleInfo}>
                            <p className={styles.roleLabel}>{role.label}</p>
                            <p className={styles.roleDesc}>{role.description}</p>
                        </div>
                        <span className={styles.roleCheck}>
                            {userStatusEdit === role.value && <FontAwesomeIcon icon={faCheck} />}
                        </span>
                    </div>
                ))}
            </div>

            {saveError && (
                <div className={styles.errorAlert}>
                    <FontAwesomeIcon icon={faCircleExclamation} />
                    {saveError}
                </div>
            )}

            {/* ── Footer ── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: '1.25rem' }}>
                <ModalBtnSecondary dismiss={false} onClick={() => props.setEditStatus(false)} disabled={loadingSave}>
                    Cancelar
                </ModalBtnSecondary>
                <ModalBtnPrimary dismiss={false} onClick={handleSave} disabled={loadingSave}>
                    {loadingSave ? <SpinnerSM /> : 'Salvar alterações'}
                </ModalBtnPrimary>
            </div>
        </div>
    )
}
