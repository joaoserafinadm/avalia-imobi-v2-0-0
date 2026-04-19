import { useState, useRef } from "react";
import { SpinnerSM } from "../../components/loading/Spinners";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import styles from "./Login.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";

const DIGITS = 6;

export default function AuthModal(props) {
  const [digits, setDigits] = useState(Array(DIGITS).fill(""));
  const [resendEmailError, setResendEmailError] = useState("");
  const [resendEmailCheck, setResendEmailCheck] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const refs = useRef([]);

  const code = digits.join("");

  const resendEmail = async (email, firstName) => {
    setLoadingEmail(true);
    cleanStatus();
    await axios
      .post(`${baseUrl()}/api/login/authMail`, { email, firstName })
      .then((res) => {
        props.setAuthCode(res.data.secureCode);
        setResendEmailCheck("Novo código enviado! Verifique seu e-mail.");
        setLoadingEmail(false);
      })
      .catch(() => {
        setResendEmailError("Verifique seus dados de cadastro.");
        setLoadingEmail(false);
      });
  };

  const cleanStatus = () => {
    setDigits(Array(DIGITS).fill(""));
    setResendEmailError("");
    setResendEmailCheck("");
    props.setAuthError("");
    props.setSignUpLoading(false);
  };

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < DIGITS - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < DIGITS - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGITS);
    const next = Array(DIGITS).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIndex = Math.min(pasted.length, DIGITS - 1);
    refs.current[focusIndex]?.focus();
  };

  const boxStyle = (filled) => ({
    width: 44,
    height: 52,
    borderRadius: 10,
    border: `2px solid ${filled ? "#f5874f" : "#dee2e6"}`,
    fontSize: "1.4rem",
    fontWeight: 700,
    textAlign: "center",
    color: "#182538",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    caretColor: "transparent",
    background: filled ? "rgba(245,135,79,0.05)" : "#fff",
  });

  return (
    <div
      className="modal fade"
      id="authModal"
      tabIndex="-1"
      aria-labelledby="authModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16, overflow: "hidden" }}>

          <div className="modal-header border-0 pb-0 pt-4 px-4">
            <button
              type="button"
              className="btn-close ms-auto"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={cleanStatus}
            />
          </div>

          <div className="modal-body px-4 pt-2 pb-4 text-center">

            <div
              className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
              style={{ width: 64, height: 64, background: "rgba(245,135,79,0.12)" }}
            >
              <FontAwesomeIcon icon={faEnvelopeOpenText} style={{ fontSize: "1.7rem", color: "#f5874f" }} />
            </div>

            <h5 className="fw-bold mb-1" style={{ color: "#182538" }}>Verifique seu e-mail</h5>
            <p className="text-secondary small mb-4">
              Enviamos um código de verificação para <strong>{props.email}</strong>.<br />
              Insira-o abaixo para continuar.
            </p>

            {/* OTP boxes */}
            <div className="d-flex justify-content-center gap-2" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (refs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  style={boxStyle(!!digit)}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>

            <div className="mt-3" style={{ minHeight: 20 }}>
              {resendEmailError && <small className="text-danger">{resendEmailError}</small>}
              {props.authError && !resendEmailError && <small className="text-danger">{props.authError}</small>}
              {resendEmailCheck && !resendEmailError && !props.authError && (
                <small className="text-success">{resendEmailCheck}</small>
              )}
            </div>

            <div className="mt-3">
              {loadingEmail ? (
                <span className="small text-secondary"><SpinnerSM /> Enviando...</span>
              ) : (
                <button
                  className={styles.linkOrange}
                  style={{ fontSize: "0.85rem" }}
                  onClick={() => resendEmail(props.email, props.firstName)}
                >
                  Reenviar código
                </button>
              )}
            </div>
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-0 gap-2">
            <button
              type="button"
              className="btn btn-secondary flex-fill"
              style={{ borderRadius: 8 }}
              data-bs-dismiss="modal"
              onClick={cleanStatus}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn flex-fill fw-semibold text-white"
              style={{ borderRadius: 8, background: "#f5874f", border: "none", opacity: code.length === DIGITS ? 1 : 0.5 }}
              data-bs-dismiss="modal"
              disabled={code.length < DIGITS}
              onClick={() => props.handleSignUp(code)}
            >
              Confirmar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
