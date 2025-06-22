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
        '/accountSetup',
        '/'
    ]

    const menuItems = [
        {
            href: '/',
            icon: faHome,
            label: 'Início',
            path: '/'
        },
        {
            href: '/usersManagement',
            icon: faUsers,
            label: 'Usuários',
            path: '/usersManagement'
        },
        {
            href: '/clientsManagement',
            icon: faHomeUser,
            label: 'Imóveis',
            path: '/clientsManagement'
        },
        {
            href: null,
            icon: faList,
            label: 'Opções',
            path: '/accountSetup',
            onClick: () => dispatch(toggleBarChange(false))
        }
    ]

    return (
        <div className={`${permitedPages.includes(pathname) && isMobile() ? styles.container : styles.containerHide}`}>
            <div className={styles.menuWrapper}>
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.path
                    const Component = item.href ? Link : 'button'
                    
                    return (
                        <div key={index} className={styles.menuItem}>
                            <Component
                                {...(item.href ? { href: item.href } : { onClick: item.onClick })}
                                className={`${styles.menuLink} ${isActive ? styles.active : ''}`}
                            >
                                <div className={styles.iconWrapper}>
                                    <FontAwesomeIcon 
                                        icon={item.icon} 
                                        className={styles.icon}
                                    />
                                </div>
                                <span className={styles.label}>{item.label}</span>
                                {isActive && <div className={styles.ripple} />}
                            </Component>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}