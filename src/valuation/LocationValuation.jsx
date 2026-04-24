import Map from "./Map";
import React, { useRef, useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
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
import { SpinnerSM } from "../components/loading/Spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const LIBRARIES = ["places"];

export default function LocationValuation(props) {
  const newClientForm = useSelector((state) => state.newClientForm);
  const dispatch = useDispatch();

  const { isLoaded } = useJsApiLoader({
    id: "avalia-imobi",
    googleMapsApiKey: "AIzaSyAU54iwv20-0BDGcVzMcMrVZpmZRPJDDic",
    libraries: LIBRARIES,
  });

  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [loadingMap, setLoadingMap] = useState(false);

  // Monta o endereço legível a partir dos campos separados (para imóveis já cadastrados)
  const buildAddressDisplay = () => {
    const parts = [
      newClientForm.logradouro,
      newClientForm.numero,
      newClientForm.bairro,
      newClientForm.cidade,
      newClientForm.uf,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const [addressInput, setAddressInput] = useState("");

  // Sincroniza o input com dados vindos do store (edição de imóvel existente)
  useEffect(() => {
    const built = buildAddressDisplay();
    if (built) setAddressInput(built);
  }, [
    newClientForm.logradouro,
    newClientForm.bairro,
    newClientForm.cidade,
    newClientForm.uf,
    newClientForm.numero,
  ]);

  // Inicializa o Google Autocomplete assim que a API estiver carregada
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "br" },
        fields: ["address_components", "geometry", "formatted_address"],
      }
    );

    autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
  }, [isLoaded]);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry) return;

    const components = place.address_components || [];

    const get = (types) => {
      const c = components.find((comp) =>
        types.every((t) => comp.types.includes(t))
      );
      return c?.long_name || "";
    };

    const getShort = (types) => {
      const c = components.find((comp) =>
        types.every((t) => comp.types.includes(t))
      );
      return c?.short_name || "";
    };

    const streetNumber = get(["street_number"]);
    const route = get(["route"]);
    const sublocality =
      get(["sublocality_level_1"]) ||
      get(["sublocality"]) ||
      get(["neighborhood"]);
    const city =
      get(["locality"]) ||
      get(["administrative_area_level_2"]);
    const uf = getShort(["administrative_area_level_1"]);
    const postalCode = get(["postal_code"]).replace("-", "");

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    dispatch(setLogradouro(route));
    dispatch(setNumero(streetNumber));
    dispatch(setBairro(sublocality));
    dispatch(setCidade(city));
    dispatch(setUf(uf));
    if (postalCode) dispatch(setCep(postalCode));
    dispatch(setLatitude(lat));
    dispatch(setLongitude(lng));

    setAddressInput(place.formatted_address || "");
  };

  // Fallback: geocodifica o endereço manualmente caso o usuário não selecione sugestão
  const getCoordinates = async () => {
    setLoadingMap(true);
    if (!newClientForm.cidade || !newClientForm.uf) {
      setLoadingMap(false);
      return;
    }
    try {
      const address = [
        newClientForm.logradouro,
        newClientForm.numero,
        newClientForm.bairro,
        newClientForm.cidade,
        newClientForm.uf,
      ]
        .filter(Boolean)
        .join(", ");

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyAU54iwv20-0BDGcVzMcMrVZpmZRPJDDic`
      );

      if (response.ok) {
        const data = await response.json();
        const location = data.results[0]?.geometry?.location;
        if (location) {
          dispatch(setLatitude(location.lat));
          dispatch(setLongitude(location.lng));
        }
      }
    } catch (error) {
      // silêncio intencional — erro de geocodificação não bloqueia o formulário
    } finally {
      setLoadingMap(false);
    }
  };

  return (
    <div className="row fadeItem mt-3">
      <label className="form-label fw-bold">Localização</label>
      <div className="row">
        {/* Busca de endereço via Google Autocomplete */}
        <div className="col-12 col-lg-9 my-2 pe-1">
          <label className="form-label">
            Endereço<b>*</b>
          </label>
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            placeholder="Digite o endereço do imóvel..."
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            autoComplete="off"
          />
          <small className="text-muted">
            Digite e selecione uma sugestão para preencher automaticamente
          </small>
        </div>

        {/* <div className="col-12 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-orange"
            onClick={getCoordinates}
          >
            <FontAwesomeIcon icon={faLocationDot} className="me-2" />
            Buscar coordenadas
          </button>
        </div> */}

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
