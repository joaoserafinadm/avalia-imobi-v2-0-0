import { useState, useEffect, useRef } from "react"
import { maskMoney } from "../../utils/mask"
import Modal, { ModalBtnPrimary, ModalBtnSecondary } from "../components/Modal"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import styles from "./PropertyEditModal.module.scss"

function Field({ label, id, value, onChange, required = false }) {
    return (
        <div className={`col-12 col-md-6 ${styles.fieldGroup}`}>
            <label htmlFor={id} className={styles.label}>{label}{required && ' *'}</label>
            <input
                type="text"
                className={styles.input}
                id={id}
                value={value || ""}
                onChange={e => onChange(e.target.value)} />
        </div>
    )
}

function NumberField({ label, id, value, onChange, suffix = "" }) {
    return (
        <div className={`col-6 col-md-3 ${styles.fieldGroup}`}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            {suffix ? (
                <div className={styles.unitGroup}>
                    <input
                        type="number"
                        min="0"
                        className={styles.unitInput}
                        id={id}
                        value={value || ""}
                        onChange={e => onChange(e.target.value)} />
                    <span className={styles.unitSuffix}>{suffix}</span>
                </div>
            ) : (
                <input
                    type="number"
                    min="0"
                    className={styles.input}
                    id={id}
                    value={value || ""}
                    onChange={e => onChange(e.target.value)} />
            )}
        </div>
    )
}

const EMPTY = {
    propertyName: "", propertyPrice: "", propertyLink: "", imageUrl: "", propertyType: "",
    areaTotal: "", areaTotalPrivativa: "", quartos: "", suites: "", banheiros: "", sacadas: "",
    andar: "", vagasGaragem: "", pavimentos: "", salas: "", largura: "", comprimento: "",
    frente: "", fundos: "", lateralEsquerda: "", lateralDireita: "", terrenoIrregular: false,
    logradouro: "", bairro: "", cidade: "", uf: "",
}

export default function PropertyEditModal({ property, index, propertyArray, setPropertyArray }) {
    const [form, setForm] = useState(EMPTY)
    const [errors, setErrors] = useState({})
    const closeRef = useRef(null)

    useEffect(() => {
        if (property) {
            setForm({ ...EMPTY, ...property })
            setErrors({})
        }
    }, [property])

    const set = (field) => (value) => setForm(prev => ({ ...prev, [field]: value }))

    const handleSave = () => {
        const next = {}
        if (!form.propertyPrice) next.propertyPrice = "O valor do imóvel é obrigatório."
        if (!form.areaTotal) next.areaTotal = "A área total é obrigatória."
        if (Object.keys(next).length > 0) { setErrors(next); return; }
        setErrors({})

        const updated = [...propertyArray]
        updated[index] = { ...property, ...form }
        setPropertyArray(updated)
        closeRef.current?.click()
    }

    const type = form.propertyType

    const footer = (
        <div style={{ display: 'flex', gap: '8px' }}>
            <button ref={closeRef} type="button" data-bs-dismiss="modal" style={{ display: 'none' }} />
            <ModalBtnSecondary>Cancelar</ModalBtnSecondary>
            <ModalBtnPrimary dismiss={false} onClick={handleSave}>Salvar</ModalBtnPrimary>
        </div>
    )

    return (
        <Modal
            id="propertyEditModal"
            title="Editar imóvel"
            icon={faPencil}
            size="lg"
            footer={footer}
        >
            <div className="row">

                {/* ── Informações gerais ── */}
                <div className="col-12">
                    <div className={styles.sectionTitle}>Informações gerais</div>
                </div>

                <div className={`col-12 ${styles.fieldGroup}`}>
                    <label htmlFor="editPropertyLink" className={styles.label}>Link do imóvel</label>
                    <input type="text" className={styles.input} id="editPropertyLink"
                        value={form.propertyLink || ""} onChange={e => set("propertyLink")(e.target.value)} />
                </div>

                <div className={`col-12 col-md-8 ${styles.fieldGroup}`}>
                    <label htmlFor="editPropertyName" className={styles.label}>Nome do imóvel *</label>
                    <input type="text" className={styles.input} id="editPropertyName"
                        value={form.propertyName || ""} onChange={e => set("propertyName")(e.target.value)} />
                </div>

                <div className={`col-12 col-md-4 ${styles.fieldGroup}`}>
                    <label htmlFor="editPropertyPrice" className={styles.label}>Valor *</label>
                    <div className={styles.priceGroup}>
                        <span className={styles.pricePrefix}>R$</span>
                        <input
                            type="text"
                            className={`${styles.priceInput}${errors.propertyPrice ? ' ' + styles.error : ''}`}
                            id="editPropertyPrice"
                            placeholder="0"
                            value={form.propertyPrice || ""}
                            onChange={e => {
                                set("propertyPrice")(maskMoney(e.target.value))
                                if (e.target.value) setErrors(p => ({ ...p, propertyPrice: undefined }))
                            }} />
                        <span className={styles.priceSuffix}>,00</span>
                    </div>
                    {errors.propertyPrice && <span className={styles.errorText}>{errors.propertyPrice}</span>}
                </div>

                <div className={`col-12 ${styles.fieldGroup}`}>
                    <label htmlFor="editImageUrl" className={styles.label}>URL da imagem</label>
                    <input type="text" className={styles.input} id="editImageUrl"
                        value={form.imageUrl || ""} onChange={e => set("imageUrl")(e.target.value)} />
                </div>

                {/* ── Localização ── */}
                <div className="col-12">
                    <div className={styles.sectionTitle}>Localização</div>
                </div>

                <div className={`col-12 col-md-6 ${styles.fieldGroup}`}>
                    <label htmlFor="editBairro" className={styles.label}>Bairro</label>
                    <input type="text" className={styles.input} id="editBairro"
                        value={form.bairro || ""} onChange={e => set("bairro")(e.target.value)} />
                </div>
                <div className={`col-12 col-md-4 ${styles.fieldGroup}`}>
                    <label htmlFor="editCidade" className={styles.label}>Cidade</label>
                    <input type="text" className={styles.input} id="editCidade"
                        value={form.cidade || ""} onChange={e => set("cidade")(e.target.value)} />
                </div>
                <div className={`col-12 col-md-2 ${styles.fieldGroup}`}>
                    <label htmlFor="editUf" className={styles.label}>UF</label>
                    <input type="text" className={styles.input} id="editUf" maxLength={2}
                        value={form.uf || ""} onChange={e => set("uf")(e.target.value.toUpperCase())} />
                </div>
                <div className={`col-12 ${styles.fieldGroup}`}>
                    <label htmlFor="editLogradouro" className={styles.label}>Logradouro</label>
                    <input type="text" className={styles.input} id="editLogradouro"
                        value={form.logradouro || ""} onChange={e => set("logradouro")(e.target.value)} />
                </div>

                {/* ── Características ── */}
                {type && (
                    <>
                        <div className="col-12">
                            <div className={styles.sectionTitle}>Características</div>
                        </div>

                        {/* Área total — todos */}
                        <div className={`col-12 col-md-6 ${styles.fieldGroup}`}>
                            <label htmlFor="editAreaTotal" className={styles.label}>
                                {type === "Terreno" ? "Área total" : type === "Casa" ? "Área do terreno" : "Área total"} (m²) *
                            </label>
                            <div className={styles.unitGroup}>
                                <input
                                    type="number" min="0"
                                    className={`${styles.unitInput}${errors.areaTotal ? ' ' + styles.error : ''}`}
                                    id="editAreaTotal"
                                    value={form.areaTotal || ""}
                                    onChange={e => {
                                        set("areaTotal")(e.target.value)
                                        if (e.target.value) setErrors(p => ({ ...p, areaTotal: undefined }))
                                    }} />
                                <span className={styles.unitSuffix}>m²</span>
                            </div>
                            {errors.areaTotal && <span className={styles.errorText}>{errors.areaTotal}</span>}
                        </div>

                        {/* Área privativa */}
                        {(type === "Apartamento" || type === "Casa" || type === "Comercial") && (
                            <div className={`col-12 col-md-6 ${styles.fieldGroup}`}>
                                <label htmlFor="editAreaPrivativa" className={styles.label}>
                                    {type === "Casa" ? "Área privativa — Casa (m²)" : "Área privativa (m²)"}
                                </label>
                                <div className={styles.unitGroup}>
                                    <input type="number" min="0" className={styles.unitInput} id="editAreaPrivativa"
                                        value={form.areaTotalPrivativa || ""} onChange={e => set("areaTotalPrivativa")(e.target.value)} />
                                    <span className={styles.unitSuffix}>m²</span>
                                </div>
                            </div>
                        )}

                        {/* Terreno — dimensões */}
                        {type === "Terreno" && (
                            <>
                                <div className="col-12">
                                    <label className={styles.checkWrap}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkInput}
                                            id="editTerrenoIrregular"
                                            checked={!!form.terrenoIrregular}
                                            onChange={e => set("terrenoIrregular")(e.target.checked)} />
                                        <span className={styles.checkLabel}>Terreno irregular</span>
                                    </label>
                                </div>
                                {!form.terrenoIrregular ? (
                                    <>
                                        <NumberField label="Largura (m)" id="editLargura" value={form.largura} onChange={set("largura")} />
                                        <NumberField label="Comprimento (m)" id="editComprimento" value={form.comprimento} onChange={set("comprimento")} />
                                    </>
                                ) : (
                                    <>
                                        <NumberField label="Frente (m)" id="editFrente" value={form.frente} onChange={set("frente")} />
                                        <NumberField label="Fundos (m)" id="editFundos" value={form.fundos} onChange={set("fundos")} />
                                        <NumberField label="Lateral esq. (m)" id="editLateralEsq" value={form.lateralEsquerda} onChange={set("lateralEsquerda")} />
                                        <NumberField label="Lateral dir. (m)" id="editLateralDir" value={form.lateralDireita} onChange={set("lateralDireita")} />
                                    </>
                                )}
                            </>
                        )}

                        {(type === "Casa" || type === "Comercial") && (
                            <NumberField label="Pavimentos" id="editPavimentos" value={form.pavimentos} onChange={set("pavimentos")} />
                        )}
                        {type === "Comercial" && (
                            <NumberField label="Salas" id="editSalas" value={form.salas} onChange={set("salas")} />
                        )}
                        {(type === "Apartamento" || type === "Casa") && (
                            <NumberField label="Quartos" id="editQuartos" value={form.quartos} onChange={set("quartos")} />
                        )}
                        {(type === "Apartamento" || type === "Casa") && (
                            <NumberField label="Suítes" id="editSuites" value={form.suites} onChange={set("suites")} />
                        )}
                        {type !== "Terreno" && (
                            <NumberField label="Banheiros" id="editBanheiros" value={form.banheiros} onChange={set("banheiros")} />
                        )}
                        {type === "Apartamento" && (
                            <NumberField label="Sacadas" id="editSacadas" value={form.sacadas} onChange={set("sacadas")} />
                        )}
                        {type === "Apartamento" && (
                            <NumberField label="Andar" id="editAndar" value={form.andar} onChange={set("andar")} />
                        )}
                        {type !== "Terreno" && (
                            <NumberField label="Vagas de garagem" id="editVagas" value={form.vagasGaragem} onChange={set("vagasGaragem")} />
                        )}
                    </>
                )}
            </div>
        </Modal>
    )
}
