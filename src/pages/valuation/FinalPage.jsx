import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import Icons from "../../components/icons"
import PdfConfigModal from "./PdfConfigModal"
import axios from "axios"
import baseUrl from "../../../utils/baseUrl"
import { SpinnerSM } from "../../components/loading/Spinners"




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
        <div className="col-12 ">


            <div className="row  d-flex justify-content-center align-items-center">
                <div className="card " style={{ height: '98vh', width: '98vw', overflowY: 'scroll' }} >
                    <div className="row d-flex">



                        <div className="col-12 d-flex justify-content-center mt-5 ">
                            <div className="col-12 col-lg-8 text-center">

                                <span className="fs-4">
                                    Gostaria de deixar alguma observação sobre esta avaliação?
                                </span>
                            </div>

                        </div>
                        <div className="col-12 d-flex justify-content-center ">
                            <div className="col-12 col-lg-8 text-center">

                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="4"
                                    value={comment} onChange={(e) => { setCommet(e.target.value) }}    >

                                </textarea>
                            </div>

                        </div>

                        <div className="col-12 d-flex justify-content-center mt-5 ">
                            <div className="col-12 col-lg-8 text-center">

                                <span className="fs-4">
                                    Qual foi sua satisfação com a avaliação?
                                </span>
                            </div>

                        </div>
                        <div className="col-12 d-flex justify-content-center my-3 mb-5">
                            <div className="col-12 col-lg-8 text-center">

                                <span className="cardAnimation" type="button" onClick={() => { setStars(1) }}>
                                    <FontAwesomeIcon icon={faStar} className={`fs-1 mx-1 text-secondary ${stars >= 1 ? 'text-warning' : 'text-secondary'}`} />
                                </span>
                                <span className="cardAnimation" type="button" onClick={() => { setStars(2) }}>
                                    <FontAwesomeIcon icon={faStar} className={`fs-1 mx-1 text-secondary ${stars >= 2 ? 'text-warning' : 'text-secondary'}`} />
                                </span>
                                <span className="cardAnimation" type="button" onClick={() => { setStars(3) }}>
                                    <FontAwesomeIcon icon={faStar} className={`fs-1 mx-1 text-secondary ${stars >= 3 ? 'text-warning' : 'text-secondary'}`} />
                                </span>
                                <span className="cardAnimation" type="button" onClick={() => { setStars(4) }}>
                                    <FontAwesomeIcon icon={faStar} className={`fs-1 mx-1 text-secondary ${stars >= 4 ? 'text-warning' : 'text-secondary'}`} />
                                </span>
                                <span className="cardAnimation" type="button" onClick={() => { setStars(5) }}>
                                    <FontAwesomeIcon icon={faStar} className={`fs-1 mx-1 text-secondary ${stars >= 5 ? 'text-warning' : 'text-secondary'}`} />
                                </span>
                            </div>

                        </div>


                        <div className="col-12 d-flex justify-content-center my-5 mb-5">
                            <div className="text-center">
                                <button type="button" className="btn btn-light btn-lg fs-4" id="continueButton" disabled={!stars} onClick={() => handleSave()}>
                                    {/* <button type="button" className="btn btn-light btn-lg fs-4" data-bs-target="#valuationCarousel" data-bs-slide-to={3} id="continueButton" disabled={!valueSelected}> */}

                                    {loadingSave ?

                                        <SpinnerSM className="mx-5" />
                                        :
                                        <>
                                            Continuar < Icons icon="a-r" />
                                        </>
                                    }
                                </button> <br />
                                {!stars && (

                                    <span className="small text-danger text-center">Para continuar você deve dar uma nota para a avaliação </span>
                                )}






                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}