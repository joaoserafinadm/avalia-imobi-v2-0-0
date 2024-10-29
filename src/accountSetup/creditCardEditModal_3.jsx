import axios from "axios";
import { useEffect, useState } from "react";
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import Script from 'next/script';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function CreditCardEditModal(props) {
    const token = jwt.decode(Cookie.get('auth'));

    const [subscriptionError, setSubscriptionError] = useState('')


    useEffect(() => {

        console.log("token", token.company_id)
        if (token.company_id) {
            const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY);

            const external_reference = token.company_id

            const cardForm = mp.cardForm({
                amount: "10",
                iframe: true,
                external_reference: '123',
                form: {
                    id: "form-checkout",
                    cardNumber: {
                        id: "form-checkout__cardNumber",
                        placeholder: "Número do cartão",
                    },
                    expirationDate: {
                        id: "form-checkout__expirationDate",
                        placeholder: "MM/YY",
                    },
                    securityCode: {
                        id: "form-checkout__securityCode",
                        placeholder: "CVC",
                    },
                    cardholderName: {
                        id: "form-checkout__cardholderName",
                        placeholder: "Titular do cartão",
                    },
                    issuer: {
                        id: "form-checkout__issuer",
                        placeholder: "Banco emissor",
                    },
                    installments: {
                        id: "form-checkout__installments",
                        placeholder: "Parcelas",
                    },
                    identificationType: {
                        id: "form-checkout__identificationType",
                        placeholder: "Tipo de documento",
                    },
                    identificationNumber: {
                        id: "form-checkout__identificationNumber",
                        placeholder: "Número do documento",
                    },
                    cardholderEmail: {
                        id: "form-checkout__cardholderEmail",
                        placeholder: "E-mail",
                    },
                    deviceId: {
                        id: "deviceId", // Campo escondido para o device ID
                    },

                },
                callbacks: {
                    onFormMounted: error => {
                        if (error) return console.warn("Form Mounted handling error: ", error);
                        console.log("Form mounted");
                    },
                    onSubmit: event => {
                        event.preventDefault();

                        const {
                            paymentMethodId: payment_method_id,
                            issuerId: issuer_id,
                            cardholderEmail: email,
                            amount,
                            token,
                            installments,
                            identificationNumber,
                            identificationType
                        } = cardForm.getCardFormData();

                        console.log("Form submitted", cardForm.getCardFormData(), cardForm, external_reference);

                        axios.post('/api/accountSetup/subscription_2', {
                            token,
                            issuer_id,
                            payment_method_id,
                            transaction_amount: Number(amount),
                            installments: Number(installments),
                            description: "Descrição do produto",
                            payer: {
                                email,
                                identification: {
                                    type: identificationType,
                                    number: identificationNumber,
                                }
                            },
                            deviceId,
                            external_reference: external_reference,
                            company_id: token.company_id
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => {
                                console.log(response.data);
                            })
                            .catch(error => {
                                console.log(error);
                                setSubscriptionError('Houve um erro ao gerar a assinatura, por favor, tente novamente mais tarde! Caso o erro persista, clique <a href="/sac">aqui</a> para entrar em contato.');

                            });
                    },
                    onFetching: (resource) => {
                        console.log("Fetching resource: ", resource);

                        const progressBar = document.querySelector(".progress-bar");
                        progressBar.removeAttribute("value");

                        return () => {
                            progressBar.setAttribute("value", "0");
                        };
                    }
                },
            });
        }

    }, [token]);

    return (
        <div className="modal fade" id="creditCardEditModal" tabIndex="-1" aria-labelledby="Modal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title title-dark bold">Endereço de cobrança</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body pb-5">
                        {subscriptionError && (
                            <div className="row">
                                <div className="col-12">
                                    <div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: subscriptionError }}>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="row">
                            <div className="col-12">
                                <p><b>Importante:</b></p>
                                <p>O valor inicial da assinatura é de <b>R$79,90 por mês</b>, correspondente ao plano básico com 1 usuário.</p>
                                <p>O valor será ajustado automaticamente conforme novos usuários forem adicionados ao sistema:</p>

                                <p><FontAwesomeIcon icon={faPlus} className="me-2 text-success" /> Até 5 usuários: R$19,90 mensais por usuário adicional.</p>
                                <p><FontAwesomeIcon icon={faPlus} className="me-2 text-success" />Acima de 5 usuários: R$14,90 mensais por usuário adicional.</p>
                            </div>
                        </div>

                        <form id="form-checkout">
                            <label className="small fw-bold" htmlFor="form-checkout__cardholderName">Nome do titular do cartão</label>
                            <input type="text" id="form-checkout__cardholderName" className="form-control mb-2" />

                            <label className="small fw-bold" htmlFor="form-checkout__cardNumber">Número do cartão</label>
                            <div id="form-checkout__cardNumber" className="form-control mb-2" style={{ height: "40px" }}></div>

                            <label className="small fw-bold" htmlFor="form-checkout__expirationDate">Data de validade</label>
                            <div id="form-checkout__expirationDate" className="form-control mb-2" style={{ height: "40px" }}></div>

                            <label className="small fw-bold" htmlFor="form-checkout__securityCode">Código de segurança</label>
                            <div id="form-checkout__securityCode" className="form-control mb-2" style={{ height: "40px" }}></div>

                            <select id="form-checkout__issuer" className="d-none"></select>
                            <select id="form-checkout__installments" className="d-none"></select>

                            <label className="small fw-bold" htmlFor="form-checkout__identificationType">Documento</label>
                            <select id="form-checkout__identificationType" className="form-select mb-2"></select>

                            <label className="small fw-bold" htmlFor="form-checkout__identificationNumber">Número do documento</label>
                            <input type="text" id="form-checkout__identificationNumber" className="form-control mb-2" />

                            <label className="small fw-bold" htmlFor="form-checkout__cardholderEmail">E-mail</label>
                            <input type="email" id="form-checkout__cardholderEmail" className="form-control mb-2" />
                            <input type="hidden" id="deviceId" />
                            <div className="row">
                                <div className="col-12 d-flex justify-content-end">

                                    <button type="submit" id="form-checkout__submit" className="btn btn-orange text-end">Salvar</button>
                                </div>
                            </div>
                            <progress value="0" className="progress-bar d-none">Carregando...</progress>
                        </form>
                    </div>
                </div>
            </div>

            {/* Script de segurança do Mercado Pago */}
            {/* <Script src="https://www.mercadopago.com/v2/security.js" strategy="afterInteractive" output='deviceId'/> */}
        </div>
    );
}
