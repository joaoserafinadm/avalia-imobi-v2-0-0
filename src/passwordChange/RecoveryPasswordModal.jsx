import Button from "../components/Button";




export default function RecoveryPasswordModal(props) {



    return (
        <div className="modal fade" id="forgotPasswordModal" tabIndex="-1" aria-labelledby="forgotPasswordModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header text-start">
                        <h5 className={`h5_modal modal-title`} id="exampleModalLabel">Esqueceu a senha?</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {/* Alert */}
                        {emailSent && (
                            <div className="alert alert-success fadeItem" role="alert">
                                Verifique seu email!
                            </div>
                        )}
                        <p className="p">
                            Um link para recuperação de senha será enviado para o seu e-mail.
                        </p>
                    </div>
                    <div className="modal-footer">
                        <Button
                            variant="primary"
                            size="sm"
                            loading={loadingModal}
                            onClick={e => handleResetPassword(e)}
                        >
                            Enviar
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="ms-2"
                            data-bs-dismiss="modal"
                            onClick={() => { setEmailSent(false); setLoadingModal(false) }}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}