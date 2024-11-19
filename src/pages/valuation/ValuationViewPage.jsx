import { useEffect, useState } from "react"
import Map from "../../valuation/Map"
import PropertyCard from "../../valuation/PropertyCard"
import PropertyUrlModal from "./PropertyUrlModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faShoppingCart, faStar, faWarning } from "@fortawesome/free-solid-svg-icons"
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
    // const userData = props.userData

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
        <div className="col-12 ">



            <div className="row  d-flex justify-content-center align-items-center">
                <div className="card " style={{ height: '98vh', width: '98vw', overflowY: 'scroll', overflowX: 'hidden' }}  >
                    <div className="row d-flex">

                        <div className="row mt-5">
                            <div className="col-12 d-flex justify-content-center">
                                <span className="fs-2 fw-bold text-main text-center me-3">Metodologia aplicada</span>
                            </div>

                        </div>

                        <div className="row my-5">
                            <div className="col-12  d-flex justify-content-center px-0 px-lg-5">
                                <div className="row px-5">

                                    <span className="fs-5 mt-3 text-main">O estudo é feito a partir de uma amostra de {clientData?.valuation?.propertyArray?.length} imóveis com características similares ao seu que nos permite entender o posicionamento do seu imóvel no mercado. São imóveis com áreas privativas, região, tipologias, itens de infraestrutura, idade de construção e condições parecidas com a do imóvel analisado.</span>
                                    <span className="fs-5 mt-3 text-main">As informações obtidas são cruzadas, sofrem ações de variáveis que influenciam diretamente no preço final do imóvel, para então chegarmos em uma sugestão de precificação mais assertiva.</span>

                                </div>


                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-12  d-flex justify-content-center">
                                <div className="row ">
                                    <span className="fs-4 fw-bold text-main">Características do seu imóvel</span>

                                </div>
                            </div>
                        </div>

                        <div className="row d-flex justify-content-center">
                            <div className="col-12 col-lg-12 col-xl-8 d-flex justify-content-center">
                                <div className="card">
                                    <div className="row">
                                        <div className="col-12 col-lg-6">
                                            <Swiper
                                                style={{
                                                    '--swiper-navigation-color': '#fff',
                                                    '--swiper-pagination-color': '#fff',
                                                    '--swiper-navigation-size': '25px',
                                                    zIndex: 0
                                                }}
                                                slidesPerView={1}
                                                pagination={{ clickable: false }}
                                                navigation>
                                                {clientData?.files?.map((elem, index) => (
                                                    <SwiperSlide key={index} className="text-center bg-secondary ">



                                                        <img src={elem.url} className={`imovel-img`} alt={`Slide ${index + 1}`} />

                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        </div>
                                        <div className="col-12 col-lg-6 text-center my-5">
                                            <ClientFeatures client={clientData} propertyAdd />



                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className="col-12  d-flex justify-content-center">
                                <div className="row px-5">
                                    <span className="fs-4 fw-bold text-main">Imóveis de comparação</span>

                                </div>
                            </div>
                        </div>
                        <div className="row ">
                            <div className=" d-flex col-12 " style={{ overflowX: 'scroll', width: '100%' }}>

                                {clientData?.valuation?.propertyArray?.map((elem, index) => {
                                    return (
                                        <div className="mx-1" style={{ width: '300px' }}>

                                            <PropertyCard section={'Todos Clientes'} valuationView
                                                elem={elem} index={index} setPropertyUrl={value => props.setPropertyUrl(value)}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center mb-5">
                            <div className="col-11 col-lg-8 ">
                                <Map location={{ lat: clientData.latitude, lng: clientData.longitude }}
                                    zoom={30} height="350px" valuationPage
                                    porpertyLocations={clientData?.valuation?.propertyArray} />
                            </div>
                        </div>




                        <hr />


                        <div className="row mt-5">
                            <div className="col-12 d-flex justify-content-center">
                                <span className="fs-2 fw-bold text-main text-center me-3">Valor de avaliação</span>
                            </div>

                        </div>
                        <div className="row d-flex justify-content-center mb-5">
                            <div className="col-12 col-lg-8">
                                <div className="row d-flex">
                                    <div className="col-12  col-md-6 p-2">
                                        <div className="card">

                                            <div className="card-body text-center">
                                                <span className="bold fs-5">Valor do m²</span>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <span className="text-success me-1 fs-5">R$</span>
                                                    <span className="text-secondary fs-3 fw-bold">{clientData?.valuation?.valuationCalc?.valorMetroQuadrado},00</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12  col-md-6 p-2">
                                        <div className="card">

                                            <div className="card-body text-center">
                                                <span className="bold fs-5">{clientData?.valuation?.valuationCalc?.areaPrivativa ? "Área privativa" : "Área total"}</span>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <span className="text-secondary fs-3 fw-bold">{clientData?.valuation?.valuationCalc?.areaPrivativa ? clientData?.areaTotalPrivativa : clientData?.areaTotal}</span>
                                                    <span className="text-success ms-1 fs-5">m²</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-12  col-md-6 p-2">
                                        <div className="card">

                                            <div className="card-body text-center">
                                                <span className="bold fs-5">Fórmula</span>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <span className="text-secondary fs-3 fw-bold"><b>AT</b> x <b>Vm²</b></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="col-12   p-2">
                                        <div className="card">

                                            <div className="card-body text-center">
                                                <span className="bold fs-5">Valor</span>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <span className="text-success me-1 fs-5">R$</span>
                                                    <span className="text-secondary fs-3 fw-bold">{clientData?.valuation?.valuationCalc?.valorAvaliacao},00</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className="col-12 d-flex justify-content-center">
                            <span className="fs-2 fw-bold text-main text-center me-3">Valor de anúncio</span>
                        </div>

                        <span className="fw-bold text-center text-main">Escolha o valor de sua preferência</span>
                        <div className="col-12 mb-5 ">

                            <div className="row d-flex justify-content-center px-2">
                                <div className="col-12 col-xxl-4 px-1 my-1">

                                    <span className={`card rounded-pill shadow cardAnimation ${valueSelected === 'curtoPrazoValue' ? 'border border-3 border-success shadow pulse zIndexMax ' : ''}`} type="button" onClick={() => setValueSelected('curtoPrazoValue')}>
                                        <div className={"card-body text-center "}>
                                            <div className={`${styles.cardIcon}`}>
                                                <div style={{
                                                    backgroundColor: '#00c661',
                                                }}>

                                                    <FontAwesomeIcon icon={faStar} className=" fs-3 text-white" />
                                                </div>
                                            </div>

                                            <span className=" fw-bold me-1 fs-3 " style={{ color: "#00c661" }}>
                                                Venda curto prazo
                                            </span> <br />
                                            <span className="text-success me-1 fs-5">R$</span>
                                            <span className="text-secondary fs-3 bold">{clientData?.valuation?.valuationCalc?.curtoPrazoValue !== 'NaN' ? clientData?.valuation?.valuationCalc?.curtoPrazoValue + ',00' : 0}</span>
                                        </div>
                                    </span>
                                </div>
                                <div className="col-12 col-xxl-4 px-1 my-1">

                                    <span className={`card rounded-pill shadow cardAnimation ${valueSelected === 'valorIdealValue' ? 'border border-3 border-success shadow pulse zIndexMax' : ''}`} type="button" onClick={() => setValueSelected('valorIdealValue')}>
                                        <div className={"card-body text-center "}>
                                            <div className={`${styles.cardIcon}`}>

                                                <div style={{
                                                    backgroundColor: '#fbba27',
                                                }}>

                                                    <FontAwesomeIcon icon={faShoppingCart} className=" fs-3 text-white" />
                                                </div>
                                            </div>

                                            <span className=" fw-bold me-1 fs-3 " style={{ color: "#fbba27" }}>Venda ideal</span> <br />
                                            <span className="text-success me-1 fs-5">R$</span>
                                            <span className="text-secondary fs-3 bold">{clientData?.valuation?.valuationCalc?.valorIdealValue !== 'NaN' ? clientData?.valuation?.valuationCalc?.valorIdealValue + ',00' : 0}</span>
                                        </div>
                                    </span>
                                </div>
                                <div className="col-12 col-xxl-4 px-1 my-1">

                                    <span className={`card  rounded-pill shadow  cardAnimation ${valueSelected === 'longoPrazoValue' ? 'border border-3 border-success shadow pulse zIndexMax' : ''}`} type="button" onClick={() => setValueSelected('longoPrazoValue')}>
                                        <div className={"card-body text-center "}>

                                            <div className={`${styles.cardIcon}`}>
                                                <div style={{
                                                    backgroundColor: '#e9083f',
                                                }}>

                                                    <FontAwesomeIcon icon={faWarning} className=" fs-3 text-white" />
                                                </div>
                                            </div>



                                            <span className=" fw-bold me-1 fs-3 " style={{ color: "#e9083f" }}>Venda longo prazo</span> <br />
                                            <span className="text-success me-1 fs-5">R$</span>
                                            <span className="text-secondary fs-3 bold">{clientData?.valuation?.valuationCalc?.longoPrazoValue !== 'NaN' ? clientData?.valuation?.valuationCalc?.longoPrazoValue + ',00' : 0}</span>
                                        </div>
                                    </span>
                                </div>
                                <div className="col-12 mt-5 d-flex justify-content-center">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="customValueCheck" onClick={() => setValueSelected("customValue")} checked={valueSelected === "customValue"} />
                                        <label class="form-check-label" for="customValueCheck">
                                            Os valores acima não atendem a minha necessidade
                                        </label>
                                    </div>
                                </div>
                                {valueSelected === "customValue" && (
                                    <div className="col-12 d-flex justify-content-center mt-3">
                                        <div>

                                            <label htmlFor="">Qual é o seu valor ideal?</label>
                                            <div className="input-group">
                                                <span className="input-group-text">R$</span>

                                                <input type="text" className="form-control text-end" id="customValueInput" onChange={e => setCustomValue(maskMoney(e.target.value))} value={customValue} />
                                                <span className="input-group-text">,00</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {valueSelected && (

                                    <div className=" col-12 col-xxl-8 px-1 my-5 fadeItem">
                                        <div class="mb-3">
                                            <label for="valueComentInput" class="form-label">Existe algum motivo pela escolha deste valor?</label>
                                            <textarea
                                                class="form-control"
                                                id="valueComentInput" rows="4"
                                                value={valueComment} onChange={e => setValueComment(e.target.value)}></textarea>
                                        </div>
                                    </div >
                                )}


                                <div className="col-12 d-flex justify-content-center my-5 mb-5">
                                    <div className="text-center">


                                        <button type="button" className="btn btn-light btn-lg fs-4" id="continueButton" disabled={!valueSelected || disabled} onClick={() => handleSave()}>
                                            {/* <button type="button" className="btn btn-light btn-lg fs-4" data-bs-target="#valuationCarousel" data-bs-slide-to={3} id="continueButton" disabled={!valueSelected}> */}

                                            {loadingSave ?

                                                <SpinnerSM className="mx-5" />
                                                :
                                                <>
                                                    Continuar <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
                                                </>
                                            }
                                        </button> <br />
                                        {!valueSelected && (

                                            <span className="small text-danger text-center">Para continuar você deve selecionar o valor do imóvel </span>
                                        )}

                                    </div>

                                </div>


                            </div>

                        </div>



                    </div>



                </div>
            </div>

        </div>
    )
}