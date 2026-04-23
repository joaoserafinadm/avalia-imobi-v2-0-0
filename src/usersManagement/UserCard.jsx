import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faPhone, faUserGear, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { userStatusName } from "../../utils/permissions";
import styles from "./UserCard.module.scss";

export default function UserCard({ elem, setUserSelected }) {

    const isAdmin = elem.userStatus === 'admGlobal'
    const fullName = elem.firstName || elem.lastName
        ? `${elem.firstName} ${elem.lastName}`.trim()
        : '—'

    const handleWhatsapp = () => {
        const phone = elem.celular.replace(/\D/g, '')
        window.open(`https://api.whatsapp.com/send?phone=${phone}`, '_blank')
    }

    return (
        <div className="col-12 col-lg-6 my-2">
            <div className={styles.card}>

                {/* ── Header ── */}
                <div className={styles.header}>
                    <img
                        src={elem.profileImageUrl}
                        alt={fullName}
                        className={styles.avatar}
                    />
                    <div className={styles.headerInfo}>
                        <p className={styles.name}>{fullName}</p>
                        <span className={isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeBroker}>
                            <FontAwesomeIcon icon={isAdmin ? faUserGear : faUserTie} style={{ fontSize: '0.58rem' }} />
                            {userStatusName(elem.userStatus) || '—'}
                        </span>
                    </div>
                </div>

                {/* ── Info ── */}
                <div className={styles.body}>
                    <div className={styles.infoRow}>
                        <span className={styles.infoIcon}>
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                        <p className={elem.workEmail || elem.email ? styles.infoText : styles.infoTextMuted}>
                            {elem.workEmail || elem.email || 'Não informado'}
                        </p>
                    </div>

                    <div className={styles.infoSubRow}>
                        <div className={styles.infoRow} style={{ padding: 0 }}>
                            <span className={styles.infoIcon}>
                                <FontAwesomeIcon icon={faWhatsapp} />
                            </span>
                            <p className={elem.celular ? styles.infoText : styles.infoTextMuted}>
                                {elem.celular || 'Não informado'}
                            </p>
                        </div>
                        <div className={styles.infoRow} style={{ padding: 0 }}>
                            <span className={styles.infoIcon}>
                                <FontAwesomeIcon icon={faPhone} />
                            </span>
                            <p className={elem.telefone ? styles.infoText : styles.infoTextMuted}>
                                {elem.telefone || 'Não informado'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Actions ── */}
                <div className={styles.footer}>
                    <button
                        type="button"
                        className={styles.actionBtn}
                        id={"viewUserBtn" + elem._id}
                        onClick={() => setUserSelected(elem)}
                        data-bs-toggle="modal"
                        data-bs-target="#viewUserModal"
                        title="Visualizar usuário"
                    >
                        <FontAwesomeIcon icon={faEye} />
                        Visualizar
                    </button>
                    <button
                        type="button"
                        className={styles.actionBtnGreen}
                        id={"whatsappUserBtn" + elem._id}
                        disabled={!elem.celular}
                        onClick={handleWhatsapp}
                        title="Conversar pelo WhatsApp"
                    >
                        <FontAwesomeIcon icon={faWhatsapp} />
                        WhatsApp
                    </button>
                </div>
            </div>
        </div>
    )
}
