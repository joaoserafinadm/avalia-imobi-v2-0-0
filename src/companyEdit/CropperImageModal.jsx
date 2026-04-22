import { useState } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { faCropSimple, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal, { ModalBtnPrimary, ModalBtnSecondary } from '../components/Modal'

if (typeof window !== 'undefined') {
    const bootstrap = require('bootstrap')
}

export default function CropperImageModal(props) {
    const [image, setImage] = useState(null)
    const [crop, setCrop] = useState({
        aspect: props.aspect ? props.aspect : '',
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25,
    })

    function getCroppedImg() {
        const canvas = document.createElement('canvas')
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        const isCropValid = crop?.width && crop?.height
        const cropX = isCropValid ? crop.x * scaleX : 0
        const cropY = isCropValid ? crop.y * scaleY : 0
        const cropWidth = isCropValid ? crop.width * scaleX : image.naturalWidth
        const cropHeight = isCropValid ? crop.height * scaleY : image.naturalHeight
        canvas.width = cropWidth
        canvas.height = cropHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
        const base64Image = canvas.toDataURL('image/png')
        props.setResult(base64Image)
    }

    return (
        <>
            <Modal
                id="cropperImageModal"
                title="Recortar imagem"
                icon={faCropSimple}
                size="xl"
                footer={
                    <>
                        <ModalBtnSecondary>Cancelar</ModalBtnSecondary>
                        <ModalBtnPrimary icon={faCropSimple} onClick={getCroppedImg}>
                            Aplicar recorte
                        </ModalBtnPrimary>
                    </>
                }
            >
                {/* Crop area */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                    maxHeight: '65vh',
                    overflow: 'hidden',
                }}>
                    <ReactCrop
                        src={props.selectFile}
                        onImageLoaded={setImage}
                        crop={crop}
                        onChange={setCrop}
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        imageStyle={{
                            maxWidth: '100%',
                            maxHeight: '60vh',
                            objectFit: 'contain',
                            width: 'auto',
                            height: 'auto',
                            borderRadius: '6px',
                        }}
                    />
                </div>

                {/* Tip */}
                <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    background: 'rgba(245,135,79,0.06)',
                    border: '1px solid rgba(245,135,79,0.18)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                }}>
                    <FontAwesomeIcon
                        icon={faLightbulb}
                        style={{ color: '#f5874f', fontSize: '0.8rem', marginTop: '2px', flexShrink: 0 }}
                    />
                    <p style={{
                        margin: 0,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.45)',
                        lineHeight: 1.5,
                    }}>
                        Arraste as bordas da seleção para ajustar a área de recorte.
                        Você pode mover a seleção clicando e arrastando.
                    </p>
                </div>
            </Modal>

            <style jsx global>{`
                #cropperImageModal .ReactCrop__crop-selection {
                    border: 2px solid #f5874f !important;
                    box-shadow: 0 0 0 9999em rgba(0,0,0,0.6) !important;
                }
                #cropperImageModal .ReactCrop__drag-handle {
                    background-color: #f5874f !important;
                    border: 2px solid #0d1420 !important;
                    width: 10px !important;
                    height: 10px !important;
                    border-radius: 50% !important;
                }
                #cropperImageModal .ReactCrop__drag-handle::after {
                    background-color: #f5874f !important;
                }
            `}</style>
        </>
    )
}
