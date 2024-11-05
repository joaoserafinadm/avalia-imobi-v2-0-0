import { useState } from "react"
import UserInfo from "./UserInfo"
import { permissionShow } from "../../utils/permissions"
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import EditUserStatus from "./EditUserStatus";
import DeleteUserStatus from "./DeleteUserStatus";



export default function ViewUserModal(props) {

    const token = jwt.decode(Cookies.get("auth"));

    const user = props.userSelected
    const usersCount = props.usersCount

    const [editStatus, setEditStatus] = useState(false)
    const [deleteStatus, setDeleteStatus] = useState(false)

    const [saveError, setSaveError] = useState('')
    const [deleteError, setDeleteError] = useState(false)


    const handleCloseModal = () => {

        setEditStatus(false)
        setDeleteStatus(false)
        props.setUserSelected('')

        setSaveError('')
        setDeleteError(false)

    }

    return (
        <div class="modal fade" id="viewUserModal" tabindex="-1" aria-labelledby="viewUserModalLabel" aria-hidden="true" data-bs-backdrop='static'>
            <div class={`modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg`}>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title title-dark" id="viewUserModalLabel">
                            {!editStatus && !deleteStatus ? 'Informações do usuário' : editStatus ? 'Editar usuário' : deleteStatus ? 'Deletar usuário' : 'Informações do usuário'}

                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleCloseModal()}></button>

                    </div>

                    {!editStatus && !deleteStatus && (

                        <UserInfo user={user} token={token}
                            setDeleteStatus={value => setDeleteStatus(value)}
                            setEditStatus={value => setEditStatus(value)}
                            handleCloseModal={() => handleCloseModal()} />
                    )}
                    {editStatus && (
                        <EditUserStatus user={user} token={token}
                            setEditStatus={value => setEditStatus(value)}
                            dataFunction={() =>props.dataFunction()} />
                    )}
                    {deleteStatus && (
                        <DeleteUserStatus user={user} token={token} usersCount={usersCount}
                            setDeleteStatus={value => setDeleteStatus(value)}
                            handleCloseModal={() => handleCloseModal()}
                            dataFunction={() => props.dataFunction()}/>
                    )}
                </div>
            </div>
        </div>
    )
}