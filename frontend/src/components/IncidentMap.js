import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix the default Leaflet marker icon issue that occurs with webpack bundlers.
// The default icon URLs point to missing files, so we reconfigure them manually.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom red icon for incidents
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom orange icon for SOS requests
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * OpenStreetMap view showing markers for incidents (red) and SOS requests (orange).
 *
 * @param {Array} incidents  - list of incident objects with latitude/longitude
 * @param {Array} sosRequests - list of SOS objects with latitude/longitude
 */
function IncidentMap({ incidents = [], sosRequests = [] }) {
  const defaultCenter = [20.5937, 78.9629]; // Center of India
  const defaultZoom = 5;

  return (
    <div className="card">
      <h3>Incident Map</h3>
      <div className="map-container">
        <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Incident markers (red) */}
          {incidents.map((inc) =>
            inc.latitude && inc.longitude ? (
              <Marker key={`inc-${inc.id}`} position={[inc.latitude, inc.longitude]} icon={redIcon}>
                <Popup>
                  <strong>{inc.type}</strong>
                  <br />
                  {inc.description}
                  <br />
                  Status: {inc.status || 'ACTIVE'}
                </Popup>
              </Marker>
            ) : null
          )}
          {/* SOS markers (orange) */}
          {sosRequests.map((sos, idx) =>
            sos.latitude && sos.longitude ? (
              <Marker key={`sos-${sos.id || idx}`} position={[sos.latitude, sos.longitude]} icon={orangeIcon}>
                <Popup>
                  <strong>SOS Request</strong>
                  <br />
                  {sos.user?.name || 'Unknown user'}
                  <br />
                  {sos.createdAt ? new Date(sos.createdAt).toLocaleString() : ''}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default IncidentMap;
