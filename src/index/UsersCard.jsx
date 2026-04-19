import Link from "next/link";
import Icons from "../components/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalculator, faCrown, faFaceSadTear,
    faKey, faLightbulb, faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import CountUp from 'react-countup';
import { faUser } from "@fortawesome/free-regular-svg-icons";
import isMobile from "../../utils/isMobile";
import styles from "./UsersCard.module.scss";


export default function UsersCard(props) {

    const { clientsStatus, clientsArray, rankedUserResults,
        rankedUserValuationResults, companyData, loading } = props;

    const [totalStatus, setTotalStatus] = useState(0);


    return (
        <div className={styles.card}>

            {loading && <Loading />}

            <div className={styles.cardBody}>

                {/* ── Header ── */}
                <Link href='/usersManagement' style={{ textDecoration: 'none' }}>
                    <div className={styles.header}>
                        <span className={styles.title}>Usuários</span>
                        <span className={styles.accessLink}>
                            Acessar <Icons icon="a-r" />
                        </span>
                    </div>
                    <p className={styles.subtitle}>
                        Visualize todos os usuários cadastrados
                    </p>
                </Link>

                <hr className={styles.divider} />

                {/* ── Campeão de captações ── */}
                <p className={styles.sectionLabel}>Campeão de captações</p>

                {rankedUserResults.firstName ? (
                    <div className={styles.rankedCard}>
                        <div className={styles.profileWrap}>
                            <span
                                className={styles.iconDecor}
                                style={{ right: '-2px', top: '-14px', transform: 'rotate(20deg)', color: '#f7bc06' }}
                            >
                                <FontAwesomeIcon icon={faCrown} />
                            </span>
                            <span
                                className={styles.iconDecor}
                                style={{ left: '-8px', top: '56px', transform: 'rotate(70deg)', color: 'rgba(255,255,255,0.3)' }}
                            >
                                <FontAwesomeIcon icon={faKey} />
                            </span>
                            <img
                                src={rankedUserResults?.profileImageUrl}
                                className={styles.profileImg}
                                alt=""
                            />
                            <span className={styles.profileName}>
                                {rankedUserResults?.firstName} {rankedUserResults?.lastName}
                            </span>
                        </div>

                        <div className={styles.statsRow}>
                            <div className={styles.statBlock}>
                                <div className={styles.statValue}>
                                    <CountUp end={rankedUserResults?.clientsLength} separator="." duration={2} />
                                </div>
                                <div className={styles.statLabel}>
                                    {rankedUserResults?.clientsLength === 1 ? 'Cliente' : 'Clientes'}
                                </div>
                            </div>
                            <div className={styles.statBlock}>
                                <div className={styles.statValue}>
                                    <CountUp end={rankedUserResults?.clientsRating} separator="." duration={2} />
                                    <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                                </div>
                                <div className={styles.statLabel}>Nota de atendimento</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className={styles.emptyStateText}>
                        Nenhuma captação feita
                    </p>
                )}

                {/* ── Mestre de avaliações ── */}
                <p className={styles.sectionLabel} style={{ marginTop: '0.85rem' }}>Mestre de avaliações</p>

                {rankedUserValuationResults.firstName ? (
                    <div className={styles.rankedCard}>
                        <div className={styles.profileWrap}>
                            <span
                                className={styles.iconDecor}
                                style={{ left: '-6px', top: '-12px', transform: 'rotate(-20deg)', color: '#4D88BB' }}
                            >
                                <FontAwesomeIcon icon={faLightbulb} />
                            </span>
                            <span
                                className={styles.iconDecor}
                                style={{ right: '-6px', top: '58px', transform: 'rotate(10deg)', color: 'rgba(255,255,255,0.3)' }}
                            >
                                <FontAwesomeIcon icon={faCalculator} />
                            </span>
                            <img
                                src={rankedUserValuationResults?.profileImageUrl}
                                className={styles.profileImg}
                                alt=""
                            />
                            <span className={styles.profileName}>
                                {rankedUserValuationResults?.firstName} {rankedUserValuationResults?.lastName}
                            </span>
                        </div>

                        <div className={styles.statsRow}>
                            <div className={styles.statBlock}>
                                <div className={styles.statValue}>
                                    <CountUp end={rankedUserValuationResults?.clientsValuations} separator="." duration={2} />
                                </div>
                                <div className={styles.statLabel}>
                                    {rankedUserValuationResults?.clientsValuations > 1 ? 'Avaliações' : 'Avaliação'}
                                </div>
                            </div>
                            <div className={styles.statBlock}>
                                <div className={styles.statValueSm}>
                                    <span className={styles.currencyPrefix}>R$</span>
                                    <CountUp end={rankedUserValuationResults?.averageTicket} separator="." duration={2} />
                                    <span className={styles.currencyPrefix}>,00</span>
                                </div>
                                <div className={styles.statLabel}>Ticket médio</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className={styles.emptyStateText}>
                        Não há avaliações
                    </p>
                )}

                {/* ── Footer action ── */}
                <div className={styles.footerAction}>
                    {companyData?.usersArray?.length > 1 ? (
                        <Link href='/usersManagement'>
                            <button className={styles.btnOutline}>Visualizar todos os usuários</button>
                        </Link>
                    ) : (
                        <Link href='/userAdd'>
                            <button className={styles.btnOutline}>Adicionar usuários</button>
                        </Link>
                    )}
                </div>

                {rankedUserResults.firstName && rankedUserValuationResults.firstName && false && !isMobile() && (
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={companyData?.logo} alt="" className="companyLogo" />
                        </div>
                        {/* <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center my-2 text-center text-secondary">
                            <div className="row">

                                <div className="col-12 ">

                                    <span className="fw-bold fs-2"><CountUp end={companyData?.usersArray?.length} separator="." duration={2} /></span>
                                    {companyData?.usersArray?.length <= 1 && (<span className="fw-bold fs-2 ms-2"><FontAwesomeIcon icon={faFaceSadTear} className="text-secondary" /></span>)}<br />
                                    <span className="bold text-orange fs-3">Usuário{companyData?.usersArray?.length > 1 ? 's' : ''} </span>
                                </div>
                                 <div class="col-12 image-container">
                                    <div class="image-wrapper">
                                        <img src={rankedUserValuationResults?.profileImageUrl} class="akvo-sm-profile-img" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                )}

            </div>
        </div>
    );
}
