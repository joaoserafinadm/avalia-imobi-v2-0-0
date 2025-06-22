import Link from "next/link";
import ValuationPropertyCollection from "./ValuationPropertyCollection";
import ValuationPropertyCalc from "./ValuationPropertyCalc";
import ValuationStatus from "./ValuationStatus";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGear, faUserTie, faShare, faDownload, faEdit } from "@fortawesome/free-solid-svg-icons";
import { userStatusName } from "../../utils/permissions";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import SelectedValue from "./SelectedValue";
import ServiceAvaliation from "./ServiceAvaliation";
import handleShare from "../../utils/handleShare";
import { generatePDF } from "../../utils/generatePdf";

export default function Valuation(props) {
    const token = jwt.decode(Cookies.get("auth"));
    const userData = props.userData;
    const client = props.client;
    const propertyArray = props?.client?.valuation?.propertyArray;
    const users = useSelector(state => state.users);
    const valuationUser = users?.find(elem => elem._id === client?.valuation?.user_id);

    return (
        <>
            <style jsx>{`
                .valuation-container {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(15px);
                    border-radius: 20px;
                    border: 1px solid rgba(245, 135, 79, 0.1);
                    padding: 30px;
                    margin: 20px 0;
                    position: relative;
                    overflow: hidden;
                }

                .valuation-container::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #f5874f, #faa954);
                }

                .no-valuation-state {
                    background: linear-gradient(
                        135deg,
                        rgba(245, 135, 79, 0.1),
                        rgba(250, 169, 84, 0.1)
                    );
                    border-radius: 20px;
                    padding: 60px 30px;
                    text-align: center;
                    margin: 40px 0;
                }

                .no-valuation-text {
                    color: #5a5a5a;
                    font-size: 1.2rem;
                    font-weight: 500;
                    margin-bottom: 25px;
                }

                .valuation-button-modern {
                    background: linear-gradient(135deg, #f5874f, #faa954);
                    border: none;
                    color: white;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(245, 135, 79, 0.3);
                    text-decoration: none;
                    display: inline-block;
                    animation: pulse 2s infinite;
                }

                .valuation-button-modern:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(245, 135, 79, 0.4);
                    color: white;
                    text-decoration: none;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 4px 15px rgba(245, 135, 79, 0.3); }
                    50% { box-shadow: 0 4px 25px rgba(245, 135, 79, 0.5); }
                    100% { box-shadow: 0 4px 15px rgba(245, 135, 79, 0.3); }
                }

                .actions-header {
                    display: flex;
                    justify-content: flex-end;
                    gap: 15px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }

                .edit-link-modern {
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid rgba(245, 135, 79, 0.2);
                    color: #f5874f;
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .edit-link-modern:hover {
                    background: #f5874f;
                    color: white;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(245, 135, 79, 0.3);
                    text-decoration: none;
                }

                .action-button-modern {
                    background: rgba(255, 255, 255, 0.9);
                    border: 2px solid rgba(245, 135, 79, 0.2);
                    color: #f5874f;
                    padding: 10px 18px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .action-button-modern:hover {
                    background: #f5874f;
                    color: white;
                    border-color: #f5874f;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(245, 135, 79, 0.3);
                }

                .status-section {
                    background: rgba(248, 249, 250, 0.8);
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 25px;
                    border: 1px solid rgba(233, 236, 239, 0.5);
                }

                .status-label {
                    color: #5a5a5a;
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                }

                .status-label::before {
                    content: "";
                    width: 4px;
                    height: 18px;
                    background: linear-gradient(135deg, #f5874f, #faa954);
                    border-radius: 2px;
                    margin-right: 10px;
                }

                .evaluator-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(245, 135, 79, 0.1);
                    border-radius: 20px;
                    padding: 25px;
                    margin: 25px 0;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                }

                .evaluator-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }

                .evaluator-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    border: 1px solid rgba(245, 135, 79, 0.1);
                    border-radius: 20px;
                    padding: 20px;
                    margin-bottom: 20px;
                }

                .evaluator-avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: 3px solid rgba(245, 135, 79, 0.2);
                    object-fit: cover;
                    transition: all 0.3s ease;
                }

                .evaluator-avatar:hover {
                    border-color: #f5874f;
                    transform: scale(1.05);
                }

                .evaluator-info h4 {
                    color: #5a5a5a;
                    font-weight: 700;
                    margin-bottom: 5px;
                    font-size: 1.2rem;
                }

                .evaluator-role {
                    color: #f5874f;
                    font-weight: 500;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .comparison-section {
                    background: rgba(248, 249, 250, 0.8);
                    border-radius: 20px;
                    padding: 30px;
                    margin-top: 30px;
                    border: 1px solid rgba(233, 236, 239, 0.5);
                    text-align: center;
                }

                .section-title-modern {
                    color: #5a5a5a;
                    font-weight: 700;
                    font-size: 1.3rem;
                    margin-bottom: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .section-title-modern::before {
                    content: "";
                    width: 4px;
                    height: 20px;
                    background: linear-gradient(135deg, #f5874f, #faa954);
                    border-radius: 2px;
                    margin-right: 12px;
                }

                .divider-modern {
                    height: 2px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(245, 135, 79, 0.3),
                        transparent
                    );
                    margin: 30px 0;
                    border: none;
                }

                @media (max-width: 768px) {
                    .valuation-container {
                        padding: 20px;
                        margin: 10px 0;
                    }

                    .actions-header {
                        justify-content: center;
                        gap: 10px;
                    }

                    .evaluator-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 15px;
                    }

                    .no-valuation-state {
                        padding: 40px 20px;
                    }
                }
            `}</style>

            {!client?.valuation ? (
                <div className="no-valuation-state">
                    <div className="no-valuation-text">
                        Nenhuma avaliação foi realizada para este imóvel
                    </div>
                    <Link href={"/valuation/" + client?._id} className="valuation-button-modern" data-bs-dismiss="modal">
                        <button className="valuation-button-modern" data-bs-dismiss="modal">

                            Avaliar imóvel
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="">
                    <div className="actions-header d-flex justify-content-between">
                        <div className="d-flex">

                            <button
                                className="action-button-modern me-2"
                                onClick={() => handleShare(client?.valuation?.urlToken + '&userId=' + token.sub)}
                            >
                                <FontAwesomeIcon icon={faShare} />
                                Compartilhar
                            </button>

                            <button
                                className="action-button-modern "
                                onClick={() => generatePDF('valuationPdf', userData.companyName)}
                            >
                                <FontAwesomeIcon icon={faDownload} />
                                Baixar PDF
                            </button>
                        </div>
                        {/* {client?.status === 'evaluated' && ( */}
                            <div>
                                <Link href={"/valuationEdit/" + client?._id} >
                                <button className="btn  btn-outline-orange" data-bs-dismiss="modal">

                                    Editar Avaliação
                                </button>
                                </Link>
                            </div>
                        {/* )} */}

                        
                    </div>

                    <div className="status-section">
                        <div className="status-label">Status da Avaliação</div>
                        <ValuationStatus status={client?.status} />
                    </div>

                    {client?.status === 'answered' && (
                        <>
                            <SelectedValue client={client} dataFunction={props.dataFunction} />
                            <ServiceAvaliation client={client} />
                        </>
                    )}

                    <hr />

                    <div className="">
                        <div className="status-label">Avaliação realizada por:</div>
                        <div className="evaluator-header">
                            <img
                                src={valuationUser?.profileImageUrl}
                                alt="Foto do avaliador"
                                className="evaluator-avatar"
                            />
                            <div className="evaluator-info">
                                <h4>{valuationUser?.firstName} {valuationUser?.lastName}</h4>
                                <div className="evaluator-role">
                                    <FontAwesomeIcon
                                        icon={valuationUser?.userStatus === "admGlobal" ? faUserGear : faUserTie}
                                    />
                                    {valuationUser?.userStatus === 'admGlobal' ? 'Administrador' : 'Corretor'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />


                    <ValuationPropertyCalc client={client} />

                    <hr />

                    <div className=" mt-5">
                        <h3 className="section-title-modern">
                            Imóveis utilizados para comparação
                        </h3>
                        <ValuationPropertyCollection propertyArray={propertyArray} />
                    </div>
                </div>
            )}
        </>
    );
}