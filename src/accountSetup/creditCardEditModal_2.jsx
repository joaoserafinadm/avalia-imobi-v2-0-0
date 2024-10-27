
import { useEffect, useState } from "react";
import { maskCnpj, maskCpf, maskCreditCard, maskMonthDate } from "../../utils/mask";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import axios from "axios";
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
// import { initMercadoPago } from '@mercadopago/sdk-react'
// initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY)

export default function CreditCardEditModal(props) {

    const { paymentMethods } = props

    console.log('paymentMethods', paymentMethods)

    const token = jwt.decode(Cookie.get('auth'))


    const router = useRouter()

    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [cpf, setCpf] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [email, setEmail] = useState('');

    const [country, setCountry] = useState('BR');
    const [mercadoPagoInstance, setMercadoPagoInstance] = useState(null);

    const [subscriptionError, setSubscriptionError] = useState('')

    useEffect(() => {
        const initializeMercadoPago = async () => {
            // Carregando o SDK do Mercado Pago
            await loadMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY);
            // Instanciando o objeto MercadoPago
            const mp = new MercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY, {
                locale: 'pt-BR'
            });



            const cardNumberElement = mp.fields.create('cardNumber', {
                placeholder: "Número do cartão",
                style: {
                    height: "45px",
                    fontFamily: "Montserrat",
                }
            }).mount('cardNumber');

            const expirationDateElement = mp.fields.create('expirationDate', {
                placeholder: "MM/YY",
            }).mount('expirationDate');

            const securityCodeElement = mp.fields.create('securityCode', {
                placeholder: "Código de segurança"
            }).mount('securityCode');



            console.log('mp', mp)
            setMercadoPagoInstance(mp); // Armazena a instância
        };

        initializeMercadoPago();
    }, []);

    // Função para criar o token do cartão
    const createCardToken = async (e) => {

        const formElement = document.getElementById('form-checkout');
        formElement.addEventListener('submit', createCardToken);


        if (mercadoPagoInstance) {
            const expiration = expirationDate.split('/'); // Separar MM/YY
            const cardNumberCleaned = cardNumber.replace(/\s/g, ''); // Remover espacos em branco
            const identificationNumberCleaned = cpf ? maskCpf(cpf).replace(/\D/g, '') : maskCnpj(cnpj).replace(/\D/g, ''); // Remover todos os caracteres que não são dígitos
            try {

                const cardToken = await mercadoPagoInstance.createCardToken({
                    // cardNumber: cardNumberCleaned,
                    cardholderName: name,
                    // cardExpirationMonth: expiration[0], // Mês de validade
                    // cardExpirationYear: `20${expiration[1]}`, // Ano de validade (supondo formato YY)
                    // securityCode: cvc,
                    identificationType: cpf ? 'CPF' : 'CNPJ',
                    identificationNumber: identificationNumberCleaned,
                });

                if (cardToken && cardToken.id) {

                    console.log('cardToken', cardToken)

                    handlePayment(cardToken.id);
                } else {
                    console.error('Erro ao gerar cardToken:', cardToken);
                    setSubscriptionError('Houve um erro ao gerar a assinatura, por favor, tente novamente mais tarde! Caso o erro persista, clique <a href="/sac">aqui</a> para entrar em contato.');

                }
            } catch (error) {
                console.error('Erro ao gerar o token:', error);
                setSubscriptionError('Houve um erro ao gerar a assinatura, por favor, tente novamente mais tarde! Caso o erro persista, clique <a href="/sac">aqui</a> para entrar em contato.');

            }
        }
    };

    const handlePayment = async (cardTokenId) => {

        const data = {
            company_id: token.company_id,
            user_id: token.sub,
            cardTokenId: cardTokenId,
            last4: cardNumber.slice(-5),
            cardholderName: name,
            paymentMethodId: 24,
            email: email
        }

        await axios.post(`/api/accountSetup/subscription`, data)
            .then(async res => {

                updateToken()

            }).catch(e => {
                setSubscriptionError('Houve um erro ao gerar a assinatura, por favor, tente novamente mais tarde! Caso o erro persista, clique <a href="/sac">aqui</a> para entrar em contato.');

            })
    }


    const updateToken = async () => {

        const dataToken = {
            user_id: token.sub,
            company_id: token.company_id
        }

        await axios.get(`/api/token/tokenUpdate`, {
            params: dataToken
        }).then(res => {
            // router.reload()
        })


    }

    return (
        <>
            <div className="modal fade" id="creditCardEditModal" tabIndex="-1" aria-labelledby="Modal" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title title-dark bold">Atualizar forma de pagamento </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
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
                            <form className="row" onSubmit={e => createCardToken(e)}>
                                <div className="col-12 my-2">
                                    <label className="small fw-bold" htmlFor="name">Nome do titular do cartão</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Nome do titular do cartão"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="col-12 my-2">
                                    <label className="small fw-bold" htmlFor="cardNumber">Número do cartão</label>
                                    {/* <input
                                        type="text"
                                        inputMode="numeric"
                                        className="form-control"
                                        id="cardNumber"
                                        placeholder="Número do cartão"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(maskCreditCard(e.target.value))}
                                    /> */}
                                    <div id="cardNumber" className="form-control"></div>
                                </div>
                                <div className="col-6 d-flex align-items-end">
                                    <div className="col-12">

                                        <label className="small fw-bold" htmlFor="expirationDate">Data de validade</label>
                                        {/* <input
                                            type="text"
                                            inputMode="numeric"
                                            className="form-control"
                                            id="expirationDate"
                                            placeholder="MM/YY"
                                            value={expirationDate}
                                            onChange={(e) => setExpirationDate(maskMonthDate(e.target.value))}
                                        /> */}
                                        <div id="expirationDate" className="form-control"></div>

                                    </div>
                                </div>
                                <div className="col-6 d-flex align-items-end">
                                    <div className="col-12">
                                        <label className="small fw-bold" htmlFor="cvc">Código de segurança</label>
                                        {/* <input
                                            type="text"
                                            inputMode="numeric"
                                            className="form-control"
                                            id="cvc"
                                            placeholder="CVC"
                                            value={cvc}
                                            onChange={(e) => {
                                                const newValue = e.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
                                                setCvc(newValue); // Atualiza o valor do CVC com apenas números
                                                }}
                                                maxLength="4" // Limita a quantidade de dígitos para 3 ou 4, dependendo do padrão do cartão
                                                /> */}
                                        <div id="securityCode" className="form-control"></div>

                                    </div>
                                </div>
                                <div className="col-12 my-2">
                                    <label className="small fw-bold" htmlFor="cnpj">CNPJ</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cnpj"
                                        placeholder="00.000.000/0000-00"
                                        value={cnpj} disabled={cpf}
                                        onChange={(e) => setCnpj(maskCnpj(e.target.value))}
                                    />
                                    <label className="small fw-bold" htmlFor="cpf">CPF</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cpf"
                                        placeholder="000.000.000-00"
                                        value={cpf} disabled={cnpj}
                                        onChange={(e) => setCpf(maskCpf(e.target.value))}
                                    />
                                </div>
                                <div className="col-12 my-2">
                                    <label className="small fw-bold" htmlFor="email">E-mail de cobrança</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="email"
                                        placeholder="E-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button
                                className="btn btn-orange"
                                onClick={createCardToken} // Gera o cardToken ao clicar em "Salvar"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}



