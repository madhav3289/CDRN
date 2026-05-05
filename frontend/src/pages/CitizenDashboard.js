import React, { useState, useEffect } from 'react';
import IncidentForm from '../components/IncidentForm';
import SOSButton from '../components/SOSButton';
import AlertList from '../components/AlertList';
import { connect, disconnect } from '../websocket';

/**
 * Dashboard for CITIZEN role users.
 * - Report incidents
 * - Send SOS
 * - View live alerts
 */
function CitizenDashboard() {
  const [newAlert, setNewAlert] = useState(null);

  // Connect to WebSocket for live alert updates
  useEffect(() => {
    connect(null, (alert) => setNewAlert(alert), null);
    return () => disconnect();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Citizen Dashboard</h2>
      <div className="dashboard-grid">
        <IncidentForm />
        <SOSButton />
        <AlertList newAlert={newAlert} />
      </div>
    </div>
  );
}

export default CitizenDashboard;
