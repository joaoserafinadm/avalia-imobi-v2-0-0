import { useEffect, useState } from "react";
import Title from "../src/components/title/Title2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserGear, faUserTie } from "@fortawesome/free-solid-svg-icons";
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

    useEffect(() => {
        navbarHide(dispatch)
        dataFunction()
    }, [])

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

        if (token.dateLimit) router.push('/accountSetup?status=Assinatura')

        else {


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

    }


    return (
        <div >
            <Title title={'Adicionar usuário'} backButton='/' />
            {loadingPage ?
                <SpinnerLG />
                :
                <div className="pagesContent shadow fadeItem" id="pageTop">

                    <NewUserAlertModal paymentData={paymentData}
                        handleSave={() => handleSave(token.company_id)}
                        firstName={firstName}
                        lastName={lastName}
                        email={email}
                        userStatus={userStatus} />


                    <div className="row d-flex ">
                        <label for="telefoneItem" className="form-label fw-bold">Informações do usuário</label>
                        <div className="col-12 col-lg-5 my-2">
                            <label for="firstName" className="form-label ">Nome*</label>
                            <input type="text" className="form-control form-control-sm" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="" />
                            <small className="text-danger">{firstNameError}</small>
                        </div>
                        <div className="col-12 col-lg-5 my-2 fadelItem">
                            <label for="lastName" className="form-label ">Sobrenome (opcional)</label>
                            <input type="text" className="form-control form-control-sm" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="" />
                        </div>
                        <div className="col-12 col-lg-10 my-2">
                            <label for="email" className="form-label ">E-mail*</label>
                            <input type="text" className="form-control form-control-sm" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="" />
                            <small className="text-danger">{emailError}</small>
                        </div>
                    </div>


                    <div className="row d-flex mt-3">
                        <label for="telefoneItem" className="form-label fw-bold">Categoria*</label>
                        <small className="text-danger">{userStatusError}</small>

                        <div className="col-12 col-lg-5 my-2">
                            <div className={`card cardAnimation  ${userStatus === 'admGlobal' ? 'border-selected' : ''}`} type="button" onClick={() => setUserStatus('admGlobal')}>
                                <div className="card-body">
                                    <div className="row">


                                        <h5 class="card-title text-orange d-flex align-items-center"> <FontAwesomeIcon icon={faUserGear} className="icon me-2" />Administrador</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">O maestro do sistema</h6>
                                        <div className="col-12 small">
                                            <span>
                                                Administradores têm controle total sobre todas as funcionalidades da plataforma, podendo adicionar, gerenciar usuários e ajustar configurações.

                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-5 my-2">
                            <div className={`card cardAnimation  ${userStatus === 'user' ? 'border-selected' : ''}`} type="button" onClick={() => setUserStatus('user')}>
                                <div className="card-body">
                                    <div className="row">


                                        <h5 class="card-title text-orange d-flex align-items-center"> <FontAwesomeIcon icon={faUserTie} className="icon me-2" />Corretor</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">Especialistas em avaliação</h6>
                                        <div className="col-12 small">
                                            <span>
                                                Corretores focam na criação e gestão de avaliações, contribuindo para a qualidade e confiabilidade do sistema, moldando a reputação dos clientes.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <hr />

                    <FixedTopicsBottom >

                        <div className="row">
                            <div className="col-12 d-flex justify-content-end align-items-center">
                                <Link href="/usersManagement">
                                    <button className="btn btn-sm btn-secondary">Cancelar</button>
                                </Link>

                                {loadingSave ?
                                    <button className="ms-2 btn btn-sm btn-orange px-5" disabled><SpinnerSM /></button>
                                    :
                                    <button className="ms-2 btn btn-sm btn-orange fadeItem" disabled={handleDisableSave()} data-bs-toggle="modal" data-bs-target="#newUserAlertModal">Cadastrar</button>
                                    // <button className="ms-2 btn btn-sm btn-orange fadeItem" disabled={handleDisableSave()} onClick={() => handleSave(token.company_id)}>Cadastrar</button>
                                }
                            </div>
                        </div>
                    </FixedTopicsBottom>
                </div>
            }

        </div>
    )
}