import { useEffect, useState } from "react";
import Title from "../src/components/title/Title2";
import navbarHide from "../utils/navbarHide.js";
import { useDispatch } from "react-redux";
import isMobile from "../utils/isMobile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { closeModal, modalClose } from "../utils/modalControl";

export default function Tutorials() {

    const dispatch = useDispatch()


    const videosList = [
        {
            title: "Como configurar a sua conta",
            url: "https://www.youtube.com/embed/oJw5_mD2o5E?si=6LurzmhZWzaV5lH2",
        },
        {
            title: "Como cadastrar seu primeiro cliente",
            url: "https://www.youtube.com/embed/5D3Z9Ln1XeA?si=HpCn_6yj6WvmD3fh",
        },
        {
            title: "Como fazer uma avaliação",
            url: "https://www.youtube.com/embed/R2ILJY5SDNg?si=6Dwpus4qTSW6UZR-",
        }

    ];

    const [showVideo, setShowVideo] = useState(videosList[0].url);



    useEffect(() => {
        modalClose()
        navbarHide(dispatch)
    }, [])


    return (
        <div id="pageTop">
            <Title title={'Tutoriais'} backButton='/' />
            <div className={`pagesContent shadow fadeItem mb-5 `}>


                <div className={`${!isMobile() && "card shadow"} fadeItem`}>
                    <div className="container">
                        <div className="row">
                            <div className={`col-xl-8 col-12 fadeItem ${!isMobile() && "my-5"}`} style={{ height: isMobile() ? "25vh" : "" }}>
                                <iframe className='shadow rounded rounded-3 mt-1'
                                    width="100%"
                                    height="100%"
                                    src={showVideo}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>

                            <div className={`col-xl-4 col-12 d-flex ${isMobile() ? "mt-4" : "mt-5"}`}>
                                <div className='col-12' style={{ height: "482px" }}>
                                    <div>
                                        <b>Tutoriais:</b>
                                        <p className='fs-small'><i>Clique no vídeo que deseja visualizar</i></p>
                                    </div>
                                    <div className='col-12 d-flex flex-column' style={{ height: "410px" }}>
                                        {videosList.map((video, index) => (
                                            <button key={index} type="button" className={`btn btn-sm btn-light border text-start mt-2 py-3 ps-3 ${showVideo === video.url ? 'border-orange border-1 rounded text-orange fw-bold ' : ''}`} onClick={() => setShowVideo(video.url)}>
                                                <div className="d-flex align-items-center">
                                                    {showVideo === video.url && <FontAwesomeIcon icon={faPlayCircle} className={`fs-5 me-2 text-secondary ${showVideo === video.url ? 'text-orange' : 'text-secondary'}`} />}
                                                    <span className='timeVideoTarget'> {video.title} </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}
