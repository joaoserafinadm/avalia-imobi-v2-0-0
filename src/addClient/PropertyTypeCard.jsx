import { faBuilding, faHome, faMapLocation, faStore } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useDispatch, useSelector } from "react-redux"
import { porpertyTypeChange, setPropertyType } from "../../store/NewClientForm/NewClientForm.actions"
import { useEffect, useRef, useMemo } from "react"

const PROPERTY_ICONS = {
    'Apartamento': faBuilding,
    'Casa': faHome,
    'Comercial': faStore,
    'Terreno': faMapLocation
}

const PROPERTY_LABELS = {
    'Apartamento': 'Apartamento',
    'Casa': 'Casa',
    'Comercial': 'Comercial',
    'Terreno': 'Terreno'
}

export default function PropertyTypeCard({ type, edit = false }) {
    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()
    const prevPropertyTypeRef = useRef()

    const isSelected = useMemo(() => type === newClientForm.propertyType, [type, newClientForm.propertyType])
    const icon = useMemo(() => PROPERTY_ICONS[type] || faHome, [type])
    const label = useMemo(() => PROPERTY_LABELS[type] || type, [type])

    useEffect(() => {
        const prevPropertyType = prevPropertyTypeRef.current
        if (!edit || prevPropertyType !== undefined) {
            dispatch(porpertyTypeChange())
        }
        prevPropertyTypeRef.current = newClientForm.propertyType
    }, [newClientForm.propertyType, edit, dispatch])

    const handleClick = () => { dispatch(setPropertyType(type)) }

    return (
        <>
            <div
                className={`property-card${isSelected ? ' selected' : ''}`}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } }}
                aria-pressed={isSelected}
                aria-label={`Selecionar tipo de imóvel: ${label}`}
            >
                <div className="property-card-body">
                    <div className={`property-content${isSelected ? ' selected' : ''}`}>
                        <div className="icon-container">
                            <FontAwesomeIcon className="property-icon" icon={icon} aria-hidden="true" />
                        </div>
                        <div className="label-container">
                            <span className="property-label">{label}</span>
                        </div>
                    </div>
                </div>
                <div className="ripple-effect" />
            </div>

            <style jsx>{`
                .property-card {
                    position: relative;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 14px;
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    min-height: 110px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    user-select: none;
                    background: rgba(255, 255, 255, 0.02);
                    width: 100%;
                    animation: cardEnter 0.4s ease-out;
                }

                .property-card:hover {
                    border-color: rgba(245, 135, 79, 0.35);
                    background: rgba(245, 135, 79, 0.04);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(245, 135, 79, 0.1);
                }

                .property-card:active {
                    transform: translateY(0);
                }

                .property-card.selected {
                    border-color: rgba(245, 135, 79, 0.55);
                    background: rgba(245, 135, 79, 0.07);
                    box-shadow: 0 0 0 3px rgba(245, 135, 79, 0.12), 0 8px 24px rgba(245, 135, 79, 0.12);
                }

                .property-card.selected:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 0 3px rgba(245, 135, 79, 0.15), 0 12px 32px rgba(245, 135, 79, 0.18);
                }

                .property-card-body {
                    width: 100%;
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
                    gap: 10px;
                    transition: all 0.25s ease;
                }

                .icon-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: rgba(245, 135, 79, 0.08);
                    transition: all 0.25s ease;
                }

                .property-card.selected .icon-container {
                    background: rgba(245, 135, 79, 0.18);
                }

                .property-icon {
                    font-size: 20px;
                    color: rgba(245, 135, 79, 0.65);
                    transition: all 0.25s ease;
                }

                .property-card.selected .property-icon {
                    color: #f5874f;
                    transform: scale(1.1);
                }

                .property-label {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                    transition: all 0.25s ease;
                    letter-spacing: 0.02em;
                    text-align: center;
                }

                .property-card.selected .property-label {
                    color: rgba(245, 135, 79, 0.9);
                }

                .ripple-effect {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(245, 135, 79, 0.15);
                    transform: translate(-50%, -50%);
                    transition: width 0.3s ease, height 0.3s ease;
                    pointer-events: none;
                }

                .property-card:active .ripple-effect {
                    width: 200px;
                    height: 200px;
                }

                .property-card:focus-visible {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(245, 135, 79, 0.25);
                }

                @keyframes cardEnter {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .property-card { min-height: 90px; }
                    .property-card-body { padding: 16px; }
                    .icon-container { width: 38px; height: 38px; }
                    .property-icon { font-size: 18px; }
                    .property-label { font-size: 0.72rem; }
                }
            `}</style>
        </>
    )
}
