import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addAlert } from "../../store/Alerts/Alerts.actions";
import Modal, { ModalBtnSecondary, ModalBtnDanger } from "../components/Modal";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function DeleteClientModal(props) {

    const dispatch = useDispatch()
    const alertsArray = useSelector(state => state.alerts)
    const token = jwt.decode(Cookies.get("auth"));
    const client = props.clientSelected

    const handleDeleteClient = async (id) => {
        const data = {
            company_id: token.company_id,
            user_id: token.sub,
            clientId: id,
        }

        await axios.delete(`${baseUrl()}/api/clientsManagement`, {
            params: data
        }).then(res => {
            const alert = {
                type: 'alert',
                message: 'Cliente deletado com sucesso.',
                link: ''
            }
            dispatch(addAlert(alertsArray, [alert]))
            props.dataFunction()
        }).catch(e => {
            console.log(e)
        })
    }

    return (
        <Modal
            id="deleteClientModal"
            title="Deletar cliente"
            icon={faTrash}
            size="md"
            footer={
                <>
                    <ModalBtnSecondary>Cancelar</ModalBtnSecondary>
                    <ModalBtnDanger onClick={() => handleDeleteClient(client?._id)}>
                        Deletar
                    </ModalBtnDanger>
                </>
            }
        >
            <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.6)',
                margin: 0,
                lineHeight: 1.6,
            }}>
                Tem certeza que deseja deletar{' '}
                <strong style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    {client?.clientName} {client?.clientLastName}
                </strong>
                ? Esta ação não pode ser desfeita.
            </p>
        </Modal>
    )
}
