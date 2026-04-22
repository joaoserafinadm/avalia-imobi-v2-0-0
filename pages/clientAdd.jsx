import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Title from "../src/components/title/Title2"
import { FixedTopicsBottom } from "../src/components/fixedTopics"
import Link from "next/link"
import { SpinnerSM } from "../src/components/loading/Spinners"
import { initialValues, setCelular, setClientLastName, setClientName, setEmail } from "../store/NewClientForm/NewClientForm.actions"
import TypeApartamento from "../src/pages/newClient/TypeApartamento"
import GeralFeatures from "../src/pages/newClient/GeralFeatures"
import UploadFiles from "../src/pages/newClient/UploadFiles"
import Location from "../src/pages/newClient/Location"
import PropertyTypeCard from "../src/addClient/PropertyTypeCard"
import navbarHide from "../utils/navbarHide"
import { createImageUrl } from "../utils/createImageUrl"
import { useRouter } from "next/router"
import baseUrl from "../utils/baseUrl"
import axios from "axios"
import Cookies from "js-cookie"
import jwt from "jsonwebtoken"
import { addAlert } from "../store/Alerts/Alerts.actions"
import TypeCasa from "../src/pages/newClient/TypeCasa"
import TypeComercial from "../src/pages/newClient/TypeComercial"
import TypeTerreno from "../src/pages/newClient/TypeTerreno"
import TitleLabel from "../src/components/TitleLabel"
import Input from "../src/components/Input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faMobileScreen } from "@fortawesome/free-solid-svg-icons"
import styles from "./clientAdd.module.scss"

export default function clientAdd() {

    const token = jwt.decode(Cookies.get("auth"))

    const alertsArray = useSelector(state => state.alerts)
    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()
    const router = useRouter()

    const [manualRegister, setManualRegister] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)
    const [files, setFiles] = useState([])

    useEffect(() => {
        dispatch(initialValues())
        navbarHide(dispatch)
    }, [])

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
        const filesUrl = files.length > 0 ? await createImageUrl(files, 'CLIENT_FILES') : []
        const data = { ...form, user_id: token.sub, files: filesUrl }
        await axios.post(`${baseUrl()}/api/clientAdd`, data)
            .then(res => {
                setLoadingSave(false)
                const alert = {
                    type: 'alert',
                    message: `Cliente ${newClientForm.clientName} adicionado com sucesso!`,
                    link: res.data
                }
                dispatch(addAlert(alertsArray, [alert]))
                router.push(`/valuation/${res.data.id}`)
            }).catch(() => { setLoadingSave(false) })
    }

    const handleSaveLink = async () => {
        setLoadingSave(true)
        const data = {
            company_id: token.company_id,
            user_id: token.sub,
            clientName: newClientForm.clientName,
            clientLastName: newClientForm.clientLastName,
            celular: newClientForm.celular,
            propertyType: newClientForm.propertyType
        }
        await axios.post(`${baseUrl()}/api/addClient`, data).then(res => {
            const alert = {
                type: 'addUserLink',
                message: `Cliente ${newClientForm.clientName} adicionado com sucesso! Compartilhar o formulário?`,
                link: res.data
            }
            dispatch(addAlert(alertsArray, [alert]))
            setLoadingSave(false)
            router.push('/clientsManagement')
        })
    }

    return (
        <div id="pageTop">
            <Title title="Cadastrar imóvel" backButton="/clientsManagement" subtitle="Preencha os dados do cliente e do imóvel" />

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
                        {manualRegister && (
                            <>
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
                            </>
                        )}
                    </div>
                    <p className={styles.required}>* Campos obrigatórios</p>
                </div>

                {/* ── Tipo de imóvel ── */}
                {manualRegister && (
                    <>
                        <TitleLabel>Tipo de imóvel</TitleLabel>
                        <div className={styles.section}>
                            <div className={styles.typeGrid}>
                                <PropertyTypeCard type="Apartamento" />
                                <PropertyTypeCard type="Casa" />
                                <PropertyTypeCard type="Comercial" />
                                <PropertyTypeCard type="Terreno" />
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
                                <TypeTerreno />
                                <GeralFeatures type="Terreno" />
                                <Location />
                                <UploadFiles setFiles={array => setFiles(array)} files={files} />
                            </>
                        )}
                    </>
                )}

                <FixedTopicsBottom>
                    <div className={styles.footerBar}>
                        <div className={styles.footerActions}>
                            {!manualRegister && (
                                <button className={styles.btnCancel} onClick={() => setManualRegister(true)}>
                                    Cadastro manual
                                </button>
                            )}
                            <Link href="/clientsManagement" className={styles.btnCancel}>
                                Cancelar
                            </Link>
                            {loadingSave ? (
                                <button className={styles.btnSave} disabled><SpinnerSM /></button>
                            ) : manualRegister ? (
                                <button
                                    className={styles.btnSave}
                                    disabled={!newClientForm.clientName || !newClientForm.propertyType}
                                    onClick={() => handleSave(newClientForm)}
                                >
                                    Salvar
                                </button>
                            ) : (
                                <button
                                    className={styles.btnSave}
                                    disabled={!newClientForm.clientName}
                                    onClick={() => handleSaveLink()}
                                >
                                    Salvar
                                </button>
                            )}
                        </div>
                    </div>
                </FixedTopicsBottom>
            </div>
        </div>
    )
}
