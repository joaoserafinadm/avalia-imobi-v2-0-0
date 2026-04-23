import { useEffect } from "react"
import valuationCalcResult from "./valuationCalc"
import TitleLabel from "../components/TitleLabel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons"
import styles from "./PropertyCalc.module.scss"

export default function PropertyCalc(props) {
    const { propertyArray, client, calcVariables, valuationCalc } = props

    useEffect(() => {
        const result = valuationCalcResult(
            propertyArray,
            client,
            calcVariables?.valorIdealRange,
            calcVariables?.curtoPrazoRange,
            calcVariables?.longoPrazoRange,
            calcVariables?.calcPrivativa
        )
        props.setValuationCalc(result)
    }, [
        propertyArray.length,
        client,
        calcVariables?.valorIdealRange,
        calcVariables?.curtoPrazoRange,
        calcVariables?.longoPrazoRange,
        calcVariables?.calcPrivativa,
    ])

    const resetCalc = () => {
        props.setCalcVariables({
            valorIdealRange: 0,
            curtoPrazoRange: 7,
            longoPrazoRange: 7,
            calcPrivativa: true,
        })
    }

    const fmtValue = (val) => (val && val !== "NaN" ? val + ",00" : "0")

    return (
        <div className={styles.section}>
            <hr className={styles.sep} />

            <TitleLabel>Cálculo</TitleLabel>

            <div className={styles.infoBlock}>
                <div className={styles.infoItem}>
                    <span className={styles.infoDot} />
                    A avaliação irá gerar três valores de referência: <b>Valor Ideal</b>, <b>Venda Rápida</b> e <b>Venda a Longo Prazo</b>.
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoDot} />
                    Você poderá ajustar esses valores conforme sua estratégia de venda ou conhecimento de mercado.
                </div>
            </div>

            {/* ── Método de cálculo ── */}
            <div className={styles.radioGroup}>
                <label className={styles.radioOption}>
                    <input
                        className={styles.radioInput}
                        type="radio"
                        name="calcPrivativaCheck"
                        onClick={() => props.setCalcVariables({ ...calcVariables, calcPrivativa: true })}
                        checked={!!calcVariables?.calcPrivativa}
                        readOnly
                    />
                    <div className={styles.radioCard}>
                        <div className={styles.radioDot} />
                        <div>
                            <div className={styles.radioLabel}>Cálculo baseado na <b>área privativa</b></div>
                            <div className={styles.radioDesc}>Considera apenas a área interna do imóvel</div>
                        </div>
                    </div>
                </label>

                <label className={styles.radioOption}>
                    <input
                        className={styles.radioInput}
                        type="radio"
                        name="calcPrivativaCheck"
                        onClick={() => props.setCalcVariables({ ...calcVariables, calcPrivativa: false })}
                        checked={!calcVariables?.calcPrivativa}
                        readOnly
                    />
                    <div className={styles.radioCard}>
                        <div className={styles.radioDot} />
                        <div>
                            <div className={styles.radioLabel}>Cálculo baseado na <b>área total</b></div>
                            <div className={styles.radioDesc}>Inclui área privativa + áreas comuns</div>
                        </div>
                    </div>
                </label>
            </div>

            <hr className={styles.sep} />
            <TitleLabel>Ajustar valores</TitleLabel>

            <div className={styles.valuesGrid}>

                {/* Curto prazo */}
                <div className={styles.valueCard}>
                    <div className={styles.valueCardTitle}>Venda curto prazo</div>
                    <div className={styles.valueAmount}>
                        <span className={styles.valueCurrency}>R$</span>
                        <span className={styles.valueNumber}>{fmtValue(valuationCalc?.curtoPrazoValue)}</span>
                    </div>
                    <div className={styles.rangeWrap}>
                        <input
                            type="range"
                            className={styles.range}
                            min="0" max="50" step="1"
                            value={calcVariables?.curtoPrazoRange}
                            onChange={e => props.setCalcVariables({ ...calcVariables, curtoPrazoRange: e.target.value })}
                            style={{ transform: "rotate(180deg)" }} />
                        <span className={styles.percentBadge}>-{calcVariables?.curtoPrazoRange}%</span>
                    </div>
                </div>

                {/* Valor ideal */}
                <div className={styles.valueCard}>
                    <div className={styles.valueCardTitle}>Valor ideal</div>
                    <div className={styles.valueAmount}>
                        <span className={styles.valueCurrency}>R$</span>
                        <span className={styles.valueNumber}>{fmtValue(valuationCalc?.valorIdealValue)}</span>
                    </div>
                    <div className={styles.rangeWrap}>
                        <input
                            type="range"
                            className={styles.range}
                            min="-50" max="50" step="1"
                            value={calcVariables?.valorIdealRange}
                            onChange={e => props.setCalcVariables({ ...calcVariables, valorIdealRange: e.target.value })} />
                        <span className={styles.percentBadge}>
                            {Number(calcVariables?.valorIdealRange) >= 0 ? '+' : ''}{calcVariables?.valorIdealRange}%
                        </span>
                    </div>
                </div>

                {/* Longo prazo */}
                <div className={styles.valueCard}>
                    <div className={styles.valueCardTitle}>Venda longo prazo</div>
                    <div className={styles.valueAmount}>
                        <span className={styles.valueCurrency}>R$</span>
                        <span className={styles.valueNumber}>{fmtValue(valuationCalc?.longoPrazoValue)}</span>
                    </div>
                    <div className={styles.rangeWrap}>
                        <input
                            type="range"
                            className={styles.range}
                            min="0" max="50" step="1"
                            value={calcVariables?.longoPrazoRange}
                            onChange={e => props.setCalcVariables({ ...calcVariables, longoPrazoRange: e.target.value })} />
                        <span className={styles.percentBadge}>+{calcVariables?.longoPrazoRange}%</span>
                    </div>
                </div>
            </div>

            <div className={styles.resetRow}>
                <button className={styles.resetBtn} onClick={resetCalc}>
                    <FontAwesomeIcon icon={faRotateLeft} />
                    Redefinir cálculo
                </button>
            </div>
        </div>
    )
}
