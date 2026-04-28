import { useEffect, useState } from "react"
import Map from "../../valuation/Map"
import PropertyCard from "../../valuation/PropertyCard"
import PropertyUrlModal from "./PropertyUrlModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faShoppingCart, faStar, faWarning, faHome, faRulerCombined } from "@fortawesome/free-solid-svg-icons"
import Input from "../../components/Input"
import Icons from "../../components/icons"
import tippy from "tippy.js"
import scrollTo from "../../../utils/scrollTo"
import styles from './valuation.module.scss'
import { Swiper, SwiperSlide } from "swiper/react"
import ClientFeatures from "../../clientsManagement/ClientFeatures"
import baseUrl from "../../../utils/baseUrl"
import { SpinnerSM } from "../../components/loading/Spinners"
import axios from "axios"
import { useRouter } from "next/router"
import { maskMoney } from "../../../utils/mask"
import ClientFeaturesValuation from "../../clientsManagement/ClientFeaturesValuation"
import PropertiesMap from "../../valuation/PropertiesMap"

export default function ValuationViewPage(props) {
    const clientData = props.clientData
    const router = useRouter()
    const disabled = router.query.disabled

    const [valueSelected, setValueSelected] = useState(clientData?.valuation?.valueSelected)
    const [valueComment, setValueComment] = useState(clientData?.valuation?.valueComment)
    const [customValue, setCustomValue] = useState(clientData?.valuation?.customValue)
    const [loadingSave, setLoadingSave] = useState(false)

    useEffect(() => {
        if (!valueSelected) return
        const targetId = valueSelected === 'customValue' ? 'customValueInput' : 'valueComentInput'
        setTimeout(() => {
            const el = document.getElementById(targetId)
            if (!el) return
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            el.focus()
        }, 120)
    }, [valueSelected])

    const handleSave = async () => {
        setLoadingSave(true)

        if (valueSelected) {
            const data = {
                user_id: props.queryUserId,
                client_id: props.queryClientId,
                valueSelected,
                customValue,
                valueComment
            }

            await axios.post(`${baseUrl()}/api/valuation/valuationView`, data)
                .then(res => {
                    var myCarousel = document.querySelector('#valuationCarousel')
                    var carousel = new bootstrap.Carousel(myCarousel)
                    carousel.next()
                    setLoadingSave(false)
                }).catch(e => {
                    setLoadingSave(false)
                })
        }
    }

    return (
        <div className="container-fluid p-0" >
            <div className="row justify-content-center align-items-center min-vh-100 m-0">
                <div className="col-12 col-xxl-10">
                    <div className="card bg-light shadow-lg border-0" style={{ minHeight: '95vh', borderRadius: '20px' }}>
                        <div className="card-body p-0" style={{ overflowY: 'auto', maxHeight: '95vh' }}>

                            {/* Header Section */}
                            <div className="text-center py-5" style={{ background: 'linear-gradient(135deg, #f5874f 0%, #faa954 100%)', borderRadius: '20px 20px 0 0' }}>
                                <div className="container">
                                    <h1 className="display-4 fw-bold text-white mb-3">
                                        <FontAwesomeIcon icon={faHome} className="me-3" />
                                        Metodologia Aplicada
                                    </h1>
                                    <p className="lead text-white opacity-90 mb-0">Avaliação precisa baseada em dados de mercado</p>
                                </div>
                            </div>

                            <div className="container py-5">
                                {/* Methodology Description */}
                                <div className="row justify-content-center mb-5">
                                    <div className="col-lg-10">
                                        <div className="card bg-light border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                            <div className="card-body p-4">
                                                <div className="row align-items-center">
                                                    {/* <div className="col-md-2 text-center mb-3 mb-md-0">
                                                        <div className="rounded-circle d-inline-flex align-items-center justify-content-center" 
                                                             style={{ width: '80px', height: '80px', backgroundColor: '#f5874f' }}>
                                                            <span className="display-6 fw-bold text-white">{clientData?.valuation?.propertyArray?.length}</span>
                                                        </div>
                                                    </div> */}
                                                    <div className="col-md-10">
                                                        <h5 className="fw-bold mb-3" style={{ color: '#5a5a5a' }}>Base de Comparação</h5>
                                                        <p className="mb-2" style={{ color: '#5a5a5a' }}>
                                                            O estudo é feito a partir de uma amostra de <strong>{clientData?.valuation?.propertyArray?.length} imóveis</strong> com características similares ao seu que nos permite entender o posicionamento do seu imóvel no mercado.
                                                        </p>
                                                        <p className="mb-0" style={{ color: '#5a5a5a' }}>
                                                            As informações são cruzadas e sofrem ações de variáveis que influenciam diretamente no preço final, chegando a uma sugestão de precificação mais assertiva.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Property Features Section */}
                                <div className="row justify-content-center mb-5">
                                    <div className="col-12">
                                        <h2 className="text-center fw-bold mb-4" style={{ color: '#5a5a5a' }}>
                                            Características do Seu Imóvel
                                        </h2>
                                        <div className="card bg-light border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                            <div className="card-body p-0">
                                                <div className="row g-0">
                                                    <div className="col-lg-6">
                                                        <div className={styles.swiperWrap}>
                                                            <Swiper
                                                                style={{
                                                                    '--swiper-navigation-color': 'rgba(255,255,255,0.85)',
                                                                    '--swiper-pagination-color': '#f5874f',
                                                                    '--swiper-navigation-size': '14px',
                                                                    zIndex: 0,
                                                                }}
                                                                slidesPerView={1}
                                                                pagination={{ clickable: true }}
                                                                navigation>
                                                                {clientData?.files?.map((elem, index) => (
                                                                    <SwiperSlide key={index}>
                                                                        <img
                                                                            src={elem.url}
                                                                            alt={`Slide ${index + 1}`}
                                                                            style={{
                                                                                width: '100%',
                                                                                height: '600px',
                                                                                objectFit: 'cover',
                                                                            }}
                                                                        />
                                                                    </SwiperSlide>
                                                                ))}
                                                            </Swiper>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 p-4 d-flex align-items-start">
                                                        <ClientFeaturesValuation client={clientData} propertyAdd />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Comparison Properties */}
                                <div className="mb-5">
                                    <h2 className="text-center fw-bold mb-4" style={{ color: '#5a5a5a' }}>
                                        Imóveis de Comparação
                                    </h2>

                                    <Swiper
                                        grabCursor
                                        style={{
                                            '--swiper-navigation-color': '#f5874f',
                                            '--swiper-pagination-color': '#f5874f',
                                            '--swiper-navigation-size': '20px',
                                            paddingBottom: '40px'
                                        }}
                                        slidesPerView={1.2}
                                        spaceBetween={15}
                                        pagination={{ clickable: true, dynamicBullets: true }}
                                        navigation
                                        breakpoints={{
                                            480: { slidesPerView: 1.5, spaceBetween: 15 },
                                            640: { slidesPerView: 2, spaceBetween: 20 },
                                            1024: { slidesPerView: 3, spaceBetween: 20 },
                                            1400: { slidesPerView: 4, spaceBetween: 20 },
                                        }}
                                    >
                                        {clientData?.valuation?.propertyArray?.map((elem, index) => (
                                            <SwiperSlide key={index}>
                                                <PropertyCard
                                                    section={'Todos Clientes'}
                                                    light
                                                    valuationView
                                                    elem={elem}
                                                    index={index}
                                                    setPropertyUrl={value => props.setPropertyUrl(value)}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                {/* Map Section */}
                                <div className="row justify-content-center mb-5">
                                    <div className="col-lg-10">
                                        <div className="card bg-light border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>

                                            <PropertiesMap light propertyArray={clientData?.valuation?.propertyArray} client={clientData} />

                                        </div>
                                    </div>
                                </div>

                                <hr className="my-5" style={{ height: '3px', backgroundColor: '#f5874f', border: 'none', borderRadius: '2px' }} />

                                {/* Valuation Results */}
                                {/* <div className="text-center mb-5">
                                    <h2 className="display-5 fw-bold mb-4" style={{ color: '#5a5a5a' }}>
                                        Valor de Avaliação
                                    </h2>
                                    <div className="row justify-content-center">
                                        <div className="col-lg-8">
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                                        <div className="card-body text-center p-4">
                                                            <FontAwesomeIcon icon={faRulerCombined} className="fs-2 mb-3" style={{ color: '#f5874f' }} />
                                                            <h6 className="fw-bold mb-2" style={{ color: '#5a5a5a' }}>Valor do m²</h6>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <span className="fs-5 me-1" style={{ color: '#f5874f' }}>R$</span>
                                                                <span className="display-6 fw-bold" style={{ color: '#5a5a5a' }}>
                                                                    {clientData?.valuation?.valuationCalc?.valorMetroQuadrado},00
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                                        <div className="card-body text-center p-4">
                                                            <FontAwesomeIcon icon={faHome} className="fs-2 mb-3" style={{ color: '#faa954' }} />
                                                            <h6 className="fw-bold mb-2" style={{ color: '#5a5a5a' }}>
                                                                {clientData?.valuation?.valuationCalc?.areaPrivativa ? "Área privativa" : "Área total"}
                                                            </h6>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <span className="display-6 fw-bold" style={{ color: '#5a5a5a' }}>
                                                                    {clientData?.valuation?.valuationCalc?.areaPrivativa ? 
                                                                        clientData?.areaTotalPrivativa : clientData?.areaTotal}
                                                                </span>
                                                                <span className="fs-5 ms-1" style={{ color: '#faa954' }}>m²</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="card border-0 shadow-sm" 
                                                         style={{ 
                                                             borderRadius: '15px',
                                                             background: 'linear-gradient(135deg, #f5874f 0%, #faa954 100%)'
                                                         }}>
                                                        <div className="card-body text-center p-4">
                                                            <h5 className="fw-bold mb-3 text-white">Valor Total</h5>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <span className="fs-4 me-2 text-white">R$</span>
                                                                <span className="display-4 fw-bold text-white">
                                                                    {clientData?.valuation?.valuationCalc?.valorAvaliacao},00
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                                {/* Pricing Options */}
                                {(() => {
                                    const calc = clientData?.valuation?.valuationCalc
                                    const fmt = v => (v && v !== 'NaN') ? v + ',00' : '—'
                                    const OPTIONS = [
                                        {
                                            key: 'curtoPrazoValue',
                                            label: 'Venda Rápida',
                                            desc: 'Ideal para quem precisa concluir a venda em menos tempo',
                                            value: fmt(calc?.curtoPrazoValue),
                                            icon: faStar,
                                            color: '#28a745',
                                        },
                                        {
                                            key: 'valorIdealValue',
                                            label: 'Venda Ideal',
                                            desc: 'Preço equilibrado e competitivo no mercado atual',
                                            value: fmt(calc?.valorIdealValue),
                                            icon: faShoppingCart,
                                            color: '#faa954',
                                            recommended: true,
                                        },
                                        {
                                            key: 'longoPrazoValue',
                                            label: 'Venda sem Pressa',
                                            desc: 'Maximiza o retorno, mas pode levar mais tempo',
                                            value: fmt(calc?.longoPrazoValue),
                                            icon: faWarning,
                                            color: '#dc3545',
                                        },
                                    ]

                                    return (
                                        <div className={styles.pricingSection}>
                                            <div className={styles.pricingHeader}>
                                                <h2 className="text-center  fw-bold mb-4" style={{ color: '#5a5a5a' }}>Valor de Anúncio</h2>
                                                <p className={styles.pricingSubtitle}>Selecione o valor que melhor se encaixa com a sua necessidade</p>
                                            </div>

                                            {/* 3 main options — horizontal grid on desktop */}
                                            <div className={styles.optionsGrid}>
                                                {OPTIONS.map(opt => (
                                                    <div
                                                        key={opt.key}
                                                        className={[
                                                            styles.optionCard,
                                                            opt.recommended ? styles.optionRecommended : '',
                                                            valueSelected === opt.key ? styles.optionSelected : '',
                                                        ].join(' ')}
                                                        onClick={() => setValueSelected(opt.key)}
                                                    >
                                                        <div
                                                            className={styles.optionCardIcon}
                                                            style={{ background: `${opt.color}18`, color: opt.color }}
                                                        >
                                                            <FontAwesomeIcon icon={opt.icon} />
                                                        </div>
                                                        <div className={styles.optionCardHeader}>
                                                            <div className={styles.optionRadio}>
                                                                {valueSelected === opt.key && <div className={styles.optionRadioDot} />}
                                                            </div>
                                                            <div className={styles.optionLabel}>
                                                                {opt.label}
                                                                {opt.recommended && (
                                                                    <span className={styles.recommendedBadge}>Recomendado</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className={styles.optionDesc}>{opt.desc}</div>
                                                        <div className={styles.optionCardPrice}>
                                                            <span className={styles.optionCardCurrency}>R$</span>
                                                            <span className={styles.optionCardAmount}>{opt.value}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Custom value — full-width row */}
                                            <div
                                                className={[
                                                    styles.optionRow,
                                                    valueSelected === 'customValue' ? styles.optionSelected : '',
                                                ].join(' mb-2')}
                                                onClick={() => setValueSelected('customValue')}
                                            >
                                                <div className={styles.optionRadio}>
                                                    {valueSelected === 'customValue' && <div className={styles.optionRadioDot} />}
                                                </div>
                                                <div className={`  ${styles.optionInfo}`}>
                                                    <div className={styles.optionLabel}>Valor Personalizado</div>
                                                    <div className={styles.optionDesc}>Nenhum dos valores acima atende à minha necessidade</div>
                                                </div>
                                            </div>

                                            {/* Custom value input — shown below the row */}
                                            {valueSelected === 'customValue' && (
                                                <div className={styles.customValueBlock}>
                                                    <Input
                                                        id="customValueInput"
                                                        type="text"
                                                        theme="light"
                                                        label="Qual é o seu valor ideal?"
                                                        placeholder="Ex: 450.000"
                                                        icon='R$'
                                                        suffix=",00"
                                                        value={customValue || ''}
                                                        onChange={e => setCustomValue(maskMoney(e.target.value))}
                                                    />
                                                </div>
                                            )}

                                            {valueSelected && (
                                                <div className={styles.commentBox}>
                                                    <label className={styles.commentLabel} htmlFor="valueComentInput">
                                                        Por que este valor?
                                                    </label>
                                                    <textarea
                                                        className={styles.commentTextarea}
                                                        id="valueComentInput"
                                                        rows={3}
                                                        placeholder="Comente aqui o que motivou a escolha deste valor"
                                                        value={valueComment}
                                                        onChange={e => setValueComment(e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            <div id="continueButton" style={{ textAlign: 'center', paddingBottom: '2.5rem' }}>
                                                <button
                                                    type="button"
                                                    className={styles.continueBtn}
                                                    disabled={!valueSelected || disabled}
                                                    onClick={handleSave}
                                                >
                                                    {loadingSave ? <SpinnerSM /> : 'Continuar'}
                                                </button>
                                                {!valueSelected && (
                                                    <p className={styles.continueError}>
                                                        Selecione um valor para continuar
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}