import Link from "next/link";
import Title from "../src/components/title/Title2";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { SpinnerLG } from "../src/components/loading/Spinners";
import navbarHide from "../utils/navbarHide";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import UsersCard from "../src/usersManagement/UserCard";
import ViewUserModal from "../src/usersManagement/ViewUserModal";
import MenuBar from "../src/components/menuBar";
import styles from "./usersManagement.module.scss";



export default function UsersManagement() {

    const token = jwt.decode(Cookies.get("auth"));
    const dispatch = useDispatch()


    const [searchValue, setSearchValue] = useState('')
    const [loadingPage, setLoadingPage] = useState(true)
    const [usersArray, setUsersArray] = useState([])
    const [userSelected, setUserSelected] = useState('')
    const [usersCount, setUsersCount] = useState(0)

    useEffect(() => {
        dataFunction(token.company_id)
        navbarHide(dispatch)

    }, [])

    const dataFunction = async (company_id) => {


        await axios.get(`${baseUrl()}/api/usersManagement`, {
            params: {
                company_id: company_id
            }
        }).then(res => {
            setUsersArray(res.data)
            setUsersCount(res.data.length)
            setLoadingPage(false)
            const selected = userSelected && res.data?.find(elem => elem._id === userSelected._id)
            setUserSelected(selected)
        }).catch(e => {
            setLoadingPage(false)
            console.log(e)
        })
    }

    const filtered = usersArray.filter(elem => {
        const name = (elem.firstName + ' ' + elem.lastName).toLowerCase()
        return name.includes(searchValue.toLowerCase())
    })

    return (
        <div>
            <Title title={'Gestão de usuários'} backButton='/' />

            <div className="pagesContent fadeItem" id="pageTop">
                <div className={styles.page}>

                    {/* ── Top bar ── */}
                    <div className={styles.topBar}>
                        <div className={styles.topBarLeft}>
                            <div className={styles.statBadge}>
                                <span className={styles.statNumber}>{usersCount}</span>
                                <span className={styles.statLabel}>
                                    usuário{usersCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                        <Link href='/userAdd' className={styles.addBtn}>
                            <FontAwesomeIcon icon={faUserPlus} />
                            Adicionar usuário
                        </Link>
                    </div>

                    <hr className={styles.divider} />

                    {loadingPage ? <SpinnerLG /> : (
                        <>
                            {/* ── Search row ── */}
                            <div className={styles.searchRow}>
                                <div className={styles.searchWrap}>
                                    <input
                                        type="text"
                                        className={styles.searchInput}
                                        placeholder="Pesquisar por nome..."
                                        value={searchValue}
                                        onChange={e => setSearchValue(e.target.value)}
                                    />
                                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                </div>
                                {searchValue && (
                                    <span className={styles.resultsLabel}>
                                        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>

                            {/* ── Cards grid ── */}
                            {filtered.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <FontAwesomeIcon icon={faUsers} className={styles.emptyIcon} />
                                    <p className={styles.emptyTitle}>Nenhum usuário encontrado</p>
                                    <p className={styles.emptySubtitle}>
                                        {searchValue ? `Sem resultados para "${searchValue}"` : 'Adicione o primeiro usuário da equipe'}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.cardsGrid}>
                                    {filtered.map(elem => (
                                        <UsersCard
                                            key={elem._id}
                                            setUserSelected={value => setUserSelected(value)}
                                            elem={elem}
                                        />
                                    ))}
                                </div>
                            )}

                            <ViewUserModal
                                userSelected={userSelected}
                                usersCount={usersCount}
                                dataFunction={() => dataFunction(token.company_id)}
                                setUserSelected={value => setUserSelected(value)}
                            />
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}