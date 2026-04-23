import { faLock, faPencil, faRightFromBracket, faShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken';
import { isAdmin } from "../../utils/permissions";
import TitleLabel from "../components/TitleLabel";
import styles from "./AccountDetailsPage.module.scss";

export default function AccountDetailsPage(props) {

    const token = jwt.decode(Cookie.get('auth'))
    const adminUser = isAdmin(props.userData.userStatus)

    return (
        <div className={styles.page}>

            {/* ── Sua Conta ── */}
            <TitleLabel>Sua Conta</TitleLabel>
            <div className={styles.section}>

                <div className={styles.row}>
                    <div className={styles.rowContent}>
                        <p className={styles.rowLabel}>Nome</p>
                        <p className={styles.rowValue}>{props.userData.firstName} {props.userData.lastName}</p>
                        <p className={styles.rowValueMono}>CRECI: {props.userData.creci}</p>
                    </div>
                    <div className={styles.rowAction}>
                        <Link href="/editProfile" className={styles.editBtn}>
                            <FontAwesomeIcon icon={faPencil} />
                        </Link>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.rowContent}>
                        <p className={styles.rowLabel}>E-mail</p>
                        <p className={styles.rowValue}>{props.userData.email}</p>
                        {props.userData.workEmail && (
                            <p className={styles.rowValue}>
                                {props.userData.workEmail}
                                <span className={styles.rowTag}>trabalho</span>
                            </p>
                        )}
                    </div>
                    <div className={styles.rowAction}>
                        <Link href="/editProfile" className={styles.editBtn}>
                            <FontAwesomeIcon icon={faPencil} />
                        </Link>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.rowContent}>
                        <p className={styles.rowLabel}>Telefone</p>
                        <p className={styles.rowValue}>
                            {props.userData.celular}
                            {props.userData.telefone && <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>/ {props.userData.telefone}</span>}
                        </p>
                    </div>
                    <div className={styles.rowAction}>
                        <Link href="/editProfile" className={styles.editBtn}>
                            <FontAwesomeIcon icon={faPencil} />
                        </Link>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.rowContent}>
                        <p className={styles.rowLabel}>Senha</p>
                        <p className={styles.rowValueMono}>••••••••••</p>
                    </div>
                    <div className={styles.rowAction}>
                        <Link href="/passwordChange" className={styles.editBtn}>
                            <FontAwesomeIcon icon={faPencil} />
                        </Link>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.rowContent}>
                        <p className={styles.rowLabel}>Função</p>
                        <span className={adminUser ? styles.badgeAdmin : styles.badgeBroker}>
                            <FontAwesomeIcon icon={faShield} style={{ fontSize: '0.58rem' }} />
                            {token.userStatus === 'admGlobal' ? 'Administrador' : 'Corretor'}
                        </span>
                    </div>
                    <div className={styles.rowAction}>
                        <span className={styles.lockIcon}><FontAwesomeIcon icon={faLock} /></span>
                    </div>
                </div>
            </div>

            {/* ── Sua Imobiliária ── */}
            <TitleLabel>Sua Imobiliária</TitleLabel>
            <div className={styles.section}>

                <div className={styles.row}>
                    <div className={styles.rowContent}>
                        <p className={styles.rowLabel}>Empresa</p>
                        <p className={styles.rowValue}>{props.companyData.companyName}</p>
                        <p className={styles.rowValueMono}>CRECI: {props.companyData.companyCreci}</p>
                    </div>
                    <div className={styles.rowAction}>
                        {adminUser
                            ? <Link href="/companyEdit" className={styles.editBtn}><FontAwesomeIcon icon={faPencil} /></Link>
                            : <span className={styles.lockIcon}><FontAwesomeIcon icon={faLock} /></span>}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.rowContent}>
                        <p className={styles.rowLabel}>Endereço</p>
                        {props.companyData.logradouro && props.companyData.numero && (
                            <p className={styles.rowValue}>{props.companyData.logradouro}, {props.companyData.numero}</p>
                        )}
                        <p className={styles.rowValue}>{props.companyData.cidade} — {props.companyData.estado}</p>
                        <p className={styles.rowValueMono}>CEP {props.companyData.cep}</p>
                    </div>
                    <div className={styles.rowAction}>
                        {adminUser
                            ? <Link href="/companyEdit" className={styles.editBtn}><FontAwesomeIcon icon={faPencil} /></Link>
                            : <span className={styles.lockIcon}><FontAwesomeIcon icon={faLock} /></span>}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.rowContent}>
                        <p className={styles.rowLabel}>Contato</p>
                        <p className={styles.rowValue}>{props.companyData.email}</p>
                        <p className={styles.rowValueMono}>
                            {props.companyData.celular}
                            {props.companyData.telefone && ` / ${props.companyData.telefone}`}
                        </p>
                    </div>
                    <div className={styles.rowAction}>
                        {adminUser
                            ? <Link href="/companyEdit" className={styles.editBtn}><FontAwesomeIcon icon={faPencil} /></Link>
                            : <span className={styles.lockIcon}><FontAwesomeIcon icon={faLock} /></span>}
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className={styles.footer}>
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#exitAccountModal"
                    className={styles.logoutBtn}
                >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Sair da conta
                </button>
            </div>
        </div>
    )
}
