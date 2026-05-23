import styles from "./Login.module.scss";
import { useState } from "react";
import SignIn from "./SignIn";
import RescuePassword from "./RescuePassword";
import SignUp from "./SignUp";
import AuthModal from "./AuthModal";

export default function Login() {
  const [section, setSection] = useState("signIn");

  return (
    <div className={styles.page}>

      {/* Painel de marca — oculto no mobile via CSS */}
      {section === "signUp" ?

        <div className={`fadeItem ${styles.brandPanel}`}>
          <img src="/LOGO_05.png" alt="Avalia Imobi" className={styles.brandLogo} />
          <p className={styles.brandTagline}>
            Avalie imóveis com{" "}
            <span className={styles.brandHighlight}>inteligência</span> e
            gere laudos profissionais em minutos.
          </p>
          <span className={styles.trialBadge}>7 dias grátis</span>
        </div>
        :
        <div className={`fadeItem ${styles.brandPanel}`}>

          <img src="/LOGO_07.png" alt="Avalia Imobi" className={styles.brandLogo} />

        </div>

      }

      {/* Painel de formulário */}
      <div className={styles.formPanel}>
        {section === "signIn" && (
          <SignIn setSection={setSection} />
        )}
        {section === "rescuePassword" && (
          <RescuePassword setSection={setSection} />
        )}
        {section === "signUp" && (
          <SignUp setSection={setSection} />
        )}
      </div>

    </div>
  );
}
