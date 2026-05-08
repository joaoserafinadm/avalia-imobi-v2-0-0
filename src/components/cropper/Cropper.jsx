import { useEffect, useState } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Button from '../Button'
if (typeof window !== "undefined") {
    const bootstrap = require("bootstrap");
}



const Cropper = (props) => {

    const [selectFile, setSelectFile] = useState(null)
    const [image, setImage] = useState(null)
    const [crop, setCrop] = useState({ aspect: 1 / 1, unit: 'px', width: 100, height: 100, x: 50, y: 50 })
    const [result, setResult] = useState(null)
    const [previousImage, setPreviousImage] = useState(null)

    useEffect(() => {
        setPreviousImage(props.data)
    }, [])

    useEffect(() => {
        props.onChange(result)
    }, [result])

    const handleFileChange = e => {
        if (e.target.files[0]) {
            setSelectFile(URL.createObjectURL(e.target.files[0]))
            setTimeout(() => {
                var modal = document.getElementById('cropperModal')
                var cropperModal = new bootstrap.Modal(modal)
                cropperModal.show()
            }, 20)
        } else {
            return
        }
    }


    function getCroppedImg() {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );

        const base64Image = canvas.toDataURL('image/jpeg');
        setResult(base64Image)
    }



    return (
        <div className="container">
            <div className="row ">
                <div className="col-12 d-flex justify-content-center mb-2">


                    {result ?
                        <div>
                            <img src={result} alt="Cropped Image" className="rounded-circle border border-secundary img-fluid shadow" width={128} height={128} />
                        </div>
                        :
                        <div>
                            <img src={previousImage ? previousImage : "/userIcon.png"} alt="Cropped Image" className="rounded-circle border border-secundary img-fluid shadow" width={128} height={128} />
                        </div>
                    }
                </div>

            </div>
            <div className="row ">
                <div className="col-12 d-flex justify-content-center">

                    <div className='text-center'>
                        <div>
                            <input type="file" accept="image/*" id="inputButton" onChange={e => handleFileChange(e)} hidden />
                            <label htmlFor="inputButton" className="btn akvo_btn_primary btn-sm text-nowrap mb-1">Alterar Imagem</label>
                        </div>
                        <div>
                            {selectFile &&
                                <Button variant="secondary" size="sm" className="text-nowrap" data-bs-toggle="modal" data-bs-target="#cropperModal">
                                    Editar imagem
                                </Button>
                            }
                        </div>
                    </div>


                </div>
            </div >
            <div className="modal fade" id="cropperModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="cropperModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="h5_modal modal-title" id="cropperModalLabel">Editar Imagem</h5>
                        </div>
                        <div className="modal-body d-flex justify-content-center">
                            <ReactCrop src={selectFile} onImageLoaded={setImage} crop={crop} onChange={setCrop} />
                        </div>
                        <div className="modal-footer">
                            {/* <label htmlFor="inputButton" className="akvo_btn akvo_btn_primary btn-sm">Alterar Imagem</label> */}
                            <Button variant="secondary" size="sm" onClick={getCroppedImg} data-bs-dismiss="modal">Cortar Imagem</Button>
                        </div>
                    </div>
                </div>
            </div>

        </div >

    )
}

export default Cropper