
import { useEffect, useState } from "react"
import PropertyTypeCard from "../addClient/PropertyTypeCard"
import Map from "../pages/newClient/Map"
import { Swiper, SwiperSlide } from "swiper/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import Link from "next/link"
import ClientInfoApartamento from "./ClientInfoApartamento"
import ClientInfoCasa from "./ClientInfoCasa"
import ClientInfoComercial from "./ClientInfoComercial"
import ClientInfoTerreno from "./ClientInfoTerreno"
import tippy from "tippy.js"




export default function ClientInfo(props) {

    const client = props.client

    useEffect(() => {
        tippy('#emailButton', {
            content: "Enviar e-mail",
            placement: 'bottom'
        })
        tippy('#whatsButton', {
            content: "Conversar pelo Whatsapp",
            placement: 'bottom'
        })
    }, [client])


    const handleWhatsapp = (celular) => {

        const formattedPhoneNumber = celular.replace(/\D/g, '')
        const whatsappURL = `https://api.whatsapp.com/send?phone=${formattedPhoneNumber}`;
        window.open(whatsappURL, '_blank');

    }


    const handleEmail = (email) => {
        // const email = 'example@example.com';
        // const subject = 'Assunto do Email';
        // const body = 'Corpo do email aqui';
        const mailtoLink = `mailto:${email}`;
        // const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Abrir uma nova janela para o link mailto
        window.location.href = mailtoLink;
    };

    return (
        <>
            <div className="row">
                <div className="col-12 d-flex justify-content-end  mb-3">
                    <Link href={`/clientEdit/${client?._id}`} onClick={() => console.log("edit", client)}>
                        <span className="span">editar</span>
                    </Link>
                </div>
                {
                    client?.files?.length === 0 ?
                        <div className="col-12 my-2 d-flex justify-content-center ">
                            <span className="small">Nenhuma imagem carregada</span>
                        </div>
                        :
                        <div className="col-12 my-2 d-flex align-items-center " >

                            {/* {client?.files?.map(elem => {
                                            return (
                                                <div>
                                                    <img src={elem.url} alt="" className="fileImgs mx-2 fadeItem" />
                                                </div>
                                            )
                                        })} */}



                            <Swiper
                                style={{
                                    '--swiper-navigation-color': '#fff',
                                    '--swiper-pagination-color': '#fff',
                                    '--swiper-navigation-size': '25px',
                                    zIndex: 0
                                }}
                                slidesPerView={1}
                                pagination={{ clickable: false }}
                                navigation>
                                {client?.files?.map((elem, index) => (
                                    <SwiperSlide key={index} className="text-center bg-secondary ">



                                        <img src={elem.url} className={`imovel-img`} alt={`Slide ${index + 1}`} />

                                    </SwiperSlide>
                                ))}
                            </Swiper>



                        </div>




                }


                <div className="col-12  col-md-6 d-flex  justify-content-center my-2">
                    <PropertyTypeCard type={client?.propertyType} />
                </div>
                <div className="col-12  col-md-6 d-flex  justify-content-center my-2">
                    <div className="row">
                        <div className="col-12 ">
                            <span className="fs-2">{client?.clientName} {client?.clientLastName}</span>
                        </div>
                        {client?.email && (

                            <div className="col-12 text-secondary">
                                <button className="btn btn-sm btn-outline-secondary" style={{ width: '40px' }}
                                    id="emailButton" onClick={() => handleEmail(client?.email)}>

                                    <FontAwesomeIcon icon={faEnvelope} className="D" />
                                </button>

                                <span className="ms-2">{client?.email}</span>
                            </div>
                        )}
                        {client?.celular && (

                            <div className="col-22 text-secondary mt-1">
                                <button className="btn btn-sm btn-outline-secondary " style={{ width: '40px' }}
                                    id="whatsButton" onClick={() => handleWhatsapp(client?.celular)}>

                                    <FontAwesomeIcon icon={faWhatsapp} className="" />
                                </button>
                                <span className="ms-2">{client?.celular}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                {client?.propertyType === 'Apartamento' && (
                    <ClientInfoApartamento client={client} />
                )}
                {client?.propertyType === 'Casa' && (
                    <ClientInfoCasa client={client} />
                )}
                {client?.propertyType === 'Comercial' && (
                    <ClientInfoComercial client={client} />
                )}
                {client?.propertyType === 'Terreno' && (
                    <ClientInfoTerreno client={client} />
                )}

                < div className="px-3" >
                    <hr />
                </div >

                <div className="col-12 mb-2">
                    <label for="geralForm" className=" fw-bold">Caracteristicas Gerais</label>
                </div>
                <div className="col-12 my-2 mb-4">
                    {client?.features?.map(elem => {
                        return (
                            <span className="me-1">#<b className="bold">{elem}</b></span>
                        )
                    })}
                </div>
                <div className="col-12 mb-2">
                    <label for="geralForm" className=" fw-bold">Observações</label>

                </div>
                <div className="col-12 my-2 mb-4">
                    <textarea name="" id="" disabled rows={3} className="form-control" value={client?.comments} />

                </div>
                <div className="px-3">
                    <hr />
                </div>

                {/* <div className="col-12 mb-2">
                    <label for="geralForm" className="form-label fw-bold">Imagens</label>
                </div>


                <div className="px-3">
                    <hr />
                </div> */}

                <div className="col-12 mb-2">
                    <label for="geralForm" className="form-label fw-bold">Localização</label>
                </div>

                <div className="col-12 my-2">
                    {client?.logradouro ? client?.logradouro + ', ' : ''} {client?.numero ? client?.numero + ', ' : ''} {client?.cep ? client?.cep + ', ' : ''} {client?.cidade} / {client?.uf}
                </div>


                <div className="col-12 my-2 mb-4" >


                    {client?.latitude && client?.longitude && (

                        <Map location={{ lat: client?.latitude, lng: client?.longitude }} zoom={18} height="300px" />
                    )}

                </div>




            </div>
        </>
    )
}