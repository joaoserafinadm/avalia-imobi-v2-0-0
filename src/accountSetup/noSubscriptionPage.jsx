'use client'

import { faCheck, faPlus, faCreditCard, faQrcode } from "@fortawesome/free-solid-svg-icons";
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
    const [selectedPlan, setSelectedPlan] = useState('mensal'); // 'mensal' ou 'teste'

    const handleStripe = async (type) => {
        setLoading(true)
        const stripe = await stripePromise;
        // Faz a chamada à API para criar a sessão de checkout
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

        // Redireciona para o checkout do Stripe
        const result = await stripe.redirectToCheckout({
            sessionId: session.sessionId,
        });

        if (result.error) {
            // Exibe erro se algo der errado
            console.error(result.error.message);
        }

        setLoading(false)
    };


    const handlePixPayment = async () => {

        setLoadingPix(true);

        // console.log("token", token)

        await createMercadoPagoCheckout({
            user_id: token?.sub,
            email: token?.email,
        });

        setTimeout(() => {
            setLoadingPix(false);
        }, 7000);



    }

    // Função para verificar se o plano teste ainda está ativo
    const isSubscriptionActive = (subscriptionLimitDate) => {
        if (!subscriptionLimitDate) return false;

        const limitDate = new Date(subscriptionLimitDate);
        const currentDate = new Date();

        return currentDate <= limitDate;
    };

    // Função para formatar data para exibição
    const formatDateToBrazilian = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };


    return (
        <div className="row">
            <div className="col-12">
                {companyData.pixPaymentData?.subscription_limit_date ? (
                    isSubscriptionActive(companyData.pixPaymentData.subscription_limit_date) ? (
                        <div className="alert alert-success">
                            <span>
                                Seu plano teste está ativo até {formatDateToBrazilian(companyData.pixPaymentData.subscription_limit_date)}!
                            </span>
                        </div>
                    ) : (
                        <div className="alert alert-danger">
                            <span>
                                Seu plano teste expirou em {formatDateToBrazilian(companyData.pixPaymentData.subscription_limit_date)}!
                            </span>
                        </div>
                    )
                ) : (
                    <div className="alert alert-danger">
                        <span>Você ainda não possui uma assinatura!</span>
                    </div>
                )}
            </div>

            {/* Seletor de Planos */}
            <div className="col-12 mb-4">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0 text-center">Escolha seu plano</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {/* Plano Teste */}
                                    <div className="col-md-4 mb-3">
                                        <div
                                            className={`card ${companyData.pixPaymentData?.subscription_limit_date ? 'disabled' : ''} h-100 cursor-pointer ${selectedPlan === 'teste' ? 'border-success' : 'border-light'}`}
                                            onClick={() => setSelectedPlan('teste')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="card-body text-center">
                                                <div className="mb-3">
                                                    <FontAwesomeIcon icon={faQrcode} size="2x" className="text-success" />
                                                </div>
                                                <h6 className="card-title text-success">Plano <b>Teste</b></h6>
                                                <h4 className="text-success mb-2">R$ 39,90</h4>
                                                <p className="text-muted ">30 dias de acesso completo</p>
                                                <div className="badge bg-success mb-2">PIX Exclusivo</div>
                                                <ul className="list-unstyled text-start ">
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-success" />Todos os recursos</li>
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-success" />1 usuário incluído</li>
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-success" />30 dias de teste</li>
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-success" />Pagamento único</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Plano Mensal */}
                                    <div className="col-md-4 mb-3">
                                        <div
                                            className={`card h-100 cursor-pointer ${selectedPlan === 'mensal' ? 'border-orange' : 'border-light'}`}
                                            onClick={() => setSelectedPlan('mensal')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="card-body text-center">
                                                <div className="mb-3">
                                                    <FontAwesomeIcon icon={faCreditCard} size="2x" className="text-orange" />
                                                </div>
                                                <h6 className="card-title text-orange">Plano <b>Mensal</b></h6>
                                                <h4 className="text-orange mb-2">R$ 39,90<small>/mês</small></h4>
                                                <p className="text-muted ">Renovação automática</p>
                                                <div className="badge bg-orange mb-2">Cartão de Crédito</div>
                                                <ul className="list-unstyled text-start ">
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-orange" />Todos os recursos</li>
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-orange" />1 usuário incluído</li>
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-orange" />Usuários extras R$ 19,90</li>
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-orange" />Cancelamento a qualquer momento</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-md-4 mb-3">
                                        <div
                                            className={`card h-100 cursor-pointer ${selectedPlan === 'anual' ? 'border-primary' : 'border-light'}`}
                                            onClick={() => setSelectedPlan('anual')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="card-body text-center">
                                                <div className="mb-3">
                                                    <FontAwesomeIcon icon={faCreditCard} size="2x" className="text-primary" />
                                                </div>
                                                <h6 className="card-title text-primary">Plano <b>Anual</b></h6>
                                                <h4 className="text-primary mb-2">R$ 199,90<small>/ano</small></h4>
                                                <p className="text-muted ">Renovação automática</p>
                                                <div className="badge bg-primary mb-2">Cartão de Crédito</div>
                                                <ul className="list-unstyled text-start ">
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-primary" />Todos os recursos</li>
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-primary" />1 usuário incluído</li>
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-primary" />Usuários extras R$ 19,90</li>
                                                    <li><FontAwesomeIcon icon={faCheck} className="me-2 text-primary" />Cancelamento a qualquer momento</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botão de Ação */}
                                <div className="text-center mt-3">
                                    {selectedPlan === 'teste' && (
                                        loadingPix ? (
                                            <button className="btn btn-success btn-lg" disabled>
                                                Gerando PIX... <SpinnerSM className="ms-1" />
                                            </button>
                                        ) : (
                                            <button className="btn btn-success btn-lg pulse" onClick={handlePixPayment}>
                                                <FontAwesomeIcon icon={faQrcode} className="me-2" />
                                                Pagar com PIX - R$ 39,90
                                            </button>
                                        )
                                    )}

                                    {selectedPlan === 'mensal' && (
                                        loading ? (
                                            <button className="btn btn-orange btn-lg" disabled>
                                                Acessando checkout... <SpinnerSM className="ms-1" />
                                            </button>
                                        ) : (
                                            <button className="btn btn-orange btn-lg pulse" onClick={() => handleStripe('mensal')}>
                                                <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                                                Assinar por R$ 39,90/mês
                                            </button>
                                        )
                                    )}

                                    {selectedPlan === 'anual' && (
                                        loading ? (
                                            <button className="btn btn-primary btn-lg" disabled>
                                                Acessando checkout... <SpinnerSM className="ms-1" />
                                            </button>
                                        ) : (
                                            <button className="btn btn-primary btn-lg pulse" onClick={() => handleStripe('anual')}>
                                                <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                                                Assinar por R$ 199,90/ano
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informações detalhadas do plano selecionado */}
            {selectedPlan === 'mensal' && (
                <>
                    <div className="col-12 mt-3">
                        <span className="fw-bold text-orange">Plano Mensal - Detalhes</span>
                    </div>

                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 mt-3">
                                Nosso <b>plano mensal</b> começa com um valor de <b>R$39,90 por mês.</b>
                            </div>
                            <div className="col-12 mt-3">
                                Esse plano permite que você tenha acesso a <b>todos os recursos do Avalia Imobi</b>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <span className="fw-bold text-orange">Adição de usuários</span>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faPlus} className="me-2 text-success" />
                                Se você precisar de mais pessoas utilizando o sistema, cada usuário terá um custo adicional de <b>R$19,90 por mês</b>.
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <span className="fw-bold text-orange">Exemplos de preços</span>
                    </div>

                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />1 usuário (plano básico): R$39,90/mês
                            </div>
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />2 usuários: R$39,90 + R$19,90 = R$59,80/mês
                            </div>
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />5 usuários: R$39,90 + (4 x R$19,90) = R$119,50/mês
                            </div>
                        </div>
                    </div>
                </>
            )}
            {selectedPlan === 'anual' && (
                <>
                    <div className="col-12 mt-3">
                        <span className="fw-bold text-orange">Plano Anual - Detalhes</span>
                    </div>

                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 mt-3">
                                Nosso <b>plano mensal</b> começa com um valor de <b>R$199,90 por mês.</b>
                            </div>
                            <div className="col-12 mt-3">
                                Esse plano permite que você tenha acesso a <b>todos os recursos do Avalia Imobi</b>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <span className="fw-bold text-orange">Adição de usuários</span>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faPlus} className="me-2 text-success" />
                                Se você precisar de mais pessoas utilizando o sistema, cada usuário terá um custo adicional de <b>R$19,90 por ano</b>.
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <span className="fw-bold text-orange">Exemplos de preços</span>
                    </div>

                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />1 usuário (plano básico): R$199,90/ano
                            </div>
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />2 usuários: R$199,90 + R$19,90 = R$219,80/ano
                            </div>
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />5 usuários: R$199,90 + (4 x R$19,90) = R$276,50/ano
                            </div>
                        </div>
                    </div>
                </>
            )}

            {selectedPlan === 'teste' && (
                <>
                    <div className="col-12 mt-3">
                        <span className="fw-bold text-success">Plano Teste - Detalhes</span>
                    </div>

                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 mt-3">
                                O <b>plano teste</b> oferece <b>30 dias de acesso completo</b> por apenas <b>R$39,90</b>.
                            </div>
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />
                                Acesso a <b>todos os recursos</b> do Avalia Imobi
                            </div>
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />
                                <b>Pagamento único</b> via PIX - sem renovação automática
                            </div>
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />
                                Somente <b>1 usuário</b> incluído no plano teste
                            </div>
                            <div className="col-12 mt-3">
                                <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />
                                Ideal para <b>conhecer a plataforma</b> antes de assinar mensalmente
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <div className="alert alert-info">
                            <strong>💡 Dica:</strong> Após os 30 dias, você pode migrar para o plano mensal a qualquer momento para continuar usando todos os recursos.
                        </div>
                    </div>
                </>
            )}

            <div className="col-12 my-5 d-flex justify-content-center text-center">
                <span className="fw-bold">
                    Escolha o plano que melhor se adapta às suas necessidades!
                </span>
            </div>
        </div>
    );
}