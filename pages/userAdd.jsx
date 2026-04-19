import { useEffect, useState } from "react";
import Title from "../src/components/title/Title2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserGear, faUserTie, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FixedTopicsBottom } from "../src/components/fixedTopics";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { SpinnerLG, SpinnerSM } from "../src/components/loading/Spinners"
import { useDispatch, useSelector } from "react-redux";
import navbarHide from "../utils/navbarHide";
import removeInputError from "../utils/removeInputError";
import scrollTo from "../utils/scrollTo";
import randomPassword from "../utils/randomPassword";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { addAlert } from "../store/Alerts/Alerts.actions";
import { useRouter } from "next/router";
import NewUserAlertModal from "../src/userAdd/newUserAlertModal";
import { maskEmail } from "../utils/mask";
import styles from "./userAdd.module.scss";



export default function userAdd() {

    const router = useRouter()

    const token = jwt.decode(Cookies.get("auth"));
    const dispatch = useDispatch()
    const alertsArray = useSelector(state => state.alerts)


    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [userStatus, setUserStatus] = useState('')

    const [firstNameError, setFirstNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [userStatusError, setUserStatusError] = useState('')

    const [paymentData, setPaymentData] = useState(null)
    const [paymentDataError, setPaymentDataError] = useState(false)

    const [loadingSave, setLoadingSave] = useState(false)
    const [loadingPage, setLoadingPage] = useState(true)

    const [subscriptionOn, setSubscriptionOn] = useState(true)

    useEffect(() => {
        navbarHide(dispatch)
        dataFunction()
    }, [])

    useEffect(() => {
        if (token) {
            if (token.dateLimit || (!token.active && token.errorStatus)) setSubscriptionOn(false)
        }
    }, [token])

    const dataFunction = async () => {

        const data = {
            company_id: token.company_id,
        }

        await axios.get(`/api/userAdd`, {
            params: data
        }).then(res => {
            setPaymentData(res.data.data)
            setLoadingPage(false)
        }).catch(e => {
            setPaymentDataError(true)
            setLoadingPage(false)
        })

    }


    const handleDisableSave = () => {

        if (!firstName || !email || !userStatus) {
            return true
        } else {
            return false
        }
    }

    const validate = () => {

        setFirstNameError('')
        setEmailError('')
        setUserStatusError('')

        let firstNameError = ''
        let emailError = ''
        let userStatusError = ''

        removeInputError()

        if (!firstName) firstNameError = 'Escreva o nome do usuário'
        if (!email || !email.includes('@')) emailError = "E-mail inválido"
        if (!userStatus) userStatusError = "Escolha uma das opções"


        if (firstNameError || emailError || userStatusError) {
            if (firstNameError) { setFirstNameError(firstNameError); document.getElementById("firstName").classList.add('inputError') }
            if (emailError) { setEmailError(emailError); document.getElementById("email").classList.add('inputError') }
            if (userStatusError) { setUserStatusError(userStatusError) }

            scrollTo('pageTop')
            return false
        } else {
            setFirstNameError('')
            setEmailError('')
            setUserStatusError('')

            removeInputError()

            return true
        }
    }

    const handleSave = async (company_id) => {




        setLoadingSave(true)

        const isValid = validate()

        if (isValid) {

            const data = {
                company_id: token.company_id,
                user_id: token.sub,
                firstName,
                lastName,
                email,
                userStatus: userStatus
            }

            await axios.post(`${baseUrl()}/api/userAdd`, data)
                .then(res => {

                    const alert = {
                        type: 'alert',
                        message: `${firstName} adicionado com sucesso!`,
                        link: res.data
                    }

                    dispatch(addAlert(alertsArray, [alert]))

                    setLoadingSave(false)

                    router.push('/usersManagement')


                })
                .catch(e => {
                    if (e.response.data.error === 'User already exists') {
                        setEmailError('Este e-mail ja é utilizado.')
                        document.getElementById("email").classList.add('inputError')
                    } else if (e.response.data.error === "Failed to update subscription") {
                        setEmailError('Houve um erro ao adicionar o usuário. Tente novamente mais tarde.')

                    }

                    setLoadingSave(false)

                })


            setLoadingSave(false)
        }

        setLoadingSave(false)

    }


    const checkSubscription = () => {


        if (token.dateLimit || (!token.active && token.errorStatus)) router.push('/accountSetup?status=Assinatura')


    }




    return (
        <div>
            <Title title={'Adicionar usuário'} backButton='/usersManagement' />

            {loadingPage ? <SpinnerLG /> : (
                <div className={`pagesContent-sm`} id="pageTop">

                    <NewUserAlertModal
                        paymentData={paymentData}
                        handleSave={() => handleSave(token.company_id)}
                        firstName={firstName}
                        lastName={lastName}
                        email={email}
                        userStatus={userStatus}
                    />

                    {/* ── Informações do usuário ── */}
                    <div className={styles.sectionLabel}>Informações do usuário</div>
                    <div className={styles.formSection}>
                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel} htmlFor="firstName">Nome *</label>
                                    <input
                                        type="text"
                                        className={styles.fieldInput}
                                        id="firstName"
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        placeholder="Ex: João"
                                    />
                                    {firstNameError && <span className={styles.fieldError}>{firstNameError}</span>}
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel} htmlFor="lastName">Sobrenome <span style={{ opacity: 0.5 }}>(opcional)</span></label>
                                    <input
                                        type="text"
                                        className={styles.fieldInput}
                                        id="lastName"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        placeholder="Ex: Silva"
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel} htmlFor="email">E-mail *</label>
                                    <input
                                        type="text"
                                        className={styles.fieldInput}
                                        id="email"
                                        value={email}
                                        onChange={e => setEmail(maskEmail(e.target.value))}
                                        placeholder="Ex: joao@empresa.com"
                                    />
                                    {emailError && <span className={styles.fieldError}>{emailError}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Categoria ── */}
                    <div className={styles.sectionLabel}>Nível de acesso *</div>
                    <div className={styles.roleSection}>
                        {userStatusError && <div className={styles.roleErrorMsg}>{userStatusError}</div>}
                        <div className={styles.roleGrid}>

                            {/* Administrador */}
                            <div
                                className={`${styles.roleCard} ${userStatus === 'admGlobal' ? styles.roleCardSelected : ''}`}
                                onClick={() => setUserStatus('admGlobal')}
                            >
                                {userStatus === 'admGlobal' && (
                                    <span className={styles.selectedChip}><FontAwesomeIcon icon={faCheck} /></span>
                                )}
                                <div className={`${styles.roleIconWrap} ${userStatus === 'admGlobal' ? styles.roleIconSelected : ''}`}>
                                    <FontAwesomeIcon icon={faUserGear} />
                                </div>
                                <h5 className={`${styles.roleTitle} ${userStatus === 'admGlobal' ? styles.roleTitleSelected : ''}`}>
                                    Administrador
                                </h5>
                                <p className={styles.roleSubtitle}>Acesso total ao sistema</p>
                                <div className={styles.permList}>
                                    <div className={styles.permItem}>
                                        <FontAwesomeIcon icon={faCheck} className={styles.permCheck} />
                                        Configuração da imobiliária
                                    </div>
                                    <div className={styles.permItem}>
                                        <FontAwesomeIcon icon={faCheck} className={styles.permCheck} />
                                        Gerenciar usuários
                                    </div>
                                    <div className={styles.permItem}>
                                        <FontAwesomeIcon icon={faCheck} className={styles.permCheck} />
                                        Cadastro e avaliação de imóveis
                                    </div>
                                    <div className={styles.permItem}>
                                        <FontAwesomeIcon icon={faCheck} className={styles.permCheck} />
                                        Configurações da plataforma
                                    </div>
                                </div>
                            </div>

                            {/* Corretor */}
                            <div
                                className={`${styles.roleCard} ${userStatus === 'user' ? styles.roleCardSelected : ''}`}
                                onClick={() => setUserStatus('user')}
                            >
                                {userStatus === 'user' && (
                                    <span className={styles.selectedChip}><FontAwesomeIcon icon={faCheck} /></span>

                                )}
                                <div className={`${styles.roleIconWrap} ${userStatus === 'user' ? styles.roleIconSelected : ''}`}>
                                    <FontAwesomeIcon icon={faUserTie} />
                                </div>
                                <h5 className={`${styles.roleTitle} ${userStatus === 'user' ? styles.roleTitleSelected : ''}`}>
                                    Corretor
                                </h5>
                                <p className={styles.roleSubtitle}>Focado em imóveis</p>
                                <div className={styles.permList}>
                                    <div className={styles.permItem}>
                                        <FontAwesomeIcon icon={faCheck} className={styles.permCheck} />
                                        Cadastro e avaliação de imóveis
                                    </div>
                                    <div className={`${styles.permItem} ${styles.permItemDim}`}>
                                        <FontAwesomeIcon icon={faXmark} className={styles.permCross} />
                                        Sem acesso a configurações
                                    </div>
                                    <div className={`${styles.permItem} ${styles.permItemDim}`}>
                                        <FontAwesomeIcon icon={faXmark} className={styles.permCross} />
                                        Sem gerenciamento de usuários
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <FixedTopicsBottom>
                        <div className={styles.footerBar}>
                            <Link href="/usersManagement" className={styles.btnCancel}>
                                Cancelar
                            </Link>
                            {loadingSave ? (
                                <button className={styles.btnSave} disabled>
                                    <SpinnerSM />
                                </button>
                            ) : (
                                <button
                                    className={styles.btnSave}
                                    disabled={handleDisableSave()}
                                    data-bs-toggle={subscriptionOn ? "modal" : ""}
                                    data-bs-target={subscriptionOn ? "#newUserAlertModal" : ""}
                                    onClick={() => checkSubscription()}
                                >
                                    Cadastrar usuário
                                </button>
                            )}
                        </div>
                    </FixedTopicsBottom>

                </div>
            )}
        </div>
    )
}