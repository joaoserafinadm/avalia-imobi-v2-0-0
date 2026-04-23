import { useEffect, useState } from "react";
import Title from "../src/components/title/Title2";
import navbarHide from "../utils/navbarHide.js";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { modalClose } from "../utils/modalControl";
import TitleLabel from "../src/components/TitleLabel";
import styles from "./tutorials.module.scss";

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
    },
];

export default function Tutorials() {

    const dispatch = useDispatch()
    const [activeIndex, setActiveIndex] = useState(0)
    const activeVideo = videosList[activeIndex]

    useEffect(() => {
        modalClose()
        navbarHide(dispatch)
    }, [])

    return (
        <div id="pageTop">
            <Title title="Tutoriais" subtitle="Aprenda a usar a plataforma passo a passo" backButton="/" />

            <div className={`pagesContent ${styles.page}`}>
                <div className={styles.grid}>

                    {/* ── Player ── */}
                    <div className={styles.playerWrap}>
                        <div className={styles.playerAspect}>
                            <iframe
                                className={styles.playerFrame}
                                src={activeVideo.url}
                                title={activeVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                        <div className={styles.playerMeta}>
                            <p className={styles.playerTitle}>{activeVideo.title}</p>
                            <p className={styles.playerCount}>
                                {activeIndex + 1} / {videosList.length}
                            </p>
                        </div>
                    </div>

                    {/* ── Playlist ── */}
                    <div className={styles.sidebar}>
                        <div className={styles.sidebarHeader}>
                            <TitleLabel>Playlist</TitleLabel>
                        </div>
                        {videosList.map((video, index) => (
                            <button
                                key={index}
                                className={activeIndex === index ? styles.playlistItemActive : styles.playlistItem}
                                onClick={() => setActiveIndex(index)}
                            >
                                {activeIndex === index
                                    ? <span className={styles.itemPlayIcon}><FontAwesomeIcon icon={faPlayCircle} /></span>
                                    : <span className={styles.itemNum}>{index + 1}</span>
                                }
                                <span className={styles.itemTitle}>{video.title}</span>
                            </button>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}
