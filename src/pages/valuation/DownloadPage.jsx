import html2canvas from 'html2canvas'
import styles from './valuation.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faEye, faCheckCircle, faHandshake, faFilePdf, faPhone } from "@fortawesome/free-solid-svg-icons"
import { Download, Eye, View } from 'lucide-react'

export default function DownloadPage(props) {

    const handleRestartValuation = () => {
        var myCarousel = document.querySelector('#valuationCarousel')
        var carousel = new bootstrap.Carousel(myCarousel)
        carousel.to(1)
    }

    const captureMapImage = async () => {
        if (mapRef.current) {
            // Captura o mapa como imagem com html2canvas
            const canvas = await html2canvas(mapPdf, { useCORS: true });
            const imgData = canvas.toDataURL("image/png");
            setMapImage(imgData);
            console.log("imgData", imgData) // Armazena a imagem capturada
        }
    }

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
                filename: `Avaliação - ${props.userData.companyName}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
    
            html2pdf().set(opt).from(element).save();
        }
    }

    return (
        <div className="container-fluid p-0">
            <div className="row justify-content-center align-items-center min-vh-100 m-0">
                <div className="col-12 col-xxl-10">
                    <div className="card shadow-lg border-0" style={{ minHeight: '95vh', borderRadius: '20px' }}>
                        <div className="card-body p-0" style={{ overflowY: 'auto', maxHeight: '95vh' }}>
                            
                            {/* Header Section */}
                            <div className="text-center py-5" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', borderRadius: '20px 20px 0 0' }}>
                                <div className="container">
                                    <h1 className="display-4 fw-bold text-white mb-3">
                                        <FontAwesomeIcon icon={faCheckCircle} className="me-3" />
                                        Avaliação Concluída!
                                    </h1>
                                    <p className="lead text-white opacity-90 mb-0">Sua avaliação personalizada está pronta</p>
                                </div>
                            </div>

                            <div className="container py-5">
                                {/* Success Message Section */}
                                <div className="row justify-content-center mb-5">
                                    <div className="col-lg-8">
                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                            <div className="card-body text-center">
                                                {/* Company Logo */}
                                                {props.userData?.logo && (
                                                    <div className="mb-4">
                                                        <img 
                                                            src={props.userData.logo} 
                                                            alt="Logo da empresa" 
                                                            className={styles.companyLogo}
                                                            style={{ maxHeight: '225px', maxWidth: '275px', objectFit: 'contain' }}
                                                        />
                                                    </div>
                                                )}
                                                
                                                <div className="mb-4">
                                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                         style={{ width: '60px', height: '60px', backgroundColor: '#28a745' }}>
                                                        <FontAwesomeIcon icon={faHandshake} className="fs-4 text-white" />
                                                    </div>
                                                </div>

                                                <h3 className="fw-bold mb-3" style={{ color: '#5a5a5a' }}>
                                                    A equipe <span style={{ color: '#28a745' }}>{props.userData.companyName}</span> agradece a preferência!
                                                </h3>
                                                
                                                <p className="text-muted fs-5 mb-0">
                                                    Em breve entraremos em contato para dar continuidade ao processo.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons Section */}
                                <div className="row justify-content-center mb-5">
                                    <div className="col-lg-8">
                                        <div className="row g-4">
                                            {/* View Again Card */}
                                            <div className="col-md-6">
                                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                                    <div className="card-body p-4 text-center">
                                                        <div className="mb-3">
                                                            <div className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                                                 style={{ width: '50px', height: '50px', backgroundColor: '#f5874f' }}>
                                                                <FontAwesomeIcon icon={faEye} className="fs-5 text-white" />
                                                            </div>
                                                        </div>
                                                        <h5 className="fw-bold mb-3" style={{ color: '#5a5a5a' }}>
                                                            Visualizar Novamente
                                                        </h5>
                                                        <p className="text-muted mb-4">
                                                            Revise todos os detalhes da sua avaliação
                                                        </p>
                                                        <button 
                                                            className="btn btn-outline-orange btn-lg w-100" 
                                                            onClick={() => handleRestartValuation()}                                                          
                                                         
                                                        >
                                                            <Eye className="me-2" />
                                                            Visualizar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Download PDF Card */}
                                            <div className="col-md-6">
                                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                                    <div className="card-body p-4 text-center">
                                                        <div className="mb-3">
                                                            <div className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                                                 style={{ width: '50px', height: '50px', backgroundColor: '#f5874f' }}>
                                                                <FontAwesomeIcon icon={faFilePdf} className="fs-5 text-white" />
                                                            </div>
                                                        </div>
                                                        <h5 className="fw-bold mb-3" style={{ color: '#5a5a5a' }}>
                                                            Download PDF
                                                        </h5>
                                                        <p className="text-muted mb-4">
                                                            Baixe o relatório completo da avaliação
                                                        </p>
                                                        <button 
                                                            className="btn btn-lg btn-orange w-100" 
                                                            onClick={() => generatePDF()}
                                                        >
                                                            <Download className="me-2" />
                                                            Baixar PDF
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Steps Section */}
                                <div className="row justify-content-center">
                                    <div className="col-lg-8">
                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #6f42c1 0%, #007bff 100%)' }}>
                                            <div className="card-body p-5 text-center text-white">
                                                <div className="mb-3">
                                                    <FontAwesomeIcon icon={faPhone} className="fs-1 mb-3" />
                                                </div>
                                                <h4 className="fw-bold mb-3">Próximos Passos</h4>
                                                <p className="mb-4 opacity-90">
                                                    Nossa equipe especializada entrará em contato em breve para:
                                                </p>
                                                <div className="row g-3">
                                                    <div className="col-md-4">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <small className="text-white">• Esclarecer dúvidas</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <small className="text-white">• Agendar visita</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <small className="text-white">• Iniciar o processo</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}