import styles from './Notifications.module.scss'
import Icons from '../../../components/icons'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faXmark } from '@fortawesome/free-solid-svg-icons'

export default function NotificationsSM(props) {



    return (
        <>
            {/* <div className={`${styles.cardOuter}`} onClick={() => props.notificationOff()}>

            </div> */}
            <div className={`${styles.cardSizeSM} slideLeft `}>
                <div className="row mb-2">
                    <div >

                        <span className={`${styles.backButtom} px-3`} onClick={() => {props.notificationOff(); props.handleNotificationCheck()}}>
                            {/* <FontAwesomeIcon icon={faXmark} className='icon' /> */}
                            <button type="button" class="btn-close"  aria-label="Close"></button>
                        </span>
                    </div>
                    <div className="col-12 d-flex justify-content-center align-itens-center">

                        <span className='bold'>Notificações</span>
                    </div>
                </div>
                <hr />
                <div className={`${styles.cardInner} fadeItem `}>


                    {!!props.notifications.length && props.notifications.map(elem => {
                        return (
                            <Link href={elem.link} key={elem._id}>
                                <span type='button' className={`${styles.hover} d-flex justify-content-center align-items-center py-2`} onClick={() => props.notificationOff()}>

                                    <span className="col-12 d-flex ">
                                        <div className="col-2 d-flex justify-content-center align-items-center">
                                            <img src={elem.imageUrl} alt="" height={30} />
                                            <div style={{ position: "absolute" }}>

                                                {!elem.checked && (
                                                    <div className="notificationIcon fadeItem">
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-10 d-flex justify-content-start align-items-center">
                                            <span className={`${styles.p}`}>
                                                {elem.text}
                                            </span>
                                        </div>
                                    </span>
                                </span>
                            </Link>
                        )
                    })}


                </div>

                {/* <div className={`row mb-2 ${styles.notificationsFooter}`}>
                    <hr className='py-0 my-0' />
                    <div className="col-12 d-flex justify-content-center align-itens-center">


                        <span type='button' className='span p'>Visualizar todas as notificações <Icons icon='a-r' /></span>
                    </div>
                </div> */}





            </div>
        </>

    )
}