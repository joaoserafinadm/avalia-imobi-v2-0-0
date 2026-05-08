import { useEffect, useState } from "react"
import Button from "../Button"


export default function CompanyLogo(props) {

    const [fileInputState, setFileInputState] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewSource, setPreviewSorce] = useState(props.data)

    useEffect(() => {

        props.onChange(previewSource)
    }, [previewSource])

    useEffect(() => {
        setPreviewSorce(props.data)
    }, [props.data])

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        previewFile(file)
    }

    const previewFile = (file) => {
        if (file) {
            const reader = new FileReader()
            if (reader) {
                reader.readAsDataURL(file)
                reader.onloadend = () => {
                    setPreviewSorce(reader.result)
                }
            }
        } else {
            setPreviewSorce(null)
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 d-flex justify-content-center">
                    {previewSource && (
                        <img src={previewSource} alt="chosen" height={70} className="fluid-image" style={{ "height": "auto", "max-height": "50px", "width": "auto", "max-width": "250px" }} />
                    )}
                    {!previewSource && (
                        <>
                            {props.data && (
                                <img src={props.data} alt="Company logo" className="fadeItem" style={{ "height": "auto", "max-height": "50px", "width": "auto", "max-width": "250px" }} />
                            )}
                        </>
                    )
                    }

                </div>
            </div>

            <div className="row mt-3">
                <div className="d-flex justify-content-center">
                    <input type="file" name="image/*" id="inputButton" onChange={handleFileInputChange}
                        value={fileInputState} className="form-input" hidden />
                    <label htmlFor="inputButton" className="btn btn-secondary btn-sm text-nowrap mx-1" type="button">{props.data ? 'Alterar Imagem' : 'Inserir Imagem'}</label>
                    {props.data && (
                        <Button variant="danger" size="sm" className="mx-1" onClick={() => { setPreviewSorce(null) }}>Remover Imagem</Button>
                    )}
                    <div className="d-flex align-items-center">
                        {/* <span
                            className="badge rounded-pill bg-success"
                            tabIndex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus"
                            data-bs-html="true" data-bs-placement="bottom"
                            data-bs-content="Remova o funda da imagem neste <a href='https://www.remove.bg/pt-br' target='_blank' title='Remover fundo da imagem'>link</a>">
                            <FontAwesomeIcon icon={faInfo} className="text-light" />
                        </span> */}
                    </div>

                </div>
            </div >

            <div className="row">
                <div className="col-12 d-flex justify-content-center">
                    <small><small>Utilizar imagem de no máximo 500 kb</small></small>
                </div>
            </div>

        </div >

    )
}