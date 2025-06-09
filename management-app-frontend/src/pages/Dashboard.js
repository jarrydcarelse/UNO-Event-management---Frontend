// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../dashboard/Dashboard.css';

const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

const notifications = [
  { text: 'New Event Request', variant: 'info' },
  { text: 'New Event Request', variant: 'info' },
  { text: 'Budget Warning', variant: 'warning' },
  { text: 'Task Deadline Tomorrow', variant: 'warning' },
  { text: 'Client Feedback Received', variant: 'info' },
];

const tasks = [
  {
    event: 'Wedding Reception',
    title: 'Confirm Guest List',
    priority: 'High',
    priorityClass: 'red',
    assignedTo: 'Sarah Thompson',
    dueDate: '01 Jan 2025',
    status: 'In Progress',
  },
  {
    event: 'Corporate Year-End Gala',
    title: 'Caterer Selection',
    priority: 'Medium',
    priorityClass: 'yellow',
    assignedTo: 'Sarah Thompson',
    dueDate: '21 Jan 2025',
    status: 'In Progress',
  },
  {
    event: 'Tech Product Launch',
    title: 'Social Media Promotion',
    priority: 'Low',
    priorityClass: 'green',
    assignedTo: 'Not Assigned',
    dueDate: '01 Jan 2025',
    status: 'In Progress',
  },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`${API_BASE}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEvents(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch events error:', err);
        setError('Could not load active events.');
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`dashboard-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Page Header */}
        <h1 className="dashboard-main-header">Dashboard</h1>

        {/* Top Row: Events + Notifications */}
        <div className="dashboard-top">
          {/* Active Events Overview */}
          <div className="card overview-card scroll-container">
            <h2>My Events</h2>

            {loading && <p>Loading events…</p>}
            {error && <p className="error-text">{error}</p>}
            {!loading && !error && events.length === 0 && (
              <p>No active events found.</p>
            )}

            {!loading &&
              !error &&
              events.map((evt) => (
                <div key={evt.id} className="overview-row">
                  <div className="overview-main">
                    <span className="overview-name">{evt.title}</span>
                    <div className="overview-details">
                      <span>
                        <b>Event Date:</b>{' '}
                        {new Date(evt.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="overview-status">
                    <span className="status-dot yellow"></span>
                    <span>In Progress</span>
                  </div>

                  <div className="overview-progress">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill yellow"
                        style={{ width: '0%' }}
                      />
                    </div>
                    <span>0%</span>
                  </div>

                  <button
                    className="event-view-btn"
                    onClick={() => navigate(`/event-tasks/${evt.id}`)}
                  >
                    View
                  </button>
                </div>
              ))}
          </div>

          {/* Notifications */}
          <div className="card notifications-card scroll-container">
            <h2>Notifications</h2>

            {notifications.map((note, idx) => (
              <div key={idx} className={`notification-item ${note.variant}`}>
                <span className="note-icon">•</span>
                <span>{note.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Management */}
        <div className="card tasks-card">
          <h2>My Tasks</h2>
          <div className="task-cards">
            {tasks.map((task, idx) => (
              <div key={idx} className="task-block">
                <div className="task-header">
                  <h3 className="task-name">{task.event}</h3>
                  <hr className="inner-divider" />
                </div>
                <p className="task-title">{task.title}</p>
                <p className="task-priority">
                  <span className={`status-dot ${task.priorityClass}`}></span>
                  Priority: {task.priority}
                </p>
                <div className="task-meta">
                  <p>Assigned To: {task.assignedTo}</p>
                  <p>Due Date: {task.dueDate}</p>
                  <p>Status: {task.status}</p>
                </div>
                <div className="task-actions">
                  <button className="edit-btn">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
