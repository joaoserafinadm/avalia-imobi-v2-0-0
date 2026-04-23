import { faEnvelope, faPhone, faUserGear, faUserTie, faIdCard, faEllipsisVertical, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { permissionShow, userStatusName } from "../../utils/permissions"
import { ModalBtnSecondary } from "../components/Modal"
import styles from "./viewUserModal.module.scss"

export default function UserInfo(props) {

    const { user, token } = props
    const isAdmin = user?.userStatus === 'admGlobal'

    const infoItems = [
        { icon: faIdCard,   label: 'CRECI',     value: user?.creci      || 'Não informado' },
        { icon: faEnvelope, label: 'E-mail',     value: user?.workEmail  || 'Não informado' },
        { icon: faWhatsapp, label: 'WhatsApp',   value: user?.celular    || 'Não informado' },
        { icon: faPhone,    label: 'Telefone',   value: user?.telefone   || 'Não informado' },
    ]

    return (
        <div>
            {/* ── Avatar ── */}
            <div className={styles.avatarWrap}>
                <img
                    src={user?.profileImageUrl}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className={styles.avatar}
                />
                <p className={styles.avatarName}>{user?.firstName} {user?.lastName}</p>
                <span className={isAdmin ? styles.roleBadgeAdmin : styles.roleBadge}>
                    <FontAwesomeIcon icon={isAdmin ? faUserGear : faUserTie} style={{ fontSize: '0.6rem' }} />
                    {userStatusName(user?.userStatus) || '—'}
                </span>
            </div>

            {/* ── Info rows ── */}
            <div className={styles.infoSection}>
                {infoItems.map((item, i) => (
                    <div key={i} className={styles.infoRow}>
                        <span className={styles.infoIcon}>
                            <FontAwesomeIcon icon={item.icon} />
                        </span>
                        <div className={styles.infoContent}>
                            <p className={styles.infoLabel}>{item.label}</p>
                            <p className={styles.infoValue}>{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Footer actions ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: '0.5rem' }}>
                {permissionShow(token?.userStatus, user?._id, token?.sub, true) ? (
                    <div className="dropdown">
                        <button
                            className={styles.actionMenuBtn}
                            data-bs-toggle="dropdown"
                            type="button"
                            aria-label="Opções"
                        >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark" data-bs-theme="dark">
                            <li>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={() => props.setEditStatus(true)}
                                >
                                    <FontAwesomeIcon icon={faUserGear} className="me-2" />
                                    Editar categoria
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    type="button"
                                    onClick={() => props.setDeleteStatus(true)}
                                >
                                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                                    Excluir usuário
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : <span />}

                <ModalBtnSecondary onClick={props.handleCloseModal}>
                    Fechar
                </ModalBtnSecondary>
            </div>
        </div>
    )
}
