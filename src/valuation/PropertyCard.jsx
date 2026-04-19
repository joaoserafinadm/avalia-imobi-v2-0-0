import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import isMobile from "../../utils/isMobile"
import { handleIcon, handleIconColor } from "../components/icons/propertyTypeIcons"
import styles from './PropertyCard.module.scss'
import { faEye, faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { useEffect } from "react"
import tippy from "tippy.js"
import ClientFeatures from "./ClientFeatures"

export default function PropertyCard(props) {

    const client = props.elem

    useEffect(() => {
        tippy("#viewPropertyButton" + props.elem._id + props.section, { content: "Visualizar", placement: 'bottom' })
        tippy("#editPropertyButton" + props.index + props.section, { content: "Editar", placement: 'bottom' })
        tippy("#deletePropertyButton" + props.elem._id + props.section, { content: "Deletar", placement: 'bottom' })
    }, [])

    const handleDeleteProperty = (index) => {
        const newPropertyArray = props.propertyArray.filter((_, i) => i !== index)
        props.setPropertyArray(newPropertyArray)
    }

    return (
        <div className={`${styles.card} my-2`}>

            {/* ── Image area ── */}
            <div className={styles.imageWrap}>
                {!client?.imageUrl ? (
                    <div className={styles.imagePlaceholder}>
                        <span className={styles.placeholderText}>Sem fotos</span>
                    </div>
                ) : (
                    <img
                        src={client.imageUrl}
                        className={styles.slideImage}
                        alt={client?.propertyName || 'Imóvel'}
                    />
                )}

                {/* Property type badge */}
                {client?.propertyType && (
                    <span className={`${styles.propertyBadge} ${handleIconColor(client.propertyType)}`}>
                        <span style={{ fontSize: isMobile() ? '11px' : undefined }}>
                            {client.propertyType}
                        </span>
                        <FontAwesomeIcon icon={handleIcon(client.propertyType)} />
                    </span>
                )}
            </div>

            {/* ── Card body ── */}
            <div className={styles.cardBody}>

                <h6 className={styles.propertyName}>
                    {client?.propertyName}
                </h6>

                <ClientFeatures client={client} elem={props.elem} propertyAdd />

                {!props.deleteHide && !props.valuationPdf && (
                    <>
                        <hr className={styles.divider} />
                        <div className={styles.btnGroup}>
                            <a
                                href={props.elem.propertyLink}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.btn}
                                id={"viewPropertyButton" + props.elem._id + props.section}
                            >
                                <FontAwesomeIcon icon={faEye} />
                            </a>

                            {!props.valuationView && (
                                <>
                                    <button
                                        type="button"
                                        className={styles.btn}
                                        id={"editPropertyButton" + props.index + props.section}
                                        data-bs-toggle="modal"
                                        data-bs-target="#propertyEditModal"
                                        onClick={() => props.onEdit && props.onEdit(props.index)}
                                    >
                                        <FontAwesomeIcon icon={faPencil} />
                                    </button>

                                    <button
                                        type="button"
                                        className={`${styles.btn} ${styles.btnDanger}`}
                                        id={"deletePropertyButton" + props.elem._id + props.section}
                                        onClick={() => handleDeleteProperty(props.index)}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}
