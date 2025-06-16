import { faBuilding, faHome, faMapLocation, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { porpertyTypeChange, setPropertyType } from "../../store/NewClientForm/NewClientForm.actions";
import { useEffect, useRef, useMemo } from "react";

// Mapeamento dos tipos para ícones (mais limpo e fácil de manter)
const PROPERTY_ICONS = {
    'Apartamento': faBuilding,
    'Casa': faHome,
    'Comercial': faStore,
    'Terreno': faMapLocation
};

// Labels customizáveis se necessário
const PROPERTY_LABELS = {
    'Apartamento': 'Apartamento',
    'Casa': 'Casa',
    'Comercial': 'Comercial',
    'Terreno': 'Terreno'
};

export default function PropertyTypeCard({ type, edit = false }) {
    const newClientForm = useSelector(state => state.newClientForm);
    const dispatch = useDispatch();
    const prevPropertyTypeRef = useRef();

    // Memoização dos valores calculados
    const isSelected = useMemo(() => 
        type === newClientForm.propertyType, 
        [type, newClientForm.propertyType]
    );

    const icon = useMemo(() => 
        PROPERTY_ICONS[type] || faHome, 
        [type]
    );

    const label = useMemo(() => 
        PROPERTY_LABELS[type] || type, 
        [type]
    );

    useEffect(() => {
        const prevPropertyType = prevPropertyTypeRef.current;

        // Lógica simplificada para o dispatch
        if (!edit || prevPropertyType !== undefined) {
            dispatch(porpertyTypeChange());
        }

        prevPropertyTypeRef.current = newClientForm.propertyType;
    }, [newClientForm.propertyType, edit, dispatch]);

    const handleClick = () => {
        dispatch(setPropertyType(type));
    };

    // Classes CSS computadas
    const cardClasses = `property-card  ${isSelected ? 'selected' : ''}`;
    const contentClasses = `property-content ${isSelected ? 'selected' : ''}`;

    return (
        <>
            <div 
                className={cardClasses}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick();
                    }
                }}
                aria-pressed={isSelected}
                aria-label={`Selecionar tipo de imóvel: ${label}`}
            >
                <div className="property-card-body">
                    <div className={contentClasses}>
                        <div className="icon-container">
                            <FontAwesomeIcon 
                                className="property-icon" 
                                icon={icon}
                                aria-hidden="true"
                            />
                        </div>
                        <div className="label-container">
                            <span className="property-label">
                                {label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Efeito de ripple para feedback visual */}
                <div className="ripple-effect"></div>
            </div>

            <style jsx>{`
                .property-card {
                    position: relative;
                    background: white;
                    border: 2px solid #e9ecef;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    min-height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    user-select: none;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                    width: 100%;
                }

                .property-card:hover {
                    border-color: #f5874f;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(245, 135, 79, 0.15);
                }

                .property-card:active {
                    transform: translateY(0);
                    box-shadow: 0 4px 12px rgba(245, 135, 79, 0.2);
                }

                .property-card.selected {
                    border-color: #f5874f;
                    background: linear-gradient(135deg, #f5874f 0%, #faa954 100%);
                    color: white;
                    box-shadow: 0 8px 25px rgba(245, 135, 79, 0.3);
                }

                .property-card.selected:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(245, 135, 79, 0.4);
                }

                .property-card-body {
                    width: 100% !important;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .property-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.3s ease;
                }

                .property-content.selected {
                    color: white;
                }

                .icon-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: rgba(245, 135, 79, 0.1);
                    transition: all 0.3s ease;
                }

                .property-card.selected .icon-container {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                }

                .property-icon {
                    font-size: 24px;
                    color: #f5874f;
                    transition: all 0.3s ease;
                }

                .property-card.selected .property-icon {
                    color: white;
                    transform: scale(1.1);
                }

                .label-container {
                    text-align: center;
                }

                .property-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #495057;
                    transition: all 0.3s ease;
                    letter-spacing: 0.5px;
                }

                .property-card.selected .property-label {
                    color: white;
                    font-weight: 700;
                }

                .ripple-effect {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(245, 135, 79, 0.3);
                    transform: translate(-50%, -50%);
                    transition: width 0.3s ease, height 0.3s ease;
                    pointer-events: none;
                }

                .property-card:active .ripple-effect {
                    width: 200px;
                    height: 200px;
                }

                .property-card.selected:active .ripple-effect {
                    background: rgba(255, 255, 255, 0.3);
                }

                /* Efeito de foco para acessibilidade */
                .property-card:focus-visible {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(245, 135, 79, 0.25);
                }

                /* Animação de entrada */
                @keyframes cardEnter {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .property-card {
                    animation: cardEnter 0.5s ease-out;
                }

                /* Responsividade */
                @media (max-width: 768px) {
                    .property-card {
                        min-height: 100px;
                    }
                    
                    .property-card-body {
                        padding: 16px;
                    }
                    
                    .icon-container {
                        width: 40px;
                        height: 40px;
                    }
                    
                    .property-icon {
                        font-size: 20px;
                    }
                    
                    .property-label {
                        font-size: 13px;
                    }
                }

                @media (max-width: 480px) {
                    .property-content {
                        gap: 8px;
                    }
                    
                    .property-label {
                        font-size: 12px;
                    }
                }

                /* Tema escuro (opcional) */
                @media (prefers-color-scheme: dark) {
                    .property-card {
                        background: #2d3748;
                        border-color: #4a5568;
                        color: #e2e8f0;
                    }
                    
                    .property-card:hover {
                        border-color: #faa954;
                    }
                    
                    .property-label {
                        color: #e2e8f0;
                    }
                    
                    .property-icon {
                        color: #faa954;
                    }
                    
                    .icon-container {
                        background: rgba(250, 169, 84, 0.1);
                    }
                }
            `}</style>
        </>
    );
}