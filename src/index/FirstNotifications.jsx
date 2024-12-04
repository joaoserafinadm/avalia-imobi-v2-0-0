import { faBook, faGear, faStore, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useEffect } from "react"
import isMobile from "../../utils/isMobile"
import axios from "axios"
import Cookie from "js-cookie"
import jwt from "jsonwebtoken"



export default function FirstNotifications(props) {

    const token = jwt.decode(Cookie.get("auth"))

    const { firstNotifications } = props

    useEffect(() => {
        // var toastLiveExample = document.getElementById('liveToast')

        // var toast = new bootstrap.Toast(toastLiveExample)

        // toast?.show()


        var toastElList = [].slice.call(document.querySelectorAll('.toast'))

        if (!toastElList) return

        var toastList = toastElList?.map(function (toastEl) {
            // Creates an array of toasts (it only initializes them)
            return new bootstrap.Toast(toastEl, { autohide: false }) // No need for options; use the default options
        });
        toastList.forEach(toast => toast.show()); // This show them

    }, [firstNotifications])


    const handleDateLimit = (dataEspecifica) => {
        // Converter a data específica de string para um objeto Date
        const dataDestino = new Date(dataEspecifica);

        // Obter a data atual
        const dataAtual = new Date();

        // Calcular a diferença em milissegundos
        const diferencaEmMilissegundos = dataDestino - dataAtual;

        // Converter a diferença de milissegundos para dias
        const milissegundosPorDia = 1000 * 60 * 60 * 24;
        const diferencaEmDias = Math.ceil(diferencaEmMilissegundos / milissegundosPorDia);

        return diferencaEmDias;
    }


    const handleDisableTutorial = async () => {

        await axios.post(`/api/indexPage/disableTutorial`, {
            user_id: token.sub,
        })

    }



    return (

        <div class="position-fixed end-0 px-3 mb-lg-0 mb-5" style={{ "z-index": "", bottom: "17px" }}>
            {!isMobile() && firstNotifications?.companyEdit && (

                <div class={`toast my-2 bg-light ${firstNotifications?.companyEdit ? 'pulse' : ''}`} role="alert" data-bs-autohide="false" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        {/* <img src="..." class="rounded me-2" alt="..."> */}
                        <span class="me-auto text-orange fw-bold">Cadastre sua imobiliária</span>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        <span>
                            O primeiro passo é cadastrar sua imobiliária. Clique no botão abaixo para começar e lembre-se de manter os dados sempre atualizados.
                        </span>
                        <div className=" mt-2">
                            <Link href="/companyEdit">
                                <button className="btn btn-outline-orange btn-sm"><FontAwesomeIcon icon={faStore} className="me-2" />Imobiliária</button>
                            </Link>
                        </div>
                        <span className="mt-2">
                            Clique no botão abaixo para acessar vídeos tutoriais com um passo a passo completo sobre como usar o aplicativo.
                        </span>
                        <div className=" mt-2">
                            <Link href="/tutorials">
                                <button className="btn btn-outline-orange btn-sm"><FontAwesomeIcon icon={faBook} className="me-2" />Tutoriais</button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {!isMobile() && firstNotifications?.profileEdit && (

                <div class={`toast my-2 bg-light ${!firstNotifications?.companyEdit ? 'pulse' : ''}`} role="alert" data-bs-autohide="false" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        {/* <img src="..." class="rounded me-2" alt="..."> */}
                        <span class="me-auto text-orange fw-bold">Atualize seu perfil</span>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        <span>
                            Mantenha seu perfil sempre atualizado! É com ele que o seu cliente vai se identificar.
                        </span>
                        <div className=" mt-2">
                            <Link href="/editProfile">
                                <button className="btn btn-outline-orange btn-sm"><FontAwesomeIcon icon={faUser} className="me-2" />Meu Perfil</button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* {firstNotifications?.tutorial && ( */}
            {!firstNotifications?.companyEdit && !firstNotifications?.profileEdit && firstNotifications?.tutorial && (

                <div style={{ maxWidth: '90vw' }} class={`toast my-2 bg-light ${(!firstNotifications?.companyEdit && !firstNotifications?.profileEdit && firstNotifications?.tutorial) ? 'pulse' : ''}`} role="alert" data-bs-autohide="false" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        {/* <img src="..." class="rounded me-2" alt="..."> */}
                        <span class="me-auto text-orange fw-bold">Aprenda a usar a plataforma!</span>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        <span >
                            Clique no botão abaixo para acessar a página de tutoriais.
                        </span >
                        <div className=" mt-2">
                            <Link href="/tutorials">
                                <button className="btn btn-outline-orange btn-sm" onClick={() => handleDisableTutorial()}>
                                    <FontAwesomeIcon icon={faBook} className="me-2" />Tutoriais
                                </button>
                            </Link>

                        </div>

                    </div>
                </div>
            )}
            {firstNotifications?.dateLimit && (

                <div style={{ maxWidth: '90vw' }} class={`toast my-2 bg-light ${(!firstNotifications?.companyEdit && !firstNotifications?.profileEdit) ? '' : ''}`} role="alert" data-bs-autohide="false" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        {/* <img src="..." class="rounded me-2" alt="..."> */}
                        <span class="me-auto text-orange fw-bold">Restam {handleDateLimit(firstNotifications?.dateLimit)} dias para acabar seu teste gratuito!</span>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">

                        <span >
                            Clique no botão abaixo para conhecer nossos planos e vantagens.
                        </span >
                        <div className=" mt-2">
                            <Link href="/accountSetup?status=Assinatura">

                                <button className="btn btn-outline-orange btn-sm"><FontAwesomeIcon icon={faGear} className="me-2" />Configurações</button>
                            </Link>

                        </div>

                    </div>
                </div>
            )}

        </div>

    )
}