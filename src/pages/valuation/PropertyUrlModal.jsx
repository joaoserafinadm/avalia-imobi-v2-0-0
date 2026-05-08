import Button from "../../components/Button";



export default function PropertyUrlModal(props) {

    return (
        <div class="modal fade" id="propertyUrlModal" tabindex="-1" aria-labelledby="propertyUrlModalLabel" aria-hidden="true" >
            <div class="modal-dialog modal-xl"  >
                <div class="modal-content ">
                    <div class="modal-header">
                        <h5 class="modal-title" id="propertyUrlModalLabel">Visualizar imóvel</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => props.setPropertyUrl('')}></button>
                    </div>
                    <div class="modal-body-lg" style={{ height: '75vh' }}>
                        <iframe src={props.propertyUrl} style={{ width: '100%', height: '100%' }}></iframe>
                    </div>
                    <div class="modal-footer">
                        <Button variant="secondary" data-bs-dismiss="modal" onClick={() => props.setPropertyUrl('')}>Fechar</Button>
                    </div>
                </div>
            </div>
        </div>
    )


}