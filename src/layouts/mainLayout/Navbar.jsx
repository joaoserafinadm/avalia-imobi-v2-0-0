import { useState, useContext } from "react";
import Logo from "./components/Logo";
import Toggle from "./components/Toggle";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import Scrollbars from "react-custom-scrollbars-2";
import { Accordion } from "react-bootstrap";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import { AccordionContext } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleRight,
    faBook,
    faCommentAlt,
    faGear,
    faHome,
    faHouseUser,
    faShop,
    faUser,
    faUserGear,
    faUserTie,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import window2Mobile from "../../../utils/window2Mobile";
import { toggleBarChange } from "../../../store/ToggleBarStatus/ToggleBarStatus.action";

export default function Nav(props) {
    const token = jwt.decode(Cookies.get("auth"));
    const toggleStatus = useSelector(state => state.toggleStatus);
    const dispatch = useDispatch();
    const router = useRouter();

    function ContextAwareToggle({ children, eventKey, callback, id }) {
        const { activeEventKey } = useContext(AccordionContext);
        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => callback && callback(eventKey)
        );
        // const isCurrentEventKey = activeEventKey === eventKey;

        console.log("children", id, window.location.pathname)

        const isCurrentPath = window.location.pathname === id;
        const isCurrentEventKey = activeEventKey === eventKey || isCurrentPath;

        return (
            <div
                className={`${styles.menuItem} ${isCurrentPath ? styles.menuItemActive : ''}`}
                onClick={decoratedOnClick}
            >
                {children}
            </div>
        );
    }

    return (
        <>
            <div className={`${styles.menuArea} ${styles.modernSidebar}`} style={{ left: `${toggleStatus ? "0px" : "-250px"}` }}>
                {/* Toggle e Logo - mantidos inalterados */}
                <Toggle />
                <Logo />

                {/* Profile Section */}
                <div className={`${styles.profileSection} fadeItem`}>
                    <Link href={`/editProfile`}>

                        <div className={styles.companySection}>

                            <div className={styles.profileContainer}>
                                {/* Profile Image */}
                                <div className={styles.profileImageWrapper}>
                                    <img
                                        src={token.profileImageUrl || "/USER.png"}
                                        alt="User profile picture"
                                        className={styles.profileImage}
                                    />
                                    <div className={styles.onlineIndicator}></div>
                                </div>

                                {/* User Info */}

                                <div className={styles.userInfo}>
                                    <h3 className={styles.userName}>
                                        {token.firstName} {token.lastName}
                                    </h3>
                                    <div className={styles.userStatus}>
                                        <FontAwesomeIcon
                                            icon={token.userStatus === "admGlobal" ? faUserGear : faUserTie}
                                            className={styles.userStatusIcon}
                                        />
                                        <span>
                                            {token.userStatus === 'admGlobal' ? 'Administrador' : 'Corretor'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Company Info */}
                    {(token.logo || token.companyName) ?
                        <Link href="/companyEdit">
                            <div className={styles.companySection}>
                                {token.logo ? (
                                    <img
                                        src={token.logo}
                                        className={styles.companyLogo}
                                        alt="Company logo"
                                    />
                                ) : (
                                    <span className={styles.companyName}>
                                        {token.companyName}
                                    </span>
                                )}
                            </div>
                        </Link>
                        :
                        <Link href="/companyEdit">
                            <div className={styles.companySection}>
                                <span className={styles.companyName}>
                                    Cadastrar Imobiliária
                                </span>
                            </div>
                        </Link>
                    }
                </div>

                {/* Navigation Menu */}
                <div className={styles.navigationWrapper}>
                    <Scrollbars
                        style={{ height: "calc(100vh - 220px)" }}
                        autoHide
                        autoHideTimeout={3000}
                        autoHideDuration={200}
                        renderTrackVertical={(props) => (
                            <div {...props} className={styles.scrollTrack} />
                        )}
                        renderThumbVertical={(props) => (
                            <div {...props} className={styles.scrollThumb} />
                        )}
                    >
                        <nav className={styles.navigation}>
                            <Accordion defaultActiveKey="0">
                                {/* Início */}
                                <div className={styles.navItem}>
                                    <ContextAwareToggle eventKey="0" id="/">
                                        <div className={styles.navLink} onClick={() => router.push('/')}>
                                            <div className={styles.navIcon}>
                                                <FontAwesomeIcon icon={faHome} />
                                            </div>
                                            <span className={styles.navLabel}>Início</span>
                                        </div>
                                    </ContextAwareToggle>
                                </div>

                                {/* Meu Perfil */}
                                {/* <div className={styles.navItem}>
                                    <ContextAwareToggle eventKey="1" id="/editProfile">
                                        <div className={styles.navLink} onClick={() => router.push('/editProfile')}>
                                            <div className={styles.navIcon}>
                                                <FontAwesomeIcon icon={faUser} />
                                            </div>
                                            <span className={styles.navLabel}>Meu perfil</span>
                                        </div>
                                    </ContextAwareToggle>
                                </div> */}

                                {/* Imobiliária - apenas para admGlobal */}
                                {/* {token.userStatus === "admGlobal" && (
                                    <div className={styles.navItem}>
                                        <ContextAwareToggle eventKey="2" id="/companyEdit">
                                            <div className={styles.navLink} onClick={() => router.push('/companyEdit')}>
                                                <div className={styles.navIcon}>
                                                    <FontAwesomeIcon icon={faShop} />
                                                </div>
                                                <span className={styles.navLabel}>Imobiliária</span>
                                            </div>
                                        </ContextAwareToggle>
                                    </div>
                                )} */}

                                {/* Clientes */}
                                <div className={styles.navItem}>
                                    <ContextAwareToggle eventKey="3" id="/clientsManagement">
                                        <div className={styles.navLinkWithSubmenu}>
                                            <div className={styles.navIcon}>
                                                <FontAwesomeIcon icon={faHouseUser} />
                                            </div>
                                            <span className={styles.navLabel}>Clientes</span>
                                            <FontAwesomeIcon icon={faAngleRight} className={styles.expandIcon} />
                                        </div>
                                    </ContextAwareToggle>
                                    <Accordion.Collapse eventKey="3">
                                        <div className={styles.submenu}>
                                            <Link href={`/clientAdd`}>
                                                <div className={styles.submenuItem}>
                                                    <span>Adicionar cliente</span>
                                                </div>
                                            </Link>
                                            <Link href={`/clientsManagement`}>
                                                <div className={styles.submenuItem}>
                                                    <span>Gestão de clientes</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Accordion.Collapse>
                                </div>

                                {/* Usuários */}
                                <div className={styles.navItem} >
                                    <ContextAwareToggle eventKey="4" id="/usersManagement">
                                        <div className={styles.navLinkWithSubmenu}>
                                            <div className={styles.navIcon}>
                                                <FontAwesomeIcon icon={faUsers} />
                                            </div>
                                            <span className={styles.navLabel}>Usuários</span>
                                            <FontAwesomeIcon icon={faAngleRight} className={styles.expandIcon} />
                                        </div>
                                    </ContextAwareToggle>
                                    <Accordion.Collapse eventKey="4">
                                        <div className={styles.submenu}>
                                            {token.userStatus === "admGlobal" && (
                                                <Link href={`/userAdd`}>
                                                    <div className={styles.submenuItem}>
                                                        <span>Adicionar usuário</span>
                                                    </div>
                                                </Link>
                                            )}
                                            <Link href={`/usersManagement`}>
                                                <div className={styles.submenuItem}>
                                                    <span>Gestão de usuário</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Accordion.Collapse>
                                </div>

                                {/* Configurações */}
                                <div className={styles.navItem}>
                                    <ContextAwareToggle eventKey="5" id="/passwordChange">
                                        <div className={styles.navLinkWithSubmenu}>
                                            <div className={styles.navIcon}>
                                                <FontAwesomeIcon icon={faGear} />
                                            </div>
                                            <span className={styles.navLabel}>Configurações</span>
                                            <FontAwesomeIcon icon={faAngleRight} className={styles.expandIcon} />
                                        </div>
                                    </ContextAwareToggle>
                                    <Accordion.Collapse eventKey="5">
                                        <div className={styles.submenu}>
                                            <Link href="/passwordChange">
                                                <div className={styles.submenuItem}>
                                                    <span>Alterar Senha</span>
                                                </div>
                                            </Link>
                                            <Link href="/accountSetup">
                                                <div className={styles.submenuItem}>
                                                    <span>Configuração da Conta</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Accordion.Collapse>
                                </div>

                                {/* Tutoriais */}
                                <div className={styles.navItem} >
                                    <ContextAwareToggle eventKey="6" id="/tutorials">
                                        <div className={styles.navLink} onClick={() => router.push('/tutorials')}>
                                            <div className={styles.navIcon}>
                                                <FontAwesomeIcon icon={faBook} />
                                            </div>
                                            <span className={styles.navLabel}>Tutoriais</span>
                                        </div>
                                    </ContextAwareToggle>
                                </div>

                                {/* Fale Conosco */}
                                <div className={`${styles.navItem} ${styles.lastNavItem} `} style={{marginBotton: "100px"}}>
                                    <ContextAwareToggle eventKey="7" id="/sac">
                                        <div className={styles.navLink} onClick={() => router.push('/sac')}>
                                            <div className={styles.navIcon}>
                                                <FontAwesomeIcon icon={faCommentAlt} />
                                            </div>
                                            <span className={styles.navLabel}>Fale Conosco</span>
                                        </div>
                                    </ContextAwareToggle>
                                </div>
                            </Accordion>
                        </nav>
                    </Scrollbars>
                </div>


            </div>

            {!window2Mobile() && toggleStatus === true && (
                <div
                    className={`fadeItem ${styles.navbarBackground}`}
                    onClick={() => dispatch(toggleBarChange(toggleStatus))}
                />
            )}
        </>
    );
}