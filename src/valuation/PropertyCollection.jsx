import { Swiper, SwiperSlide } from "swiper/react"
import isMobile from "../../utils/isMobile"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouseMedical } from "@fortawesome/free-solid-svg-icons"
import ClientCard_02 from "../clientsManagement/ClientCard_02"
import PropertyCard from "./PropertyCard"



export default function PropertyCollection(props) {

    const propertyArray = props.propertyArray


    return (
        <div className="col-12">
            {isMobile() ?

                <Swiper
                    style={{
                        '--swiper-navigation-color': '#5a5a5a',
                        '--swiper-pagination-color': '#5a5a5a',
                        '--swiper-navigation-size': '25px',
                        zIndex: 0,

                    }}
                    slidesPerView={1}
                    pagination={{ clickable: false }}
                    navigation>
                    <div className="row px-2 d-flex justify-content-center" style={{ height: '100%' }}>


                        {propertyArray.map((elem, index) => {
                            return (
                                <div className="col-12 col-sm-6 col-xl-4 col-xxl-3 d-flex justify-content-center ">

                                    <SwiperSlide key={index + 1}  >

                                        <PropertyCard section={'Todos Clientes'}
                                            elem={elem} index={index} propertyArray={propertyArray}
                                            setPropertyArray={value => props.setPropertyArray(value)} />

                                    </SwiperSlide>
                                </div>
                            )
                        })}
                        <div className="col-12 col-sm-6 col-xl-4 col-xxl-3 d-flex justify-content-center " >

                            <SwiperSlide key={0} >


                                <div className="card cardAnimation shadow mx-1 my-2" type="button" data-bs-toggle="modal" data-bs-target="#propertyAddModal" style={{ height: '100%' }} >
                                    <div className="card-body"  >
                                        <div className="row my-5" style={{ height: "100%" }}>
                                            <div className="col-12 d-flex justify-content-center align-items-center text-center">
                                                <div>

                                                    <div className="col-12">
                                                        <FontAwesomeIcon icon={faHouseMedical} className="text-secondary fs-1" />
                                                    </div>
                                                    <div className="col-12">
                                                        <span>Adicionar imóvel para comparação</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </SwiperSlide>
                        </div>
                    </div>



                </Swiper>

                :

                <div className="row px-2 d-flex">

                    {propertyArray.map((elem, index) => {
                        return (
                            <div className="col-12 col-sm-6 col-xl-4 col-xxl-3 d-flex justify-content-center px-1 py-2">

                                <PropertyCard section={'Todos Clientes'}
                                    elem={elem} index={index} propertyArray={propertyArray}
                                    setPropertyArray={value => props.setPropertyArray(value)} />
                            </div>

                        )
                    })}

                    <div className="col-12 col-sm-6 col-xl-4 col-xxl-3 d-flex justify-content-center px-1 py-2">


                        <div className="card shadow cardAnimation my-2" type="button" data-bs-toggle="modal" data-bs-target="#propertyAddModal">
                            <div className="card-body">
                                <div className="row" style={{ height: "100%" }}>
                                    <div className="col-12 d-flex justify-content-center align-items-center text-center">
                                        <div>
                                            <div className="col-12">
                                                <FontAwesomeIcon icon={faHouseMedical} className="text-secondary fs-1" />
                                            </div>
                                            <div className="col-12">
                                                <span>Adicionar imóvel para comparação</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


            }

        </div>
    )
}