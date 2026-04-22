import { useDispatch, useSelector } from "react-redux"
import { setAreaTotal, setAreaTotalPrivativa, setBanheiros, setPavimentos, setSalas, setVagasGaragem } from "../../../store/NewClientForm/NewClientForm.actions"
import TitleLabel from "../../components/TitleLabel"
import Input from "../../components/Input"
import s from "./formInputs.module.scss"

const num = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => ({ value: String(from + i), label: String(from + i) }))

export default function TypeComercial(props) {
    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()

    return (
        <>
            <TitleLabel>Comercial</TitleLabel>
            <div className={s.section}>
                <div className="row g-3">

                    <div className="col-12 col-lg-6">
                        <Input type="number" label="Área total" suffix="m²"
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
                            options={[
                                { value: '1', label: '1' },
                                { value: '2', label: '2 - Mesanino' },
                                { value: '3', label: '3' },
                                { value: '4', label: '4' },
                            ]} />
                    </div>

                    <div className="col-12 col-lg-4">
                        <Input type="select" label="Nº de salas" placeholder="Escolha..."
                            value={newClientForm.salas}
                            onChange={e => dispatch(setSalas(e.target.value))}
                            options={[
                                ...num(1, 4),
                                { value: 'Mais de 5', label: 'Mais de 5' },
                            ]} />
                    </div>

                    <div className="col-12 col-lg-4">
                        <Input type="select" label="Banheiros" placeholder="Escolha..."
                            value={newClientForm.banheiros}
                            onChange={e => dispatch(setBanheiros(e.target.value))}
                            options={num(0, 6)} />
                    </div>

                    <div className="col-12 col-lg-4">
                        <Input type="select" label="Vagas de estacionamento" placeholder="Escolha..."
                            value={newClientForm.vagasGaragem}
                            onChange={e => dispatch(setVagasGaragem(e.target.value))}
                            options={[
                                ...num(0, 9),
                                { value: 'Mais de 10', label: 'Mais de 10' },
                            ]} />
                    </div>

                </div>
            </div>
        </>
    )
}
