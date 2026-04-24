import Map from "./Map"
import React, { useRef, useEffect, useState } from "react"
import { useJsApiLoader } from "@react-google-maps/api"
import { useDispatch, useSelector } from "react-redux"
import { setBairro, setCep, setCidade, setLatitude, setLogradouro, setLongitude, setNumero, setUf } from "../../../store/NewClientForm/NewClientForm.actions"
import TitleLabel from "../../components/TitleLabel"
import s from "./formInputs.module.scss"

const LIBRARIES = ["places"]

export default function Location(props) {
    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()

    const { isLoaded } = useJsApiLoader({
        id: "avalia-imobi",
        googleMapsApiKey: "AIzaSyAU54iwv20-0BDGcVzMcMrVZpmZRPJDDic",
        libraries: LIBRARIES,
    })

    const autocompleteRef = useRef(null)
    const inputRef = useRef(null)

    const buildAddressDisplay = () => {
        const parts = [
            newClientForm.logradouro,
            newClientForm.numero,
            newClientForm.bairro,
            newClientForm.cidade,
            newClientForm.uf,
        ].filter(Boolean)
        return parts.join(", ")
    }

    const [addressInput, setAddressInput] = useState("")

    useEffect(() => {
        const built = buildAddressDisplay()
        if (built) setAddressInput(built)
    }, [
        newClientForm.logradouro,
        newClientForm.bairro,
        newClientForm.cidade,
        newClientForm.uf,
        newClientForm.numero,
    ])

    useEffect(() => {
        if (!isLoaded || !inputRef.current) return

        autocompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
                types: ["geocode"],
                componentRestrictions: { country: "br" },
                fields: ["address_components", "geometry", "formatted_address"],
            }
        )

        autocompleteRef.current.addListener("place_changed", handlePlaceSelect)
    }, [isLoaded])

    const handlePlaceSelect = () => {
        const place = autocompleteRef.current?.getPlace()
        if (!place?.geometry) return

        const components = place.address_components || []

        const get = (types) => {
            const c = components.find(comp => types.every(t => comp.types.includes(t)))
            return c?.long_name || ""
        }

        const getShort = (types) => {
            const c = components.find(comp => types.every(t => comp.types.includes(t)))
            return c?.short_name || ""
        }

        const streetNumber = get(["street_number"])
        const route = get(["route"])
        const sublocality = get(["sublocality_level_1"]) || get(["sublocality"]) || get(["neighborhood"])
        const city = get(["locality"]) || get(["administrative_area_level_2"])
        const uf = getShort(["administrative_area_level_1"])
        const postalCode = get(["postal_code"]).replace("-", "")

        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()

        dispatch(setLogradouro(route))
        dispatch(setNumero(streetNumber))
        dispatch(setBairro(sublocality))
        dispatch(setCidade(city))
        dispatch(setUf(uf))
        if (postalCode) dispatch(setCep(postalCode))
        dispatch(setLatitude(lat))
        dispatch(setLongitude(lng))

        setAddressInput(place.formatted_address || "")
    }

    return (
        <>
            <TitleLabel>Localização</TitleLabel>
            <div className={s.section}>
                <div className="row g-3">

                    <div className="col-12">
                        <label className="form-label">Endereço<b>*</b></label>
                        <input
                            ref={inputRef}
                            type="text"
                            className="form-control"
                            placeholder="Digite o endereço do imóvel..."
                            value={addressInput}
                            onChange={e => setAddressInput(e.target.value)}
                            autoComplete="off"
                        />
                        <small className="text-muted">
                            Digite e selecione uma sugestão para preencher automaticamente
                        </small>
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
