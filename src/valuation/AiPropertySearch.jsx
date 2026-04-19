import { useState, useRef } from "react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import { SpinnerSM } from "../components/loading/Spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faExternalLinkAlt, faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { maskMoney } from "../../utils/mask";
import styles from "./AiPropertySearch.module.scss";

export default function AiPropertySearch(props) {
  const { client, propertyArray, setPropertyArray, setForceUpdate } = props;

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [manualPrices, setManualPrices] = useState({});
  const [manualAreas, setManualAreas] = useState({});
  const [missingFields, setMissingFields] = useState(new Set());
  const [error, setError] = useState("");
  const closeRef = useRef(null);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    setSelected([]);
    setManualPrices({});
    setManualAreas({});
    setMissingFields(new Set());

    try {
      const res = await axios.post(`${baseUrl()}/api/valuation/aiPropertySearch`, { client });
      const properties = res.data.properties || [];
      setResults(properties);
      if (!properties.length) {
        setError("Nenhum imóvel semelhante encontrado. Tente adicionar manualmente.");
      }
    } catch (e) {
      setError(
        e.response?.data?.error ||
          "Erro ao buscar imóveis. Verifique se ANTHROPIC_API_KEY está configurado no .env.local."
      );
    }

    setLoading(false);
  };

  const handleOpenModal = () => {
    if (!results.length && !loading) {
      handleSearch();
    }
  };

  const toggleSelect = (index) => {
    setMissingFields(new Set());
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getPrice = (index) =>
    manualPrices[index] !== undefined ? manualPrices[index] : results[index]?.propertyPrice || "";

  const getArea = (index) =>
    manualAreas[index] !== undefined ? manualAreas[index] : results[index]?.areaTotal || "";

  const handlePriceChange = (index, value) => {
    const masked = maskMoney(value);
    setManualPrices((prev) => ({ ...prev, [index]: masked }));
    if (masked) clearMissing(index);
  };

  const handleAreaChange = (index, value) => {
    const numeric = value.replace(/\D/g, "");
    setManualAreas((prev) => ({ ...prev, [index]: numeric }));
    if (numeric) clearMissing(index);
  };

  const clearMissing = (index) => {
    setMissingFields((prev) => {
      const next = new Set(prev);
      if (getPrice(index) && getArea(index)) next.delete(index);
      return next;
    });
  };

  const handleAddSelected = () => {
    const missing = new Set(selected.filter((i) => !getPrice(i) || !getArea(i)));
    if (missing.size > 0) {
      setMissingFields(missing);
      return;
    }

    const newPropertyArray = [...propertyArray];

    for (const index of selected) {
      const property = results[index];
      const price = getPrice(index);
      const area = getArea(index);

      newPropertyArray.push({
        propertyName: property.propertyName || "",
        propertyPrice: price.replace(/[^\d]/g, ""),
        propertyType: client.propertyType,
        propertyLink: property.propertyLink || "",
        imageUrl: property.imageUrl || "",
        areaTotal: area,
        areaTotalPrivativa: property.areaTotalPrivativa || "",
        quartos: property.quartos || "",
        suites: "",
        banheiros: property.banheiros || "",
        sacadas: "",
        andar: "",
        vagasGaragem: property.vagasGaragem || "",
        terrenoIrregular: false,
        largura: "",
        comprimento: "",
        frente: "",
        fundos: "",
        lateralEsquerda: "",
        lateralDireita: "",
        pavimentos: "",
        salas: "",
        cidade: property.cidade || client.cidade || "",
        uf: property.uf || client.uf || "",
        logradouro: "",
        bairro: property.bairro || client.bairro || "",
        latitude: "",
        longitude: "",
        dateAdded: new Date(),
      });
    }

    setPropertyArray(newPropertyArray);
    setForceUpdate();
    setSelected([]);
    setMissingFields(new Set());

    closeRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        className="action-button-modern-fill"
        data-bs-toggle="modal"
        data-bs-target="#aiPropertySearchModal"
        onClick={handleOpenModal}
      >
        <FontAwesomeIcon icon={faRobot} className="me-2" />
        Buscar com IA
      </button>

      <div
        className="modal fade"
        id="aiPropertySearchModal"
        tabIndex="-1"
        aria-labelledby="aiPropertySearchModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title title-dark bold" id="aiPropertySearchModalLabel">
                <FontAwesomeIcon icon={faRobot} className="me-2" />
                Imóveis semelhantes — Busca com IA
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              <button ref={closeRef} type="button" data-bs-dismiss="modal" style={{ display: "none" }} />
            </div>

            <div className="modal-body">
              {loading && (
                <div className="d-flex flex-column align-items-center justify-content-center py-5">
                  <SpinnerSM />
                  <p className={`mt-3 text-secondary ${styles.searchingText}`}>
                    Buscando imóveis semelhantes na internet...
                  </p>
                </div>
              )}

              {error && !loading && <div className="alert alert-danger mb-3">{error}</div>}

              {!loading && results.length > 0 && (
                <>
                  <p className="text-secondary small mb-3">
                    Selecione os imóveis que fazem sentido para a comparação e clique em{" "}
                    <strong>Adicionar selecionados</strong>. Campos marcados com{" "}
                    <span className="text-danger fw-bold">*</span> são obrigatórios.
                  </p>
                  <div className="row">
                    {results.map((property, index) => {
                      const isSelected = selected.includes(index);
                      const isMissing = missingFields.has(index);
                      const price = getPrice(index);
                      const area = getArea(index);
                      const hasAutoPrice = !!property.propertyPrice;
                      const hasAutoArea = !!property.areaTotal;

                      return (
                        <div key={index} className="col-12 col-sm-6 col-lg-4 mb-3">
                          <div
                            className={`card h-100 ${styles.propertyCard} ${isSelected ? styles.selected : ""} ${isMissing ? styles.missingPrice : ""}`}
                            onClick={() => toggleSelect(index)}
                            style={{ cursor: "pointer" }}
                          >
                            {isSelected && (
                              <div className={styles.checkBadge}>
                                <FontAwesomeIcon icon={faCheck} />
                              </div>
                            )}

                            {property.imageUrl ? (
                              <img
                                src={property.imageUrl}
                                className="card-img-top"
                                style={{ height: "170px", objectFit: "cover" }}
                                alt={property.propertyName}
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            ) : (
                              <div
                                className="card-img-top d-flex justify-content-center align-items-center bg-light bg-gradient"
                                style={{ height: "170px" }}
                              >
                                <span className="text-secondary small">Sem imagem</span>
                              </div>
                            )}

                            <div className="card-body d-flex flex-column">
                              <h6 className="card-title small fw-bold mb-2">{property.propertyName}</h6>

                              {/* Preço */}
                              {hasAutoPrice ? (
                                <p className="mb-2 fw-bold" style={{ color: "var(--ai-primary)" }}>
                                  R$ {Number(property.propertyPrice).toLocaleString("pt-BR")}
                                </p>
                              ) : (
                                <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                                  <label className={`form-label small mb-1 ${isMissing && !price ? "text-danger fw-bold" : "text-secondary"}`}>
                                    Valor *
                                  </label>
                                  <div className="input-group input-group-sm">
                                    <span className="input-group-text">R$</span>
                                    <input
                                      type="text"
                                      className={`form-control ${isMissing && !price ? "border-danger" : ""}`}
                                      placeholder="0"
                                      value={manualPrices[index] || ""}
                                      onChange={(e) => handlePriceChange(index, e.target.value)}
                                    />
                                    <span className="input-group-text">,00</span>
                                  </div>
                                </div>
                              )}

                              {/* Área */}
                              {hasAutoArea ? (
                                <div className="small text-secondary mb-1">
                                  <span className="me-2 fw-semibold">{property.areaTotal}m²</span>
                                  {property.quartos && <span className="me-2">{property.quartos} qts</span>}
                                  {property.banheiros && <span className="me-2">{property.banheiros} bnh</span>}
                                  {property.vagasGaragem && <span>{property.vagasGaragem} vaga(s)</span>}
                                </div>
                              ) : (
                                <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                                  <label className={`form-label small mb-1 ${isMissing && !area ? "text-danger fw-bold" : "text-secondary"}`}>
                                    Área total *
                                  </label>
                                  <div className="input-group input-group-sm">
                                    <input
                                      type="number"
                                      min="0"
                                      className={`form-control ${isMissing && !area ? "border-danger" : ""}`}
                                      placeholder="0"
                                      value={manualAreas[index] || ""}
                                      onChange={(e) => handleAreaChange(index, e.target.value)}
                                    />
                                    <span className="input-group-text">m²</span>
                                  </div>
                                </div>
                              )}

                              {!hasAutoArea && (
                                <div className="small text-secondary mb-1">
                                  {property.quartos && <span className="me-2">{property.quartos} qts</span>}
                                  {property.banheiros && <span className="me-2">{property.banheiros} bnh</span>}
                                  {property.vagasGaragem && <span>{property.vagasGaragem} vaga(s)</span>}
                                </div>
                              )}

                              {(property.bairro || property.cidade) && (
                                <p className="small text-secondary mb-2">
                                  {[property.bairro, property.cidade, property.uf].filter(Boolean).join(", ")}
                                </p>
                              )}

                              <div className="mt-auto">
                                {property.propertyLink && (
                                  <a
                                    href={property.propertyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <FontAwesomeIcon icon={faExternalLinkAlt} className="me-1" />
                                    Ver anúncio
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                {!loading && results.length > 0 && (
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faSearch} className="me-2" />
                    Buscar novamente
                  </button>
                )}
              </div>
              <div className="d-flex flex-column align-items-end gap-1">
                {missingFields.size > 0 && (
                  <small className="text-danger">
                    Preencha o valor e a área dos imóveis selecionados marcados em vermelho.
                  </small>
                )}
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Fechar
                  </button>
                  {!loading && results.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-orange"
                      onClick={handleAddSelected}
                      disabled={selected.length === 0}
                    >
                      Adicionar selecionados ({selected.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
