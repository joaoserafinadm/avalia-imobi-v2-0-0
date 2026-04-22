import { useEffect } from "react";
import Title from "../src/components/title/Title2";
import navbarHide from "../utils/navbarHide.js";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useState } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { SpinnerLG, SpinnerSM } from "../src/components/loading/Spinners";
import CropperImageModal from "../src/companyEdit/CropperImageModal";
import CardsCarouselModal from "../src/editProfile/CardsCarouselModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faIdCard, faUser, faEnvelope, faPhone, faMobileScreen,
    faAddressCard, faCameraRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FixedTopicsBottom, FixedTopicsTop } from "../src/components/fixedTopics";
import scrollTo from "../utils/scrollTo";
import removeInputError from "../utils/removeInputError";
import { createImageUrl } from "../utils/createImageUrl";
import { useRouter } from "next/router";
import { closeModal, modalClose } from "../utils/modalControl.js";
import Input from "../src/components/Input";
import TitleLabel from "../src/components/TitleLabel";
import styles from "./editProfile.module.scss";



export default function EditProfile() {

    const token = jwt.decode(Cookies.get('auth'))
    const dispatch = useDispatch()
    const router = useRouter()

    //States
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [Email, setEmail] = useState('')
    const [workEmail, setWorkEmail] = useState('')
    const [celular, setCelular] = useState('')
    const [telefone, setTelefone] = useState('')
    const [creci, setCreci] = useState('')
    const [profileImageUrl, setProfileImageUrl] = useState('')
    const [profileImageUrlReview, setProfileImageUrlReview] = useState('')
    const [headerImg, setHeaderImg] = useState('')
    const [logo, setLogo] = useState('')
    const [logradouro, setLogradouro] = useState('')
    const [numero, setNumero] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')

    //Image crop
    const [selectFile, setSelectFile] = useState(null)


    //Loading 
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)

    useEffect(() => {
        modalClose()

        navbarHide(dispatch)
        dataFunction(token.company_id, token.sub)

    }, [])

    const dataFunction = async (company_id, user_id) => {

        await axios.get(`${baseUrl()}/api/editProfile`, {
            params: {
                company_id: company_id,
                user_id: user_id
            }
        }).then(res => {
            setLoadingPage(false)
            console.log(res)

            setFirstName(res.data.firstName)
            setLastName(res.data.lastName)
            setEmail(res.data.email)
            setWorkEmail(res.data.workEmail)
            setTelefone(res.data.telefone)
            setCelular(res.data.celular)
            setCreci(res.data.creci)
            setProfileImageUrl(res.data.profileImageUrl)
            setHeaderImg(res.data.headerImg)
            setLogo(res.data.logo)
            setLogradouro(res.data.logradouro)
            setNumero(res.data.numero)
            setCidade(res.data.cidade)
            setEstado(res.data.estado)
        })
    }


    const maskTelefone = (value) => {
        return setTelefone(value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
            .replace(/(-\d{4})\d+?$/, '$1'))
    }

    const maskCelular = (value) => {
        return setCelular(value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
            .replace(/(-\d{4})\d+?$/, '$1'))
    }

    const handleFileChange = file => {

        console.log("file", file)


        if (file) {
            setSelectFile(URL.createObjectURL(file))
            setTimeout(() => {
                var modal = document.getElementById('cropperImageModal')
                var cropperModal = new bootstrap.Modal(modal)
                cropperModal.show()
            }, 20)
        } else {
            return
        }
    }


    const validate = () => {

        removeInputError()

        if (!workEmail || !firstName || !lastName || !celular || !creci) {
            // if (!profileImageUrl) document.getElementById("profileImageUrlItem").classList.add('inputError')
            if (!workEmail) document.getElementById("secondaEmailItem").classList.add('inputError')
            if (!firstName) document.getElementById("firstNameItem").classList.add('inputError')
            if (!lastName) document.getElementById("lastNameItem").classList.add('inputError')
            if (!celular) document.getElementById("celularItem").classList.add('inputError')
            if (!creci) document.getElementById("creciItem").classList.add('inputError')
            scrollTo('pageTop')
            return false
        }
        else return true
    }

    const handleSave = async (company_id) => {

        setLoadingSave(true)

        const isValid = validate()

        if (isValid) {

            const blobFile = await fetch(profileImageUrlReview).then(r => r.blob());

            const newLogo = profileImageUrlReview ? await createImageUrl([blobFile], "AVALIAIMOBI_USERS") : ''

            await axios.patch(`${baseUrl()}/api/editProfile`, {
                token: token,
                company_id,
                user_id: token.sub,
                profileImageUrl: newLogo ? newLogo[0].url : profileImageUrl,
                firstName,
                lastName,
                workEmail,
                creci,
                telefone,
                celular
            }).then(res => {
                localStorage.setItem('auth', (Cookies.get('auth')))
                router.push('/')
                setLoadingSave(false)

            }).catch(e => {
                setLoadingSave(false)

            })

        } else {
            setLoadingSave(false)

        }

    }


    const avatarSrc = profileImageUrlReview || profileImageUrl
        || 'https://res.cloudinary.com/dywdcjj76/image/upload/v1695257785/PUBLIC/companyLogoTemplate_xoeyar.png';

    const cardProps = {
        firstName, lastName, creci,
        email: workEmail, celular, telefone,
        profileImageUrl: avatarSrc,
        headerImg, logo, logradouro, numero, cidade, estado,
    };

    return (
        <div id="pageTop">
            <Title title={'Meu perfil'} backButton='/' subtitle="Mantenha sempre suas informações atualizadas" />

            {loadingPage ? <SpinnerLG /> : (
                <>
                    <CropperImageModal selectFile={selectFile} setResult={value => setProfileImageUrlReview(value)} aspect={1 / 1} />

                    {/* Modal de cartão (mobile) */}
                    <CardsCarouselModal {...cardProps} />

                    <div className={`pagesContent ${styles.page}`}>

                        {/* ── Avatar ── */}
                        <div className={styles.avatarSection}>
                            <input
                                type="file"
                                accept="image/*"
                                id="logoItem"
                                className={styles.fileHidden}
                                onChange={e => handleFileChange(e.target.files[0])}
                            />
                            <label htmlFor="logoItem" className={styles.avatarWrap}>
                                <img src={avatarSrc} alt="Foto de perfil" className={styles.avatarImg} />
                                <span className={styles.avatarOverlay}>
                                    <FontAwesomeIcon icon={faCameraRotate} />
                                </span>
                            </label>

                            <div className={styles.avatarInfo}>
                                <p className={styles.avatarName}>
                                    {firstName} {lastName}
                                </p>
                                <p className={styles.avatarEmail}>{Email}</p>
                                <label htmlFor="logoItem" className={styles.avatarEditBtn}>
                                    <FontAwesomeIcon icon={faCameraRotate} />
                                    Alterar foto
                                </label>
                            </div>

                        </div>
                        

                        {/* ── Identificação ── */}
                        <TitleLabel>Identificação</TitleLabel>
                        <div className={styles.section}>
                            <div className="row g-3">
                                <div className="col-12 col-md-4">
                                    <Input
                                        type="text"
                                        label="Nome"
                                        required
                                        id="firstNameItem"
                                        icon={faUser}
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        placeholder="Ex: João"
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <Input
                                        type="text"
                                        label="Sobrenome"
                                        required
                                        id="lastNameItem"
                                        icon={faUser}
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        placeholder="Ex: Silva"
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <Input
                                        type="text"
                                        label="CRECI"
                                        required
                                        id="creciItem"
                                        icon={faAddressCard}
                                        value={creci}
                                        onChange={e => setCreci(e.target.value)}
                                        placeholder="Ex: 123456-F"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Contato ── */}
                        <TitleLabel>Contato</TitleLabel>
                        <div className={styles.section}>
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <Input
                                        type="email"
                                        label="E-mail de cadastro"
                                        id="workEmailItem"
                                        icon={faEnvelope}
                                        value={Email}
                                        disabled
                                        hint="Este e-mail não pode ser alterado"
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <Input
                                        type="email"
                                        label="E-mail de trabalho"
                                        required
                                        id="secondaEmailItem"
                                        icon={faEnvelope}
                                        value={workEmail}
                                        onChange={e => setWorkEmail(e.target.value)}
                                        placeholder="Ex: joao@imobiliaria.com"
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <Input
                                        type="text"
                                        label="Telefone"
                                        id="telefoneItem"
                                        icon={faPhone}
                                        value={telefone}
                                        onChange={e => maskTelefone(e.target.value)}
                                        placeholder="(00) 0000-0000"
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <Input
                                        type="text"
                                        label="Celular"
                                        required
                                        id="celularItem"
                                        icon={faMobileScreen}
                                        value={celular}
                                        onChange={e => maskCelular(e.target.value)}
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="col-12 d-flex justify-content-end">

                            <button
                                className={`${styles.btnCard} mb-3`}
                                data-bs-toggle="modal"
                                data-bs-target="#CardsCarouselModal"
                                type="button"
                            >
                                <FontAwesomeIcon icon={faIdCard} />
                                Ver cartão
                            </button>
                        </div>
                        <FixedTopicsBottom>
                            <div className={styles.footerBar}>


                                <div className={styles.footerActions}>
                                    <Link href="/" className={styles.btnCancel}>
                                        Cancelar
                                    </Link>
                                    {loadingSave ? (
                                        <button className={styles.btnSave} disabled>
                                            <SpinnerSM />
                                        </button>
                                    ) : (
                                        <button
                                            className={styles.btnSave}
                                            onClick={() => handleSave(token.company_id)}
                                        >
                                            Salvar alterações
                                        </button>
                                    )}
                                </div>
                            </div>
                        </FixedTopicsBottom>
                    </div>

                    {/* ── Footer ── */}

                </>
            )}
        </div>
    )
}