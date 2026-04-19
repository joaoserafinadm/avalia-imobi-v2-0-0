import PolicyText from "./PolicyText";

export default function PolicyModal() {
  return (
    <div
      className="modal fade"
      id="policyModal"
      tabIndex="-1"
      aria-labelledby="policyModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16, overflow: "hidden" }}>

          <div className="modal-header border-bottom px-4 py-3" style={{ background: "#182538" }}>
            <h5 className="modal-title fw-bold mb-0" id="policyModalLabel" style={{ color: "#fff", fontSize: "1.05rem" }}>
              Termos de Uso, Política de Dados e Privacidade
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body px-4 py-4" style={{ fontSize: "0.9rem", color: "#495057", lineHeight: 1.75 }}>
            <PolicyText />
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-0">
            <button
              type="button"
              className="btn btn-secondary px-4"
              style={{ borderRadius: 8 }}
              data-bs-dismiss="modal"
            >
              Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
