import styles from './Title2.module.scss'
import { AiOutlineLeft } from '@react-icons/all-files/ai/AiOutlineLeft'
import { useRouter } from 'next/router'


export default function Title(props) {

    const router = useRouter()

    return (
        <div className={`${styles.headerBox} indexBackground`}>
            <div className={`${styles.headerContent} fadeItem`}>
                <div className={styles.topRow}>
                    <div className={styles.titleGroup}>
                        {props.title && <span className={styles.accentBar} />}
                        {props.title && (
                            <span className={styles.headerTitle}>{props.title}</span>
                        )}
                    </div>
                    {props.backButton && (
                        <span
                            type="button"
                            className={styles.backButton}
                            onClick={() => router.back()}
                        >
                            <AiOutlineLeft />
                            Voltar
                        </span>
                    )}
                </div>
                {props.subtitle && (
                    <div className={`${styles.headerSubtitle} fadeItem`}>{props.subtitle}</div>
                )}
            </div>
        </div>
    )
}
