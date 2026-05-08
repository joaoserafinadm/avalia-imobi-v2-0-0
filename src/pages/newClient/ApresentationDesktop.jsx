import { useSelector } from "react-redux"
import styles from './newClient.module.scss'
import { TypeAnimation } from "react-type-animation"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import scrollTo from "../../../utils/scrollTo"
import Button from "../../components/Button"






export default function ApresentationDesktop(props) {

    const newClientForm = useSelector(state => state.newClientForm)

    const [showLogo, setShowLogo] = useState(false)
    const [showStartButton, setShowStartButton] = useState(false)

    useEffect(() => {

        if (newClientForm.logo) {

            setTimeout(() => {
                setShowLogo(true)
            }, 9000)
        }
        setTimeout(() => {
            scrollTo("startButton")
            setShowStartButton(true)
        }, 10000)

    }, [])





    return (
        <div className="card m-3 fadeItem1s" style={{ height: "95%", overflowY: 'scroll', overflowX: 'hidden' }}>


            <div className="row mt-5">
                {newClientForm.profileImageUrl != "https://res.cloudinary.com/joaoserafinadm/image/upload/v1692760589/PUBLIC/user_template_ocrbrg.png" && (
                    <div className="col-12 d-flex justify-content-center">

                        <img src={newClientForm.profileImageUrl} alt="logo" id="logoItem" className={`${styles.profileImage}  fadeItem1s `} />
                    </div>
                )}
            </div>

            <div className="row d-flex justify-content-center mt-5">
                <div className="col-12 col-md-6 ">
                    <div className={`px-1 fadeItem1s`}>
                        <TypeAnimation
                            sequence={[
                                200,
                                `Olá ${newClientForm.clientName}.`,
                                500,
                                `Olá ${newClientForm.clientName}.\nMe chamo ${newClientForm.userFirstName}, e irei te ajudar a avaliar o seu imóvel.`,
                                200,
                                `Olá ${newClientForm.clientName}.\nMe chamo ${newClientForm.userFirstName}, e irei te ajudar a avaliar o seu imóvel.\nPreencha o formulário de cadastro para que possamos começar.`,
                            ]}
                            wrapper="span"
                            speed={50}
                            style={{ fontSize: '1.5em', display: 'inline-block', whiteSpace: 'pre-line' }}
                        />
                    </div>
                </div>
            </div>

            {showLogo && (
                <div className="row mt-5">
                    <div className="col-12 d-flex justify-content-center">


                        <img src={newClientForm.logo} alt="logo" id="logoItem" className={`${styles.logo}  fadeItem1s `} />


                    </div>
                </div>
            )}
            <div className="row my-5">
                <div className="col-12 d-flex justify-content-center">

                    {showStartButton && (

                        <Button
                            variant="ghost"
                            id="startButton"
                            className="btn btn-light btn-lg fs-4 text-secondary fadeItem"
                            data-bs-target="#clientFormCarouselDesktop"
                            data-bs-slide="next"
                        >
                            Começar <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                        </Button>
                    )}


                </div>
            </div>

        </div>
    )


}