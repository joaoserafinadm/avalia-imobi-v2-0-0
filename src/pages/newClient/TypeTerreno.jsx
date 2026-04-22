import { useDispatch, useSelector } from "react-redux"
import { setAreaTotal, setComprimento, setFrente, setFundos, setLargura, setLateralDireita, setLateralEsquerda, setTerrenoIrregular } from "../../../store/NewClientForm/NewClientForm.actions"
import { useEffect } from "react"
import TitleLabel from "../../components/TitleLabel"
import Input, { InputToggle } from "../../components/Input"
import s from "./formInputs.module.scss"

export default function TypeTerreno(props) {
    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!props.edit) {
            dispatch(setLargura(''))
            dispatch(setComprimento(''))
            dispatch(setFrente(''))
            dispatch(setFundos(''))
            dispatch(setLateralEsquerda(''))
            dispatch(setLateralDireita(''))
            dispatch(setAreaTotal(''))
        }
    }, [newClientForm.terrenoIrregular])

    useEffect(() => {
        if (!newClientForm.terrenoIrregular) {
            if (newClientForm.largura && newClientForm.comprimento) {
                dispatch(setAreaTotal(+newClientForm.largura * +newClientForm.comprimento))
            } else {
                dispatch(setAreaTotal(''))
            }
        } else {
            if (newClientForm.frente && newClientForm.fundos && newClientForm.lateralEsquerda && newClientForm.lateralDireita) {
                dispatch(setAreaTotal(((+newClientForm.frente + +newClientForm.fundos) / 2) * ((+newClientForm.lateralEsquerda + +newClientForm.lateralDireita) / 2)))
            } else {
                dispatch(setAreaTotal(''))
            }
        }
    }, [newClientForm.largura, newClientForm.comprimento, newClientForm.frente, newClientForm.fundos, newClientForm.lateralEsquerda, newClientForm.lateralDireita])

    return (
        <>
            <TitleLabel>Terreno</TitleLabel>
            <div className={s.section}>
                <div className="row g-3">

                    <div className="col-12">
                        <InputToggle
                            label="Terreno irregular"
                            value={newClientForm.terrenoIrregular}
                            onChange={e => dispatch(setTerrenoIrregular(e.target.checked))}
                        />
                    </div>

                    {!newClientForm.terrenoIrregular ? (
                        <>
                            <div className="col-12 col-lg-6">
                                <Input type="number" label="Largura" suffix="m"
                                    value={newClientForm.largura}
                                    onChange={e => dispatch(setLargura(e.target.value))} />
                            </div>
                            <div className="col-12 col-lg-6">
                                <Input type="number" label="Comprimento" suffix="m"
                                    value={newClientForm.comprimento}
                                    onChange={e => dispatch(setComprimento(e.target.value))} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="col-12 col-lg-6">
                                <Input type="number" label="Frente" suffix="m"
                                    value={newClientForm.frente}
                                    onChange={e => dispatch(setFrente(e.target.value))} />
                            </div>
                            <div className="col-12 col-lg-6">
                                <Input type="number" label="Fundos" suffix="m"
                                    value={newClientForm.fundos}
                                    onChange={e => dispatch(setFundos(e.target.value))} />
                            </div>
                            <div className="col-12 col-lg-6">
                                <Input type="number" label="Lateral esquerda" suffix="m"
                                    value={newClientForm.lateralEsquerda}
                                    onChange={e => dispatch(setLateralEsquerda(e.target.value))} />
                            </div>
                            <div className="col-12 col-lg-6">
                                <Input type="number" label="Lateral direita" suffix="m"
                                    value={newClientForm.lateralDireita}
                                    onChange={e => dispatch(setLateralDireita(e.target.value))} />
                            </div>
                        </>
                    )}

                    <div className="col-12 col-lg-6">
                        <Input type="number" label="Área do terreno (calculada)" suffix="m²"
                            value={newClientForm.areaTotal}
                            onChange={e => dispatch(setAreaTotal(e.target.value))}
                            disabled
                            hint="Calculada automaticamente pelas dimensões" />
                    </div>

                </div>
            </div>
        </>
    )
}
