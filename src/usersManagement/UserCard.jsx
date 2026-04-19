import tippy from "tippy.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEnvelope, faEye, faPhone, faSearch, faTrash, faUser, faUserGear, faUserTie, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useEffect } from "react";
import Link from "next/link";
import { userStatusName } from "../../utils/permissions";

export default function UserCard(props) {

    useEffect(() => {
        setTimeout(() => {
            tippy('#viewUserBtn' + props.elem._id, {
                content: 'Visualizar',
                placement: 'bottom'
            })
            tippy('#whatsappUserBtn' + props.elem._id, {
                content: 'Conversar pelo Whatsapp',
                placement: 'bottom'
            })
        }, 1000)
    }, [])

    const handleWhatsapp = (celular) => {
        const formattedPhoneNumber = celular.replace(/\D/g, '')
        const whatsappURL = `https://api.whatsapp.com/send?phone=${formattedPhoneNumber}`;
        window.open(whatsappURL, '_blank');
    }

    return (
        <>
            <style jsx>{`
                .user-card-wrapper {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .user-card-wrapper:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 32px rgba(245, 135, 79, 0.12) !important;
                }

                .user-card {
                    background: linear-gradient(145deg, #0d1420 0%, #111827 60%, #0f1b2d 100%) !important;
                    border: 1px solid rgba(245, 135, 79, 0.15) !important;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.04);
                }

                .user-card-header {
                    background: linear-gradient(135deg, #f5874f 0%, #ff9d6e 100%);
                    padding: 1rem;
                    border-radius: 16px 16px 0 0;
                }

                .profile-img-wrapper {
                    position: relative;
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.1);
                }

                .profile-img-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .user-name {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .user-role-badge {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    padding: 0.35rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: white;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .user-info-section {
                    padding: 1.25rem 1.5rem 0.5rem;
                }

                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.7rem 0.85rem;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.07);
                    margin-bottom: 0.6rem;
                    transition: all 0.2s ease;
                }

                .info-item:hover {
                    background: rgba(245, 135, 79, 0.07);
                    border-color: rgba(245, 135, 79, 0.2);
                    transform: translateX(3px);
                }

                .info-icon {
                    width: 33px;
                    height: 33px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, rgba(245, 135, 79, 0.25) 0%, rgba(255, 157, 110, 0.2) 100%);
                    color: #f5874f;
                    border-radius: 8px;
                    flex-shrink: 0;
                }

                .info-text {
                    font-size: 0.88rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                    word-break: break-word;
                }

                .action-buttons {
                    padding: 0.75rem 1.5rem 1.25rem;
                    display: flex;
                    gap: 0.75rem;
                    justify-content: center;
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                    margin-top: 0.5rem;
                }

                .action-btn {
                    flex: 1;
                    max-width: 120px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1px solid rgba(245, 135, 79, 0.35);
                    background: rgba(245, 135, 79, 0.06);
                    color: #f5874f;
                    font-weight: 600;
                    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .action-btn:hover:not(:disabled) {
                    background: #f5874f;
                    color: #0d1420;
                    transform: translateY(-2px) scale(1.04);
                    box-shadow: 0 4px 14px rgba(245, 135, 79, 0.35);
                    border-color: #f5874f;
                }

                .action-btn:disabled {
                    border-color: rgba(255, 255, 255, 0.08);
                    color: rgba(255, 255, 255, 0.2);
                    cursor: not-allowed;
                    opacity: 0.5;
                    background: rgba(255, 255, 255, 0.02);
                }

                .action-btn svg {
                    font-size: 1rem;
                }
            `}</style>

            <div className="col-12 col-lg-6" key={props.elem._id}>
                <div className="user-card-wrapper my-2">
                    <div className=" user-card shadow">
                        {/* Header com gradiente */}
                        <div className="user-card-header">
                            <div className="d-flex align-items-center gap-3">
                                <div className="profile-img-wrapper">
                                    <img
                                        src={props.elem.profileImageUrl}
                                        alt="Profile"
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="user-name mb-2">
                                        {!props.elem.lastName && !props.elem.firstName
                                            ? "-"
                                            : `${props.elem.firstName} ${props.elem.lastName}`}
                                    </h3>
                                    <div className="user-role-badge">
                                        <FontAwesomeIcon
                                            icon={props.elem.userStatus === "admGlobal" ? faUserGear : faUserTie}
                                        />
                                        {userStatusName(props.elem.userStatus) || '-'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informações do usuário */}
                        <div className="user-info-section">
                            <div className="info-item">
                                <div className="info-icon">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <div className="d-flex flex-column">

                                    <p className="info-text">{props.elem.email}</p>
                                    {props.elem.workEmail && props.elem.workEmail !== props.elem.email && (<> / <p className="info-text">{props.elem.workEmail}</p></>)}

                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FontAwesomeIcon icon={faWhatsapp} />
                                        </div>
                                        <p className="info-text">
                                            {props.elem.celular || 'Não informado'}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FontAwesomeIcon icon={faPhone} />
                                        </div>
                                        <p className="info-text">
                                            {props.elem.telefone || 'Não informado'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Botões de ação */}
                        <div className="action-buttons">
                            <button
                                type="button"
                                className="action-btn"
                                id={"viewUserBtn" + props.elem._id}
                                onClick={() => props.setUserSelected(props.elem)}
                                data-bs-toggle="modal"
                                data-bs-target="#viewUserModal"
                            >
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                                type="button"
                                className="action-btn"
                                id={"whatsappUserBtn" + props.elem._id}
                                disabled={!props.elem.celular}
                                onClick={() => handleWhatsapp(props.elem.celular)}
                            >
                                <FontAwesomeIcon icon={faWhatsapp} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}