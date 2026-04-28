import { faBed, faShower, faStar, faCar, faLayerGroup, faCouch, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showClientInfo } from "../../utils/showClientInfo";
import styles from './ClientFeaturesValuation.module.scss';

const PROPERTY_CONFIG = {
    'Apartamento': {
        areas: [
            { label: 'Área Total',     key: 'areaTotal' },
            { label: 'Área Privativa', key: 'areaTotalPrivativa' },
        ],
        stats: [
            { icon: faBed,    label: 'quarto',   key: 'quartos' },
            { icon: faShower, label: 'banheiro',  key: 'banheiros' },
            { icon: faStar,   label: 'suíte',     key: 'suites' },
            { icon: faCar,    label: 'vaga',      key: 'vagasGaragem' },
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
            { label: 'Área Total',     key: 'areaTotal' },
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

export default function ClientFeaturesValuation({ client }) {

    if (!showClientInfo(client)) {
        return (
            <div className={styles.outdated}>
                <span className={styles.outdatedDot} />
                Dados desatualizados
                <span className={styles.outdatedDot} />
            </div>
        );
    }

    const config = PROPERTY_CONFIG[client?.propertyType];
    const hasAddress = client?.bairro && client?.cidade && client?.uf;
    const hasFeatures = client?.features?.length > 0;
    const hasComments = !!client?.comments?.trim();

    return (
        <div className={styles.wrap}>

            {/* ── Endereço ── */}
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

            {/* ── Características do imóvel (config-driven) ── */}
            {config && (
                <>
                    {config.areas.length > 0 && (
                        <>
                            <p className={styles.sectionLabel}>Áreas</p>
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
                        </>
                    )}

                    {config.stats.length > 0 && (
                        <>
                            <div className={styles.sep} />
                            <p className={styles.sectionLabel}>Composição</p>
                            <div className={styles.statsGrid}>
                                {config.stats.map(stat => {
                                    const val = client?.[stat.key] || 0;
                                    return (
                                        <div key={stat.key} className={styles.statItem}>
                                            <FontAwesomeIcon icon={stat.icon} className={styles.statIcon} />
                                            <span className={styles.statNum}>{val}</span>
                                            <span className={styles.statLabel}>
                                                {stat.label}{val !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* ── Características gerais ── */}
            {hasFeatures && (
                <>
                    <div className={styles.sep} />
                    <p className={styles.sectionLabel}>Características gerais</p>
                    <div className={styles.featuresList}>
                        {client.features.map((f, i) => (
                            <span key={i} className={styles.featureTag}>{f}</span>
                        ))}
                    </div>
                </>
            )}

            {/* ── Observações ── */}
            {hasComments && (
                <>
                    <div className={styles.sep} />
                    <p className={styles.sectionLabel}>Observações</p>
                    <p className={styles.commentsText}>{client.comments}</p>
                </>
            )}

        </div>
    );
}
