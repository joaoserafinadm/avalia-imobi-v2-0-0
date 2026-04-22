export default function ClientInfoCasa({ client }) {
    return (
        <>
            <Chip label="Área Total"     value={`${client?.areaTotal || 0} m²`} />
            <Chip label="Área Privativa" value={`${client?.areaTotalPrivativa || 0} m²`} />
            {client?.pavimentos >= 0 && <Chip label="Pavimentos" value={client?.pavimentos || 0} />}
            {client?.quartos >= 0    && <Chip label="Quartos"    value={client?.quartos || 0} />}
            <Chip label="Suítes"    value={client?.suites || 0} />
            <Chip label="Banheiros" value={client?.banheiros || 0} />
            <Chip label="Vagas"     value={client?.vagasGaragem || 0} />
            <Chip label="Sacadas"   value={client?.sacadas || 0} />
        </>
    )
}

function Chip({ label, value }) {
    return (
        <div style={{
            display: 'inline-flex', flexDirection: 'column', gap: '3px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', padding: '10px 16px',
        }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1 }}>
                {value}
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>
                {label}
            </span>
        </div>
    )
}
