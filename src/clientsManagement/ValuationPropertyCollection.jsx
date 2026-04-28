import { Swiper, SwiperSlide } from "swiper/react"
import isMobile from "../../utils/isMobile"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouseMedical } from "@fortawesome/free-solid-svg-icons"
import PropertyCard from "../valuation/PropertyCard"



export default function ValuationPropertyCollection(props) {

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
                    <div className="row px-2 d-flex" style={{ height: '100%' }}>


                        {propertyArray?.map((elem, index) => {
                            return (
                                <div className="col-12 col-sm-6 col-lg-4  d-flex justify-content-center ">

                                    <SwiperSlide key={index + 1}  >

                                        <PropertyCard anuncioView  section={'Todos Clientes'} deleteHide
                                            elem={elem} index={index} propertyArray={propertyArray}
                                            setPropertyArray={value => props.setPropertyArray(value)} />

                                    </SwiperSlide>
                                </div>
                            )
                        })}

                    </div>



                </Swiper>

                :

                <div className="row px-2 d-flex">

                    {propertyArray.map((elem, index) => {
                        return (
                            <div className="col-12 col-sm-6 col-lg-4  d-flex justify-content-center px-1 py-2">

                                <PropertyCard anuncioView section={'Todos Clientes'} deleteHide
                                    elem={elem} index={index} propertyArray={propertyArray}
                                    setPropertyArray={value => props.setPropertyArray(value)} />
                            </div>

                        )
                    })}


                </div>


            }

        </div>
    )
}