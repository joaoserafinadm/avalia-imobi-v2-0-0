import { faArrowLeft, faArrowRight, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import slideNumber from "../../../utils/slideNumber";
import { setSlide } from "../../../store/NewClientForm/NewClientForm.actions";
import Button from "../../components/Button";





export default function FixedButtons(props) {

    const newClientForm = useSelector(state => state.newClientForm)

    const dispatch = useDispatch()


    const handleSlide = (id) => {
        setTimeout(() => {

            dispatch(setSlide(slideNumber(id)))
        }, 700)
    }


    const handleDisabled = (form) => {

        if (form.slide === 1) {
            if (!form.clientName || !form.celular) {
                return true
            } else {
                return false
            }
        }

        if (form.slide === 2) {

            if (form.propertyType === 'Apartamento') {
                if (!form.areaTotal || !form.areaTotalPrivativa || !form.quartos || !form.suites || !form.banheiros || !form.vagasGaragem) {
                    return true
                } else {
                    return false
                }
            } else if (form.propertyType === 'Casa') {
                if (!form.areaTotal || !form.areaTotalPrivativa || !form.pavimentos || !form.quartos || !form.suites || !form.banheiros || !form.vagasGaragem) {
                    return true
                } else {
                    return false
                }
            } else if (form.propertyType === 'Comercial') {
                if (!form.areaTotal || !form.areaTotalPrivativa || !form.pavimentos || !form.salas || !form.banheiros || !form.vagasGaragem) {
                    return true
                } else {
                    return false
                }
            } else if (form.propertyType === 'Terreno') {
                if (!form.areaTotal) {

                    if (!form.terrenoIrregular) {
                        if (!form.largura || !form.comprimento) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        if (!form.frente || !form.fundos || !form.lateralEsquerda || !form.lateralDireita) {
                            return true
                        } else {
                            return false
                        }
                    }



                    return true
                } else {
                    return false
                }
            }


            else {
                return true
            }
        }

    }




    return (
        <div className="row ps-2 pe-3 fadeItem1s">
            {newClientForm.slide === 0 && (

                <Button variant="primary" size="sm" className="ms-2 fadeItem" data-bs-target="#clientFormCarousel" data-bs-slide="next" onClick={() => handleSlide('clientFormCarousel')}>
                    Começar <FontAwesomeIcon icon={faArrowRight} className="icon ms-1" />
                </Button>
            )}
            {(newClientForm.slide === 1 ||
                newClientForm.slide === 2 ||
                newClientForm.slide === 3 ||
                newClientForm.slide === 4 ||
                newClientForm.slide === 5) && (
                    <div className="fadeItem d-flex">
                        <div className="col-6">
                            <div className="row">
                                <span className="ms-2 text-center text-secondary"
                                    data-bs-target="#clientFormCarousel"
                                    data-bs-slide="previus"
                                    onClick={() => handleSlide('clientFormCarousel')}>
                                    <FontAwesomeIcon icon={faArrowLeft} className="icon ms-1 " /> Voltar
                                </span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">

                                <Button variant="primary" size="sm" className="ms-2"
                                    data-bs-target="#clientFormCarousel"
                                    disabled={handleDisabled(newClientForm)}
                                    data-bs-slide="next"
                                    onClick={() => handleSlide('clientFormCarousel')}>
                                    Continuar <FontAwesomeIcon icon={faArrowRight} className="icon ms-1" />
                                </Button>
                            </div>
                        </div>
                    </div>

                )}

            {newClientForm.slide === 6 && (

                <div className="fadeItem d-flex">
                    <div className="col-6">
                        <div className="row">
                            <span className="ms-2 text-center text-secondary"
                                data-bs-target="#clientFormCarousel"
                                data-bs-slide="previus"
                                onClick={() => handleSlide('clientFormCarousel')}>
                                <FontAwesomeIcon icon={faArrowLeft} className="icon ms-1 " /> Voltar
                            </span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="row">
                            <Button variant="primary" size="sm" className="ms-2"
                                loading={props.loadingSave}
                                disabled={handleDisabled(newClientForm)}
                                onClick={() => props.handleSave()}>
                                Finalizar <FontAwesomeIcon icon={faArrowRight} className="icon ms-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}


            {/* {newClientForm.slide === 7 && (
                <div className="fadeItem d-flex">
                    <div className="col-6">
                        <div className="row">
                            <span className="ms-2 text-center text-secondary"
                                data-bs-target="#clientFormCarousel"
                                data-bs-slide="previus"
                                onClick={() => handleSlide('clientFormCarousel')}>
                                <FontAwesomeIcon icon={faArrowLeft} className="icon ms-1 " /> Voltar
                            </span>
                        </div>
                    </div>

                </div>
            )} */}


        </div>
    )


}