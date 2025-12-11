import axios from "axios"
import { useState } from "react"
import { SpinnerSM } from "../components/loading/Spinners"
import baseUrl from "../../utils/baseUrl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserShield, faUserTie, faCheck, faExclamationCircle } from "@fortawesome/free-solid-svg-icons"

export default function EditUserStatus(props) {

    const user = props.user
    const token = props.token

    const [userStatusEdit, setUserStatusEdit] = useState(user.userStatus)
    const [saveError, setSaveError] = useState('')

    const [loadingSave, setLoadingSave] = useState(false)

    const handleSave = async () => {
        setLoadingSave(true)
        setSaveError('')

        await axios.patch(`${baseUrl()}/api/usersManagement`, {
            company_id: token.company_id,
            user_id: token.sub,
            userSelected: user._id,
            userStatus: userStatusEdit
        }).then(res => {
            props.setEditStatus(false)
            props.dataFunction()
        }).catch(e => {
            setSaveError('O usuário não pode ser editado')
            setLoadingSave(false)
        })
    }

    const userRoles = [
        {
            value: 'admGlobal',
            label: 'Administrador',
            icon: faUserShield,
            description: 'Acesso total ao sistema'
        },
        {
            value: 'user',
            label: 'Corretor',
            icon: faUserTie,
            description: 'Acesso padrão de corretor'
        }
    ]

    return (
        <>
            <style jsx>{`
                .edit-modal-body {
                    padding: 2rem;
                }

                .user-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                    padding-bottom: 2rem;
                    border-bottom: 2px solid #f0f0f0;
                }

                .profile-image-edit {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid #f5874f;
                    box-shadow: 0 6px 20px rgba(245, 135, 79, 0.25);
                    padding: 3px;
                    background: white;
                }

                .user-name-edit {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #2c3e50;
                    text-align: center;
                    margin: 0;
                }

                .form-section {
                    margin-top: 1.5rem;
                }

                .form-label-custom {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #2c3e50;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .role-options {
                    display: grid;
                    gap: 1rem;
                }

                .role-card {
                    border: 3px solid #e9ecef;
                    border-radius: 14px;
                    padding: 1.25rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: white;
                    position: relative;
                    overflow: hidden;
                }

                .role-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(135deg, #f5874f 0%, #ff9d6e 100%);
                    transform: scaleX(0);
                    transition: transform 0.3s ease;
                }

                .role-card:hover {
                    border-color: #f5874f;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(245, 135, 79, 0.15);
                }

                .role-card:hover::before {
                    transform: scaleX(1);
                }

                .role-card.selected {
                    border-color: #f5874f;
                    background: linear-gradient(135deg, #fff9f5 0%, #fff3ed 100%);
                    box-shadow: 0 6px 16px rgba(245, 135, 79, 0.2);
                }

                .role-card.selected::before {
                    transform: scaleX(1);
                }

                .role-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 0.75rem;
                }

                .role-icon {
                    width: 45px;
                    height: 45px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #f5874f 0%, #ff9d6e 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }

                .role-card:hover .role-icon,
                .role-card.selected .role-icon {
                    transform: scale(1.1);
                }

                .role-info {
                    flex: 1;
                }

                .role-label {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #2c3e50;
                    margin: 0;
                }

                .role-description {
                    font-size: 0.9rem;
                    color: #6c757d;
                    margin: 0.25rem 0 0 0;
                }

                .role-check {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: 3px solid #dee2e6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                }

                .role-card.selected .role-check {
                    background: linear-gradient(135deg, #f5874f 0%, #ff9d6e 100%);
                    border-color: #f5874f;
                    color: white;
                }

                .error-alert {
                    background: #fee;
                    border: 2px solid #dc3545;
                    border-radius: 12px;
                    padding: 1rem 1.25rem;
                    margin-top: 1.5rem;
                    color: #dc3545;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    animation: shake 0.5s;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
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
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid;
                    min-width: 120px;
                }

                .btn-cancel {
                    background: white;
                    border-color: #dee2e6;
                    color: #6c757d;
                }

                .btn-cancel:hover:not(:disabled) {
                    border-color: #adb5bd;
                    color: #495057;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .btn-cancel:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .btn-save {
                    background: linear-gradient(135deg, #f5874f 0%, #ff9d6e 100%);
                    border-color: #f5874f;
                    color: white;
                }

                .btn-save:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(245, 135, 79, 0.4);
                }

                .btn-save:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .edit-modal-body {
                        padding: 1.5rem;
                    }

                    .user-header {
                        margin-bottom: 2rem;
                    }

                    .custom-footer {
                        padding: 1rem 1.5rem;
                        flex-direction: column;
                    }

                    .footer-btn {
                        width: 100%;
                        max-width: none;
                    }
                }
            `}</style>

            <div className="modal-body edit-modal-body">
                <div className="user-header">
                    <img 
                        src={user.profileImageUrl} 
                        alt={`${user.firstName} ${user.lastName}`}
                        className="profile-image-edit" 
                    />
                    <h2 className="user-name-edit">
                        {user.firstName} {user.lastName}
                    </h2>
                </div>

                <div className="form-section">
                    <label className="form-label-custom">
                        <FontAwesomeIcon icon={faUserShield} />
                        Categoria do usuário
                    </label>

                    <div className="role-options">
                        {userRoles.map((role) => (
                            <div
                                key={role.value}
                                className={`role-card ${userStatusEdit === role.value ? 'selected' : ''}`}
                                onClick={() => setUserStatusEdit(role.value)}
                            >
                                <div className="role-header">
                                    <div className="role-icon">
                                        <FontAwesomeIcon icon={role.icon} />
                                    </div>
                                    <div className="role-info">
                                        <h4 className="role-label">{role.label}</h4>
                                        <p className="role-description">{role.description}</p>
                                    </div>
                                    <div className="role-check">
                                        {userStatusEdit === role.value && (
                                            <FontAwesomeIcon icon={faCheck} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {saveError && (
                        <div className="error-alert">
                            <FontAwesomeIcon icon={faExclamationCircle} />
                            {saveError}
                        </div>
                    )}
                </div>
            </div>

            <div className="modal-footer custom-footer">
                <button 
                    className="footer-btn btn-cancel" 
                    onClick={() => props.setEditStatus(false)} 
                    disabled={loadingSave}
                >
                    Cancelar
                </button>
                {loadingSave ? (
                    <button className="footer-btn btn-save" disabled>
                        <SpinnerSM />
                    </button>
                ) : (
                    <button 
                        className="footer-btn btn-save" 
                        onClick={() => handleSave()}
                    >
                        Salvar alterações
                    </button>
                )}
            </div>
        </>
    )
}