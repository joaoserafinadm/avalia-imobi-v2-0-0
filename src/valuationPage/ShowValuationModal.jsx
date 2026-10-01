import { useEffect, useState } from "react";
import Sections from "../components/Sections";
import { useRouter } from "next/router";
import handleShare from "../../utils/handleShare";
import ValuationPdf from "../pages/valuation/valuationPdf";
import Button from "../components/Button";
import PdfDownloadNotice from "../components/pdfDownloadNotice";
import { buildPdfBlob, pdfFileName, triggerDownload } from "../../utils/generatePdf";




export default function ShowValuationModal(props) {

    const router = useRouter()

    const valuationUrl = props.valuationUrl

    const token = props.token

    const { userData, clientData } = props

    const [section, setSection] = useState('Apresentação')
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfStatus, setPdfStatus] = useState('idle');

    useEffect(() => {
        if (userData && clientData) {

            generatePDF()
        }
    }, [userData, clientData])

    useEffect(() => () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }, [pdfUrl])

    const handleDownload = () => {
        if (!pdfUrl) return
        triggerDownload(pdfUrl, pdfFileName(userData?.companyName))
        setPdfStatus('done')
    }

    const generatePDF = async () => {
        try {
            const blob = await buildPdfBlob('valuationPdf');
            setPdfUrl(URL.createObjectURL(blob));
        } catch (err) {
            console.error('Erro ao gerar PDF:', err);
            setPdfStatus('error');
        }
    };



    return (
        <div class="modal fade" id="showValuationModal" tabindex="-1" aria-labelledby="Modal" aria-hidden="true">

            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <ValuationPdf
                    userData={userData}
                    clientData={clientData} />
            </div>


            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title title-dark bold">Avaliação - Apresentação</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body-lg" style={{ height: "100vh" }}>

                        <div className="container carousel  " data-bs-touch="false" data-bs-interval='false' id="showValuationSection">

                            <Sections section={section} idTarget="showValuationSection"
                                setSection={value => setSection(value)}
                                sections={["Apresentação", "PDF"]} />



                            <div className="carousel-inner ">
                                <div className="carousel-item active">

                                    <iframe src={valuationUrl + '&userId=' + token.sub + '&disabled=true'} width="100%" style={{ height: "100vh" }} frameborder="0" allowfullscreen></iframe>
                                </div>
                            </div>
                            <div className="carousel-inner ">
                                <div className="carousel-item ">
                                    {pdfUrl && <iframe src={pdfUrl} width="100%" height="600px" />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" size="sm" data-bs-dismiss="modal">Fechar</Button>
                        <PdfDownloadNotice status={pdfStatus} pdfUrl={pdfUrl} style={{ marginRight: 'auto' }} />
                        <Button variant="primary" size="sm" loading={!pdfUrl && pdfStatus !== 'error'} disabled={!pdfUrl} onClick={handleDownload}>Baixar PDF</Button>
                        <Button variant="primary" size="sm" onClick={() => handleShare(valuationUrl + '&userId=' + token.sub)}>Compartilhar apresentação</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}