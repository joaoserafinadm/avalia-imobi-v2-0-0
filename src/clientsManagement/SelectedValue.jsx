import { useState } from "react"
import { maskMoney } from "../../utils/mask"
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import baseUrl from "../../utils/baseUrl";
import { SpinnerSM } from "../components/loading/Spinners";
import Button from "../components/Button";
import axios from "axios";

const VALUE_LABELS = {
    curtoPrazoValue:  'Venda Curto Prazo',
    valorIdealValue:  'Valor Ideal',
    longoPrazoValue:  'Venda Longo Prazo',
    customValue:      'Valor do Cliente',
    imobCustomValue:  'Valor do Corretor',
}

export default function SelectedValue({ client, dataFunction }) {

    const token = jwt.decode(Cookies.get("auth"));

    const [imobCustomCheck, setImobCustomCheck] = useState(false)
    const [imobCustomValue, setImobCustomValue] = useState('')
    const [loadingSave, setLoadingSave] = useState(false)

    const handleSaveCustomValue = async () => {
        setLoadingSave(true)
        const data = {
            company_id: token.company_id,
            user_id: token.sub,
            client_id: client?._id,
            value: imobCustomValue
        }
        await axios.post(`/api/clientsManagement/valuationCustomValue`, data)
            .then(() => {
                dataFunction()
                setLoadingSave(false)
                setImobCustomCheck(false)
            }).catch(e => console.log(e))
    }

    const selectedKey = client?.valuation?.valueSelected
    const calcValues  = client?.valuation?.valuationCalc
    const selectedVal = calcValues?.[selectedKey]

    return (
        <div style={{ marginTop: '1.25rem' }}>
            <SectionLabel>Valor escolhido</SectionLabel>

            {/* Selected value card */}
            <div style={{
                background: 'rgba(245,135,79,0.06)',
                border: '1.5px solid rgba(245,135,79,0.25)',
                borderRadius: '12px',
                padding: '1.25rem',
                textAlign: 'center',
                marginBottom: '0.75rem',
            }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'var(--theme-text-tertiary)', marginBottom: '6px' }}>
                    {VALUE_LABELS[selectedKey] || 'Valor selecionado'}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', color: '#f5874f' }}>R$</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.8rem', fontWeight: 500, color: 'var(--theme-text-primary)' }}>
                        {selectedVal !== 'NaN' ? `${selectedVal},00` : '0,00'}
                    </span>
                </div>
            </div>

            {/* Alterar valor */}
            {!imobCustomCheck && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Button variant="secondary" onClick={() => setImobCustomCheck(true)}>
                        Alterar valor
                    </Button>
                </div>
            )}

            {imobCustomCheck && (
                <div style={{ marginBottom: '1.25rem' }}>
                    <SectionLabel>Novo valor</SectionLabel>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            background: 'var(--theme-input-bg)',
                            border: '1px solid rgba(255,255,255,0.09)',
                            borderRadius: '10px', overflow: 'hidden', flex: 1,
                        }}>
                            <span style={{ padding: '0 12px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#f5874f', borderRight: '1px solid var(--theme-border-subtle)' }}>
                                R$
                            </span>
                            <input
                                value={imobCustomValue}
                                onChange={e => setImobCustomValue(maskMoney(e.target.value))}
                                style={{
                                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                    padding: '10px 12px', textAlign: 'right',
                                    fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.9rem',
                                    color: 'var(--theme-text-primary)',
                                }}
                            />
                            <span style={{ padding: '0 12px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: 'var(--theme-text-faint)', borderLeft: '1px solid var(--theme-border-subtle)' }}>
                                ,00
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="secondary" onClick={() => setImobCustomCheck(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            loading={loadingSave}
                            disabled={imobCustomValue === ''}
                            onClick={handleSaveCustomValue}
                        >
                            Salvar
                        </Button>
                    </div>
                </div>
            )}

            {/* Client comment */}
            <SectionLabel>Por que o cliente escolheu esse valor?</SectionLabel>
            <textarea
                rows={3}
                disabled
                value={client?.valuation?.valueComment || ''}
                style={{
                    width: '100%',
                    background: 'var(--theme-input-bg)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px', padding: '10px 14px',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
                    color: 'var(--theme-text-secondary)',
                    resize: 'none', outline: 'none', opacity: 1,
                }}
            />
        </div>
    )
}

function SectionLabel({ children }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
            <div style={{ width: '3px', height: '13px', background: '#f5874f', borderRadius: '2px' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--theme-text-faint)' }}>
                {children}
            </span>
        </div>
    )
}