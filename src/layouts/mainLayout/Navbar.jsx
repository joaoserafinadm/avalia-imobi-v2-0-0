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
import { faAngleRight, faBook, faBookOpenReader, faComment, faCommentAlt, faGear, faHome, faHouseUser, faShop, faUser, faUserGear, faUserTie, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import window2Mobile from "../../../utils/window2Mobile";
import { toggleBarChange } from "../../../store/ToggleBarStatus/ToggleBarStatus.action";

export default function Nav(props) {

    const token = jwt.decode(Cookies.get("auth"));
    const toggleStatus = useSelector(state => state.toggleStatus)

    const dispatch = useDispatch()


    const router = useRouter()

    function ContextAwareToggle({ children, eventKey, callback }) {
        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => callback && callback(eventKey)
        );

        const isCurrentEventKey = activeEventKey === eventKey;

        return (
            <span
                className="font-weight-bold btn-toggle"
                type="button"
                onClick={decoratedOnClick}
                collapsed={isCurrentEventKey ? "true" : "false"}
            >
                <div className="row align-items-center">{children}</div>
            </span>
        );
    }



    return (
        <>
            <div className={`${styles.menuArea} shadow`} style={{ left: `${toggleStatus ? "0px" : "-250px"}` }}>
                <Toggle />
                <Logo />
                <div className=" row align-items-center mt-4 mb-2 fadeItem">
                    <div className="col">

                        <div className="row align-items-center">
                            <Link href={`/editProfile`}>
                                <div className="d-flex justify-content-center">
                                    <span type="button">
                                        <img
                                            src={token.profileImageUrl}
                                            alt="User profile picture"
                                            className={`${styles.img} `}
                                        />
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className="row align-items-center mt-2">
                            <div className={`d-flex justify-content-center ${styles.userName}`}>
                                {token.firstName} {token.lastName}
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="d-flex justify-content-center">
                                <small className={`${styles.userStatus}`}>
                                    {token.userStatus === "admGlobal" ? <FontAwesomeIcon icon={faUserGear} /> : <FontAwesomeIcon icon={faUserTie} />} {token.userStatus === 'admGlobal' ? 'Administrador' : 'Corretor'}
                                </small>
                            </div>
                        </div>
                        <div style={{ height: "75px" }} className=" slideDown d-flex justify-content-center align-items-center">
                            {(token.logo || token.companyName) && (
                                <Link href="/companyEdit" >
                                    <span type="button" className="row align-items-center" >
                                        <div className="d-flex justify-content-center">
                                            {token.logo ?
                                                <img
                                                    src={token.logo}
                                                    className={`${styles.companyLogo} fadeItem1s`}
                                                />
                                                :
                                                <span className={`${styles.userName} text-center fadeItem1s`}>
                                                    {token.companyName}
                                                </span>
                                            }
                                        </div>
                                    </span>
                                </Link>
                            )}
                        </div>

                        <Scrollbars
                            style={{ height: "calc(100vh - 270px)" }}
                            autoHide
                            autoHideTimeout={3000}
                            autoHideDuration={200}
                            renderTrackVertical={(props) => (
                                <div {...props} className="vtrackSidebar" />
                            )}
                            renderThumbVertical={(props) => (
                                <div {...props} className="vthumbSidebar" />
                            )}
                        >
                            <ul style={{ width: "95%" }}>
                                <Accordion defaultActiveKey="0">
                                    <li>
                                        <ContextAwareToggle eventKey="0" collapse="InicioItem">
                                            <div className="d-flex justify-content-start " type='button' onClick={() => router.push('/')}>
                                                <div className="col-1 d-flex justify-content-center align-items-center me-3">
                                                    <FontAwesomeIcon icon={faHome} className="me-2 icon" />
                                                </div>
                                                <div className="col-9">Início</div>
                                            </div>
                                        </ContextAwareToggle>
                                    </li>
                                    <li>
                                        <ContextAwareToggle eventKey="1" collapse="InicioItem">
                                            <div className="d-flex justify-content-start " type='button' onClick={() => router.push('/editProfile')}>
                                                <div className="col-1 d-flex justify-content-center align-items-center me-3">
                                                    <FontAwesomeIcon icon={faUser} className="me-2 icon" />
                                                </div>
                                                <div className="col-9">Meu perfil</div>
                                            </div>
                                        </ContextAwareToggle>
                                    </li>
                                    {token.userStatus === "admGlobal" && (

                                        <li>
                                            <ContextAwareToggle eventKey="2" collapse="InicioItem">
                                                <div className="d-flex justify-content-start " type='button' onClick={() => router.push('/companyEdit')}>
                                                    <div className="col-1 d-flex justify-content-center align-items-center me-3">
                                                        <FontAwesomeIcon icon={faShop} className="me-2 icon" />
                                                    </div>
                                                    <div className="col-9">Imobiliária</div>
                                                </div>
                                            </ContextAwareToggle>
                                        </li>
                                    )}
                                    <li>
                                        <ContextAwareToggle eventKey="3" collapse="configuracoesCollapse">
                                            <div className="d-flex">
                                                <div className="col-1 d-flex justify-content-center align-items-center me-3">
                                                    <FontAwesomeIcon icon={faHouseUser} className="me-2 icon" />
                                                </div>
                                                <div className="col-9">Clientes</div>
                                                <div className="col-1 toggleIcon text-end">
                                                    <FontAwesomeIcon icon={faAngleRight} className=" icon" />
                                                </div>
                                            </div>
                                        </ContextAwareToggle>
                                        <Accordion.Collapse eventKey="3">
                                            <ul>
                                                <li>
                                                    <Link href={`/clientAdd`}>
                                                        <span>Adicionar cliente</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href={`/clientsManagement`}>
                                                        <span>Gestão de clientes</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </Accordion.Collapse>
                                    </li>
                                    <li>
                                        <ContextAwareToggle eventKey="4" collapse="configuracoesCollapse">
                                            <div className="d-flex">
                                                <div className="col-1 d-flex justify-content-center align-items-center me-3">
                                                    <FontAwesomeIcon icon={faUsers} className="me-2 icon" />
                                                </div>
                                                <div className="col-9">Usuários</div>
                                                <div className="col-1 toggleIcon text-end">
                                                    <FontAwesomeIcon icon={faAngleRight} className=" icon" />
                                                </div>
                                            </div>
                                        </ContextAwareToggle>
                                        <Accordion.Collapse eventKey="4">
                                            <ul>
                                                {token.userStatus === "admGlobal" && (

                                                    <li>
                                                        <Link href={`/userAdd`}>
                                                            <span>Adicionar usuário</span>
                                                        </Link>
                                                    </li>
                                                )}
                                                <li>
                                                    <Link href={`/usersManagement`}>
                                                        <span>Gestão de usuário</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </Accordion.Collapse>
                                    </li>

                                    <li>
                                        <ContextAwareToggle eventKey="5" collapse="configuracoesCollapse">
                                            <div className="d-flex">
                                                <div className="col-1 d-flex justify-content-center align-items-center me-3">
                                                    <FontAwesomeIcon icon={faGear} className="me-2 icon" />
                                                </div>
                                                <div className="col-9">Configurações</div>
                                                <div className="col-1 toggleIcon text-end">
                                                    <FontAwesomeIcon icon={faAngleRight} className=" icon" />
                                                </div>
                                            </div>
                                        </ContextAwareToggle>
                                        <Accordion.Collapse eventKey="5">
                                            <ul>
                                                <li>
                                                    <Link href="/passwordChange">
                                                        <span>Alterar Senha</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/accountSetup">
                                                        <span>Configuração da Conta</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </Accordion.Collapse>
                                    </li>

                                    <li>
                                        <ContextAwareToggle eventKey="6" collapse="InicioItem">
                                            <div className="d-flex justify-content-start " type='button' onClick={() => router.push('/tutorials')}>
                                                <div className="col-1 d-flex justify-content-center align-items-center me-3">
                                                    <FontAwesomeIcon icon={faBook} className="me-2 icon" />
                                                </div>
                                                <div className="col-9">Tutoriais</div>
                                            </div>
                                        </ContextAwareToggle>
                                    </li>
                                    <li className="mb-5">
                                        <ContextAwareToggle eventKey="7" collapse="InicioItem">
                                            <div className="d-flex justify-content-start " type='button' onClick={() => router.push('/sac')}>
                                                <div className="col-1 d-flex justify-content-center align-items-center me-3">
                                                    <FontAwesomeIcon icon={faCommentAlt} className="me-2 icon" />
                                                </div>
                                                <div className="col-9">Fale Conosco</div>
                                            </div>
                                        </ContextAwareToggle>
                                    </li>


                                </Accordion>
                            </ul>

                        </Scrollbars>

                    </div>
                </div>
            </div>
            {!window2Mobile() && toggleStatus === true && (
                <div className={`fadeItem ${styles.navbarBackground}`} onClick={() => dispatch(toggleBarChange(toggleStatus))}>

                </div>
            )}
        </>

    );
}
