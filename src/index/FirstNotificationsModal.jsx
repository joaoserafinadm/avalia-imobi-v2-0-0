import { useEffect, useState } from "react"
import { showModal } from "../../utils/modalControl"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faStore, faUser } from "@fortawesome/free-solid-svg-icons"
import Button from "../components/Button"



export default function FirstNotificationsModal(props) {

    const { firstNotifications } = props

    const [notification, setNotification] = useState('')

    useEffect(() => {


        if (firstNotifications?.companyEdit) {
            setNotification("companyEdit")
            showModal('firstNotificationsModal')
            return
        }
        else if (firstNotifications?.profileEdit) {
            setNotification("profileEdit")
            showModal('firstNotificationsModal')
            return
        } else return



    }, [firstNotifications])



    return (

        <div class="modal fade" id="firstNotificationsModal" tabindex="-1" aria-labelledby="firstNotificationsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title title-dark" id="firstNotificationsModalLabel">Bem vindo ao Avalia Imobi!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        {notification === 'companyEdit' && (
                            <div className="col-12">
                                <span>
                                    O primeiro passo é cadastrar sua imobiliária. Clique no botão abaixo para começar e lembre-se de manter os dados sempre atualizados.
                                </span>
                                <div className=" mb-2 mt-4 text-center">
                                    <Link href="/companyEdit">
                                        <Button variant="primary" size="sm" icon={faStore}>Imobiliária</Button>
                                    </Link>
                                </div>
                                <span className="mt-2">
                                    Clique no botão abaixo para acessar vídeos tutoriais com um passo a passo completo sobre como usar o aplicativo.
                                </span>
                                <div className=" mt-2 mb-4 text-center">
                                    <Link href="/tutorials">
                                        <Button variant="primary" size="sm" icon={faBook}>Tutoriais</Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {notification === 'profileEdit' && (
                            <div className="col-12">

                                <span>
                                    Mantenha seu perfil sempre atualizado! É com ele que o seu cliente vai se identificar.
                                </span>
                                <div className=" my-4 text-center">
                                    <Link href="/editProfile">
                                        <Button variant="primary" size="sm" icon={faUser}>Meu Perfil</Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>

    )
}