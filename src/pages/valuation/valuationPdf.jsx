import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PortraitCard from '../../components/userCard/PortraitCard'
import styles from './valuation.module.scss'
import { faCheck, faShoppingCart, faStar, faWarning } from '@fortawesome/free-solid-svg-icons'
import ClientFeatures from '../../valuation/ClientFeatures'
import PropertyCard from '../../valuation/PropertyCard'
import Map from '../../valuation/Map'


export default function ValuationPdf(props) {

    const { userData, clientData } = props


    return (
        <div id="valuationPdf" className={styles.reportContainer}>
            <div className={styles.page}>
                <div className="row px-5">
                    <div className="col-6 d-flex flex-column" >
                        <span className="fw-bold text-main">Olá, {clientData?.clientName}!</span>
                        <span className="mt-3 text-main">Entender qual a posição do seu imóvel no mercado é o primeiro passo para realizar a venda com qualidade e segurança. Para isso, realizei um estudo feito com base nas características do seu imóvel e das ofertas de imóveis similares na região.</span>
                        <span className="mt-3 text-main">O objetivo principal deste estudo é identificar qual o valor correto de venda. É este valor que irá posicionar o seu imóvel com destaque no mercado, não fazendo com que ele ajude a vender os imóveis concorrentes.</span>
                    </div>
                    <div className="col-6 px-5">
                        <label htmlFor="" className="fw-bold small">Estudo feito por:</label>
                        <PortraitCard valuationPdf
                            firstName={userData?.firstName}
                            lastName={userData?.lastName}
                            creci={userData?.creci}
                            email={userData?.workEmail}
                            celular={userData?.celular}
                            telefone={userData?.telefone}
                            profileImageUrl={userData?.profileImageUrl}
                            headerImg={userData?.backgroundImageUrl}
                            logo={userData?.logo}
                        />
                    </div>
                </div>
                <div style={{ position: 'relative', top: '-125px' }}>
                    <hr />

                    <div className="row">
                        <div className="col-12 d-flex justify-content-center  ">
                            <span className=" fw-bold text-main text-center ">Estudo de mercado</span>
                        </div>

                    </div>
                    <div className="row my-5 px-5" >
                        <div className="col-6 d-flex justify-content-center  ">
                            <div className="row ">

                                <span className="fw-bold text-main">Relação do preço com a velocidade de venda.</span>
                                <span className="mt-3 text-main">A velocidade de venda do seu imóvel está diretamente relacionada a precificação correta. Nosso histórico de vendas mostra que, imóveis com avaliações acima do preço de mercado, tem como resultado um processo de venda mais lento. Além de demorar mais, muitas vezes o valor final de venda é ainda inferior ao valor real de mercado, o que ocasiona perda de patrimônio.</span>
                                <div className="col-12 mt-4">
                                    <img src='/VALUATION_PDF_1.png' alt="" className="w-100" />
                                </div>
                            </div>


                        </div>
                        <div className="col-6 d-flex justify-content-center  ">
                            <div className="row small">

                                <span className="my-0 py-0 text-main"><FontAwesomeIcon icon={faCheck} className="me-1" style={{ color: '#00c661' }} />Venda dentro de um prazo mais curto.</span>
                                <span className="my-0 py-0 text-main"><FontAwesomeIcon icon={faCheck} className=" me-1" style={{ color: '#00c661' }} />Menos inconvenientes.</span>
                                <span className="my-0 py-0 text-main"><FontAwesomeIcon icon={faCheck} className=" me-1" style={{ color: '#00c661' }} />Mais clientes interessados, logo, um maior número de visitas.</span>
                                <span className="my-0 py-0 text-main"><FontAwesomeIcon icon={faCheck} className=" me-1" style={{ color: '#00c661' }} />Corretores motivados em mostrar o imóvel aos seus clientes.</span>
                                <span className="my-0 py-0 text-main"><FontAwesomeIcon icon={faCheck} className=" me-1" style={{ color: '#00c661' }} />Ofertas mais altas.</span>
                                <span className="my-0 py-0 text-main"><FontAwesomeIcon icon={faCheck} className=" me-1" style={{ color: '#00c661' }} />Menos chances de perder dinheiro.</span>
                                <span className="my-0 py-0 text-main"><FontAwesomeIcon icon={faCheck} className=" me-1" style={{ color: '#00c661' }} />Seu imóvel representado por apenas um corretor.</span>


                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className={styles.page}>

                <div className="row d-flex">

                    <div className="row ">
                        <div className="col-12 d-flex justify-content-center">
                            <span className=" fw-bold text-main text-center me-3">Metodologia aplicada</span>
                        </div>

                    </div>

                    <div className="row my-3">
                        <div className="col-12  d-flex justify-content-center px-0 px-lg-5">
                            <div className="row ">

                                <span className=" mt-3 text-main">O estudo é feito a partir de uma amostra de {clientData?.valuation?.propertyArray?.length} imóveis com características similares ao seu que nos permite entender o posicionamento do seu imóvel no mercado. São imóveis com áreas privativas, região, tipologias, itens de infraestrutura, idade de construção e condições parecidas com a do imóvel analisado.</span>
                                <span className=" mt-3 text-main">As informações obtidas são cruzadas, sofrem ações de variáveis que influenciam diretamente no preço final do imóvel, para então chegarmos em uma sugestão de precificação mais assertiva.</span>

                            </div>


                        </div>
                    </div>
                    <hr />

                    <div className="row mt-3">
                        <div className="col-12  d-flex justify-content-center">
                            <div className="row ">
                                <span className=" fw-bold text-main">Características do seu imóvel</span>

                            </div>
                        </div>
                    </div>

                    <div className="row d-flex justify-content-center">
                        <div className="col-12 col-lg-12 col-xl-8 d-flex justify-content-center">
                            <div className="card">
                                <div className="row">
                                    <div className="col-12  my-1">
                                        <ClientFeatures client={clientData} valuationPdf />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-12  d-flex justify-content-center">
                            <div className="row ">
                                <span className=" fw-bold text-main">Imagens do imóvel</span>
                            </div>
                        </div>
                        <div className="col-12 d-flex justify-content-center flex-wrap">
                            {clientData?.files?.slice(0, 20).map((elem, index) => (
                                <img src={elem.url} height={'100px'} className="mx-1" key={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.page}>
                <div className="row ">
                    <div className="col-12  d-flex justify-content-center">
                        <div className="row px-5">
                            <span className="fw-bold text-main">Imóveis de comparação</span>

                        </div>
                    </div>
                </div>
                <div className="row ">
                    <div className="d-flex col-12 flex-wrap ">
                        {clientData?.valuation?.propertyArray?.map((elem, index) => (
                            <div
                                key={index}
                                className="mx-1 my-4"
                                style={{ width: '180px' }} // Defina a largura e altura fixa
                            >
                                <div
                                    style={{
                                        transform: 'scale(0.6)',
                                        transformOrigin: 'top left',

                                        width: '300px', // Largura original do elemento
                                        height: '300px', // Altura original do elemento
                                    }}
                                >
                                    <PropertyCard
                                        section="Todos Clientes"
                                        valuationView
                                        valuationPdf
                                        elem={elem}
                                        index={index}
                                        setPropertyUrl={(value) => props.setPropertyUrl(value)}
                                    />
                                </div>
                            </div>
                        ))}
                        {clientData?.valuation?.propertyArray?.map((elem, index) => (
                            <div
                                key={index}
                                className="mx-1 my-4"
                                style={{ width: '180px' }} // Defina a largura e altura fixa
                            >
                                <div
                                    style={{
                                        transform: 'scale(0.6)',
                                        transformOrigin: 'top left',

                                        width: '300px', // Largura original do elemento
                                        height: '300px', // Altura original do elemento
                                    }}
                                >
                                    <PropertyCard
                                        section="Todos Clientes"
                                        valuationView
                                        valuationPdf
                                        elem={elem}
                                        index={index}
                                        setPropertyUrl={(value) => props.setPropertyUrl(value)}
                                    />
                                </div>
                            </div>
                        ))}
                        {clientData?.valuation?.propertyArray?.map((elem, index) => (
                            <div
                                key={index}
                                className="mx-1 my-4"
                                style={{ width: '180px' }} // Defina a largura e altura fixa
                            >
                                <div
                                    style={{
                                        transform: 'scale(0.6)',
                                        transformOrigin: 'top left',

                                        width: '300px', // Largura original do elemento
                                        height: '300px', // Altura original do elemento
                                    }}
                                >
                                    <PropertyCard
                                        section="Todos Clientes"
                                        valuationView
                                        valuationPdf
                                        elem={elem}
                                        index={index}
                                        setPropertyUrl={(value) => props.setPropertyUrl(value)}
                                    />
                                </div>
                            </div>
                        ))}



                    </div>
                </div>
                <div className="row d-flex justify-content-center mb-5 bg-danger">
                    <div className="col-11 col-lg-8 ">
                        <Map location={{ lat: clientData.latitude, lng: clientData.longitude }}
                            zoom={30} height="350px" valuationPage
                            porpertyLocations={clientData?.valuation?.propertyArray} />
                    </div>
                </div>

            </div>

            <div className={styles.page}>
                <div className="row ">
                    <div className="col-12 d-flex justify-content-center">
                        <span className=" fw-bold text-main text-center me-3">Valor de avaliação</span>
                    </div>

                </div>
                <div className="row d-flex justify-content-center mb-5">
                    <div className="col-12 col-lg-8">
                        <div className="row d-flex">
                            <div className="col-12  col-md-6 p-2">
                                <div className="card">

                                    <div className="card-body text-center">
                                        <span className="bold ">Valor do m²</span>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span className="text-success me-1 ">R$</span>
                                            <span className="text-secondary  fw-bold">{clientData?.valuation?.valuationCalc?.valorMetroQuadrado},00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12  col-md-6 p-2">
                                <div className="card">

                                    <div className="card-body text-center">
                                        <span className="bold ">{clientData?.valuation?.valuationCalc?.areaPrivativa ? "Área privativa" : "Área total"}</span>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span className="text-secondary  fw-bold">{clientData?.valuation?.valuationCalc?.areaPrivativa ? clientData?.areaTotalPrivativa : clientData?.areaTotal}</span>
                                            <span className="text-success ms-1 ">m²</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12   p-2">
                                <div className="card">

                                    <div className="card-body text-center">
                                        <span className="bold ">Valor</span>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <span className="text-success me-1 ">R$</span>
                                            <span className="text-secondary  fw-bold">{clientData?.valuation?.valuationCalc?.valorAvaliacao},00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-center">
                        <span className=" fw-bold text-main text-center me-3">Valor de anúncio</span>
                    </div>
                    <div className="col-12 mb-5 " >


                        <div className="row d-flex justify-content-center px-2">
                            <div className="col-4 px-1 my-1">

                                <span className={`card rounded-pill shadow cardAnimation `} type="button" onClick={() => setValueSelected('curtoPrazoValue')}>
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

                                <span className={`card rounded-pill shadow cardAnimation `} type="button" onClick={() => setValueSelected('valorIdealValue')}>
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

                                <span className={`card  rounded-pill shadow  cardAnimation `} type="button" onClick={() => setValueSelected('longoPrazoValue')}>
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



                        </div>

                    </div>
                </div>






            </div>
        </div>
    )
}