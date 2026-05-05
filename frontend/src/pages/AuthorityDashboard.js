import React, { useState, useEffect } from 'react';
import IncidentList from '../components/IncidentList';
import IncidentMap from '../components/IncidentMap';
import TaskAssignForm from '../components/TaskAssignForm';
import AlertList from '../components/AlertList';
import api from '../api';
import { connect, disconnect } from '../websocket';

/**
 * Dashboard for AUTHORITY role users.
 * Full operational view: incidents, map, task assignment, alerts, SOS requests.
 */
function AuthorityDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [sosRequests, setSosRequests] = useState([]);
  const [newAlert, setNewAlert] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [sendingAlert, setSendingAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState('');

  // Fetch SOS requests on mount
  useEffect(() => {
    const fetchSOS = async () => {
      try {
        const res = await api.get('/sos/all');
        setSosRequests(res.data);
      } catch (err) {
        console.error('Failed to load SOS requests', err);
      }
    };
    fetchSOS();
  }, []);

  // Connect to all three WebSocket topics
  useEffect(() => {
    connect(
      (incident) => {
        setIncidents((prev) => {
          const exists = prev.find((i) => i.id === incident.id);
          if (exists) return prev.map((i) => (i.id === incident.id ? incident : i));
          return [incident, ...prev];
        });
      },
      (alert) => setNewAlert(alert),
      null
    );
    return () => disconnect();
  }, []);

  // Callback when IncidentList finishes its initial fetch
  const handleIncidentsLoaded = (data) => {
    setIncidents(data);
  };

  // Send a new alert
  const handleSendAlert = async (e) => {
    e.preventDefault();
    if (!alertMessage.trim()) return;
    setSendingAlert(true);
    setAlertStatus('');
    try {
      await api.post('/alert/send', { message: alertMessage });
      setAlertStatus('Alert sent successfully.');
      setAlertMessage('');
    } catch (err) {
      setAlertStatus(err.response?.data?.message || 'Failed to send alert.');
    } finally {
      setSendingAlert(false);
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Authority Dashboard</h2>

      {/* Incident map */}
      <IncidentMap incidents={incidents} sosRequests={sosRequests} />

      {/* Incident table */}
      <IncidentList incidents={incidents} onIncidentsLoaded={handleIncidentsLoaded} />

      <div className="dashboard-grid two-col">
        {/* Task assignment */}
        <TaskAssignForm incidents={incidents} />

        {/* Send alert form */}
        <div className="card">
          <h3>Send Alert</h3>
          <form onSubmit={handleSendAlert}>
            <div className="form-group">
              <label>Alert Message</label>
              <textarea
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="Type alert message..."
                required
                rows={3}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={sendingAlert}>
              {sendingAlert ? 'Sending...' : 'Send Alert'}
            </button>
          </form>
          {alertStatus && (
            <p className={alertStatus.includes('success') ? 'success-msg' : 'error-msg'}>
              {alertStatus}
            </p>
          )}
        </div>
      </div>

      {/* Live alerts */}
      <AlertList newAlert={newAlert} />

      {/* Active SOS requests */}
      <div className="card">
        <h3>Active SOS Requests</h3>
        {sosRequests.length === 0 ? (
          <p>No active SOS requests.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sosRequests.map((sos, idx) => (
                  <tr key={sos.id || idx}>
                    <td>{sos.user?.name || sos.userId || 'Unknown'}</td>
                    <td>{sos.latitude?.toFixed(4)}, {sos.longitude?.toFixed(4)}</td>
                    <td>{sos.createdAt ? new Date(sos.createdAt).toLocaleString() : '-'}</td>
                    <td>
                      <span className={`badge ${sos.status === 'RESOLVED' ? 'badge-green' : 'badge-red'}`}>
                        {sos.status || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorityDashboard;
