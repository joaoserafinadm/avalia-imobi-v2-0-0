
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

        const formElement = document.getElementById('form-checkout');
        formElement.addEventListener('submit', createCardToken2);


        const initializeMercadoPago = async () => {
            // Carregando o SDK do Mercado Pago
            await loadMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY);
            // Instanciando o objeto MercadoPago
            const mp = new MercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY, {
                locale: 'pt-BR'
            });



            const cardNumberElement = mp.fields.create('cardNumber', {
                placeholder: "Número do cartão"
              }).mount('form-checkout__cardNumber');
              const expirationDateElement = mp.fields.create('expirationDate', {
                placeholder: "MM/YY",
              }).mount('form-checkout__expirationDate');
              const securityCodeElement = mp.fields.create('securityCode', {
                placeholder: "Código de segurança"
              }).mount('form-checkout__securityCode');


            console.log('mp', mp)
            setMercadoPagoInstance(mp); // Armazena a instância
        };

        initializeMercadoPago();
    }, []);




    async function createCardToken2(event) {
      try {
        const tokenElement = document.getElementById('token');
        if (!tokenElement.value) {
          event.preventDefault();
          const token = await mercadoPagoInstance.fields.createCardToken({
            cardholderName: document.getElementById('form-checkout__cardholderName').value,
            identificationType: 'CPF',
            identificationNumber: document.getElementById('form-checkout__identificationNumber').value,
          });
          tokenElement.value = token.id;
          formElement.requestSubmit();
          handlePayment(token.id);
        }
      } catch (e) {
        console.error('error creating card token: ', e)
      }
    }




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
                            <form id="form-checkout" action="/process_payment" method="POST">
                                <div id="form-checkout__cardNumber" class="container"></div>
                                <div id="form-checkout__expirationDate" class="container"></div>
                                <div id="form-checkout__securityCode" class="container"></div>
                                <input type="text" id="form-checkout__cardholderName" placeholder="Titular do cartão" />
                                <select id="form-checkout__issuer" name="issuer">
                                    <option value="" disabled selected>Banco emissor</option>
                                </select>
                                
                                <select id="form-checkout__identificationType" name="identificationType">
                                    <option value="" disabled selected>Tipo de documento</option>
                                </select>
                                <input type="text" id="form-checkout__identificationNumber" name="identificationNumber" placeholder="Número do documento" />
                                <input type="email" id="form-checkout__email" name="email" placeholder="E-mail" />

                                <input id="token" name="token" type="hidden" />
                                <input id="paymentMethodId" name="paymentMethodId" type="hidden" />
                                <input id="transactionAmount" name="transactionAmount" type="hidden" value="100" />
                                <input id="description" name="description" type="hidden" value="Nome do Produto" />

                                <button type="submit" id="form-checkout__submit">Pagar</button>
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



