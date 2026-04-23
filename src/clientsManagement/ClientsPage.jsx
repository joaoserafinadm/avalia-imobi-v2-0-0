import { useEffect, useState } from "react"
import ClientCard from "./ClientCard"
import Pagination from "./Pagination"
import ClientCard_02 from "./ClientCard_02"
import ViewClientModal from "./ViewClientModal"
import ClientStatus from "./ClientStatus"
import DeleteClientModal from "./DeleteClientModal"



export default function ClientsPage(props) {

    const [idSelected, setIdSelected] = useState('')
    const [page, setPage] = useState(1)
    const [clientSelected, setClientSelected] = useState('')




    const clients = props.clients.filter(elem => {
        if (props.section === 'Meus Clientes') return elem.user_id === props.user_id
        if (props.section === 'Todos Clientes') return elem
    })


    const elementosPorPagina = 8;

    const handleClientsArray = (array, page) => {

        const indiceInicio = (page - 1) * elementosPorPagina;
        const indiceFim = indiceInicio + elementosPorPagina;

        return array.slice(indiceInicio, indiceFim);

    }


    return (
        <>
            
            {clients.length === 0 ?
                <div className="row my-5 scrollTop " id="clientsManagementList">
                    <div className="col-12  d-flex justify-content-center">
                        <span className="small text-secondary text-center">Nenhum cliente cadastrado</span>
                    </div>
                </div>
                :
                <>
                    <div className="row scrollTop  d-flex" id="clientsManagementList">

                        {handleClientsArray(clients, page).map(elem => {

                            return (
                                <div className="col-12 col-sm-6 col-xl-4 col-xxl-3 d-flex justify-content-center">
                                    <ClientCard_02 section={props.section}
                                        elem={elem} setClientSelected={value => props.setClientSelected(value)}
                                        setIdSelected={value => idSelected === value ? setIdSelected('') : setIdSelected(value)}
                                        idSelected={idSelected} />
                                </div>
                            )
                        })
                        }

                    </div>

                    <div className="row mt-3">
                        <div className="col-12 d-flex justify-content-center">
                            <Pagination array={clients} setPage={value => setPage(value)} page={page} elementosPorPagina={elementosPorPagina} />
                        </div>
                    </div>
                </>

            }




        </>
    )
}