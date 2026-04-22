import { useDispatch, useSelector } from "react-redux"
import { deleteFeature, setComments, setFeatures } from "../../../store/NewClientForm/NewClientForm.actions"
import TitleLabel from "../../components/TitleLabel"
import Input from "../../components/Input"
import s from "./formInputs.module.scss"

export default function GeralFeatures(props) {
    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()

    const features = props.type === 'Apartamento' ? [
        'Ótima posição solar', 'Localização privilegiada', 'Banheiro social',
        'Sala de estar e jantar integradas', 'Cozinha americana', 'Área de serviço',
        'Varanda gourmet', 'Armários embutidos', 'Piso porcelanato', 'Ar condicionado',
        'Vista panorâmica', 'Área de lazer completa', 'Piscina', 'Academia',
        'Salão de festas', 'Churrasqueira', 'Playground', 'Segurança 24 horas',
        'Vaga de garagem', 'Aceita financiamento'
    ] : props.type === 'Casa' ? [
        'Cozinha americana', 'Área de serviço', 'Armários embutidos', 'Sala ampla',
        'Varanda gourmet', 'Área verde', 'Segurança 24 horas', 'Ar condicionado',
        'Acabamento de luxo', 'Condomínio fechado', 'Academia', 'Salão de festas',
        'Playground', 'Jardim de inverno', 'Vista panorâmica', 'Aceita financiamento'
    ] : props.type === 'Terreno' ? [
        'Terreno plano', 'Rua asfaltada', 'Rede de água e esgoto', 'Rede elétrica',
        'Documentação em ordem', 'Localização privilegiada', 'Próximo a comércios',
        'Próximo a escolas', 'Próximo a transporte público', 'Acesso fácil',
        'Vizinhança tranquila', 'Segurança', 'Rua sem saída', 'Vista panorâmica',
        'Aceita permuta', 'Aceita financiamento'
    ] : props.type === 'Comercial' ? [
        'Localização estratégica', 'Sala ampla e bem iluminada', 'Piso elevado',
        'Ar condicionado central', 'Banheiro privativo', 'Vaga de garagem',
        'Portaria 24 horas', 'Sistema de segurança', 'Elevador', 'Próximo a bancos',
        'Próximo a restaurantes', 'Próximo a transporte público', 'Acesso para cadeirantes',
        'Internet de alta velocidade', 'Infraestrutura para rede de computadores',
        'Salão de reuniões', 'Cafeteria no prédio', 'Aceita financiamento'
    ] : []

    const handleFeature = (value) => {
        if (!newClientForm.features?.includes(value)) {
            dispatch(setFeatures(newClientForm.features, value))
        } else {
            dispatch(deleteFeature(newClientForm.features, value))
        }
    }

    return (
        <>
            <TitleLabel>Informações Gerais</TitleLabel>
            <div className={s.section}>
                <div className={s.featureGrid}>
                    {features.map(feature => (
                        <Input
                            key={feature}
                            type="checkbox"
                            label={feature}
                            value={newClientForm.features.includes(feature)}
                            onChange={() => handleFeature(feature)}
                        />
                    ))}
                </div>
                <div className={s.textareaWrap}>
                    <Input
                        type="textarea"
                        label="Observações"
                        placeholder="Descreva aqui as particularidades do imóvel"
                        value={newClientForm.comments}
                        onChange={e => dispatch(setComments(e.target.value))}
                        rows={3}
                    />
                </div>
            </div>
        </>
    )
}
