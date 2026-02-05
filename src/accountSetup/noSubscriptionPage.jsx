'use client'

import { faCheck, faPlus, faCreditCard, faQrcode, faStar, faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken';
import { SpinnerSM } from "../components/loading/Spinners";
import useMercadoPago from "../../hooks/useMercadoPago";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function NoSubscriptionPage(props) {

    const { createMercadoPagoCheckout } = useMercadoPago();

    const token = jwt.decode(Cookie.get('auth'))

    const { companyData } = props

    const [loading, setLoading] = useState(false);
    const [loadingPix, setLoadingPix] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('mensal');

    const handleStripe = async (type) => {
        setLoading(true)
        const stripe = await stripePromise;
        const response = await fetch('/api/accountSetup/stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_id: token.company_id,
                user_id: token.sub,
                type
            })
        });
        const session = await response.json();

        setLoading(false)
        const result = await stripe.redirectToCheckout({
            sessionId: session.sessionId,
        });

        if (result.error) {
            console.error(result.error.message);
        }

        setLoading(false)
    };

    const handlePixPayment = async () => {
        setLoadingPix(true);
        await createMercadoPagoCheckout({
            user_id: token?.sub,
            email: token?.email,
        });

        setTimeout(() => {
            setLoadingPix(false);
        }, 7000);
    }

    const isSubscriptionActive = (subscriptionLimitDate) => {
        if (!subscriptionLimitDate) return false;
        const limitDate = new Date(subscriptionLimitDate);
        const currentDate = new Date();
        return currentDate <= limitDate;
    };

    const formatDateToBrazilian = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="container-fluid px-3 px-md-4 py-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)', minHeight: '100vh' }}>
            <div className="row justify-content-center">
                <div className="col-12 col-xl-11">
                    {/* Alert de Status */}
                    <div className="row mb-4">
                        <div className="col-12">
                            {companyData.pixPaymentData?.subscription_limit_date ? (
                                isSubscriptionActive(companyData.pixPaymentData.subscription_limit_date) ? (
                                    <div className="alert alert-success shadow-sm border-0" style={{ borderRadius: '12px' }}>
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faCheck} className="me-3" size="lg" />
                                            <span className="fw-semibold">
                                                Seu plano teste está ativo até {formatDateToBrazilian(companyData.pixPaymentData.subscription_limit_date)}!
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="alert alert-danger shadow-sm border-0" style={{ borderRadius: '12px' }}>
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faStar} className="me-3" size="lg" />
                                            <span className="fw-semibold">
                                                Seu plano teste expirou em {formatDateToBrazilian(companyData.pixPaymentData.subscription_limit_date)}!
                                            </span>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="alert alert-warning shadow-sm border-0" style={{ borderRadius: '12px' }}>
                                    <div className="d-flex align-items-center">
                                        <FontAwesomeIcon icon={faCrown} className="me-3" size="lg" />
                                        <span className="fw-semibold">Escolha um plano para começar a usar o Avalia Imobi!</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>Escolha o Plano Ideal</h2>
                        <p className="text-muted fs-5">Comece hoje e transforme sua gestão imobiliária</p>
                    </div>

                    {/* Cards de Planos */}
                    <div className="row g-4 mb-5">
                        {/* Plano Teste */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <div
                                className={`card h-100  shadow-sm position-relative ${companyData.pixPaymentData?.subscription_limit_date ? 'opacity-50' : ''} ${selectedPlan === 'teste' ? 'border-success border-2' : 'border-0'}`}
                                onClick={() => !companyData.pixPaymentData?.subscription_limit_date && setSelectedPlan('teste')}
                                style={{
                                    cursor: companyData.pixPaymentData?.subscription_limit_date ? 'not-allowed' : 'pointer',
                                    borderRadius: '16px',
                                    transform: selectedPlan === 'teste' ? 'scale(1.02)' : 'scale(1)',
                                    transition: 'all 0.3s ease',
                                    border: selectedPlan === 'teste' ? '3px solid #28a745' : '3px solid transparent'
                                }}
                            >
                                {selectedPlan === 'teste' && (
                                    <div className="position-absolute top-0 end-0 mt-3 me-3">
                                        <span className="badge bg-success rounded-pill px-3 py-2">
                                            <FontAwesomeIcon icon={faCheck} className="me-1" /> Selecionado
                                        </span>
                                    </div>
                                )}

                                <div className="card-body p-4">
                                    <div className="text-center mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                            style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
                                            <FontAwesomeIcon icon={faQrcode} size="2x" className="text-white" />
                                        </div>
                                        <h5 className="fw-bold mb-2" style={{ color: '#28a745' }}>Plano Teste</h5>
                                        <div className="mb-2">
                                            <span className="h2 fw-bold" style={{ color: '#28a745' }}>R$ 39,90</span>
                                        </div>
                                        <span className="badge" style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#28a745', padding: '6px 16px', borderRadius: '20px' }}>
                                            Pagamento via PIX
                                        </span>
                                    </div>

                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="text-success me-2 mt-1" />
                                            <span>30 dias de acesso completo</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="text-success me-2 mt-1" />
                                            <span>Todos os recursos incluídos</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="text-success me-2 mt-1" />
                                            <span>1 usuário</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="text-success me-2 mt-1" />
                                            <span>Pagamento único</span>
                                        </li>
                                        <li className="mb-0 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="text-success me-2 mt-1" />
                                            <span>Sem renovação automática</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Plano Mensal */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <div
                                className={`card h-100  shadow position-relative  ${selectedPlan === 'mensal' ? 'border-orange border-2' : 'border-0'}`}
                                onClick={() => setSelectedPlan('mensal')}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    transform: selectedPlan === 'mensal' ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'all 0.3s ease',
                                    border: selectedPlan === 'mensal' ? '3px solid #fd7e14' : '3px solid transparent'
                                }}
                            >
                                <div className="position-absolute top-0 start-50 translate-middle">
                                    <span className="badge bg-warning text-dark px-4 py-2 rounded-pill shadow-sm">
                                        <FontAwesomeIcon icon={faStar} className="me-1" /> Mais Popular
                                    </span>
                                </div>

                                {selectedPlan === 'mensal' && (
                                    <div className="position-absolute top-0 end-0 mt-3 me-3">
                                        <span className="badge rounded-pill px-3 py-2" style={{ background: '#fd7e14', color: 'white' }}>
                                            <FontAwesomeIcon icon={faCheck} className="me-1" /> Selecionado
                                        </span>
                                    </div>
                                )}

                                <div className="card-body p-4">
                                    <div className="text-center mb-4 mt-3">
                                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                            style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #fd7e14 0%, #ff922b 100%)' }}>
                                            <FontAwesomeIcon icon={faCreditCard} size="2x" className="text-white" />
                                        </div>
                                        <h5 className="fw-bold mb-2" style={{ color: '#fd7e14' }}>Plano Mensal</h5>
                                        <div className="mb-2">
                                            <span className="h2 fw-bold" style={{ color: '#fd7e14' }}>R$ 39,90</span>
                                            <span className="text-muted">/mês</span>
                                        </div>
                                        <span className="badge" style={{ background: 'rgba(253, 126, 20, 0.1)', color: '#fd7e14', padding: '6px 16px', borderRadius: '20px' }}>
                                            Renovação automática
                                        </span>
                                    </div>

                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="me-2 mt-1" style={{ color: '#fd7e14' }} />
                                            <span>Todos os recursos incluídos</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="me-2 mt-1" style={{ color: '#fd7e14' }} />
                                            <span>1 usuário incluído</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="me-2 mt-1" style={{ color: '#fd7e14' }} />
                                            <span>Usuários extras R$ 19,90</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="me-2 mt-1" style={{ color: '#fd7e14' }} />
                                            <span>Pagamento via cartão</span>
                                        </li>
                                        <li className="mb-0 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="me-2 mt-1" style={{ color: '#fd7e14' }} />
                                            <span>Cancele quando quiser</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Plano Anual */}
                         {/*<div className="col-12 col-md-6 col-lg-4">
                            <div
                                className={`card h-100  shadow position-relative  ${selectedPlan === 'anual' ? 'border-primary border-2' : 'border-0'}`}
                                onClick={() => setSelectedPlan('anual')}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    transform: selectedPlan === 'anual' ? 'scale(1.02)' : 'scale(1)',
                                    transition: 'all 0.3s ease',
                                    border: selectedPlan === 'anual' ? '3px solid #0d6efd' : '3px solid transparent'
                                }}
                            >
                                {selectedPlan === 'anual' && (
                                    <div className="position-absolute top-0 end-0 mt-3 me-3">
                                        <span className="badge bg-primary rounded-pill px-3 py-2">
                                            <FontAwesomeIcon icon={faCheck} className="me-1" /> Selecionado
                                        </span>
                                    </div>
                                )}

                                <div className="card-body p-4">
                                    <div className="text-center mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                            style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
                                            <FontAwesomeIcon icon={faCrown} size="2x" className="text-white" />
                                        </div>
                                        <h5 className="fw-bold mb-2 text-primary">Plano Anual</h5>
                                        <div className="mb-2">
                                            <span className="h2 fw-bold text-primary">R$ 199,90</span>
                                            <span className="text-muted">/ano</span>
                                        </div>
                                        <span className="badge" style={{ background: 'rgba(13, 110, 253, 0.1)', color: '#0d6efd', padding: '6px 16px', borderRadius: '20px' }}>
                                            Economize 58% 💰
                                        </span>
                                    </div>

                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="text-primary me-2 mt-1" />
                                            <span>Todos os recursos incluídos</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="text-primary me-2 mt-1" />
                                            <span>1 usuário incluído</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="text-primary me-2 mt-1" />
                                            <span>Usuários extras R$ 19,90</span>
                                        </li>
                                        <li className="mb-3 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="text-primary me-2 mt-1" />
                                            <span>Pagamento via cartão</span>
                                        </li>
                                        <li className="mb-0 d-flex align-items-start">
                                            <FontAwesomeIcon icon={faCheck} className="text-primary me-2 mt-1" />
                                            <span>Melhor custo-benefício</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
*/}
                    {/* Botão de Ação */}
                    <div className="row mb-5">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                                <div className="card-body p-4 text-center">
                                    {selectedPlan === 'teste' && (
                                        loadingPix ? (
                                            <button className="btn btn-success btn-lg px-5 py-3" disabled style={{ borderRadius: '12px' }}>
                                                <span className="me-2">Gerando PIX...</span>
                                                <SpinnerSM />
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-success btn-lg px-5 py-3 pulse"
                                                onClick={handlePixPayment}
                                                style={{
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faQrcode} className="me-2" />
                                                Pagar com PIX - R$ 39,90
                                            </button>
                                        )
                                    )}

                                    {selectedPlan === 'mensal' && (
                                        loading ? (
                                            <button className="btn btn-lg px-5 py-3" disabled style={{ borderRadius: '12px', background: '#fd7e14', border: 'none', color: 'white' }}>
                                                <span className="me-2">Acessando checkout...</span>
                                                <SpinnerSM />
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-lg px-5 py-3 pulse"
                                                onClick={() => handleStripe('mensal')}
                                                style={{
                                                    borderRadius: '12px',
                                                    background: '#fd7e14',
                                                    border: 'none',
                                                    color: 'white',
                                                    boxShadow: '0 4px 15px rgba(253, 126, 20, 0.3)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                                                Assinar por R$ 39,90/mês
                                            </button>
                                        )
                                    )}

                                    {selectedPlan === 'anual' && (
                                        loading ? (
                                            <button className="btn btn-primary btn-lg px-5 py-3" disabled style={{ borderRadius: '12px' }}>
                                                <span className="me-2">Acessando checkout...</span>
                                                <SpinnerSM />
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary btn-lg px-5 py-3 pulse"
                                                onClick={() => handleStripe('anual')}
                                                style={{
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                                                Assinar por R$ 199,90/ano
                                            </button>
                                        )
                                    )}

                                    <p className="text-muted mb-0 mt-3">
                                        <small>✓ Seguro e protegido · Cancele quando quiser</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detalhes do Plano */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                                <div className="card-body p-4 p-md-5">
                                    {selectedPlan === 'teste' && (
                                        <>
                                            <h4 className="fw-bold mb-4" style={{ color: '#28a745' }}>
                                                <FontAwesomeIcon icon={faQrcode} className="me-2" />
                                                Sobre o Plano Teste
                                            </h4>
                                            <div className="row g-4">
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-start mb-3">
                                                        <FontAwesomeIcon icon={faCheck} className="text-success me-3 mt-1" size="lg" />
                                                        <div>
                                                            <h6 className="fw-semibold mb-1">Acesso Completo</h6>
                                                            <p className="text-muted mb-0">30 dias de acesso a todos os recursos da plataforma</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-start mb-3">
                                                        <FontAwesomeIcon icon={faCheck} className="text-success me-3 mt-1" size="lg" />
                                                        <div>
                                                            <h6 className="fw-semibold mb-1">Pagamento Único</h6>
                                                            <p className="text-muted mb-0">Apenas R$ 39,90 via PIX, sem renovação</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-start mb-3">
                                                        <FontAwesomeIcon icon={faCheck} className="text-success me-3 mt-1" size="lg" />
                                                        <div>
                                                            <h6 className="fw-semibold mb-1">Ideal para Teste</h6>
                                                            <p className="text-muted mb-0">Conheça a plataforma antes de assinar</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-start mb-3">
                                                        <FontAwesomeIcon icon={faCheck} className="text-success me-3 mt-1" size="lg" />
                                                        <div>
                                                            <h6 className="fw-semibold mb-1">1 Usuário</h6>
                                                            <p className="text-muted mb-0">Perfeito para começar sozinho</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="alert alert-info border-0 mt-4" style={{ borderRadius: '12px', background: 'rgba(13, 202, 240, 0.1)' }}>
                                                <div className="d-flex align-items-start">
                                                    <span className="me-3" style={{ fontSize: '24px' }}>💡</span>
                                                    <div>
                                                        <strong>Dica:</strong> Após os 30 dias, você pode migrar para o plano mensal ou anual a qualquer momento!
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {selectedPlan === 'mensal' && (
                                        <>
                                            <h4 className="fw-bold mb-4" style={{ color: '#fd7e14' }}>
                                                <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                                                Sobre o Plano Mensal
                                            </h4>
                                            <p className="lead mb-4">
                                                O plano mensal oferece flexibilidade total com acesso a todos os recursos por apenas <strong>R$ 39,90/mês</strong>.
                                            </p>

                                            <h5 className="fw-semibold mb-3 mt-4">💼 Adicione Usuários</h5>
                                            <p className="mb-4">
                                                Cada usuário adicional custa apenas <strong>R$ 19,90/mês</strong>. Escale sua equipe conforme necessário!
                                            </p>

                                            <h5 className="fw-semibold mb-3">📊 Exemplos de Preços</h5>
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <div className="p-3" style={{ background: 'rgba(253, 126, 20, 0.05)', borderRadius: '12px' }}>
                                                        <div className="fw-bold mb-2" style={{ color: '#fd7e14' }}>1 Usuário</div>
                                                        <div className="h5 mb-0">R$ 39,90<small className="text-muted">/mês</small></div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="p-3" style={{ background: 'rgba(253, 126, 20, 0.05)', borderRadius: '12px' }}>
                                                        <div className="fw-bold mb-2" style={{ color: '#fd7e14' }}>2 Usuários</div>
                                                        <div className="h5 mb-0">R$ 59,80<small className="text-muted">/mês</small></div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="p-3" style={{ background: 'rgba(253, 126, 20, 0.05)', borderRadius: '12px' }}>
                                                        <div className="fw-bold mb-2" style={{ color: '#fd7e14' }}>5 Usuários</div>
                                                        <div className="h5 mb-0">R$ 119,50<small className="text-muted">/mês</small></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {selectedPlan === 'anual' && (
                                        <>
                                            <h4 className="fw-bold mb-4 text-primary">
                                                <FontAwesomeIcon icon={faCrown} className="me-2" />
                                                Sobre o Plano Anual
                                            </h4>
                                            <p className="lead mb-4">
                                                O plano anual oferece o melhor custo-benefício com acesso a todos os recursos por apenas <strong>R$ 199,90/ano</strong>. Economia de <strong className="text-success">58%</strong> comparado ao mensal!
                                            </p>

                                            <h5 className="fw-semibold mb-3 mt-4">💼 Adicione Usuários</h5>
                                            <p className="mb-4">
                                                Cada usuário adicional custa apenas <strong>R$ 19,90/ano</strong>. Construa sua equipe com economia!
                                            </p>

                                            <h5 className="fw-semibold mb-3">📊 Exemplos de Preços</h5>
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <div className="p-3" style={{ background: 'rgba(13, 110, 253, 0.05)', borderRadius: '12px' }}>
                                                        <div className="fw-bold mb-2 text-primary">1 Usuário</div>
                                                        <div className="h5 mb-0">R$ 199,90<small className="text-muted">/ano</small></div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="p-3" style={{ background: 'rgba(13, 110, 253, 0.05)', borderRadius: '12px' }}>
                                                        <div className="fw-bold mb-2 text-primary">2 Usuários</div>
                                                        <div className="h5 mb-0">R$ 219,80<small className="text-muted">/ano</small></div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="p-3" style={{ background: 'rgba(13, 110, 253, 0.05)', borderRadius: '12px' }}>
                                                        <div className="fw-bold mb-2 text-primary">5 Usuários</div>
                                                        <div className="h5 mb-0">R$ 279,50<small className="text-muted">/ano</small></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert border-0 mt-4" style={{ borderRadius: '12px', background: 'rgba(25, 135, 84, 0.1)' }}>
                                                <div className="d-flex align-items-start">
                                                    <span className="me-3" style={{ fontSize: '24px' }}>💰</span>
                                                    <div>
                                                        <strong className="text-success">Economia Garantida:</strong> Pagando anualmente, você economiza mais de R$ 278 por ano comparado ao plano mensal!
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-5 mb-4">
                        <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>
                            Escolha o plano que melhor se adapta às suas necessidades!
                        </h5>
                        <p className="text-muted">
                            <small>Dúvidas? Entre em contato com nosso suporte</small>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .card {
                    transition: all 0.3s ease;
                }
                
                .card:hover {
                    transform: translateY(-5px) !important;
                }
                
                .btn {
                    transition: all 0.3s ease;
                }
                
                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
                }
                
                .pulse {
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(253, 126, 20, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(253, 126, 20, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(253, 126, 20, 0);
                    }
                }

                @media (max-width: 768px) {
                    .card-body {
                        padding: 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
