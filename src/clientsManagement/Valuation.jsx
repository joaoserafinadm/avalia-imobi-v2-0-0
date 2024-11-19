import Link from "next/link";
import ValuationPropertyCollection from "./ValuationPropertyCollection";
import ValuationPropertyCalc from "./ValuationPropertyCalc";
import ValuationStatus from "./ValuationStatus";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGear, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { userStatusName } from "../../utils/permissions";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import SelectedValue from "./SelectedValue";
import ServiceAvaliation from "./ServiceAvaliation";
import handleShare from "../../utils/handleShare";
import { generatePDF } from "../../utils/generatePdf";



export default function Valuation(props) {

    const token = jwt.decode(Cookies.get("auth"));

    const userData = props.userData


    const client = props.client

    const propertyArray = props?.client?.valuation?.propertyArray

    const users = useSelector(state => state.users)

    const valuationUser = users?.find(elem => elem._id === client?.valuation?.user_id)







    return (
        <>
            {!client?.valuation ?
                <div className="row my-5">
                    <div className="col-12 d-flex justify-content-center text-center">
                        <span>Nenhuma avaliação feita</span>
                    </div>
                    <div className="col-12 d-flex justify-content-center text-center mt-2">
                        <Link href={"/valuation/" + client?._id}>
                            <button className="btn btn-orange" data-bs-dismiss="modal">Avaliar imóvel</button>
                        </Link>
                    </div>
                </div>

                :
                <div className="row">
                    {client?.status === 'evaluated' && (

                        <div className="col-12 d-flex justify-content-end mb-3">

                            <Link href={"/valuationEdit/" + client?._id}>
                                <span className="span" data-bs-dismiss="modal">editar</span>
                            </Link>
                        </div>
                    )}

                    <div className="col-12 d-flex justify-content-end mb-3">
                        <button className="btn btn-outline-orange mx-1"
                            onClick={() => handleShare(client?.valuation?.urlToken + '&userId=' + token.sub)}>
                            Compartilhar avaliação
                        </button>
                        <button className="btn btn-outline-orange mx-1" onClick={() => generatePDF('valuationPdf', userData.companyName)}>Baixar PDF</button>

                    </div>





                    <div className="col-12 d-flex">


                        <label htmlFor="" className="fw-bold mb-2">Status: </label>
                        <div>
                            <ValuationStatus status={client?.status} />
                        </div>
                    </div>

                    {client?.status === 'answered' && (
                        <>
                            <SelectedValue client={client} dataFunction={props.dataFunction} />
                            <ServiceAvaliation client={client} />
                        </>
                    )}


                    <div className="col-12 mt-5">

                        <label htmlFor="" className="fw-bold mb-2">Avaliação feita por:</label>

                        <div className="col-12 col-lg-8">
                            <div className="card">

                                <div className="card-body">

                                    <div className="row d-flex">
                                        <div style={{ width: "70px" }}>
                                            <img src={valuationUser?.profileImageUrl} alt="" className="cardProfileImg2" height={50} />
                                        </div>
                                        <div className="col">
                                            <div className="row">
                                                <span className="bold">{valuationUser?.firstName} {valuationUser?.lastName}</span>
                                            </div>
                                            <div className="row  small text-secondary">

                                                <span>
                                                    {valuationUser?.userStatus === "admGlobal" ? <FontAwesomeIcon icon={faUserGear} /> : <FontAwesomeIcon icon={faUserTie} />} {valuationUser?.userStatus === 'admGlobal' ? 'Administrador' : 'Corretor'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>




                                </div>
                            </div>
                        </div>
                    </div>

                    <ValuationPropertyCalc client={client} />
                    <div className="col-12 text-center">
                        <label htmlFor="" className="fw-bold mb-2">Imóveis para comparação</label>


                        <ValuationPropertyCollection
                            propertyArray={propertyArray} />



                    </div>


                </div>
            }
        </>
    )
}