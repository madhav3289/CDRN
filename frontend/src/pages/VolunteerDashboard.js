import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import { connect, disconnect } from '../websocket';

/**
 * Dashboard for VOLUNTEER role users.
 * - View assigned tasks
 * - Update task status
 * - Receive real-time task updates via WebSocket
 */
function VolunteerDashboard() {
  const [newTask, setNewTask] = useState(null);

  useEffect(() => {
    connect(null, null, (task) => setNewTask(task));
    return () => disconnect();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Volunteer Dashboard</h2>
      <div className="dashboard-grid">
        <TaskList newTask={newTask} />
      </div>
    </div>
  );
}

export default VolunteerDashboard;
