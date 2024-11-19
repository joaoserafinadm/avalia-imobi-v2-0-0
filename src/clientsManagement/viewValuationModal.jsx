import { useState } from "react";
import Sections from "../components/Sections";
import { generatePDF } from "../../utils/generatePdf";




export default function ViewValuationModal(props) {

    const valuationUrl = props?.clientSelected?.valuation?.urlToken
    const userData = props?.userData

    const token = props.token

    const [section, setSection] = useState('Apresentação')

    const handleShare = async (url) => {
        try {
            await navigator.share({
                title: 'Avaliação do imóvel',
                text: 'Avaliação do imóvel',
                url: url
            });
            console.log('Conteúdo compartilhado com sucesso!');
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
        }
    }




    return (
        <div class="modal fade" id="viewValuationModal" tabindex="-1" aria-labelledby="Modal" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title title-dark bold">Avaliação - Apresentação</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body-lg" style={{ height: "100vh" }}>

                        <div className="container carousel  " style={{ height: "80%" }} data-bs-touch="false" data-bs-interval='false' id="showValuationSection">

                            <Sections section={section} idTarget="showValuationSection"
                                setSection={value => setSection(value)}
                                sections={["Apresentação"]} />
                            {/* <Sections section={section} idTarget="showValuationSection"
                                setSection={value => setSection(value)}
                                sections={["Apresentação", "PDF"]} /> */}



                            <div className="carousel-inner " style={{ height: "100%" }}>
                                <div className="carousel-item active" style={{ height: "100%" }}>
                                    {valuationUrl && (

                                        <iframe src={valuationUrl + '&userId=' + token.sub + '&disabled=true'} width="100%" height="550px" style={{ height: "100%" }} frameborder="0" allowfullscreen></iframe>
                                    )}
                                </div>
                            </div>
                            <div className="carousel-inner ">
                                <div className="carousel-item ">
                                    dsadsa{valuationUrl}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal" onClick={() => props.setClientSelected('')}>Fechar</button>
                        <button type="button" class="btn btn-orange btn-sm" onClick={() => generatePDF('valuationPdf', userData?.companyName)}>Baixar PDF</button>
                        <button type="button" class="btn btn-orange btn-sm" onClick={() => handleShare(valuationUrl + '&userId=' + token.sub)}>Compartilhar apresentação</button>
                    </div>
                </div>
            </div>
        </div>
    )
}