import { useDispatch, useSelector } from "react-redux"
import Title from "../src/components/title/Title2"
import { useEffect, useState } from "react"
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
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { addAlert } from "../store/Alerts/Alerts.actions"
import TypeCasa from "../src/pages/newClient/TypeCasa"
import TypeComercial from "../src/pages/newClient/TypeComercial"
import TypeTerreno from "../src/pages/newClient/TypeTerreno"



export default function clientAdd() {

    const token = jwt.decode(Cookies.get("auth"));



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

        // const filesUrl = []
        const filesUrl = files.length > 0 ? await createImageUrl(files, 'CLIENT_FILES') : []

        const data = {
            ...form,
            user_id: token.sub,
            files: filesUrl
        }


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
            }).catch(e => {
                setLoadingSave(false)
            })

    }


    const handleSaveLink = async (company_id) => {

        setLoadingSave(true)

        const isValid = true

        if (isValid) {

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
                    message: `Cliente ${newClientForm.clientName} adicionado com sucesso! Compartilhar o formulário?`,
                    link: res.data
                }

                dispatch(addAlert(alertsArray, [alert]))


                setLoadingSave(false)

                router.push('/clientsManagement')

            })


        }

    }



    return (
        <div >
            <Title title={'Cadastrar imóvel'} backButton />
            <div className="pagesContent shadow fadeItem" id="pageTop">
                <div className="row d-flex  mt-3">
                    <div className="col-12">

                        <label for="geralForm" className="form-label fw-bold">Informações de Cadastro</label>
                    </div>


                    <div className="col-6 my-2 ">

                        <label for="geralForm" className="form-label">Nome do cliente <b>*</b></label>
                        <input
                            type="text"
                            className="form-control"
                            name="clientNameItem"
                            id="clientNameItem"
                            value={newClientForm.clientName}
                            onChange={e => dispatch(setClientName(e.target.value))} />
                    </div>
                    <div className="col-6 my-2 ">

                        <label for="geralForm" className="form-label">Sobrenome <small className="small">(opcional)</small></label>
                        <input
                            type="text"
                            className="form-control"
                            name="clientLastNameItem"
                            id="clientLastNameItem"
                            value={newClientForm.clientLastName}
                            onChange={e => dispatch(setClientLastName(e.target.value))} />
                    </div>
                    {manualRegister && (
                        <>
                            <div className="col-6 my-2 fadeItem">

                                <label for="geralForm" className="form-label">Celular <b>*</b></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="celularItem"
                                    id="celularItem"
                                    value={newClientForm.celular}
                                    onChange={e => maskTelefone(e.target.value)} />
                            </div>
                            <div className="col-6 my-2 fadeItem">

                                <label for="geralForm" className="form-label">E-mail <small className="small">(opcional)</small></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="emailItem"
                                    id="emailItem"
                                    value={newClientForm.email}
                                    onChange={e => dispatch(setEmail(e.target.value))} />
                            </div>

                        </>
                    )}

                    <span className="small mt-3">*Campos obrigatórios</span>


                    {manualRegister && (
                        <>
                            <div className="col-12 fadeItem mt-3 pb-5">

                                <label for="geralForm" className="form-label fw-bold">Informações do Imóvel</label>

                                <div className="col-12  my-2">
                                    <label for="clientNameItem" className="form-label ">Selecione o tipo de imóvel:</label>

                                    <div className="row">


                                        <div className="my-2 col-xxl-3 col-6 d-flex justify-content-center">
                                            <PropertyTypeCard type="Apartamento" />
                                        </div>
                                        <div className="my-2 col-xxl-3 col-6 d-flex justify-content-center">
                                            <PropertyTypeCard type="Casa" />
                                        </div>
                                        <div className="my-2 col-xxl-3 col-6 d-flex justify-content-center">
                                            <PropertyTypeCard type="Comercial" />
                                        </div>
                                        <div className="my-2 col-xxl-3 col-6 d-flex justify-content-center">
                                            <PropertyTypeCard type="Terreno" />
                                        </div>
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



                            </div >


                        </>
                    )}

                </div>



                <hr />
                <FixedTopicsBottom >

                    <div className="row">
                        <div className="col-12 d-flex justify-content-end align-items-center">
                            <Link href="/clientsManagement">
                                <button className="btn btn-sm btn-secondary">Cancelar</button>
                            </Link>




                            {manualRegister ?
                                <></>
                                // <button className="btn btn-sm btn-secondary ms-2 fadeItem" onClick={() => setManualRegister(false)}>Cadastro simplificado</button>
                                :
                                <button className="btn btn-sm btn-secondary ms-2 fadeItem" onClick={() => setManualRegister(true)}>Cadastro manual</button>

                            }
                            {loadingSave ?
                                <button className="ms-2 btn btn-sm btn-orange px-5" disabled><SpinnerSM /></button>
                                :
                                <>
                                    {manualRegister ?
                                        <button className="ms-2 btn btn-sm btn-orange fadeItem" disabled={!newClientForm.clientName || !newClientForm.propertyType} onClick={() => handleSave(newClientForm)}>Salvar</button>
                                        :
                                        <button className="ms-2 btn btn-sm btn-orange fadeItem" disabled={!newClientForm.clientName} onClick={() => handleSaveLink(token.company_id)}>Salvar</button>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </FixedTopicsBottom>
            </div>
        </div>
    )
}