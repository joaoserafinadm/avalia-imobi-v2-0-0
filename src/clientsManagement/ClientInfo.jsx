import { useEffect, useState } from "react";
import PropertyTypeCard from "../addClient/PropertyTypeCard";
import Map from "../pages/newClient/Map";
import { Swiper, SwiperSlide } from "swiper/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faHouse } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import ClientInfoApartamento from "./ClientInfoApartamento";
import ClientInfoCasa from "./ClientInfoCasa";
import ClientInfoComercial from "./ClientInfoComercial";
import ClientInfoTerreno from "./ClientInfoTerreno";
import tippy from "tippy.js";
import { ChartBar, ChartBarIncreasing, FileSliders, House, HouseIcon, List, MapPin, MessageSquare } from "lucide-react";

export default function ClientInfo(props) {
  const client = props.client;

  useEffect(() => {
    tippy("#emailButton", {
      content: "Enviar e-mail",
      placement: "bottom",
    });
    tippy("#whatsButton", {
      content: "Conversar pelo Whatsapp",
      placement: "bottom",
    });
  }, [client]);

  const handleWhatsapp = (celular) => {
    const formattedPhoneNumber = celular.replace(/\D/g, "");
    const whatsappURL = `https://api.whatsapp.com/send?phone=${formattedPhoneNumber}`;
    window.open(whatsappURL, "_blank");
  };

  const handleEmail = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  };

  return (
    <>
      <style jsx>{`
        .client-profile-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          border: 1px solid rgba(245, 135, 79, 0.1);
          overflow: hidden;
          position: relative;
        }

        .client-profile-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #f5874f, #faa954);
        }

        .profile-header {
          background: linear-gradient(
            135deg,
            rgba(245, 135, 79, 0.05),
            rgba(250, 169, 84, 0.05)
          );
          position: relative;
          border-radius: 20px ;
        }

        .edit-button-modern {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(245, 135, 79, 0.2);
          color: #f5874f;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .edit-button-modern:hover {
          background: #f5874f;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 135, 79, 0.3);
        }

        .valuation-alert {
          background: linear-gradient(
            135deg,
            rgba(245, 135, 79, 0.1),
            rgba(250, 169, 84, 0.1)
          );
          border: 2px dashed rgba(245, 135, 79, 0.3);
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
        }

        .valuation-button-modern {
          background: linear-gradient(135deg, #f5874f, #faa954);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(245, 135, 79, 0.3);
          animation: pulse 2s infinite;
        }

        .valuation-button-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 135, 79, 0.4);
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 4px 15px rgba(245, 135, 79, 0.3);
          }
          50% {
            box-shadow: 0 4px 25px rgba(245, 135, 79, 0.5);
          }
          100% {
            box-shadow: 0 4px 15px rgba(245, 135, 79, 0.3);
          }
        }

        .image-gallery {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .no-images-state {
          background: rgba(90, 90, 90, 0.05);
          border: 2px dashed rgba(90, 90, 90, 0.2);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          color: #5a5a5a;
          margin-bottom: 30px;
        }

        .client-details-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 30px;
          align-items: start;
          margin-bottom: 30px;
        }

        .client-name {
          font-size: 2.2rem;
          font-weight: 700;
          color: #5a5a5a;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .contact-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          padding: 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .contact-item:hover {
          background: rgba(245, 135, 79, 0.05);
          transform: translateX(5px);
        }

        .contact-button {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: 2px solid rgba(245, 135, 79, 0.2);
          background: rgba(245, 135, 79, 0.1);
          color: #f5874f;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .contact-button:hover {
          background: #f5874f;
          color: white;
          border-color: #f5874f;
          transform: scale(1.05);
        }

        .contact-text {
          color: #5a5a5a;
          font-weight: 500;
          font-size: 1rem;
        }

        .info-section {
          backdrop-filter: blur(10px);
          margin-bottom: 25px;
          transition: all 0.3s ease;
        }

      

        .section-title {
          color: #5a5a5a;
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .section-title::before {
          content: "";
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #f5874f, #faa954);
          border-radius: 2px;
          margin-right: 10px;
        }

        .features-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .feature-tag {
          background: linear-gradient(
            135deg,
            rgba(245, 135, 79, 0.1),
            rgba(250, 169, 84, 0.1)
          );
          color: #f5874f;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(245, 135, 79, 0.2);
          transition: all 0.3s ease;
        }

        .feature-tag:hover {
          background: linear-gradient(135deg, #f5874f, #faa954);
          color: white;
          transform: translateY(-1px);
        }

        .comments-textarea {
          border: 2px solid rgba(233, 236, 239, 0.5);
          border-radius: 12px;
          padding: 15px;
          font-size: 1rem;
          color: #cacaca;
          resize: none;
          transition: all 0.3s ease;
        }

        .comments-textarea:focus {
          border-color: rgba(245, 135, 79, 0.5);
          box-shadow: 0 0 0 0.2rem rgba(245, 135, 79, 0.1);
          outline: none;
        }

        .location-text {
          padding: 15px;
          border-radius: 12px;
          color: #cacaca;
          font-size: 1rem;
          margin-bottom: 20px;
          border: 1px solid rgba(233, 236, 239, 0.5);
        }

        .map-container {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .divider {
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(245, 135, 79, 0.3),
            transparent
          );
          margin: 30px 0;
          border: none;
        }

        @media (max-width: 768px) {
          .client-details-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .client-name {
            font-size: 1.8rem;
          }


          .edit-button-modern {
            position: static;
            margin-bottom: 20px;
            display: inline-block;
          }
        }
      `}</style>
      
      {/* Header com informações principais */}
      <div className="profile-header">


        {!client?.valuation && props.valuationButton && (
          <div className="valuation-alert">
            <h5 style={{ color: "#5a5a5a", marginBottom: "15px" }}>
              <FileSliders className="me-2" size={20} /> Nenhuma avaliação realizada
            </h5>
            <p style={{ color: "#6c757d", marginBottom: "20px" }}>
              Realize uma avaliação completa para obter o valor de mercado do
              imóvel
            </p>
            <Link href={"/valuation/" + client?._id}>
              <button
                className="valuation-button-modern"
                data-bs-dismiss="modal"
              >
                <HouseIcon className="me-2" size={20} /> Avaliar Imóvel
              </button>
            </Link>
          </div>
        )}

        <div className="col-12 d-flex justify-content-end mb-3">
        <Link
          href={`/clientEdit/${client?._id}`}
          className="edit-button-modern"
        >
          <button className="action-button-modern">Editar informações</button>
        </Link>
      </div>

        {/* Galeria de Imagens */}
        {client?.files?.length === 0 ? (
          <div className="no-images-state">
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📷</div>
            <p style={{ margin: 0, fontSize: "1.1rem" }}>
              Nenhuma imagem carregada
            </p>
          </div>
        ) : (
          <div className="image-gallery">
            <Swiper
              style={{
                "--swiper-navigation-color": "#f5874f",
                "--swiper-pagination-color": "#f5874f",
                "--swiper-navigation-size": "25px",
                zIndex: 0,
              }}
              slidesPerView={1}
              pagination={{ clickable: false }}
              navigation
            >
              {client?.files?.map((elem, index) => (
                <SwiperSlide key={index} className="text-center">
                  <img
                    src={elem.url}
                    className="imovel-img"
                    alt={`Slide ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Grid de Detalhes do Cliente */}
        <div className="client-details-grid">
          <div>
            <PropertyTypeCard type={client?.propertyType} />
          </div>

          <div>
            <h1 className="client-name">
              {client?.clientName} {client?.clientLastName}
            </h1>

            {client?.email && (
              <div className="contact-item">
                <button
                  className="contact-button"
                  id="emailButton"
                  onClick={() => handleEmail(client?.email)}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                </button>
                <span className="contact-text">{client?.email}</span>
              </div>
            )}

            {client?.celular && (
              <div className="contact-item">
                <button
                  className="contact-button"
                  id="whatsButton"
                  onClick={() => handleWhatsapp(client?.celular)}
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </button>
                <span className="contact-text">{client?.celular}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div >
        {/* Informações Específicas do Tipo de Propriedade */}

        <hr />
        <div className="info-section">
          {client?.propertyType === "Apartamento" && (
            <ClientInfoApartamento client={client} />
          )}
          {client?.propertyType === "Casa" && (
            <ClientInfoCasa client={client} />
          )}
          {client?.propertyType === "Comercial" && (
            <ClientInfoComercial client={client} />
          )}
          {client?.propertyType === "Terreno" && (
            <ClientInfoTerreno client={client} />
          )}
        </div>

        <hr />

        {/* Características Gerais */}
        <div className="info-section">
          <h3 className="section-title"><List className="me-2" size={20} /> Características Gerais</h3>
          <div className="features-grid">
            {client?.features?.map((elem, index) => (
              <span key={index} className="feature-tag">
                {elem}
              </span>
            ))}
          </div>
        </div>

        <hr />
        {/* Observações */}
        <div className="info-section">
          <h3 className="section-title"><MessageSquare className="me-2" size={20} /> Observações</h3>
          <textarea
            className="comments-textarea"
            disabled
            rows={4}
            value={client?.comments || "Nenhuma observação registrada"}
            style={{ width: "100%" }}
          />
        </div>

        <hr />

        {/* Localização */}
        <div className="info-section">
          <h3 className="section-title"><MapPin className="me-2" size={20} /> Localização</h3>

          <div className="location-text">
            {client?.logradouro ? client?.logradouro + ", " : ""}{" "}
            {client?.numero ? client?.numero + ", " : ""}{" "}
            {client?.cep ? client?.cep + ", " : ""} {client?.cidade} -{" "}
            {client?.uf}
          </div>

          {client?.latitude && client?.longitude && (
            <div className="map-container">
              <Map
                location={{ lat: client?.latitude, lng: client?.longitude }}
                zoom={18}
                height="300px"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
