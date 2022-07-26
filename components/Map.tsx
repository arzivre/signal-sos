import Leaflet, { LatLngExpression } from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

const DEFAULT: LatLngExpression = [Number(51.505), Number(-0.09)]

const ChangeView = ({ coords }: { coords: LatLngExpression }) => {
  const map = useMap()
  map.setView(coords, 12)
  return null
}

const Map = ({ position = DEFAULT }: { position?: LatLngExpression }) => {
  useEffect(() => {
    ;(async function init() {
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: iconRetinaUrl.src,
        iconUrl: iconUrl.src,
        shadowUrl: shadowUrl.src,
      })
    })()
  }, [])

  return (
    <MapContainer center={position} zoom={12} style={{ height: '50vh' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {position && <Marker position={position} />}
      <ChangeView coords={position} />
    </MapContainer>
  )
}
export default Map
