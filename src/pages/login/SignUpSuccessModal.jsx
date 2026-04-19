import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export default function SignUpSuccessModal(props) {
  const router = useRouter();

  return (
    <div
      className="modal fade"
      id="signUpSuccessModal"
      tabIndex="-1"
      aria-labelledby="signUpSuccessModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16, overflow: "hidden" }}>

          <div className="modal-header border-0 pb-0 pt-4 px-4">
            <button
              type="button"
              className="btn-close ms-auto"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body px-4 pt-2 pb-4 text-center">

            <FontAwesomeIcon
              icon={faCircleCheck}
              style={{ fontSize: "3.5rem", color: "#21a663" }}
              className="mb-3"
            />

            <h5 className="fw-bold mb-1" style={{ color: "#182538" }}>Cadastro realizado!</h5>
            <p className="text-secondary small mb-0">
              Sua conta foi criada com sucesso. Clique em <strong>Entrar</strong> para começar a usar o Avalia Imobi.
            </p>

          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-0">
            <button
              type="button"
              className="btn w-100 fw-semibold text-white"
              style={{ borderRadius: 8, background: "#f5874f", border: "none", padding: "0.72rem" }}
              data-bs-dismiss="modal"
              onClick={() => router.reload()}
            >
              Entrar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
