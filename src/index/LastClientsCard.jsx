import Link from "next/link";
import isMobile from "../../utils/isMobile";
import ClientCard_02 from "../clientsManagement/ClientCard_02";
import ClientCardInfo from "./ClientCardInfo";
import { Swiper, SwiperSlide } from 'swiper/react';
import { SpinnerLG } from "../components/loading/Spinners";
import styles from "./LastClientsCard.module.scss";


export default function LastClientsCard(props) {

    const { clientsArray, loading } = props

    return (
        <div className={styles.section}>

            <span className={styles.sectionHeading}>
                Últimos imóveis cadastrados
            </span>

            {loading ? (
                <div className={styles.loadingWrap}>
                    <SpinnerLG />
                </div>
            ) : (
                <>
                    {clientsArray?.length > 0 ? (
                        <Swiper
                            className={`fadeItem ${styles.swiperWrap}`}
                            style={{
                                '--swiper-pagination-color': '#f5874f',
                                '--swiper-pagination-bullet-inactive-color': 'rgba(255,255,255,0.2)',
                                '--swiper-pagination-bullet-inactive-opacity': '1',
                                zIndex: 0,
                            }}
                            slidesPerView={isMobile() ? 1 : 2}
                            pagination={{ clickable: false }}
                        >
                            {clientsArray?.map((elem, index) => (
                                <SwiperSlide key={index}>
                                    <div className={styles.slideInner}>
                                        <ClientCardInfo elem={elem} />
                                    </div>
                                </SwiperSlide>
                            ))}

                            <SwiperSlide key="final">
                                <div className={`${styles.slideInner}`}>
                                    <div className={`${styles.finalCard} w-100`}>
                                        <div className={styles.finalCardContent}>
                                            <p className={styles.finalLabel}>Gerenciar</p>
                                            <p className={styles.finalTitle}>Todos os imóveis</p>
                                            <Link href="/clientsManagement">
                                                <button className={styles.btnOutline}>
                                                    Visualizar todos
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    ) : (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyText}>Nenhum imóvel cadastrado</span>
                        </div>
                    )}
                </>
            )}

        </div>
    )
}
