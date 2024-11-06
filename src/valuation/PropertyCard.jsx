import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import isMobile from "../../utils/isMobile"
import { handleIcon, handleIconColor } from "../components/icons/propertyTypeIcons"
import styles from './ClientCard.module.scss'
import { faEdit, faEye, faMoneyCheckDollar, faShare, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import tippy from "tippy.js";
import { Swiper, SwiperSlide } from 'swiper/react';
import { replaceAmpersand } from "../../utils/replaceAmpersand"
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useSelector } from "react-redux"
import formatDate from "../../utils/formatDate"
import ClientFeatures from "./ClientFeatures"
import PropertyUrlModal from "../pages/valuation/PropertyUrlModal"
import Link from "next/link"

export default function PropertyCard(props) {

    const token = jwt.decode(Cookies.get('auth'))

    const users = useSelector(state => state.users)





    const client = props.elem

    useEffect(() => {
        tippy("#viewClientButton" + props.elem._id + props.section, {
            content: "Visualizar",
            placement: 'bottom'
        });
        tippy("#deleteClientButton" + props.elem._id + props.section, {
            content: "Deletar",
            placement: 'bottom'
        });
        tippy("#evaluateClientButton" + props.elem._id + props.section, {
            content: "Avaliar",
            placement: 'bottom'
        });
        tippy("#editClientButton" + props.elem._id + props.section, {
            content: "Editar",
            placement: 'bottom'
        });
        tippy("#shareClientButton" + props.elem._id + props.section, {
            content: "Enviar formulário",
            placement: 'bottom'
        });
    }, [])



    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? client?.files.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex === client?.files.length - 1 ? 0 : prevIndex + 1));
    };

    const handleShare = async (url) => {
        try {
            await navigator.share({
                title: 'Formulário de Cadastro de Imóvel',
                text: 'Formulário de Cadastro de Imóvel',
                url: url
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    }


    const handleShowClientInfo = (elem) => {

        if (elem.propertyType) return true
        else return false
    }

    const handleDeleteProperty = (index) => {

        const newPropertyArray = props.propertyArray.filter((elem, i) => i !== index)

        props.setPropertyArray(newPropertyArray)

    }



    return (
        <div class="card my-2 cardAnimation shadow"  >



            {!client?.imageUrl ?
                <div className=" d-flex card-img-top justify-content-center align-items-center bg-light bg-gradient" style={{ height: '170px' }}>
                    <span className="text-secondary">Sem fotos</span>
                </div>
                :
                <div className="card-img-top d-flex justify-content-center align-items-center bg-secondary " style={{ overflow: 'hidden' }}>


                    <img src={client?.imageUrl} className={`card-img-top  ${styles.clientCardImage}`} />

                </div>

            }

            {
                client?.propertyType && (

                    <span className={`${styles.propertyTypeHeader} d-flex align-items-center text-white  ${handleIconColor(props.elem.propertyType)}`}  >

                        {!isMobile() ?
                            <div className="small  me-2" >
                                {client?.propertyType}
                            </div>
                            :
                            <div className="small  me-1" style={{ fontSize: '12px' }} >
                                {client?.propertyType}
                            </div>

                        }
                        <FontAwesomeIcon icon={handleIcon(client?.propertyType)} className={`icon`} />
                    </span>
                )
            }


            <div class="card-body">

                <div className="row ">
                    <div className="col-12">

                        <h6 class="mb-0 text-center"> {client?.propertyName}  </h6>
                    </div>
                </div>

                <ClientFeatures client={client} elem={props.elem} propertyAdd />

                {!props.deleteHide && !props.valuationPdf && (



                    <div className="row d-flex justify-content-center mt-2">
                        <div className="col-12 d-flex justify-content-center">

                            <div class="btn-group" role="group" aria-label="Basic example">
                                {/* <button
                                    type="button"
                                    class="btn btn-light border"
                                    id={"viewClientButton" + props.elem._id + props.section}
                                    data-bs-toggle="modal"
                                    data-bs-target="#viewClientModal"
                                    onClick={() => props.setClientSelected(props.elem)}>
                                    <FontAwesomeIcon icon={faEye} className="icon  text-secondary" />
                                </button> */}
                                    <a href={props.elem.propertyLink} target="_blank"
                                        type="button"
                                        class="btn btn-light border"
                                        // data-bs-toggle="modal" data-bs-target="#propertyUrlModal"
                                        id={"viewPropertyButton" + props.elem._id + props.section}>
                                        <FontAwesomeIcon icon={faEye} className="icon text-secondary" />
                                    </a>
                                {!props.valuationView && (
                                    <button
                                        type="button"
                                        class="btn btn-light border"
                                        id={"deleteClientButton" + props.elem._id + props.section}
                                        onClick={() => handleDeleteProperty(props.index)}>
                                        <FontAwesomeIcon icon={faTrashAlt} className="icon text-secondary" />
                                    </button>

                                )}


                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div >
    )
}