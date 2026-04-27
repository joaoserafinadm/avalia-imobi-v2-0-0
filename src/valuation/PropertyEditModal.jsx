import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { SpinnerSM } from "../components/loading/Spinners"
import {
    initialValues, setPropertyLink, setPropertyName, setPropertyPrice, setPropertyType,
    setAreaTotal, setAreaTotalPrivativa, setQuartos, setSuites, setBanheiros, setSacadas,
    setAndar, setVagasGaragem, setPavimentos, setSalas, setBairro, setCidade, setUf, setLogradouro,
    setLatitude, setLongitude, setTerrenoIrregular, setLargura, setComprimento,
    setFrente, setFundos, setLateralEsquerda, setLateralDireita,
} from "../../store/NewClientForm/NewClientForm.actions"
import TypeApartamento from "../pages/newClient/TypeApartamento"
import TypeCasa from "../pages/newClient/TypeCasa"
import TypeComercial from "../pages/newClient/TypeComercial"
import TypeTerrenoValuation from "../pages/valuation/TypeTerrenoValuation"
import LocationValuation from "./LocationValuation"
import { createImageUrl } from "../../utils/createImageUrl"
import baseUrl from "../../utils/baseUrl"
import axios from "axios"
import { maskMoney } from "../../utils/mask"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt, faUpload, faLink, faPencil, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import Modal, { ModalBtnPrimary, ModalBtnSecondary } from "../components/Modal"
import styles from "./PropertyAdd.module.scss"

export default function PropertyEditModal({ property, index, propertyArray, setPropertyArray }) {
    const dispatch = useDispatch()
    const newClientForm = useSelector(state => state.newClientForm)
    const closeRef = useRef(null)

    const [imageUrl, setImageUrl] = useState('')
    const [linkError, setLinkError] = useState('')
    const [loadingImage, setLoadingImage] = useState(false)
    const [manualImageFile, setManualImageFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [loadingSave, setLoadingSave] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [locationValid, setLocationValid] = useState(true)
    const [showLocationError, setShowLocationError] = useState(false)
    const [manualImageUrl, setManualImageUrl] = useState('')
    const [imageUrlError, setImageUrlError] = useState('')
    const [imageUrlValidating, setImageUrlValidating] = useState(false)

    // Pré-popula Redux com os dados do imóvel selecionado para edição
    useEffect(() => {
        if (!property) return
        dispatch(setPropertyType(property.propertyType || ''))
        dispatch(setPropertyLink(property.propertyLink || ''))
        dispatch(setPropertyName(property.propertyName || ''))
        dispatch(setPropertyPrice(property.propertyPrice ? maskMoney(String(property.propertyPrice)) : ''))
        dispatch(setAreaTotal(property.areaTotal || ''))
        dispatch(setAreaTotalPrivativa(property.areaTotalPrivativa || ''))
        dispatch(setQuartos(property.quartos || ''))
        dispatch(setSuites(property.suites || ''))
        dispatch(setBanheiros(property.banheiros || ''))
        dispatch(setSacadas(property.sacadas || ''))
        dispatch(setAndar(property.andar || ''))
        dispatch(setVagasGaragem(property.vagasGaragem || ''))
        dispatch(setPavimentos(property.pavimentos || ''))
        dispatch(setSalas(property.salas || ''))
        dispatch(setTerrenoIrregular(!!property.terrenoIrregular))
        dispatch(setLargura(property.largura || ''))
        dispatch(setComprimento(property.comprimento || ''))
        dispatch(setFrente(property.frente || ''))
        dispatch(setFundos(property.fundos || ''))
        dispatch(setLateralEsquerda(property.lateralEsquerda || ''))
        dispatch(setLateralDireita(property.lateralDireita || ''))
        dispatch(setLogradouro(property.logradouro || ''))
        dispatch(setBairro(property.bairro || ''))
        dispatch(setCidade(property.cidade || ''))
        dispatch(setUf(property.uf || ''))
        dispatch(setLatitude(property.latitude || ''))
        dispatch(setLongitude(property.longitude || ''))

        setImageUrl(property.imageUrl || '')
        setPreviewUrl('')
        setManualImageFile(null)
        setLinkError('')
        setFormErrors({})
        setLocationValid(true)
        setShowLocationError(false)
        setManualImageUrl('')
        setImageUrlError('')
        setImageUrlValidating(false)
    }, [property])

    const clearValues = () => {
        if (property) {
            dispatch(setPropertyType(property.propertyType || ''))
        } else {
            dispatch(initialValues())
        }
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setImageUrl('')
        setLinkError('')
        setLoadingImage(false)
        setManualImageFile(null)
        setPreviewUrl('')
        setFormErrors({})
        setLocationValid(true)
        setShowLocationError(false)
        setManualImageUrl('')
        setImageUrlError('')
        setImageUrlValidating(false)
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
        setManualImageUrl('')
        setImageUrlError('')
        const fileInput = document.getElementById('editManualImageUpload')
        if (fileInput) fileInput.value = ''
    }

    const handleImageUrlBlur = async () => {
        const url = manualImageUrl.trim()
        if (!url) { setImageUrlError(''); return }
        try { new URL(url) } catch {
            setImageUrlError('URL inválida.')
            return
        }
        setImageUrlValidating(true)
        setImageUrlError('')
        const valid = await new Promise(resolve => {
            const img = new Image()
            img.onload = () => resolve(true)
            img.onerror = () => resolve(false)
            img.src = url
        })
        setImageUrlValidating(false)
        if (valid) {
            setImageUrl(url)
            setManualImageUrl('')
            setImageUrlError('')
        } else {
            setImageUrlError('URL não encontrada ou não é uma imagem válida.')
        }
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

            if (data.cidade || data.bairro) {
                const addressParts = [data.logradouro, data.bairro, data.cidade, data.uf].filter(Boolean)
                const components = ["country:BR"]
                if (data.uf) components.push(`administrative_area:${data.uf}`)
                if (data.cidade) components.push(`locality:${data.cidade}`)
                try {
                    const geoRes = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressParts.join(", "))}&components=${encodeURIComponent(components.join("|"))}&key=AIzaSyAU54iwv20-0BDGcVzMcMrVZpmZRPJDDic`
                    )
                    if (geoRes.ok) {
                        const geoData = await geoRes.json()
                        const location = geoData.results[0]?.geometry?.location
                        if (location) {
                            dispatch(setLatitude(location.lat))
                            dispatch(setLongitude(location.lng))
                        }
                    }
                } catch { /* geocodificação não bloqueia */ }
            }
        } catch {
            setLinkError('Não foi possível obter as informações. Preencha manualmente.')
        }

        setLoadingImage(false)
    }

    const handleSave = async (form) => {
        const next = {}
        if (!form.propertyPrice) next.propertyPrice = "O valor do imóvel é obrigatório."
        if (!form.areaTotal) next.areaTotal = "A área total é obrigatória."
        if (!locationValid) { setShowLocationError(true); setFormErrors(next); return }
        if (Object.keys(next).length > 0) { setFormErrors(next); return }
        setFormErrors({})
        setShowLocationError(false)

        setLoadingSave(true)
        let finalImageUrl = imageUrl

        if (manualImageFile) {
            try {
                const fileUrl = await createImageUrl([manualImageFile], 'CLIENT_FILES')
                finalImageUrl = fileUrl[0].url
            } catch {
                setLoadingSave(false)
                return
            }
        }

        const updated = [...propertyArray]
        updated[index] = {
            ...property,
            propertyName: form.propertyName,
            propertyPrice: form.propertyPrice,
            propertyType: form.propertyType,
            propertyLink: form.propertyLink,
            imageUrl: finalImageUrl,
            areaTotal: form.areaTotal,
            areaTotalPrivativa: form.areaTotalPrivativa,
            quartos: form.quartos,
            suites: form.suites,
            banheiros: form.banheiros,
            sacadas: form.sacadas,
            andar: form.andar,
            vagasGaragem: form.vagasGaragem,
            terrenoIrregular: form.terrenoIrregular,
            largura: form.largura,
            comprimento: form.comprimento,
            frente: form.frente,
            fundos: form.fundos,
            lateralEsquerda: form.lateralEsquerda,
            lateralDireita: form.lateralDireita,
            pavimentos: form.pavimentos,
            salas: form.salas,
            cidade: form.cidade,
            uf: form.uf,
            logradouro: form.logradouro,
            bairro: form.bairro,
            latitude: form.latitude,
            longitude: form.longitude,
        }
        setPropertyArray(updated)
        setLoadingSave(false)
        closeRef.current?.click()
    }

    const footer = (
        <div style={{ display: 'flex', gap: '8px' }}>
            <button ref={closeRef} type="button" data-bs-dismiss="modal" style={{ display: 'none' }} />
            <ModalBtnSecondary dismiss onClick={clearValues}>Cancelar</ModalBtnSecondary>
            <ModalBtnPrimary dismiss={false} onClick={() => handleSave(newClientForm)}>
                {loadingSave ? <SpinnerSM /> : 'Salvar alterações'}
            </ModalBtnPrimary>
        </div>
    )

    if (!property) return null

    return (
        <Modal
            id="propertyEditModal"
            title="Editar imóvel"
            icon={faPencil}
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
                            value={newClientForm.propertyLink || ''}
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
                            value={newClientForm.propertyName || ''}
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
                                value={newClientForm.propertyPrice || ''}
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
                                <>
                                    <label htmlFor="editManualImageUpload" className={styles.uploadBtn}>
                                        <FontAwesomeIcon icon={faUpload} />
                                        Enviar arquivo
                                        <input
                                            type="file"
                                            id="editManualImageUpload"
                                            accept="image/*"
                                            onChange={handleManualImageUpload}
                                            style={{ display: 'none' }} />
                                    </label>

                                    <div className={styles.urlDivider}>— ou —</div>

                                    <div className={styles.urlField}>
                                        <div className={styles.urlLabelRow}>
                                            <span className={styles.urlLabel}>URL da imagem</span>
                                            <div className={styles.tooltipWrap}>
                                                <FontAwesomeIcon icon={faCircleInfo} className={styles.tooltipIcon} />
                                                <span className={styles.tooltipBox}>
                                                    No anúncio, clique com o botão direito sobre a imagem e selecione "Copiar endereço da imagem".
                                                </span>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className={`${styles.urlInput}${imageUrlError ? ' ' + styles.inputError : ''}`}
                                            placeholder="https://..."
                                            value={manualImageUrl}
                                            onChange={e => { setManualImageUrl(e.target.value); setImageUrlError('') }}
                                            onBlur={handleImageUrlBlur}
                                        />
                                        {imageUrlValidating && <span className={styles.urlHint}>Verificando imagem…</span>}
                                        {imageUrlError && <span className={styles.errorText}>{imageUrlError}</span>}
                                    </div>
                                </>
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

            {/* ── Property type sub-form ── */}
            <div data-bs-theme="dark">
                {newClientForm.propertyType === "Apartamento" && (
                    <>
                        <TypeApartamento propertyAndar requiredPrivativa={false} />
                        <LocationValuation onValidationChange={setLocationValid} showError={showLocationError} />
                    </>
                )}
                {newClientForm.propertyType === "Casa" && (
                    <>
                        <TypeCasa />
                        <LocationValuation onValidationChange={setLocationValid} showError={showLocationError} />
                    </>
                )}
                {newClientForm.propertyType === "Comercial" && (
                    <>
                        <TypeComercial />
                        <LocationValuation onValidationChange={setLocationValid} showError={showLocationError} />
                    </>
                )}
                {newClientForm.propertyType === "Terreno" && (
                    <>
                        <TypeTerrenoValuation />
                        <LocationValuation onValidationChange={setLocationValid} showError={showLocationError} />
                    </>
                )}
            </div>
        </Modal>
    )
}
