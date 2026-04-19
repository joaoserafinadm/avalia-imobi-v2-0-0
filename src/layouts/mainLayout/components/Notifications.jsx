import styles from './Notifications.module.scss'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

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

export default function Notifications(props) {
    const unreadCount = props.notifications.filter(n => !n.checked).length

    return (
        <div className={styles.cardSize}>
            <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>Notificações</span>
                {!!unreadCount && (
                    <span className={styles.unreadBadge}>
                        {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className={styles.cardInner}>
                {props.notifications.length ? (
                    props.notifications.map(elem => (
                        <NotifItem key={elem._id} elem={elem} onClick={() => props.notificationOff?.()} />
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
