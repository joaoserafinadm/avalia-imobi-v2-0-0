import { useDispatch, useSelector } from "react-redux"
import { setAndar, setAreaTotal, setAreaTotalPrivativa, setBanheiros, setQuartos, setSacadas, setSuites, setVagasGaragem } from "../../../store/NewClientForm/NewClientForm.actions"




export default function TypeApartamento(props) {

    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()



    return (
        <div className="row fadeItem mt-3">
            <label for="geralForm" className="form-label fw-bold">Apartamento</label>

            <div className="col-12 fadeItem">

                <div className="row">

                    <div className="col-12 col-lg-6 my-3">
                        <label for="areaTotalItem" className="form-label">Área total <b>*</b></label>

                        <div className="input-group  ">
                            <input
                                type="number"
                                className="form-control"
                                name="areaTotalItem"
                                id="areaTotalItem"
                                value={newClientForm.areaTotal} inputMode="numeric"
                                onChange={e => dispatch(setAreaTotal(e.target.value))} />
                            <span class="input-group-text" id="basic-addon1">m²</span>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 my-3">
                        <label for="areaTotalPrivativaItem" className="form-label">Área total - Privativa <b>*</b></label>

                        <div className="input-group  ">
                            <input
                                type="number"
                                className="form-control"
                                name="areaTotalPrivativaItem"
                                id="areaTotalPrivativaItem" inputMode="numeric"
                                value={newClientForm.areaTotalPrivativa}
                                onChange={e => dispatch(setAreaTotalPrivativa(e.target.value))} />
                            <span class="input-group-text" id="basic-addon1">m²</span>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4  my-3">
                        <label for="quartosItem" className="form-label">Número de quartos</label>

                        <select id="quartosItem"
                            class="form-select"
                            aria-label="Default select example"
                            value={newClientForm.quartos}
                            onChange={e => dispatch(setQuartos(e.target.value))}>
                            <option value='' selected disabled>Escolha...</option>
                            <option value="Kitnet">Kitnet</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                    <div className="col-12 col-lg-4 my-3">
                        <label for="suitesItem" className="form-label">Quantos quartos são suites?</label>

                        <select id="suitesItem"
                            class="form-select"
                            aria-label="Default select example"
                            value={newClientForm.suites}
                            onChange={e => dispatch(setSuites(e.target.value))}>
                            <option value='' selected disabled>Escolha...</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                    <div className="col-12 col-lg-4 my-3">
                        <label for="suitesItem" className="form-label">Banheiros</label>

                        <select id="suitesItem"
                            class="form-select"
                            aria-label="Default select example"
                            value={newClientForm.banheiros}
                            onChange={e => dispatch(setBanheiros(e.target.value))}>
                            <option value='' selected disabled>Escolha...</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                    <div className="col-12 col-lg-4 my-3">
                        <label for="sacadasItem" className="form-label">Sacadas</label>

                        <select id="andarItem"
                            class="form-select"
                            aria-label="Default select example"
                            value={newClientForm.sacadas}
                            onChange={e => dispatch(setSacadas(e.target.value))}>
                            <option value='' selected disabled>Escolha...</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                    <div className="col-12 col-lg-4 my-3">
                        <label for="andarItem" className="form-label">Andar</label>

                        <select id="andarItem"
                            class="form-select"
                            aria-label="Default select example"
                            value={newClientForm.andar}
                            onChange={e => dispatch(setAndar(e.target.value))}>
                            <option value='' selected disabled>Escolha...</option>
                            {props.propertyAndar ?
                                <>
                                    <option value="Baixo">Baixo</option>
                                    <option value="Médio">Médio</option>
                                    <option value="Alto">Alto</option>
                                    <option value="Não sei">Não sei</option>
                                </>
                                :
                                <>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                    <option value="31">31</option>
                                    <option value="32">32</option>
                                    <option value="33">33</option>
                                    <option value="34">34</option>
                                    <option value="35">35</option>
                                    <option value="36">36</option>
                                    <option value="37">37</option>
                                    <option value="38">38</option>
                                    <option value="39">39</option>
                                    <option value="40">40</option>
                                    <option value="41">41</option>
                                    <option value="42">42</option>
                                    <option value="43">43</option>
                                    <option value="44">44</option>
                                    <option value="45">45</option>
                                    <option value="46">46</option>
                                    <option value="47">47</option>
                                    <option value="48">48</option>
                                    <option value="49">49</option>
                                    <option value="50">50</option>
                                </>
                            }
                        </select>
                    </div>
                    <div className="col-12 col-lg-4 my-3">
                        <label for="vagasGaragemItem" className="form-label">Vagas de garagem</label>

                        <select id="vagasGaragemItem"
                            class="form-select"
                            aria-label="Default select example"
                            value={newClientForm.vagasGaragem}
                            onChange={e => dispatch(setVagasGaragem(e.target.value))}>
                            <option value='' selected disabled>Escolha...</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>

                </div>
            </div>


        </div>
    )
}