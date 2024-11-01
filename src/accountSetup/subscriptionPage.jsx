import { faLock, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken';
import { isAdmin } from "../../utils/permissions";
import { formatDate, maskMoney, maskNumberMoney } from "../../utils/mask";
import { loadStripe } from '@stripe/stripe-js';
import { useState } from "react";
import { SpinnerSM } from "../components/loading/Spinners";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);


export default function SubscriptionPage(props) {

    const token = jwt.decode(Cookie.get('auth'))

    const { companyData } = props


    const [loading, setLoading] = useState(false)

    const handleCustomerSession = async () => {

        setLoading(true)

        // const stripe = await stripePromise;


        const response = await fetch('/api/accountSetup/customerSession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_id: token.company_id,
                user_id: token.sub
            })
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url; // Redireciona o usuário para o Stripe Customer Portal
        } else {
            console.error('Erro ao tentar abrir o portal de gerenciamento:', data.message);
        }

        setLoading(false)

    }




    return (
        <div className="fadeItem">
            <div className="row ">
                <div className="col-12 col-md-3 pt-3">
                    <span className="fs-4 text-bold text-orange" >Assinatura</span> <br />
                    {/* <button className="btn btn-sm btn-success">Editar <FontAwesomeIcon icon={faPencilAlt} /></button> */}
                </div>
                <div className="col-12 col-md-9">
                    <div className="row border-bottom py-4">
                        <div className="col-12">
                            {loading ?
                                <button className="btn btn-outline-orange" disabled >Acessando portal... <SpinnerSM className="ms-1" /></button>
                                :
                                <button className="btn btn-outline-orange" onClick={handleCustomerSession}>Gerenciar assinatura</button>
                            }
                        </div>
                    </div>
                    {/*<div className="row border-bottom py-4">
                        <div className="col-12 col-md-3 text-bold">
                            Plano
                        </div>
                        <div className="col-12 col-md-9 mt-2 d-flex justify-content-between small">
                            <div>
                                <p>
                                    Valor da assinatura: R$79,90
                                </p>
                                <p>
                                    Número de usuários: {companyData?.paymentData?.usersCount}
                                </p>
                                <p>
                                    Adicional por usuário: {companyData?.paymentData?.amountPerUser}
                                </p>
                            </div>
                             <span type="button" className="text-orange" data-bs-toggle="modal" data-bs-target="#chargeAdressModal"><FontAwesomeIcon icon={faPencil} className="editIcon" /></span> 

                        </div>
                    </div>
                    <div className="row border-bottom py-4">
                        <div className="col-12 col-md-3 text-bold">
                            Cobrança
                        </div>
                        <div className="col-12 col-md-9 mt-2 d-flex justify-content-between small">
                            <div>
                                <p>
                                    E-mail: {companyData?.paymentData?.email}
                                </p>
                                <p>
                                    Endereço de cobrança: {companyData?.paymentData?.address ? companyData?.paymentData?.address : 'Não informado'}
                                </p>
                            </div>
                            <span type="button" className="text-orange" data-bs-toggle="modal" data-bs-target="#chargeAdressModal"><FontAwesomeIcon icon={faPencil} className="editIcon" /></span>

                        </div>
                    </div>*/}
                </div>
            </div>
            {/* <div className="row mt-5">
                <div className="col-12 col-md-3 pt-3 pb-4">
                    <span className="fs-4 text-bold text-orange" >Faturas</span> <br />
                </div>

                <div className="col-12 col-md-9">
                    <div className="row border-bottom py-4">
                        <div className="col-12  text-bold">
                            <div className="card">
                                <div className="card-body">
                                    {companyData?.paymentData?.invoices?.map((elem, index) => (
                                        <div className="row" key={index}>
                                            <div className="col-4 ">
                                                {formatDate(elem.date)}
                                            </div>
                                            <div className="col-4 text-center">
                                                R$ {maskNumberMoney(((+elem.total / 100).toFixed(2)).toString())}
                                            </div>
                                            <div className="col-4 d-flex justify-content-end">
                                                <a className="btn btn-sm btn-outline-secondary" href={elem.url} target="_blank">
                                                    Recibo
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                     <hr />
                    <div className="row mt-2">
                        <div className="col-12 d-flex justify-content-end">
                            <button data-bs-toggle="modal" data-bs-target="#exitAccountModal" className="btn btn-sm btn-outline-danger">Cancelar assinatura</button>
                        </div>
                    </div> 
                </div>
            </div> */}
        </div>

    )
}
