import { useEffect, useState } from "react"
import Map from "../../valuation/Map"
import PropertyCard from "../../valuation/PropertyCard"
import PropertyUrlModal from "./PropertyUrlModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faShoppingCart, faStar, faWarning, faHome, faRulerCombined } from "@fortawesome/free-solid-svg-icons"
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

export default function ValuationViewPage(props) {
    const clientData = props.clientData
    const router = useRouter()
    const disabled = router.query.disabled

    const [valueSelected, setValueSelected] = useState(clientData?.valuation?.valueSelected)
    const [valueComment, setValueComment] = useState(clientData?.valuation?.valueComment)
    const [customValue, setCustomValue] = useState(clientData?.valuation?.customValue)
    const [loadingSave, setLoadingSave] = useState(false)

    useEffect(() => {
        if (valueSelected) scrollTo('continueButton')
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
                    <div className="card shadow-lg border-0" style={{ minHeight: '95vh', borderRadius: '20px' }}>
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
                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
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
                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                            <div className="card-body p-0">
                                                <div className="row g-0">
                                                    <div className="col-lg-6">
                                                        <div style={{ borderRadius: '15px 0 0 15px', overflow: 'hidden' }}>
                                                            <Swiper
                                                                style={{
                                                                    '--swiper-navigation-color': '#f5874f',
                                                                    '--swiper-pagination-color': '#f5874f',
                                                                    '--swiper-navigation-size': '25px',
                                                                    height: '400px'
                                                                }}
                                                                slidesPerView={1}
                                                                pagination={{ clickable: true }}
                                                                navigation>
                                                                {clientData?.files?.map((elem, index) => (
                                                                    <SwiperSlide key={index} className="text-center">
                                                                        <img src={elem.url}
                                                                            className="w-100"
                                                                            alt={`Slide ${index + 1}`}
                                                                            style={{
                                                                                height: '400px',
                                                                                objectFit: 'cover',
                                                                                objectPosition: 'center'
                                                                            }} />
                                                                    </SwiperSlide>
                                                                ))}
                                                            </Swiper>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 p-4 d-flex align-items-start">
                                                        <ClientFeatures client={clientData} propertyAdd />
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

                                    {/* Desktop version - horizontal scroll */}
                                    <div
                                        className={`d-none d-lg-flex overflow-auto pb-3 ${clientData?.valuation?.propertyArray?.length <= 2 ? 'justify-content-center' : ''
                                            }`}
                                        style={{ gap: '15px' }}
                                    >
                                        {clientData?.valuation?.propertyArray?.map((elem, index) => (
                                            <div key={index} style={{ minWidth: '300px', flexShrink: 0 }}>
                                                <PropertyCard
                                                    section={'Todos Clientes'}
                                                    valuationView
                                                    elem={elem}
                                                    index={index}
                                                    setPropertyUrl={value => props.setPropertyUrl(value)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mobile version - Swiper */}
                                    <div className="d-lg-none">
                                        <Swiper
                                            style={{
                                                '--swiper-navigation-color': '#f5874f',
                                                '--swiper-pagination-color': '#f5874f',
                                                '--swiper-navigation-size': '20px',
                                                paddingBottom: '40px'
                                            }}
                                            slidesPerView={1.2}
                                            spaceBetween={15}
                                            centeredSlides={false}
                                            pagination={{
                                                clickable: true,
                                                dynamicBullets: true
                                            }}
                                            navigation
                                            breakpoints={{
                                                480: {
                                                    slidesPerView: 1.5,
                                                    spaceBetween: 20
                                                },
                                                640: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 20
                                                }
                                            }}>
                                            {clientData?.valuation?.propertyArray?.map((elem, index) => (
                                                <SwiperSlide key={index}>
                                                    <PropertyCard
                                                        section={'Todos Clientes'}
                                                        valuationView
                                                        elem={elem}
                                                        index={index}
                                                        setPropertyUrl={value => props.setPropertyUrl(value)}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>

                                {/* Map Section */}
                                <div className="row justify-content-center mb-5">
                                    <div className="col-lg-10">
                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                            <Map
                                                location={{ lat: clientData.latitude, lng: clientData.longitude }}
                                                zoom={30}
                                                height="400px"
                                                valuationPage
                                                porpertyLocations={clientData?.valuation?.propertyArray}
                                            />
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
                                <div className="text-center mb-4">
                                    <h2 className="display-5 fw-bold mb-2" style={{ color: '#5a5a5a' }}>
                                        Valor de Anúncio
                                    </h2>
                                    <p className="lead" style={{ color: '#5a5a5a' }}>Selecione o valor que melhor se encaixa com a sua necessidade:</p>
                                </div>

                                <div className="row justify-content-center g-3 mb-4">
                                    {/* Short Term Sale */}
                                    <div className="col-lg-4 col-md-6">
                                        <div className={`card border shadow-sm h-100 cursor-pointer transition-all ${valueSelected === 'curtoPrazoValue' ? 'border-3 border-secondary shadow-lg' : ''
                                            }`}
                                            style={{
                                                borderRadius: '20px',
                                                cursor: 'pointer',
                                                transform: valueSelected === 'curtoPrazoValue' ? 'translateY(-5px) scale(1.02)' : 'none',
                                                transition: 'all 0.3s ease',
                                                border: valueSelected === 'curtoPrazoValue' ? '3px solid #28a745' : 'none',
                                                background: valueSelected === 'curtoPrazoValue' ?
                                                    'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 'white'
                                            }}
                                            onClick={() => setValueSelected('curtoPrazoValue')}>
                                            <div className="card-body text-center p-4">
                                                <div className="mb-3">
                                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                        style={{
                                                            width: '70px',
                                                            height: '70px',
                                                            backgroundColor: valueSelected === 'curtoPrazoValue' ? 'white' : '#28a745',
                                                            boxShadow: valueSelected === 'curtoPrazoValue' ? '0 8px 25px rgba(40, 167, 69, 0.3)' : 'none'
                                                        }}>
                                                        <FontAwesomeIcon
                                                            icon={faStar}
                                                            className="fs-3"
                                                            style={{ color: valueSelected === 'curtoPrazoValue' ? '#28a745' : 'white' }}
                                                        />
                                                    </div>
                                                </div>
                                                <h5 className="fw-bold mb-3"
                                                    style={{ color: valueSelected === 'curtoPrazoValue' ? 'white' : '#28a745' }}>
                                                    Venda Curto Prazo
                                                    {valueSelected === 'curtoPrazoValue' && (
                                                        <div className="mt-2">
                                                            <span className="badge bg-light text-success px-3 py-2 rounded-pill">
                                                                ✓ SELECIONADO
                                                            </span>
                                                        </div>
                                                    )}
                                                </h5>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <span className="fs-5 me-1"
                                                        style={{ color: valueSelected === 'curtoPrazoValue' ? 'white' : '#28a745' }}>
                                                        R$
                                                    </span>
                                                    <span className="fs-3 fw-bold"
                                                        style={{
                                                            color: valueSelected === 'curtoPrazoValue' ? 'white' : '#5a5a5a',
                                                            textShadow: valueSelected === 'curtoPrazoValue' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                                                        }}>
                                                        {clientData?.valuation?.valuationCalc?.curtoPrazoValue !== 'NaN' ?
                                                            clientData?.valuation?.valuationCalc?.curtoPrazoValue + ',00' : '0,00'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ideal Sale */}
                                    <div className="col-lg-4 col-md-6">
                                        <div className={`card border shadow-sm h-100 cursor-pointer transition-all ${valueSelected === 'valorIdealValue' ? 'border-3 border-secondary shadow-lg' : ''
                                            }`}
                                            style={{
                                                borderRadius: '20px',
                                                cursor: 'pointer',
                                                transform: valueSelected === 'valorIdealValue' ? 'translateY(-5px) scale(1.02)' : 'none',
                                                transition: 'all 0.3s ease',
                                                border: valueSelected === 'valorIdealValue' ? '3px solid #28a745' : 'none',
                                                background: valueSelected === 'valorIdealValue' ?
                                                    'linear-gradient(135deg, #faa954 0%, #f5874f 100%)' : 'white'
                                            }}
                                            onClick={() => setValueSelected('valorIdealValue')}>
                                            <div className="card-body text-center p-4">
                                                <div className="mb-3">
                                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                        style={{
                                                            width: '70px',
                                                            height: '70px',
                                                            backgroundColor: valueSelected === 'valorIdealValue' ? 'white' : '#faa954',
                                                            boxShadow: valueSelected === 'valorIdealValue' ? '0 8px 25px rgba(250, 169, 84, 0.3)' : 'none'
                                                        }}>
                                                        <FontAwesomeIcon
                                                            icon={faShoppingCart}
                                                            className="fs-3"
                                                            style={{ color: valueSelected === 'valorIdealValue' ? '#faa954' : 'white' }}
                                                        />
                                                    </div>
                                                </div>
                                                <h5 className="fw-bold mb-3"
                                                    style={{ color: valueSelected === 'valorIdealValue' ? 'white' : '#faa954' }}>
                                                    Venda Ideal
                                                    {valueSelected === 'valorIdealValue' && (
                                                        <div className="mt-2">
                                                            <span className="badge bg-light text-warning px-3 py-2 rounded-pill">
                                                                ✓ SELECIONADO
                                                            </span>
                                                        </div>
                                                    )}
                                                </h5>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <span className="fs-5 me-1"
                                                        style={{ color: valueSelected === 'valorIdealValue' ? 'white' : '#faa954' }}>
                                                        R$
                                                    </span>
                                                    <span className="fs-3 fw-bold"
                                                        style={{
                                                            color: valueSelected === 'valorIdealValue' ? 'white' : '#5a5a5a',
                                                            textShadow: valueSelected === 'valorIdealValue' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                                                        }}>
                                                        {clientData?.valuation?.valuationCalc?.valorIdealValue !== 'NaN' ?
                                                            clientData?.valuation?.valuationCalc?.valorIdealValue + ',00' : '0,00'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Long Term Sale */}
                                    <div className="col-lg-4 col-md-6">
                                        <div className={`card border shadow-sm h-100 cursor-pointer transition-all ${valueSelected === 'longoPrazoValue' ? 'border-3 border-secondary  shadow-lg' : ''
                                            }`}
                                            style={{
                                                borderRadius: '20px',
                                                cursor: 'pointer',
                                                transform: valueSelected === 'longoPrazoValue' ? 'translateY(-5px) scale(1.02)' : 'none',
                                                transition: 'all 0.3s ease',
                                                border: valueSelected === 'longoPrazoValue' ? '3px solid #28a745' : 'none',
                                                background: valueSelected === 'longoPrazoValue' ?
                                                    'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' : 'white'
                                            }}
                                            onClick={() => setValueSelected('longoPrazoValue')}>
                                            <div className="card-body text-center p-4">
                                                <div className="mb-3">
                                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                        style={{
                                                            width: '70px',
                                                            height: '70px',
                                                            backgroundColor: valueSelected === 'longoPrazoValue' ? 'white' : '#dc3545',
                                                            boxShadow: valueSelected === 'longoPrazoValue' ? '0 8px 25px rgba(220, 53, 69, 0.3)' : 'none'
                                                        }}>
                                                        <FontAwesomeIcon
                                                            icon={faWarning}
                                                            className="fs-3"
                                                            style={{ color: valueSelected === 'longoPrazoValue' ? '#dc3545' : 'white' }}
                                                        />
                                                    </div>
                                                </div>
                                                <h5 className="fw-bold mb-3"
                                                    style={{ color: valueSelected === 'longoPrazoValue' ? 'white' : '#dc3545' }}>
                                                    Venda Longo Prazo
                                                    {valueSelected === 'longoPrazoValue' && (
                                                        <div className="mt-2">
                                                            <span className="badge bg-light text-danger px-3 py-2 rounded-pill">
                                                                ✓ SELECIONADO
                                                            </span>
                                                        </div>
                                                    )}
                                                </h5>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <span className="fs-5 me-1"
                                                        style={{ color: valueSelected === 'longoPrazoValue' ? 'white' : '#dc3545' }}>
                                                        R$
                                                    </span>
                                                    <span className="fs-3 fw-bold"
                                                        style={{
                                                            color: valueSelected === 'longoPrazoValue' ? 'white' : '#5a5a5a',
                                                            textShadow: valueSelected === 'longoPrazoValue' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                                                        }}>
                                                        {clientData?.valuation?.valuationCalc?.longoPrazoValue !== 'NaN' ?
                                                            clientData?.valuation?.valuationCalc?.longoPrazoValue + ',00' : '0,00'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Value Option */}
                                <div className="row justify-content-center mb-4">
                                    <div className="col-lg-6">
                                        <div className={`card border-0 shadow-sm ${valueSelected === "customValue" ? 'border-3' : ''
                                            }`} style={{
                                                borderRadius: '15px',
                                                border: valueSelected === "customValue" ? '3px solid #28a745' : 'none',
                                                background: valueSelected === "customValue" ?
                                                    'linear-gradient(135deg, #5a5a5a 0%, #404040 100%)' : 'white'
                                            }}>
                                            <div className="card-body p-4">
                                                <div className="form-check text-center">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="customValueCheck"
                                                        onClick={() => setValueSelected("customValue")}
                                                        checked={valueSelected === "customValue"}
                                                    />
                                                    <label className="form-check-label fw-bold" htmlFor="customValueCheck"
                                                        style={{ color: valueSelected === "customValue" ? 'white' : '#5a5a5a' }}>
                                                        Os valores acima não atendem a minha necessidade
                                                        {valueSelected === "customValue" && (
                                                            <div className="mt-2">
                                                                <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                                                                    ✓ VALOR PERSONALIZADO
                                                                </span>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Value Input */}
                                {valueSelected === "customValue" && (
                                    <div className="row justify-content-center mb-4 fadeItem">
                                        <div className="col-lg-4 col-md-6">
                                            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                                <div className="card-body p-4">
                                                    <label className="form-label fw-bold text-center d-block mb-3" style={{ color: '#5a5a5a' }}>
                                                        Qual é o seu valor ideal?
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text" style={{ backgroundColor: '#f5874f', color: 'white', border: 'none' }}>
                                                            R$
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-lg text-end"
                                                            style={{ borderColor: '#f5874f' }}
                                                            onChange={e => setCustomValue(maskMoney(e.target.value))}
                                                            value={customValue}
                                                        />
                                                        <span className="input-group-text" style={{ backgroundColor: '#faa954', color: 'white', border: 'none' }}>
                                                            ,00
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Comment Section */}
                                {valueSelected && (
                                    <div className="row justify-content-center mb-5 fadeItem">
                                        <div className="col-lg-8">
                                            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                                <div className="card-body p-4">
                                                    <label htmlFor="valueComentInput" className="form-label fw-bold mb-3" style={{ color: '#5a5a5a' }}>
                                                        Existe algum motivo pela escolha deste valor?
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        id="valueComentInput"
                                                        rows="4"
                                                        style={{ borderColor: '#f5874f', borderRadius: '10px' }}
                                                        placeholder="Compartilhe seus motivos aqui..."
                                                        value={valueComment}
                                                        onChange={e => setValueComment(e.target.value)}>
                                                    </textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Continue Button */}
                                <div className="text-center py-5">
                                    <button
                                        type="button"
                                        className="btn btn-lg px-5 py-3 fw-bold fs-5"
                                        id="continueButton"
                                        disabled={!valueSelected || disabled}
                                        onClick={() => handleSave()}
                                        style={{
                                            backgroundColor: !valueSelected || disabled ? '#ccc' : '#f5874f',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '25px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={e => {
                                            if (!(!valueSelected || disabled)) {
                                                e.target.style.backgroundColor = '#faa954';
                                                e.target.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseOut={e => {
                                            if (!(!valueSelected || disabled)) {
                                                e.target.style.backgroundColor = '#f5874f';
                                                e.target.style.transform = 'translateY(0)';
                                            }
                                        }}>
                                        {loadingSave ? (
                                            <SpinnerSM className="mx-5" />
                                        ) : (
                                            <>
                                                Continuar 
                                            </>
                                        )}
                                    </button>

                                    {!valueSelected && (
                                        <div className="mt-3">
                                            <small className="text-danger">
                                                Para continuar você deve selecionar o valor do imóvel
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}