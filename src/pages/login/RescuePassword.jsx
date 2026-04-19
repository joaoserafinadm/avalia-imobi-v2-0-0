import styles from "./Login.module.scss";
import { AiOutlineLeft } from "@react-icons/all-files/ai/AiOutlineLeft";
import { useState } from "react";
import { SpinnerSM } from "../../components/loading/Spinners";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export default function RescuePassword(props) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);

  const handleSendToken = async () => {
    if (!email || !email.includes("@")) { setEmailError("Insira um e-mail válido"); return; }
    setLoadingSend(true);
    setEmailError("");
    await axios
      .post(`${baseUrl()}/api/recoverPassword`, { email })
      .then(() => { setEmailSuccess("E-mail enviado! Verifique sua caixa de entrada."); setEmailError(""); })
      .catch((e) => { setEmailError(e.response?.data?.error || "Erro ao enviar. Tente novamente."); setEmailSuccess(""); });
    setLoadingSend(false);
  };

  return (
    <div className={`${styles.formInner} fadeItem1s`}>

      <button className={styles.backLink} onClick={() => props.setSection("signIn")}>
        <AiOutlineLeft /> Voltar para o login
      </button>

      <h1 className={styles.formTitle}>Recuperar senha</h1>
      <p className={styles.formSubtitle}>
        Informe o e-mail da sua conta e enviaremos um link para redefinir sua senha.
      </p>

      {emailSuccess ? (
        <div className="d-flex flex-column align-items-center text-center py-4 gap-3">
          <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: "3rem", color: "#21a663" }} />
          <p className="text-success fw-semibold mb-0">{emailSuccess}</p>
          <p className="text-secondary small">Verifique também a pasta de spam.</p>
          <button
            className={styles.btnPrimary}
            style={{ maxWidth: "200px" }}
            onClick={() => props.setSection("signIn")}
          >
            Voltar ao login
          </button>
        </div>
      ) : (
        <>
          <div className={styles.inputGroup}>
            <label htmlFor="rescueEmail">E-mail</label>
            <input
              type="email"
              id="rescueEmail"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSendToken()}
            />
            {emailError && <small className="text-danger">{emailError}</small>}
          </div>

          <button className={styles.btnPrimary} onClick={handleSendToken} disabled={loadingSend}>
            {loadingSend ? <SpinnerSM /> : "Enviar link de recuperação"}
          </button>
        </>
      )}

    </div>
  );
}
