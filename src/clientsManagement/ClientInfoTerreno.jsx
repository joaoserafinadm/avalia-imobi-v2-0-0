export default function ClientInfoTerreno({ client }) {
    return (
        <>
            <Chip label="Área Total" value={`${client?.areaTotal || 0} m²`} />
            {client?.terrenoIrregular ? (
                <>
                    <Chip label="Frente"          value={`${client?.frente || 0} m`} />
                    <Chip label="Fundos"           value={`${client?.fundos || 0} m`} />
                    <Chip label="Lateral Esq."     value={`${client?.lateralEsquerda || 0} m`} />
                    <Chip label="Lateral Dir."     value={`${client?.lateralDireita || 0} m`} />
                </>
            ) : (
                <>
                    <Chip label="Largura"     value={`${client?.largura || 0} m`} />
                    <Chip label="Comprimento" value={`${client?.comprimento || 0} m`} />
                </>
            )}
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
