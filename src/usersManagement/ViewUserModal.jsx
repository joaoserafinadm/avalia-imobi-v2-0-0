import { useState } from "react"
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import Modal, { ModalBtnSecondary } from "../components/Modal";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import UserInfo from "./UserInfo"
import EditUserStatus from "./EditUserStatus"
import DeleteUserStatus from "./DeleteUserStatus"

export default function ViewUserModal(props) {

    const token = jwt.decode(Cookies.get("auth"));
    const user = props.userSelected
    const usersCount = props.usersCount

    const [editStatus, setEditStatus] = useState(false)
    const [deleteStatus, setDeleteStatus] = useState(false)

    const handleCloseModal = () => {
        setEditStatus(false)
        setDeleteStatus(false)
        props.setUserSelected('')
    }

    const title = deleteStatus ? 'Excluir usuário'
        : editStatus ? 'Editar usuário'
        : 'Informações do usuário'

    return (
        <Modal
            id="viewUserModal"
            title={title}
            icon={faUser}
            size="lg"
            onClose={handleCloseModal}
            hideFooter
        >
            {!editStatus && !deleteStatus && (
                <UserInfo
                    user={user}
                    token={token}
                    setDeleteStatus={setDeleteStatus}
                    setEditStatus={setEditStatus}
                    handleCloseModal={handleCloseModal}
                />
            )}
            {editStatus && (
                <EditUserStatus
                    user={user}
                    token={token}
                    setEditStatus={setEditStatus}
                    dataFunction={() => props.dataFunction()}
                />
            )}
            {deleteStatus && (
                <DeleteUserStatus
                    user={user}
                    token={token}
                    usersCount={usersCount}
                    setDeleteStatus={setDeleteStatus}
                    handleCloseModal={handleCloseModal}
                    dataFunction={() => props.dataFunction()}
                />
            )}
        </Modal>
    )
}
