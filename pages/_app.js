import React, { useEffect, useState } from "react";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { Provider, useDispatch } from "react-redux";
import Cookie from "js-cookie";
import { PersistGate } from "redux-persist/integration/react";
import { createGlobalStyle } from "styled-components";
import 'tippy.js/dist/tippy.css';
import { register } from 'swiper/element/bundle'
register()

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'

if (typeof window !== "undefined") {
    window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js')
    require('apexcharts/dist/apexcharts.common.js')
    require("../node_modules/popper.js/dist/umd/popper.min.js")
    require("jquery");
    require("@popperjs/core")
    require("bootstrap");
    require("bootstrap/dist/css/bootstrap.min.css")
    require("bootstrap/dist/js/bootstrap.bundle")
    require("bootstrap/dist/js/bootstrap.min.js")
}

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
// You should do that in a Layout file or in `gatsby-browser.js`.
config.autoAddCss = false;

import baseUrl from "../utils/baseUrl";
import { store, persistedStore } from "../store/store";

import "../styles/globals.scss";
import "../styles/bgColors.scss";
import 'font-awesome/css/font-awesome.min.css'

import MainLayout from "../src/layouts/mainLayout";
import Login from "../src/pages/login";
import PasswordRecover from "../src/pages/login/PasswordRecovery";
import jwt from "jsonwebtoken";
import NewClient from "../src/pages/newClient/index.jsx";
import { SessionProvider } from "next-auth/react"
import { closeModal, showModal } from "../utils/modalControl.js";
import ValuationPage from "../src/pages/valuation/index.jsx";
import { SWRConfig } from "swr";
import PaymentModal from "../src/app/PaymentModal.jsx";

// import SignUp from '../src/components/signUp/SignUp'
// import PremiumAccount from '../src/components/premiumAccount/PremiumAccount'

export default function MyApp({ Component, pageProps: { session, ...pageProps} }) {

    const token = Cookie.get('auth') ? jwt.decode(Cookie.get('auth')) : false
    const router = useRouter();
    const newRoute = router.asPath;
    const premiumAccount = newRoute === "/premiumAccount";

    const newClient = newRoute.includes('/newClient');
    const valuation = newRoute.includes('/valuation')


    const [passwordRecoverRoute, setPasswordRecoverRoute] = useState(false);
    const [presentationRoute, setPresentationRoute] = useState(false);

    useEffect(() => {
        closeModal()
    }, []);


    // useEffect(() => {
    //     if (!token && !router.asPath.includes( '/accountSetup')) {

    //         // const validToken = validateToken(token)
    //         if (!token.active && !token.dateLimit) {
    //             setTimeout(() => {
    //                 showModal('paymentModal')
    //             }, 1000)
    //         }
    //     }

    // }, [token, router.asPath])





    useEffect(() => {
        hrefVerify();
    }, []);

    const hrefVerify = async () => {


        const urlSearchParams = new URLSearchParams(window.location.search);
        const queryId = urlSearchParams.get("id");
        const queryToken = urlSearchParams.get("token");
        const queryClientId = urlSearchParams.get("clientId");
        const queryUserId = urlSearchParams.get("userId");


        if (queryId && queryToken) {
            setPasswordRecoverRoute(true);
            var passwordRecoverRoute = true;
        }

        if (queryClientId && queryUserId) {
            setPresentationRoute(true);
        }

        if (!Cookie.get("auth") &&
            window.location.href !== baseUrl() &&
            !passwordRecoverRoute &&
            !newClient &&
            !valuation) {

            setTimeout(async () => {
                await Router.replace("/");
            }, 1000);

        }
    };

    const render = () => {



        if (!token && passwordRecoverRoute) {
            return <PasswordRecover />;
        }

        if (newClient && presentationRoute) {
            return (
                <Provider store={store}>
                    <PersistGate persistor={persistedStore}>

                        <Head >
                            <title>Cadastro do imóvel</title>
                            <meta property="og:title" content="Formulário de cadastro do imóvel" />
                            <meta property="og:description" content="Cadastre seu imóvel para avaliação" />
                            <meta property="og:image" content="https://res.cloudinary.com/joaoserafinadm/image/upload/v1694998829/AVALIA%20IMOBI/LOGOS/LOGO_02_wkzqga.png" />
                        </Head>


                        <NewClient />;
                    </PersistGate>
                </Provider>
            )
        }

        if (valuation && presentationRoute) {
            return (
                <Provider store={store}>
                    <PersistGate persistor={persistedStore}>

                        <Head >
                            <title>Avaliação do imóvel</title>
                            <meta property="og:title" content="Avaliação do imóvel" />
                            <meta property="og:description" content="Avaliação do seu imóvel está pronta!" />
                            <meta property="og:image" content="https://res.cloudinary.com/joaoserafinadm/image/upload/v1694998829/AVALIA%20IMOBI/LOGOS/LOGO_02_wkzqga.png" />
                        </Head>


                        <ValuationPage />
                    </PersistGate>
                </Provider>
            )
        }


        if (!token) {
            return (
                <Provider store={store}>
                    <PersistGate persistor={persistedStore}>
                        <SessionProvider>

                            <Head >
                                <title>Avalia Imobi</title>
                                <meta
                                    name="viewport"
                                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                                />
                                <link rel="icon" href="favicon.ico" />

                                <link rel="manifest" href="/manifest.json" />
                                <link rel="apple-touch-icon" href="/icon.png" />
                                <meta name="theme-color" content="#5a5a5a" />
                            </Head>

                            <Login onChange={(token) => setToken(token)} />

                        </SessionProvider>
                    </PersistGate>
                </Provider>
            );
        }



        if (token) {
            return (
                <Provider store={store}>
                    <PersistGate persistor={persistedStore}>
                        <SWRConfig
                            value={{
                                refreshInterval: 15000,
                            }}>
                            <Head >
                                <title>Avalia Imobi</title>
                                <meta
                                    name="viewport"
                                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                                />
                                <link rel="icon" href="favicon.ico" />

                                <link rel="manifest" href="/manifest.json" />
                                <link rel="apple-touch-icon" href="/icon.png" />
                                <meta name="theme-color" content="#5a5a5a" />
                            </Head>

                            <MainLayout>

                                <Component  {...pageProps} />

                                <PaymentModal />
                            </MainLayout>
                        </SWRConfig>
                    </PersistGate>
                </Provider>
            );
        }
    };

    return <div>{render()}</div>;
}
