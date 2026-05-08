import { faStar, faComment, faThumbsUp, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import Icons from "../../components/icons"
import PdfConfigModal from "./PdfConfigModal"
import axios from "axios"
import baseUrl from "../../../utils/baseUrl"
import { SpinnerSM } from "../../components/loading/Spinners"
import styles from './valuation.module.scss'
import Button from "../../components/Button"


export default function FinalPage(props) {
    const { queryClientId, queryUserId, clientData } = props

    const [comment, setCommet] = useState(clientData?.valuation?.valuationComment)
    const [stars, setStars] = useState(clientData?.valuation?.stars || 0)
    const [loadingSave, setLoadingSave] = useState(false)

    const handleSave = async () => {
        setLoadingSave(true)

        await axios.patch(`${baseUrl()}/api/valuation/valuationAvaliation`, {
            user_id: queryUserId,
            client_id: queryClientId,
            stars: stars,
            comment: comment
        }).then(res => {
            var myCarousel = document.querySelector('#valuationCarousel')
            var carousel = new bootstrap.Carousel(myCarousel)
            carousel.next()
            setLoadingSave(false)
        }).catch(e => {
            console.log('e', e)
        })
    }

    return (
        <div className="container-fluid p-0">
            <div className="row justify-content-center align-items-center min-vh-100 m-0">
                <div className="col-12 col-xxl-10">
                    <div className="card bg-light shadow-lg border-0" style={{ minHeight: '95vh', borderRadius: '20px' }}>
                        <div className="card-body p-0" style={{ overflowY: 'auto', maxHeight: '95vh' }}>

                            {/* Header Section */}
                            <div className="text-center py-5" style={{ background: 'linear-gradient(135deg, #f5874f 0%, #faa954 100%)', borderRadius: '20px 20px 0 0' }}>
                                <div className="container">
                                    <h1 className="display-4 fw-bold text-white mb-3">
                                        <FontAwesomeIcon icon={faThumbsUp} className="me-3" />
                                        Sua Opinião é Importante!
                                    </h1>
                                    <p className="lead text-white opacity-90 mb-0">Ajude-nos a melhorar nossos serviços com seu feedback</p>
                                </div>
                            </div>

                            <div className="container py-5">
                                {/* Comment Section */}
                                <div className="row justify-content-center mb-5">
                                    <div className="col-lg-8">
                                        <div className="card bg-light border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                            <div className="card-body ">
                                                <div className="text-center mb-4">
                                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                        style={{ width: '60px', height: '60px', backgroundColor: '#f5874f' }}>
                                                        <FontAwesomeIcon icon={faComment} className="fs-4 text-white" />
                                                    </div>
                                                    <h3 className="fw-bold mb-3" style={{ color: '#5a5a5a' }}>
                                                        Deixe sua Observação
                                                    </h3>
                                                    <p className="text-muted mb-4">
                                                        Gostaria de deixar alguma observação sobre esta avaliação?
                                                    </p>
                                                </div>

                                                <div className="mb-4">
                                                    <textarea
                                                                                                                className={styles.commentTextarea}

                                                        rows="4"
                                                        placeholder="Digite aqui seus comentários, sugestões ou observações..."
                                                        value={comment}
                                                        onChange={(e) => { setCommet(e.target.value) }}
                                                        style={{
                                                            borderRadius: '10px',
                                                            backgroundColor: '#f8f9fa',
                                                            resize: 'none',
                                                            fontSize: '1rem',
                                                            padding: '15px'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-5" style={{ height: '3px', backgroundColor: '#f5874f', border: 'none', borderRadius: '2px' }} />

                                {/* Rating Section */}
                                <div className="row justify-content-center mb-5">
                                    <div className="col-lg-8">
                                        <div className="card bg-light border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                            <div className="card-body ">
                                                <div className="text-center mb-4">
                                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                        style={{ width: '60px', height: '60px', backgroundColor: '#faa954' }}>
                                                        <FontAwesomeIcon icon={faStar} className="fs-4 text-white" />
                                                    </div>
                                                    <h3 className="fw-bold mb-3" style={{ color: '#5a5a5a' }}>
                                                        Avalie nossa Avaliação
                                                    </h3>
                                                    <p className="text-muted mb-4">
                                                        Qual foi sua satisfação com a avaliação?
                                                    </p>
                                                </div>

                                                {/* Stars Rating */}
                                                <div className="text-center mb-4">
                                                    <div className="d-inline-block p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                                                        {[1, 2, 3, 4, 5].map((starNumber) => (

                                                            <FontAwesomeIcon
                                                                icon={faStar}
                                                                className={`fs-1  mx-2 ${stars >= starNumber ? 'text-warning' : 'text-secondary'}`}
                                                                key={starNumber}
                                                                type="button"
                                                                onClick={() => { setStars(starNumber) }}
                                                                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                                             
                                                            />
                                                        ))}
                                                    </div>

                                                    {stars > 0 && (
                                                        <div className="mt-3">
                                                            <span className="badge bg-success fs-6 px-3 py-2" style={{ borderRadius: '20px' }}>
                                                                {stars} de 5 estrelas - {
                                                                    stars === 5 ? 'Excelente!' :
                                                                        stars === 4 ? 'Muito Bom!' :
                                                                            stars === 3 ? 'Bom!' :
                                                                                stars === 2 ? 'Regular' : 'Precisa Melhorar'
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {!stars && (
                                                    <div className="alert text-dark border-0 text-center" style={{ backgroundColor: '#fff3cd', borderRadius: '10px' }}>
                                                        <small className="text-warning-emphasis">
                                                            <FontAwesomeIcon icon={faStar} className="me-2" />
                                                            Para continuar você deve dar uma nota para a avaliação
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Continue Button */}
                                <div className="text-center py-4">
                                    <Button
                                        variant={stars ? 'primary' : 'secondary'}
                                        size="lg"
                                        disabled={!stars}
                                        onClick={() => handleSave()}
                                        style={{ borderRadius: '25px', padding: '12px 40px' }}
                                        loading={loadingSave}>
                                        Continuar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}