import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { SpinnerSM } from "../components/loading/Spinners"
import {
    initialValues, setPropertyLink, setPropertyName, setPropertyPrice, setPropertyType,
    setAreaTotal, setAreaTotalPrivativa, setQuartos, setSuites, setBanheiros, setSacadas,
    setAndar, setVagasGaragem, setPavimentos, setSalas, setBairro, setCidade, setUf, setLogradouro
} from "../../store/NewClientForm/NewClientForm.actions"
import TypeApartamento from "../pages/newClient/TypeApartamento"
import TypeCasa from "../pages/newClient/TypeCasa"
import TypeComercial from "../pages/newClient/TypeComercial"
import TypeTerrenoValuation from "../pages/valuation/TypeTerrenoValuation"
import LocationValuation from "./LocationValuation"
import navbarHide from "../../utils/navbarHide"
import { createImageUrl } from "../../utils/createImageUrl"
import baseUrl from "../../utils/baseUrl"
import axios from "axios"
import { maskMoney } from "../../utils/mask"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt, faUpload, faLink, faTag } from "@fortawesome/free-solid-svg-icons"
import Modal, { ModalBtnPrimary, ModalBtnSecondary } from "../components/Modal"
import { useRouter } from "next/router"
import styles from "./PropertyAdd.module.scss"

export default function PropertyAddModal(props) {

    const { loadingAdd, setLoadingAdd } = props
    const closeRef = useRef(null)

    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()
    const router = useRouter()

    const [imageUrl, setImageUrl] = useState('')
    const [linkError, setLinkError] = useState('')
    const [loadingImage, setLoadingImage] = useState(false)
    const [manualImageFile, setManualImageFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [formErrors, setFormErrors] = useState({})

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
        setFormErrors({})
    }

    const handleManualImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp']
        if (!validTypes.includes(file.type)) return
        if (file.size > 5 * 1024 * 1024) return
        const localPreviewUrl = URL.createObjectURL(file)
        setPreviewUrl(localPreviewUrl)
        setManualImageFile(file)
        setImageUrl('')
        setLinkError('')
    }

    const handleRemoveManualImage = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl('')
        setManualImageFile(null)
        setImageUrl('')
        const fileInput = document.getElementById('manualImageUpload')
        if (fileInput) fileInput.value = ''
    }

    const handlePropertyAdd = async (property) => {
        const next = {}
        if (!property.propertyPrice) next.propertyPrice = "O valor do imóvel é obrigatório."
        if (!property.areaTotal) next.areaTotal = "A área total é obrigatória."
        if (Object.keys(next).length > 0) { setFormErrors(next); return; }
        setFormErrors({})

        setLoadingAdd(true)
        const newPropertyArray = props.propertyArray
        let finalImageUrl = imageUrl

        if (manualImageFile) {
            try {
                const fileUrl = await createImageUrl([manualImageFile], 'CLIENT_FILES')
                finalImageUrl = fileUrl[0].url
            } catch (error) {
                console.error('Erro ao fazer upload da imagem:', error)
                return
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
        closeRef.current?.click()
    }

    const handleGetInfo = async (e) => {
        if (!newClientForm.propertyLink) return
        setLinkError('')
        setLoadingImage(true)
        setImageUrl('')
        e.preventDefault()

        try {
            const res = await axios.get(`${baseUrl()}/api/valuation/extractPropertyInfo`, {
                params: { url: newClientForm.propertyLink },
            })
            const data = res.data
            if (data.propertyName) dispatch(setPropertyName(data.propertyName))
            if (data.propertyPrice) dispatch(setPropertyPrice(maskMoney(data.propertyPrice)))
            if (data.areaTotal) dispatch(setAreaTotal(data.areaTotal))
            if (data.areaTotalPrivativa) dispatch(setAreaTotalPrivativa(data.areaTotalPrivativa))
            if (data.quartos) dispatch(setQuartos(data.quartos))
            if (data.suites) dispatch(setSuites(data.suites))
            if (data.banheiros) dispatch(setBanheiros(data.banheiros))
            if (data.sacadas) dispatch(setSacadas(data.sacadas))
            if (data.andar) dispatch(setAndar(data.andar))
            if (data.vagasGaragem) dispatch(setVagasGaragem(data.vagasGaragem))
            if (data.pavimentos) dispatch(setPavimentos(data.pavimentos))
            if (data.salas) dispatch(setSalas(data.salas))
            if (data.bairro) dispatch(setBairro(data.bairro))
            if (data.cidade) dispatch(setCidade(data.cidade))
            if (data.uf) dispatch(setUf(data.uf))
            if (data.logradouro) dispatch(setLogradouro(data.logradouro))
            if (data.imageUrl) {
                setImageUrl(data.imageUrl)
            } else if (!data.propertyName) {
                setLinkError('Não foi possível obter as informações. Preencha manualmente.')
            }
        } catch {
            setLinkError('Não foi possível obter as informações. Preencha manualmente.')
        }

        setLoadingImage(false)
    }

    const footer = (
        <div style={{ display: 'flex', gap: '8px' }}>
            <button ref={closeRef} type="button" data-bs-dismiss="modal" style={{ display: 'none' }} />
            <ModalBtnSecondary dismiss onClick={clearValues}>Cancelar</ModalBtnSecondary>
            <ModalBtnPrimary dismiss={false} onClick={() => handlePropertyAdd(newClientForm)}>
                {loadingAdd ? <SpinnerSM /> : 'Salvar imóvel'}
            </ModalBtnPrimary>
        </div>
    )

    return (
        <Modal
            id="propertyAddModal"
            title="Adicionar imóvel"
            icon={faTag}
            size="lg"
            footer={footer}
            onClose={clearValues}
        >
            <span className={styles.requiredNote}>* Campos obrigatórios</span>

            <div className="row">
                {/* ── Basic info ── */}
                <div className="col-12 col-lg-8">

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            <FontAwesomeIcon icon={faLink} style={{ fontSize: '0.65rem' }} />
                            Link do imóvel
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="https://..."
                            onBlur={handleGetInfo}
                            value={newClientForm.propertyLink}
                            onChange={e => dispatch(setPropertyLink(e.target.value))} />
                        {linkError && <span className={styles.errorText}>{linkError}</span>}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            Nome do imóvel
                            {loadingImage && <span className={styles.loadingInline}><SpinnerSM /></span>}
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Ex.: Apartamento 3 quartos centro"
                            value={newClientForm.propertyName}
                            onChange={e => dispatch(setPropertyName(e.target.value))} />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Valor do imóvel *</label>
                        <div className={styles.priceGroup}>
                            <span className={styles.pricePrefix}>R$</span>
                            <input
                                type="text"
                                className={`${styles.priceInput}${formErrors.propertyPrice ? ' ' + styles.inputError : ''}`}
                                placeholder="0"
                                value={newClientForm.propertyPrice}
                                onChange={e => {
                                    dispatch(setPropertyPrice(maskMoney(e.target.value)))
                                    setFormErrors(p => ({ ...p, propertyPrice: undefined }))
                                }} />
                            <span className={styles.priceSuffix}>,00</span>
                        </div>
                        {formErrors.propertyPrice && <span className={styles.errorText}>{formErrors.propertyPrice}</span>}
                    </div>
                </div>

                {/* ── Image ── */}
                <div className="col-12 col-lg-4">
                    {!imageUrl && !previewUrl ? (
                        <div className={styles.imagePlaceholder}>
                            {loadingImage
                                ? <SpinnerSM />
                                : <span className={styles.imagePlaceholderText}>Imóvel sem imagem</span>
                            }
                            {!loadingImage && (
                                <label htmlFor="manualImageUpload" className={styles.uploadBtn}>
                                    <FontAwesomeIcon icon={faUpload} />
                                    Adicionar imagem
                                    <input
                                        type="file"
                                        id="manualImageUpload"
                                        accept="image/*"
                                        onChange={handleManualImageUpload}
                                        style={{ display: 'none' }} />
                                </label>
                            )}
                        </div>
                    ) : (
                        <div className={styles.imagePreview}>
                            <img src={previewUrl || imageUrl} alt="" className={styles.previewImg} />
                            <button type="button" className={styles.removeBtn} onClick={handleRemoveManualImage} title="Remover imagem">
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                            {manualImageFile && (
                                <span className={styles.previewName}>{manualImageFile.name}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Area error ── */}
            {formErrors.areaTotal && (
                <div className={styles.errorText} style={{ marginBottom: '0.75rem' }}>{formErrors.areaTotal}</div>
            )}

            {/* ── Property type sub-form (Bootstrap styled, kept as-is) ── */}
            <div data-bs-theme="dark">
                {newClientForm.propertyType === "Apartamento" && (
                    <>
                        <TypeApartamento propertyAndar />
                        <LocationValuation />
                    </>
                )}
                {newClientForm.propertyType === "Casa" && (
                    <>
                        <TypeCasa />
                        <LocationValuation />
                    </>
                )}
                {newClientForm.propertyType === "Comercial" && (
                    <>
                        <TypeComercial />
                        <LocationValuation />
                    </>
                )}
                {newClientForm.propertyType === "Terreno" && (
                    <>
                        <TypeTerrenoValuation />
                        <LocationValuation />
                    </>
                )}
            </div>
        </Modal>
    )
}
