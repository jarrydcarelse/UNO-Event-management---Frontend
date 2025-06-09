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

  // ── Filter state ─────────────────────────────
  const [filter, setFilter] = useState('mine'); // 'mine' or 'all'

  // ── Active Events ────────────────────────────
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState('');

  // ── Pending Requests ─────────────────────────
  const [requests, setRequests] = useState([]);
  const [loadingReq, setLoadingReq] = useState(true);
  const [reqError, setReqError] = useState('');

  // ── Add-Event Modal ──────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
  });

  // ── Fetch events based on filter ─────────────
  const fetchEvents = async () => {
    setLoadingEvents(true);
    setEventsError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setEventsError('Not authenticated');
      setLoadingEvents(false);
      return;
    }
    const url = filter === 'all' ? '/api/events/all' : '/api/events';
    try {
      const res = await axios.get(API_BASE + url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(
        res.data.map(e => ({
          id: e.id,
          name: e.title,
          client: e.description,
          date: new Date(e.date).toLocaleDateString(),
          status: 'In Progress',
          progress: 0,
          completed: 0,
          total: 0,
          colorClass: 'yellow',
        }))
      );
    } catch (err) {
      console.error('Error loading events:', err);
      setEventsError('Failed to load events');
    } finally {
      setLoadingEvents(false);
    }
  };

  // ── Fetch pending requests ────────────────────
  const fetchRequests = async () => {
    setLoadingReq(true);
    setReqError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setReqError('Not authenticated');
      setLoadingReq(false);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/api/EventRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(
        res.data.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          date: new Date(r.date).toLocaleDateString(),
          requesterName: r.requesterName,
          status: r.status,
        }))
      );
    } catch (err) {
      console.error('Error loading requests:', err);
      setReqError('Failed to load requests');
    } finally {
      setLoadingReq(false);
    }
  };

  // ── Effects ──────────────────────────────────
  useEffect(() => {
    fetchEvents();
  }, [filter]);

  useEffect(() => {
    fetchRequests();
  }, []);

  // ── Add Event Handlers ───────────────────────
  const onNewChange = e => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const addEvent = async () => {
    const { title, description, date } = newEvent;
    if (!title || !description || !date) {
      return alert('Please fill Title, Description and Date');
    }
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_BASE}/api/events/all`,
        { title, description, date: new Date(date).toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchEvents();
      setNewEvent({ title: '', description: '', date: '' });
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding event:', err);
      alert('Failed to add event');
    }
  };

  // ── Request Handlers ────────────────────────
  const acceptRequest = async id => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${API_BASE}/api/EventRequests/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRequests();
      await fetchEvents();
    } catch (err) {
      console.error('Error accepting request:', err);
      alert('Could not accept request');
    }
  };

  const denyRequest = async id => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `${API_BASE}/api/EventRequests/${id}/deny`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchRequests();
    } catch (err) {
      console.error('Error denying request:', err);
      alert('Could not deny request');
    }
  };

  // ── Render ───────────────────────────────────
  return (
    <div className="events-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`events-page${sidebarOpen ? '' : ' collapsed'}`}>
        <h1 className="events-main-header">Events</h1>

        {/* ── Filter Toggle ──────────────────────── */}
        <div className="events-filter">
          <button
            className={`filter-btn ${filter === 'mine' ? 'active' : ''}`}
            onClick={() => setFilter('mine')}
          >
            My Events
          </button>
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Events
          </button>
        </div>

        {/* ── Pending Requests ──────────────────── */}
        <div className="card requests-overview-card scroll-container">
          <h2>Pending Event Requests</h2>
          {loadingReq && <p>Loading requests…</p>}
          {reqError && <p className="error-text">{reqError}</p>}
          {!loadingReq && requests.length === 0 && <p>No pending requests.</p>}
          {requests.map(r => (
            <div key={r.id} className="events-overview-row">
              <div className="events-overview-main">
                <span className="events-overview-name">{r.title}</span>
                <div className="events-overview-details">
                  <span><b>Date:</b> {r.date}</span>
                  <span><b>By:</b> {r.requesterName}</span>
                </div>
              </div>
              <div className="request-actions">
                <button className="btn-accept" onClick={() => acceptRequest(r.id)}>Accept</button>
                <button className="btn-deny" onClick={() => denyRequest(r.id)}>Deny</button>
              </div>
            </div>
          ))}
        </div>

        <hr className="section-divider" />

        {/* ── Active Events ──────────────────────── */}
        <div className="card events-overview-card scroll-container">
          <div className="events-overview-header">
            <h2>{filter === 'all' ? 'All Events' : 'My Events'}</h2>
            <button className="events-add-btn" onClick={() => setShowAddModal(true)}>
              + Add New Event
            </button>
          </div>
          <hr className="section-divider" />

          {loadingEvents && <p>Loading events…</p>}
          {eventsError && <p className="error-text">{eventsError}</p>}
          {!loadingEvents && events.map((e, idx) => (
            <div key={idx} className="events-overview-row">
              <div className="events-overview-main">
                <span className="events-overview-name">{e.name}</span>
                <div className="events-overview-details">
                  <span><b>Client:</b> {e.client}</span>
                  <span><b>Date:</b> {e.date}</span>
                </div>
              </div>

              <div className="events-overview-status">
                <span className={`status-dot ${e.colorClass}`}></span>
                <span>{e.status}</span>
              </div>

              <div className="events-overview-progress">
                <div className="progress-bar-bg">
                  <div className={`progress-bar-fill ${e.colorClass}`} style={{ width: `${e.progress}%` }} />
                </div>
                <span>{e.progress}%</span>
              </div>

              <div className="events-overview-tasks">
                <span className="tasks-label">Tasks Completed:</span>
                <span className="tasks-value">{e.completed} | {e.total}</span>
              </div>

              <div className="events-overview-viewbtn-block">
                <button className="events-view-btn" onClick={() => navigate(`/event-tasks/${e.id}`)}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Add Event Modal ────────────────────── */}
      {showAddModal && (
        <div className="events-modal-overlay">
          <div className="events-modal">
            <div className="events-modal-header">
              <h3>Add New Event</h3>
              <button className="events-modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="events-modal-fields">
              <label>Title:</label>
              <input type="text" name="title" value={newEvent.title} onChange={onNewChange} />

              <label>Description:</label>
              <input type="text" name="description" value={newEvent.description} onChange={onNewChange} />

              <label>Date:</label>
              <input type="datetime-local" name="date" value={newEvent.date} onChange={onNewChange} />
            </div>

            <div className="events-modal-actions">
              <button className="events-modal-btn pink" onClick={addEvent}>Save</button>
              <button className="events-modal-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



