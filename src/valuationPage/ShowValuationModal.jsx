import { useEffect, useState } from "react";
import Sections from "../components/Sections";
import { useRouter } from "next/router";
import handleShare from "../../utils/handleShare";
import ValuationPdf from "../pages/valuation/valuationPdf";




export default function ShowValuationModal(props) {

    const router = useRouter()

    const valuationUrl = props.valuationUrl

    const token = props.token

    const { userData, clientData } = props

    const [section, setSection] = useState('Apresentação')
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (userData && clientData) {

            generatePDF()
        }
    }, [userData, clientData])

    const generatePDF = async () => {
        if (typeof window !== 'undefined') {
            const html2pdf = (await import('html2pdf.js')).default;
            const element = document.getElementById('valuationPdf');

            // Aguarde o carregamento das imagens
            const images = Array.from(element.querySelectorAll('img'));
            await Promise.all(images.map(img => new Promise(resolve => {
                if (img.complete) resolve();
                else img.onload = resolve;
            })));

            const opt = {
                margin: 0,
                filename: `Avaliação - ${userData?.companyName}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Gera o PDF como Blob
            const pdfBlob = await html2pdf().set(opt).from(element).toPdf().get('pdf');
            const blobUrl = pdfBlob && URL.createObjectURL(pdfBlob);

            // Define o PDF no estado
            setPdfUrl(blobUrl);
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
                        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal" >Fechar</button>
                        <button type="button" class="btn btn-orange btn-sm">Baixar PDF</button>
                        <button type="button" class="btn btn-orange btn-sm" onClick={() => handleShare(valuationUrl + '&userId=' + token.sub)}>Compartilhar apresentação</button>
                    </div>
                </div>
            </div>
        </div>
    )
}