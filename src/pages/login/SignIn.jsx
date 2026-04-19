import styles from "./Login.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import removeInputError from "../../../utils/removeInputError";
import baseUrl from "../../../utils/baseUrl";
import { useRouter } from "next/router";
import { SpinnerSM } from "../../components/loading/Spinners";
import Cookies from "js-cookie";
import { signIn, signOut, useSession } from "next-auth/react";
import { AiOutlineLeft } from "@react-icons/all-files/ai/AiOutlineLeft";

function isInWebView() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return /Instagram|FBAN|FBAV/.test(ua);
}

export default function SignInPage(props) {
  const router = useRouter();
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isWebView, setIsWebView] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [googleAuthError, setGoogleAuthError] = useState(false);

  useEffect(() => {
    setIsWebView(isInWebView());
    if (session) handleGoogleLogin(session);
  }, [session]);

  const handleGoogleLogin = async (session) => {
    setLoadingGoogle(true);
    await axios
      .post(`/api/login/google`, session)
      .then(async () => { await signOut(); router.push("/"); })
      .catch(() => { setGoogleAuthError(true); setLoadingGoogle(false); });
  };

  const validate = () => {
    removeInputError();
    const emailErr = !email || !email.includes("@") ? "Insira um e-mail válido" : "";
    const passErr = !password ? "Insira sua senha" : "";
    setEmailError(emailErr);
    setPasswordError(passErr);
    return !emailErr && !passErr;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInLoading(true);
    if (!validate()) { setSignInLoading(false); return; }

    await axios
      .post(`${baseUrl()}/api/login/signIn`, { email, password })
      .then(() => { localStorage.setItem("auth", Cookies.get("auth")); router.reload(); })
      .catch(() => { setPasswordError("E-mail ou senha incorretos"); setSignInLoading(false); });
  };

  return (
    <div className={`${styles.formInner} fadeItem1s`}>
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-center">
          <img src="/LOGO_01.png" alt="Avalia Imobi" style={{height: "75px"}} />

        </div>
      </div>

      <h1 className={styles.formTitle}>Bem-vindo de volta</h1>
      <p className={styles.formSubtitle}>
        Não possui conta?{" "}
        <button className={styles.linkOrange} onClick={() => props.setSection("signUp")}>
          Cadastre-se grátis
        </button>
      </p>

      <form onSubmit={handleSignIn}>

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
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
          />
          {passwordError && <small className="text-danger">{passwordError}</small>}
        </div>

        <div className="d-flex justify-content-end mb-3">
          <button
            type="button"
            className={styles.linkOrange}
            style={{ fontSize: "0.85rem" }}
            onClick={() => props.setSection("rescuePassword")}
          >
            Esqueceu a senha?
          </button>
        </div>

        <button type="submit" className={styles.btnPrimary} disabled={signInLoading || loadingGoogle}>
          {signInLoading ? <SpinnerSM /> : "Entrar"}
        </button>
      </form>

      <div className={styles.divider}>ou</div>

      <button
        type="button"
        className={styles.btnGoogle}
        disabled={loadingGoogle || isWebView}
        onClick={() => { setLoadingGoogle(true); signIn("google"); }}
      >
        <img src="/ICON_GOOGLE.png" alt="Google" />
        Continuar com Google
        {loadingGoogle && <SpinnerSM className="ms-1" />}
      </button>

      {isWebView && (
        <p className="small text-secondary mt-2 text-center mb-0">
          Login com Google não suportado aqui. Abra no <strong>Chrome</strong> ou <strong>Safari</strong>.
        </p>
      )}

      {googleAuthError && (
        <p className="small text-danger mt-2 text-center mb-0">
          Nenhuma conta com esse e-mail.{" "}
          <button className={styles.linkOrange} onClick={() => { props.setSection("signUp"); setGoogleAuthError(false); }}>
            Cadastre-se
          </button>
        </p>
      )}

    </div>
  );
}
