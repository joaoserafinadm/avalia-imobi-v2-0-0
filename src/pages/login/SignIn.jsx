import Head from "next/head";
import styles from "./Login.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import removeInputError from "../../../utils/removeInputError";
import baseUrl from "../../../utils/baseUrl";
import router, { useRouter } from "next/router";
import { SpinnerSM } from "../../components/loading/Spinners";
import Cookies from "js-cookie";
import { signIn, signOut, useSession } from 'next-auth/react'

export default function signInPage(props) {

    const router = useRouter()


    const { data: session } = useSession()

    
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    //RENDER
    const [loadedImages, setLoadedImages] = useState(0);
    const [singInLoading, setSignInLoading] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    
    //ERROR
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [googleAuthError, setGoogleAuthError] = useState(false);
    
    
    useEffect(() => {
        if (session) {
            // console.log("session", session)
            handleGoogleLogin(session)
        }

    }, [session])

    const handleGoogleLogin = async (session) => {
        setLoadingGoogle(true)


        await axios.post(`/api/login/google`, session)
            .then(async res => {
                await signOut()
                router.push('/')
                setLoadingGoogle(false)
            }).catch(e => {
                setGoogleAuthError(true)
                setLoadingGoogle(false)
            })
        setLoadingGoogle(true)


    }

    const validate = () => {
        removeInputError();
        clearErrors();

        let emailError = "";
        let passwordError = "";

        if (!email || !email.includes("@")) emailError = "Insira um e-mail válido";
        if (!password) passwordError = "Insira sua senha";

        if (emailError || passwordError) {
            if (emailError) {
                document.getElementById("emailInput").classList.add("inputError");
                setEmailError(emailError);
            }
            if (passwordError) {
                document.getElementById("passwordInput").classList.add("inputError");
                setPasswordError(passwordError);
            }
            return false;
        } else {
            setEmailError("");
            setPasswordError("");
            return true;
        }
    };

    const clearErrors = () => {
        setEmailError("");
        setPasswordError("");
    };

    const handleEmailAuth = () => {
        const isValid = validate();

        if (isValid) {
            const data = {};
        }
    };

    const handleSignIn = async (e) => {

        e.preventDefault()

        setSignInLoading(true);

        const isValid = validate();

        if (isValid) {
            const data = {
                email,
                password,
            };

            await axios
                .post(`${baseUrl()}/api/login/signIn`, data)
                .then((res) => {

                    localStorage.setItem("auth", Cookies.get("auth"));
                    const localToken = localStorage.getItem("auth");

                    router.reload();

                })
                .catch((e) => {
                    setPasswordError("E-mail ou senha incorretos");
                    setSignInLoading(false);

                });
        } else {
            setSignInLoading(false);
        }
    };

    return (
        <>
            <div className="row fadeItem1s "
                style={{ height: "100%" }}>
                <div className="col-12 d-flex justify-content-evenly">



                    {window.innerWidth > 990 && (
                        <div className=" d-flex justify-content-center align-items-center">
                            <img
                                src="/LOGO_05.png"
                                alt=""
                                className={`${styles.logoImg}`}
                                onLoad={() => setLoadedImages(loadedImages + 1)}
                            />
                        </div>
                    )}

                    <div className=" d-flex justify-content-center align-items-center">

                        <div>

                            <div className={`card `} style={{ maxWidth: "450px" }}>
                                <div className={`card-body ${styles.cardSize} `}>
                                    <div className="row mb-3">
                                        <h1 className={`${styles.title} title-dark`}>Login</h1>
                                    </div>
                                    <div className="row">
                                        <div className="col-12  d-flex justify-content-start">
                                            <span>Não possui uma conta?</span>
                                        </div>
                                        <div className="col-12  d-flex justify-content-start">
                                            <span
                                                className="span"
                                                type="button"
                                                onClick={() => {
                                                    props.setSection("signUp");
                                                }}
                                            >
                                                Cadastre-se
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <form onSubmit={e => handleSignIn(e)}>

                                        <div className="row mt-3 mb-3">
                                            <input
                                                type="email"
                                                id="emailInput"
                                                className="form-control"
                                                placeholder="E-mail"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <span className="small text-danger fadeItem">{emailError}</span>
                                        </div>
                                        <div className="row mb-3">
                                            <input
                                                type="password"
                                                id="passwordInput"
                                                className="form-control"
                                                placeholder="Senha"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <span className="small text-danger fadeItem">
                                                {passwordError}
                                            </span>
                                        </div>
                                        <div className="row mb-3">
                                            {singInLoading ? (
                                                <button
                                                    disabled
                                                    className="btn btn-orange"
                                                    onClick={() => handleSignIn()}
                                                >
                                                    <SpinnerSM />
                                                </button>
                                            ) : (
                                                <button className="btn btn-outline-orange" disabled={loadingGoogle} type="submit">
                                                    Entrar
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                    <div className="row mb-1">
                                        <small>
                                            <span
                                                className="span"
                                                type="button"
                                                onClick={() => props.setSection("rescuePassword")}
                                            >
                                                Esqueceu a senha?
                                            </span>
                                        </small>
                                    </div>
                                    <div className="row d-flex">
                                        <div className="col">
                                            <hr />
                                        </div>
                                        <div className="col-1 d-flex justify-content-center align-items-center">
                                            <span>
                                                <small>Ou</small>
                                            </span>
                                        </div>
                                        <div className="col">
                                            <hr />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <button className="btn btn-outline-secondary" disabled={loadingGoogle} onClick={() => { setLoadingGoogle(true); signIn('google') }}>
                                            <div className="row ">
                                                <div className="col-12 d-flex text-center justify-content-center align-items-center">
                                                    {/* <div className="icon-start"> */}
                                                    <img
                                                        src="/ICON_GOOGLE.png"
                                                        alt=""
                                                        className="socialIcon me-2"
                                                    />
                                                    {/* </div> */}
                                                    <div>
                                                        <span className="text-center" >Continuar com o Google</span>
                                                    </div>
                                                    {loadingGoogle && (
                                                        <SpinnerSM className="ms-1" />

                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                        {googleAuthError && (

                                            <div className="col-12 fadeItem">
                                                <p className="small text-danger">Não existe uma conta cadastrada com esse e-mail. Clique <span className="span" type="button" onClick={() => { props.setSection("signUp"); setGoogleAuthError(false) }}>aqui</span> para se cadastrar.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
}
