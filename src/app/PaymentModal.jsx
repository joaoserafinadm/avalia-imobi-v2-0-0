import Link from "next/link";
import { closeModal } from "../../utils/modalControl";



export default function PaymentModal(props) {


    return (
        <div class="modal fade" id="paymentModal" tabindex="-1"
            aria-labelledby="paymentModalLabel" aria-hidden="true" data-bs-backdrop="static"
            data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div class="modal-content">
                    {/* <div class="modal-header">
                        <h5 class="modal-title title-dark" id="paymentModalLabel">Bem vindo ao Avalia Imobi!</h5>
                    </div> */}
                    <div class="modal-body">
                        <div className="row">
                            <div className="col-12 text-center">
                                <span>Seu período de teste gratuito chegou ao fim...</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 text-center">
                                <span>Para continuar aproveitando todos os recursos do nosso aplicativo, escolha um dos nossos planos de assinatura.</span>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-center">
                                <Link href={'/accountSetup?section=Pagamentos'} onClick={() => closeModal()}>
                                    <button className="btn btn-outline-orange pulse" data-bs-dismiss="modal">Assinar agora</button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )



}