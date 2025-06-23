import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { TypeAnimation } from "react-type-animation"
import Icons from "../../components/icons"
import { CheckCircle, ChevronRight, ChevronRightCircle, Info } from "lucide-react"

export default function StartPage(props) {
    const clientData = props.clientData
    const userData = props.userData
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShowButton(true)
        }, 6000)
    }, [])

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center position-relative overflow-hidden">
            {/* Background overlay */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-br opacity-10"></div>
            
            {/* Floating elements for visual appeal */}
            <div className="floating-elements position-absolute w-100 h-100">
                <div className="floating-circle floating-circle-1"></div>
                <div className="floating-circle floating-circle-2"></div>
                <div className="floating-circle floating-circle-3"></div>
            </div>

            <div className="container position-relative z-index-2">
                <div className="row justify-content-center align-items-center min-vh-100">
                    <div className="col-12 col-xl-10">
                        <div className="row align-items-center">
                            
                            {/* Profile Image Section */}
                            <div className="col-12 col-lg-5 text-center mb-4 mb-lg-0">
                                <div className="profile-container position-relative d-inline-block">
                                    <div className="profile-glow position-absolute top-50 start-50 translate-middle"></div>
                                    <img 
                                        src={userData?.profileImageUrl} 
                                        alt="Perfil" 
                                        className="profile-image rounded-circle border border-4 border-white shadow-lg position-relative"
                                    />
                                    <div className="profile-pulse position-absolute top-50 start-50 translate-middle rounded-circle"></div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="col-12 col-lg-7">
                                <div className="content-wrapper p-4 p-lg-5">
                                    {/* Welcome Badge */}
                                    <div className="welcome-badge d-inline-block mb-4">
                                        <span className="badge bg-light text-white px-3 py-2 rounded-pill fw-normal" style={{backgroundColor: '#5a5a5a', color: 'white'}}>
                                            <CheckCircle size={16} className="me-2" style={{color: '#f5874f'}}/>
                                            Avaliação Concluída
                                        </span>
                                    </div>

                                    {/* Main Message */}
                                    <div className="main-message mb-4">
                                        <h1 className="display-6 fw-bold text-white mb-3 lh-base">
                                            <TypeAnimation
                                                sequence={[
                                                    500,
                                                    `A avaliação do seu imóvel foi concluída.`,
                                                    200,
                                                    `A avaliação do seu imóvel foi concluída.\nClique no botão abaixo para começar.`,
                                                ]}
                                                wrapper="span"
                                                speed={50}
                                                style={{ 
                                                    display: 'inline-block', 
                                                    whiteSpace: 'pre-line',
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                                }}
                                            />
                                        </h1>
                                    </div>

                                    {/* Action Button */}
                                    {showButton && (
                                        <div className="action-section animate-fade-in-up">
                                            <button 
                                                className="btn btn-cta btn-lg px-5 py-3 fw-semibold text-uppercase letter-spacing-1 position-relative overflow-hidden"
                                                data-bs-target="#valuationCarousel" 
                                                data-bs-slide-to={1}
                                            >
                                                <span className="btn-text position-relative z-index-1">
                                                    Começar Agora
                                                    <ChevronRight size={20} className="ms-2" />
                                                </span>
                                                <div className="btn-shine position-absolute top-0 start-0 w-100 h-100"></div>
                                            </button>
                                            
                                            <div className="mt-3 text-white-50 small">
                                                <Info size={16} className="me-2" />
                                                Visualize os detalhes da sua avaliação
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* Profile Image Styles */
                .profile-image {
                    width: 200px;
                    height: 200px;
                    object-fit: cover;
                    border-width: 4px !important;
                    transition: transform 0.3s ease;
                    z-index: 2;
                }

                .profile-container:hover .profile-image {
                    transform: scale(1.05);
                }

                .profile-glow {
                    width: 220px;
                    height: 220px;
                    background: linear-gradient(45deg, #f5874f, #faa954);
                    border-radius: 50%;
                    filter: blur(20px);
                    opacity: 0.3;
                    animation: pulse-glow 2s ease-in-out infinite alternate;
                }

                .profile-pulse {
                    width: 240px;
                    height: 240px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
                }

                @keyframes pulse-glow {
                    0% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1.1); }
                }

                @keyframes pulse-ring {
                    0% { transform: translate(-50%, -50%) scale(0.9); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
                }

                /* Floating Elements */
                .floating-elements {
                    pointer-events: none;
                }

                .floating-circle {
                    position: absolute;
                    border-radius: 50%;
                    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                    backdrop-filter: blur(10px);
                    animation: float 6s ease-in-out infinite;
                }

                .floating-circle-1 {
                    width: 80px;
                    height: 80px;
                    top: 20%;
                    right: 10%;
                    animation-delay: 0s;
                }

                .floating-circle-2 {
                    width: 60px;
                    height: 60px;
                    bottom: 30%;
                    left: 5%;
                    animation-delay: 2s;
                }

                .floating-circle-3 {
                    width: 100px;
                    height: 100px;
                    top: 60%;
                    right: 20%;
                    animation-delay: 4s;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-20px) rotate(5deg); }
                    66% { transform: translateY(10px) rotate(-3deg); }
                }

                /* Button Styles */
                .btn-cta {
                    background: linear-gradient(135deg, #f5874f 0%, #faa954 100%);
                    border: none;
                    color: white;
                    border-radius: 50px;
                    box-shadow: 0 8px 25px rgba(245, 135, 79, 0.3);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    transform: translateY(0);
                }

                .btn-cta:hover {
                    background: linear-gradient(135deg, #e67742 0%, #f19d47 100%);
                    box-shadow: 0 12px 35px rgba(245, 135, 79, 0.4);
                    transform: translateY(-2px);
                    color: white;
                }

                .btn-cta:active {
                    transform: translateY(0);
                    box-shadow: 0 4px 15px rgba(245, 135, 79, 0.3);
                }

                .btn-shine {
                    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
                    transform: translateX(-100%);
                    transition: transform 0.6s;
                }

                .btn-cta:hover .btn-shine {
                    transform: translateX(100%);
                }

                /* Welcome Badge */
                .welcome-badge .badge {
                    backdrop-filter: blur(10px);
                    background: #5a5a5a !important;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    animation: fade-in-down 1s ease-out 0.5s both;
                }

                /* Animations */
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out 0.3s both;
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Utility Classes */
                .letter-spacing-1 {
                    letter-spacing: 1px;
                }

                .z-index-2 {
                    z-index: 2;
                }

                /* Content wrapper */
                .content-wrapper {
                    position: relative;
                }

                /* Responsive adjustments */
                @media (max-width: 991.98px) {
                    .profile-image {
                        width: 160px;
                        height: 160px;
                    }
                    
                    .profile-glow {
                        width: 180px;
                        height: 180px;
                    }
                    
                    .profile-pulse {
                        width: 200px;
                        height: 200px;
                    }
                    
                    .display-6 {
                        font-size: 1.75rem;
                    }
                }

                @media (max-width: 767.98px) {
                    .btn-cta {
                        width: 100%;
                        max-width: 300px;
                    }
                }
            `}</style>
        </div>
    )
}