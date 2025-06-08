// src/pages/Events.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../events/Events.css';

const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

export default function Events() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  //
  // ─── ACTIVE EVENTS ─────────────────────────────────────
  //
  const [overviewEvents, setOverviewEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  //
  // ─── PENDING REQUESTS ──────────────────────────────────
  //
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingReq, setLoadingReq] = useState(true);
  const [reqError, setReqError] = useState('');

  //
  // ─── ADD-EVENT MODAL STATE ─────────────────────────────
  //
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: '',
    description: '',
    date: '',
  });

  //
  // ─── FETCH BOTH EVENTS & REQUESTS ON MOUNT ─────────────
  //
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFetchError('Not authenticated.');
      setReqError('Not authenticated.');
      setLoading(false);
      setLoadingReq(false);
      return;
    }

    // ── fetch active events
    axios
      .get(`${API_BASE}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const evts = res.data.map(e => ({
          id: e.id,
          name: e.title,
          client: e.description,
          date: new Date(e.date).toLocaleDateString(),
          status: 'In Progress',
          progress: 0,
          completed: 0,
          total: 0,
          colorClass: 'yellow',
        }));
        setOverviewEvents(evts);
      })
      .catch(err => {
        console.error(err);
        setFetchError('Failed to load events.');
      })
      .finally(() => setLoading(false));

    // ── fetch pending requests
    axios
      .get(`${API_BASE}/api/event-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setPendingRequests(
          res.data.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description,
            date: new Date(r.date).toLocaleDateString(),
            requesterName: r.requesterName,
            status: r.status,
          }))
        );
      })
      .catch(err => {
        console.error(err);
        setReqError('Failed to load requests.');
      })
      .finally(() => setLoadingReq(false));
  }, []);

  //
  // ─── HANDLERS FOR ADD-EVENT ─────────────────────────────
  //
  const handleAddInputChange = e => {
    const { name, value } = e.target;
    setNewEventData(prev => ({ ...prev, [name]: value }));
  };
  const handleAddEvent = () => {
    const { title, description, date } = newEventData;
    if (!title || !description || !date) {
      alert('Please fill out Title, Description, and Date.');
      return;
    }
    const token = localStorage.getItem('token');
    axios
      .post(
        `${API_BASE}/api/events`,
        {
          title,
          description,
          date: new Date(date).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then(res => {
        const e = res.data;
        setOverviewEvents(prev => [
          ...prev,
          {
            id: e.id,
            name: e.title,
            client: e.description,
            date: new Date(e.date).toLocaleDateString(),
            status: 'In Progress',
            progress: 0,
            completed: 0,
            total: 0,
            colorClass: 'yellow',
          },
        ]);
        setNewEventData({ title: '', description: '', date: '' });
        setShowAddModal(false);
      })
      .catch(err => {
        console.error('Add event failed', err);
        alert('Failed to add event.');
      });
  };

  //
  // ─── HANDLERS FOR REQUESTS ─────────────────────────────
  //
  const acceptRequest = async req => {
    const token = localStorage.getItem('token');
    try {
      // 1) create actual event
      await axios.post(
        `${API_BASE}/api/events`,
        {
          title: req.title,
          description: req.description,
          date: new Date(req.date).toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 2) delete request
      await axios.delete(`${API_BASE}/api/event-requests/${req.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 3) update client-side lists
      setOverviewEvents(prev => [
        ...prev,
        {
          id: req.id,
          name: req.title,
          client: req.description,
          date: req.date,
          status: 'In Progress',
          progress: 0,
          completed: 0,
          total: 0,
          colorClass: 'yellow',
        },
      ]);
      setPendingRequests(r => r.filter(x => x.id !== req.id));
    } catch (err) {
      console.error('Accept failed', err);
    }
  };

  const denyRequest = async id => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE}/api/event-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRequests(r => r.filter(x => x.id !== id));
    } catch (err) {
      console.error('Deny failed', err);
    }
  };

  //
  // ─── RENDER ─────────────────────────────────────────────
  //
  return (
    <div className="events-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`events-page${sidebarOpen ? '' : ' collapsed'}`}>
        <h1 className="events-main-header">Events</h1>

        {/* ─── Pending Requests ────────────────────────── */}
        <div className="card requests-overview-card scroll-container">
          <h2>Pending Event Requests</h2>
          {loadingReq && <p>Loading requests…</p>}
          {reqError && <p className="error-text">{reqError}</p>}
          {!loadingReq && pendingRequests.length === 0 && (
            <p>No pending requests.</p>
          )}
          {pendingRequests.map(req => (
            <div key={req.id} className="events-overview-row">
              <div className="events-overview-main">
                <span className="events-overview-name">{req.title}</span>
                <div className="events-overview-details">
                  <span>
                    <b>Date:</b> {req.date}
                  </span>
                  <span>
                    <b>By:</b> {req.requesterName}
                  </span>
                </div>
              </div>
              <div className="request-actions">
                <button
                  className="btn-accept"
                  onClick={() => acceptRequest(req)}
                >
                  Accept
                </button>
                <button
                  className="btn-deny"
                  onClick={() => denyRequest(req.id)}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>

        <hr className="section-divider" />

        {/* ─── Active Events Overview ──────────────────── */}
        <div className="card events-overview-card scroll-container">
          <div className="events-overview-header">
            <h2>Events Overview</h2>
            <button
              className="events-add-btn"
              onClick={() => setShowAddModal(true)}
            >
              + Add New Event
            </button>
          </div>
          <hr className="section-divider" />

          {loading && <p>Loading events…</p>}
          {fetchError && <p className="error-text">{fetchError}</p>}

          {!loading &&
            overviewEvents.map((evt, i) => (
              <div key={i} className="events-overview-row">
                <div className="events-overview-main">
                  <span className="events-overview-name">{evt.name}</span>
                  <div className="events-overview-details">
                    <span>
                      <b>Client:</b> {evt.client}
                    </span>
                    <span>
                      <b>Event Date:</b> {evt.date}
                    </span>
                  </div>
                </div>

                <div className="events-overview-status">
                  <span className={`status-dot ${evt.colorClass}`}></span>
                  <span>{evt.status}</span>
                </div>

                <div className="events-overview-progress">
                  <div className="progress-bar-bg">
                    <div
                      className={`progress-bar-fill ${evt.colorClass}`}
                      style={{ width: `${evt.progress}%` }}
                    />
                  </div>
                  <span>{evt.progress}%</span>
                </div>

                <div className="events-overview-tasks">
                  <span className="tasks-label">Tasks Completed:</span>
                  <span className="tasks-value">
                    {evt.completed} | {evt.total}
                  </span>
                </div>

                <div className="events-overview-viewbtn-block">
                  <button
                    className="events-view-btn"
                    onClick={() => navigate(`/event-tasks/${evt.id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ─── Add Event Modal ──────────────────────────── */}
      {showAddModal && (
        <div className="events-modal-overlay">
          <div className="events-modal">
            <div className="events-modal-header">
              <h3>Add New Event</h3>
              <button
                className="events-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <div className="events-modal-fields">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={newEventData.title}
                onChange={handleAddInputChange}
              />

              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={newEventData.description}
                onChange={handleAddInputChange}
              />

              <label>Date:</label>
              <input
                type="datetime-local"
                name="date"
                value={newEventData.date}
                onChange={handleAddInputChange}
              />
            </div>

            <div className="events-modal-actions">
              <button
                className="events-modal-btn pink"
                onClick={handleAddEvent}
              >
                Save
              </button>
              <button
                className="events-modal-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



