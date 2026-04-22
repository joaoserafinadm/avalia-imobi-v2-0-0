export default function ValuationPropertyCalc({ client }) {
    const valuation = client?.valuation

    return (
        <div>
            <SectionLabel>Valor de avaliação</SectionLabel>

            {/* Calc grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '1.5rem' }}>
                <CalcCard label="Valor do m²" prefix="R$" value={`${valuation?.valuationCalc?.valorMetroQuadrado},00`} />
                <CalcCard
                    label={valuation?.calcVariables?.calcPrivativa ? 'Área privativa' : 'Área total'}
                    suffix="m²"
                    value={valuation?.calcVariables?.calcPrivativa ? client?.areaTotalPrivativa : client?.areaTotal}
                />
                <CalcCard label="Fórmula" mono value="AT × Vm²" />
                <CalcCard label="Valor Total" prefix="R$" value={`${valuation?.valuationCalc?.valorAvaliacao},00`} highlight />
            </div>

            <Divider />

            <SectionLabel>Valores para anúncio</SectionLabel>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>
                Baseado na {valuation?.calcVariables?.calcPrivativa ? 'área privativa' : 'área total'}
            </p>

            {/* Pricing cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                <PricingCard
                    label="Venda Curto Prazo"
                    value={valuation?.valuationCalc?.curtoPrazoValue}
                    badge={`-${valuation?.calcVariables?.curtoPrazoRange}%`}
                    badgeColor="rgba(248,113,113,0.15)"
                    badgeTextColor="#f87171"
                    selected={valuation?.valueSelected === 'curtoPrazoValue'}
                />
                <PricingCard
                    label="Valor Ideal"
                    value={valuation?.valuationCalc?.valorIdealValue}
                    badge={`${valuation?.calcVariables?.valorIdealRange > 0 ? '+' : ''}${valuation?.calcVariables?.valorIdealRange}%`}
                    badgeColor="rgba(245,135,79,0.12)"
                    badgeTextColor="#f5874f"
                    selected={valuation?.valueSelected === 'valorIdealValue'}
                />
                <PricingCard
                    label="Venda Longo Prazo"
                    value={valuation?.valuationCalc?.longoPrazoValue}
                    badge={`+${valuation?.calcVariables?.longoPrazoRange}%`}
                    badgeColor="rgba(52,211,153,0.12)"
                    badgeTextColor="#34d399"
                    selected={valuation?.valueSelected === 'longoPrazoValue'}
                />
            </div>
        </div>
    )
}

function CalcCard({ label, value, prefix, suffix, mono, highlight }) {
    return (
        <div style={{
            background: highlight ? 'rgba(245,135,79,0.07)' : 'rgba(255,255,255,0.03)',
            border: highlight ? '1px solid rgba(245,135,79,0.25)' : '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px', padding: '16px', textAlign: 'center',
        }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                {label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                {prefix && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#f5874f' }}>{prefix}</span>}
                <span style={{
                    fontFamily: mono ? "'IBM Plex Mono', monospace" : "'IBM Plex Mono', monospace",
                    fontSize: mono ? '1rem' : '1.2rem', fontWeight: 500,
                    color: highlight ? '#f5874f' : 'rgba(255,255,255,0.85)',
                }}>
                    {value ?? '—'}
                </span>
                {suffix && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>{suffix}</span>}
            </div>
        </div>
    )
}

function PricingCard({ label, value, badge, badgeColor, badgeTextColor, selected }) {
    return (
        <div style={{
            background: selected ? 'rgba(245,135,79,0.06)' : 'rgba(255,255,255,0.03)',
            border: selected ? '1.5px solid rgba(245,135,79,0.4)' : '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px', padding: '20px', textAlign: 'center',
            boxShadow: selected ? '0 0 0 3px rgba(245,135,79,0.08)' : 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>
                {label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginBottom: '10px' }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: '#f5874f' }}>R$</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.25rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                    {value !== 'NaN' ? `${value},00` : '0,00'}
                </span>
            </div>
            <span style={{
                display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                background: badgeColor, color: badgeTextColor,
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.72rem', fontWeight: 500,
            }}>
                {badge}
            </span>
        </div>
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
