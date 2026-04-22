import Link from "next/link";
import ValuationPropertyCollection from "./ValuationPropertyCollection";
import ValuationPropertyCalc from "./ValuationPropertyCalc";
import ValuationStatus from "./ValuationStatus";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGear, faUserTie, faShare, faDownload, faCheck, faCopy, faXmark, faEdit } from "@fortawesome/free-solid-svg-icons";
import { userStatusName } from "../../utils/permissions";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import SelectedValue from "./SelectedValue";
import ServiceAvaliation from "./ServiceAvaliation";
import handleShare from "../../utils/handleShare";
import { generatePDF } from "../../utils/generatePdf";
import { useState } from "react";
import { HouseIcon } from "lucide-react";

export default function Valuation(props) {
    const token = jwt.decode(Cookies.get("auth"));
    const userData = props.userData;
    const client = props.client;
    const propertyArray = props?.client?.valuation?.propertyArray;
    const users = useSelector(state => state.users);
    const valuationUser = users?.find(elem => elem._id === client?.valuation?.user_id);

    const [shareButton, setShareButton] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = `${client?.valuation?.urlToken}?userId=${token.sub}`;

    const handleCopyLink = async (url) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShareNative = async (url) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Avaliação - ${userData.companyName}`,
                    text: 'Confira esta avaliação',
                    url: url,
                });
            } catch (err) {
                console.error('Erro ao compartilhar:', err);
            }
        } else {
            handleCopyLink(client?.valuation?.urlToken + '&userId=' + token.sub);
        }
    };

    if (!client?.valuation) {
        return (
            <div style={{
                background: 'rgba(245,135,79,0.05)',
                border: '1.5px dashed rgba(245,135,79,0.2)',
                borderRadius: '14px', padding: '3rem 2rem',
                textAlign: 'center', margin: '1rem 0',
            }}>
                <HouseIcon size={32} style={{ color: 'rgba(245,135,79,0.4)', marginBottom: '1rem' }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
                    Nenhuma avaliação foi realizada para este imóvel
                </p>
                <Link href={"/valuation/" + client?._id}>
                    <button data-bs-dismiss="modal" style={{
                        background: '#f5874f', border: 'none', borderRadius: '10px',
                        color: '#0d1420', padding: '10px 26px',
                        fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 700,
                        cursor: 'pointer',
                    }}>
                        Avaliar imóvel
                    </button>
                </Link>
            </div>
        )
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── Action bar ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <ActionBtn icon={faShare} onClick={() => setShareButton(v => !v)}>
                        Compartilhar
                    </ActionBtn>
                    <ActionBtn icon={faDownload} onClick={() => generatePDF('valuationPdf', userData.companyName)}>
                        Baixar PDF
                    </ActionBtn>
                </div>
                <Link href={"/valuationEdit/" + client?._id} style={{ textDecoration: 'none' }}>
                    <ActionBtn icon={faEdit} dismiss>
                        Editar avaliação
                    </ActionBtn>
                </Link>
            </div>

            {/* ── Share panel ── */}
            {shareButton && (
                <div style={{
                    background: 'rgba(245,135,79,0.05)',
                    border: '1px solid rgba(245,135,79,0.2)',
                    borderRadius: '12px', padding: '1rem 1.25rem',
                    marginBottom: '1.25rem',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
                            Compartilhar avaliação
                        </span>
                        <button onClick={() => setShareButton(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px' }}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>

                    {/* Link input + copy */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                            type="text"
                            readOnly
                            value={client?.valuation?.urlToken + '&userId=' + token.sub}
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                                padding: '8px 12px',
                                fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.72rem',
                                color: 'rgba(255,255,255,0.4)', outline: 'none',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}
                        />
                        <button
                            onClick={() => handleCopyLink(client?.valuation?.urlToken + '&userId=' + token.sub)}
                            style={{
                                background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.07)',
                                border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.12)'}`,
                                borderRadius: '8px', padding: '8px 14px',
                                fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
                                color: copied ? '#34d399' : 'rgba(255,255,255,0.55)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                whiteSpace: 'nowrap', transition: 'all 0.2s ease',
                            }}
                        >
                            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>

                    <button
                        onClick={() => handleShareNative(client?.valuation?.urlToken + '&userId=' + token.sub)}
                        style={{
                            width: '100%', background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                            padding: '9px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem',
                            color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}
                    >
                        <FontAwesomeIcon icon={faShare} /> Compartilhar pelo sistema
                    </button>
                </div>
            )}

            {/* ── Status ── */}
            <div style={{ marginBottom: '1.25rem' }}>
                <SectionLabel>Status da avaliação</SectionLabel>
                <ValuationStatus status={client?.status} />
            </div>

            {client?.status === 'answered' && (
                <>
                    <SelectedValue client={client} dataFunction={props.dataFunction} />
                    <ServiceAvaliation client={client} />
                </>
            )}

            <Divider />

            {/* ── Evaluator ── */}
            <SectionLabel>Avaliação realizada por</SectionLabel>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', padding: '14px',
                marginBottom: '1.25rem',
            }}>
                {valuationUser?.profileImageUrl && (
                    <img
                        src={valuationUser.profileImageUrl}
                        alt="Avaliador"
                        style={{
                            width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover',
                            border: '2px solid rgba(245,135,79,0.3)', flexShrink: 0,
                        }}
                    />
                )}
                <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', marginBottom: '3px' }}>
                        {valuationUser?.firstName} {valuationUser?.lastName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#f5874f' }}>
                        <FontAwesomeIcon icon={valuationUser?.userStatus === "admGlobal" ? faUserGear : faUserTie} />
                        {valuationUser?.userStatus === 'admGlobal' ? 'Administrador' : 'Corretor'}
                    </div>
                </div>
            </div>

            <Divider />

            <ValuationPropertyCalc client={client} />

            <Divider />

            {/* ── Comparison properties ── */}
            <SectionLabel>Imóveis utilizados para comparação</SectionLabel>
            <ValuationPropertyCollection propertyArray={propertyArray} />
        </div>
    );
}

function ActionBtn({ children, icon, onClick, dismiss }) {
    return (
        <button
            onClick={onClick}
            {...(dismiss ? { 'data-bs-dismiss': 'modal' } : {})}
            style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '9px', padding: '8px 16px',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                transition: 'background 0.18s ease, border-color 0.18s ease',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(245,135,79,0.1)'
                e.currentTarget.style.borderColor = 'rgba(245,135,79,0.25)'
                e.currentTarget.style.color = '#f5874f'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
            }}
        >
            {icon && <FontAwesomeIcon icon={icon} style={{ fontSize: '0.78rem' }} />}
            {children}
        </button>
    )
}

function SectionLabel({ children }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{ width: '3px', height: '13px', background: '#f5874f', borderRadius: '2px' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                {children}
            </span>
        </div>
    )
}

function Divider() {
    return <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '1.25rem 0' }} />
}
