import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import PropertyCard from "./PropertyCard"
import PropertyEditModal from "./PropertyEditModal"
import { SpinnerSM } from "../components/loading/Spinners"
import styles from "./PropertyCollection.module.scss"

export default function PropertyCollection(props) {
    const { loadingAdd } = props
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
        </div>
    )
}
