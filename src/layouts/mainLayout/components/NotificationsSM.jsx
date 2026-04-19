import styles from './Notifications.module.scss'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef } from 'react'

function NotifItem({ elem, onClick }) {
    const unread = !elem.checked
    return (
        <Link href={elem.link} key={elem._id}>
            <span
                className={`${styles.notifItem} ${unread ? styles.notifItemUnread : ''}`}
                onClick={onClick}
            >
                <img src={elem.imageUrl} alt="" className={styles.notifAvatar} />
                <span className={`${styles.notifText} ${unread ? styles.notifTextUnread : ''}`}>
                    {elem.text}
                </span>
                {unread && <span className={styles.unreadDot} />}
            </span>
        </Link>
    )
}

export default function NotificationsSM(props) {
    const panelRef = useRef(null)
    const unreadCount = props.notifications.filter(n => !n.checked).length

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                props.notificationOff()
                props.handleNotificationCheck()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleClose = () => {
        props.notificationOff()
        props.handleNotificationCheck()
    }

    return (
        <div className={styles.cardSizeSM} ref={panelRef}>

            <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>Notificações</span>
                <div className={styles.headerRight}>
                    {!!unreadCount && (
                        <span className={styles.unreadBadge}>
                            {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                        </span>
                    )}
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={handleClose}
                        aria-label="Fechar"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
            </div>

            <div className={styles.cardInner}>
                {props.notifications.length ? (
                    props.notifications.map(elem => (
                        <NotifItem key={elem._id} elem={elem} onClick={handleClose} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <FontAwesomeIcon icon={faBell} style={{ fontSize: '2rem' }} />
                        <p>Nenhuma notificação por aqui.</p>
                    </div>
                )}
            </div>

        </div>
    )
}
