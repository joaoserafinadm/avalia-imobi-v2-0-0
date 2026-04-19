import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import isMobile from "../../utils/isMobile"
import { handleIcon, handleIconColor } from "../components/icons/propertyTypeIcons"
import styles from './ClientCard_02.module.scss'
import { faEdit, faEye, faMoneyCheckDollar, faShare, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import tippy from "tippy.js"
import { Swiper, SwiperSlide } from 'swiper/react'
import ClientStatus from "./ClientStatus"
import { replaceAmpersand } from "../../utils/replaceAmpersand"
import Cookies from "js-cookie"
import jwt from "jsonwebtoken"
import { useSelector } from "react-redux"
import formatDate from "../../utils/formatDate"
import ClientFeatures from "./ClientFeatures"
import { showClientInfo } from "../../utils/showClientInfo"
import Link from "next/link"
import HandleButtons from "./HandleButtons"
import { valueShow } from "../../utils/valueShow"

export default function ClientCard_02(props) {

    const token = jwt.decode(Cookies.get('auth'))
    const users = useSelector(state => state.users)
    const client = props.elem

    console.log("client", client)

    useEffect(() => {
        tippy("#viewClientButton" + props.elem._id, { content: "Visualizar", placement: 'bottom' })
        tippy("#deleteClientButton" + props.elem._id, { content: "Deletar", placement: 'bottom' })
        tippy("#evaluateClientButton" + props.elem._id, { content: "Avaliar", placement: 'bottom' })
        tippy("#editClientButton" + props.elem._id, { content: "Editar", placement: 'bottom' })
        tippy("#shareClientButton" + props.elem._id, { content: "Enviar formulário", placement: 'bottom' })
        tippy("#shareValuationButton" + props.elem._id, { content: "Compartilhar avaliação", placement: 'bottom' })
        tippy("#downloadValuationButton" + props.elem._id, { content: "Baixar PDF", placement: 'bottom' })
    }, [props.elem, props.section])

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
        <div className={`${styles.card} my-2`}>

            {/* ── Image / Swiper area ── */}
            <div className={styles.imageWrap}>
                {!client?.files?.length ? (
                    <div className={styles.imagePlaceholder}>
                        <span className={styles.placeholderText}>Sem fotos</span>
                    </div>
                ) : (
                    <div className={styles.swiperWrap}>
                        <Swiper
                            style={{
                                '--swiper-navigation-color': 'rgba(255,255,255,0.8)',
                                '--swiper-pagination-color': '#f5874f',
                                '--swiper-navigation-size': '14px',
                                zIndex: 0,
                            }}
                            slidesPerView={1}
                            pagination={{ clickable: false }}
                            navigation
                        >
                            {client?.files?.map((elem, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={elem.url ? elem.url : URL.createObjectURL(elem)}
                                        className={styles.slideImage}
                                        alt={`Slide ${index + 1}`}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
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

                <h5 className={styles.clientName}>
                    {client?.clientName} {client?.clientLastName}
                </h5>

                <div className={styles.statusRow}>
                    <ClientStatus status={client?.status} id={client?._id} />
                </div>

                <ClientFeatures client={client} elem={props.elem} evaluateBtn />

                <HandleButtons
                    client={client}
                    setClientSelected={value => props.setClientSelected(value)}
                    elem={props.elem}
                />

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
