
import { useEffect, useState } from "react"
import PropertyTypeCard from "../addClient/PropertyTypeCard"
import Sections from "../components/Sections"
import Map from "../pages/newClient/Map"
import { Swiper, SwiperSlide } from "swiper/react"
import ClientInfo from "./ClientInfo"
import Valuation from "./Valuation"







export default function ViewClientModal(props) {


    const client = props.clientSelected

    const userData = props.userData

    const modalSection = props.modalSection

    const [section, setSection] = useState(modalSection || 'Informações')

    useEffect(() => {
        if (!modalSection) {

            setSection('Informações')
        }
    }, [client._id])



    return (
        <div class="modal fade" id="viewClientModal" tabindex="-1" aria-labelledby="Modal" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content" style={{ background: 'linear-gradient(145deg,#0d1420 0%,#111827 60%,#0f1b2d 100%)', border: '1px solid rgba(245,135,79,0.15)', color: '#cacaca' }}>
                    <div class="modal-header" style={{ background: '#0d1420', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <h5 class="modal-title bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{client?.clientName} {client?.clientLastName}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSection('Informações')}></button>
                    </div>
                    <div className="modal-body-lg">
                        <div className="container carousel  slide" data-bs-touch="false" data-bs-interval='false' id="clientManage">

                            <Sections
                                section={section} idTarget="clientManage"
                                setSection={value => setSection(value)}
                                sections={["Informações", "Avaliação"]} />

                            <div className="carousel-inner ">
                                <div className="carousel-item active">
                                    <div className="row d-flex justify-content-center">
                                        <div className="col-12" >
                                            <ClientInfo client={client} valuationButton/>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-inner ">
                                <div className="carousel-item ">
                                    <div className="row d-flex justify-content-center">
                                        <div className="col-12" >
                                            <Valuation client={client} dataFunction={props.dataFunction} userData={userData} />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style={{ background: '#0d1420', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        <button type="button" class="btn btn-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#cacaca' }} data-bs-dismiss="modal" onClick={() => setSection('Informações')}>Fechar</button>
                    </div>

                </div>
            </div>
        </div>
    )
}