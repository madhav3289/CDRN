import React, { useState, useEffect } from 'react';
import api from '../api';

/**
 * Form used by authorities to assign a task to a volunteer for a specific incident.
 * Fetches the volunteer list from the backend; incidents are passed as a prop.
 */
function TaskAssignForm({ incidents = [] }) {
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerId, setVolunteerId] = useState('');
  const [incidentId, setIncidentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch list of volunteers on mount
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await api.get('/users/volunteers');
        setVolunteers(res.data);
      } catch (err) {
        console.error('Failed to load volunteers', err);
      }
    };
    fetchVolunteers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!volunteerId || !incidentId) {
      setError('Please select both a volunteer and an incident.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.post('/task/assign', {
        volunteerId: parseInt(volunteerId, 10),
        incidentId: parseInt(incidentId, 10),
      });
      setMessage('Task assigned successfully.');
      setVolunteerId('');
      setIncidentId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Assign Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Volunteer</label>
          <select value={volunteerId} onChange={(e) => setVolunteerId(e.target.value)} required>
            <option value="">-- Select Volunteer --</option>
            {volunteers.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.phone})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Incident</label>
          <select value={incidentId} onChange={(e) => setIncidentId(e.target.value)} required>
            <option value="">-- Select Incident --</option>
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                [{inc.type}] {inc.description?.substring(0, 50)}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Assigning...' : 'Assign Task'}
        </button>
      </form>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}

export default TaskAssignForm;
