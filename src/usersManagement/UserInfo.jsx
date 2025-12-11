import { faEnvelope, faMapMarkerAlt, faPhone, faUser, faUserGear, faUserTie, faIdCard, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { permissionShow, userStatusName } from "../../utils/permissions"

export default function UserInfo(props) {

    const user = props.user
    const token = props.token

    return (
        <>
            <style jsx>{`
                .user-info-container {
                    position: relative;
                }

                .edit-dropdown-wrapper {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    z-index: 10;
                }

                .edit-trigger-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #f5874f 0%, #ff9d6e 100%);
                    color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(245, 135, 79, 0.3);
                }

                .edit-trigger-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(245, 135, 79, 0.4);
                }

                .custom-dropdown-menu {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                    padding: 0.5rem;
                    min-width: 220px;
                    margin-top: 0.5rem;
                }

                .custom-dropdown-item {
                    border-radius: 8px;
                    padding: 0.75rem 1rem;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-weight: 500;
                }

                .custom-dropdown-item:hover {
                    background: #fff3ed;
                    transform: translateX(4px);
                }

                .custom-dropdown-item.danger:hover {
                    background: #fee;
                    color: #dc3545;
                }

                .profile-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 2rem 0;
                }

                .profile-image-wrapper {
                    position: relative;
                }

                .profile-image {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 5px solid #f5874f;
                    box-shadow: 0 8px 24px rgba(245, 135, 79, 0.25);
                    padding: 4px;
                    background: white;
                }

                .user-name-section {
                    text-align: center;
                }

                .user-name {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #2c3e50;
                    margin-bottom: 0.5rem;
                }

                .user-role-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: linear-gradient(135deg, #f5874f 0%, #ff9d6e 100%);
                    color: white;
                    padding: 0.5rem 1.25rem;
                    border-radius: 25px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    box-shadow: 0 4px 12px rgba(245, 135, 79, 0.25);
                }

                .info-grid {
                    display: grid;
                    gap: 1rem;
                    margin-top: 2rem;
                }

                .info-card {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 1rem 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }

                .info-card:hover {
                    background: #fff3ed;
                    border-color: #f5874f;
                    transform: translateX(4px);
                }

                .info-icon-wrapper {
                    width: 45px;
                    height: 45px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #f5874f 0%, #ff9d6e 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 1.1rem;
                }

                .info-content {
                    flex: 1;
                    min-width: 0;
                }

                .info-label {
                    font-size: 0.75rem;
                    color: #6c757d;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 0.25rem;
                }

                .info-value {
                    font-size: 1rem;
                    color: #2c3e50;
                    font-weight: 500;
                    word-break: break-word;
                }

                .custom-footer {
                    padding: 1.5rem 2rem;
                    border-top: 2px solid #f0f0f0;
                    background: #fafafa;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }

                .footer-btn {
                    padding: 0.75rem 2rem;
                    border-radius: 10px;
                    border: 2px solid #dee2e6;
                    background: white;
                    color: #6c757d;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .footer-btn:hover {
                    border-color: #f5874f;
                    color: #f5874f;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(245, 135, 79, 0.2);
                }

                @media (max-width: 768px) {
                    .profile-section {
                        padding: 1.5rem 0;
                    }

                    .profile-image {
                        width: 120px;
                        height: 120px;
                    }

                    .user-name {
                        font-size: 1.5rem;
                    }

                    .info-grid {
                        gap: 0.75rem;
                    }

                    .custom-footer {
                        padding: 1rem 1.5rem;
                    }
                }
            `}</style>

            <div className="modal-body user-info-container">
                {permissionShow(token?.userStatus, user?._id, token?.sub, true) && (
                    <div className="edit-dropdown-wrapper">
                        <div className="dropdown">
                            <button 
                                className="edit-trigger-btn" 
                                data-bs-toggle="dropdown" 
                                type="button"
                                aria-label="Menu de edição"
                            >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>

                            <ul className="dropdown-menu custom-dropdown-menu dropdown-menu-end">
                                <li
                                    className='custom-dropdown-item'
                                    type="button"
                                    onClick={() => props.setEditStatus(true)}
                                >
                                    <FontAwesomeIcon icon={faUserGear} />
                                    Editar categoria do usuário
                                </li>
                                <li
                                    className='custom-dropdown-item danger'
                                    type="button"
                                    onClick={() => props.setDeleteStatus(true)}
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                    Excluir usuário
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                <div className="profile-section">
                    <div className="profile-image-wrapper">
                        <img 
                            src={user?.profileImageUrl} 
                            alt={`${user?.firstName} ${user?.lastName}`}
                            className="profile-image" 
                        />
                    </div>

                    <div className="user-name-section">
                        <h2 className="user-name">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <div className="user-role-badge">
                            <FontAwesomeIcon 
                                icon={user?.userStatus === "admGlobal" ? faUserGear : faUserTie} 
                            />
                            {userStatusName(user?.userStatus) || '-'}
                        </div>
                    </div>
                </div>

                <div className="info-grid">
                    <div className="info-card">
                        <div className="info-icon-wrapper">
                            <FontAwesomeIcon icon={faIdCard} />
                        </div>
                        <div className="info-content">
                            <div className="info-label">CRECI</div>
                            <div className="info-value">{user?.creci || 'Não informado'}</div>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon-wrapper">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                        <div className="info-content">
                            <div className="info-label">E-mail</div>
                            <div className="info-value">{user?.workEmail || 'Não informado'}</div>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon-wrapper">
                            <FontAwesomeIcon icon={faWhatsapp} />
                        </div>
                        <div className="info-content">
                            <div className="info-label">WhatsApp</div>
                            <div className="info-value">{user?.celular || 'Não informado'}</div>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon-wrapper">
                            <FontAwesomeIcon icon={faPhone} />
                        </div>
                        <div className="info-content">
                            <div className="info-label">Telefone</div>
                            <div className="info-value">{user?.telefone || 'Não informado'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-footer custom-footer">
                <button 
                    className="footer-btn" 
                    data-bs-dismiss="modal" 
                    onClick={() => props.handleCloseModal()}
                >
                    Fechar
                </button>
            </div>
        </>
    )
}