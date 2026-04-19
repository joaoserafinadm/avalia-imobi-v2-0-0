import { useEffect, useState } from "react";

export default function ValuationPropertyCalc(props) {
    const client = props.client;
    const valuation = props.client?.valuation;

    return (
        <>
            <style jsx>{`
                .valuation-calc-container {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(15px);
                    border-radius: 20px;
                    border: 1px solid rgba(245, 135, 79, 0.1);
                    padding: 35px;
                    margin: 30px 0;
                    position: relative;
                    overflow: hidden;
                }

                .valuation-calc-container::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #f5874f, #faa954);
                }

                .section-title-calc {
                    color: #5a5a5a;
                    font-weight: 700;
                    font-size: 1.5rem;
                    margin-bottom: 30px;
                    text-align: start;
                    display: flex;
                    align-items: center;
                }

                .section-title-calc::before {
                    content: "";
                    width: 4px;
                    height: 22px;
                    background: linear-gradient(135deg, #f5874f, #faa954);
                    border-radius: 2px;
                    margin-right: 12px;
                }

                .calc-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .calc-card {
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(245, 135, 79, 0.1);
                    border-radius: 16px;
                    padding: 25px;
                    text-align: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                    position: relative;
                    overflow: hidden;
                }

                .calc-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    border-color: rgba(245, 135, 79, 0.3);
                }

                .calc-card::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #f5874f, #faa954);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .calc-card:hover::before {
                    opacity: 1;
                }

                .calc-card-title {
                    color: #5a5a5a;
                    font-weight: 600;
                    font-size: 1rem;
                    margin-bottom: 15px;
                }

                .calc-value-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 10px;
                }

                .currency-symbol {
                    color: #f5874f;
                    font-size: 1.2rem;
                    font-weight: 600;
                }

                .value-large {
                    color: #5a5a5a;
                    font-size: 2rem;
                    font-weight: 700;
                }

                .value-unit {
                    color: #f5874f;
                    font-size: 1.2rem;
                    font-weight: 600;
                }

                .formula-text {
                    color: #5a5a5a;
                    font-size: 1.8rem;
                    font-weight: 700;
                    font-family: 'Courier New', monospace;
                }

                .area-subtitle {
                    color: #999;
                    font-size: 0.9rem;
                    margin-top: 15px;
                    font-style: italic;
                }

                .pricing-section {
                    margin-top: 50px;
                }

                .pricing-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 25px;
                }

                .pricing-card {
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(245, 135, 79, 0.1);
                    border-radius: 20px;
                    padding: 15px;
                    text-align: center;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .pricing-card.selected {
                    border-color: #f5874f;
                    background: linear-gradient(
                        135deg,
                        rgba(245, 135, 79, 0.05),
                        rgba(250, 169, 84, 0.05)
                    );
                    animation: selectedPulse 2s infinite;
                }

                @keyframes selectedPulse {
                    0% { box-shadow: 0 0 0 0 rgba(245, 135, 79, 0.4); }
                    50% { box-shadow: 0 0 0 10px rgba(245, 135, 79, 0.1); }
                    100% { box-shadow: 0 0 0 0 rgba(245, 135, 79, 0); }
                }

                .pricing-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    border-color: rgba(245, 135, 79, 0.4);
                }

                .pricing-card::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #f5874f, #faa954);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .pricing-card:hover::before,
                .pricing-card.selected::before {
                    opacity: 1;
                }

                .pricing-title {
                    color: #5a5a5a;
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 15px;
                }

                .pricing-value {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin: 15px 0;
                }

                .pricing-currency {
                    color: #f5874f;
                    font-size: 1.3rem;
                    font-weight: 400;
                }

                .pricing-amount {
                    color: #5a5a5a;
                    font-size: 1.5rem;
                    font-weight: 600;
                }

                .pricing-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #f5874f, #faa954);
                    color: white;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-top: 10px;
                    min-width: 60px;
                }

                .pricing-card.short-term .pricing-badge {
                    background: linear-gradient(135deg, #e74c3c, #c0392b);
                }

                .pricing-card.long-term .pricing-badge {
                    background: linear-gradient(135deg, #27ae60, #229954);
                }

                .divider-calc {
                    height: 2px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(245, 135, 79, 0.3),
                        transparent
                    );
                    margin: 40px 0;
                    border: none;
                }

                @media (max-width: 768px) {
                    .valuation-calc-container {
                        padding: 25px 20px;
                    }

                    .calc-grid {
                        grid-template-columns: 1fr;
                        gap: 15px;
                    }

                    .pricing-grid {
                        grid-template-columns: 1fr;
                        gap: 15px;
                    }

                    .value-large {
                        font-size: 1.6rem;
                    }

                    .pricing-amount {
                        font-size: 1.8rem;
                    }

                    .section-title-calc {
                        font-size: 1.3rem;
                    }
                }
            `}</style>

            <div className="">
                {/* Seção de Valor de Avaliação */}
                <h3 className="section-title-calc">Valor de Avaliação</h3>

                <div className="calc-grid">
                    <div className="calc-card ">
                        <div className="calc-card-title">Valor do m²</div>
                        <div className="calc-value-container">
                            <span className="currency-symbol">R$</span>
                            <span className="value-large">
                                {valuation?.valuationCalc?.valorMetroQuadrado},00
                            </span>
                        </div>
                    </div>

                    <div className="calc-card ">
                        <div className="calc-card-title">
                            {valuation?.calcVariables?.calcPrivativa ? "Área privativa" : "Área total"}
                        </div>
                        <div className="calc-value-container">
                            <span className="value-large">
                                {valuation?.calcVariables?.calcPrivativa
                                    ? client?.areaTotalPrivativa
                                    : client?.areaTotal}
                            </span>
                            <span className="value-unit">m²</span>
                        </div>
                    </div>

                    <div className="calc-card ">
                        <div className="calc-card-title">Fórmula</div>
                        <div className="calc-value-container">
                            <span className="formula-text">AT × Vm²</span>
                        </div>
                    </div>

                    <div className="calc-card ">
                        <div className="calc-card-title">Valor Total</div>
                        <div className="calc-value-container">
                            <span className="currency-symbol">R$</span>
                            <span className="value-large">
                                {valuation?.valuationCalc?.valorAvaliacao},00
                            </span>
                        </div>
                    </div>
                </div>

                <hr />

                {/* Seção de Valor de Anúncio */}
                <div className="pricing-section">
                    <h3 className="section-title-calc">Valores para Anúncio</h3>

                    <div className="area-subtitle">
                        {valuation?.calcVariables?.calcPrivativa
                            ? 'Baseado na área privativa'
                            : 'Baseado na área total'}
                    </div>

                    <div className="row d-flex">
                        <div className="col-12 col-md-4">

                            <div className={`pricing-card my-2  short-term ${valuation?.valueSelected === 'curtoPrazoValue' ? 'selected' : ''
                                }`}>
                                <div className="pricing-title">Venda Curto Prazo</div>
                                <div className="pricing-value">
                                    <span className="pricing-currency">R$</span>
                                    <span className="pricing-amount">
                                        {valuation?.valuationCalc?.curtoPrazoValue !== 'NaN'
                                            ? valuation?.valuationCalc?.curtoPrazoValue + ',00'
                                            : '0'}
                                    </span>
                                </div>
                                <div className="pricing-badge">
                                    -{valuation?.calcVariables?.curtoPrazoRange}%
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">

                            <div className={`pricing-card my-2 ${valuation?.valueSelected === 'valorIdealValue' ? 'selected' : ''
                                }`}>
                                <div className="pricing-title">Valor Ideal</div>
                                <div className="pricing-value">
                                    <span className="pricing-currency">R$</span>
                                    <span className="pricing-amount">
                                        {valuation?.valuationCalc?.valorIdealValue !== 'NaN'
                                            ? valuation?.valuationCalc?.valorIdealValue + ',00'
                                            : '0'}
                                    </span>
                                </div>
                                <div className="pricing-badge">
                                    {valuation?.calcVariables?.valorIdealRange > 0 ? '+' : ''}
                                    {valuation?.calcVariables?.valorIdealRange}%
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">


                            <div className={`pricing-card my-2 long-term ${valuation?.valueSelected === 'longoPrazoValue' ? 'selected' : ''
                                }`}>
                                <div className="pricing-title">Venda Longo Prazo</div>
                                <div className="pricing-value">
                                    <span className="pricing-currency">R$</span>
                                    <span className="pricing-amount">
                                        {valuation?.valuationCalc?.longoPrazoValue !== 'NaN'
                                            ? valuation?.valuationCalc?.longoPrazoValue + ',00'
                                            : '0'}
                                    </span>
                                </div>
                                <div className="pricing-badge">
                                    +{valuation?.calcVariables?.longoPrazoRange}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}