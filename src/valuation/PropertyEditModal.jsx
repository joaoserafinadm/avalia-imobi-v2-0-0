import { useState, useEffect, useRef } from "react";
import { maskMoney } from "../../utils/mask";
import Info from "../components/info";

function Field({ label, id, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="col-12 col-md-6 my-2">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        type={type}
        className="form-control"
        id={id}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function NumberField({ label, id, value, onChange, suffix = "" }) {
  return (
    <div className="col-6 col-md-3 my-2">
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="input-group">
        <input
          type="number"
          min="0"
          className="form-control"
          id={id}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <span className="input-group-text">{suffix}</span>}
      </div>
    </div>
  );
}

const EMPTY = {
  propertyName: "",
  propertyPrice: "",
  propertyLink: "",
  imageUrl: "",
  propertyType: "",
  areaTotal: "",
  areaTotalPrivativa: "",
  quartos: "",
  suites: "",
  banheiros: "",
  sacadas: "",
  andar: "",
  vagasGaragem: "",
  pavimentos: "",
  salas: "",
  largura: "",
  comprimento: "",
  frente: "",
  fundos: "",
  lateralEsquerda: "",
  lateralDireita: "",
  terrenoIrregular: false,
  logradouro: "",
  bairro: "",
  cidade: "",
  uf: "",
};

export default function PropertyEditModal({ property, index, propertyArray, setPropertyArray }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const closeRef = useRef(null);

  useEffect(() => {
    if (property) {
      setForm({ ...EMPTY, ...property });
      setErrors({});
    }
  }, [property]);

  const set = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    const next = {};
    if (!form.propertyPrice) next.propertyPrice = "O valor do imóvel é obrigatório.";
    if (!form.areaTotal) next.areaTotal = "A área total é obrigatória.";
    if (Object.keys(next).length > 0) { setErrors(next); return; }
    setErrors({});

    const updated = [...propertyArray];
    updated[index] = { ...property, ...form };
    setPropertyArray(updated);

    closeRef.current?.click();
  };

  const type = form.propertyType;

  return (
    <div className="modal fade" id="propertyEditModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title title-dark bold">Editar imóvel</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            <button ref={closeRef} type="button" data-bs-dismiss="modal" style={{ display: "none" }} />
          </div>

          <div className="modal-body">
            <div className="row mt-2">

              {/* Informações básicas */}
              <div className="col-12 mb-2">
                <label className="form-label fw-bold">Informações gerais</label>
              </div>

              <div className="col-12 my-2">
                <label htmlFor="editPropertyLink" className="form-label">
                  Link do Imóvel
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editPropertyLink"
                  value={form.propertyLink || ""}
                  onChange={(e) => set("propertyLink")(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-8 my-2">
                <label htmlFor="editPropertyName" className="form-label">
                  Nome do Imóvel <b>*</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editPropertyName"
                  value={form.propertyName || ""}
                  onChange={(e) => set("propertyName")(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-4 my-2">
                <label htmlFor="editPropertyPrice" className="form-label">
                  Valor <b>*</b>
                </label>
                <div className="input-group">
                  <span className="input-group-text">R$</span>
                  <input
                    type="text"
                    className={`form-control text-end ${errors.propertyPrice ? "border-danger" : ""}`}
                    id="editPropertyPrice"
                    placeholder="0"
                    value={form.propertyPrice || ""}
                    onChange={(e) => {
                      set("propertyPrice")(maskMoney(e.target.value));
                      if (e.target.value) setErrors((p) => ({ ...p, propertyPrice: undefined }));
                    }}
                  />
                  <span className="input-group-text">,00</span>
                </div>
                {errors.propertyPrice && <small className="text-danger">{errors.propertyPrice}</small>}
              </div>

              <div className="col-12 my-2">
                <label htmlFor="editImageUrl" className="form-label">URL da imagem</label>
                <input
                  type="text"
                  className="form-control"
                  id="editImageUrl"
                  value={form.imageUrl || ""}
                  onChange={(e) => set("imageUrl")(e.target.value)}
                />
              </div>

              {/* Localização */}
              <div className="col-12 mt-3 mb-2">
                <label className="form-label fw-bold">Localização</label>
              </div>

              <div className="col-12 col-md-6 my-2">
                <label htmlFor="editBairro" className="form-label">Bairro</label>
                <input type="text" className="form-control" id="editBairro"
                  value={form.bairro || ""} onChange={(e) => set("bairro")(e.target.value)} />
              </div>
              <div className="col-12 col-md-4 my-2">
                <label htmlFor="editCidade" className="form-label">Cidade</label>
                <input type="text" className="form-control" id="editCidade"
                  value={form.cidade || ""} onChange={(e) => set("cidade")(e.target.value)} />
              </div>
              <div className="col-12 col-md-2 my-2">
                <label htmlFor="editUf" className="form-label">UF</label>
                <input type="text" className="form-control" id="editUf" maxLength={2}
                  value={form.uf || ""} onChange={(e) => set("uf")(e.target.value.toUpperCase())} />
              </div>
              <div className="col-12 my-2">
                <label htmlFor="editLogradouro" className="form-label">Logradouro</label>
                <input type="text" className="form-control" id="editLogradouro"
                  value={form.logradouro || ""} onChange={(e) => set("logradouro")(e.target.value)} />
              </div>

              {/* Características por tipo */}
              {type && (
                <>
                  <div className="col-12 mt-3 mb-2">
                    <label className="form-label fw-bold">Características</label>
                  </div>

                  {/* Área total — todos os tipos */}
                  <div className="col-12 col-md-6 my-2">
                    <label htmlFor="editAreaTotal" className="form-label">
                      {type === "Terreno" ? "Área total" : type === "Casa" ? "Área do terreno" : "Área total"} (m²) <b>*</b>
                    </label>
                    <div className="input-group">
                      <input type="number" min="0"
                        className={`form-control ${errors.areaTotal ? "border-danger" : ""}`}
                        id="editAreaTotal"
                        value={form.areaTotal || ""}
                        onChange={(e) => {
                          set("areaTotal")(e.target.value);
                          if (e.target.value) setErrors((p) => ({ ...p, areaTotal: undefined }));
                        }} />
                      <span className="input-group-text">m²</span>
                    </div>
                    {errors.areaTotal && <small className="text-danger">{errors.areaTotal}</small>}
                  </div>

                  {/* Área privativa — Apartamento, Casa, Comercial */}
                  {(type === "Apartamento" || type === "Casa" || type === "Comercial") && (
                    <div className="col-12 col-md-6 my-2">
                      <label htmlFor="editAreaPrivativa" className="form-label">
                        {type === "Casa" ? "Área privativa — Casa (m²)" : "Área privativa (m²)"}
                      </label>
                      <input type="number" min="0" className="form-control" id="editAreaPrivativa"
                        value={form.areaTotalPrivativa || ""} onChange={(e) => set("areaTotalPrivativa")(e.target.value)} />
                    </div>
                  )}

                  {/* Terreno — dimensões */}
                  {type === "Terreno" && (
                    <div className="row">
                      <div className="col-12 mb-2">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="editTerrenoIrregular"
                            checked={!!form.terrenoIrregular}
                            onChange={(e) => set("terrenoIrregular")(e.target.checked)} />
                          <label className="form-check-label" htmlFor="editTerrenoIrregular">
                            Terreno irregular
                          </label>
                        </div>
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
                    </div>
                  )}

                  {/* Pavimentos — Casa e Comercial */}
                  {(type === "Casa" || type === "Comercial") && (
                    <NumberField label="Pavimentos" id="editPavimentos" value={form.pavimentos} onChange={set("pavimentos")} />
                  )}

                  {/* Salas — Comercial */}
                  {type === "Comercial" && (
                    <NumberField label="Salas" id="editSalas" value={form.salas} onChange={set("salas")} />
                  )}

                  {/* Quartos — Apartamento, Casa */}
                  {(type === "Apartamento" || type === "Casa") && (
                    <NumberField label="Quartos" id="editQuartos" value={form.quartos} onChange={set("quartos")} />
                  )}

                  {/* Suítes — Apartamento, Casa */}
                  {(type === "Apartamento" || type === "Casa") && (
                    <NumberField label="Suítes" id="editSuites" value={form.suites} onChange={set("suites")} />
                  )}

                  {/* Banheiros — todos exceto Terreno */}
                  {type !== "Terreno" && (
                    <NumberField label="Banheiros" id="editBanheiros" value={form.banheiros} onChange={set("banheiros")} />
                  )}

                  {/* Sacadas — Apartamento */}
                  {type === "Apartamento" && (
                    <NumberField label="Sacadas" id="editSacadas" value={form.sacadas} onChange={set("sacadas")} />
                  )}

                  {/* Andar — Apartamento */}
                  {type === "Apartamento" && (
                    <NumberField label="Andar" id="editAndar" value={form.andar} onChange={set("andar")} />
                  )}

                  {/* Vagas — todos exceto Terreno */}
                  {type !== "Terreno" && (
                    <NumberField label="Vagas de garagem" id="editVagas" value={form.vagasGaragem} onChange={set("vagasGaragem")} />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" className="btn btn-orange" onClick={handleSave}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
