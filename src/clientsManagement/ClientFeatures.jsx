import { faMapMarkerAlt, faRulerCombined, faBed, faBath, faHome, faCar, faBuilding, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showClientInfo } from "../../utils/showClientInfo";
import { valueShow } from "../../utils/valueShow";

export default function ClientFeatures(props) {
    const client = props.client;

    // Função para formatar valor monetário
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    if (!showClientInfo(client)) {
        return (
            <div className="text-center py-3">
                <span className="text-muted ">Informações Desatualizadas</span>
            </div>
        );
    }

    return (
        <div className="client-features">
            {/* Valor */}
            {/* {valueShow(client?.valuation?.valueSelected, client?.valuation?.valuationCalc) && (
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="text-center py-2 px-3 rounded" style={{
                            backgroundColor: '#f5874f',
                            color: 'white'
                        }}>
                            <span className="fw-bold fs-5">
                                {formatCurrency(valueShow(client?.valuation?.valueSelected, client?.valuation?.valuationCalc))}
                            </span>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Localização */}
            <div className="row mb-3">
                <div className="col-12">
                    <div className="d-flex align-items-center justify-content-center text-center" style={{ color: '#5a5a5a' }}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" style={{ color: '#faa954' }} />
                        <span>
                            {client?.bairro && client?.cidade && client?.uf ? 
                                `${client.bairro}, ${client.cidade} / ${client.uf}` : 
                                'Endereço não informado'
                            }
                        </span>
                    </div>
                </div>
            </div>

            <hr className="my-2" style={{ borderColor: '#faa954' }} />

            {/* Características por Tipo */}
            {client.propertyType === "Apartamento" && (
                <div className="row d-flex justify-content-center">
                    <div className="col-6 my-5">
                        <div className="text-center">
                            <div className="fw-bold ">Área Total</div>
                            <div style={{ color: '#f5874f' }}>{client?.areaTotal || 0} m²</div>
                        </div>
                    </div>
                    <div className="col-6 my-5">
                        <div className="text-center">
                            <div className="fw-bold ">Área Privativa</div>
                            <div style={{ color: '#f5874f' }}>{client?.areaTotalPrivativa || 0} m²</div>
                        </div>
                    </div>
                    <div className="col-4 text-center">
                        
                        <span className="fw-bold">{client.quartos || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>quarto{client.quartos != 1 ? 's' : ''}</div>
                    </div>
                    <div className="col-4 text-center">
                        
                        <span className="fw-bold">{client.banheiros || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>banheiro{client.banheiros != 1 ? 's' : ''}</div>
                    </div>
                    <div className="col-4 text-center">
                        
                        <span className="fw-bold">{client.suites || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>suíte{client.suites != 1 ? 's' : ''}</div>
                    </div>
                    <div className="col-4 text-center">
                        
                        <span className="fw-bold">{client.vagasGaragem || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>vaga{client.vagasGaragem != 1 ? 's' : ''}</div>
                    </div>
                </div>
            )}

            {client.propertyType === "Casa" && (
                <div className="row d-flex justify-content-center">
                    <div className="col-6 my-5">
                        <div className="text-center">
                            <div className="fw-bold ">Área do Terreno</div>
                            <div style={{ color: '#f5874f' }}>{client?.areaTotal || 0} m²</div>
                        </div>
                    </div>
                    <div className="col-6 my-5">
                        <div className="text-center">
                            <div className="fw-bold ">Área da Casa</div>
                            <div style={{ color: '#f5874f' }}>{client?.areaTotalPrivativa || 0} m²</div>
                        </div>
                    </div>
                    <div className="col-4 col-lg-2 text-center">
                        
                        <span className="fw-bold">{client.pavimentos || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>pavimento{client.pavimentos != 1 ? 's' : ''}</div>
                    </div>
                    <div className="col-4 col-lg-2 text-center">
                        
                        <span className="fw-bold">{client.quartos || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>quarto{client.quartos != 1 ? 's' : ''}</div>
                    </div>
                    <div className="col-4 col-lg-2 text-center">
                        
                        <span className="fw-bold">{client.banheiros || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>banheiro{client.banheiros != 1 ? 's' : ''}</div>
                    </div>
                    <div className="col-4 col-lg-2 text-center">
                        
                        <span className="fw-bold">{client.suites || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>suíte{client.suites != 1 ? 's' : ''}</div>
                    </div>
                    <div className="col-4 col-lg-2 text-center">
                        
                        <span className="fw-bold">{client.vagasGaragem || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>vaga{client.vagasGaragem != 1 ? 's' : ''}</div>
                    </div>
                </div>
            )}

            {client.propertyType === "Comercial" && (
                <div className="row d-flex justify-content-center">
                    <div className="col-6 my-5">
                        <div className="text-center">
                            <div className="fw-bold ">Área Total</div>
                            <div style={{ color: '#f5874f' }}>{client?.areaTotal || 0} m²</div>
                        </div>
                    </div>
                    <div className="col-6 my-5">
                        <div className="text-center">
                            <div className="fw-bold ">Área Privativa</div>
                            <div style={{ color: '#f5874f' }}>{client?.areaTotalPrivativa || 0} m²</div>
                        </div>
                    </div>
                    <div className="col-3 text-center">
                        
                        <span className="fw-bold">{client.pavimentos || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>pavimento{client.pavimentos != 1 ? 's' : ''}</div>
                    </div>
                    <div className="col-3 text-center">
                        
                        <span className="fw-bold">{client.salas || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>sala{client.salas != 1 ? 's' : ''}</div>
                    </div>
                    <div className="col-3 text-center">
                        
                        <span className="fw-bold">{client.banheiros || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>banheiro{client.banheiros != 1 ? 's' : ''}</div>
                    </div>
                    <div className="col-3 text-center">
                        
                        <span className="fw-bold">{client.vagasGaragem || 0}</span>
                        <div className=" text-muted" style={{fontSize: '13px'}}>vaga{client.vagasGaragem != 1 ? 's' : ''}</div>
                    </div>
                </div>
            )}

            {client.propertyType === "Terreno" && (
                <div className="row d-flex justify-content-center">
                    <div className="col-12 text-center">
                        <FontAwesomeIcon icon={faRulerCombined} className="me-2" style={{ color: '#faa954' }} />
                        <span className="fw-bold">Área Total: </span>
                        <span style={{ color: '#f5874f', fontSize: '1.1rem' }}>{client?.areaTotal || 0} m²</span>
                    </div>
                </div>
            )}
        </div>
    );
}