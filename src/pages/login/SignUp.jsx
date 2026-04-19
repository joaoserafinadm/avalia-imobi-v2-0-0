import styles from "./Login.module.scss";
import { AiOutlineLeft } from "@react-icons/all-files/ai/AiOutlineLeft";
import { useState } from "react";
import removeInputError from "../../../utils/removeInputError";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import { useRouter } from "next/router";
import PolicyModal from "./PolicyModal";
import AuthModal from "./AuthModal";
import { SpinnerSM } from "../../components/loading/Spinners";
import SignUpSuccessModal from "./SignUpSuccessModal";
import { signIn } from "next-auth/react";

export default function SignUp(props) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authCode, setAuthCode] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [signUpError, setSignUpError] = useState("");

  const [signUpLoading, setSignUpLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const validate = () => {
    removeInputError();
    const fnErr = !firstName ? "Insira seu nome" : "";
    const lnErr = !lastName ? "Insira seu sobrenome" : "";
    const emErr = !email || !email.includes("@") ? "Insira um e-mail válido" : "";
    const pwErr = password.length < 6 ? "Mínimo 6 caracteres" : "";
    setFirstNameError(fnErr);
    setLastNameError(lnErr);
    setEmailError(emErr);
    setPasswordError(pwErr);
    return !fnErr && !lnErr && !emErr && !pwErr;
  };

  const validateCode = async (authCode, code) => {
    return new Promise(async (resolve) => {
      setAuthError("");
      if (!authCode || !code) { setAuthError("Insira o código de autenticação"); resolve(false); return; }
      await axios
        .post(`${baseUrl()}/api/login/authCode`, { authCode, code })
        .then(() => resolve(true))
        .catch(() => { setAuthError("Código de autenticação errado"); resolve(false); });
    });
  };

  const handleSignUp = async (code) => {
    setSignUpLoading(true);
    const isValid = await validateCode(authCode, code);
    if (isValid) {
      await axios
        .post(`${baseUrl()}/api/login/signUp`, { firstName, lastName, email, password })
        .then(() => {
          var myModal = new bootstrap.Modal(document.getElementById("signUpSuccessModal"));
          myModal.show();
        })
        .catch(() => setSignUpError("Houve um problema no cadastro. Por favor, tente novamente."));
    } else {
      var myModal = new bootstrap.Modal(document.getElementById("authModal"));
      myModal.show();
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setSignUpLoading(true);
    if (!validate()) { setSignUpLoading(false); return; }

    await axios
      .post(`${baseUrl()}/api/login/authMail`, { email, firstName })
      .then((res) => {
        setAuthCode(res.data.secureCode);
        var myModal = new bootstrap.Modal(document.getElementById("authModal"));
        myModal.show();
      })
      .catch(() => { setSignUpLoading(false); setEmailError("E-mail já cadastrado."); });
  };

  return (
    <div className={`${styles.formInner} fadeItem1s`}>

      <button className={styles.backLink} onClick={() => props.setSection("signIn")}>
        <AiOutlineLeft /> Voltar para o login
      </button>

      <h1 className={styles.formTitle}>Crie sua conta</h1>
      <p className={styles.formSubtitle}>Rápido, fácil e 7 dias grátis para testar.</p>

      <form onSubmit={handleAuth}>

        <div className="d-flex gap-2">
          <div className={`${styles.inputGroup} flex-fill`}>
            <label htmlFor="firstNameInput">Nome</label>
            <input
              type="text"
              id="firstNameInput"
              className={`form-control ${firstNameError ? "is-invalid" : ""}`}
              placeholder="João"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setFirstNameError(""); }}
            />
            {firstNameError && <small className="text-danger">{firstNameError}</small>}
          </div>
          <div className={`${styles.inputGroup} flex-fill`}>
            <label htmlFor="lastNameInput">Sobrenome</label>
            <input
              type="text"
              id="lastNameInput"
              className={`form-control ${lastNameError ? "is-invalid" : ""}`}
              placeholder="Silva"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); setLastNameError(""); }}
            />
            {lastNameError && <small className="text-danger">{lastNameError}</small>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="emailInput">E-mail</label>
          <input
            type="email"
            id="emailInput"
            className={`form-control ${emailError ? "is-invalid" : ""}`}
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
          />
          {emailError && <small className="text-danger">{emailError}</small>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="passwordInput">Senha</label>
          <input
            type="password"
            id="passwordInput"
            className={`form-control ${passwordError ? "is-invalid" : ""}`}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
          />
          {passwordError && <small className="text-danger">{passwordError}</small>}
        </div>

        <p className="text-muted mb-3" style={{ fontSize: "0.78rem" }}>
          Ao clicar em Cadastrar, você concorda com nossos{" "}
          <button
            type="button"
            className={styles.linkOrange}
            style={{ fontSize: "0.78rem" }}
            data-bs-toggle="modal"
            data-bs-target="#policyModal"
          >
            Termos e Política de Privacidade
          </button>.
        </p>

        {signUpError && <p className="small text-danger mb-2">{signUpError}</p>}

        <button type="submit" className={styles.btnPrimary} disabled={signUpLoading}>
          {signUpLoading ? <SpinnerSM /> : "Cadastrar"}
        </button>
      </form>

      <div className={styles.divider}>ou</div>

      <button
        type="button"
        className={styles.btnGoogle}
        disabled={loadingGoogle}
        onClick={() => { setLoadingGoogle(true); signIn("google"); }}
      >
        <img src="/ICON_GOOGLE.png" alt="Google" />
        Continuar com Google
      </button>

      <PolicyModal />
      <AuthModal
        authCode={authCode}
        firstName={firstName}
        lastName={lastName}
        email={email}
        password={password}
        authError={authError}
        setAuthError={setAuthError}
        setAuthCode={setAuthCode}
        setSignUpLoading={setSignUpLoading}
        handleSignUp={handleSignUp}
        singUpLoading={signUpLoading}
      />
      <SignUpSuccessModal setSection={props.setSection} />

    </div>
  );
}
