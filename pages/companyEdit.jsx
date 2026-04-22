import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react"
import baseUrl from '../utils/baseUrl'
import Title from "../src/components/title/Title2";
import Link from "next/link";
import { useDispatch } from "react-redux";
import navbarHide from "../utils/navbarHide";
import { SpinnerLG, SpinnerSM } from "../src/components/loading/Spinners";
import scrollTo from "../utils/scrollTo";
import EstadosList from "../src/components/estadosList";
import { useRouter } from "next/router";
import { createImageUrl } from "../utils/createImageUrl";
import ImageHeaderModal from "../src/companyEdit/ImageHeaderModal";
import { FixedTopicsBottom } from "../src/components/fixedTopics";
import removeInputError from "../utils/removeInputError";
import CropperImageModal from "../src/companyEdit/CropperImageModal";
import { modalClose } from "../utils/modalControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBuilding, faLocationDot, faPhone, faMobileScreen,
    faEnvelope, faHashtag, faRoad, faCity,
    faPen, faCloudArrowUp, faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Input from "../src/components/Input";
import TitleLabel from "../src/components/TitleLabel";
import styles from "./companyEdit.module.scss";



export default function companyEdit() {

    const token = jwt.decode(Cookies.get("auth"));
    const dispatch = useDispatch()
    const router = useRouter()

    const [companyName, setCompanyName] = useState('')
    const [companyCreci, setCompanyCreci] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [celular, setCelular] = useState('')
    const [cep, setCep] = useState('')
    const [logradouro, setLogradouro] = useState('')
    const [numero, setNumero] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')
    const [backgroundImg_id, setBackgroundImg_id] = useState('')
    const [logo, setLogo] = useState('')
    const [logoPreview, setLogoPreview] = useState('')
    const [backgroundImages, setBackgroundImages] = useState([])
    const [selectFile, setSelectFile] = useState(null)
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)

    useEffect(() => {
        modalClose()
        dataFunction(token.company_id)
        navbarHide(dispatch)
    }, [])

    const dataFunction = async (company_id) => {
        await axios.get(`${baseUrl()}/api/companyEdit`, {
            params: { company_id }
        }).then(res => {
            const data = res.data.response
            setCompanyName(data.companyName)
            setCompanyCreci(data.companyCreci)
            setEmail(data.email)
            setTelefone(data.telefone)
            setCelular(data.celular)
            setCep(data.cep)
            setLogradouro(data.logradouro)
            setNumero(data.numero)
            setCidade(data.cidade)
            setEstado(data.estado)
            setBackgroundImg_id(data.backgroundImg_id)
            setLogo(data.logo)
            backgroundImagesData(company_id)
        }).catch(e => console.log(e))
    }

    const backgroundImagesData = async (company_id) => {
        await axios.get(`${baseUrl()}/api/companyEdit/headerImg`, {
            params: { company_id }
        }).then(res => {
            setBackgroundImages(res.data.data)
            setLoadingPage(false)
        })
    }

    const maskCep = (value) => setCep(value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1'))

    const maskTelefone = (value) => setTelefone(value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
        .replace(/(-\d{4})\d+?$/, '$1'))

    const maskCelular = (value) => setCelular(value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
        .replace(/(-\d{4})\d+?$/, '$1'))

    const onBlurCep = (event) => {
        const { value } = event.target
        const cepClean = value?.replace(/[^0-9]/g, '')
        if (cepClean?.length !== 8) return
        axios.get(`https://viacep.com.br/ws/${value}/json/`).then(res => {
            setLogradouro(res.data.logradouro)
            setCidade(res.data.localidade)
            setEstado(res.data.uf)
        })
    }

    const validate = () => {
        removeInputError()
        if (!companyName || !cidade || !celular || !email) {
            if (!companyName) document.getElementById("companyNameItem").classList.add('inputError')
            if (!celular) document.getElementById("celularItem").classList.add('inputError')
            if (!cidade) document.getElementById("cidadeItem").classList.add('inputError')
            if (!email) document.getElementById("emailItem").classList.add('inputError')
            scrollTo('pageTop')
            return false
        }
        return true
    }

    const handleSave = async (company_id) => {
        setLoadingSave(true)
        const blobFile = await fetch(logoPreview).then(r => r.blob())
        const newLogo = logoPreview ? await createImageUrl([blobFile], "AVALIAIMOBI_LOGO_IMG") : ''
        const isValid = validate()
        if (isValid) {
            await axios.post(`${baseUrl()}/api/companyEdit`, {
                token, company_id, user_id: token.sub,
                companyName, companyCreci, telefone, celular, email,
                cep, logradouro, numero, cidade, estado,
                logo: newLogo ? newLogo[0].url : logo,
                backgroundImg_id,
            }).then(() => {
                localStorage.setItem('auth', Cookies.get('auth'))
                router.push('/')
                setLoadingSave(false)
            }).catch(() => setLoadingSave(false))
        } else {
            setLoadingSave(false)
        }
    }

    const handleHeaderIgmPreview = (_id) => {
        const found = backgroundImages.find(elem => elem._id === _id)
        return found?.imageUrl
    }

    const handleFileChange = file => {
        if (!file) return
        setSelectFile(URL.createObjectURL(file))
        setTimeout(() => {
            var modal = document.getElementById('cropperImageModal')
            var cropperModal = new bootstrap.Modal(modal)
            cropperModal.show()
        }, 20)
    }

    const currentHeaderSrc = backgroundImg_id ? handleHeaderIgmPreview(backgroundImg_id) : null;

    return (
        <div id="pageTop">
            <Title title={'Editar Imobiliária'} backButton='/' />

            {loadingPage ? <SpinnerLG /> : (
                <>
                    <CropperImageModal
                        selectFile={selectFile}
                        setResult={value => setLogoPreview(value)}
                    />
                    <ImageHeaderModal
                        backgroundImages={backgroundImages}
                        backgroundImg_id={backgroundImg_id}
                        setBackgroundImg_id={value => setBackgroundImg_id(value)}
                        backgroundImagesData={() => backgroundImagesData(token.company_id)}
                    />

                    <div className={`pagesContent ${styles.page}`}>

                        {/* ── Imagens (Logo + Capa) ── */}
                        <div className={styles.imageRow}>

                            {/* Logo */}
                            <div className={styles.imageCard}>
                                <div className={styles.imageCardHeader}>
                                    <p className={styles.imageCardTitle}>Logo</p>
                                    <label htmlFor="logoFileInput" className={styles.imageCardEditBtn}>
                                        <FontAwesomeIcon icon={faPen} />
                                        Editar
                                    </label>
                                </div>
                                <p className={styles.imageCardSubtitle}>
                                    Usada no cartão de visitas e apresentações.
                                </p>
                                <label htmlFor="logoFileInput" className={styles.logoZone}>
                                    <input
                                        type="file"
                                        id="logoFileInput"
                                        accept="image/*"
                                        onChange={e => handleFileChange(e.target.files[0])}
                                    />
                                    {(logoPreview || logo) ? (
                                        <img src={logoPreview || logo} alt="Logo" className={styles.logoImg} />
                                    ) : (
                                        <div className={styles.logoPlaceholder}>
                                            <span><FontAwesomeIcon icon={faCloudArrowUp} /></span>
                                            Clique ou arraste a imagem
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Capa */}
                            <div className={styles.imageCard}>
                                <div className={styles.imageCardHeader}>
                                    <p className={styles.imageCardTitle}>Imagem de capa</p>
                                    <button
                                        className={styles.imageCardEditBtn}
                                        data-bs-toggle="modal"
                                        data-bs-target="#ImageHeaderModal"
                                        type="button"
                                    >
                                        <FontAwesomeIcon icon={faPen} />
                                        Editar
                                    </button>
                                </div>
                                <p className={styles.imageCardSubtitle}>
                                    Usada no cartão de visitas e apresentações.
                                </p>
                                <div
                                    className={styles.headerZone}
                                    data-bs-toggle="modal"
                                    data-bs-target="#ImageHeaderModal"
                                >
                                    {currentHeaderSrc ? (
                                        <img src={currentHeaderSrc} alt="Capa" className={styles.headerImg} />
                                    ) : (
                                        <div className={styles.headerPlaceholder}>
                                            <span><FontAwesomeIcon icon={faCloudArrowUp} /></span>
                                            Selecionar imagem
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── Imobiliária ── */}
                        <TitleLabel>Imobiliária</TitleLabel>
                        <div className={styles.section}>
                            <div className="row g-3">
                                <div className="col-12 col-md-8">
                                    <Input
                                        type="text"
                                        label="Nome da Imobiliária"
                                        required
                                        id="companyNameItem"
                                        icon={faBuilding}
                                        value={companyName}
                                        onChange={e => setCompanyName(e.target.value)}
                                        placeholder="Ex: Imobiliária Horizonte"
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <Input
                                        type="text"
                                        label="CRECI"
                                        id="companyCreciItem"
                                        icon={faHashtag}
                                        value={companyCreci}
                                        onChange={e => setCompanyCreci(e.target.value)}
                                        placeholder="Ex: 12345-J"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Endereço ── */}
                        <TitleLabel>Endereço</TitleLabel>
                        <div className={styles.section}>
                            <div className="row g-3">
                                <div className="col-12 col-md-4">
                                    <Input
                                        type="text"
                                        label="CEP"
                                        id="cepItem"
                                        icon={faLocationDot}
                                        value={cep}
                                        onChange={e => maskCep(e.target.value)}
                                        onBlur={e => onBlurCep(e)}
                                        placeholder="00000-000"
                                        hint="Preenchimento automático"
                                    />
                                </div>
                                <div className="col-12 col-md-8">
                                    <Input
                                        type="text"
                                        label="Logradouro"
                                        id="logradouroItem"
                                        icon={faRoad}
                                        value={logradouro}
                                        onChange={e => setLogradouro(e.target.value)}
                                        placeholder="Ex: Rua das Flores"
                                    />
                                </div>
                                <div className="col-12 col-md-3">
                                    <Input
                                        type="text"
                                        label="Número"
                                        id="numeroItem"
                                        icon={faHashtag}
                                        value={numero}
                                        onChange={e => setNumero(e.target.value)}
                                        placeholder="Ex: 123"
                                    />
                                </div>
                                <div className="col-12 col-md-7">
                                    <Input
                                        type="text"
                                        label="Cidade"
                                        required
                                        id="cidadeItem"
                                        icon={faCity}
                                        value={cidade}
                                        onChange={e => setCidade(e.target.value)}
                                        placeholder="Ex: São Paulo"
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <div className={styles.selectWrap}>
                                        <label className={styles.selectLabel}>UF</label>
                                        <select
                                            className={styles.nativeSelect}
                                            id="estadoItem"
                                            value={estado}
                                            onChange={e => setEstado(e.target.value)}
                                        >
                                            <EstadosList />
                                        </select>
                                        <span className={styles.selectArrow}>
                                            <FontAwesomeIcon icon={faChevronDown} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Contatos ── */}
                        <TitleLabel>Contatos</TitleLabel>
                        <div className={styles.section}>
                            <div className="row g-3">
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
                                <div className="col-12">
                                    <Input
                                        type="email"
                                        label="E-mail"
                                        required
                                        id="emailItem"
                                        icon={faEnvelope}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Ex: contato@imobiliaria.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <p className={styles.required}>* Campos obrigatórios</p>

                        {/* ── Footer ── */}
                        <FixedTopicsBottom>
                            <div className={styles.footerBar}>
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
                        </FixedTopicsBottom>
                    </div>

                </>
            )}
        </div>
    )
}
