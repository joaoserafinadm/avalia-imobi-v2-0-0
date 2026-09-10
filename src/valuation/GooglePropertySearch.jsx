import { useEffect, useMemo, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import {
    faMagnifyingGlass, faArrowUpRightFromSquare, faCopy, faCheck,
    faRotateLeft, faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons"
import Modal, { ModalBtnSecondary } from "../components/Modal"
import Button from "../components/Button"
import styles from "./GooglePropertySearch.module.scss"

/* ─────────────────────────────────────────────
   GooglePropertySearch

   Monta uma busca no Google a partir das características
   do imóvel avaliado e abre o resultado em uma nova aba,
   para que o corretor escolha manualmente os imóveis de
   comparação. O modal explica o passo a passo.
───────────────────────────────────────────── */

const PORTALS = [
    "site:zapimoveis.com.br",
    "site:vivareal.com.br",
    "site:olx.com.br",
    "site:imovelweb.com.br",
    "site:quintoandar.com",
    "site:chavesnamao.com.br",
]

const DEFAULT_ACTIVE = ["tipo", "quartos", "bairro", "cidade"]

export default function GooglePropertySearch(props) {
    const { client } = props

    // Filtros disponíveis — só entram na lista os que o imóvel realmente possui
    const filters = useMemo(() => {
        const list = []
        const push = (key, label, term) => {
            if (label && term) list.push({ key, label, term })
        }

        push("tipo", client?.propertyType, client?.propertyType)
        push("quartos", client?.quartos ? `${client.quartos} quartos` : "", client?.quartos ? `${client.quartos} quartos` : "")
        push("suites", client?.suites ? `${client.suites} suítes` : "", client?.suites ? `${client.suites} suítes` : "")
        push("banheiros", client?.banheiros ? `${client.banheiros} banheiros` : "", client?.banheiros ? `${client.banheiros} banheiros` : "")
        push("vagas", client?.vagasGaragem ? `${client.vagasGaragem} vagas` : "", client?.vagasGaragem ? `${client.vagasGaragem} vagas garagem` : "")
        push("area", client?.areaTotal ? `${client.areaTotal}m²` : "", client?.areaTotal ? `${client.areaTotal}m²` : "")
        push("bairro", client?.bairro, client?.bairro)
        push("cidade", client?.cidade, [client?.cidade, client?.uf].filter(Boolean).join(" "))

        return list
    }, [client])

    const [active, setActive] = useState(
        () => filters.filter(f => DEFAULT_ACTIVE.includes(f.key)).map(f => f.key)
    )
    const [onlyPortals, setOnlyPortals] = useState(false)
    const [customQuery, setCustomQuery] = useState(null)
    const [copied, setCopied] = useState(false)

    // Reaplica os filtros padrão quando o imóvel é carregado/trocado
    const filterKeys = filters.map(f => f.key).join("|")
    useEffect(() => {
        setActive(filters.filter(f => DEFAULT_ACTIVE.includes(f.key)).map(f => f.key))
        setCustomQuery(null)
    }, [filterKeys])

    const autoQuery = useMemo(() => {
        const terms = filters.filter(f => active.includes(f.key)).map(f => f.term)
        const base = ["à venda", ...terms].join(" ").replace(/\s+/g, " ").trim()
        return onlyPortals ? `${base} (${PORTALS.join(" OR ")})` : base
    }, [filters, active, onlyPortals])

    const query = customQuery !== null ? customQuery : autoQuery
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`

    const toggleFilter = (key) => {
        setCustomQuery(null)
        setCopied(false)
        setActive(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
    }

    const togglePortals = () => {
        setCustomQuery(null)
        setCopied(false)
        setOnlyPortals(prev => !prev)
    }

    const handleReset = () => {
        setCustomQuery(null)
        setCopied(false)
        setActive(filters.filter(f => DEFAULT_ACTIVE.includes(f.key)).map(f => f.key))
        setOnlyPortals(true)
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(query)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            setCopied(false)
        }
    }

    const handleOpenSearch = () => {
        if (!query.trim()) return
        window.open(searchUrl, "_blank", "noopener,noreferrer")
    }

    const steps = [
        {
            title: "Abra a busca no Google",
            text: "Clique em Abrir busca no Google. Uma nova aba será aberta com os resultados para as características deste imóvel.",
        },
        {
            title: "Escolha imóveis semelhantes",
            text: "Nos resultados, procure anúncios de imóveis à venda com tipo, área, número de quartos e localização parecidos com o imóvel avaliado.",
        },
        {
            title: "Copie o link do anúncio",
            text: "Abra o anúncio escolhido e copie o endereço (URL) da página na barra do navegador.",
        },
        {
            title: "Adicione o imóvel aqui",
            text: "Volte para esta tela, clique em Adicionar imóvel, cole o link e confira valor, área, características e localização antes de salvar.",
        },
    ]

    const footer = (
        <div className={styles.footer}>
            <Button variant="ghost" className={styles.resetBtn} onClick={handleReset}>
                <FontAwesomeIcon icon={faRotateLeft} />
                Restaurar busca
            </Button>
            <div className={styles.footerActions}>
                <ModalBtnSecondary>Fechar</ModalBtnSecondary>
                <button
                    type="button"
                    className={styles.googleBtn}
                    onClick={handleOpenSearch}
                    disabled={!query.trim()}
                    data-bs-dismiss="modal"
                >
                    <FontAwesomeIcon icon={faGoogle} />
                    Abrir busca no Google
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className={styles.googleBtnExt} />
                </button>
            </div>
        </div>
    )

    return (
        <>
            <Button
                variant="primary"
                data-bs-toggle="modal"
                data-bs-target="#googlePropertySearchModal"
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                Buscar imóveis
            </Button>

            <Modal
                id="googlePropertySearchModal"
                title="Buscar imóveis"
                subtitle="Encontre imóveis semelhantes para comparação"
                icon={faMagnifyingGlass}
                size="lg"
                footer={footer}
            >
                {/* ── Termos da busca ── */}
                <section className={styles.block}>
                    <span className={styles.blockLabel}>Características da busca</span>
                    <p className={styles.blockHint}>
                        Selecione o que deve entrar na busca. Quanto <strong>menos filtros</strong>,
                        mais resultados o Google retorna.
                    </p>

                    {filters.length > 0 ? (
                        <div className={styles.chips}>
                            {filters.map(filter => (
                                <button
                                    key={filter.key}
                                    type="button"
                                    className={`${styles.chip} ${active.includes(filter.key) ? styles.chipActive : ''}`}
                                    onClick={() => toggleFilter(filter.key)}
                                >
                                    {active.includes(filter.key) && (
                                        <FontAwesomeIcon icon={faCheck} className={styles.chipCheck} />
                                    )}
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyFilters}>
                            Este imóvel não possui características cadastradas para montar a busca.
                            Edite a busca manualmente no campo abaixo.
                        </p>
                    )}

                    {/* <button
                        type="button"
                        className={`${styles.chip} ${styles.portalChip} ${onlyPortals ? styles.chipActive : ''}`}
                        onClick={togglePortals}
                    >
                        {onlyPortals && <FontAwesomeIcon icon={faCheck} className={styles.chipCheck} />}
                        Buscar somente em portais imobiliários
                    </button> */}
                </section>

                {/* ── Termo pesquisado (editável) ── */}
                <section className={styles.block}>
                    <div className={styles.queryHeader}>
                        <span className={styles.blockLabel}>Termo que será pesquisado</span>
                        <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                            {copied ? "Copiado" : "Copiar"}
                        </button>
                    </div>
                    <textarea
                        className={styles.queryInput}
                        rows={3}
                        value={query}
                        onChange={e => { setCustomQuery(e.target.value); setCopied(false) }}
                        placeholder="Digite os termos da busca"
                    />
                    <span className={styles.queryHint}>
                        Você pode editar o texto acima livremente antes de abrir a busca.
                    </span>
                </section>

                {/* ── Passo a passo ── */}
                <section className={styles.block}>
                    <span className={styles.blockLabel}>Como comparar manualmente</span>
                    <ol className={styles.steps}>
                        {steps.map((step, index) => (
                            <li key={index} className={styles.step}>
                                <span className={styles.stepNumber}>{index + 1}</span>
                                <div className={styles.stepBody}>
                                    <span className={styles.stepTitle}>{step.title}</span>
                                    <span className={styles.stepText}>{step.text}</span>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <div className={styles.notice}>
                    <FontAwesomeIcon icon={faTriangleExclamation} className={styles.noticeIcon} />
                    <span>
                        Use apenas anúncios de <strong>venda</strong> (não de aluguel) e prefira imóveis
                        do mesmo bairro ou de bairros com perfil semelhante. Isso deixa o
                        <strong> valor de mercado</strong> calculado muito mais preciso.
                    </span>
                </div>
            </Modal>
        </>
    )
}
