import { useEffect, useState } from "react";
import Title from "../src/components/title/Title2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserGear, faUserTie, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FixedTopicsBottom } from "../src/components/fixedTopics";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { SpinnerLG } from "../src/components/loading/Spinners"
import { useDispatch, useSelector } from "react-redux";
import navbarHide from "../utils/navbarHide";
import scrollTo from "../utils/scrollTo";
import randomPassword from "../utils/randomPassword";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { addAlert } from "../store/Alerts/Alerts.actions";
import { useRouter } from "next/router";
import NewUserAlertModal from "../src/userAdd/newUserAlertModal";
import { maskEmail } from "../utils/mask";
import styles from "./userAdd.module.scss";
import TitleLabel from "../src/components/TitleLabel";
import Button from "../src/components/Button";
import Input from "../src/components/Input";



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

        let firstNameError = ''
        let emailError = ''
        let userStatusError = ''

        if (!firstName) firstNameError = 'Escreva o nome do usuário'
        if (!email || !email.includes('@')) emailError = "E-mail inválido"
        if (!userStatus) userStatusError = "Escolha uma das opções"

        setFirstNameError(firstNameError)
        setEmailError(emailError)
        setUserStatusError(userStatusError)

        if (firstNameError || emailError || userStatusError) {
            scrollTo('pageTop')
            return false
        }

        return true
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
                    <TitleLabel>Informações do usuário</TitleLabel>
                    <div className={styles.formSection}>
                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <Input
                                    type="text"
                                    label="Nome"
                                    required
                                    id="firstName"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    placeholder="Ex: João"
                                    error={firstNameError}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <Input
                                    type="text"
                                    label="Sobrenome"
                                    hint="opcional"
                                    id="lastName"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    placeholder="Ex: Silva"
                                />
                            </div>
                            <div className="col-12">
                                <Input
                                    type="email"
                                    label="E-mail"
                                    required
                                    id="email"
                                    value={email}
                                    onChange={e => setEmail(maskEmail(e.target.value))}
                                    placeholder="Ex: joao@empresa.com"
                                    error={emailError}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Categoria ── */}
                    <TitleLabel>Nível de acesso *</TitleLabel>
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
                            <Link href="/usersManagement" >
                                <Button variant="secondary">

                                    Cancelar
                                </Button>
                            </Link>
                            <Button
                                variant="primary"
                                loading={loadingSave}
                                disabled={handleDisableSave()}
                                data-bs-toggle={subscriptionOn ? "modal" : ""}
                                data-bs-target={subscriptionOn ? "#newUserAlertModal" : ""}
                                onClick={() => checkSubscription()}
                            >
                                Cadastrar usuário
                            </Button>
                        </div>
                    </FixedTopicsBottom>

                </div>
            )}
        </div>
    )
}