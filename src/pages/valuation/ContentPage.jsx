import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LandscapeCard from "../../components/userCard/LandscapeCard";
import PortraitCard from "../../components/userCard/PortraitCard";
import { faCheck, faChartLine, faBullhorn, faHandshake, faClock, faUsers, faTrophy } from "@fortawesome/free-solid-svg-icons";
import Icons from "../../components/icons";
import { ChevronRight } from "lucide-react";

export default function ContentPage(props) {
    const userData = props.userData
    const clientData = props.clientData

    return (
        <div className="container-fluid p-0">
            <div className="row justify-content-center align-items-center min-vh-100 m-0">
                <div className="col-12 col-xxl-10">
                    <div className="card shadow-lg border-0" style={{ minHeight: '95vh', borderRadius: '20px' }}>
                        <div className="card-body p-0" style={{ overflowY: 'auto', maxHeight: '95vh' }}>

                            {/* Header Section */}
                            <div className="text-center py-5" style={{ background: 'linear-gradient(135deg, #f5874f 0%, #faa954 100%)', borderRadius: '20px 20px 0 0' }}>
                                <div className="container">
                                    <h1 className="display-4 fw-bold text-white mb-3">
                                        <FontAwesomeIcon icon={faHandshake} className="me-3" />
                                        Olá, {clientData?.clientName}!
                                    </h1>
                                    <p className="lead text-white opacity-90 mb-0">Seu estudo de mercado personalizado está pronto</p>
                                </div>
                            </div>

                            <div className="container py-5">
                                {/* Introduction Section */}
                                <div className="row justify-content-center mb-5">
                                    <div className="col-lg-6 mb-4 mb-lg-0">
                                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                            <div className="card-body p-4 d-flex flex-column justify-content-center aling-items-start">
                                                <div className="mb-4">
                                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                        style={{ width: '60px', height: '60px', backgroundColor: '#f5874f' }}>
                                                        <FontAwesomeIcon icon={faChartLine} className="fs-4 text-white" />
                                                    </div>
                                                </div>
                                                <h3 className="fw-bold mb-3" style={{ color: '#5a5a5a' }}>Avaliação Profissional</h3>
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

                                    <div className="col-lg-6">
                                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                            <div className="card-body p-4">
                                                <div className="text-center mb-4">
                                                    <h4 className="fw-bold" style={{ color: '#5a5a5a' }}>Estudo feito por:</h4>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <PortraitCard
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

                                <hr className="my-5" style={{ height: '3px', backgroundColor: '#f5874f', border: 'none', borderRadius: '2px' }} />

                                {/* Market Study Section */}
                                <div className="text-center mb-5">
                                    <h2 className="display-5 fw-bold mb-4" style={{ color: '#5a5a5a' }}>
                                        <FontAwesomeIcon icon={faChartLine} className="me-3" style={{ color: '#f5874f' }} />
                                        Estudo de Mercado
                                    </h2>
                                </div>

                                <div className="row align-items-center mb-5">
                                    <div className="col-lg-6 mb-4 mb-lg-0">
                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                            <div className="card-body p-4">
                                                <h3 className="fw-bold mb-4" style={{ color: '#f5874f' }}>
                                                    <FontAwesomeIcon icon={faClock} className="me-2" />
                                                    Relação Preço × Velocidade
                                                </h3>
                                                <p className="mb-4" style={{ color: '#5a5a5a', lineHeight: '1.6' }}>
                                                    A velocidade de venda do seu imóvel está diretamente relacionada à precificação correta.
                                                    Nosso histórico mostra que imóveis com avaliações acima do preço de mercado resultam em processos mais lentos.
                                                </p>
                                                <div className="alert alert-warning border-0" style={{ backgroundColor: '#fff3cd', borderRadius: '10px' }}>
                                                    <small className="text-warning-emphasis">
                                                        <FontAwesomeIcon icon={faHandshake} className="me-2" />
                                                        <strong>Dica:</strong> Além de demorar mais, o valor final pode ser inferior ao valor real de mercado.
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                            <img src='/GIF_VALUATION_01.gif' alt="Gráfico de velocidade de venda" className="h-100 p-2" style={{ height: '300px', objectFit: 'cover' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Benefits Section */}
                                <div className="row justify-content-center mb-5">
                                    <div className="col-lg-10">
                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
                                            <div className="card-body p-5">
                                                <h3 className="fw-bold text-white text-center mb-4">
                                                    <FontAwesomeIcon icon={faTrophy} className="me-2" />
                                                    Benefícios da Precificação Correta
                                                </h3>
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <div className="d-flex align-items-center">
                                                            <FontAwesomeIcon icon={faCheck} className="me-3 text-white" style={{ fontSize: '1.2rem' }} />
                                                            <span className="text-white">Venda dentro de um prazo mais curto</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="d-flex align-items-center">
                                                            <FontAwesomeIcon icon={faCheck} className="me-3 text-white" style={{ fontSize: '1.2rem' }} />
                                                            <span className="text-white">Menos inconvenientes</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="d-flex align-items-center">
                                                            <FontAwesomeIcon icon={faCheck} className="me-3 text-white" style={{ fontSize: '1.2rem' }} />
                                                            <span className="text-white">Mais clientes interessados e visitas</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="d-flex align-items-center">
                                                            <FontAwesomeIcon icon={faCheck} className="me-3 text-white" style={{ fontSize: '1.2rem' }} />
                                                            <span className="text-white">Corretores motivados</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="d-flex align-items-center">
                                                            <FontAwesomeIcon icon={faCheck} className="me-3 text-white" style={{ fontSize: '1.2rem' }} />
                                                            <span className="text-white">Ofertas mais altas</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="d-flex align-items-center">
                                                            <FontAwesomeIcon icon={faCheck} className="me-3 text-white" style={{ fontSize: '1.2rem' }} />
                                                            <span className="text-white">Menos chances de perder dinheiro</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-center mt-4">
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <FontAwesomeIcon icon={faCheck} className="me-3 text-white" style={{ fontSize: '1.2rem' }} />
                                                        <span className="text-white fw-bold">Seu imóvel representado por apenas um corretor</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-5" style={{ height: '3px', backgroundColor: '#f5874f', border: 'none', borderRadius: '2px' }} />

                                {/* Marketing Plan Section */}
                                <div className="text-center mb-5">
                                    <h2 className="display-5 fw-bold mb-4" style={{ color: '#5a5a5a' }}>
                                        <FontAwesomeIcon icon={faBullhorn} className="me-3" style={{ color: '#faa954' }} />
                                        Plano de Marketing
                                    </h2>
                                </div>

                                <div className="row align-items-center mb-5">
                                    <div className="col-lg-6 mb-4 mb-lg-0">
                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                            <div className="card-body p-4">
                                                <div className="mb-4">
                                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                        style={{ width: '60px', height: '60px', backgroundColor: '#faa954' }}>
                                                        <FontAwesomeIcon icon={faUsers} className="fs-4 text-white" />
                                                    </div>
                                                </div>
                                                <h3 className="fw-bold mb-3" style={{ color: '#faa954' }}>Marketing Digital de Alta Performance</h3>
                                                <p className="mb-0" style={{ color: '#5a5a5a', lineHeight: '1.6' }}>
                                                    Nosso plano contempla todos os aspectos básicos de divulgação e, através de marketing digital
                                                    de alta performance, colocamos seu imóvel para o maior número de clientes compradores possível.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                            <img src='/GIF_VALUATION_02.gif' alt="Estratégias de marketing" className="h-100" style={{ height: '300px', objectFit: 'cover' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Continue Button */}
                                <div className="text-center py-5">
                                    <button
                                        className="btn btn-lg px-5 py-3 fw-bold fs-5"
                                        data-bs-target="#valuationCarousel"
                                        data-bs-slide-to={2}
                                        style={{
                                            backgroundColor: '#f5874f',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '25px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 15px rgba(245, 135, 79, 0.3)'
                                        }}
                                        onMouseOver={e => {
                                            e.target.style.backgroundColor = '#faa954';
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(245, 135, 79, 0.4)';
                                        }}
                                        onMouseOut={e => {
                                            e.target.style.backgroundColor = '#f5874f';
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(245, 135, 79, 0.3)';
                                        }}>
                                        Continuar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}