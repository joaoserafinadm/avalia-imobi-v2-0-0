import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react"
import baseUrl from '../utils/baseUrl'
import Title from "../src/components/title/Title2";
import window2Mobile from "../utils/window2Mobile";
import VerticalLine from "../utils/VerticalLine";
import Link from "next/link";
import { useDispatch } from "react-redux";
import navbarHide from "../utils/navbarHide";
import { SpinnerLG, SpinnerSM } from "../src/components/loading/Spinners";
import scrollTo from "../utils/scrollTo";
import EstadosList from "../src/components/estadosList";
import { useRouter } from "next/router";
import StyledDropzone from "../src/components/styledDropzone/StyledDropzone";
import { createImageUrl } from "../utils/createImageUrl";
import ImageHeaderModal from "../src/companyEdit/ImageHeaderModal";
import { FixedTopicsBottom } from "../src/components/fixedTopics";
import removeInputError from "../utils/removeInputError";
import CropperImageModal from "../src/companyEdit/CropperImageModal";
import { closeModal, modalClose } from "../utils/modalControl";



export default function companyEdit() {

    const token = jwt.decode(Cookies.get("auth"));

    const dispatch = useDispatch()
    const router = useRouter()


    //States
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
    const [headerImgPreview, setHeaderImgPreview] = useState('')
    const [backgroundImages, setBackgroundImages] = useState([])

    //Image crop
    const [selectFile, setSelectFile] = useState(null)

    //Loading
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)

    useEffect(() => {
        modalClose()


        dataFunction(token.company_id)
        navbarHide(dispatch)

    }, [])

    const dataFunction = async (company_id) => {

        await axios.get(`${baseUrl()}/api/companyEdit`, {
            params: {
                company_id: company_id
            }
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

        }).catch(e => {
            console.log(e)
        })
    }

    const backgroundImagesData = async (company_id) => {

        await axios.get(`${baseUrl()}/api/companyEdit/headerImg`, {
            params: {
                company_id: company_id
            }
        }).then(res => {

            setBackgroundImages(res.data.data)
            setLoadingPage(false)


        })

    }

    const maskCep = (value) => {
        return setCep(value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1'))
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

    const onBlurCep = (event) => {

        const { value } = event.target

        const cep = value?.replace(/[^0-9]/g, '');

        if (cep?.length !== 8) {
            return;
        }

        axios.get(`https://viacep.com.br/ws/${value}/json/`)
            .then(res => {

                const data = res.data

                setLogradouro(data.logradouro)
                setCidade(data.localidade)
                setEstado(data.uf)
            })
    }

    const validate = () => {

        removeInputError()

        if (!companyName  || !cidade || !celular || !email) {
            if (!companyName) document.getElementById("companyNameItem").classList.add('inputError')
            if (!celular) document.getElementById("celularItem").classList.add('inputError')
            if (!cidade) document.getElementById("cidadeItem").classList.add('inputError')
            if (!email) document.getElementById("emailItem").classList.add('inputError')
            scrollTo('pageTop')
            return false
        }
        else return true

    }

    const handleSave = async (company_id) => {

        setLoadingSave(true)

        const blobFile = await fetch(logoPreview).then(r => r.blob());


        const newLogo = logoPreview ? await createImageUrl([blobFile], "AVALIAIMOBI_LOGO_IMG") : ''
        // const newHeaderImg = headerImgPreview ? await createImageUrl([headerImgPreview], "AVALIAIMOBI_HEADER_IMG") : ''

        const isValid = validate()

        if (isValid) {

            const data = {
                token,
                company_id,
                user_id: token.sub,
                companyName,
                companyCreci,
                telefone,
                celular,
                email,
                cep,
                logradouro,
                numero,
                cidade,
                estado,
                logo: newLogo ? newLogo[0].url : logo,
                backgroundImg_id: backgroundImg_id
            }

            await axios.post(`${baseUrl()}/api/companyEdit`, data)
                .then(res => {
                    localStorage.setItem('auth', (Cookies.get('auth')))
                    router.push('/')
                    setLoadingSave(false)

                }).catch(e => {
                    setLoadingSave(false)

                })

        } else {
            setLoadingSave(false)
            return
        }
    }

    const handleHeaderIgmPreview = (_id) => {

        const image_id = backgroundImages.find(elem => elem._id === _id)

        return (image_id.imageUrl)

    }

    const handleFileChange = file => {


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



    return (
        <div >
            <Title title={'Editar Imobiliária'} backButton='/' />
            {loadingPage ?
                <SpinnerLG />
                :
                <>

                    <CropperImageModal selectFile={selectFile} setResult={value => setLogoPreview(value)} />


                    <ImageHeaderModal backgroundImages={backgroundImages} backgroundImg_id={backgroundImg_id} setBackgroundImg_id={value => setBackgroundImg_id(value)} backgroundImagesData={() => backgroundImagesData(token.company_id)} />

                    <div className="pagesContent shadow fadeItem" id="pageTop">
                        <div className="row d-flex justify-content-center">
                            <div className="col-12 col-sm-5 d-flex">
                                <div className="col-12">
                                    <div className="row">

                                        <div className="d-flex justify-content-between">
                                            <input type="file" name="image/*" id="logoItem" accept="image/*" onChange={e => setLogoPreview(e.target.files[0])}
                                                className="form-input" hidden />
                                            <label className=" fw-bold">Logo</label>
                                            <label htmlFor="logoItem" className="span" type='button'>Editar</label>
                                        </div>
                                        <StyledDropzone setFiles={array => { handleFileChange(array[0]) }} img>
                                            <div className="row mt-3 d-flex justify-content-center align-items-center" style={{ height: '150px' }}>

                                                <div className="col-12 d-flex justify-content-center align-items-center" >
                                                    {logoPreview ?
                                                        <img src={logoPreview} alt="logo" id="logoItem" className="logoEdit fadeItem" />
                                                        :
                                                        <>
                                                            {logo ?
                                                                <img src={logo} alt="logo" id="logoItem" className="logoEdit fadeItem" />
                                                                :
                                                                <img src="https://res.cloudinary.com/joaoserafinadm/image/upload/v1695257785/PUBLIC/companyLogoTemplate_xoeyar.png"
                                                                    alt="" className="logoEdit"
                                                                    type="button" />
                                                            }
                                                        </>
                                                    }

                                                </div>
                                            </div>
                                        </StyledDropzone>
                                    </div>
                                    <hr />
                                    <div className="row">


                                        <div className="d-flex justify-content-between">
                                            <span className=" fw-bold" data-bs-toggle="modal" data-bs-target="#ImageHeaderModal">Imagem de capa</span>
                                            <span className="span" type='button' data-bs-toggle="modal" data-bs-target="#ImageHeaderModal">Editar</span>
                                        </div>

                                        <div className="row mt-3 d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                            <div className="col-12 d-flex justify-content-center" >
                                                {backgroundImg_id ?
                                                    <img className="headerImgEdit fadeItem" type="button"
                                                        src={handleHeaderIgmPreview(backgroundImg_id)} alt="header image" id="headerImgItem"
                                                        data-bs-toggle="modal" data-bs-target="#ImageHeaderModal" />
                                                    :
                                                    <img src="https://res.cloudinary.com/joaoserafinadm/image/upload/v1695601556/PUBLIC/3_weeijf.png"
                                                        alt="" className="headerImgEdit fadeItem"
                                                        type="button" data-bs-toggle="modal" data-bs-target="#ImageHeaderModal" />
                                                }
                                            </div>

                                        </div>






                                    </div>
                                </div>
                            </div>
                            {window2Mobile() && (
                                <VerticalLine />
                            )}
                            <div className="col-12 col-sm-6 d-flex">
                                <div className="col-12">
                                    {!window2Mobile() && (<hr />)}
                                    <div className="row">
                                        <label for="companyNameItem" className="form-label fw-bold">Imobiliária</label>
                                        <div className="col-12 col-lg-8 my-2">
                                            <input type="text" className="form-control form-control-sm" id="companyNameItem" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Nome da Imobiliária *" />
                                        </div>
                                        <div className="col-12 col-lg-4 my-2">
                                            <input type="text" className="form-control form-control-sm" id="companyCreciItem" value={companyCreci} onChange={e => setCompanyCreci(e.target.value)} placeholder="Creci" />
                                        </div>
                                    </div>
                                    {!window2Mobile() && (<hr />)}

                                    <div className="row mt-3">
                                        <label for="cepItem" className="form-label fw-bold">Endereço</label>
                                        <div className="col-12 col-lg-4 my-2">
                                            <input type="text" className="form-control form-control-sm" id="cepItem" value={cep} onChange={e => maskCep(e.target.value)} onBlur={e => onBlurCep(e)} placeholder="CEP" />
                                        </div>
                                        <div className="col-12 col-lg-8 my-2">
                                            <input type="text" className="form-control form-control-sm" id="logradouroItem" value={logradouro} onChange={e => setLogradouro(e.target.value)} placeholder="Logradouro" />
                                        </div>
                                        <div className="col-12 col-lg-4 my-2">
                                            <input type="text" className="form-control form-control-sm" id="numeroItem" value={numero} onChange={e => setNumero(e.target.value)} placeholder="Número" />
                                        </div>
                                        <div className="col-12 col-lg-6 my-2">
                                            <input type="text" className="form-control form-control-sm" id="cidadeItem" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Cidade *" />
                                        </div>
                                        <div className="col-12 col-lg-2 my-2">
                                            <select className="form-select form-select-sm" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                                                <EstadosList />
                                            </select>
                                            {/* <input type="text" className="form-control form-control-sm" id="estadoItem" value={estado} onChange={e => setEstado(e.target.value)} placeholder="Estado *" /> */}
                                        </div>
                                    </div>
                                    {!window2Mobile() && (<hr />)}

                                    <div className="row mt-3">
                                        <label for="telefoneItem" className="form-label fw-bold">Contatos</label>
                                        <div className="col-12 col-lg-6 my-2">
                                            <input type="text" className="form-control form-control-sm" id="telefoneItem" value={telefone} onChange={e => maskTelefone(e.target.value)} placeholder="Telefone" />
                                        </div>
                                        <div className="col-12 col-lg-6 my-2">
                                            <input type="text" className="form-control form-control-sm" id="celularItem" value={celular} onChange={e => maskCelular(e.target.value)} placeholder="Celular *" />
                                        </div>
                                        <div className="col-12 col-lg-12 my-2">
                                            <input type="text" className="form-control form-control-sm" id="emailItem" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail *" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <FixedTopicsBottom >

                            <div className="row">
                                <div className="col-12 d-flex justify-content-end">
                                    <Link href="/">
                                        <button className="btn btn-sm btn-secondary">Cancelar</button>
                                    </Link>
                                    {loadingSave ?
                                        <button className="ms-2 btn btn-sm btn-orange px-4" disabled><SpinnerSM /></button>
                                        :
                                        <button className="ms-2 btn btn-sm btn-orange" onClick={() => handleSave(token.company_id)}>Salvar</button>
                                    }
                                </div>
                            </div>
                        </FixedTopicsBottom>
                    </div>
                </>

            }

        </div>

    )
}