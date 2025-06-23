import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete, InfoWindow } from '@react-google-maps/api';
import { useSelector } from 'react-redux';

const libraries = ['places'];

export default function Map(props) {

    const newClientForm = useSelector(state => state.newClientForm);

    const mapRef = useRef(null);
    const positionMarker = useRef();
    const [position, setPosition] = useState(null);
    const [zoom, setZoom] = useState(props.valuationPage ? 14 : 15);
    const [map, setMap] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    const { isLoaded } = useJsApiLoader({
        id: 'avalia-imobi',
        googleMapsApiKey: "AIzaSyAU54iwv20-0BDGcVzMcMrVZpmZRPJDDic",
        libraries: libraries,
    });

    const containerStyle = {
        width: '100%',
        height: props.height ? props.height : '80vw'
    };

    const center = { lat: -27.6347491, lng: -52.2747035 };

    const onLoad = useCallback(function callback(map) {
        if (newClientForm.location) {
            const bounds = new window.google.maps.LatLngBounds(newClientForm.location);
            map.fitBounds(bounds);
            setMap(map);
        }
    }, [newClientForm.location]);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    // Gera a URL da imagem do mapa estático com o centro, zoom e múltiplos marcadores
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${props.location.lat},${props.location.lng}&zoom=${zoom}&size=600x400&maptype=roadmap&` +
    `markers=color:red%7Csize:mid%7Clabel:%7C${props.location.lat},${props.location.lng}&` +
    (props.porpertyLocations?.map((elem, index) => `markers=color:blue%7Csize:small%7Clabel:${index + 1}%7C${elem.latitude},${elem.longitude}`).join("&") || "") +
    `&key=AIzaSyAU54iwv20-0BDGcVzMcMrVZpmZRPJDDic`;

    console.log("Static Map URL:", staticMapUrl);

    const onPlaceChanged = () => {
        if (positionMarker.current) {
            const autoCompleteService = new window.google.maps.places.AutocompleteService();

            autoCompleteService.getPlacePredictions(
                {
                    input: positionMarker.current.value,
                    componentRestrictions: { country: 'br' },
                },
                (predictions, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
                        const placeId = predictions[0].place_id;
                        const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
                        placesService.getDetails({ placeId }, (place, status) => {
                            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                                const location = place.geometry.location.toJSON();
                                setPosition(location);
                                map.panTo(location);
                                setZoom(15);
                            }
                        });
                    }
                }
            );
        }
    };

    // Ícone padrão do Maps para o marker principal (vermelho)
    const mainMarkerIcon = {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    };

    // Ícone padrão do Maps para os markers secundários (azul)
    const secondaryMarkerIcon = {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    };

    return isLoaded ? (
        <>
            <div className="row">
                {props.valuationPdf ? (
                    <div className="col-12 ">
                        <img src={staticMapUrl} alt="Imagem do Mapa" height={props.height} width={props.width}/>
                    </div>
                ) : (
                    <div className="col-12 fadeItem">
                        <div ref={mapRef}>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={props.location}
                                zoom={zoom}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                                options={{
                                    zoomControl: false,
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: false,
                                }}
                            >
                                {/* Marker principal destacado */}
                                <Marker 
                                    position={props.location}
                                    icon={mainMarkerIcon}
                                    title="Seu Imóvel" // Tooltip ao passar o mouse
                                />
                                
                                {/* Markers secundários */}
                                {props.porpertyLocations?.map((elem, index) => (
                                    <Marker
                                        key={index}
                                        icon={secondaryMarkerIcon}
                                        position={{ lat: elem.latitude, lng: elem.longitude }}
                                        onClick={() => setShowInfo(true)}
                                        title={`Propriedade ${index + 1}`} // Tooltip ao passar o mouse
                                    />
                                ))}
                                
                                {showInfo && (
                                    <InfoWindow anchor={1}>
                                        <div>
                                            <h3>Informações</h3>
                                            <div>Conteúdo da Info Window</div>
                                        </div>
                                    </InfoWindow>
                                )}
                            </GoogleMap>
                        </div>
                    </div>
                )}
            </div>
        </>
    ) : <></>;
}