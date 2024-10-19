import { faLock, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken';
import { isAdmin } from "../../utils/permissions";



export default function SubscriptionPage(props) {


    const { companyData, paymentHistory } = props

    const token = jwt.decode(Cookie.get('auth'))

    console.log("companyData", companyData?.paymentData)





    return (
        <div className="fadeItem">
            <div className="row ">
                <div className="col-12 col-md-3 pt-3">
                    <span className="fs-4 text-bold text-orange" >Assinatura</span> <br />
                    {/* <button className="btn btn-sm btn-success">Editar <FontAwesomeIcon icon={faPencilAlt} /></button> */}
                </div>
                <div className="col-12 col-md-9">
                    <div className="row border-bottom py-4">
                        <div className="col-12 col-md-3 text-bold">
                            Informações do cartão
                        </div>
                        <div className="col-12 col-md-9 mt-2 ">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row fw-bold">
                                        <div className="col-12">
                                            {companyData?.paymentData?.cardholderName}
                                        </div>
                                        <div className="col-12">
                                            &#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022; {companyData?.paymentData?.last4}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-2 d-flex justify-content-end ">
                                <button className="btn btn-outline-orange">
                                    Alterar cartão
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className="row border-bottom py-4">
                        <div className="col-12 col-md-3 text-bold">
                            Plano
                        </div>
                        <div className="col-12 col-md-9 mt-2 d-flex justify-content-between small">
                            <div>
                                <p>
                                    Assinatura mensal: R$79,90
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
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-12 col-md-3 pt-3 pb-4">
                    <span className="fs-4 text-bold text-orange" >Faturas</span> <br />
                </div>

                <div className="col-12 col-md-9">
                    <div className="row border-bottom py-4">
                        <div className="col-12  text-bold">
                            <div className="card">
                                <div className="card-body">
                                    {paymentHistory.map((elem, index) => (
                                        <div className="row" key={index}>
                                            <div className="col-12 col-md-3">
                                                {elem.date}
                                            </div>
                                            <div className="col-12 col-md-3">
                                                R$ {elem.value}
                                            </div>
                                            <div className="col-12 col-md-3">
                                                R$ {elem.status}
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
                            <button data-bs-toggle="modal" data-bs-target="#exitAccountModal" className="btn btn-sm btn-outline-danger">Sair da conta</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}