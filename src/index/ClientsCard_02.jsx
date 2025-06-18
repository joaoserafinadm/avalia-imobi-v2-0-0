import Link from "next/link";
import Icons from "../components/icons";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faStar } from "@fortawesome/free-solid-svg-icons";
import ClientIndexCard from "./ClientIndexCard";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { maskMoney } from "../../utils/mask";
import CountUp from 'react-countup';
import { SpinnerLG, SpinnerSM } from "../components/loading/Spinners";


export default function ClientsCard_02(props) {

    const { userResults, clientsArray, loading } = props


    useEffect(() => {

        console.log("userResults", userResults)


    }, [props])













    return (
        <div className="card cardAnimation shadow my-2">

            {loading && <Loading />}

            <div className="card-body">
                <div className="row  d-flex  ">

                    <Link href='/clientsManagement'>

                        <div className="col-12 d-flex justify-content-between align-items-center">

                            <span className="fs-3 bold text-orange">Imóveis</span>
                            <span className=" text-secondary small d-flex align-items-center span fw-bold">
                                Acessar<Icons icon="a-r" className="ms-1" />
                            </span>

                        </div>
                        <div className="col-12 d-flex justify-content-start align-items-top mb-3">

                            <span className="small text-secondary">Cadastre e avalie os imóveis de seus clientes</span>

                        </div>
                    </Link>

                    <hr />
                    {!!clientsArray.length ?
                        <>
                            <div className="col-12 d-flex justify-content-center text-center" >

                                <span className="small text-secondary fw-bold">Meus resultados</span>
                            </div>
                            <div className="col-12">
                                <div className="row d-flex">


                                    <div className="col-6 d-flex justify-content-center align-items-end my-2 text-center text-secondary">
                                        <div>

                                            {/* <span className="fw-bold fs-3 ">{userResults.clientsLength}</span><br /> */}
                                            <span className="fw-bold fs-3 "><CountUp end={userResults.clientsLength} separator="." duration={2} /></span><br />
                                            <span className="bold text-orange ">{userResults.clientsLength > 1 ? "Clientes" : "Cliente"}</span>
                                        </div>
                                    </div>
                                    <div className="col-6 d-flex justify-content-center align-items-end my-2 text-center text-secondary">
                                        <div>

                                            <span className="fw-bold fs-3"><CountUp end={userResults.clientsValuations} separator="." duration={2} /></span><br />
                                            <span className="bold text-orange">{userResults.clientsValuations > 1 ? 'Avaliações' : 'Avaliação'}</span>
                                        </div>
                                    </div>
                                    <div className="col-6 d-flex justify-content-center align-items-end my-2 text-center text-secondary">
                                        <div>

                                            <span className="fw-bold fs-3"><CountUp end={userResults.clientsRating} separator="." duration={2} /> <FontAwesomeIcon icon={faStar} className="text-warning" /></span><br />
                                            <span className="bold text-orange">Nota de atendimento</span>
                                        </div>
                                    </div>
                                    <div className="col-6 d-flex justify-content-center align-items-end my-2 text-center text-secondary">
                                        <div>
                                            <span className="fw-bold " style={{ fontSize: '1rem' }}>R$ <CountUp end={userResults.averageTicket} separator="." duration={2} />,00</span><br />
                                            {/* <span className="fw-bold " style={{ fontSize: '1rem' }}>R$ {maskMoney(userResults.averageTicket.toString())},00</span><br /> */}
                                            <span className="bold text-orange">Ticket médio de avaliação</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </>
                        :
                        <>
                            {!props.loading ?
                                <div className="row my-5 fadeItem">
                                    <div className="col-12 d-flex justify-content-center text-center " >
                                        <span className="small text-secondary">Nenhum imóvel cadastrado</span>
                                    </div>
                                    <div className="col-12 d-flex justify-content-center text-center " >
                                        <Link href={'/clientAdd'}>
                                            <button className="btn btn-orange">Cadastrar imóvel</button>
                                        </Link>
                                    </div>
                                </div>
                                :
                                <div className="row my-5">
                                    <div className="col-12 d-flex justify-content-center text-center ">

                                        <SpinnerSM className="text-secondary" />
                                    </div>
                                </div>}
                        </>
                    }


                </div>

            </div>
        </div>
    )
}