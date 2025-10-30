import { useDispatch, useSelector } from "react-redux"
import Title from "../components/title/Title2"
import { useEffect, useState } from "react"
import { FixedTopicsBottom } from "../components/fixedTopics"
import Link from "next/link"
import { SpinnerSM } from "../components/loading/Spinners"
import { initialValues, setCelular, setClientLastName, setClientName, setEmail, setPropertyLink, setPropertyName, setPropertyPrice, setPropertyType } from "../../store/NewClientForm/NewClientForm.actions"
import TypeApartamento from "../pages/newClient/TypeApartamento"
import GeralFeatures from "../pages/newClient/GeralFeatures"
import UploadFiles from "../pages/newClient/UploadFiles"
import Location from "../pages/newClient/Location"
import PropertyTypeCard from "../addClient/PropertyTypeCard"
import navbarHide from "../../utils/navbarHide"
import { createImageUrl } from "../../utils/createImageUrl"
import { useRouter } from "next/router"
import baseUrl from "../../utils/baseUrl"
import axios from "axios"
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { addAlert } from "../../store/Alerts/Alerts.actions"
import TypeCasa from "../pages/newClient/TypeCasa"
import TypeComercial from "../pages/newClient/TypeComercial"
import TypeTerreno from "../pages/newClient/TypeTerreno"
import UploadFilesValuation from "./UploadFilesValuation"
import Info from "../components/info"
import { maskMoney } from "../../utils/mask"
import htmlInfo from "../../utils/htmlInfo"
import LocationValuation from "./LocationValuation"
import TypeTerrenoValuation from "../pages/valuation/TypeTerrenoValuation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt, faUpload } from "@fortawesome/free-solid-svg-icons"

export default function PropertyAddModal(props) {

    const { loadingAdd, setLoadingAdd } = props


    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()

    const router = useRouter()

    const [imageUrl, setImageUrl] = useState('')
    const [linkError, setLinkError] = useState('')
    const [loadingImage, setLoadingImage] = useState(false)
    const [manualImageFile, setManualImageFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')








    useEffect(() => {
        dispatch(initialValues())
        dispatch(setPropertyType(props.client.propertyType))

        navbarHide(dispatch)
    }, [])

    const clearValues = () => {
        dispatch(initialValues())
        dispatch(setPropertyType(props.client.propertyType))
        setImageUrl('')
        setLinkError('')
        setLoadingImage(false)
        setManualImageFile(null)
        setPreviewUrl('')
    }


    const handleManualImageUpload = (e) => {
        const file = e.target.files[0]

        if (!file) return

        // Validar tipo de arquivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp']
        if (!validTypes.includes(file.type)) {
            // dispatch(addAlert({ type: 'danger', message: 'Por favor, selecione uma imagem válida (JPEG, PNG, GIF, BMP ou WEBP)' }))
            return
        }

        // Validar tamanho (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            // dispatch(addAlert({ type: 'danger', message: 'A imagem deve ter no máximo 5MB' }))
            return
        }

        // Criar URL de preview local
        const localPreviewUrl = URL.createObjectURL(file)
        setPreviewUrl(localPreviewUrl)
        setManualImageFile(file)
        setImageUrl('') // Limpar imageUrl da busca automática se existir
        setLinkError('')
    }

    const handleRemoveManualImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl) // Liberar memória
        }
        setPreviewUrl('')
        setManualImageFile(null)
        setImageUrl('')
        // Limpar o input file
        const fileInput = document.getElementById('manualImageUpload')
        if (fileInput) fileInput.value = ''
    }


    const handlePropertyAdd = async (property) => {

        setLoadingAdd(true)
        const newPropertyArray = props.propertyArray

        // Fazer upload da imagem manual se existir
        let finalImageUrl = imageUrl // Usar imageUrl da busca automática por padrão

        if (manualImageFile) {
            try {
                const fileUrl = await createImageUrl([manualImageFile], 'CLIENT_FILES')
                finalImageUrl = fileUrl[0].url
            } catch (error) {
                console.error('Erro ao fazer upload da imagem:', error)
                // dispatch(addAlert({ type: 'danger', message: 'Erro ao fazer upload da imagem. Tente novamente.' }))
                return // Não salvar se falhar o upload
            }
        }

        const data = {
            propertyName: property.propertyName,
            propertyPrice: property.propertyPrice,
            propertyType: property.propertyType,
            propertyLink: property.propertyLink,
            imageUrl: finalImageUrl,
            areaTotal: property.areaTotal,
            areaTotalPrivativa: property.areaTotalPrivativa,
            quartos: property.quartos,
            suites: property.suites,
            banheiros: property.banheiros,
            sacadas: property.sacadas,
            andar: property.andar,
            vagasGaragem: property.vagasGaragem,
            terrenoIrregular: property.terrenoIrregular,
            largura: property.largura,
            comprimento: property.comprimento,
            frente: property.frente,
            fundos: property.fundos,
            lateralEsquerda: property.lateralEsquerda,
            lateralDireita: property.lateralDireita,
            pavimentos: property.pavimentos,
            salas: property.salas,
            cidade: property.cidade,
            uf: property.uf,
            logradouro: property.logradouro,
            bairro: property.bairro,
            latitude: property.latitude,
            longitude: property.longitude,
            dateAdded: new Date()
        }

        newPropertyArray.push(data)

        props.setPropertyArray(newPropertyArray)
        props.setForceUpdate()
        dispatch(initialValues())

        clearValues()

        setLoadingAdd(false)

    }


    const handleGetInfo = async (e) => {

        if (!newClientForm.propertyLink) return
        setLinkError('');
        setLoadingImage(true);
        setImageUrl('');

        e.preventDefault();

        const res = await axios.get(`${baseUrl()}/api/valuation/htmlInfo`, {
            params: {
                url: newClientForm.propertyLink,
            },
        }).then(res => {
            console.log('res', res)
            if (!res?.data?.image && !res?.data?.title) {
                setLinkError('Não foi possivel obter o nome e a imagem do imóvel. Por favor, adicione manualmente.');
                setLoadingImage(false);
            }
            dispatch(setPropertyName(res.data.title));

            // Verificar se o URL da imagem termina com uma extensão válida
            const validImageExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'];
            const imageUrl = res.data.image.toLowerCase();
            const isValidImage = validImageExtensions.some(extension => imageUrl.endsWith(extension));

            if (!isValidImage) {
                setImageUrl('');

            } else {
                setImageUrl(res.data.image);

            }

            dispatch(setPropertyName(res.data.title));

            setLoadingImage(false)
        }).catch(e => {
            setLinkError('Não foi possivel obter o nome e a imagem do imóvel. Por favor, adicione manualmente.');
            setLoadingImage(false)
        });




        setLoadingImage(false);
    };




    return (
        <div class="modal fade" id="propertyAddModal" tabindex="-1" aria-labelledby="Modal" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title title-dark bold">Adicionar imóvel</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row mt-3">
                            <label for="geralForm" className="form-label fw-bold">Informações de Cadastro</label>
                            <span className="small mt-3">*Campos obrigatórios</span>

                            <div className="col-12 col-lg-8">



                                <div className="col-12 fadeItem">
                                    <div className="row">

                                        <div className="col-12 my-2  pe-1">
                                            <div className="d-flex align-items-bottom">

                                                <label for="propertyLinkItem" className="form-label">Link do Imóvel<b>*</b></label>
                                                <Info className='ms-1' id='linkImagesInfo'
                                                    content='Ao inserir o link, o sistema irá buscar pela descrição e imagem do imóvel.' />
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="propertyLinkItem"
                                                id="propertyLinkItem"
                                                // onBlur={e => handleLinkImages(e.target.value)}
                                                onBlur={handleGetInfo}
                                                value={newClientForm.propertyLink}
                                                onChange={e => dispatch(setPropertyLink(e.target.value))} />
                                            <small className="text-danger">{linkError}</small>
                                        </div>

                                        <div className="col-12 my-2  pe-1">
                                            <div className="d-flex align-items-bottom">

                                                <label for="propertyNameItem" className="form-label">Nome do Imóvel<b>*</b></label>
                                                <Info className='ms-1' id='propertyNameInfo'
                                                    content='Insira o nome que consta no anúncio, ou um nome contendo as características gerais do imóvel.' />
                                                {loadingImage && (
                                                    <span className="text-secondary ms-3">
                                                        <SpinnerSM />
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="propertyNameItem"
                                                id="propertyNameItem"
                                                value={newClientForm.propertyName}
                                                onChange={e => dispatch(setPropertyName(e.target.value))} />
                                        </div>


                                        <div className="col-12 my-2  pe-1">

                                            <label for="propertyPriceItem" className="form-label">Valor do Imóvel<b>*</b></label>
                                            <div class="input-group mb-3">
                                                <span className="input-group-text">R$</span>
                                                <input
                                                    type="text"
                                                    className="form-control text-end"
                                                    name="propertyPriceItem"
                                                    id="propertyPriceItem" placeholder="0"
                                                    value={newClientForm.propertyPrice}
                                                    onChange={e => dispatch(setPropertyPrice(maskMoney(e.target.value)))} />
                                                <span className="input-group-text">,00</span>


                                            </div>
                                        </div>


                                    </div>

                                </div>
                            </div>
                            <div className="col-12 col-lg-4 my-2  pe-1 d-flex flex-column justify-content-center align-items-center">
                                {!imageUrl && !previewUrl ?
                                    <div className="fadeItem border rounded-1 d-flex flex-column justify-content-center align-items-center py-5" style={{ width: '80%', minHeight: '200px', border: '1px dashed' }}>
                                        <span className="text-secondary text-center mb-3">
                                            {loadingImage ? <SpinnerSM /> : 'Imóvel sem imagem'}
                                        </span>
                                        {!loadingImage && (
                                            <div className="d-flex flex-column align-items-center">
                                                <label htmlFor="manualImageUpload" className="btn btn-sm btn-outline-secondary">
                                                    <FontAwesomeIcon icon={faUpload} className="me-2" />
                                                    Adicionar Imagem
                                                </label>
                                                <input
                                                    type="file"
                                                    id="manualImageUpload"
                                                    accept="image/*"
                                                    onChange={handleManualImageUpload}
                                                    style={{ display: 'none' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    :
                                    <div className="position-relative" style={{ width: '80%' }}>
                                        <img src={previewUrl || imageUrl} alt="" className="rounded-1 fadeItem w-100" />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                            onClick={handleRemoveManualImage}
                                            title="Remover imagem"
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                        {manualImageFile && (
                                            <small className="text-muted d-block text-center mt-2">
                                                {manualImageFile.name}
                                            </small>
                                        )}
                                    </div>
                                }

                            </div>





                            <div className="col-12 fadeItem mt-3 pb-5">


                                {newClientForm.propertyType === "Apartamento" && (
                                    <>
                                        <TypeApartamento propertyAndar />
                                        <LocationValuation />
                                        {/* <UploadFilesValuation setFiles={array => setFiles(array)} files={files} /> */}
                                    </>
                                )}
                                {newClientForm.propertyType === "Casa" && (
                                    <>
                                        <TypeCasa />
                                        <LocationValuation />
                                        {/* <UploadFilesValuation setFiles={array => setFiles(array)} files={files} /> */}
                                    </>
                                )}
                                {newClientForm.propertyType === "Comercial" && (
                                    <>
                                        <TypeComercial />
                                        <LocationValuation />
                                        {/* <UploadFilesValuation setFiles={array => setFiles(array)} files={files} /> */}
                                    </>
                                )}
                                {newClientForm.propertyType === "Terreno" && (
                                    <>
                                        <TypeTerrenoValuation />
                                        <LocationValuation />
                                        {/* <UploadFilesValuation setFiles={array => setFiles(array)} files={files} /> */}
                                    </>
                                )}



                            </div >



                        </div>



                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn  btn-secondary" data-bs-dismiss="modal" onClick={() => clearValues()}>Cancelar</button>
                        <button type="button" className="btn  btn-orange" data-bs-dismiss="modal" onClick={() => handlePropertyAdd(newClientForm)}>Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}