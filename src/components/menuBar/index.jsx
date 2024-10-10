import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './menuBar.module.scss'
import { faHome, faHomeUser, faList, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toggleBarChange } from '../../../store/ToggleBarStatus/ToggleBarStatus.action'
import isMobile from '../../../utils/isMobile'


export default function MenuBar(props) {

    const dispatch = useDispatch()

    const router = useRouter()

    const [pathname, setPathname] = useState('')

    useEffect(() => {

        setPathname(router.pathname)

    }, [router.pathname])

    const permitedPages = [
        '/usersManagement',
        '/clientsManagement',
        '/tutorials',
        '/sac',
        '/passwordChange',
        '/accountSetup'
    ]





    return (
        <div className={` ${permitedPages.includes(pathname) && isMobile() ? styles.container : styles.containerHide}`}>
            <div className="row h-100 px-4">
                <div className="col-3 d-flex justify-content-center align-items-center ">

                    <Link href='/'
                        className={`text-center  ${pathname === '/' ? `${styles.pageSelected}` : 'text-light'}`}>
                        <FontAwesomeIcon icon={faHome} /> <br />
                        <span style={{ fontSize: '10px' }}>Início</span>
                    </Link>

                </div>
                <div className="col-3 d-flex justify-content-center align-items-center ">

                    <Link href='/usersManagement'
                        className={`text-center  ${pathname === '/usersManagement' ? `${styles.pageSelected}` : 'text-light'}`}>
                        <FontAwesomeIcon icon={faUsers} /> <br />
                        <span style={{ fontSize: '10px' }}>Usuários</span>
                    </Link>

                </div>
                <div className="col-3 d-flex justify-content-center align-items-center ">

                    <Link href='/clientsManagement'
                        className={`text-center  ${pathname === '/clientsManagement' ? `${styles.pageSelected}` : 'text-light'}`}>
                        <FontAwesomeIcon icon={faHomeUser} /> <br />
                        <span style={{ fontSize: '10px' }}>Clientes</span>
                    </Link>

                </div>
                <div className="col-3 d-flex justify-content-center align-items-center px-0">

                    <span onClick={() =>dispatch(toggleBarChange(false))}
                        className={`text-center  ${pathname === '/accountSetup' ? `${styles.pageSelected}` : 'text-light'}`}>
                        <FontAwesomeIcon icon={faList} /> <br />
                        <span style={{ fontSize: '10px' }}>Opções</span>
                    </span>

                </div>
            </div>
        </div>
    )
}



{/* <div className="col-3 d-flex justify-content-center align-items-center ">
                    <span>
                        <FontAwesomeIcon icon={faUsers} />
                    </span>
                </div>
                <div className="col-3 d-flex justify-content-center align-items-center ">
                    <span>
                        <FontAwesomeIcon icon={faUsers} />
                    </span>
                </div>
                <div className="col-3 d-flex justify-content-center align-items-center ">
                    <span>
                        <FontAwesomeIcon icon={faUsers} />
                    </span>
                </div>
                <div className="col-3 d-flex justify-content-center align-items-center ">
                    <span>
                        <FontAwesomeIcon icon={faUsers} />
                    </span>
                </div> */}





// <div>

//         <Link href='/usersManagement' className='text-center text-light '>
//             <FontAwesomeIcon icon={faUsers} /> <br />
//             <span className='small'>Usuários</span>
//         </Link>
//     </div>
//     <Link href='/clientsManagement' className='text-center text-light '>
//         <FontAwesomeIcon icon={faHomeUser} /> <br />
//         <span className='small'>Clientes</span>
//     </Link>
//     <Link href='/clientsManagement' className='text-center text-light '>
//         <FontAwesomeIcon icon={faList} /> <br />
//         <span className='small'>Imobiliária</span>
//     </Link>