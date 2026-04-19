import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import isMobile from "../../utils/isMobile"
import { handleIcon, handleIconColor } from "../components/icons/propertyTypeIcons"
import styles from './ClientCardInfo.module.scss'
import { faEdit, faEye, faMoneyCheckDollar, faShare, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import tippy from "tippy.js"
import { Swiper, SwiperSlide } from 'swiper/react'
import ClientStatus from "../clientsManagement/ClientStatus"
import { replaceAmpersand } from "../../utils/replaceAmpersand"
import Cookies from "js-cookie"
import jwt from "jsonwebtoken"
import { useSelector } from "react-redux"
import formatDate from "../../utils/formatDate"
import ClientFeatures from "../clientsManagement/ClientFeatures"
import { showClientInfo } from "../../utils/showClientInfo"
import Link from "next/link"
import HandleButtons from "../clientsManagement/HandleButtons"

export default function ClientCardInfo(props) {

    const token = jwt.decode(Cookies.get('auth'))
    const users = useSelector(state => state.users)

    const client = props.elem

    const [activeIndex, setActiveIndex] = useState(0)

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? client?.files.length - 1 : prevIndex - 1))
    }

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex === client?.files.length - 1 ? 0 : prevIndex + 1))
    }

    const handleShare = async (url) => {
        try {
            await navigator.share({
                title: 'Formulário de Cadastro de Imóvel',
                text: 'Formulário de Cadastro de Imóvel',
                url: url
            })
            console.log('Conteúdo compartilhado com sucesso!')
        } catch (error) {
            console.error('Erro ao compartilhar:', error)
        }
    }

    const assignedUser = users?.find(elem => elem._id === client?.user_id)

    return (
        <div className={styles.card}>

            {/* ── Image area ── */}
            <div className={styles.imageWrap}>
                {!client?.files?.length ? (
                    <div className={styles.imagePlaceholder}>
                        <span className={styles.placeholderText}>Sem fotos</span>
                    </div>
                ) : (
                    <img
                        src={client?.files[0]?.url ? client?.files[0]?.url : URL.createObjectURL(client?.files[0])}
                        className={styles.image}
                        alt=""
                    />
                )}

                {/* Property type badge */}
                {client?.propertyType && (
                    <span className={`${styles.propertyBadge} ${handleIconColor(client.propertyType)}`}>
                        {isMobile() ? (
                            <span style={{ fontSize: '11px' }}>{client.propertyType}</span>
                        ) : (
                            <span>{client.propertyType}</span>
                        )}
                        <FontAwesomeIcon icon={handleIcon(client.propertyType)} />
                    </span>
                )}

                {/* User chip */}
                {assignedUser && (
                    <div className={styles.userChip}>
                        <span className={styles.userChipName}>
                            {assignedUser.firstName} {assignedUser.lastName}
                        </span>
                        <img
                            className={styles.userChipImg}
                            src={assignedUser.profileImageUrl}
                            alt=""
                        />
                    </div>
                )}
            </div>

            {/* ── Card body ── */}
            <div className={styles.cardBody}>

                <h6 className={styles.clientName}>
                    {client?.clientName} {client?.clientLastName}
                </h6>

                <div className={styles.statusRow}>
                    <ClientStatus status={client?.status} id={client?._id} />
                </div>

                <ClientFeatures client={client} elem={props.elem} small />

                {client?.status !== 'outdated' && (
                    <div className={styles.viewBtnWrap}>
                        <Link href={`/clientsManagement?client_id=${client._id}`} passHref>
                            <button type="button" className={styles.viewBtn} id={"viewClientButton" + client._id}>
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                        </Link>
                    </div>
                )}

                <hr className={styles.divider} />

                <div className={styles.dateFooter}>
                    {props.elem.dateAdded && (
                        <span className={styles.dateText}>
                            Data de cadastro:
                            <span className={styles.dateValue}>{formatDate(props.elem.dateAdded)}</span>
                        </span>
                    )}
                </div>

            </div>
        </div>
    )
}
