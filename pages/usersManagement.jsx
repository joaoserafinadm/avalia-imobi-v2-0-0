import Link from "next/link";
import Title from "../src/components/title/Title2";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
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

    return (
        <div >
            <Title title={'Gestão de usuários'} backButton='/' />


            <div className="pagesContent shadow fadeItem" id="pageTop">
                <div className="row ">
                    <div className="col-12 d-flex justify-content-end ">

                        <Link href='/userAdd'>
                            <button className="btn btn-sm btn-orange">
                                Adicionar usuário
                            </button>
                        </Link>
                    </div>
                </div>
                <hr />
                {loadingPage ?
                    <SpinnerLG />
                    :
                    <>
                        <div className="row mt-3 fadeItem">
                            <div className="col-12 col-md-3 d-flex justify-content-start">

                                <div class="input-group mb-3">
                                    <input type="text"
                                        class="form-control"
                                        placeholder="Pesquisar"
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                        value={searchValue}
                                        onChange={e => setSearchValue(e.target.value)}
                                    />
                                    <span class="input-group-text" id="basic-addon1"><FontAwesomeIcon icon={faSearch} className="icon" /></span>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">

                            {usersArray.filter(elem => {

                                const name = elem.firstName + ' ' + elem.lastName

                                return name.toLowerCase().includes(searchValue.toLowerCase())
                            }).map(elem => {
                                return (
                                    <UsersCard setUserSelected={value => setUserSelected(value)} elem={elem} />
                                )

                            })}
                        </div>


                        <ViewUserModal userSelected={userSelected} usersCount={usersCount}
                            dataFunction={() => dataFunction(token.company_id)}
                            setUserSelected={value => setUserSelected(value)} />

                    </>

                }



            </div>

        </div>

    )
}