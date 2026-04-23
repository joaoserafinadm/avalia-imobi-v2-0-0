import PropertyCollection from "./PropertyCollection"
import PropertyAddModal from "./PropertyAdd"
import AiPropertySearch from "./AiPropertySearch"
import { useState } from "react"
import PropertyCalc from "./PropertyCalc"
import TitleLabel from "../components/TitleLabel"
import styles from "./ValuationConfig.module.scss"

export default function ValuationConfig(props) {
    const client = props.client
    const [forceUpdate, setForceUpdate] = useState(0)
    const [loadingAdd, setLoadingAdd] = useState(false)

    return (
        <>
            <PropertyAddModal
                client={client}
                setPropertyArray={value => props.setPropertyArray(value)}
                setForceUpdate={() => setForceUpdate(forceUpdate + 1)}
                propertyArray={props.propertyArray}
                loadingAdd={loadingAdd}
                setLoadingAdd={value => setLoadingAdd(value)} />

            <div className="col-12">
                <div className={styles.sectionHeader}>
                    <TitleLabel>Imóveis para comparação</TitleLabel>
                    <AiPropertySearch
                        client={client}
                        propertyArray={props.propertyArray}
                        setPropertyArray={value => props.setPropertyArray(value)}
                        setForceUpdate={() => setForceUpdate(forceUpdate + 1)} />
                </div>

                <div className={styles.infoBlock}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoDot} />
                        Esta avaliação utiliza o <strong>método comparativo direto</strong>, uma técnica que estima o valor de um imóvel com base na análise de imóveis semelhantes.
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoDot} />
                        Para obter um valor justo de mercado, adicione <strong>imóveis</strong> com características <strong>semelhantes</strong> ao imóvel avaliado.
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoDot} />
                        O sistema calculará o <strong>preço ideal</strong> de venda com base nessas comparações.
                    </div>
                </div>

                <PropertyCollection
                    propertyArray={props.propertyArray}
                    setPropertyArray={value => props.setPropertyArray(value)}
                    loadingAdd={loadingAdd} />

                {props.propertyArrayError && (
                    <span className={styles.errorText}>{props.propertyArrayError}</span>
                )}
            </div>

            {props.propertyArray.length > 0 && (
                <PropertyCalc
                    setCalcVariables={value => props.setCalcVariables(value)}
                    calcVariables={props.calcVariables}
                    setValuationCalc={value => props.setValuationCalc(value)}
                    valuationCalc={props.valuationCalc}
                    client={client}
                    propertyArray={props.propertyArray} />
            )}
        </>
    )
}
