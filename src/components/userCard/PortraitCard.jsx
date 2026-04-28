
import Cookies from 'js-cookie'
import styles from './userCard.module.scss'
import jwt from 'jsonwebtoken'

function IconPhone() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.03a16 16 0 006.72 6.72l1.22-1.22a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 7l10 7 10-7"/>
    </svg>
  )
}


export default function PortraitCard(props) {
  const token = jwt.decode(Cookies.get('auth'))

  return (
    <div className={`${styles.main} shadow ${props.valuationPdf ? styles.valuationMain : ''}`}>

      <div
        className={styles.header}
        style={{
          backgroundImage: props.headerImg
            ? `linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35)), url(${props.headerImg})`
            : undefined,
        }}
      />

      <div className={styles.profilePicRow}>
        <div className={styles.profilePicWrapper}>
          <img
            className={styles.profilePicture}
            src={props.profileImageUrl}
            alt={`${props.firstName} ${props.lastName}`}
          />
        </div>
      </div>

      <div className={styles.body}>

        <h2 className={styles.name}>
          {props.firstName} {props.lastName}
        </h2>

        <span className={styles.divider} />

        <div className={styles.creciRow}>
          <span className={styles.badge}>
            <span className={styles.badgeLabel}>CRECI</span>
            <span className={styles.badgeDot} />
            {props.creci}
          </span>
        </div>

        <div className={styles.contactList}>
          {(props.whatsLink ? false : props.celular) && (
            <div className={styles.contactRow}>
              <span className={styles.contactIcon}><IconPhone /></span>
              <span>{props.celular}</span>
            </div>
          )}
          {props.email && (
            <div className={styles.contactRow}>
              <span className={styles.contactIcon}><IconMail /></span>
              <span>{props.email}</span>
            </div>
          )}
        </div>

        {props.logo && (
          <div className={styles.logoContainer}>
            <img
              className={styles.logo}
              src={props.logo}
              alt="Logo da imobiliária"
            />
          </div>
        )}

      </div>
    </div>
  )
}
