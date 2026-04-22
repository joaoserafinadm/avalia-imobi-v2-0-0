export default function ValuationStatus({ status }) {
    const answered = status === 'answered'
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.75rem',
            fontWeight: 600,
            background: answered ? 'rgba(52,211,153,0.1)' : 'rgba(245,135,79,0.1)',
            border: `1px solid ${answered ? 'rgba(52,211,153,0.25)' : 'rgba(245,135,79,0.25)'}`,
            color: answered ? '#34d399' : '#f5874f',
        }}>
            <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: answered ? '#34d399' : '#f5874f',
                flexShrink: 0,
            }} />
            {answered ? 'Respondido' : 'Aguardando resposta'}
        </span>
    )
}
