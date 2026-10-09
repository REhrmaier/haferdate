import { useEffect, useMemo } from "react"
import { AttributionControl, MapContainer, Marker, TileLayer, useMap, ZoomControl } from "react-leaflet"
import { mapSettings } from "./config.js"
import { markerIcon } from "./markerIcon.js"

function Focus({ space, tick, zoom, seconds, shift }) {
  const map = useMap()
  useEffect(() => {
    if (!space || tick === 0) return
    const narrow = window.matchMedia("(max-width: 899px)").matches
    const point = map.project([space.lat, space.lng], zoom)
    const lift = narrow ? map.getSize().y * shift : 0
    const center = map.unproject(point.add([0, lift]), zoom)
    map.flyTo(center, zoom, { duration: seconds })
  }, [space, tick, zoom, seconds, shift, map])
  return null
}

function KeepSize() {
  const map = useMap()
  useEffect(() => {
    const refresh = () => map.invalidateSize()
    const id = window.setTimeout(refresh, 60)
    window.addEventListener("resize", refresh)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener("resize", refresh)
    }
  }, [map])
  return null
}

export default function SafeMap({ spaces, selectedId, focusTick, onSelect }) {
  const map = mapSettings()
  const plainIcon = useMemo(() => markerIcon(false), [])
  const activeIcon = useMemo(() => markerIcon(true), [])
  const selected = spaces.find((space) => space.id === selectedId) || null

  return (
    <MapContainer
      center={[map.centerLat, map.centerLng]}
      zoom={map.zoom}
      minZoom={map.minZoom}
      maxZoom={map.maxZoom}
      maxBounds={[[map.south, map.west], [map.north, map.east]]}
      maxBoundsViscosity={map.boundsViscosity}
      scrollWheelZoom={map.scrollWheelZoom}
      zoomAnimation={map.zoomAnimation}
      zoomControl={false}
      attributionControl={false}
      className="city-map"
    >
      <TileLayer url={map.tileUrl} attribution={map.attribution} />
      <AttributionControl position="topleft" prefix={map.attributionPrefix} />
      <ZoomControl position="topright" />
      <KeepSize />
      <Focus space={selected} tick={focusTick} zoom={map.focusZoom} seconds={map.flySeconds} shift={map.focusShift} />
      {spaces.map((space) => {
        const on = space.id === selectedId
        return (
          <Marker
            key={space.id}
            position={[space.lat, space.lng]}
            icon={on ? activeIcon : plainIcon}
            title={space.name}
            alt={space.name}
            zIndexOffset={on ? map.markerLift : map.markerRest}
            eventHandlers={{ click: () => onSelect(space.id) }}
          />
        )
      })}
    </MapContainer>
  )
}
