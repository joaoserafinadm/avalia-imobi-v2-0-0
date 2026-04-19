
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addAlert } from "../../store/Alerts/Alerts.actions";



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

        console.log("data",client, data)


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

        <div class="modal fade" id="deleteClientModal" tabindex="-1" aria-labelledby="deleteClienteModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style={{ background: 'linear-gradient(145deg,#0d1420 0%,#111827 60%,#0f1b2d 100%)', border: '1px solid rgba(245,135,79,0.15)', color: '#cacaca' }}>
                    <div class="modal-header" style={{ background: '#0d1420', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <h5 class="modal-title bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Deletar Cliente</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div className="row">
                            <div className="col-12">
                                <p>Tem a certeza que deseja deletar <b className="bold" style={{ color: '#fff' }}>{client?.clientName}{" " + client?.clientLastName}</b>?</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style={{ background: '#0d1420', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        <button type="button" class="btn btn-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#cacaca' }} data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-sm btn-danger" data-bs-dismiss="modal" onClick={() => handleDeleteClient(client?._id)}>Deletar</button>
                    </div>
                </div>
            </div>
        </div>




    )



}