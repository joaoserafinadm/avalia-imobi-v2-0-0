import PolicyText from './PolicyText'
import styles from './Login.module.scss'


export default function PolicyModal(props) {



    return (
        <div className="modal fade" id="policyModal" tabindex="-1" aria-labelledby="policyModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className={`${styles.title} title-dark fs-2`} id="policyModalLabel" >Termos de uso, Politica de Dados e Política de Privacidade</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <PolicyText />

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}