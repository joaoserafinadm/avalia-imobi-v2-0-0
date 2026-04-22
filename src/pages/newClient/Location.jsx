import Map from "./Map"
import { useDispatch, useSelector } from "react-redux"
import { setBairro, setCep, setCidade, setLatitude, setLogradouro, setLongitude, setNumero, setUf } from "../../../store/NewClientForm/NewClientForm.actions"
import buscaCep from "../../../utils/buscaCep"
import { maskCep } from "../../../utils/mask"
import TitleLabel from "../../components/TitleLabel"
import Input from "../../components/Input"
import s from "./formInputs.module.scss"

const UF_OPTIONS = [
    { value: 'AC', label: 'AC' }, { value: 'AL', label: 'AL' }, { value: 'AM', label: 'AM' },
    { value: 'AP', label: 'AP' }, { value: 'BA', label: 'BA' }, { value: 'CE', label: 'CE' },
    { value: 'DF', label: 'DF' }, { value: 'ES', label: 'ES' }, { value: 'GO', label: 'GO' },
    { value: 'MA', label: 'MA' }, { value: 'MG', label: 'MG' }, { value: 'MS', label: 'MS' },
    { value: 'MT', label: 'MT' }, { value: 'PA', label: 'PA' }, { value: 'PB', label: 'PB' },
    { value: 'PE', label: 'PE' }, { value: 'PI', label: 'PI' }, { value: 'PR', label: 'PR' },
    { value: 'RJ', label: 'RJ' }, { value: 'RN', label: 'RN' }, { value: 'RO', label: 'RO' },
    { value: 'RR', label: 'RR' }, { value: 'RS', label: 'RS' }, { value: 'SC', label: 'SC' },
    { value: 'SE', label: 'SE' }, { value: 'SP', label: 'SP' }, { value: 'TO', label: 'TO' },
]

export default function Location(props) {
    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()

    const onBlurCep = async (event) => {
        const adress = await buscaCep(event)
        if (adress) {
            dispatch(setLogradouro(adress.logradouro))
            dispatch(setBairro(adress.bairro))
            dispatch(setCidade(adress.localidade))
            dispatch(setUf(adress.uf))
        }
    }

    const getCoordinates = async () => {
        if (newClientForm.cidade && newClientForm.uf && newClientForm.logradouro) {
            try {
                const address = `${newClientForm.logradouro} ${newClientForm.numero}, ${newClientForm.bairro}, ${newClientForm.cidade}, ${newClientForm.uf}`
                if (newClientForm.numero) {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAU54iwv20-0BDGcVzMcMrVZpmZRPJDDic`
                    )
                    if (response.ok) {
                        const data = await response.json()
                        const location = data.results[0].geometry.location
                        dispatch(setLatitude(location.lat))
                        dispatch(setLongitude(location.lng))
                    }
                }
            } catch (error) {
                console.error('Erro ao obter coordenadas', error)
            }
        }
    }

    return (
        <>
            <TitleLabel>Localização</TitleLabel>
            <div className={s.section}>
                <div className="row g-3">

                    <div className="col-12 col-md-3 col-xl-2">
                        <Input type="text" label="CEP" required
                            value={newClientForm.cep}
                            onChange={e => dispatch(setCep(maskCep(e.target.value)))}
                            onBlur={e => { onBlurCep(e); getCoordinates() }} />
                    </div>

                    <div className="col-12 col-md-7 col-xl-4">
                        <Input type="text" label="Logradouro"
                            value={newClientForm.logradouro}
                            onChange={e => dispatch(setLogradouro(e.target.value))}
                            onBlur={() => getCoordinates()} />
                    </div>

                    <div className="col-12 col-md-2 col-xl-1">
                        <Input type="text" label="Número"
                            value={newClientForm.numero}
                            onChange={e => dispatch(setNumero(e.target.value))}
                            onBlur={() => getCoordinates()} />
                    </div>

                    <div className="col-12 col-md-5 col-xl-2">
                        <Input type="text" label="Bairro" required
                            value={newClientForm.bairro}
                            onChange={e => dispatch(setBairro(e.target.value))}
                            onBlur={() => getCoordinates()} />
                    </div>

                    <div className="col-12 col-md-5 col-xl-2">
                        <Input type="text" label="Cidade" required
                            value={newClientForm.cidade}
                            onChange={e => dispatch(setCidade(e.target.value))}
                            onBlur={() => getCoordinates()} />
                    </div>

                    <div className="col-12 col-md-2 col-xl-1">
                        <Input type="select" label="UF" required
                            placeholder="UF"
                            value={newClientForm.uf}
                            onChange={e => dispatch(setUf(e.target.value))}
                            onBlur={() => getCoordinates()}
                            options={UF_OPTIONS} />
                    </div>

                    {newClientForm.latitude && newClientForm.longitude && (
                        <div className="col-12 mt-2">
                            <Map location={{ lat: newClientForm.latitude, lng: newClientForm.longitude }} zoom={18} height="300px" />
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}
