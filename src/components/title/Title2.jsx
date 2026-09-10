import styles from './Title2.module.scss'
import { AiOutlineLeft } from '@react-icons/all-files/ai/AiOutlineLeft'
import { useRouter } from 'next/router'
import GuideTour from '../guideTour'


/* props.guide      – chave do roteiro em guideTour/tours.js.
   props.guideProps – props extras repassadas ao GuideTour
                      (beforeStart, waitFor, label...).
   Quando informada, o botão do guia aparece ao lado do "Voltar",
   sem alterar o layout do título. */
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
                    {(props.guide || props.backButton) && (
                        <div className={styles.topRowActions}>
                            {props.guide && (
                                <GuideTour tour={props.guide} label="Guia" inline {...(props.guideProps || {})} />
                            )}
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
                    )}
                </div>
                {props.subtitle && (
                    <div className={`${styles.headerSubtitle} fadeItem`}>{props.subtitle}</div>
                )}
            </div>
        </div>
    )
}
