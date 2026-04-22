import { useState } from "react";
import Sections from "../components/Sections";
import { generatePDF } from "../../utils/generatePdf";
import Modal, { ModalBtnSecondary, ModalBtnPrimary } from "../components/Modal";
import { faChartLine, faDownload, faShareNodes } from "@fortawesome/free-solid-svg-icons";

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
        <Modal
            id="viewValuationModal"
            title="Avaliação"
            subtitle="Visualização da apresentação"
            icon={faChartLine}
            size="xl"
            footer={
                <>
                    <ModalBtnSecondary onClick={() => props.setClientSelected('')}>
                        Fechar
                    </ModalBtnSecondary>
                    <ModalBtnPrimary
                        dismiss={false}
                        icon={faDownload}
                        onClick={() => generatePDF('valuationPdf', userData?.companyName)}
                    >
                        Baixar PDF
                    </ModalBtnPrimary>
                    <ModalBtnPrimary
                        dismiss={false}
                        icon={faShareNodes}
                        onClick={() => handleShare(valuationUrl + '&userId=' + token.sub)}
                    >
                        Compartilhar
                    </ModalBtnPrimary>
                </>
            }
        >
            <div
                className="container carousel"
                data-bs-touch="false"
                data-bs-interval="false"
                id="showValuationSection"
                style={{ height: '60vh' }}
            >
                <Sections
                    section={section}
                    idTarget="showValuationSection"
                    setSection={value => setSection(value)}
                    sections={["Apresentação"]}
                />

                <div className="carousel-inner" style={{ height: '100%' }}>
                    <div className="carousel-item active" style={{ height: '100%' }}>
                        {valuationUrl && (
                            <iframe
                                src={valuationUrl + '&userId=' + token.sub + '&disabled=true'}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowFullScreen
                            />
                        )}
                    </div>
                </div>

                <div className="carousel-inner">
                    <div className="carousel-item">
                        {valuationUrl}
                    </div>
                </div>

            </div>
        </Modal>
    )
}
