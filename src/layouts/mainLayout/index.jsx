import Head from "next/head";
//import styles from '../styles/Home.module.css'
import Logo from "./components/Logo";
import Header from "./Header";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleBarOff, toggleBarOn } from "../../../store/ToggleBarStatus/ToggleBarStatus.action";
import window2Mobile from "../../../utils/window2Mobile";
import { closeModal, showModal } from "../../../utils/modalControl";
import MenuBar from "../../components/menuBar";
import Background from "./Background";
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken'
import useSWR from 'swr'
import api from "../../../utils/api";
import DateLimitModal from "./components/dateLimitModal";
import { useRouter } from "next/router";


export default function MainLayout({ children }) {

    const token = jwt.decode(Cookie.get('auth'))

    const router = useRouter()


    const { data, error, isLoading } = useSWR(
        `/api/token/tokenUpdate?company_id=${token?.company_id}&user_id=${token?.sub}`,
        api
        // {
        //     // refreshInterval: 5000, // 5000ms = 5 segundos
        //     refreshInterval: 1000 * 60 * 5, // 5000ms = 5 segundos
        // }
    );


    useEffect(() => {

        console.log("data", router)

        if (data && !data?.data?.active && router.pathname !== '/accountSetup') {

            const modal = document.getElementById('dateLimitModal')

            if (data.data?.errorStatus === 1 && !modal.classList.contains('show')) {
                showModal('dateLimitModal')
            }
            if (data.data?.errorStatus === 2 && !modal.classList.contains('show')) {
                showModal('dateLimitModal')
            }
        }

        if (error) {
            Cookie.remove('auth')
            localStorage.removeItem('auth')
            router.replace('/')
            router.reload()
        }

    }, [data, error])






    const toggleStatus = useSelector(state => state.toggleStatus)

    const dispatch = useDispatch()

    useEffect(() => {
        if (window2Mobile()) dispatch(toggleBarOn())
        else dispatch(toggleBarOff())
    }, [])

    useEffect(() => {
        handleSidebarToggle()
    }, [toggleStatus])

    const handleSidebarToggle = () => {
        const fixedWidht = document.documentElement.style.getPropertyValue('--aside-fixed-width')
        if (toggleStatus && window2Mobile()) {
            document.documentElement.style.setProperty('--aside-width', '250px')
        }
        else {

            document.documentElement.style.setProperty('--aside-width', '0px')
        }
    }



    return (
        <body className="app" id="appBody" >
            <Header navbarStatus={toggleStatus} />
            <Navbar />

            <Background >
                <div className={`  pages`} >
                    {children}
                </div>

            </Background>

            <MenuBar />


            <DateLimitModal />


        </body>
    );
}
