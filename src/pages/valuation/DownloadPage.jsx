
import styles from './valuation.module.scss'


export default function DownloadPage(props) {

    const handleRestartValuation = () => {
        var myCarousel = document.querySelector('#valuationCarousel')
        var carousel = new bootstrap.Carousel(myCarousel)
        carousel.to(1)
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
                margin: 1,
                filename: `Avaliação - ${props.userData.companyName}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
    
            html2pdf().set(opt).from(element).save();
        }
    };
    

    return (
        <div className="col-12 ">
            <div className="row  d-flex justify-content-center align-items-center">
                <div className="card " style={{ height: '98vh', width: '98vw', overflowY: 'scroll' }} >
                    <div className="row d-flex align-items-center justify-content-center  h-100">
                        <div className="col-12 col-lg-6">
                            <div className="row text-center">
                                <div className="col-12 mt-3">
                                    <img src={props.userData?.logo ? props.userData?.logo : ""} alt="" className={styles.companyLogo} />
                                </div>
                                <div className="col-12 mt-3">
                                    <span className="fs-4">
                                        A equipe <b>{props.userData.companyName}</b> agradece a preferência!
                                    </span>
                                </div>
                                <div className="col-12 mt-3">
                                    <span className="fs-4">
                                        Em breve entrararemos em contato.
                                    </span>
                                </div>
                                <div className="col-12 mt-3">
                                    <button className="btn btn-outline-secondary btn-lg" onClick={() => handleRestartValuation()}>
                                        Visualizar novamente
                                    </button>
                                </div>
                                <div className="col-12 mt-3">
                                    <button className="btn btn-outline-secondary btn-lg" onClick={() => generatePDF()}>
                                        Baixar PDF
                                    </button>
                                </div>



                                {/* <div className="col-12 mt-3">
                                    <span className="fs-4">
                                        Clique o botão abaixo para fazer o download do PDF completo da avaliação do seu imóvel
                                    </span>
                                </div>
                                <div className="col-12 mt-3">



                                    <button className="btn btn-outline-secondary btn-lg">
                                        Baixar PDF
                                    </button>
                                </div> */}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

}