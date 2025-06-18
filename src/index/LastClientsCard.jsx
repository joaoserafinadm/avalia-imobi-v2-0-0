import Link from "next/link";
import isMobile from "../../utils/isMobile";
import ClientCard_02 from "../clientsManagement/ClientCard_02";
import ClientCardInfo from "./ClientCardInfo";
import { Swiper, SwiperSlide } from 'swiper/react';
import { SpinnerLG } from "../components/loading/Spinners";




export default function LastClientsCard(props) {

    const { clientsArray, loading } = props



    return (

        <div className="row d-flex mt-3  " >
            <span className="fw-bold text-light">
                Ultimos imóveis cadastrados
            </span>
            {loading ?
                <SpinnerLG />
                :
                <>
                    {clientsArray?.length > 0 ?
                        <Swiper className="fadeItem"
                            style={{
                                // '--swiper-navigation-color': '#f0f2f5',
                                '--swiper-pagination-color': '#5a5a5a',
                                // '--swiper-navigation-size': '28px',
                                zIndex: 0
                            }}
                            slidesPerView={isMobile() ? 1 : 2}
                            // navigation
                            pagination={{ clickable: false }}

                            >

                            {clientsArray?.map((elem, index) => {
                                return (
                                    <SwiperSlide key={index} className="text-center  " >

                                        <div className="col-12  px-2 h-100 pb-3">
                                            <ClientCardInfo elem={elem} />
                                        </div>
                                    </SwiperSlide>

                                )
                            })}
                            <SwiperSlide key={'final'} className="text-center  " >

                                <div className="col-12  px-2 h-100 pb-3">
                                    <div className="card bg-light h-100 my-2">
                                        <div className="card-body">
                                            <div className="row h-100 d-flex justify-content-center align-items-center">
                                                <div>
                                                    <Link href={'/clientsManagement'}>
                                                        <button className="btn btn-outline-orange">
                                                            Visualizar todos os imóveis
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                        :
                        <div className="col-12 d-flex justify-content-center text-center py-5">
                            <span className="text-white small">Nenhum imóvel cadastrado</span>

                        </div>
                    }
                </>
            }


        </div >

    )
}