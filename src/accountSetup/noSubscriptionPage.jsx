import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken';



const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function NoSubscriptionPage(props) {

    const token = jwt.decode(Cookie.get('auth'))


    const handleStripe = async () => {
        const stripe = await stripePromise;

        // Faz a chamada à API para criar a sessão de checkout
        const response = await fetch('/api/accountSetup/stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_id: token.company_id,
                user_id: token.sub
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
    };

    return (
        <div className="row">
            <div className="col-12">
                <div className="alert alert-danger">
                    <span>Você ainda não possui uma assinatura!</span>
                </div>
            </div>
            <div className="col-12 d-flex justify-content-center">
                <button className="btn btn-orange pulse" onClick={handleStripe}>
                    Assinar o Avalia Imobi!
                </button>
            </div>
            <div className="col-12 mt-3">
                <span className="fw-bold text-orange">Plano de assinatura</span>
            </div>

            <div className="col-12">
                <div className="row">
                    <div className="col-12 mt-3">
                        Nosso <b>plano básico</b> começa com um valor de <b>R$79,90 por mês.</b>
                    </div>
                    <div className="col-12 mt-3">
                        Esse plano permite que voce tenha acesso a <b>todos os recursos do Avalia Imobi</b>
                    </div>
                    {/* <div className="col-12 mt-3">
                        <FontAwesomeIcon icon={faPlus} className="me-2 text-success" />Avaliações ilimitadas.
                    </div>
                    <div className="col-12 mt-3">
                        <FontAwesomeIcon icon={faPlus} className="me-2 text-success" /><b>Mais de 5 usuários:</b> Para equipes maiores, a partir do 6º usuário, o custo por usuário adicional é reduzido para <b>R$14,90 por mês</b>.
                    </div> */}
                </div>
            </div>

            <div className="col-12 mt-3">
                <span className="fw-bold text-orange">Adição de usuários</span>
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-12 mt-3">
                        <FontAwesomeIcon icon={faPlus} className="me-2 text-success" /><b>Até 5 usuários:</b> Se você precisar de mais pessoas utilizando o sistema, cada usuário terá um custo adicional de <b>R$19,90 por mês</b>.
                    </div>
                    <div className="col-12 mt-3">
                        <FontAwesomeIcon icon={faPlus} className="me-2 text-success" /><b>Mais de 5 usuários:</b> Para equipes maiores, a partir do 6º usuário, o custo por usuário adicional é reduzido para <b>R$14,90 por mês</b>.
                    </div>
                </div>
            </div>

            <div className="col-12 mt-3">
                <span className="fw-bold text-orange">Exemplo</span>
            </div>

            <div className="col-12">
                <div className="row">
                    <div className="col-12 mt-3" >
                        <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />1 usuário (plano básico): R$79,90/mês
                    </div>
                    <div className="col-12 mt-3">
                        <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />2 usuários: R$79,90 + R$19,90 = R$99,80/mês
                    </div>
                    <div className="col-12 mt-3">
                        <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />5 usuários: R$79,90 + (4 x R$19,90) = R$159,50/mês
                    </div>
                    <div className="col-12 mt-3">
                        <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />6 usuários: R$79,90 + (5 x R$14,90) = R$154,40/mês
                    </div>
                </div>
            </div>

            <div className="col-12 my-5 d-flex justify-content-center text-center">
                <span className="fw-bold">
                    Fique à vontade para ajustar seu plano conforme as necessidades da sua equipe!
                </span>
            </div>
        </div>
    );
}
