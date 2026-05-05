import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

/**
 * Shows tasks assigned to the current volunteer.
 * Allows updating task status through the progression:
 * ASSIGNED -> IN_PROGRESS -> COMPLETED
 */
function TaskList({ newTask }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch tasks assigned to this volunteer on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/task/my');
        setTasks(res.data);
      } catch (err) {
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Handle real-time task updates from WebSocket
  useEffect(() => {
    if (newTask) {
      setTasks((prev) => {
        const exists = prev.find((t) => t.id === newTask.id);
        if (exists) {
          return prev.map((t) => (t.id === newTask.id ? newTask : t));
        }
        // Only add if assigned to this volunteer
        if (newTask.volunteer?.id === user?.id || newTask.volunteerId === user?.id) {
          return [newTask, ...prev];
        }
        return prev;
      });
    }
  }, [newTask, user]);

  // Advance task to the next status
  const updateStatus = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'ASSIGNED' ? 'IN_PROGRESS' : 'COMPLETED';
    try {
      const res = await api.put('/task/update', { taskId, status: nextStatus });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case 'ASSIGNED': return 'badge badge-red';
      case 'IN_PROGRESS': return 'badge badge-yellow';
      case 'COMPLETED': return 'badge badge-green';
      default: return 'badge';
    }
  };

  if (loading) return <div className="card"><p>Loading tasks...</p></div>;
  if (error) return <div className="card"><p className="error-msg">{error}</p></div>;

  return (
    <div className="card">
      <h3>My Assigned Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Incident</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.incidentType || task.incident?.type || '-'}</td>
                <td>{task.incidentDescription || task.incident?.description || '-'}</td>
                <td><span className={statusClass(task.status)}>{task.status}</span></td>
                <td>
                  {task.status !== 'COMPLETED' && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => updateStatus(task.id, task.status)}
                    >
                      {task.status === 'ASSIGNED' ? 'Start' : 'Complete'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TaskList;
