import { useState } from "react"
import StyledDropzone from "../components/styledDropzone/StyledDropzone"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Info from "../components/info"
import Button from "../components/Button"
// import { setFiles } from "../../../store/NewClientForm/NewClientForm.actions"




export default function UploadFilesValuation(props) {

    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()

    const [filesArray, setFilesArray] = useState([])
    const [forceUpdate, setForceUpdate] = useState(0)
    const [imgLink, setImgLink] = useState('')

    const [imgLinkError, setImgLinkError] = useState(false)

    useEffect(() => {
        console.log("files", props.files)
    }, [props.files.length])


    const handleImportImgsLink = (link) => {

        if (link.includes(".jpg") || link.includes(".png")) {
            props.setFiles(props.files.concat([{ url: link }]))
            setImgLink('')
        } else {
            setImgLinkError('O link deve conter .jpg ou .png')
        }



    }


    return (
        <div className="row fadeItem mt-3">
            <label for="geralForm" className="form-label fw-bold">Fotos</label>
            <div className="col-12">

                <div className="row">
                    <label htmlFor="" className="form-label">Importe as fotos pelo link da imagem:
                        <Info id='uploadImgsLink'
                            content="Para importar imagens pelo link, você deve abrir a imagem em uma aba separada, e copiar o link que consta no navegador. Este deve terminar em .jpg ou .png" />

                    </label>
                    <div className="col-12 mb-1">
                        <div className="input-group">

                            <input type="text" className="form-control" id="clientNameItem"
                                value={imgLink} onChange={e => setImgLink(e.target.value)} />
                            <Button variant="primary" onClick={() => handleImportImgsLink(imgLink)}>Adicionar</Button>
                        </div>
                        <small className="text-danger">{imgLinkError}</small>
                    </div>
                    <div className="col-12">
                        ou:
                    </div>


                    <StyledDropzone setFiles={array => { props.setFiles(props.files.concat(array)); setForceUpdate(forceUpdate + 1) }} img baseStyle multiFiles>
                        <div className="row mt-3 d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                            <div className="col-12 d-flex justify-content-center align-items-center" >
                                <span>
                                    <small className="text-center">
                                        Clique aqui ou arraste as imagens
                                    </small>
                                </span>
                            </div>
                        </div>
                    </StyledDropzone>

                    <div className="col-12 my-2 d-flex align-items-center mb-5" style={{ "overflowX": 'scroll' }}>


                        {props.files.map((elem, index) => {
                            return (
                                <div className="m-3 d-flex justify-content-center align-items-top">
                                    <img src={elem?.url ? elem.url : URL.createObjectURL(elem)} alt="logo" id="logoItem" className="fileImgs fadeItem" />
                                    <button type="button" class="btn-close ms-1" aria-label="Close" onClick={() => { props.setFiles([...props.files.slice(0, index), ...props.files.slice(index + 1)]) }}></button>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </div>
    )
}