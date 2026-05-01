import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const MapComponent = ({ center, markers, locationName }) => {
  return (
    <div className="glass-panel map-container">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%', borderRadius: '24px' }}
      >
        <ChangeView center={center} zoom={13} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Main location marker */}
        <Marker position={center}>
          <Popup><b>{locationName}</b></Popup>
        </Marker>

        {/* Dynamic place markers */}
        {markers.map((marker, idx) => (
          <Marker key={`marker-${idx}`} position={[marker.lat, marker.lon]}>
            <Popup>
              <b>{marker.name}</b><br/>
              {marker.phone}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
