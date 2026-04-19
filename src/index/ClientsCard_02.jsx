import Link from "next/link";
import Icons from "../components/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import Loading from "./Loading";
import CountUp from 'react-countup';
import { SpinnerSM } from "../components/loading/Spinners";
import styles from "./ClientsCard_02.module.scss";


export default function ClientsCard_02(props) {

    const { userResults, clientsArray, loading } = props;

    useEffect(() => {
        console.log("userResults", userResults);
    }, [props]);


    return (
        <div className={styles.card}>

            {loading && <Loading />}

            <div className={styles.cardBody}>

                <Link href='/clientsManagement' style={{ textDecoration: 'none' }}>
                    <div className={styles.header}>
                        <span className={styles.title}>Imóveis</span>
                        <span className={styles.accessLink}>
                            Acessar <Icons icon="a-r" />
                        </span>
                    </div>
                    <p className={styles.subtitle}>
                        Cadastre e avalie os imóveis de seus clientes
                    </p>
                </Link>

                <hr className={styles.divider} />

                {!!clientsArray.length ? (
                    <>
                        <p className={styles.sectionLabel}>Meus resultados</p>
                        <div className={styles.statsGrid}>

                            <div className={styles.statBlock}>
                                <div className={styles.statValue}>
                                    <CountUp end={userResults.clientsLength} separator="." duration={2} />
                                </div>
                                <div className={styles.statLabel}>
                                    {userResults.clientsLength > 1 ? "Clientes" : "Cliente"}
                                </div>
                            </div>

                            <div className={styles.statBlock}>
                                <div className={styles.statValue}>
                                    <CountUp end={userResults.clientsValuations} separator="." duration={2} />
                                </div>
                                <div className={styles.statLabel}>
                                    {userResults.clientsValuations > 1 ? "Avaliações" : "Avaliação"}
                                </div>
                            </div>

                            <div className={styles.statBlock}>
                                <div className={styles.statValue}>
                                    <CountUp end={userResults.clientsRating} separator="." duration={2} />
                                    <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                                </div>
                                <div className={styles.statLabel}>Nota de atendimento</div>
                            </div>

                            <div className={styles.statBlock}>
                                <div className={styles.statValueSm}>
                                    <span className={styles.currencyPrefix}>R$</span>
                                    <CountUp end={userResults.averageTicket} separator="." duration={2} />
                                    <span className={styles.currencyPrefix}>,00</span>
                                </div>
                                <div className={styles.statLabel}>Ticket médio</div>
                            </div>

                        </div>
                    </>
                ) : (
                    <>
                        {!props.loading ? (
                            <div className={styles.emptyState}>
                                <p className={styles.emptyText}>Nenhum imóvel cadastrado</p>
                                <Link href='/clientAdd'>
                                    <button className={styles.btnPrimary}>Cadastrar imóvel</button>
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.loadingWrap}>
                                <SpinnerSM />
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}
