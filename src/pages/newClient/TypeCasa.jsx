import { useDispatch, useSelector } from "react-redux"
import { setAreaTotal, setAreaTotalPrivativa, setBanheiros, setPavimentos, setQuartos, setSuites, setVagasGaragem } from "../../../store/NewClientForm/NewClientForm.actions"
import TitleLabel from "../../components/TitleLabel"
import Input from "../../components/Input"
import s from "./formInputs.module.scss"

const num = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => ({ value: String(from + i), label: String(from + i) }))

export default function TypeCasa(props) {
    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()

    return (
        <>
            <TitleLabel>Casa</TitleLabel>
            <div className={s.section}>
                <div className="row g-3">

                    <div className="col-12 col-lg-6">
                        <Input type="number" label="Área do terreno" suffix="m²"
                            value={newClientForm.areaTotal}
                            onChange={e => dispatch(setAreaTotal(e.target.value))} />
                    </div>

                    <div className="col-12 col-lg-6">
                        <Input type="number" label="Área privativa" suffix="m²"
                            value={newClientForm.areaTotalPrivativa}
                            onChange={e => dispatch(setAreaTotalPrivativa(e.target.value))} />
                    </div>

                    <div className="col-12 col-lg-4">
                        <Input type="select" label="Pavimentos" placeholder="Escolha..."
                            value={newClientForm.pavimentos}
                            onChange={e => dispatch(setPavimentos(e.target.value))}
                            options={num(1, 5)} />
                    </div>

                    <div className="col-12 col-lg-4">
                        <Input type="select" label="Quartos" placeholder="Escolha..."
                            value={newClientForm.quartos}
                            onChange={e => dispatch(setQuartos(e.target.value))}
                            options={num(1, 6)} />
                    </div>

                    <div className="col-12 col-lg-4">
                        <Input type="select" label="Suítes" placeholder="Escolha..."
                            value={newClientForm.suites}
                            onChange={e => dispatch(setSuites(e.target.value))}
                            options={num(0, 6)} />
                    </div>

                    <div className="col-12 col-lg-4">
                        <Input type="select" label="Banheiros" placeholder="Escolha..."
                            value={newClientForm.banheiros}
                            onChange={e => dispatch(setBanheiros(e.target.value))}
                            options={num(0, 6)} />
                    </div>

                    <div className="col-12 col-lg-4">
                        <Input type="select" label="Vagas de garagem" placeholder="Escolha..."
                            value={newClientForm.vagasGaragem}
                            onChange={e => dispatch(setVagasGaragem(e.target.value))}
                            options={num(0, 6)} />
                    </div>

                </div>
            </div>
        </>
    )
}
