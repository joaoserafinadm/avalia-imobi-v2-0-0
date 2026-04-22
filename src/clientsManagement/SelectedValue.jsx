import { useState } from "react"
import { maskMoney } from "../../utils/mask"
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import baseUrl from "../../utils/baseUrl";
import { SpinnerSM } from "../components/loading/Spinners";
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
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: '6px' }}>
                    {VALUE_LABELS[selectedKey] || 'Valor selecionado'}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', color: '#f5874f' }}>R$</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
                        {selectedVal !== 'NaN' ? `${selectedVal},00` : '0,00'}
                    </span>
                </div>
            </div>

            {/* Alterar valor */}
            {!imobCustomCheck && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <button
                        onClick={() => setImobCustomCheck(true)}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '8px 20px',
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.8rem',
                            color: 'rgba(255,255,255,0.55)',
                            cursor: 'pointer',
                        }}
                    >
                        Alterar valor
                    </button>
                </div>
            )}

            {imobCustomCheck && (
                <div style={{ marginBottom: '1.25rem' }}>
                    <SectionLabel>Novo valor</SectionLabel>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.09)',
                            borderRadius: '10px', overflow: 'hidden', flex: 1,
                        }}>
                            <span style={{ padding: '0 12px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#f5874f', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                                R$
                            </span>
                            <input
                                value={imobCustomValue}
                                onChange={e => setImobCustomValue(maskMoney(e.target.value))}
                                style={{
                                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                    padding: '10px 12px', textAlign: 'right',
                                    fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.9rem',
                                    color: 'rgba(255,255,255,0.85)',
                                }}
                            />
                            <span style={{ padding: '0 12px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                                ,00
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setImobCustomCheck(false)}
                            style={{
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px', padding: '8px 16px',
                                fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem',
                                color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            disabled={imobCustomValue === ''}
                            onClick={handleSaveCustomValue}
                            style={{
                                background: imobCustomValue === '' ? 'rgba(245,135,79,0.2)' : '#f5874f',
                                border: 'none', borderRadius: '8px', padding: '8px 20px',
                                fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 600,
                                color: imobCustomValue === '' ? 'rgba(255,255,255,0.25)' : '#0d1420',
                                cursor: imobCustomValue === '' ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loadingSave ? <SpinnerSM /> : 'Salvar'}
                        </button>
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
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px', padding: '10px 14px',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.65)',
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
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                {children}
            </span>
        </div>
    )
}
