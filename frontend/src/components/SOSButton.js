import React, { useState } from 'react';
import api from '../api';

/**
 * Large red SOS button that sends the user's current location
 * to the backend as an emergency request.
 */
function SOSButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSOS = () => {
    setLoading(true);
    setMessage('');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await api.post('/sos/request', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setMessage('SOS sent! Help is on the way.');
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to send SOS.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to get your location. Please enable location services.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="card sos-card">
      <h3>Emergency SOS</h3>
      <p>Press the button below to send an emergency SOS with your current location.</p>
      <button className="sos-button" onClick={handleSOS} disabled={loading}>
        {loading ? '...' : 'SOS'}
      </button>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}

export default SOSButton;
