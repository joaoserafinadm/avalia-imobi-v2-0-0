import Map from "./Map";
import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setBairro,
  setCep,
  setCidade,
  setLatitude,
  setLogradouro,
  setLongitude,
  setNumero,
  setUf,
} from "../../store/NewClientForm/NewClientForm.actions";
import buscaCep from "../../utils/buscaCep";
import { maskCep } from "../../utils/mask";
import EstadosList from "../components/estadosList";
import { SpinnerSM } from "../components/loading/Spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation, faLocationDot, faMapLocation, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

const libraries = ["places"];

export default function LocationValuation(props) {
  const newClientForm = useSelector((state) => state.newClientForm);
  const dispatch = useDispatch();

  const [zoom, setZoom] = useState(16);

  const [loadingMap, setLoadingMap] = useState(false);

  // useEffect(() => {

  //     console.log("newClientForm", newClientForm.bairro)
  //     if ( newClientForm.cidade && newClientForm.uf) {
  //         getCoordinates()
  //     }

  // }, [newClientForm.logradouro, newClientForm.bairro, newClientForm.cidade, newClientForm.uf])

  const getCoordinates = async () => {
    setLoadingMap(true);

    if (!newClientForm.cidade || !newClientForm.uf) {
      setLoadingMap(false);
      return;
    }
    try {
      // Construa o endereço a partir das partes disponíveis (logradouro, número, bairro, cidade, uf)
      const address = `${newClientForm.logradouro}, ${newClientForm.bairro}, ${newClientForm.cidade}, ${newClientForm.uf}`;

      // Execute a geocodificação usando a API de Geocodificação do Google Maps
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyAU54iwv20-0BDGcVzMcMrVZpmZRPJDDic`
      );

      // Verifique se a resposta da API é bem-sucedida
      if (response.ok) {
        const data = await response.json();

        // Extraia as coordenadas da resposta
        const location = data.results[0].geometry.location;

        dispatch(setLatitude(location.lat));
        dispatch(setLongitude(location.lng));

        setZoom(16);
        setLoadingMap(false);
      } else {
        setLoadingMap(false);

        console.error("Erro ao obter coordenadas");
      }
    } catch (error) {
      setLoadingMap(false);

      console.error("Erro ao obter coordenadas", error);
    }
    setLoadingMap(false);
  };

  return (
    <div className="row fadeItem mt-3">
      <label htmlFor="geralForm" className="form-label fw-bold">
        Localização
      </label>
      <div className="row">
        <div className="col-12 col-sm-6 col-lg-4 my-2  pe-1">
          <label for="geralForm" className="form-label">
            Logradouro
          </label>
          <input
            type="text"
            className="form-control"
            name="clientLastNameItem"
            id="clientLastNameItem"
            onBlur={() => getCoordinates()}
            value={newClientForm.logradouro}
            onChange={(e) => dispatch(setLogradouro(e.target.value))}
          />
        </div>

        <div className="col-12 col-sm-6  col-lg-3 my-2  pe-1">
          <label for="geralForm" className="form-label">
            Bairro<b>*</b>
          </label>
          <input
            type="text"
            className="form-control"
            name="celularItem"
            id="celularItem"
            onBlur={() => getCoordinates()}
            value={newClientForm.bairro}
            onChange={(e) => dispatch(setBairro(e.target.value))}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3 my-2  pe-1">
          <label for="geralForm" className="form-label">
            Cidade<b>*</b>
          </label>
          <input
            type="text"
            className="form-control"
            name="celularItem"
            id="celularItem"
            onBlur={() => getCoordinates()}
            value={newClientForm.cidade}
            onChange={(e) => dispatch(setCidade(e.target.value))}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2 my-2  pe-1">
          <label for="geralForm" className="form-label">
            UF<b>*</b>
          </label>

          <select
            className="form-select"
            placeholder="Estado"
            value={newClientForm.uf}
            onChange={(e) => dispatch(setUf(e.target.value))}
            onBlur={() => getCoordinates()}
          >
            <EstadosList />
          </select>
        </div>
        <div className="col-12 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-orange"
            onClick={() => getCoordinates()}
          >
            <FontAwesomeIcon icon={faLocationDot} className="me-2"/>Buscar coordenadas
          </button>
        </div>

        <div className="col-12 my-2 mb-4">
          {loadingMap ? (
            <div className="col-12 d-flex justify-content-center my-5 text-secondary">
              <SpinnerSM />
            </div>
          ) : (
            <>
              {newClientForm.latitude && newClientForm.longitude && (
                <Map
                  location={{
                    lat: newClientForm.latitude,
                    lng: newClientForm.longitude,
                  }}
                  zoom={18}
                  height="300px"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
