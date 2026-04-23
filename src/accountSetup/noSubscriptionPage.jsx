'use client'

import { faCheck, faCreditCard, faQrcode, faStar, faCrown, faCircleInfo, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken';
import { SpinnerSM } from "../components/loading/Spinners";
import useMercadoPago from "../../hooks/useMercadoPago";
import styles from "./noSubscriptionPage.module.scss";

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company_id: token.company_id, user_id: token.sub, type })
        });
        const session = await response.json();
        setLoading(false)
        const result = await stripe.redirectToCheckout({ sessionId: session.sessionId });
        if (result.error) console.error(result.error.message);
        setLoading(false)
    };

    const handlePixPayment = async () => {
        setLoadingPix(true);
        await createMercadoPagoCheckout({ user_id: token?.sub, email: token?.email });
        setTimeout(() => setLoadingPix(false), 7000);
    }

    const isSubscriptionActive = (subscriptionLimitDate) => {
        if (!subscriptionLimitDate) return false;
        return new Date() <= new Date(subscriptionLimitDate);
    };

    const formatDateToBrazilian = (dateString) => new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const limitDate = companyData.pixPaymentData?.subscription_limit_date;
    const hasLimitDate = Boolean(limitDate);
    const subscriptionActive = hasLimitDate && isSubscriptionActive(limitDate);

    return (
        <div className={styles.page}>

            {/* ── Status alert ── */}
            {hasLimitDate ? (
                subscriptionActive ? (
                    <div className={styles.alertSuccess}>
                        <FontAwesomeIcon icon={faCheck} />
                        <span>Seu plano teste está ativo até {formatDateToBrazilian(limitDate)}!</span>
                    </div>
                ) : (
                    <div className={styles.alertDanger}>
                        <FontAwesomeIcon icon={faCircleExclamation} />
                        <span>Seu plano teste expirou em {formatDateToBrazilian(limitDate)}. Escolha um plano para continuar.</span>
                    </div>
                )
            ) : (
                <div className={styles.alertWarning}>
                    <FontAwesomeIcon icon={faCrown} />
                    <span>Escolha um plano para começar a usar o Avalia Imobi!</span>
                </div>
            )}

            {/* ── Intro ── */}
            <div className={styles.introHeader}>
                <h2 className={styles.introTitle}>Escolha o Plano Ideal</h2>
                <p className={styles.introSub}>Comece hoje e transforme sua gestão imobiliária</p>
            </div>

            {/* ── Plan cards ── */}
            <div className={styles.planGrid}>

                {/* Plano Teste */}
                <div
                    className={`${styles.planCardGreen} ${selectedPlan === 'teste' ? styles.planSelected : ''} ${hasLimitDate ? styles.planDisabled : ''}`}
                    onClick={() => !hasLimitDate && setSelectedPlan('teste')}
                >
                    {selectedPlan === 'teste' && (
                        <span className={styles.selectedCheckGreen}><FontAwesomeIcon icon={faCheck} /></span>
                    )}
                    <div className={styles.planIconGreen}>
                        <FontAwesomeIcon icon={faQrcode} />
                    </div>
                    <p className={styles.planNameGreen}>Plano Teste</p>
                    <div>
                        <span className={styles.planPriceGreen}>R$&nbsp;39,90</span>
                    </div>
                    <span className={styles.planBadgeGreen}>
                        <FontAwesomeIcon icon={faQrcode} style={{ fontSize: '0.55rem' }} />
                        Pagamento via PIX
                    </span>
                    <ul className={styles.featureList}>
                        <li className={styles.featureItem}>
                            <FontAwesomeIcon icon={faCheck} className={styles.featureIconGreen} />
                            30 dias de acesso completo
                        </li>
                        <li className={styles.featureItem}>
                            <FontAwesomeIcon icon={faCheck} className={styles.featureIconGreen} />
                            Todos os recursos incluídos
                        </li>
                        <li className={styles.featureItem}>
                            <FontAwesomeIcon icon={faCheck} className={styles.featureIconGreen} />
                            1 usuário · pagamento único
                        </li>
                        <li className={styles.featureItem}>
                            <FontAwesomeIcon icon={faCheck} className={styles.featureIconGreen} />
                            Sem renovação automática
                        </li>
                    </ul>
                </div>

                {/* Plano Mensal */}
                <div
                    className={`${styles.planCardOrange} ${selectedPlan === 'mensal' ? styles.planSelected : ''}`}
                    onClick={() => setSelectedPlan('mensal')}
                >
                    <span className={styles.popularBadge}>
                        <FontAwesomeIcon icon={faStar} style={{ fontSize: '0.55rem', marginRight: 5 }} />
                        Mais Popular
                    </span>
                    {selectedPlan === 'mensal' && (
                        <span className={styles.selectedCheckOrange}><FontAwesomeIcon icon={faCheck} /></span>
                    )}
                    <div className={styles.planIconOrange} style={{ marginTop: '1.25rem' }}>
                        <FontAwesomeIcon icon={faCreditCard} />
                    </div>
                    <p className={styles.planNameOrange}>Plano Mensal</p>
                    <div>
                        <span className={styles.planPriceOrange}>R$&nbsp;39,90</span>
                        <span className={styles.planPricePeriod}>/mês</span>
                    </div>
                    <span className={styles.planBadgeOrange}>
                        <FontAwesomeIcon icon={faCreditCard} style={{ fontSize: '0.55rem' }} />
                        Renovação automática
                    </span>
                    <ul className={styles.featureList}>
                        <li className={styles.featureItem}>
                            <FontAwesomeIcon icon={faCheck} className={styles.featureIconOrange} />
                            Todos os recursos incluídos
                        </li>
                        <li className={styles.featureItem}>
                            <FontAwesomeIcon icon={faCheck} className={styles.featureIconOrange} />
                            1 usuário incluído
                        </li>
                        <li className={styles.featureItem}>
                            <FontAwesomeIcon icon={faCheck} className={styles.featureIconOrange} />
                            Usuários extras R$&nbsp;19,90
                        </li>
                        <li className={styles.featureItem}>
                            <FontAwesomeIcon icon={faCheck} className={styles.featureIconOrange} />
                            Cancele quando quiser
                        </li>
                    </ul>
                </div>
            </div>

            {/* ── CTA card ── */}
            <div className={styles.ctaCard}>
                {selectedPlan === 'teste' && (
                    loadingPix ? (
                        <button className={styles.btnGreen} disabled>
                            Gerando PIX&hellip; <SpinnerSM />
                        </button>
                    ) : (
                        <button className={styles.btnGreen} onClick={handlePixPayment}>
                            <FontAwesomeIcon icon={faQrcode} />
                            Pagar com PIX — R$&nbsp;39,90
                        </button>
                    )
                )}

                {selectedPlan === 'mensal' && (
                    loading ? (
                        <button className={styles.btnOrange} disabled>
                            Acessando checkout&hellip; <SpinnerSM />
                        </button>
                    ) : (
                        <button className={styles.btnOrange} onClick={() => handleStripe('mensal')}>
                            <FontAwesomeIcon icon={faCreditCard} />
                            Assinar por R$&nbsp;39,90/mês
                        </button>
                    )
                )}

                {selectedPlan === 'anual' && (
                    loading ? (
                        <button className={styles.btnOrange} disabled>
                            Acessando checkout&hellip; <SpinnerSM />
                        </button>
                    ) : (
                        <button className={styles.btnOrange} onClick={() => handleStripe('anual')}>
                            <FontAwesomeIcon icon={faCreditCard} />
                            Assinar por R$&nbsp;199,90/ano
                        </button>
                    )
                )}

                <span className={styles.ctaSafe}>✓ Seguro e protegido &nbsp;·&nbsp; Cancele quando quiser</span>
            </div>

            {/* ── Detail card ── */}
            <div className={styles.detailCard}>
                {selectedPlan === 'teste' && (
                    <>
                        <h4 className={styles.detailTitleGreen}>
                            <FontAwesomeIcon icon={faQrcode} />
                            Sobre o Plano Teste
                        </h4>
                        <div className={styles.detailGrid}>
                            <div className={styles.detailItem}>
                                <FontAwesomeIcon icon={faCheck} className={styles.detailItemIconGreen} />
                                <div className={styles.detailItemText}>
                                    <p className={styles.detailItemTitle}>Acesso Completo</p>
                                    <p className={styles.detailItemDesc}>30 dias com todos os recursos da plataforma</p>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <FontAwesomeIcon icon={faCheck} className={styles.detailItemIconGreen} />
                                <div className={styles.detailItemText}>
                                    <p className={styles.detailItemTitle}>Pagamento Único</p>
                                    <p className={styles.detailItemDesc}>Apenas R$&nbsp;39,90 via PIX, sem renovação</p>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <FontAwesomeIcon icon={faCheck} className={styles.detailItemIconGreen} />
                                <div className={styles.detailItemText}>
                                    <p className={styles.detailItemTitle}>Ideal para Teste</p>
                                    <p className={styles.detailItemDesc}>Conheça a plataforma antes de assinar</p>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <FontAwesomeIcon icon={faCheck} className={styles.detailItemIconGreen} />
                                <div className={styles.detailItemText}>
                                    <p className={styles.detailItemTitle}>1 Usuário</p>
                                    <p className={styles.detailItemDesc}>Perfeito para começar sozinho</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.tipNote}>
                            <FontAwesomeIcon icon={faCircleInfo} className={styles.tipIcon} />
                            <span><strong>Dica:</strong> Após os 30 dias, você pode migrar para o plano mensal a qualquer momento!</span>
                        </div>
                    </>
                )}

                {selectedPlan === 'mensal' && (
                    <>
                        <h4 className={styles.detailTitleOrange}>
                            <FontAwesomeIcon icon={faCreditCard} />
                            Sobre o Plano Mensal
                        </h4>
                        <p className={styles.leadText}>
                            O plano mensal oferece flexibilidade total com acesso a todos os recursos por apenas <strong style={{ color: 'rgba(245,135,79,0.8)' }}>R$&nbsp;39,90/mês</strong>.
                        </p>
                        <p className={styles.sectionSubtitle}>Adicione usuários</p>
                        <p className={styles.leadText}>
                            Cada usuário adicional custa apenas <strong style={{ color: 'rgba(245,135,79,0.8)' }}>R$&nbsp;19,90/mês</strong>. Escale sua equipe conforme necessário!
                        </p>
                        <p className={styles.sectionSubtitle}>Exemplos de preços</p>
                        <div className={styles.pricingGrid}>
                            <div className={styles.pricingItemOrange}>
                                <p className={styles.pricingItemLabel}>1 Usuário</p>
                                <span className={styles.pricingItemValue}>R$&nbsp;39,90<span className={styles.pricingItemPeriod}>/mês</span></span>
                            </div>
                            <div className={styles.pricingItemOrange}>
                                <p className={styles.pricingItemLabel}>2 Usuários</p>
                                <span className={styles.pricingItemValue}>R$&nbsp;59,80<span className={styles.pricingItemPeriod}>/mês</span></span>
                            </div>
                            <div className={styles.pricingItemOrange}>
                                <p className={styles.pricingItemLabel}>5 Usuários</p>
                                <span className={styles.pricingItemValue}>R$&nbsp;119,50<span className={styles.pricingItemPeriod}>/mês</span></span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
