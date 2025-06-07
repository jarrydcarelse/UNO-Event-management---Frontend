// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../dashboard/Dashboard.css';

const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to login
      navigate('/login');
      return;
    }

    axios.get(`${API_BASE}/api/events`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setEvents(res.data || []);
      setLoading(false);
    })
    .catch(err => {
      console.error('Fetch events error:', err);
      setError('Could not load events.');
      setLoading(false);
    });
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`dashboard-page${sidebarOpen ? '' : ' collapsed'}`}>
        <h1 className="dashboard-main-header">Dashboard</h1>

        <div className="card overview-card scroll-container">
          <h2>Active Events Overview</h2>
          <hr className="section-divider" />

          {loading && <p>Loading events…</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && events.length === 0 && (
            <p>No active events found.</p>
          )}

          {!loading && !error && events.map(evt => (
            <div key={evt.id} className="overview-row">
              <div className="overview-main">
                <span className="overview-name">{evt.title}</span>
                <div className="overview-details">
                  <span><b>Event Date:</b> {new Date(evt.date).toLocaleDateString()}</span>
                  <span><b>Description:</b> {evt.description}</span>
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
                    style={{ width: `0%` }}
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
      </div>
    </div>
  );
};

export default Dashboard;


