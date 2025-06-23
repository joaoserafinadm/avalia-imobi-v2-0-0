import styles from './Notifications.module.scss'
import Icons from '../../../components/icons'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

export default function Notifications(props) {



    return (
        <div className={`${styles.cardSize}`}>
            <div className="row mb-2">
                <div className="col-12 d-flex justify-content-center align-itens-center">

                    <span className='bold'>Notificações</span>
                </div>
            </div>
            <hr />
            <div className={`${styles.cardInner}`}>


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
                                        <span className={`${styles.p} ${!elem.checked ? 'fw-bold' : ''}`}>
                                            {elem.text}
                                        </span>
                                    </div>
                                </span>
                            </span>
                        </Link>
                    )
                })}

            </div>

           {/* <hr />

             <div className="row mb-2">
                <div className="col-12 d-flex justify-content-center align-itens-center">

                    <span type='button' className='span p'>Visualizar todas as notificações <FontAwesomeIcon icon={faAngleRight} /></span>
                </div>
            </div> */}





        </div>
    )
}