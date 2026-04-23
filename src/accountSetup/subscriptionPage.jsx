import { faArrowUpRightFromSquare, faCircleExclamation, faCircleInfo, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from "react";
import { SpinnerSM } from "../components/loading/Spinners";
import styles from "./subscriptionPage.module.scss";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function SubscriptionPage(props) {

    const token = jwt.decode(Cookie.get('auth'))
    const { companyData } = props
    const [loading, setLoading] = useState(false)

    const handleCustomerSession = async () => {
        setLoading(true)
        const response = await fetch('/api/accountSetup/customerSession', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company_id: token.company_id, user_id: token.sub })
        });
        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        }
        setLoading(false)
    }

    return (
        <div className={styles.page}>
            {!companyData?.active && +companyData?.errorStatus === 2 && (
                <div className={styles.alertDanger}>
                    <FontAwesomeIcon icon={faCircleExclamation} />
                    <span>Sua assinatura está inativa. Acesse o portal para regularizar.</span>
                </div>
            )}

            <div className={styles.portalCard}>
                <div className={styles.portalHeader}>
                    <p className={styles.portalTitle}>Gerenciar Assinatura</p>
                    <p className={styles.portalSubtitle}>
                        Acesse o portal Stripe para atualizar dados de pagamento, cancelar ou ver faturas.
                    </p>
                </div>

                {loading ? (
                    <button className={styles.portalBtn} disabled>
                        Acessando portal&hellip; <SpinnerSM />
                    </button>
                ) : (
                    <button className={styles.portalBtn} onClick={handleCustomerSession}>
                        <FontAwesomeIcon icon={faCreditCard} />
                        Gerenciar assinatura
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: '0.7rem', opacity: 0.7 }} />
                    </button>
                )}

                <div className={styles.infoNote}>
                    <FontAwesomeIcon icon={faCircleInfo} className={styles.infoNoteIcon} />
                    <span>Você será redirecionado ao portal seguro do Stripe para gerenciar todos os detalhes da sua assinatura.</span>
                </div>
            </div>
        </div>
    )
}
