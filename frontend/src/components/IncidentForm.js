import React, { useState } from 'react';
import api from '../api';

/**
 * Form to report a new incident.
 * Supports auto-filling coordinates via browser geolocation.
 */
function IncidentForm({ onIncidentReported }) {
  const [type, setType] = useState('FIRE');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Use browser geolocation to fill lat/lng
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setError('');
      },
      () => {
        setError('Unable to retrieve your location. Please allow location access.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.post('/incident/report', {
        type,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      setMessage('Incident reported successfully.');
      setDescription('');
      setLatitude('');
      setLongitude('');
      if (onIncidentReported) onIncidentReported();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report incident.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Report Incident</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="FIRE">Fire</option>
            <option value="FLOOD">Flood</option>
            <option value="EARTHQUAKE">Earthquake</option>
            <option value="ACCIDENT">Accident</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the incident..."
            required
            rows={3}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Latitude</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g. 28.6139"
              required
            />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g. 77.2090"
              required
            />
          </div>
        </div>
        <button type="button" className="btn btn-secondary" onClick={useMyLocation}>
          Use My Location
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? 'Submitting...' : 'Report Incident'}
        </button>
      </form>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}

export default IncidentForm;
