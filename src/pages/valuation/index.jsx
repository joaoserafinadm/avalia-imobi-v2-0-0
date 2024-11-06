import axios from "axios";
import { useEffect, useState } from "react";
import baseUrl from "../../../utils/baseUrl";
import { SpinnerLG } from "../../components/loading/Spinners";
import styles from './valuation.module.scss'
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import StartPage from "./StartPage";
import ValuationViewPage from "./ValuationViewPage";
import PropertyUrlModal from "./PropertyUrlModal";
import FinalPage from "./FinalPage";
import tippy from "tippy.js";
import ContentPage from "./ContentPage";
import DownloadPage from "./DownloadPage";
import ErrorPage from "./ErrorPage";
import ValuationPdf from "./valuationPdf";


export default function ValuationPage() {

    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryClientId = urlSearchParams.get("clientId");
    const queryUserId = urlSearchParams.get("userId");
    const queryView = urlSearchParams.get("disabled");

    const [loadingPage, setLoadingPage] = useState(true)
    const [clientData, setClientData] = useState('')
    const [userData, setUserData] = useState('')

    const [porpertyUrl, setPropertyUrl] = useState('')


    const [isOpen, setIsOpen] = useState(false);

    const [slide, setSlide] = useState(0)




    useEffect(() => {
        dataFunction(queryUserId, queryClientId)
    }, [])

    useEffect(() => {
        if (!loadingPage) {

            const answeredStatus = clientData?.valuation?.status === 'answered' ? true : false
            const avaliationStatus = clientData?.valuation?.stars > 0 ? true : false


            if (avaliationStatus) {
                setSlide("downloadPage")
            }
            else if (!avaliationStatus && answeredStatus) {
                setSlide("finalPage")

            } else if (clientData) {
                setSlide("start")
            } else {
                setSlide("errorPage")
            }
        }


    }, [loadingPage])


    const dataFunction = async (user_id, client_id) => {

        const data = {
            user_id,
            client_id
        }

        await axios.get(`${baseUrl()}/api/valuation/valuationView`, {
            params: data
        }).then(res => {
            console.log(res)
            setClientData(res.data.client)
            setUserData(res.data.user)
            setLoadingPage(false)


        }).catch(e => {
            setLoadingPage(false)
            console.log('e', e)

        })

    }


    return (
        <div>
            {loadingPage ?
                <div className=" d-flex align-items-center" style={{ height: '100vh' }}>
                    <SpinnerLG />
                </div>
                :
                <div className="col-12 fadeItem d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>


                    <div id="valuationCarousel" className="col-12 carousel slide " data-bs-touch="false" data-bs-interval='false' style={{ zIndex: 1 }}>
                        <div class="carousel-inner">
                            <div class={`carousel-item ${slide === 'start' ? 'active' : ''}`}>
                                <StartPage
                                    userData={userData}
                                    clientData={clientData} />
                            </div>
                            <div class="carousel-item ">

                                <ContentPage
                                    clientData={clientData}
                                    userData={userData} />

                            </div>
                            <div class="carousel-item ">

                                <ValuationViewPage
                                    queryClientId={queryClientId}
                                    queryUserId={queryUserId}
                                    clientData={clientData}
                                    setPropertyUrl={value => setPropertyUrl(value)} />


                            </div>
                            <div class={`carousel-item ${slide === 'finalPage' ? 'active' : ''}`}>

                                <FinalPage
                                    queryClientId={queryClientId}
                                    queryUserId={queryUserId}
                                    clientData={clientData}
                                />


                            </div>
                            <div class={`carousel-item ${slide === 'downloadPage' ? 'active' : ''}`}>

                                <DownloadPage
                                    userData={userData}
                                />


                            </div>
                            <div class={`carousel-item ${slide === 'errorPage' ? 'active' : ''}`}>

                                <ErrorPage />

                            </div>

                            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                                <ValuationPdf
                                    userData={userData}
                                    clientData={clientData} />
                            </div>


                        </div>

                    </div>


                    <PropertyUrlModal propertyUrl={porpertyUrl} setPropertyUrl={value => setPropertyUrl(value)} />















                    <div className={`${styles.background}`} >
                        <div className={`${styles.backgroundImage}`} style={{ backgroundImage: `url(${userData?.backgroundImageUrl})` }}>
                        </div>
                    </div>
                </div>

            }
        </div>
    )
}



// <div className="col-12 fs-1 text-white" style={{ zIndex: 1 }}>
//                         <div className="row d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//                             <div className="col-8 d-flex justify-content-center">

//                                 <div className="col-6 text-end">
//                                     <img src={userData?.profileImageUrl} alt="" className="rounded-circle border border-3 border-white" />
//                                 </div>
//                                 <div className="col-6 text-start">
//                                     <TypeAnimation
//                                         sequence={[
//                                             200,
//                                             `Olá ${clientData.clientName}.`,
//                                             500,
//                                             `Olá ${clientData.clientName}.\nMe chamo ${clientData.userFirstName}, e irei te ajudar a avaliar o seu imóvel.`,
//                                             200,
//                                             `Olá ${clientData.clientName}.\nMe chamo ${clientData.userFirstName}, e irei te ajudar a avaliar o seu imóvel.\nPreencha o formulário de cadastro para que possamos começar.`,
//                                         ]}
//                                         wrapper="span"
//                                         speed={50}
//                                         style={{ fontSize: '0.5em', display: 'inline-block', whiteSpace: 'pre-line' }}
//                                     />
//                                 </div>
//                             </div>

//                         </div>
//                     </div>