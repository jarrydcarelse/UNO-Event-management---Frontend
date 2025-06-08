import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../dashboard/Dashboard.css';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  'https://eventify-backend-kgtm.onrender.com';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch active events & pending requests
  const fetchData = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const [evtRes, reqRes] = await Promise.all([
        axios.get(`${API_BASE}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/api/event-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setEvents(evtRes.data || []);
      setRequests(reqRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Could not load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  // Accept a request → create event + delete request
  const acceptRequest = async (req) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_BASE}/api/events`,
        {
          title: req.title,
          description: req.description,
          date: req.date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await axios.delete(
        `${API_BASE}/api/event-requests/${req.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  // Deny a request → delete request only
  const denyRequest = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `${API_BASE}/api/event-requests/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((r) => r.filter((x) => x.id !== id));
    } catch (err) {
      console.error('Deny error:', err);
    }
  };

  // static notifications example
  const notifications = [
    { text: 'New Event Request', variant: 'info' },
    { text: 'Budget Warning', variant: 'warning' },
    { text: 'Task Deadline Tomorrow', variant: 'warning' },
  ];

  return (
    <div className="dashboard-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`dashboard-page${sidebarOpen ? '' : ' collapsed'}`}>
        <h1 className="dashboard-main-header">Dashboard</h1>
        {error && <p className="error-text">{error}</p>}

        <div className="dashboard-top">
          {/* ── Pending Requests ── */}
          <div className="card requests-card scroll-container">
            <h2>Pending Requests</h2>
            {loading && <p>Loading…</p>}
            {!loading && requests.length === 0 && (
              <p>No pending requests.</p>
            )}
            {!loading &&
              requests.map((r) => (
                <div key={r.id} className="overview-row">
                  <div className="overview-main">
                    <span className="overview-name">{r.title}</span>
                    <div className="overview-details">
                      <span>
                        <b>Date:</b>{' '}
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                      <span>
                        <b>By:</b> {r.requesterName}
                      </span>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button
                      className="btn-accept"
                      onClick={() => acceptRequest(r)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-deny"
                      onClick={() => denyRequest(r.id)}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* ── Active Events ── */}
          <div className="card overview-card scroll-container">
            <h2>Active Events Overview</h2>
            {loading && <p>Loading events…</p>}
            {!loading && events.length === 0 && (
              <p>No active events found.</p>
            )}
            {!loading &&
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
                    <span className="status-dot yellow" />
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
                    onClick={() =>
                      navigate(`/event-tasks/${evt.id}`)
                    }
                  >
                    View
                  </button>
                </div>
              ))}
          </div>

          {/* ── Notifications ── */}
          <div className="card notifications-card scroll-container">
            <h2>Notifications</h2>
            {notifications.map((note, i) => (
              <div
                key={i}
                className={`notification-item ${note.variant}`}
              >
                <span className="note-icon">•</span>
                <span>{note.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* (Optional) Task Management here… */}
      </div>
    </div>
  );
}
