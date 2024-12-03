


import { faFaceSadTear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { modalClose } from "../../../../utils/modalControl";



export default function SubscriptionCanceledModal() {


    return (
        <div class="modal fade" id="dateLimitModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="dateLimitModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title title-dark" id="dateLimitModalLabel">Seu teste gratuito expirou! <FontAwesomeIcon icon={faFaceSadTear} className="text-orange" /></h5>
                    </div>
                    <div class="modal-body">
                        <div className="row">

                            <div className="col-12 d-flex justify-content-center text-center mt-3">
                                <span className="fw-bold">
                                    Não fique triste!
                                </span>
                            </div>
                            <div className="col-12 mt-3 d-flex justify-content-center text-center">
                                <span>
                                    Clique no botão abaixo para conhecer nossos planos e continuar desfrutando do Avalia Imobi sem interrupções!
                                </span>
                            </div>

                            <div className="col-12 mt-5 d-flex justify-content-center text-center">
                                <Link href="/accountSetup?status=Assinatura" onClick={() => modalClose()}>
                                    <button className="btn btn-orange" data-bs-dismiss="modal">
                                        Planos
                                    </button>
                                </Link>
                            </div>

                            <div className="col-12 d-flex justify-content-center my-5">
                                <img src="LOGO_04.png" alt="" style={{ width: "50%" }} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )


}