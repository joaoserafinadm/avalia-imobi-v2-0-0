import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import isMobile from "../../utils/isMobile"
import { handleIcon, handleIconColor } from "../components/icons/propertyTypeIcons"
import styles from './PropertyCard.module.scss'
import { faEye, faPencil, faTrashAlt, faLocationDot, faTriangleExclamation, faEdit, faShare, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import tippy from "tippy.js"
import formatDate from "../../utils/formatDate"

function formatPrice(price) {
    if (!price) return "—"
    // maskMoney stores "450.000" — strip thousand-separator dots before parsing
    const n = Number(String(price).replace(/\./g, "").replace(/,\d*$/, ""))
    return n ? n.toLocaleString("pt-BR") + ",00" : "—"
}

function Chip({ label, value }) {
    if (!value && value !== 0) return null
    return (
        <div className={styles.chip}>
            <span className={styles.chipLabel}>{label}</span>
            <span className={styles.chipValue}>{value}</span>
        </div>
    )
}

function PropertyFeatures({ client }) {
    const type = client?.propertyType
    if (!type) return null

    const loc = [client.bairro, client.cidade, client.uf].filter(Boolean).join(", ")

    return (
        <div className={styles.features}>
            {/* ── Price ── */}
            <div className={styles.priceRow}>
                <span className={styles.priceCurrency}>R$</span>
                <span className={styles.priceValue}>{formatPrice(client.propertyPrice)}</span>
            </div>

            {/* ── Location ── */}
            {loc && (
                <div className={styles.location}>
                    <FontAwesomeIcon icon={faLocationDot} className={styles.locationIcon} />
                    <span>{loc}</span>
                </div>
            )}

            <hr className={styles.featureDivider} />

            {/* ── Type-specific chips ── */}
            <div className={styles.chipsGrid}>
                {(type === "Apartamento" || type === "Comercial") && (
                    <Chip label="Área total" value={client.areaTotal ? `${client.areaTotal} m²` : null} />
                )}
                {type === "Casa" && (
                    <Chip label="Área terreno" value={client.areaTotal ? `${client.areaTotal} m²` : null} />
                )}
                {type === "Terreno" && (
                    <Chip label="Área total" value={client.areaTotal ? `${client.areaTotal} m²` : null} />
                )}
                {(type === "Apartamento" || type === "Casa" || type === "Comercial") && client.areaTotalPrivativa && (
                    <Chip label="Área privativa" value={`${client.areaTotalPrivativa} m²`} />
                )}
                {(type === "Apartamento" || type === "Casa") && (
                    <Chip label="Quartos" value={client.quartos || null} />
                )}
                {(type === "Apartamento" || type === "Casa") && (
                    <Chip label="Suítes" value={client.suites || null} />
                )}
                {type !== "Terreno" && (
                    <Chip label="Banheiros" value={client.banheiros || null} />
                )}
                {type === "Apartamento" && client.andar && (
                    <Chip label="Andar" value={client.andar} />
                )}
                {(type === "Casa" || type === "Comercial") && (
                    <Chip label="Pavimentos" value={client.pavimentos || null} />
                )}
                {type === "Comercial" && (
                    <Chip label="Salas" value={client.salas || null} />
                )}
                {type !== "Terreno" && (
                    <Chip label="Vagas" value={client.vagasGaragem || null} />
                )}
            </div>
        </div>
    )
}

export default function PropertyCard(props) {
    const client = props.elem
    const light = props.light
    const anuncioView = props.anuncioView
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        // tippy("#viewPropertyButton" + props.elem._id + props.section, { content: "Visualizar", placement: 'bottom' })
        tippy("#editPropertyButton" + props.index + props.section, { content: "Editar", placement: 'bottom' })
        tippy("#deletePropertyButton" + props.elem._id + props.section, { content: "Deletar", placement: 'bottom' })
    }, [])

    const handleDeleteProperty = (index) => {
        const newPropertyArray = props.propertyArray.filter((_, i) => i !== index)
        props.setPropertyArray(newPropertyArray)
    }

    return (
        <div className={`${styles.card} ${light ? styles.light : ''} my-2`}>

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

                <h5 className={styles.propertyName}>
                    {client?.propertyName || "Imóvel sem nome"}
                </h5>

                <PropertyFeatures client={client} />

                {!props.deleteHide && !props.valuationPdf && (
                    <>
                        <hr className={styles.divider} />

                        {confirmDelete ? (
                            <div className={styles.confirmBox}>
                                <div className={styles.confirmMsg}>
                                    <FontAwesomeIcon icon={faTriangleExclamation} className={styles.confirmIcon} />
                                    Excluir este imóvel?
                                </div>
                                <div className={styles.confirmBtns}>
                                    <button
                                        type="button"
                                        className={styles.confirmCancel}
                                        onClick={() => setConfirmDelete(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.confirmDelete}
                                        onClick={() => handleDeleteProperty(props.index)}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={styles.btnGroup}>


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
                                                onClick={() => setConfirmDelete(true)}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="col-12 d-flex mt-1 justify-content-center">
                                    {props.elem.propertyLink && (
                                        <a
                                            href={props.elem.propertyLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`small ${styles.btnAnuncio}`}
                                            id={"viewPropertyButton" + props.elem._id + props.section}
                                        >
                                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="me-2" /> Ver anúncio
                                        </a>
                                    )}
                                </div>
                            </>

                        )}
                    </>
                )}



                {/* {client?.dateAdded && (
                    <div className={styles.dateFooter}>
                        <hr className={styles.divider} />
                        <span className={styles.dateText}>
                            Adicionado em:
                            <span className={styles.dateValue}>{formatDate(client.dateAdded)}</span>
                        </span>
                    </div>
                )} */}

                {anuncioView && (
                      <div className={styles.dateFooter}>
                        <hr className={styles.divider} />
                        {client.propertyLink && (
                            <a
                                href={client.propertyLink}
                                target="_blank"
                                rel="noreferrer"
                                className={`small ${styles.btnAnuncio}`}
                                id={"viewPropertyButton" + client._id + props.section}
                            >
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="me-2" /> Ver anúncio
                            </a>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}
