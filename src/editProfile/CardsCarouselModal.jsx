import CardsCarousel from "./CardsCarousel";
import Button from "../components/Button";





export default function CardsCarouselModal(props) {



    return (
        <div class="modal fade" id="CardsCarouselModal" tabindex="-1" aria-labelledby="ImageHeaderModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title title-dark" id="ImageHeaderModalLabel">Visualizar Cartão</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div className="row" >
                            <div className="col-12 d-flex justify-content-center">

                                <CardsCarousel mobileView
                                    firstName={props.firstName}
                                    lastName={props.lastName}
                                    creci={props.creci}
                                    email={props.email}
                                    celular={props.celular}
                                    telefone={props.telefone}
                                    profileImageUrl={props.profileImageUrl}
                                    headerImg={props.headerImg}
                                    logo={props.logo}
                                    logradouro={props.logradouro}
                                    numero={props.numero}
                                    cidade={props.cidade}
                                    estado={props.estado} />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <Button variant="secondary" size="sm" data-bs-dismiss="modal">Fechar</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}