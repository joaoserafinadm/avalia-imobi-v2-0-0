import { useDispatch, useSelector } from "react-redux"
import Title from "../../src/components/title/Title2"
import { useEffect, useState } from "react"
import { FixedTopicsBottom } from "../../src/components/fixedTopics"
import Link from "next/link"
import { SpinnerLG, SpinnerSM } from "../../src/components/loading/Spinners"
import {
    initialValues, setAndar, setAreaTotal, setAreaTotalPrivativa, setBairro,
    setBanheiros, setCelular, setCep, setCidade, setClientLastName, setClientName,
    setComments, setComprimento, setEmail, setFeatures, setFrente, setFundos,
    setLargura, setLateralDireita, setLateralEsquerda, setLatitude, setLogradouro,
    setLongitude, setNumero, setPavimentos, setPropertyType, setQuartos, setSacadas,
    setSalas, setSuites, setTerrenoIrregular, setUf, setVagasGaragem
} from "../../store/NewClientForm/NewClientForm.actions"
import TypeApartamento from "../../src/pages/newClient/TypeApartamento"
import GeralFeatures from "../../src/pages/newClient/GeralFeatures"
import UploadFiles from "../../src/pages/newClient/UploadFiles"
import Location from "../../src/pages/newClient/Location"
import PropertyTypeCard from "../../src/addClient/PropertyTypeCard"
import navbarHide from "../../utils/navbarHide"
import { createImageUrl } from "../../utils/createImageUrl"
import { useRouter } from "next/router"
import baseUrl from "../../utils/baseUrl"
import axios from "axios"
import Cookies from "js-cookie"
import jwt from "jsonwebtoken"
import { addAlert } from "../../store/Alerts/Alerts.actions"
import TypeCasa from "../../src/pages/newClient/TypeCasa"
import TypeComercial from "../../src/pages/newClient/TypeComercial"
import TypeTerreno from "../../src/pages/newClient/TypeTerreno"
import TitleLabel from "../../src/components/TitleLabel"
import Input from "../../src/components/Input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faMobileScreen } from "@fortawesome/free-solid-svg-icons"
import styles from "./clientEdit.module.scss"

export default function clientEdit() {

    const token = jwt.decode(Cookies.get("auth"))

    const alertsArray = useSelector(state => state.alerts)
    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()

    const router = useRouter()
    const client_id = router.query._id

    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)
    const [files, setFiles] = useState([])

    useEffect(() => {
        const backdrop = document.querySelectorAll('.modal-backdrop.show')
        const body = document.querySelector('.modal-open')
        if (backdrop && body) {
            event.preventDefault()
            for (let i = 0; i < backdrop.length; i++) {
                backdrop[i].remove()
                body.style.overflow = ''
            }
        }
        navbarHide(dispatch)
    }, [])

    useEffect(() => {
        dispatch(initialValues())
        if (client_id) dataFunction(token.company_id)
    }, [client_id])

    const dataFunction = async (company_id) => {
        await axios.get(`${baseUrl()}/api/clientEdit`, {
            params: { company_id, client_id }
        }).then(res => {
            const client = res.data
            dispatch(setClientName(client.clientName))
            dispatch(setClientLastName(client.clientLastName))
            dispatch(setEmail(client.email))
            dispatch(setCelular(client.celular))
            dispatch(setPropertyType(client.propertyType))
            dispatch(setAreaTotal(+client.areaTotal))
            dispatch(setAreaTotalPrivativa(+client.areaTotalPrivativa))
            dispatch(setAndar(client.andar))
            dispatch(setBanheiros(client.banheiros))
            dispatch(setQuartos(client.quartos))
            dispatch(setSacadas(client.sacadas))
            dispatch(setSuites(client.suites))
            dispatch(setVagasGaragem(client.vagasGaragem))
            dispatch(setPavimentos(client.pavimentos))
            dispatch(setSalas(client.salas))
            dispatch(setTerrenoIrregular(client.terrenoIrregular))
            dispatch(setLargura(client.largura))
            dispatch(setComprimento(client.comprimento))
            dispatch(setFrente(client.frente))
            dispatch(setFundos(client.fundos))
            dispatch(setLateralEsquerda(client.lateralEsquerda))
            dispatch(setLateralDireita(client.lateralDireita))
            dispatch(setCep(client.cep))
            dispatch(setCidade(client.cidade))
            dispatch(setUf(client.uf))
            dispatch(setLogradouro(client.logradouro))
            dispatch(setNumero(client.numero))
            dispatch(setBairro(client.bairro))
            dispatch(setLatitude(client.latitude))
            dispatch(setLongitude(client.longitude))
            dispatch(setFeatures(client.features))
            setFiles(client.files)
            dispatch(setComments(client.comments))
            setLoadingPage(false)
        }).catch(e => {
            setLoadingPage(false)
            console.log(e)
        })
    }

    const maskTelefone = (value) => {
        return dispatch(setCelular(value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
            .replace(/(-\d{4})\d+?$/, '$1'))
        )
    }

    const handleSave = async (form) => {
        setLoadingSave(true)
        const newFiles = files.filter(elem => !elem.url)
        const filesUrl = newFiles.length > 0 ? await createImageUrl(newFiles, 'CLIENT_FILES') : []
        const filesArray = files.filter(elem => elem.url).concat(filesUrl)
        const data = {
            ...form,
            company_id: token.company_id,
            client_id,
            user_id: token.sub,
            files: filesArray
        }
        await axios.patch(`${baseUrl()}/api/clientEdit`, data)
            .then(res => {
                setLoadingSave(false)
                const alert = {
                    type: 'alert',
                    message: `Cliente ${newClientForm.clientName} atualizado com sucesso!`,
                    link: res.data
                }
                dispatch(addAlert(alertsArray, [alert]))
                router.push('/clientsManagement')
            }).catch(() => { setLoadingSave(false) })
    }

    if (loadingPage) return <SpinnerLG />

    return (
        <div id="pageTop">
            <Title title="Editar cliente" backButton="/clientsManagement" subtitle="Atualize os dados do cliente e do imóvel" />

            <div className={`pagesContent ${styles.page}`}>

                {/* ── Dados do cliente ── */}
                <TitleLabel>Dados do cliente</TitleLabel>
                <div className={styles.section}>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <Input
                                type="text"
                                label="Nome"
                                required
                                value={newClientForm.clientName}
                                onChange={e => dispatch(setClientName(e.target.value))}
                                placeholder="Ex: João"
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <Input
                                type="text"
                                label="Sobrenome"
                                hint="opcional"
                                value={newClientForm.clientLastName}
                                onChange={e => dispatch(setClientLastName(e.target.value))}
                                placeholder="Ex: Silva"
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <Input
                                type="text"
                                label="Celular"
                                required
                                icon={faMobileScreen}
                                value={newClientForm.celular}
                                onChange={e => maskTelefone(e.target.value)}
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <Input
                                type="text"
                                label="E-mail"
                                hint="opcional"
                                icon={faEnvelope}
                                value={newClientForm.email}
                                onChange={e => dispatch(setEmail(e.target.value))}
                                placeholder="Ex: joao@email.com"
                            />
                        </div>
                    </div>
                    <p className={styles.required}>* Campos obrigatórios</p>
                </div>

                {/* ── Tipo de imóvel ── */}
                <TitleLabel>Tipo de imóvel</TitleLabel>
                <div className={styles.section}>
                    <div className={styles.typeGrid}>
                        <PropertyTypeCard type="Apartamento" edit />
                        <PropertyTypeCard type="Casa" edit />
                        <PropertyTypeCard type="Comercial" edit />
                        <PropertyTypeCard type="Terreno" edit />
                    </div>
                </div>

                {newClientForm.propertyType === "Apartamento" && (
                    <>
                        <TypeApartamento />
                        <GeralFeatures type="Apartamento" />
                        <Location />
                        <UploadFiles setFiles={array => setFiles(array)} files={files} />
                    </>
                )}
                {newClientForm.propertyType === "Casa" && (
                    <>
                        <TypeCasa />
                        <GeralFeatures type="Casa" />
                        <Location />
                        <UploadFiles setFiles={array => setFiles(array)} files={files} />
                    </>
                )}
                {newClientForm.propertyType === "Comercial" && (
                    <>
                        <TypeComercial />
                        <GeralFeatures type="Comercial" />
                        <Location />
                        <UploadFiles setFiles={array => setFiles(array)} files={files} />
                    </>
                )}
                {newClientForm.propertyType === "Terreno" && (
                    <>
                        <TypeTerreno edit />
                        <GeralFeatures type="Terreno" />
                        <Location />
                        <UploadFiles setFiles={array => setFiles(array)} files={files} />
                    </>
                )}

                <FixedTopicsBottom>
                    <div className={styles.footerBar}>
                        <div className={styles.footerActions}>
                            <Link href="/clientsManagement" className={styles.btnCancel}>
                                Cancelar
                            </Link>
                            {loadingSave ? (
                                <button className={styles.btnSave} disabled><SpinnerSM /></button>
                            ) : (
                                <button
                                    className={styles.btnSave}
                                    disabled={!newClientForm.clientName || !newClientForm.propertyType}
                                    onClick={() => handleSave(newClientForm)}
                                >
                                    Salvar alterações
                                </button>
                            )}
                        </div>
                    </div>
                </FixedTopicsBottom>
            </div>
        </div>
    )
}
