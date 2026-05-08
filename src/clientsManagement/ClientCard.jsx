import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VerticalLine from "../../utils/VerticalLine";
import { faBuilding, faCheck, faEye, faHouse, faMapLocation, faStore, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import isMobile from "../../utils/isMobile";
import tippy from "tippy.js";
import DeleteClientModal from "./DeleteClientModal";
import Button from "../components/Button";




export default function ClientCard(props) {

    useEffect(() => {
        tippy('#viewClientButton', {
            content: "Visualizar",
            placement: 'bottom'
        });
        tippy('#deleteClientButton', {
            content: "Deletar",
            placement: 'bottom'
        });
    }, [props.idSelected])

    const handleIconColor = (elem) => {

        if (elem === 'Apartamento') {
            return 'apartamento-color'
        }
        if (elem === 'Casa') {
            return 'casa-color'
        }
        if (elem === 'Terreno') {
            return 'terreno-color'
        }
        if (elem === 'Comercial') {
            return 'comercial-color'
        }
        else return ''
    }

    const handleIcon = (elem) => {

        if (elem === 'Apartamento') {
            return faBuilding
        }
        if (elem === 'Casa') {
            return faHouse
        }
        if (elem === 'Terreno') {
            return faMapLocation
        }
        if (elem === 'Comercial') {
            return faStore
        }
        else return ''
    }


    return (
        <div className="card my-3 cardAnimation fadeItem" type="button" onClick={() => props.setIdSelected(props.elem._id)} style={{ overflowX: 'hidden' }}>
            <div className="card-body d-flex">
                <div className="col me-2">


                    <div className="row">
                        <div className="col-12 d-flex ">
                            <div className="col d-flex align-items-center">

                                <span className="fs-5 bold">
                                    {props.elem.clientName} {" " + props.elem.clientLastName}
                                </span>
                                <FontAwesomeIcon icon={faCheck} className="icon text-success ms-2" />
                            </div>

                            <span className={`col fs-5 d-flex align-items-center justify-content-end ${handleIconColor(props.elem.propertyType)}`}>

                                {!isMobile() ?
                                    <div className="small fadeItem me-2" >
                                        {props.elem.propertyType}
                                    </div>
                                    :
                                    <div className="small fadeItem me-1" style={{ fontSize: '12px' }} >
                                        {props.elem.propertyType}
                                    </div>

                                }
                                <FontAwesomeIcon icon={handleIcon(props.elem.propertyType)} className={`icon`} />
                            </span>


                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col-12 d-flex justify-content-between">
                            <div className="col">
                                <span className="d-flex align-items-center">
                                    <div className="me-2">
                                        <img className="cardProfileImg"
                                            src="https://res.cloudinary.com/joaoserafinadm/image/upload/v1700622419/AVALIA%20IMOBI/USERS_IMG/xwsqidtdw3srsnjvom50.jpg" alt="" />
                                    </div>
                                    <div>

                                        Juliane <br /> Kosloski
                                    </div>
                                </span>


                            </div>

                            {!isMobile() && (
                                <>
                                    <div className="col d-flex justify-content-center align-items-center">

                                        <span className="small text-center">
                                            Atualizado em: <br /> 10/10/2020
                                        </span>
                                    </div>

                                    <div className="col d-flex justify-content-end align-items-center">
                                        <span className="small text-center">
                                            Data de cadastro: <br /> 10/10/2020
                                        </span>
                                    </div>
                                </>

                            )}

                        </div>
                    </div>
                </div>
                {props.idSelected === props.elem._id && (
                    <div className="slideLeft d-flex ms-2 bg-light h-100 align-items-center shadow">
                        <VerticalLine />
                        <div className="d-flex justify-content-center align-items-center " style={{ width: '120px', height: '60px' }} >
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <Button variant="ghost" className="btn btn-light border" id="viewClientButton">
                                    <FontAwesomeIcon icon={faEye} className="icon text-secondary" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="btn btn-light border"
                                    id="deleteClientButton"
                                    data-bs-toggle="modal"
                                    data-bs-target={"#deleteClientModal" + props.elem._id}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="icon text-secondary" />
                                </Button>
                            </div>

                        </div>

                        <DeleteClientModal elem={props.elem} />
                    </div>
                )}

            </div>
        </div>
    )
}