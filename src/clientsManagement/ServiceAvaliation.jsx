import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function ServiceAvaliation({ client }) {
    return (
        <div style={{ marginTop: '1.5rem' }}>

            {/* Stars */}
            <SectionLabel>Avaliação do atendimento</SectionLabel>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
                {[1, 2, 3, 4, 5].map(n => (
                    <FontAwesomeIcon
                        key={n}
                        icon={faStar}
                        style={{
                            fontSize: '1.5rem',
                            color: client?.valuation?.stars >= n ? '#f5874f' : 'rgba(255,255,255,0.1)',
                            transition: 'color 0.15s ease',
                        }}
                    />
                ))}
            </div>

            {/* Comment */}
            <SectionLabel>Comentário sobre o atendimento</SectionLabel>
            <textarea
                rows={3}
                disabled
                value={client?.valuation?.valuationComment || ''}
                style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.65)',
                    resize: 'none',
                    outline: 'none',
                    opacity: 1,
                }}
            />
        </div>
    )
}

function SectionLabel({ children }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
            <div style={{ width: '3px', height: '13px', background: '#f5874f', borderRadius: '2px' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                {children}
            </span>
        </div>
    )
}
