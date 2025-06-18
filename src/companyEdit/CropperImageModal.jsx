import { useEffect, useState } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

if (typeof window !== "undefined") {
    const bootstrap = require("bootstrap");
}

export default function CropperImageModal(props) {
    const [image, setImage] = useState(null)
    const [crop, setCrop] = useState({
        aspect: props.aspect ? props.aspect : '',
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
    })

    function getCroppedImg() {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Se não há crop válido, usar a imagem inteira
    const isCropValid = crop?.width && crop?.height;

    const cropX = isCropValid ? crop.x * scaleX : 0;
    const cropY = isCropValid ? crop.y * scaleY : 0;
    const cropWidth = isCropValid ? crop.width * scaleX : image.naturalWidth;
    const cropHeight = isCropValid ? crop.height * scaleY : image.naturalHeight;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
    );

    const base64Image = canvas.toDataURL('image/png');
    props.setResult(base64Image);
}

    return (
        <div className="modal fade" id="cropperImageModal" tabIndex="-1" aria-labelledby="ImageHeaderModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content shadow-lg border-0">
                    {/* Header com gradiente sutil */}
                    <div className="modal-header bg-light border-0 py-3">
                        <h5 className="modal-title" id="ImageHeaderModalLabel">
                            Recortar imagem
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    {/* Body com padding melhorado */}
                    <div className="modal-body p-4">
                        <div className="row">
                            <div className="col-12">
                                {/* Container da imagem com dimensões controladas */}
                                <div className="border rounded-3 p-3 bg-light position-relative overflow-hidden d-flex justify-content-center align-items-center" 
                                     style={{ minHeight: '400px', maxHeight: '70vh' }}>
                                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                                        <ReactCrop
                                            src={props.selectFile}
                                            onImageLoaded={setImage}
                                            crop={crop}
                                            onChange={setCrop}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain',
                                                borderRadius: '8px'
                                            }}
                                            imageStyle={{
                                                maxWidth: '100%',
                                                maxHeight: '60vh',
                                                objectFit: 'contain',
                                                width: 'auto',
                                                height: 'auto'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Instruções para o usuário */}
                                <div className="mt-3 p-3 bg-info bg-opacity-10 border border-info border-opacity-25 rounded-3">
                                    <div className="d-flex align-items-start">
                                        <div>
                                            <small className="text-info fw-semibold">Dica:</small>
                                            <small className="text-muted d-block">
                                                Arraste as bordas da seleção para ajustar a área de recorte.
                                                Você pode mover a seleção clicando e arrastando.
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer com botões melhorados */}
                    <div className="modal-footer bg-light border-0 py-3">
                        <div className="d-flex gap-2 ms-auto">
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4"
                                data-bs-dismiss="modal"
                            >
                                <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                </svg>
                                Cancelar
                            </button>
                            <button
                                className="btn btn-orange px-4 fw-semibold shadow-sm"
                                onClick={getCroppedImg}
                                data-bs-dismiss="modal"
                                style={{
                                    transition: 'all 0.2s ease-in-out'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                                </svg>
                                Aplicar Recorte
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos CSS customizados */}
            <style jsx>{`
                .modal-content {
                    border-radius: 12px !important;
                }
                
                .btn-orange:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                }
                
                .ReactCrop__crop-selection {
                    border: 2px solid #0d6efd !important;
                    box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.5) !important;
                }
                
                .ReactCrop__drag-handle {
                    background-color: #0d6efd !important;
                    border: 1px solid #ffffff !important;
                    width: 12px !important;
                    height: 12px !important;
                }
                
                .ReactCrop__drag-handle:after {
                    background-color: #0d6efd !important;
                }
                
                /* Garantir que a imagem seja responsiva */
                .ReactCrop img {
                    max-width: 100% !important;
                    max-height: 60vh !important;
                    width: auto !important;
                    height: auto !important;
                    object-fit: contain !important;
                }
                
                @media (max-width: 1200px) {
                    .modal-dialog {
                        max-width: 90% !important;
                    }
                }
                
                @media (max-width: 768px) {
                    .modal-dialog {
                        margin: 0.5rem !important;
                        max-width: calc(100% - 1rem) !important;
                    }
                    
                    .modal-body {
                        padding: 1rem !important;
                    }
                    
                    .ReactCrop img {
                        max-height: 50vh !important;
                    }
                }
                
                @media (max-width: 576px) {
                    .ReactCrop img {
                        max-height: 40vh !important;
                    }
                }
            `}</style>
        </div>
    )
}