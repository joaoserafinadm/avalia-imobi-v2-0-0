import { useEffect } from "react";
import PropertyTypeCard from "../addClient/PropertyTypeCard";
import Map from "../pages/newClient/Map";
import { Swiper, SwiperSlide } from "swiper/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faImage, faPen } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import ClientInfoApartamento from "./ClientInfoApartamento";
import ClientInfoCasa from "./ClientInfoCasa";
import ClientInfoComercial from "./ClientInfoComercial";
import ClientInfoTerreno from "./ClientInfoTerreno";
import tippy from "tippy.js";
import { FileSliders, HouseIcon, List, MapPin, MessageSquare } from "lucide-react";

export default function ClientInfo(props) {
    const client = props.client;

    useEffect(() => {
        tippy("#emailButton",  { content: "Enviar e-mail",            placement: "bottom" });
        tippy("#whatsButton",  { content: "Conversar pelo Whatsapp",  placement: "bottom" });
    }, [client]);

    const handleWhatsapp = (celular) => {
        const formattedPhoneNumber = celular.replace(/\D/g, "");
        window.open(`https://api.whatsapp.com/send?phone=${formattedPhoneNumber}`, "_blank");
    };

    const handleEmail = (email) => {
        window.location.href = `mailto:${email}`;
    };

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── No-valuation banner ── */}
            {!client?.valuation && props.valuationButton && (
                <div style={{
                    background: 'rgba(245,135,79,0.05)',
                    border: '1.5px dashed rgba(245,135,79,0.25)',
                    borderRadius: '14px',
                    padding: '1.75rem',
                    textAlign: 'center',
                    marginBottom: '1.25rem',
                }}>
                    <FileSliders size={28} style={{ color: 'rgba(245,135,79,0.6)', marginBottom: '0.75rem' }} />
                    <h5 style={{ fontFamily: "'Syne', sans-serif", color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Nenhuma avaliação realizada
                    </h5>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                        Realize uma avaliação para obter o valor de mercado do imóvel
                    </p>
                    <Link href={"/valuation/" + client?._id}>
                        <button data-bs-dismiss="modal" style={{
                            background: '#f5874f', border: 'none', borderRadius: '10px',
                            color: '#0d1420', padding: '9px 22px',
                            fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 700,
                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                        }}>
                            <HouseIcon size={15} /> Avaliar imóvel
                        </button>
                    </Link>
                </div>
            )}

            {/* ── Image gallery ── */}
            {client?.files?.length === 0 ? (
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1.5px dashed rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '2.5rem',
                    textAlign: 'center', marginBottom: '1.25rem',
                }}>
                    <FontAwesomeIcon icon={faImage} style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.1)', marginBottom: '0.75rem' }} />
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.25)' }}>
                        Nenhuma imagem carregada
                    </p>
                </div>
            ) : (
                <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Swiper
                        style={{
                            "--swiper-navigation-color": "#f5874f",
                            "--swiper-pagination-color": "#f5874f",
                            "--swiper-navigation-size": "22px",
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
                                    alt={`Slide ${index + 1}`}
                                    style={{ width: "100%", height: "260px", objectFit: "cover" }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {/* ── Client header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <PropertyTypeCard type={client?.propertyType} />

                <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{
                        fontFamily: "'Syne', sans-serif", fontSize: '1.35rem', fontWeight: 700,
                        color: 'rgba(255,255,255,0.9)', margin: '0 0 10px',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        {client?.clientName} {client?.clientLastName}
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {client?.celular && (
                            <button id="whatsButton" onClick={() => handleWhatsapp(client.celular)} style={contactBtnStyle}>
                                <FontAwesomeIcon icon={faWhatsapp} style={{ color: '#25D366', fontSize: '0.9rem' }} />
                                {client.celular}
                            </button>
                        )}
                        {client?.email && (
                            <button id="emailButton" onClick={() => handleEmail(client.email)} style={contactBtnStyle}>
                                <FontAwesomeIcon icon={faEnvelope} style={{ color: '#f5874f', fontSize: '0.82rem' }} />
                                {client.email}
                            </button>
                        )}
                    </div>
                </div>

                <Link href={`/clientEdit/${client?._id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px', padding: '7px 14px',
                        fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
                    }}>
                        <FontAwesomeIcon icon={faPen} style={{ fontSize: '0.7rem' }} />
                        Editar
                    </span>
                </Link>
            </div>

            <Divider />

            {/* ── Property stats ── */}
            <SectionLabel icon={<HouseIcon size={13} />}>
                {client?.propertyType}
            </SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1.25rem' }}>
                {client?.propertyType === "Apartamento" && <ClientInfoApartamento client={client} />}
                {client?.propertyType === "Casa"        && <ClientInfoCasa        client={client} />}
                {client?.propertyType === "Comercial"   && <ClientInfoComercial   client={client} />}
                {client?.propertyType === "Terreno"     && <ClientInfoTerreno     client={client} />}
            </div>

            <Divider />

            {/* ── Features ── */}
            <SectionLabel icon={<List size={13} />}>Características gerais</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
                {client?.features?.length > 0 ? client.features.map((f, i) => (
                    <span key={i} style={{
                        background: 'rgba(245,135,79,0.08)',
                        border: '1px solid rgba(245,135,79,0.2)',
                        borderRadius: '20px', padding: '5px 14px',
                        fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
                        color: '#f5874f',
                    }}>
                        {f}
                    </span>
                )) : (
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>Nenhuma característica registrada</span>
                )}
            </div>

            <Divider />

            {/* ── Observations ── */}
            <SectionLabel icon={<MessageSquare size={13} />}>Observações</SectionLabel>
            <textarea
                disabled rows={3}
                value={client?.comments || "Nenhuma observação registrada"}
                style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                    padding: '10px 14px', fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)',
                    resize: 'none', outline: 'none', opacity: 1, marginBottom: '1.25rem',
                }}
            />

            <Divider />

            {/* ── Location ── */}
            <SectionLabel icon={<MapPin size={13} />}>Localização</SectionLabel>
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px', padding: '10px 14px',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.5)', marginBottom: '1rem',
                lineHeight: 1.5,
            }}>
                {[client?.logradouro, client?.numero, client?.bairro, client?.cep, `${client?.cidade} - ${client?.uf}`]
                    .filter(Boolean).join(', ')}
            </div>

            {client?.latitude && client?.longitude && (
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Map location={{ lat: client.latitude, lng: client.longitude }} zoom={18} height="260px" />
                </div>
            )}
        </div>
    );
}

const contactBtnStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '8px', padding: '7px 12px',
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)',
    transition: 'background 0.18s ease',
}

function SectionLabel({ children, icon }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{ width: '3px', height: '13px', background: '#f5874f', borderRadius: '2px', flexShrink: 0 }} />
            {icon && <span style={{ color: 'rgba(255,255,255,0.3)' }}>{icon}</span>}
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                {children}
            </span>
        </div>
    )
}

function Divider() {
    return <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '1.25rem 0' }} />
}
