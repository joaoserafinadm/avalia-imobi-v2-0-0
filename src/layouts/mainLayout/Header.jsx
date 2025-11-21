import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Header.module.scss";
import { faBell, faBuilding, faCircleRight, faGear, faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import tippy from "tippy.js";
import Notifications from "./components/Notifications";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import { useSelector } from "react-redux";
import window2Mobile from "../../../utils/window2Mobile";
import NotificationsSM from "./components/NotificationsSM";
import Alerts from "../../alerts";
import api from "../../../utils/api";
import useSWR from 'swr'
import useSWRInfinite from "swr/infinite";

export default function Header(props) {

    const dropdownRef = useRef(null);

    const router = useRouter();
    const token = jwt.decode(Cookies.get('auth'))
    const toggleStatus = useSelector(state => state.toggleStatus)

    const [notifications, setNotifications] = useState([])
    const [dropdownStatus, setDropdownStatus] = useState(true)
    const [showNotification, setShowNotification] = useState(false)


    const { data, error, isLoading } = useSWR(`/api/notifications?user_id=${token?.sub}`, api)

    useEffect(() => {
        setNotifications(data?.data?.data || [])
    }, [data])

    useEffect(() => {
        dataFunction(token.sub)
    }, [])

    useEffect(() => {
        const dropdownElement = dropdownRef.current;

        const showDropdownHandler = () => {
            setDropdownStatus(true);
        };

        const hideDropdownHandler = () => {
            setDropdownStatus(false);
        };

        dropdownElement.addEventListener('show.bs.dropdown', showDropdownHandler);
        dropdownElement.addEventListener('hide.bs.dropdown', hideDropdownHandler);

        return () => {
            dropdownElement.removeEventListener('show.bs.dropdown', showDropdownHandler);
            dropdownElement.removeEventListener('hide.bs.dropdown', hideDropdownHandler);
        };
    }, []);

    useEffect(() => {

        setTimeout(() => {

            if (!dropdownStatus) {
                handleNotificationCheck()
            }
        }, 100)


    }, [dropdownStatus])


    const hendleSession = async () => {

        Cookies.remove('auth')
        localStorage.removeItem('auth')
        await router.replace('/')
        router.reload()
    }


    const dataFunction = async (user_id) => {

        await axios.get(`${baseUrl()}/api/notifications`, {
            params: {
                user_id: user_id
            }
        })
            .then(res => {
                setNotifications(res.data.data)
            }).catch(e => {
                console.log(e)
            })

    }

    const handleShowNotifications = () => {

        const unviewedNot = notifications.filter(elem => elem.checked === false)

        return unviewedNot.length
    }

    const handleNotificationCheck = async () => {

        const newNotStatus = notifications.map(elem => {
            return { ...elem, checked: true }
        })

        setNotifications(newNotStatus)

        if (handleShowNotifications()) {

            await axios.patch(`${baseUrl()}/api/notifications`, {
                company_id: token.company_id,
                user_id: token.sub
            }).then(res => {
                dataFunction(token.sub)
            })

        }
    }



    return (
        <div className={`d-flex justify-content-center align-items-center ${styles.header}`}>


            <Alerts />

            {!toggleStatus && (
                <div className="fadeItem">
                    <Link href="/">
                        <div className='d-flex justify-content-center align-items-center ' >
                            <span type='button'>
                                <img src="/LOGO_05.png" alt="logo" className='' height={20} />
                            </span>
                        </div>
                    </Link>
                </div>
            )}


            <div className={`d-flex ${styles.configIcons}`}>

                <div className={` dropdown`} ref={dropdownRef}>
                    <span type="button" className={`px-2 cardAnimationGrow ${!!handleShowNotifications() ? 'pulse' : ''}`} role="button" data-bs-toggle={window2Mobile() ? "dropdown" : ''} aria-expanded="false" onClick={() => setShowNotification(!showNotification)}>
                        <FontAwesomeIcon icon={faBell} className={` fs-4 px-3`} style={{ color: showNotification && !window2Mobile() ? "#e8d3b9" : "#fff" }} />
                        {!!handleShowNotifications() && (
                            <div className={`${styles.notificationIcon} fadeItem`}>
                                <p className='text-light d-flex justify-content-center align-items-center'>{handleShowNotifications()}</p>
                            </div>
                        )}
                    </span>

                    {window2Mobile() ?
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownNotification">
                            <Notifications notifications={notifications} />
                        </ul>
                        :
                        <>
                            {showNotification && (

                                <NotificationsSM notifications={notifications} notificationOff={() => setShowNotification(false)} handleNotificationCheck={handleNotificationCheck} />
                            )}
                        </>

                    }

                </div>





                {/* <div className={` dropdown `}>
                    <span type="button" className="" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <FontAwesomeIcon icon={faGear} className="text-light icon px-3 me-2" />
                    </span>

                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1" >
                        <small >
                            <li className='mb-1 '>
                                <Link href={`/editProfile/${token.sub}`}>
                                    <span className="dropdown-item text-gray-dark" >
                                        <FontAwesomeIcon icon={faUser} className="me-1 icon" /> Editar perfil
                                    </span>
                                </Link>
                            </li>
                            <li className='my-1'>
                                <Link href="/passwordChange">
                                    <span className="dropdown-item text-gray-dark" >
                                        <FontAwesomeIcon icon={faKey} className="me-1 icon" /> Alterar senha
                                    </span>
                                </Link>
                            </li>
                            <li className='my-1'>
                                <Link href="/companyEdit">
                                    <span className="dropdown-item text-gray-dark" >
                                        <FontAwesomeIcon icon={faBuilding} className="me-1 icon" /> Editar instituição
                                    </span>
                                </Link>
                            </li>
                            <li className='my-1'><hr className='dropdown-divider' /></li>
                            <li className='mt-1'>
                                <a className="dropdown-item text-gray-dark" type='button' onClick={() => hendleSession()}>
                                    <FontAwesomeIcon icon={faCircleRight} className="me-1 icon" /> Sair
                                </a>
                            </li>
                        </small>
                    </ul>
                </div> */}
            </div>
        </div>
    );
}
