import Link from "next/link";
import Icons from "../components/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator, faCrown, faFaceSadTear, faKey, faLightbulb, faStar, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import CountUp from 'react-countup';
import { faUser } from "@fortawesome/free-regular-svg-icons";
import isMobile from "../../utils/isMobile";



export default function UsersCard(props) {

    const { clientsStatus, clientsArray, rankedUserResults,
        rankedUserValuationResults, companyData, loading } = props

    const [totalStatus, setTotalStatus] = useState(0)















    return (
        <div className="card cardAnimation shadow my-2" style={{ height: '100%' }}>

            {loading && <Loading />}

            <div className="card-body">
                <div className="row  d-flex  ">

                    <Link href='/usersManagement'>

                        <div className="col-12 d-flex justify-content-between align-items-center">

                            <span className="fs-3 bold text-orange">Usuários</span>
                            <span className=" text-secondary small d-flex align-items-center span fw-bold">
                                Acessar<Icons icon="a-r" className="ms-1" />
                            </span>

                        </div>
                        <div className="col-12 d-flex justify-content-start align-items-top mb-3">

                            <span className="small text-secondary">Visualize todos os usuários cadastrados</span>

                        </div>
                    </Link>

                    <hr />

                    <div className="col-12 d-flex justify-content-center text-center" >

                        <span className="small text-secondary fw-bold">Campeão de captações</span>
                    </div>
                    {rankedUserResults.firstName ?
                        <div className="col-12 mt-2 ">

                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 mt-2 ">
                                        <div className="row d-flex justify-content-center">

                                            <div className="position-relative text-center" style={{ width: '150px' }}>
                                                <div className="col-12 d-flex justify-content-center">

                                                    <span style={{ position: 'absolute', right: '20px', top: '-15px', transform: 'rotate(20deg)' }}>
                                                        <FontAwesomeIcon icon={faCrown} className="text-warning fs-2" />
                                                    </span>
                                                    <span style={{ position: 'absolute', left: '10px', top: '90px', transform: 'rotate(70deg)' }}>
                                                        <FontAwesomeIcon icon={faKey} className="text-secondary fs-2" />
                                                    </span>

                                                    <img src={rankedUserResults?.profileImageUrl}
                                                        className="rounded-circle" alt="" height={125} />
                                                </div>
                                                <span className="small fw-bold text-secondary">
                                                    {rankedUserResults?.firstName} {rankedUserResults?.lastName}
                                                </span>
                                            </div>

                                            <div className="col-lg col-12">
                                                <div className="row d-flex h-100">


                                                    <div className="col-6 d-flex justify-content-center align-items-center my-2 text-center text-secondary">
                                                        <div>
                                                            <span className="fw-bold fs-3 "><CountUp end={rankedUserResults?.clientsLength} separator="." duration={2} /></span><br />
                                                            <span className="bold text-orange ">{rankedUserResults?.clientsLength === 1 ? 'Cliente' : 'Cliente'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="col-6 d-flex justify-content-center align-items-center my-2 text-center text-secondary">
                                                        <div>


                                                            <span className="fw-bold fs-3"><CountUp end={rankedUserResults?.clientsRating} separator="." duration={2} /> <FontAwesomeIcon icon={faStar} className="text-warning" /></span><br />
                                                            <span className="bold text-orange">Nota de atendimento</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        :
                        <div className="row my-3">
                            <div className="col-12 d-flex justify-content-center text-center">
                                <span className="text-secondary">Nenhuma captação feita <FontAwesomeIcon icon={faFaceSadTear} className="text-secondary" /></span>
                            </div>
                        </div>
                    }




                    <div className="col-12 d-flex justify-content-center text-center mt-4" >

                        <span className="small text-secondary fw-bold">Mestre de avaliações</span>
                    </div>

                    {rankedUserValuationResults.firstName ?


                        <div className="col-12 mt-2 ">

                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 mt-2 ">
                                        <div className="row d-flex justify-content-center">

                                            <div className="position-relative text-center" style={{ width: '150px' }}>
                                                <div className="col-12 d-flex justify-content-center">

                                                    <span style={{ position: 'absolute', left: '20px', top: '-10px', transform: 'rotate(-20deg)' }}>
                                                        <FontAwesomeIcon icon={faLightbulb} className="text-primary fs-2" />
                                                    </span>
                                                    <span style={{ position: 'absolute', right: '10px', top: '90px', transform: 'rotate(10deg)' }}>
                                                        <FontAwesomeIcon icon={faCalculator} className="text-secondary fs-2" />
                                                    </span>

                                                    <img src={rankedUserValuationResults?.profileImageUrl}
                                                        className="rounded-circle" alt="" height={125} />
                                                </div>
                                                <span className="small fw-bold text-secondary">
                                                    {rankedUserValuationResults?.firstName} {rankedUserValuationResults?.lastName}
                                                </span>
                                            </div>

                                            <div className="col-lg col-12">
                                                <div className="row d-flex h-100">


                                                    <div className="col-6 d-flex justify-content-center align-items-center my-2 text-center text-secondary">
                                                        <div>

                                                            <span className="fw-bold fs-3"><CountUp end={rankedUserValuationResults?.clientsValuations} separator="." duration={2} /></span><br />
                                                            <span className="bold text-orange">{rankedUserValuationResults?.clientsValuations > 1 ? 'Avaliações' : 'Avaliação'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="col-6 d-flex justify-content-center align-items-center my-2 text-center text-secondary">
                                                        <div>

                                                            <span className="fw-bold " style={{ fontSize: '1rem' }}>R$ <CountUp end={rankedUserValuationResults?.averageTicket} separator="." duration={2} />,00</span><br />
                                                            <span className="bold text-orange">Ticket médio de avaliação</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>






                        </div>
                        :
                        <div className="row my-3">
                            <div className="col-12 d-flex justify-content-center text-center">
                                <span className="text-secondary">Não há avaliações <FontAwesomeIcon icon={faFaceSadTear} className="text-secondary" /></span>
                            </div>
                        </div>
                    }

                    {companyData?.usersArray?.length > 1 ?
                        <div className="col-12 mt-5 d-flex justify-content-center">
                            <Link href='/usersManagement'>
                                <button className="btn btn-outline-orange">Visualizar todos os usuários</button>
                            </Link>
                        </div>
                        :

                        <div className="col-12 mt-5 d-flex justify-content-center">
                            <Link href='/userAdd'>
                                <button className="btn btn-outline-orange">Adicionar usuários</button>
                            </Link>
                        </div>

                    }


                    {rankedUserResults.firstName && rankedUserValuationResults.firstName && false && !isMobile() && (

                        <div className="col-12  my-5 ">


                            <div className="row d-flex justify-content-center">
                                <div className="col-12 col-lg-6 d-flex justify-content-center">
                                    <img src={companyData?.logo} alt="" className="companyLogo" />
                                </div>
                                {/* <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center my-2 text-center text-secondary">
            <div className="row">

                <div className="col-12 ">

                    <span className="fw-bold fs-2"><CountUp end={companyData?.usersArray?.length} separator="." duration={2} /></span>
                    {companyData?.usersArray?.length <= 1 && (<span className="fw-bold fs-2 ms-2"><FontAwesomeIcon icon={faFaceSadTear} className="text-secondary" /></span>)}<br />
                    <span className="bold text-orange fs-3">Usuário{companyData?.usersArray?.length > 1 ? 's' : ''} </span>
                </div>
                 <div class="col-12 image-container">
                    <div class="image-wrapper">
                        <img src={rankedUserValuationResults?.profileImageUrl} class="akvo-sm-profile-img" alt="" />
                    </div>
                </div> 
            </div>
        </div> */}
                            </div>

                        </div>

                    )}


                </div>

            </div>
        </div >
    )
}