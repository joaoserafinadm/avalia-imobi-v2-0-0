import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faCircleCheck, faTriangleExclamation, faEdit, faPencil } from "@fortawesome/free-solid-svg-icons"
import PropertyCard from "./PropertyCard"
import PropertyEditModal from "./PropertyEditModal"
import PropertiesMap from "./PropertiesMap"
import { SpinnerSM } from "../components/loading/Spinners"
import styles from "./PropertyCollection.module.scss"

export default function PropertyCollection(props) {
    const { loadingAdd, client } = props
    const propertyArray = props.propertyArray

    const [editingIndex, setEditingIndex] = useState(null)
    const editingProperty = editingIndex !== null ? propertyArray[editingIndex] : null

    return (
        <div className={styles.wrap}>
            <PropertyEditModal
                property={editingProperty}
                index={editingIndex}
                propertyArray={propertyArray}
                setPropertyArray={value => props.setPropertyArray(value)} />

            <div className={styles.grid}>
                {propertyArray.map((elem, index) => (
                    <div key={index}>
                        <PropertyCard
                            section="ValuationConfig"
                            elem={elem}
                            index={index}
                            propertyArray={propertyArray}
                            setPropertyArray={value => props.setPropertyArray(value)}
                            onEdit={i => setEditingIndex(i)} />
                    </div>
                ))}

                {loadingAdd && (
                    <div className={styles.loadingCard}>
                        <SpinnerSM />
                        <span className={styles.loadingText}>Carregando imóvel…</span>
                    </div>
                )}

                <button
                    type="button"
                    className={styles.addCard}
                    data-bs-toggle="modal"
                    data-bs-target="#propertyAddModal"
                >
                    <div className={styles.addIcon}>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <span className={styles.addText}>Adicionar imóvel</span>
                    <span className={styles.addSub}>para comparação</span>
                </button>
            </div>

            {propertyArray.length > 0 && (
                <div className={styles.verifyBanner}>
                    <FontAwesomeIcon icon={faTriangleExclamation} className={styles.verifyBannerIcon} />
                    <div className={styles.verifyBannerBody}>
                        <span className={styles.verifyBannerTitle}>Verifique os imóveis de comparação</span>
                        <span className={styles.verifyBannerText}>
                            Antes de finalizar a avaliação, confirme se <strong>valor</strong>, <strong>área</strong>, <strong>caracteristicas</strong> e <strong>localização</strong> de cada imóvel estão corretos. Clique em <FontAwesomeIcon icon={faPencil} style={{ fontSize: '0.72rem', margin: '0 2px' }} /> editar para corrigir qualquer informação.
                        </span>
                    </div>
                </div>
            )}

            <PropertiesMap propertyArray={propertyArray} client={client} />
        </div>
    )
}
