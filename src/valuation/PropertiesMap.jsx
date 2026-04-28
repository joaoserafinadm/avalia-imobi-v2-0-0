import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import styles from "./PropertiesMap.module.scss"

const LIBRARIES = ["places"]
const API_KEY = "AIzaSyAU54iwv20-0BDGcVzMcMrVZpmZRPJDDic"
const OVERLAP_OFFSET = 0.00016
const ACTIVE_SUBJECT = "subject"

// ── Marker icons ─────────────────────────────────────────────────────────────
// Paths: teardrop pin — circle on top, pointed tail at bottom.
// viewBox for comparison: 0 0 26 36  (circle r≈10 @ center 13,12; tail to 13,35)
// viewBox for subject:    0 0 32 44  (circle r≈12 @ center 16,14; tail to 16,43)

const COMPARISON_PIN_PATH =
    "M13 1C7.2 1 2 6.2 2 12C2 18 13 35 13 35C13 35 24 18 24 12C24 6.2 18.8 1 13 1Z"

const SUBJECT_PIN_PATH =
    "M16 1C9.1 1 3 7.1 3 14C3 22 16 43 16 43C16 43 29 22 29 14C29 7.1 22.9 1 16 1Z"

function makeComparisonIcon(number, google) {
    const label = String(number)
    const fontSize = label.length > 1 ? 9 : 11
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="36" viewBox="0 0 26 36">
      <defs><filter id="sh"><feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="rgba(0,0,0,0.35)"/></filter></defs>
      <path d="${COMPARISON_PIN_PATH}" fill="#1a73e8" stroke="white" stroke-width="1.5" filter="url(#sh)"/>
      <text x="13" y="${fontSize > 9 ? 15 : 14}" text-anchor="middle" fill="white"
            font-size="${fontSize}" font-weight="700" font-family="Arial,sans-serif">${label}</text>
    </svg>`
    return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(26, 36),
        anchor: new google.maps.Point(13, 36),
    }
}

function makeSubjectIcon(google) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44">
      <defs><filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.38)"/></filter></defs>
      <path d="${SUBJECT_PIN_PATH}" fill="#f5874f" stroke="white" stroke-width="2" filter="url(#sh)"/>
      <text x="16" y="19" text-anchor="middle" fill="white"
            font-size="14" font-family="Arial,sans-serif">&#9733;</text>
    </svg>`
    return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(32, 44),
        anchor: new google.maps.Point(16, 44),
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function spreadOverlapping(properties) {
    const groups = {}
    properties.forEach((p, i) => {
        const key = `${(+p.latitude).toFixed(4)},${(+p.longitude).toFixed(4)}`
        if (!groups[key]) groups[key] = []
        groups[key].push(i)
    })
    const offsets = properties.map(() => ({ dlat: 0, dlng: 0 }))
    Object.values(groups).forEach(indices => {
        if (indices.length < 2) return
        const n = indices.length
        const cosLat = Math.cos((+properties[indices[0]].latitude * Math.PI) / 180)
        indices.forEach((idx, j) => {
            const angle = (2 * Math.PI * j) / n - Math.PI / 2
            offsets[idx] = {
                dlat: OVERLAP_OFFSET * Math.cos(angle),
                dlng: (OVERLAP_OFFSET / cosLat) * Math.sin(angle),
            }
        })
    })
    return offsets
}

function formatPrice(price) {
    if (!price) return "—"
    const n = Number(String(price).replace(/\./g, "").replace(/,\d*$/, ""))
    return n ? `R$ ${n.toLocaleString("pt-BR")},00` : "—"
}

const MAP_OPTIONS = {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: [
        { featureType: "poi",     stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
    ],
}

const CONTAINER_STYLE = { width: "100%", height: "400px" }

// ── InfoWindow content ────────────────────────────────────────────────────────

function SubjectInfoContent({ client }) {
    const firstImage = client?.files?.[0]?.url || client?.files?.[0] || null

    return (
        <div style={{ width: 240, fontFamily: "'DM Sans',Arial,sans-serif", overflow: "hidden" }}>
            {firstImage && (
                <div style={{ margin: "-4px -4px 10px -4px" }}>
                    <img
                        src={firstImage}
                        alt="Imóvel avaliado"
                        style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
                        onError={e => { e.target.style.display = "none" }}
                    />
                </div>
            )}
            <div style={{ padding: firstImage ? "0 2px 4px" : "4px 2px 2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "#f5874f", color: "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, flexShrink: 0,
                    }}>★</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#111", lineHeight: 1.3 }}>
                        Imóvel avaliado
                    </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#555" }}>
                    {client.propertyType && <span>Tipo: <strong style={{ color: "#222" }}>{client.propertyType}</strong></span>}
                    {client.areaTotal && <span>Área total: <strong style={{ color: "#222" }}>{client.areaTotal} m²</strong></span>}
                    {client.areaTotalPrivativa && <span>Área privativa: <strong style={{ color: "#222" }}>{client.areaTotalPrivativa} m²</strong></span>}
                    {(client.bairro || client.cidade) && (
                        <span style={{ color: "#777", fontSize: 11 }}>
                            {[client.bairro, client.cidade, client.uf].filter(Boolean).join(", ")}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

function ComparisonInfoContent({ property }) {
    return (
        <div style={{ width: 240, fontFamily: "'DM Sans',Arial,sans-serif", overflow: "hidden" }}>
            {property.imageUrl && (
                <div style={{ margin: "-4px -4px 10px -4px" }}>
                    <img
                        src={property.imageUrl}
                        alt={property.propertyName || "Imóvel"}
                        style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
                        onError={e => { e.target.style.display = "none" }}
                    />
                </div>
            )}
            <div style={{ padding: property.imageUrl ? "0 2px 4px" : "4px 2px 2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                    background: "#1a73e8", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                }}>{property._original + 1}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#111", lineHeight: 1.3 }}>
                    {property.propertyName || `Imóvel ${property._original + 1}`}
                </span>
            </div>

            <div style={{ fontSize: 16, fontWeight: 800, color: "#1a73e8", marginBottom: 8, letterSpacing: "-0.3px" }}>
                {formatPrice(property.propertyPrice)}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#555", marginBottom: 10 }}>
                {property.areaTotal && (
                    <span>Área total: <strong style={{ color: "#222" }}>{property.areaTotal} m²</strong></span>
                )}
                {property.areaTotalPrivativa && (
                    <span>Área privativa: <strong style={{ color: "#222" }}>{property.areaTotalPrivativa} m²</strong></span>
                )}
                {(property.bairro || property.cidade) && (
                    <span style={{ color: "#777", fontSize: 11 }}>
                        {[property.bairro, property.cidade, property.uf].filter(Boolean).join(", ")}
                    </span>
                )}
            </div>

            {property.propertyLink && (
                <a
                    href={property.propertyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                        padding: "8px 12px",
                        background: "#1a73e8",
                        color: "white",
                        borderRadius: 8,
                        textDecoration: "none",
                        fontWeight: 700,
                        fontSize: 12,
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: 11 }} />
                    Ver anúncio
                </a>
            )}
            </div>
        </div>
    )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PropertiesMap({ light,propertyArray, client }) {

    const [activeIndex, setActiveIndex] = useState(null)
    const mapRef = useRef(null)

    const { isLoaded } = useJsApiLoader({
        id: "avalia-imobi",
        googleMapsApiKey: API_KEY,
        libraries: LIBRARIES,
    })

    const valid = useMemo(() =>
        propertyArray
            .map((p, i) => ({ ...p, _original: i }))
            .filter(p => p.latitude && p.longitude),
        [propertyArray]
    )

    const subjectPos = useMemo(() =>
        client?.latitude && client?.longitude
            ? { lat: +client.latitude, lng: +client.longitude }
            : null,
        [client?.latitude, client?.longitude]  // eslint-disable-line
    )

    // Enquadra todos os pins no mapa
    const fitMap = useCallback(() => {
        const map = mapRef.current
        if (!map || !window.google) return
        const points = [
            ...valid.map(p => ({ lat: +p.latitude, lng: +p.longitude })),
            ...(subjectPos ? [subjectPos] : []),
        ]
        if (!points.length) return
        if (points.length === 1) {
            map.setCenter(points[0])
            map.setZoom(15)
            return
        }
        const bounds = new window.google.maps.LatLngBounds()
        points.forEach(p => bounds.extend(p))
        map.fitBounds(bounds, 60)
    }, [valid, subjectPos])

    // Re-enquadra sempre que imóveis são adicionados/removidos
    useEffect(() => {
        fitMap()
    }, [fitMap])

    const onMapLoad = useCallback((map) => {
        mapRef.current = map
        fitMap()
    }, [fitMap])

    if (!valid.length && !subjectPos) return null

    const allPoints = [
        ...valid.map(p => ({ lat: +p.latitude, lng: +p.longitude })),
        ...(subjectPos ? [subjectPos] : []),
    ]
    const center = {
        lat: allPoints.reduce((s, p) => s + p.lat, 0) / allPoints.length,
        lng: allPoints.reduce((s, p) => s + p.lng, 0) / allPoints.length,
    }

    const offsets = spreadOverlapping(valid)
    const isSubjectActive = activeIndex === ACTIVE_SUBJECT
    const activeComparison = typeof activeIndex === "number" ? valid[activeIndex] : null

    return (
        <div className={`${styles.section} ${light ? styles.light : ''}`}>
            <div className={` px-2 ${styles.header}`}>
                <FontAwesomeIcon icon={faLocationDot} className={styles.headerIcon} />
                <span className={styles.headerTitle}>Localização dos imóveis</span>
                <span className={styles.headerCount}>
                    {valid.length} comparação{valid.length !== 1 ? "ões" : ""} no mapa
                </span>
            </div>

            {isLoaded && (
                <>
                    <div className={styles.mapWrap}>
                        <GoogleMap
                            mapContainerStyle={CONTAINER_STYLE}
                            center={center}
                            zoom={13}
                            onLoad={onMapLoad}
                            options={MAP_OPTIONS}
                            onClick={() => setActiveIndex(null)}
                        >
                            {/* ── Imóvel avaliado ── */}
                            {subjectPos && (
                                <Marker
                                    position={subjectPos}
                                    icon={makeSubjectIcon(window.google)}
                                    zIndex={10}
                                    onClick={() => setActiveIndex(ACTIVE_SUBJECT)}
                                />
                            )}

                            {/* ── Imóveis de comparação ── */}
                            {valid.map((property, i) => (
                                <Marker
                                    key={property._original}
                                    position={{
                                        lat: +property.latitude + offsets[i].dlat,
                                        lng: +property.longitude + offsets[i].dlng,
                                    }}
                                    icon={makeComparisonIcon(property._original + 1, window.google)}
                                    zIndex={5}
                                    onClick={() => setActiveIndex(i)}
                                />
                            ))}

                            {/* ── InfoWindow: imóvel avaliado ── */}
                            {isSubjectActive && subjectPos && (
                                <InfoWindow
                                    position={subjectPos}
                                    onCloseClick={() => setActiveIndex(null)}
                                    options={{ pixelOffset: new window.google.maps.Size(0, -48) }}
                                >
                                    <SubjectInfoContent client={client} />
                                </InfoWindow>
                            )}

                            {/* ── InfoWindow: imóvel de comparação ── */}
                            {activeComparison && (
                                <InfoWindow
                                    position={{
                                        lat: +activeComparison.latitude + offsets[activeIndex].dlat,
                                        lng: +activeComparison.longitude + offsets[activeIndex].dlng,
                                    }}
                                    onCloseClick={() => setActiveIndex(null)}
                                    options={{ pixelOffset: new window.google.maps.Size(0, -36) }}
                                >
                                    <ComparisonInfoContent property={activeComparison} />
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </div>

                    <div className={` p-2 ${styles.legend}`}>
                        {subjectPos && (
                            <div className={styles.legendItem}>
                                <span className={`${styles.legendPin} ${styles.subject}`}>
                                    <span>★</span>
                                </span>
                                Imóvel avaliado
                            </div>
                        )}
                        {valid.length > 0 && (
                            <div className={styles.legendItem}>
                                <span className={`${styles.legendPin} ${styles.comparison}`}>
                                    <span>1</span>
                                </span>
                                Imóveis de comparação
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
