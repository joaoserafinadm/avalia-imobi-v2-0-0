import { faBed, faShower, faStar, faCar, faLayerGroup, faCouch, faLocationDot, faGavel, faRulerCombined } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showClientInfo } from "../../utils/showClientInfo";
import { valueShow } from "../../utils/valueShow";
import Link from "next/link";
import styles from './ClientFeatures.module.scss';

/* ── Data-driven config per property type ── */
const PROPERTY_CONFIG = {
    'Apartamento': {
        areas: [
            { label: 'Área Total', key: 'areaTotal' },
            { label: 'Área Privativa', key: 'areaTotalPrivativa' },
        ],
        stats: [
            { icon: faBed,        label: 'quarto',    key: 'quartos' },
            { icon: faShower,     label: 'banheiro',  key: 'banheiros' },
            { icon: faStar,       label: 'suíte',     key: 'suites' },
            { icon: faCar,        label: 'vaga',      key: 'vagasGaragem' },
        ],
    },
    'Casa': {
        areas: [
            { label: 'Área Terreno', key: 'areaTotal' },
            { label: 'Área Casa',    key: 'areaTotalPrivativa' },
        ],
        stats: [
            { icon: faLayerGroup, label: 'pavimento', key: 'pavimentos' },
            { icon: faBed,        label: 'quarto',    key: 'quartos' },
            { icon: faShower,     label: 'banheiro',  key: 'banheiros' },
            { icon: faStar,       label: 'suíte',     key: 'suites' },
            { icon: faCar,        label: 'vaga',      key: 'vagasGaragem' },
        ],
    },
    'Comercial': {
        areas: [
            { label: 'Área Total',    key: 'areaTotal' },
            { label: 'Área Privativa', key: 'areaTotalPrivativa' },
        ],
        stats: [
            { icon: faLayerGroup, label: 'pavimento', key: 'pavimentos' },
            { icon: faCouch,      label: 'sala',      key: 'salas' },
            { icon: faShower,     label: 'banheiro',  key: 'banheiros' },
            { icon: faCar,        label: 'vaga',      key: 'vagasGaragem' },
        ],
    },
    'Terreno': {
        areas: [
            { label: 'Área Total', key: 'areaTotal' },
        ],
        stats: [],
    },
};

export default function ClientFeatures({ client, evaluateBtn }) {

    if (!showClientInfo(client)) {
        return (
            <div className={styles.outdated}>
                <span className={styles.outdatedDot} />
                Dados desatualizados
                <span className={styles.outdatedDot} />
            </div>
        );
    }

    const valuation = valueShow(client?.valuation?.valueSelected, client?.valuation?.valuationCalc);
    const config = PROPERTY_CONFIG[client?.propertyType];

    const hasAddress = client?.bairro && client?.cidade && client?.uf;

    return (
        <>
            {/* ── Valuation / Evaluate ── */}
            {valuation ? (
                <div className={styles.valuationCard}>
                    <span className={styles.valuationCurrency}>R$</span>
                    <span className={styles.valuationAmount}>{valuation},00</span>
                </div>
            ) : evaluateBtn && client?.status === 'active' && (
                <Link href={`/valuation/${client._id}`} className={`pulse ${styles.evaluateBtn}`}>
                    <FontAwesomeIcon icon={faGavel} />
                    Avaliar imóvel
                </Link>
            )}

            {/* ── Address ── */}
            <div className={styles.address}>
                <FontAwesomeIcon icon={faLocationDot} className={styles.addressIcon} />
                {hasAddress ? (
                    <p className={styles.addressText}>
                        {client.bairro}, {client.cidade} / {client.uf}
                    </p>
                ) : (
                    <p className={styles.addressMissing}>Endereço não informado</p>
                )}
            </div>

            {/* ── Property features (config-driven) ── */}
            {config && (
                <>
                    <div className={styles.sep} />

                    {/* Areas */}
                    {config.areas.length > 0 && (
                        <div className={config.areas.length === 1 ? styles.areaGridSingle : styles.areaGrid}>
                            {config.areas.map(area => (
                                <div key={area.key} className={styles.areaBlock}>
                                    <div className={styles.areaValue}>
                                        {client?.[area.key] || 0}
                                        <span>m²</span>
                                    </div>
                                    <div className={styles.areaLabel}>{area.label}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stats */}
                    {config.stats.length > 0 && (
                        <div className={styles.statsGrid}>
                            {config.stats.map(stat => {
                                const val = client?.[stat.key] || 0;
                                const plural = val !== 1 ? 's' : '';
                                return (
                                    <div key={stat.key} className={styles.statItem}>
                                        <FontAwesomeIcon icon={stat.icon} className={styles.statIcon} />
                                        <span className={styles.statNum}>{val}</span>
                                        <span className={styles.statLabel}>{stat.label}{plural}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </>
    );
}
