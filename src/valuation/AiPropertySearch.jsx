import { useState, useRef } from "react"
import axios from "axios"
import baseUrl from "../../utils/baseUrl"
import { SpinnerSM } from "../components/loading/Spinners"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRobot, faExternalLinkAlt, faCheck, faSearch, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { maskMoney } from "../../utils/mask"
import Modal, { ModalBtnPrimary, ModalBtnSecondary } from "../components/Modal"
import styles from "./AiPropertySearch.module.scss"

export default function AiPropertySearch(props) {
    const { client, propertyArray, setPropertyArray, setForceUpdate } = props

    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState([])
    const [selected, setSelected] = useState([])
    const [manualPrices, setManualPrices] = useState({})
    const [manualAreas, setManualAreas] = useState({})
    const [manualPrivativas, setManualPrivativas] = useState({})
    const [missingFields, setMissingFields] = useState(new Set())
    const [error, setError] = useState("")
    const [loadingAdd, setLoadingAdd] = useState(false)
    const closeRef = useRef(null)

    const handleSearch = async () => {
        setLoading(true)
        setError("")
        setResults([])
        setSelected([])
        setManualPrices({})
        setManualAreas({})
        setManualPrivativas({})
        setMissingFields(new Set())

        try {
            const res = await axios.post(`${baseUrl()}/api/valuation/aiPropertySearch`, { client })
            const properties = res.data.properties || []
            setResults(properties)
            if (!properties.length) {
                setError("Nenhum imóvel semelhante encontrado. Tente adicionar manualmente.")
            }
        } catch (e) {
            setError(
                e.response?.data?.error ||
                "Erro ao buscar imóveis. Verifique se ANTHROPIC_API_KEY está configurado no .env.local."
            )
        }

        setLoading(false)
    }

    const handleOpenModal = () => {
        if (!results.length && !loading) handleSearch()
    }

    const toggleSelect = (index) => {
        setMissingFields(new Set())
        setSelected(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        )
    }

    const getPrice = (index) =>
        manualPrices[index] !== undefined ? manualPrices[index] : results[index]?.propertyPrice || ""

    const getArea = (index) =>
        manualAreas[index] !== undefined ? manualAreas[index] : results[index]?.areaTotal || ""

    const getPrivativa = (index) =>
        manualPrivativas[index] !== undefined ? manualPrivativas[index] : results[index]?.areaTotalPrivativa || ""

    const handlePriceChange = (index, value) => {
        const masked = maskMoney(value)
        setManualPrices(prev => ({ ...prev, [index]: masked }))
        if (masked) clearMissing(index)
    }

    const handleAreaChange = (index, value) => {
        const numeric = value.replace(/\D/g, "")
        setManualAreas(prev => ({ ...prev, [index]: numeric }))
        if (numeric) clearMissing(index)
    }

    const handlePrivativaChange = (index, value) => {
        const numeric = value.replace(/\D/g, "")
        setManualPrivativas(prev => ({ ...prev, [index]: numeric }))
    }

    const clearMissing = (index) => {
        setMissingFields(prev => {
            const next = new Set(prev)
            if (getPrice(index) && getArea(index)) next.delete(index)
            return next
        })
    }

    const geocode = async ({ logradouro, bairro, cidade, uf }) => {
        const cidadeVal = cidade || client.cidade || ""
        const ufVal = uf || client.uf || ""
        if (!logradouro && !bairro && !cidadeVal) return { lat: "", lng: "" }

        const components = ["country:BR"]
        if (ufVal) components.push(`administrative_area:${ufVal}`)
        if (cidadeVal) components.push(`locality:${cidadeVal}`)

        const addressParts = [logradouro, bairro, cidadeVal, ufVal].filter(Boolean)

        try {
            let url = `https://maps.googleapis.com/maps/api/geocode/json`
                + `?address=${encodeURIComponent(addressParts.join(", "))}`
                + `&components=${encodeURIComponent(components.join("|"))}`
                + `&key=AIzaSyAU54iwv20-0BDGcVzMcMrVZpmZRPJDDic`

            if (client.latitude && client.longitude) {
                const delta = 0.45
                url += `&bounds=${+client.latitude - delta},${+client.longitude - delta}|${+client.latitude + delta},${+client.longitude + delta}`
            }

            const res = await fetch(url)
            if (!res.ok) return { lat: "", lng: "" }
            const data = await res.json()

            if (!data.results?.length && cidadeVal) {
                const fallbackComponents = ["country:BR"]
                if (ufVal) fallbackComponents.push(`administrative_area:${ufVal}`)
                const fallbackUrl = `https://maps.googleapis.com/maps/api/geocode/json`
                    + `?address=${encodeURIComponent(addressParts.join(", "))}`
                    + `&components=${encodeURIComponent(fallbackComponents.join("|"))}`
                    + `&key=AIzaSyAU54iwv20-0BDGcVzMcMrVZpmZRPJDDic`
                const fallbackRes = await fetch(fallbackUrl)
                if (fallbackRes.ok) {
                    const fallbackData = await fallbackRes.json()
                    const loc = fallbackData.results[0]?.geometry?.location
                    return loc ? { lat: loc.lat, lng: loc.lng } : { lat: "", lng: "" }
                }
            }

            const loc = data.results[0]?.geometry?.location
            return loc ? { lat: loc.lat, lng: loc.lng } : { lat: "", lng: "" }
        } catch {
            return { lat: "", lng: "" }
        }
    }

    // Extrai endereço completo do link do anúncio (mesmo fluxo do PropertyAdd)
    const extractAddress = async (propertyLink) => {
        if (!propertyLink) return null
        try {
            const res = await axios.get(`${baseUrl()}/api/valuation/extractPropertyInfo`, {
                params: { url: propertyLink },
                timeout: 8000,
            })
            return res.data
        } catch {
            return null
        }
    }

    const handleAddSelected = async () => {
        const missing = new Set(selected.filter(i => !getPrice(i) || !getArea(i)))
        if (missing.size > 0) { setMissingFields(missing); return; }

        setLoadingAdd(true)

        // Extrai endereço completo de cada anúncio em paralelo
        const extracted = await Promise.all(
            selected.map((index) => extractAddress(results[index].propertyLink))
        )

        const geoResults = await Promise.all(
            selected.map((index, i) => {
                const property = results[index]
                const info = extracted[i]
                return geocode({
                    logradouro: info?.logradouro || "",
                    bairro:     info?.bairro     || property.bairro || client.bairro || "",
                    cidade:     info?.cidade     || property.cidade || client.cidade || "",
                    uf:         info?.uf         || property.uf     || client.uf     || "",
                })
            })
        )

        const newPropertyArray = [...propertyArray]
        selected.forEach((index, i) => {
            const property = results[index]
            const price = getPrice(index)
            const area = getArea(index)
            const { lat, lng } = geoResults[i]
            newPropertyArray.push({
                propertyName: property.propertyName || "",
                propertyPrice: price.replace(/[^\d]/g, ""),
                propertyType: client.propertyType,
                propertyLink: property.propertyLink || "",
                imageUrl: property.imageUrl || "",
                areaTotal: area,
                areaTotalPrivativa: getPrivativa(index),
                quartos: property.quartos || "",
                suites: "",
                banheiros: property.banheiros || "",
                sacadas: "", andar: "",
                vagasGaragem: property.vagasGaragem || "",
                terrenoIrregular: false,
                largura: "", comprimento: "", frente: "", fundos: "",
                lateralEsquerda: "", lateralDireita: "",
                pavimentos: "", salas: "",
                cidade: property.cidade || client.cidade || "",
                uf: property.uf || client.uf || "",
                logradouro: "",
                bairro: property.bairro || client.bairro || "",
                latitude: lat,
                longitude: lng,
                dateAdded: new Date(),
            })
        })

        setPropertyArray(newPropertyArray)
        setForceUpdate()
        setSelected([])
        setMissingFields(new Set())
        setLoadingAdd(false)
        closeRef.current?.click()
    }

    const footer = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '12px', flexWrap: 'wrap' }}>
            <div>
                {!loading && results.length > 0 && (
                    <button type="button" className={styles.retryBtn} onClick={handleSearch}>
                        <FontAwesomeIcon icon={faSearch} />
                        Buscar novamente
                    </button>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                {/* {selected.length > 0 && !loadingAdd && (
                    <div className={styles.verifyNotice}>
                        <FontAwesomeIcon icon={faTriangleExclamation} className={styles.verifyIcon} />
                        <span>
                            Antes de adicionar, verifique se <strong>valor</strong>, <strong>área</strong> e <strong>localização</strong> de cada imóvel estão corretos. A IA pode cometer erros.
                        </span>
                    </div>
                )} */}
                {missingFields.size > 0 && (
                    <span className={styles.missingError}>
                        Preencha o valor e a área dos imóveis marcados em vermelho.
                    </span>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button ref={closeRef} type="button" data-bs-dismiss="modal" style={{ display: 'none' }} />
                    <ModalBtnSecondary>Fechar</ModalBtnSecondary>
                    {!loading && results.length > 0 && (
                        <ModalBtnPrimary dismiss={false} onClick={handleAddSelected} disabled={selected.length === 0 || loadingAdd}>
                            {loadingAdd ? <SpinnerSM /> : `Adicionar selecionados (${selected.length})`}
                        </ModalBtnPrimary>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <>
            <button
                type="button"
                className={styles.aiBtn}
                data-bs-toggle="modal"
                data-bs-target="#aiPropertySearchModal"
                onClick={handleOpenModal}
            >
                <FontAwesomeIcon icon={faRobot} />
                Buscar com IA
            </button>

            <Modal
                id="aiPropertySearchModal"
                title="Busca com IA"
                subtitle="Imóveis semelhantes para comparação"
                icon={faRobot}
                size="xl"
                footer={footer}
            >
                {loading && (
                    <div className={styles.searching}>
                        <SpinnerSM />
                        <p className={styles.searchingText}>Buscando imóveis semelhantes na internet…</p>
                    </div>
                )}

                {error && !loading && (
                    <div className={styles.errorAlert}>{error}</div>
                )}

                {!loading && results.length > 0 && (
                    <>
                        <p className={styles.instrText}>
                            Selecione os imóveis que fazem sentido para a comparação e clique em{" "}
                            <strong>Adicionar selecionados</strong>. Campos marcados com{" "}
                            <span style={{ color: '#f2545b', fontWeight: 700 }}>*</span> são obrigatórios.
                        </p>

                        <div className={styles.cardsGrid}>
                            {results.map((property, index) => {
                                const isSelected = selected.includes(index)
                                const isMissing = missingFields.has(index)
                                const price = getPrice(index)
                                const area = getArea(index)
                                const hasAutoPrice = !!property.propertyPrice
                                const hasAutoArea = !!property.areaTotal
                                const hasAutoPrivativa = !!property.areaTotalPrivativa

                                return (
                                    <div
                                        key={index}
                                        className={`${styles.propertyCard} ${isSelected ? styles.selected : ''} ${isMissing ? styles.missingPrice : ''}`}
                                        onClick={() => toggleSelect(index)}
                                    >
                                        {isSelected && (
                                            <div className={styles.checkBadge}>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </div>
                                        )}

                                        {property.imageUrl ? (
                                            <img
                                                src={property.imageUrl}
                                                className={styles.cardImage}
                                                alt={property.propertyName}
                                                onError={e => { e.target.style.display = 'none' }} />
                                        ) : (
                                            <div className={styles.imageFallback}>
                                                <span className={styles.imageFallbackText}>Sem imagem</span>
                                            </div>
                                        )}

                                        <div className={styles.cardBody}>
                                            <p className={styles.cardTitle}>{property.propertyName}</p>

                                            {hasAutoPrice ? (
                                                <span className={styles.cardPrice}>
                                                    R$ {Number(property.propertyPrice).toLocaleString("pt-BR")}
                                                </span>
                                            ) : (
                                                <div className={styles.manualField} onClick={e => e.stopPropagation()}>
                                                    <span className={`${styles.manualLabel} ${isMissing && !price ? styles.required : ''}`}>
                                                        Valor *
                                                    </span>
                                                    <div className={styles.inputGroup}>
                                                        <span className={styles.inputPrefix}>R$</span>
                                                        <input
                                                            type="text"
                                                            className={`${styles.manualInput} ${isMissing && !price ? styles.missingInput : ''}`}
                                                            placeholder="0"
                                                            value={manualPrices[index] || ""}
                                                            onChange={e => handlePriceChange(index, e.target.value)} />
                                                        <span className={styles.inputSuffix}>,00</span>
                                                    </div>
                                                </div>
                                            )}

                                            {hasAutoArea ? (
                                                <span className={styles.cardFeatures}>
                                                    {property.areaTotal}m²
                                                    {property.quartos && ` · ${property.quartos} qts`}
                                                    {property.banheiros && ` · ${property.banheiros} bnh`}
                                                    {property.vagasGaragem && ` · ${property.vagasGaragem} vaga(s)`}
                                                </span>
                                            ) : (
                                                <div className={styles.manualField} onClick={e => e.stopPropagation()}>
                                                    <span className={`${styles.manualLabel} ${isMissing && !area ? styles.required : ''}`}>
                                                        Área total *
                                                    </span>
                                                    <div className={styles.inputGroup}>
                                                        <input
                                                            type="number" min="0"
                                                            className={`${styles.manualInput} ${isMissing && !area ? styles.missingInput : ''}`}
                                                            placeholder="0"
                                                            value={manualAreas[index] || ""}
                                                            onChange={e => handleAreaChange(index, e.target.value)} />
                                                        <span className={styles.inputSuffix}>m²</span>
                                                    </div>
                                                </div>
                                            )}

                                            {!hasAutoArea && (
                                                <span className={styles.cardFeatures}>
                                                    {property.quartos && `${property.quartos} qts `}
                                                    {property.banheiros && `${property.banheiros} bnh `}
                                                    {property.vagasGaragem && `${property.vagasGaragem} vaga(s)`}
                                                </span>
                                            )}

                                            {!hasAutoPrivativa && (
                                                <div className={styles.manualField} onClick={e => e.stopPropagation()}>
                                                    <span className={styles.manualLabel}>
                                                        Área privativa
                                                    </span>
                                                    <div className={styles.inputGroup}>
                                                        <input
                                                            type="number" min="0"
                                                            className={styles.manualInput}
                                                            placeholder="0"
                                                            value={manualPrivativas[index] || ""}
                                                            onChange={e => handlePrivativaChange(index, e.target.value)} />
                                                        <span className={styles.inputSuffix}>m²</span>
                                                    </div>
                                                </div>
                                            )}

                                            {(property.bairro || property.cidade) && (
                                                <span className={styles.cardLocation}>
                                                    {[property.bairro, property.cidade, property.uf].filter(Boolean).join(", ")}
                                                </span>
                                            )}

                                            {property.propertyLink && (
                                                <a
                                                    href={property.propertyLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.viewLink}
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                    Ver anúncio
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </Modal>
        </>
    )
}
