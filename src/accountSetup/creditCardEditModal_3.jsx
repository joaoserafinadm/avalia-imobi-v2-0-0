import axios from "axios";
import { useEffect } from "react";
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import Script from 'next/script'; // Importando Script do Next.js

export default function CreditCardEditModal(props) {
    const token = jwt.decode(Cookie.get('auth'));

    useEffect(() => {
        if (token.sub) {
            const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY);

            const cardForm = mp.cardForm({
                amount: "12.34",
                iframe: true,
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
                        placeholder: "Código de segurança",
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
                        id: "deviceId",
                    }
                },
                callbacks: {
                    onFormMounted: error => {
                        if (error) return console.warn("Form Mounted handling error: ", error);
                        console.log("Form mounted");
                    },
                    onSubmit: event => {
                        event.preventDefault();

                        console.log("TESTE");
                        const {
                            paymentMethodId: payment_method_id,
                            issuerId: issuer_id,
                            cardholderEmail: email,
                            amount,
                            token,
                            installments,
                            identificationNumber,
                            identificationType,
                        } = cardForm.getCardFormData();

                        console.log("Form submitted", cardForm.getCardFormData(), cardForm);

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
                              },
                            },
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                            .then(response => {
                                console.log(response.data);
                            })
                            .catch(error => {
                                console.error(error);
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
                    <div className="modal-body">
                        <form id="form-checkout">
                            <div id="form-checkout__cardNumber" className="container"></div>
                            <div id="form-checkout__expirationDate" className="container"></div>
                            <div id="form-checkout__securityCode" className="container"></div>
                            <input type="text" id="form-checkout__cardholderName" />
                            <select id="form-checkout__issuer"></select>
                            <select id="form-checkout__installments"></select>
                            <select id="form-checkout__identificationType"></select>
                            <input type="text" id="form-checkout__identificationNumber" />
                            <input type="email" id="form-checkout__cardholderEmail" />
                            <input type="hidden" id="deviceId" />
                            <button type="submit" id="form-checkout__submit">Pagarr</button>
                            <progress value="0" className="progress-bar">Carregando...</progress>
                        </form>
                    </div>
                </div>
            </div>

            {/* Script de segurança do Mercado Pago */}
            <Script src="https://www.mercadopago.com/v2/security.js" strategy="afterInteractive" />
        </div>
    );
}
