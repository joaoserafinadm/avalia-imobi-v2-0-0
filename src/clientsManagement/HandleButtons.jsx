import { faEdit, faEye, faFileDownload, faShare, faShareAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import handleShare from "../../utils/handleShare"
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import styles from './HandleButtons.module.scss'
import Button from "../components/Button"

export default function HandleButtons(props) {

    const token = jwt.decode(Cookies.get('auth'))

    const { client, setClientSelected, elem } = props

    return (
        <>
            {client?.status !== 'outdated' ?
                <div className={styles.btnGroup}>
                    <Button
                        variant="ghost"
                        className={styles.btn}
                        id={"viewClientButton" + elem._id}
                        data-bs-toggle="modal"
                        data-bs-target="#viewClientModal"
                        onClick={() => setClientSelected(elem)}>
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                    {(client?.status === 'evaluated') && (
                        <Button variant="ghost" className={styles.btn} id={"shareValuationButton" + elem._id}
                            onClick={() => props.setClientSelected(props.elem)}
                            data-bs-toggle="modal"
                            data-bs-target="#viewValuationModal">
                            <FontAwesomeIcon icon={faShareAlt} />
                        </Button>
                    )}
                    {(client?.status === 'answered') && (
                        <Button variant="ghost" className={styles.btn}
                            onClick={() => props.setClientSelected(props.elem)}
                            data-bs-toggle="modal" id={"downloadValuationButton" + elem._id}
                            data-bs-target="#viewValuationModal">
                            <FontAwesomeIcon icon={faFileDownload} />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        className={styles.btn}
                        id={"deleteClientButton" + elem._id}
                        data-bs-toggle="modal"
                        data-bs-target={"#deleteClientModal"}
                        onClick={() => setClientSelected(elem)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                </div>
                :
                <div className={styles.btnGroup}>
                    <Button variant="ghost" className={styles.btn}
                        id={"shareClientButton" + elem._id}
                        onClick={() => handleShare(elem.urlToken + "&userId=" + token.sub)}>
                        <FontAwesomeIcon icon={faShare} />
                    </Button>
                    <Link href={`/clientEdit/${elem._id}`} className={styles.btn} id={"editClientButton" + elem._id}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <Button
                        variant="ghost"
                        className={styles.btn}
                        id={"deleteClientButton" + elem._id}
                        data-bs-toggle="modal"
                        data-bs-target={"#deleteClientModal"}
                        onClick={() => setClientSelected(elem)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                </div>
            }
        </>
    )
}