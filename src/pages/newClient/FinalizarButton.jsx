import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SpinnerSM } from "../../components/loading/Spinners";
import validationNewClient from "../../../utils/validationNewClient";
import { useSelector } from "react-redux";
import Button from "../../components/Button";



export default function FinalizarButton(props) {

    const newClientForm = useSelector(state => state.newClientForm)

    const teste = () => {

        setTimeout(() => {
            var myCarousel = document.getElementById('clientFormCarouselDesktop');
            var carousel = new bootstrap.Carousel(myCarousel);
            carousel.next();

        }, 2000)
    }

    return (
        <div className="row my-5">
            <div className="col-12 d-flex justify-content-center">
                {props.loadingSave ?
                    <span
                        className="fs-3 text-secondary ">
                        Salvando as informações <SpinnerSM className="ms-1" />
                    </span>
                    :
                    <>
                        <Button
                            variant="ghost"
                            className="btn btn-light btn-lg fs-4 text-secondary"
                            disabled={!validationNewClient(newClientForm)}
                            onClick={() => props.handleSave()}
                        >
                            Finalizar <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                        </Button>
                    </>
                }

            </div>
            {!validationNewClient(newClientForm) && (
                <div className="col-12 d-flex justify-content-center">
                    <span className="small text-secondary text-center">Preencha os dados de cadastro para continuar</span>
                </div>
            )}
        </div>
    )
}