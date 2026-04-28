import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PortraitCard from '../../components/userCard/PortraitCard'
import styles from './valuation.module.scss'
import { faCheck, faEnvelope, faPhone, faShoppingCart, faStar, faWarning, faHome, faRulerCombined, faMapMarkerAlt, faBuilding, faChartLine, faCalculator, faEye, faClock, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import ClientFeatures from '../../valuation/ClientFeatures'
import PropertyCard from '../../valuation/PropertyCard'
import Map from '../../valuation/Map'
import { Home } from 'lucide-react'
import ClientFeaturesValuation from '../../clientsManagement/ClientFeaturesValuation'
import PropertiesMap from '../../valuation/PropertiesMap'

export default function ValuationPdf(props) {
    const { userData, clientData } = props

    // Função para organizar imagens em grupos para melhor distribuição
    const organizeImages = (images, maxPerPage = 12) => {
        const imageGroups = []
        for (let i = 0; i < images.length; i += maxPerPage) {
            imageGroups.push(images.slice(i, i + maxPerPage))
        }
        return imageGroups
    }

    const imageGroups = organizeImages(clientData?.files || [], 16)

    // Componente de rodapé
    const Footer = () => (
        <div className="position-absolute bottom-0 start-0 end-0 text-center py-2"
            style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6', fontSize: '12px', color: '#666' }}>
            <span>www.avaliaimobi.com.br | Relatório de Avaliação Imobiliária</span>
        </div>
    )

    return (
        <div id="valuationPdf" className={styles.reportContainer}>
            {/* PÁGINA 1 - CAPA E INTRODUÇÃO */}
            <div className={`${styles.page} position-relative`} style={{ paddingBottom: '40px' }}>
                {/* Header com gradient - reduzido */}
                <div className="position-relative mb-3" style={{
                    background: 'linear-gradient(135deg, #f5874f 0%, #faa954 100%)',
                    padding: '30px 25px',
                    borderRadius: '20px 20px',
                    marginBottom: '20px'
                }}>
                    <div className="row align-items-center">
                        <div className="col-12">
                            <h1 className="text-white fw-bold mb-2" style={{ fontSize: '26px' }}>
                                <Home className="me-3" />
                                Relatório de Avaliação Imobiliária
                            </h1>
                            <p className="text-white opacity-90 mb-0" style={{ fontSize: '15px' }}>
                                Análise técnica e posicionamento de mercado
                            </p>
                        </div>
                    </div>
                </div>

                {/* Saudação e Introdução - otimizado */}
                <div className="px-4 mb-3" style={{ height: '400px' }}>
                    <div className="row">
                        <div className="col-7 d-flex align-items-center h-100">
                            <div>
                                <h2 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '22px' }}>
                                    Olá, {clientData?.clientName}!
                                </h2>
                                <div className="text-justify lh-base" style={{ color: '#5a5a5a', fontSize: '13px' }}>
                                    <p className="mb-3" style={{ color: '#5a5a5a', lineHeight: '1.6' }}>
                                        Entender qual a posição do seu imóvel no mercado é o primeiro passo para realizar a venda com qualidade e segurança.
                                    </p>
                                    <p className="mb-3" style={{ color: '#5a5a5a', lineHeight: '1.6' }}>
                                        Realizei um estudo baseado nas características do seu imóvel e das ofertas similares na região para identificar o valor correto de venda.
                                    </p>
                                    <p className="mb-0" style={{ color: '#5a5a5a', lineHeight: '1.6' }}>
                                        O método comparativo direto de dados de mercado, conforme a NBR 14653, avalia um imóvel comparando-o com outros semelhantes vendidos recentemente ou em oferta. O processo envolve coletar dados, analisar os atributos (qualitativos e quantitativos) e realizar tratamentos técnicos (como homogeneização por fatores ou inferência estatística) para ajustar as diferenças e chegar ao valor do imóvel de forma objetiva.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-5 ">
                            <h6 className="fw-bold text-start mb-2" style={{ color: '#5a5a5a', fontSize: '14px' }}>
                                Estudo realizado por:
                            </h6>
                            <div className="row">
                                <div className="col-12 d-flex justify-content-center">
                                    <PortraitCard
                                        valuationPdf
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
                        </div>
                    </div>
                </div>

                {/* Seção de Estudo de Mercado - otimizado */}
                <div className="px-4">
                    <div className="bg-light rounded p-3 mb-3" style={{ borderLeft: '5px solid #f5874f' }}>
                        <h3 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '18px' }}>
                            Estudo de Mercado
                        </h3>
                        <div className="row">
                            <div className="col-6">
                                <h5 className="fw-bold mb-2" style={{ color: '#5a5a5a', fontSize: '15px' }}>
                                    Relação do preço com a velocidade de venda
                                </h5>
                                <p className="text-justify mb-2" style={{ color: '#666', fontSize: '12px', lineHeight: '1.4' }}>
                                    A velocidade de venda do seu imóvel está diretamente relacionada à precificação correta.
                                    Nosso histórico de vendas mostra que imóveis com avaliações acima do preço de mercado
                                    têm como resultado um processo de venda mais lento.
                                </p>
                                <div className="text-center">
                                    <img src='/VALUATION_PDF_1.png' alt="Gráfico de velocidade de venda"
                                        className="img-fluid" style={{ maxHeight: '160px' }} />
                                </div>
                            </div>
                            <div className="col-6">
                                <h5 className="fw-bold mb-2" style={{ color: '#5a5a5a', fontSize: '15px' }}>
                                    Benefícios da precificação correta:
                                </h5>
                                <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                                    <div className="mb-1">
                                        <FontAwesomeIcon icon={faCheck} className="me-2" style={{ color: '#28a745' }} />
                                        <span style={{ color: '#666' }}>Venda dentro de um prazo mais curto</span>
                                    </div>
                                    <div className="mb-1">
                                        <FontAwesomeIcon icon={faCheck} className="me-2" style={{ color: '#28a745' }} />
                                        <span style={{ color: '#666' }}>Menos inconvenientes durante o processo</span>
                                    </div>
                                    <div className="mb-1">
                                        <FontAwesomeIcon icon={faCheck} className="me-2" style={{ color: '#28a745' }} />
                                        <span style={{ color: '#666' }}>Maior número de clientes interessados</span>
                                    </div>
                                    <div className="mb-1">
                                        <FontAwesomeIcon icon={faCheck} className="me-2" style={{ color: '#28a745' }} />
                                        <span style={{ color: '#666' }}>Corretores motivados a mostrar o imóvel</span>
                                    </div>
                                    <div className="mb-1">
                                        <FontAwesomeIcon icon={faCheck} className="me-2" style={{ color: '#28a745' }} />
                                        <span style={{ color: '#666' }}>Ofertas mais competitivas</span>
                                    </div>
                                    <div className="mb-1">
                                        <FontAwesomeIcon icon={faCheck} className="me-2" style={{ color: '#28a745' }} />
                                        <span style={{ color: '#666' }}>Menor risco de desvalorização</span>
                                    </div>
                                    <div className="mb-1">
                                        <FontAwesomeIcon icon={faCheck} className="me-2" style={{ color: '#28a745' }} />
                                        <span style={{ color: '#666' }}>Representação exclusiva por corretor</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            {/* PÁGINA 2 - METODOLOGIA, CARACTERÍSTICAS E ANÁLISE TÉCNICA */}
            <div className={`${styles.page} position-relative`} style={{ paddingBottom: '40px' }}>
                {/* Metodologia - otimizado */}
                <div className="px-4 mb-3" style={{ paddingTop: '15px' }}>
                    <div className="text-center mb-3">
                        <h2 className="fw-bold" style={{ color: '#2c3e50', fontSize: '22px' }}>
                            Metodologia e Análise Técnica
                        </h2>
                        <div style={{ width: '80px', height: '3px', backgroundColor: '#f5874f', margin: '8px auto' }}></div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-6">
                            <div className="bg-light rounded p-3 h-100">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                                        style={{ width: '50px', height: '50px', backgroundColor: '#f5874f' }}>
                                        <span className="fw-bold text-white" style={{ fontSize: '18px' }}>
                                            {clientData?.valuation?.propertyArray?.length}
                                        </span>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1" style={{ color: '#2c3e50', fontSize: '14px' }}>
                                            Imóveis Analisados
                                        </h5>
                                        <p className="mb-0" style={{ color: '#666', fontSize: '12px' }}>
                                            Amostra representativa
                                        </p>
                                    </div>
                                </div>
                                <p className="mb-0" style={{ color: '#666', fontSize: '12px', lineHeight: '1.4' }}>
                                    O estudo é baseado em uma amostra de imóveis similares ao seu, considerando localização,
                                    tipologia, área e características físicas.
                                </p>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="bg-light rounded p-3 h-100">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                                        style={{ width: '50px', height: '50px', backgroundColor: '#28a745' }}>
                                        <FontAwesomeIcon icon={faCalculator} className="text-white" style={{ fontSize: '16px' }} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1" style={{ color: '#2c3e50', fontSize: '14px' }}>
                                            Análise Comparativa
                                        </h5>
                                        <p className="mb-0" style={{ color: '#666', fontSize: '12px' }}>
                                            Método técnico aplicado
                                        </p>
                                    </div>
                                </div>
                                <p className="mb-0" style={{ color: '#666', fontSize: '12px', lineHeight: '1.4' }}>
                                    Utilizamos fatores de homogeneização para ajustar diferenças entre os imóveis
                                    e obter valores mais precisos.
                                </p>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Características do Imóvel - otimizado e expandido */}
                <div className="px-4 mb-3">
                    <h3 className="fw-bold mb-2 text-center" style={{ color: '#2c3e50', fontSize: '18px' }}>
                        Características do Seu Imóvel
                    </h3>

                    <div className="card bg-light border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                        <div className="card-body p-2">
                            <ClientFeaturesValuation client={clientData} valuationPdf />
                        </div>
                    </div>
                </div>

                {/* Imagens do imóvel - layout otimizado sem distorção */}
                {imageGroups.length > 0 && (
                    <div className="mb-2 px-2">
                        <h4 className="fw-bold mb-2 text-center" style={{ color: '#2c3e50', fontSize: '14px' }}>
                            Imagens do Imóvel Avaliado
                        </h4>
                        {(() => {
                            const totalImages = imageGroups[0].length;
                            const displayImages = Math.min(totalImages, 12);

                            // Configurações otimizadas baseadas na quantidade de imagens
                            let colClass, containerHeight, aspectRatio;
                            if (displayImages <= 4) {
                                colClass = 'col-6'; // 2 por linha
                                containerHeight = '100px';
                                aspectRatio = '4/3';
                            } else if (displayImages <= 6) {
                                colClass = 'col-4'; // 3 por linha  
                                containerHeight = '85px';
                                aspectRatio = '4/3';
                            } else if (displayImages <= 9) {
                                colClass = 'col-4'; // 3 por linha
                                containerHeight = '70px';
                                aspectRatio = '3/2';
                            } else {
                                colClass = 'col-3'; // 4 por linha
                                containerHeight = '60px';
                                aspectRatio = '3/2';
                            }

                            return (
                                <div className="row g-1">
                                    {imageGroups[0].slice(0, displayImages).map((elem, index) => (
                                        <div key={index} className={colClass}>
                                            <div
                                                className="position-relative overflow-hidden rounded"
                                                style={{
                                                    width: '100%',
                                                    aspectRatio: aspectRatio, // Mantém proporção consistente
                                                    minHeight: containerHeight,
                                                    border: '1px solid #e0e0e0',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                <img
                                                    src={elem.url}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        objectPosition: 'center center' // Centraliza o recorte
                                                    }}
                                                    alt={`Imóvel ${index + 1}`}
                                                    onError={(e) => {
                                                        // Fallback caso a imagem não carregue
                                                        e.target.style.display = 'none';
                                                        e.target.parentNode.innerHTML = `
                                            <div class="d-flex align-items-center justify-content-center h-100 bg-light">
                                                <small class="text-muted">Sem imagem</small>
                                            </div>
                                        `;
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}

                        {/* Indicador se há mais imagens */}
                        {imageGroups[0].length > 12 && (
                            <div className="text-center mt-1">
                                <small className="text-muted" style={{ fontSize: '10px' }}>
                                    Exibindo 12 de {imageGroups[0].length} imagens disponíveis
                                </small>
                            </div>
                        )}
                    </div>
                )}
                <Footer />
            </div>

            {/* PÁGINA 3 - IMÓVEIS DE COMPARAÇÃO E ANÁLISE DETALHADA */}
            <div className={`${styles.page} position-relative`} style={{ paddingBottom: '40px' }}>
                <div className="px-4 mb-2" style={{ paddingTop: '15px' }}>
                    <div className="text-center mb-2">
                        <h2 className="fw-bold" style={{ color: '#2c3e50', fontSize: '22px' }}>
                            Imóveis de Comparação
                        </h2>
                        <div style={{ width: '80px', height: '3px', backgroundColor: '#f5874f', margin: '6px auto' }}></div>
                        <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>
                            Análise comparativa com imóveis similares na região
                        </p>
                    </div>

                    {/* Lista de propriedades de comparação - mais compacta */}
                    <div className="row mb-4">
                        <div className="d-flex col-12 flex-wrap justify-content-center ">
                            {clientData?.valuation?.propertyArray?.map((elem, index, array) => {

                                const customWidth = array.length === 4 ? '160px' : '180px';
                                const customScale = array.length === 4 ? 'scale(0.55)' : 'scale(0.6)';

                                return (
                                    <div
                                        key={index}
                                        className="mx-1 my-2"
                                        style={{ width: customWidth }} // Defina a largura e altura fixa
                                    >
                                        <div
                                            style={{
                                                transform: customScale,
                                                transformOrigin: 'top left',

                                                width: '300px', // Largura original do elemento
                                                height: '300px', // Altura original do elemento
                                            }}
                                        >
                                            <PropertyCard
                                                section="Todos Clientes"
                                                valuationView
                                                light

                                                elem={elem}
                                                index={index}
                                                setPropertyUrl={(value) => props.setPropertyUrl(value)}
                                            />
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>



                    {/* Mapa - altura dinâmica baseada no espaço restante */}
                    <div className="card bg-light border-0 shadow-sm mt-4" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                        <div className="card-header bg-gradient text-center py-1" style={{ backgroundColor: '#f5874f' }}>
                            <h5 className="text-dark mb-0 fw-bold" style={{ fontSize: '14px' }}>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                                Localização dos Imóveis Comparados
                            </h5>
                        </div>
                        <div className="card-body p-0">

                            <Map
                                location={{ lat: clientData?.latitude, lng: clientData?.longitude }}
                                zoom={20}
                                height={'100%'}
                                width="100%"
                                valuationPage
                                valuationPdf
                                porpertyLocations={clientData?.valuation?.propertyArray}
                            />
                            {/* <PropertiesMap valuationPdf light propertyArray={clientData?.valuation?.propertyArray} client={clientData} /> */}

                        </div>
                    </div>
                </div>
                <Footer />
            </div>


            {/* PÁGINA 5 - RESULTADOS DA AVALIAÇÃO E CONTATO */}
            <div className={`${styles.page} position-relative`} style={{ paddingBottom: '40px' }}>
                <div className="px-4" style={{ paddingTop: '15px' }}>
                    {/* Valor de Anúncio - otimizado */}
                    <div className="text-center mb-3">
                        <h2 className="fw-bold" style={{ color: '#2c3e50', fontSize: '22px' }}>
                            Resultado da Avaliação
                        </h2>
                        <div style={{ width: '80px', height: '3px', backgroundColor: '#f5874f', margin: '8px auto' }}></div>
                        <p style={{ color: '#666', fontSize: '13px' }}>
                            Sugestões de precificação baseadas no tempo de venda desejado
                        </p>
                    </div>

                    <div className="row justify-content-center mb-4">
                        <div className="col-11">
                            <div className="row g-2">
                                {/* Venda Curto Prazo */}
                                <div className="col-4">
                                    <div className="card bg-light border-0 shadow-sm text-center" style={{ borderRadius: '15px', border: '2px solid #28a745' }}>
                                        <div className="card-body p-2">
                                            <div className="mb-2">
                                                <div className="d-inline-block p-2 rounded" style={{ backgroundColor: '#e8f5e8' }}>
                                                    <FontAwesomeIcon icon={faStar} style={{ color: '#28a745', fontSize: '20px' }} />
                                                </div>
                                            </div>
                                            <h6 className="fw-bold mb-1" style={{ color: '#28a745', fontSize: '12px' }}>
                                                Venda Curto Prazo
                                            </h6>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <span className="me-1" style={{ color: '#666', fontSize: '12px' }}>R$</span>
                                                <span className="fw-bold" style={{ color: '#2c3e50', fontSize: '16px' }}>
                                                    {clientData?.valuation?.valuationCalc?.curtoPrazoValue !== 'NaN' ?
                                                        clientData?.valuation?.valuationCalc?.curtoPrazoValue + ',00' : '0,00'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Venda Ideal */}
                                <div className="col-4">
                                    <div className="card bg-light border-0 shadow-sm text-center" style={{ borderRadius: '15px', border: '2px solid #faa954' }}>
                                        <div className="card-body p-2">
                                            <div className="mb-2">
                                                <div className="d-inline-block p-2 rounded" style={{ backgroundColor: '#fff3e0' }}>
                                                    <FontAwesomeIcon icon={faShoppingCart} style={{ color: '#faa954', fontSize: '20px' }} />
                                                </div>
                                            </div>
                                            <h6 className="fw-bold mb-1" style={{ color: '#faa954', fontSize: '12px' }}>
                                                Venda Ideal
                                            </h6>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <span className="me-1" style={{ color: '#666', fontSize: '12px' }}>R$</span>
                                                <span className="fw-bold" style={{ color: '#2c3e50', fontSize: '16px' }}>
                                                    {clientData?.valuation?.valuationCalc?.valorIdealValue !== 'NaN' ?
                                                        clientData?.valuation?.valuationCalc?.valorIdealValue + ',00' : '0,00'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Venda Longo Prazo */}
                                <div className="col-4">
                                    <div className="card bg-light border-0 shadow-sm text-center" style={{ borderRadius: '15px', border: '2px solid #dc3545' }}>
                                        <div className="card-body p-2">
                                            <div className="mb-2">
                                                <div className="d-inline-block p-2 rounded" style={{ backgroundColor: '#ffeaea' }}>
                                                    <FontAwesomeIcon icon={faWarning} style={{ color: '#dc3545', fontSize: '20px' }} />
                                                </div>
                                            </div>
                                            <h6 className="fw-bold mb-1" style={{ color: '#dc3545', fontSize: '12px' }}>
                                                Venda Longo Prazo
                                            </h6>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <span className="me-1" style={{ color: '#666', fontSize: '12px' }}>R$</span>
                                                <span className="fw-bold" style={{ color: '#2c3e50', fontSize: '16px' }}>
                                                    {clientData?.valuation?.valuationCalc?.longoPrazoValue !== 'NaN' ?
                                                        clientData?.valuation?.valuationCalc?.longoPrazoValue + ',00' : '0,00'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Explicação dos valores */}
                    <div className="card bg-light border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                        <div className="card-body p-3">
                            <h5 className="fw-bold mb-2 text-center" style={{ color: '#2c3e50', fontSize: '16px' }}>
                                Entenda os Valores Sugeridos
                            </h5>
                            <div className="row">
                                <div className="col-4 text-center">
                                    <div className="mb-2">
                                        <div className="d-inline-block p-2 rounded" style={{ backgroundColor: '#e8f5e8' }}>
                                            <FontAwesomeIcon icon={faStar} style={{ color: '#28a745', fontSize: '20px' }} />
                                        </div>
                                    </div>
                                    <p style={{ color: '#666', fontSize: '11px', lineHeight: '1.4' }}>
                                        <strong>Curto Prazo:</strong> Valor mais agressivo para venda rápida,
                                        ideal para quem tem urgência ou flexibilidade no preço.
                                    </p>
                                </div>
                                <div className="col-4 text-center">
                                    <div className="mb-2">
                                        <div className="d-inline-block p-2 rounded" style={{ backgroundColor: '#fff3e0' }}>
                                            <FontAwesomeIcon icon={faShoppingCart} style={{ color: '#faa954', fontSize: '20px' }} />
                                        </div>
                                    </div>
                                    <p style={{ color: '#666', fontSize: '11px', lineHeight: '1.4' }}>
                                        <strong>Valor Ideal:</strong> Preço equilibrado que concilia
                                        valor justo e tempo razoável de venda. Recomendado.
                                    </p>
                                </div>
                                <div className="col-4 text-center">
                                    <div className="mb-2">
                                        <div className="d-inline-block p-2 rounded" style={{ backgroundColor: '#ffeaea' }}>
                                            <FontAwesomeIcon icon={faWarning} style={{ color: '#dc3545', fontSize: '20px' }} />
                                        </div>
                                    </div>
                                    <p style={{ color: '#666', fontSize: '11px', lineHeight: '1.4' }}>
                                        <strong>Longo Prazo:</strong> Valor mais alto, mas pode
                                        resultar em tempo prolongado no mercado.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seção de Contato - integrada na mesma página */}
                    <div className="mt-4">
                        {/* Logo centralizada - menor */}


                        {/* Informações de contato - compactas */}
                        <div className="card bg-light border-0 mb-4 shadow-sm" style={{ borderRadius: '15px', backgroundColor: '#f8f9fa' }}>
                            <div className="card-body p-3">
                                <div className="text-center mb-2">
                                    <h4 className="fw-bold" style={{ color: '#2c3e50', fontSize: '18px' }}>
                                        Próximos Passos
                                    </h4>
                                    <div style={{ width: '50px', height: '2px', backgroundColor: '#f5874f', margin: '8px auto' }}></div>
                                    <p style={{ color: '#666', fontSize: '12px' }}>
                                        Vamos conversar sobre a estratégia ideal para seu imóvel
                                    </p>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <div className="mb-2">
                                            <h6 className="fw-bold mb-1" style={{ color: '#5a5a5a', fontSize: '14px' }}>Profissional</h6>
                                            <p className="mb-1 fw-bold" style={{ color: '#2c3e50', fontSize: '15px' }}>
                                                {userData?.firstName} {userData?.lastName}
                                            </p>
                                            <p className="mb-0" style={{ color: '#666', fontSize: '13px' }}>
                                                {userData?.companyName}
                                            </p>
                                            {userData?.creci && (
                                                <p className="mb-0" style={{ color: '#666', fontSize: '12px' }}>
                                                    CRECI: {userData?.creci}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="mb-2">
                                            <h6 className="fw-bold mb-1" style={{ color: '#5a5a5a', fontSize: '14px' }}>Contatos</h6>
                                            <div className="mb-1">
                                                <FontAwesomeIcon icon={faPhone} className="me-2" style={{ color: '#f5874f' }} />
                                                <a href={"https://wa.me/55" + userData?.telefone}  target="_blank">

                                                    <span style={{ color: '#2c3e50', fontSize: '13px' }}>
                                                        {userData?.telefone} / {userData?.celular}
                                                    </span>
                                                </a>
                                            </div>
                                            <div className="mb-1">
                                                <FontAwesomeIcon icon={faEnvelope} className="me-2" style={{ color: '#f5874f' }} />
                                                <span style={{ color: '#2c3e50', fontSize: '13px' }}>
                                                    {userData?.workEmail}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div className="text-center ">
                            {userData?.logo && (
                                <img src={userData?.logo} alt="Logo"
                                    style={{
                                        maxHeight: "225px",
                                        maxWidth: "275px",
                                        height: "auto",
                                        width: "auto",
                                    }} />
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}