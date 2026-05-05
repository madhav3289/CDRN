import React, { useState, useEffect } from 'react';
import api from '../api';

/**
 * Displays a list of alerts fetched from the backend.
 * Accepts new alerts pushed via WebSocket through the `newAlert` prop.
 */
function AlertList({ newAlert }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all alerts on mount
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/alert/all');
        setAlerts(res.data);
      } catch (err) {
        setError('Failed to load alerts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  // Prepend any new alert that arrives via WebSocket
  useEffect(() => {
    if (newAlert) {
      setAlerts((prev) => [newAlert, ...prev]);
    }
  }, [newAlert]);

  if (loading) return <div className="card"><p>Loading alerts...</p></div>;
  if (error) return <div className="card"><p className="error-msg">{error}</p></div>;

  return (
    <div className="card">
      <h3>Live Alerts</h3>
      {alerts.length === 0 ? (
        <p>No alerts at this time.</p>
      ) : (
        <ul className="alert-list">
          {alerts.map((alert, idx) => (
            <li key={alert.id || idx} className="alert-item">
              <span className="alert-message">{alert.message}</span>
              <span className="alert-time">
                {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AlertList;
