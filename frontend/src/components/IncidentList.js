import React, { useState, useEffect } from 'react';
import api from '../api';

/**
 * Table of all incidents fetched from the backend.
 * Used by the Authority dashboard.
 */
function IncidentList({ incidents: propIncidents, onIncidentsLoaded }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch incidents from backend
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await api.get('/incident/all');
        setIncidents(res.data);
        if (onIncidentsLoaded) onIncidentsLoaded(res.data);
      } catch (err) {
        setError('Failed to load incidents.');
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  // Merge prop-supplied incidents (from WebSocket) with local state
  useEffect(() => {
    if (propIncidents && propIncidents.length > 0) {
      setIncidents(propIncidents);
    }
  }, [propIncidents]);

  const statusClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'badge badge-red';
      case 'IN_PROGRESS': return 'badge badge-yellow';
      case 'RESOLVED': return 'badge badge-green';
      default: return 'badge';
    }
  };

  if (loading) return <div className="card"><p>Loading incidents...</p></div>;
  if (error) return <div className="card"><p className="error-msg">{error}</p></div>;

  return (
    <div className="card">
      <h3>All Incidents</h3>
      {incidents.length === 0 ? (
        <p>No incidents reported.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Location</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id}>
                  <td>{inc.type}</td>
                  <td>{inc.description}</td>
                  <td><span className={statusClass(inc.status)}>{inc.status || 'ACTIVE'}</span></td>
                  <td>{inc.latitude?.toFixed(4)}, {inc.longitude?.toFixed(4)}</td>
                  <td>{inc.createdAt ? new Date(inc.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default IncidentList;
