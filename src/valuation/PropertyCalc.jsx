import { useEffect, useState } from "react";
import valuationCalcResult from "./valuationCalc";



export default function PropertyCalc(props) {

    const propertyArray = props.propertyArray
    const client = props.client
    const calcVariables = props.calcVariables
    const valuationCalc = props.valuationCalc

    const [valorIdealRange, setValorIdealRange] = useState(0)
    const [curtoPrazoRange, setCurtoPrazoRange] = useState(7)
    const [longoPrazoRange, setLongoPrazoRange] = useState(7)

    // const [calcPrivativa, setCalcPrivativa] = useState(true)

    useEffect(() => {
        const result = valuationCalcResult(propertyArray, client, calcVariables?.valorIdealRange, calcVariables?.curtoPrazoRange, calcVariables?.longoPrazoRange, calcVariables?.calcPrivativa)

        props.setValuationCalc(result)

    }, [propertyArray.length, client, calcVariables?.valorIdealRange, calcVariables?.curtoPrazoRange, calcVariables?.longoPrazoRange, calcVariables?.calcPrivativa])


    const resetCalc = () => {

        const calcVariables = {
            valorIdealRange: 0,
            curtoPrazoRange: 7,
            longoPrazoRange: 7,
            calcPrivativa: true
        }

        props.setCalcVariables(calcVariables)


    }

    return (
        <div className="col-12 my-5 fadeItem">
            <label htmlFor="" className="fw-bold mb-2">Cálculo</label>
            <div className="alert bg-orange">

                    <div className="col-12 my-1">
                        <span>
                            &#x25CF; O cálculo retornará 3 valores que serão utilizados para estimar o valor ideal de venda do imóvel: <b>valor ideal</b>, <b>venda curto prazo</b> e <b>venda longo prazo</b>.
                        </span>
                    </div>
                    <div className="col-12 my-1">
                        <span>
                            &#x25CF; Ajuste os valores conforme necessário.
                        </span>
                    </div>
                </div>

            <div className="row">
                <div className="col-12">

                    <div class="form-check">
                        <input class="form-check-input" type="radio"
                            name="calcPrivativaCheck" onClick={() => props.setCalcVariables({ ...props.calcVariables, calcPrivativa: true })}
                            id="calcPrivativaTrue" checked={calcVariables?.calcPrivativa} />
                        <label class="form-check-label" for="calcPrivativaTrue">
                            Cálculo baseado na <b>área privativa</b>
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio"
                            name="calcPrivativaCheck" onClick={() => props.setCalcVariables({ ...props.calcVariables, calcPrivativa: false })}
                            id="calcPrivativaFalse" checked={!calcVariables?.calcPrivativa} />
                        <label class="form-check-label" for="calcPrivativaFalse">
                            Cálculo baseado na <b>área total</b>
                        </label>
                    </div>
                </div>
            </div>


            <div className="row d-flex px-2">

                <div className="col-12 col-lg-4 px-1 my-1">

                    <div className="card ">
                        <div className="card-body text-center ">
                            <span className="text-secondary fw-bold me-1 ">Venda curto prazo</span> <br />
                            <span className="text-orange me-1 fs-5">R$</span>
                            <span className="text-secondary fs-4 bold">{valuationCalc?.curtoPrazoValue !== 'NaN' ? valuationCalc?.curtoPrazoValue + ',00' : 0}</span>
                            <div className="d-flex mt-3">
                                <input type="range" class="form-range" min="0" max="50" step="1" id="longoPrazoRange" value={calcVariables?.curtoPrazoRange} onChange={(e) => props.setCalcVariables({ ...calcVariables, curtoPrazoRange: e.target.value })} style={{ transform: 'rotate(180deg)' }} />
                                <span class="badge bg-secondary ms-1">-{calcVariables?.curtoPrazoRange}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 px-1 my-1">

                    <div className="card">
                        <div className="card-body text-center ">
                            <span className="text-secondary fw-bold me-1 ">Valor ideal</span> <br />
                            <span className="text-orange me-1 fs-5">R$</span>
                            <span className="text-secondary fs-4 bold">{valuationCalc?.valorIdealValue !== 'NaN' ? valuationCalc?.valorIdealValue + ',00' : 0}</span>
                            <div className="d-flex mt-3">
                                <input type="range" class="form-range" min="-50" max="50" step="1" id="valorIdealRange" value={calcVariables?.valorIdealRange} onChange={(e) => props.setCalcVariables({ ...calcVariables, valorIdealRange: e.target.value })}/>
                                <span class="badge bg-secondary ms-1">{calcVariables?.valorIdealRange}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 px-1 my-1">

                    <div className="card ">
                        <div className="card-body text-center ">
                            <span className="text-secondary fw-bold me-1 ">Venda longo prazo</span> <br />
                            <span className="text-orange me-1 fs-5">R$</span>
                            <span className="text-secondary fs-4 bold">{valuationCalc?.longoPrazoValue !== 'NaN' ? valuationCalc?.longoPrazoValue + ',00' : 0}</span>
                            <div className="d-flex mt-3">
                                <input type="range" class="form-range" min="0" max="50" step="1" id="longoPrazoRange" value={calcVariables?.longoPrazoRange} onChange={(e) => props.setCalcVariables({ ...calcVariables, longoPrazoRange: e.target.value })} />
                                <span class="badge bg-secondary ms-1">+{calcVariables?.longoPrazoRange}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 d-flex justify-content-end">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => resetCalc()}>
                        Redefinir Cálculo
                    </button>
                </div>
            </div>



        </div>
    )

}









{/* <div className="col-12 card my-3">
                    <div className="card-body">
                        <div className="row d-flex justify-content-evenly">
                            <div className=" col-12 col-lg-3 text-center ">
                                <span className="text-danger me-1 ">Venda curto prazo</span> <br />
                                <span className="text-orange me-1 fs-5">R$</span>
                                <span className="text-secondary fs-4 bold">{valuationCalc(propertyArray, client, valorIdealRange, curtoPrazoRange, longoPrazoRange, calcPrivativa).valorIdealValue !== 'NaN' ? valuationCalc(propertyArray, client, valorIdealRange, curtoPrazoRange, longoPrazoRange, calcPrivativa).valorIdealValue + ',00' : 0}</span>
                                <div className="d-flex">
                                    <input type="range" class="form-range" min="0" max="50" step="1" id="curtoPrazoRange" value={curtoPrazoRange} onChange={(e) => setCurtoPrazoRange(e.target.value)} />
                                    <span class="badge bg-secondary ms-1">-{longoPrazoRange}%</span>
                                </div>
                            </div>
                            {isMobile() ?
                                <hr />
                                :
                                <VerticalLine />
                            }
                            <div className=" col-12 col-lg-3 text-center ">
                                <span className="text-success me-1 ">Valor ideal</span> <br />
                                <span className="text-orange me-1 fs-5">R$</span>
                                <span className="text-secondary fs-4 bold">{valuationCalc(propertyArray, client, valorIdealRange, curtoPrazoRange, longoPrazoRange, calcPrivativa).valorIdealValue !== 'NaN' ? valuationCalc(propertyArray, client, valorIdealRange, curtoPrazoRange, longoPrazoRange, calcPrivativa).valorIdealValue + ',00' : 0}</span>
                                <div className="d-flex">
                                    <input type="range" class="form-range" min="-50" max="50" step="1" id="valorIdealRange" value={valorIdealRange} onChange={(e) => setValorIdealRange(e.target.value)} />
                                    <span class="badge bg-secondary ms-1">+{valorIdealRange}%</span>
                                </div>
                            </div>
                            {isMobile() ?
                                <hr />
                                :
                                <VerticalLine />
                            }
                            <div className=" col-12 col-lg-3 text-center ">
                                <span className="text-warning me-1 ">Venda longo prazo</span> <br />
                                <span className="text-orange me-1 fs-5">R$</span>
                                <span className="text-secondary fs-4 bold">{valuationCalc(propertyArray, client, valorIdealRange, curtoPrazoRange, longoPrazoRange, calcPrivativa).valorIdealValue !== 'NaN' ? valuationCalc(propertyArray, client, valorIdealRange, curtoPrazoRange, longoPrazoRange, calcPrivativa).valorIdealValue + ',00' : 0}</span>
                                <div className="d-flex">
                                    <input type="range" class="form-range" min="0" max="50" step="1" id="longoPrazoRange" value={longoPrazoRange} onChange={(e) => setLongoPrazoRange(e.target.value)} />
                                    <span class="badge bg-secondary ms-1">+{longoPrazoRange}%</span>
                                </div>
                            </div>
                        </div>

                     </div>
                </div> */}