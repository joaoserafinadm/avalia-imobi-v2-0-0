import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import PortraitCard from "../../components/userCard/PortraitCard"
import Button from "../../components/Button"




export default function ActiveClientPage(props) {

    const errorData = props.errorData



    const handleWhatsapp = (celular) => {

        const formattedPhoneNumber = celular.replace(/\D/g, '')
        const whatsappURL = `https://api.whatsapp.com/send?phone=${formattedPhoneNumber}`;
        window.open(whatsappURL, '_blank');

    }



    return (
        <div className="ms-3 fadeItem1s d-flex align-items-center justify-content-center" style={{ height: '100vh', width: '100vw' }}>


            <div className="row d-flex justify-content-center px-2">


                {errorData?.logo && (

                    <div className="col-12 d-flex justify-content-center text-center">
                        <img src={errorData?.logo} alt="" style={{ height: 'auto', width: 'auto', maxHeight: '100px', maxWidth: '150px' }} />

                    </div>
                )}
                <div className="col-12 d-flex justify-content-center text-center mt-3">
                    <span>O seu imóvel está em processo de avaliação</span> <br />

                </div>
                <div className="col-12 d-flex justify-content-center text-center mt-3">
                    <span>Para mais informações entre em contato com o seu corretor de imóveis</span>
                </div>
                <div className="col-12 d-flex justify-content-center text-center mt-3">
                    <span className="card">
                        <div className="card-body">
                            <div className="row">
                                {errorData?.profileImageUrl != "https://res.cloudinary.com/joaoserafinadm/image/upload/v1692760589/PUBLIC/user_template_ocrbrg.png" && (

                                    <div className="col-12 d-flex justify-content-center">

                                        <img src={errorData?.profileImageUrl} height={100} className=" rounded-circle" />
                                    </div>
                                )}
                                <div className="col-12 d-flex justify-content-center">

                                    <span className="bold">{errorData?.userFirstName} {errorData?.userLastName}</span>
                                </div>
                                <div className="col-12 d-flex justify-content-center">

                                    <Button variant="secondary" onClick={() => handleWhatsapp(errorData?.celular)}>
                                        <FontAwesomeIcon icon={faWhatsapp} className="me-2" />
                                        {errorData?.celular}
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </span >
                </div >
                {/* <div className="col-12 d-flex justify-content-center text-center mt-3">

                    <PortraitCard
                        firstName={errorData?.firstName}
                        lastName={errorData?.lastName}
                        creci={errorData?.creci}
                        email={errorData?.workEmail}
                        celular={errorData?.celular}
                        telefone={errorData?.telefone}
                        profileImageUrl={errorData?.profileImageUrl}
                        headerImg={errorData?.backgroundImageUrl}
                        logo={errorData?.logo}
                        whatsLink
                    />
                </div> */}
            </div>

        </div >
    )
}