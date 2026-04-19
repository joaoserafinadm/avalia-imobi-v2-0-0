import { useEffect, useState } from "react";
import valuationCalcResult from "./valuationCalc";

export default function PropertyCalc(props) {
  const propertyArray = props.propertyArray;
  const client = props.client;
  const calcVariables = props.calcVariables;
  const valuationCalc = props.valuationCalc;

  const [valorIdealRange, setValorIdealRange] = useState(0);
  const [curtoPrazoRange, setCurtoPrazoRange] = useState(7);
  const [longoPrazoRange, setLongoPrazoRange] = useState(7);

  useEffect(() => {
    const result = valuationCalcResult(
      propertyArray,
      client,
      calcVariables?.valorIdealRange,
      calcVariables?.curtoPrazoRange,
      calcVariables?.longoPrazoRange,
      calcVariables?.calcPrivativa
    );

    props.setValuationCalc(result);
  }, [
    propertyArray.length,
    client,
    calcVariables?.valorIdealRange,
    calcVariables?.curtoPrazoRange,
    calcVariables?.longoPrazoRange,
    calcVariables?.calcPrivativa,
  ]);

  const resetCalc = () => {
    const calcVariables = {
      valorIdealRange: 0,
      curtoPrazoRange: 7,
      longoPrazoRange: 7,
      calcPrivativa: true,
    };

    props.setCalcVariables(calcVariables);
  };

  return (
    <>
      <style jsx>{`
        .modern-calculation-selector {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(245, 135, 79, 0.1);
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .modern-calculation-selector:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
        }

        .radio-option-modern {
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 12px;
        }

        .radio-option-modern:hover {
          transform: translateX(3px);
        }

        .radio-input-modern {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .radio-card-modern {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border: 2px solid rgba(245, 135, 79, 0.08);
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .radio-card-modern::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: linear-gradient(135deg, #f5874f, #faa954);
          transform: scaleY(0);
          transition: transform 0.3s ease;
          border-radius: 0 2px 2px 0;
        }

        .radio-input-modern:checked + .radio-card-modern {
          background: linear-gradient(
            135deg,
            rgba(245, 135, 79, 0.08),
            rgba(250, 169, 84, 0.08)
          );
          border-color: #f5874f;
          box-shadow: 0 4px 15px rgba(245, 135, 79, 0.15);
        }

        .radio-input-modern:checked + .radio-card-modern::before {
          transform: scaleY(1);
        }

        .custom-radio-modern {
          width: 20px;
          height: 20px;
          border: 2px solid #cbd5e0;
          border-radius: 50%;
          margin-right: 12px;
          position: relative;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .radio-input-modern:checked + .radio-card-modern .custom-radio-modern {
          border-color: #f5874f;
          background: linear-gradient(135deg, #f5874f, #faa954);
        }

        .custom-radio-modern::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.2s ease;
        }

        .radio-input-modern:checked
          + .radio-card-modern
          .custom-radio-modern::after {
          transform: translate(-50%, -50%) scale(1);
        }

        .radio-label-modern {
          flex: 1;
          font-size: 1rem;
          color: #5a5a5a;
          line-height: 1.4;
          user-select: none;
        }

        .radio-label-modern b {
          color: #f5874f;
          font-weight: 600;
        }

        .radio-description-modern {
          font-size: 0.85rem;
          color: #6c757d;
          margin-top: 4px;
        }

        .value-card-enhanced {
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(245, 135, 79, 0.1);
          transition: all 0.3s ease;
          overflow: hidden;
          position: relative;
        }

        .value-card-enhanced:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .value-card-enhanced::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #f5874f, #faa954);
        }

        .card-body-enhanced {
          padding: 24px 20px;
        }

        .value-title {
          color: #5a5a5a;
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 12px;
        }

        .value-amount {
          display: flex;
          align-items: baseline;
          justify-content: center;
          margin-bottom: 20px;
        }

        .currency-symbol {
          color: #f5874f;
          font-size: 1.2rem;
          font-weight: 600;
          margin-right: 4px;
        }

        .amount-value {
          color: #5a5a5a;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .range-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-range-modern {
          flex: 1;
          height: 6px;
          background: rgb(192, 192, 192);
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }

        .form-range-modern::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5874f, #faa954);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(245, 135, 79, 0.3);
          transition: all 0.2s ease;
        }

        .form-range-modern::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 8px rgba(245, 135, 79, 0.4);
        }

        .form-range-modern::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5874f, #faa954);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(245, 135, 79, 0.3);
        }

        .percentage-badge {
          background: linear-gradient(135deg, #f5874f, #faa954);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          min-width: 45px;
          text-align: center;
        }

        .reset-button-modern {
          background: linear-gradient(135deg, #6c757d, #5a5a5a);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .reset-button-modern:hover {
          background: linear-gradient(135deg, #5a5a5a, #495057);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .bg-orange-gradient {
          background: linear-gradient(
            135deg,
            rgba(245, 135, 79, 0.1),
            rgba(250, 169, 84, 0.1)
          );
          border: 1px solid rgba(245, 135, 79, 0.2);
        }

        @media (max-width: 768px) {
          .amount-value {
            font-size: 1.5rem;
          }

          .card-body-enhanced {
            padding: 20px 16px;
          }
        }
      `}</style>

      <hr />
      <div className="col-12 my-5 fadeItem">
        <label htmlFor="" className="fw-bold mb-2">
          Cálculo
        </label>
        <div className="alert bg-orange text-dark">
          <div className="col-12 my-1">
            <span>
              &#x25CF; A avaliação irá gerar três valores de referência para o
              imóvel: <b>Valor Ideal</b>, <b>Valor para Venda Rápida</b> e{" "}
              <b>Valor para Venda a Longo Prazo</b>.
            </span>
          </div>
          <div className="col-12 my-1">
            <span>
              &#x25CF; Você poderá ajustar esses valores conforme sua estratégia
              de venda ou conhecimento de mercado.
            </span>
          </div>
        </div>

        {/* Seletor de Tipo de Cálculo Modernizado */}
        <div className="row">
          <div className="col-12 ">
            <div>
              <label className="radio-option-modern">
                <input
                  className="radio-input-modern"
                  type="radio"
                  name="calcPrivativaCheck"
                  onClick={() =>
                    props.setCalcVariables({
                      ...props.calcVariables,
                      calcPrivativa: true,
                    })
                  }
                  checked={calcVariables?.calcPrivativa}
                />
                <div className="radio-card-modern">
                  <div className="custom-radio-modern"></div>
                  <div className="radio-content">
                    <div className="radio-label-modern">
                      Cálculo baseado na <b>área privativa</b>
                    </div>
                    <div className="radio-description-modern">
                      Considera apenas a área interna do imóvel
                    </div>
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label className="radio-option-modern">
                <input
                  className="radio-input-modern"
                  type="radio"
                  name="calcPrivativaCheck"
                  onClick={() =>
                    props.setCalcVariables({
                      ...props.calcVariables,
                      calcPrivativa: false,
                    })
                  }
                  checked={!calcVariables?.calcPrivativa}
                />
                <div className="radio-card-modern">
                  <div className="custom-radio-modern"></div>
                  <div className="radio-content">
                    <div className="radio-label-modern">
                      Cálculo baseado na <b>área total</b>
                    </div>
                    <div className="radio-description-modern">
                      Inclui área privativa + áreas comuns
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <hr />
        {/* Cards de Valores Melhorados */}
        <div className="row d-flex px-2">
          <label htmlFor="" className="fw-bold mb-2">
            Ajustar valores
          </label>
          <div className="col-12 col-lg-4 px-1 my-1">
            <div className="value-card-enhanced  shadow">
              <div className="card-body-enhanced text-center">
                <div className="value-title">Venda curto prazo</div>
                <div className="value-amount">
                  <span className="currency-symbol">R$</span>
                  <span className="amount-value">
                    {valuationCalc?.curtoPrazoValue !== "NaN"
                      ? valuationCalc?.curtoPrazoValue + ",00"
                      : 0}
                  </span>
                </div>
                <div className="range-container">
                  <input
                    type="range"
                    className="form-range-modern"
                    min="0"
                    max="50"
                    step="1"
                    value={calcVariables?.curtoPrazoRange}
                    onChange={(e) =>
                      props.setCalcVariables({
                        ...calcVariables,
                        curtoPrazoRange: e.target.value,
                      })
                    }
                    style={{ transform: "rotate(180deg)" }}
                  />
                  <span className="percentage-badge">
                    -{calcVariables?.curtoPrazoRange}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 px-1 my-1">
            <div className="value-card-enhanced  shadow">
              <div className="card-body-enhanced text-center">
                <div className="value-title">Valor ideal</div>
                <div className="value-amount">
                  <span className="currency-symbol">R$</span>
                  <span className="amount-value">
                    {valuationCalc?.valorIdealValue !== "NaN"
                      ? valuationCalc?.valorIdealValue + ",00"
                      : 0}
                  </span>
                </div>
                <div className="range-container">
                  <input
                    type="range"
                    className="form-range-modern"
                    min="-50"
                    max="50"
                    step="1"
                    value={calcVariables?.valorIdealRange}
                    onChange={(e) =>
                      props.setCalcVariables({
                        ...calcVariables,
                        valorIdealRange: e.target.value,
                      })
                    }
                  />
                  <span className="percentage-badge">
                    {calcVariables?.valorIdealRange}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 px-1 my-1">
            <div className="value-card-enhanced  shadow">
              <div className="card-body-enhanced text-center">
                <div className="value-title">Venda longo prazo</div>
                <div className="value-amount">
                  <span className="currency-symbol">R$</span>
                  <span className="amount-value">
                    {valuationCalc?.longoPrazoValue !== "NaN"
                      ? valuationCalc?.longoPrazoValue + ",00"
                      : 0}
                  </span>
                </div>
                <div className="range-container">
                  <input
                    type="range"
                    className="form-range-modern"
                    min="0"
                    max="50"
                    step="1"
                    value={calcVariables?.longoPrazoRange}
                    onChange={(e) =>
                      props.setCalcVariables({
                        ...calcVariables,
                        longoPrazoRange: e.target.value,
                      })
                    }
                  />
                  <span className="percentage-badge">
                    +{calcVariables?.longoPrazoRange}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="reset-button-modern" onClick={() => resetCalc()}>
              Redefinir Cálculo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
