import { useEffect, useState } from "react"
import Sections from "../components/Sections"
import ClientInfo from "./ClientInfo"
import Valuation from "./Valuation"
import Modal, { ModalBtnSecondary } from "../components/Modal"
import { faHouse } from "@fortawesome/free-solid-svg-icons"

export default function ViewClientModal(props) {

    const client = props.clientSelected
    const userData = props.userData
    const modalSection = props.modalSection

    const [section, setSection] = useState(modalSection || 'Informações')

    useEffect(() => {
        if (!modalSection) {
            setSection('Informações')
        }
    }, [client._id])

    const closeSection = () => setSection('Informações')

    return (
        <Modal
            id="viewClientModal"
            title={`${client?.clientName || ''} ${client?.clientLastName || ''}`.trim() || 'Cliente'}
            icon={faHouse}
            size="lg"
            onClose={closeSection}
            footer={
                <ModalBtnSecondary onClick={closeSection}>
                    Fechar
                </ModalBtnSecondary>
            }
        >
            <div className="container carousel slide" data-bs-touch="false" data-bs-interval="false" id="clientManage">

                <Sections
                    section={section}
                    idTarget="clientManage"
                    setSection={value => setSection(value)}
                    sections={["Informações", "Avaliação"]}
                />

                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="row d-flex justify-content-center">
                            <div className="col-12">
                                <ClientInfo client={client} valuationButton />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="carousel-inner">
                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center">
                            <div className="col-12">
                                <Valuation client={client} dataFunction={props.dataFunction} userData={userData} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Modal>
    )
}
