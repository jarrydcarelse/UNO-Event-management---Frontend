// src/pages/Events.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../events/Events.css';

const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

const initialRequests = [
  { name: 'Workshop on Sustainable Design', budget: 'R40 000', client: 'Green Innovations Ltd.', date: '15 May 2025', tasks: 8 },
  { name: 'Networking Gala',                budget: 'R110 000', client: 'Prestige Networking Group', date: '20 June 2025',   tasks: 10 },
  { name: 'Charity Fundraising Dinner',      budget: 'R120 000', client: 'Hope for All Foundation', date: '25 July 2025',    tasks: 12 },
];

export default function Events() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // events fetched from backend
  const [overviewEvents, setOverviewEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // modal / form state
  const [newEventData, setNewEventData] = useState({ title: '', description: '', date: '' });
  const [showAddModal, setShowAddModal] = useState(false);

  // static requests
  const [requests, setRequests] = useState(initialRequests);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptRequestIndex, setAcceptRequestIndex] = useState(null);

  // load existing events on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setFetchError('Not authenticated.');

    axios
      .get(`${API_BASE}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        // normalize to your UI shape
        const evts = res.data.map(e => ({
          id: e.id,
          name: e.title,
          client: e.description,    // temporarily use description as client
          date: new Date(e.date).toLocaleDateString(),
          status: 'In Progress',
          progress: 0,
          completed: 0,
          total: 0,
          colorClass: 'yellow',
        }));
        setOverviewEvents(evts);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setFetchError('Failed to load events.');
        setLoading(false);
      });
  }, []);

  // form change
  const handleAddInputChange = e => {
    const { name, value } = e.target;
    setNewEventData(prev => ({ ...prev, [name]: value }));
  };

  // submit new event
  const handleAddEvent = () => {
    const { title, description, date } = newEventData;
    if (!title || !description || !date) return;

    const token = localStorage.getItem('token');
    axios
      .post(
        `${API_BASE}/api/events`,
        { title, description, date },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        // Assuming API returns the created event
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
        // you may show an error toast here
      });
  };

  const handleAcceptRequest = idx => {
    setAcceptRequestIndex(idx);
    setShowAcceptModal(true);
  };
  const confirmAcceptRequest = () => {
    const req = requests[acceptRequestIndex];
    setOverviewEvents(prev => [
      ...prev,
      {
        id: Date.now(),
        name: req.name,
        client: req.client,
        date: req.date,
        status: 'In Progress',
        progress: 0,
        completed: 0,
        total: req.tasks,
        colorClass: 'yellow',
      },
    ]);
    setRequests(reqs => reqs.filter((_, i) => i !== acceptRequestIndex));
    setShowAcceptModal(false);
    setAcceptRequestIndex(null);
  };
  const handleDenyRequest = idx => {
    setRequests(reqs => reqs.filter((_, i) => i !== idx));
  };

  return (
    <div className="events-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`events-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* header */}
        <h1 className="events-main-header">Events</h1>

        {/* Events Overview */}
        <div className="card events-overview-card scroll-container">
          <div className="events-overview-header">
            <h2>Events Overview</h2>
            <button className="events-add-btn" onClick={() => setShowAddModal(true)}>
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
                    <span><b>Client:</b> {evt.client}</span>
                    <span><b>Event Date:</b> {evt.date}</span>
                  </div>
                </div>

                <div className="events-overview-status">
                  <span className={`status-dot ${evt.colorClass}`}></span>
                  <span>{evt.status}</span>
                </div>

                <div className="events-overview-progress">
                  <div className="progress-bar-bg">
                    <div className={`progress-bar-fill ${evt.colorClass}`} style={{ width: `${evt.progress}%` }} />
                  </div>
                  <span>{evt.progress}%</span>
                </div>

                <div className="events-overview-tasks">
                  <span className="tasks-label">Tasks Completed:</span>
                  <span className="tasks-value">{evt.completed} | {evt.total}</span>
                </div>

                <div className="events-overview-viewbtn-block">
                  <button className="events-view-btn" onClick={() => navigate(`/event-tasks/${evt.id}`)}>
                    View
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* New Event Requests */}
        <div className="card events-requests-card">
          <h2>New Event Requests</h2>
          <hr className="section-divider" />

          <div className="events-requests-list-horizontal">
            {requests.map((req, idx) => (
              <div key={idx} className="events-request-horizontal">
                <div className="events-request-horizontal-info">
                  <span className="events-request-horizontal-title">{req.name}</span>
                  <span><b>Budget:</b> {req.budget}</span>
                  <span><b>Client:</b> {req.client}</span>
                  <span><b>Date:</b> {req.date}</span>
                  <span><b>Tasks:</b> {req.tasks}</span>
                </div>
                <div className="events-request-horizontal-actions">
                  <button className="events-accept-btn" onClick={() => handleAcceptRequest(idx)}>Accept</button>
                  <button className="events-deny-btn" onClick={() => handleDenyRequest(idx)}>Deny</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddModal && (
          <div className="events-modal-overlay">
            <div className="events-modal">
              <div className="events-modal-header">
                <h3>Add New Event</h3>
                <button className="events-modal-close" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <div className="events-modal-fields">
                <label>Title:</label>
                <input name="title" value={newEventData.title} onChange={handleAddInputChange} />

                <label>Description:</label>
                <input name="description" value={newEventData.description} onChange={handleAddInputChange} />

                <label>Date:</label>
                <input type="date" name="date" value={newEventData.date} onChange={handleAddInputChange} />
              </div>
              <div className="events-modal-actions">
                <button className="events-modal-btn pink" onClick={handleAddEvent}>Save</button>
                <button className="events-modal-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Accept Request Modal */}
        {showAcceptModal && (
          <div className="events-modal-overlay">
            <div className="events-modal">
              <div className="events-modal-header">
                <h3>Confirm Add Event</h3>
                <button className="events-modal-close" onClick={() => setShowAcceptModal(false)}>×</button>
              </div>
              <p>Are you sure you want to add this event?</p>
              <div className="events-modal-actions">
                <button className="events-modal-btn" onClick={() => setShowAcceptModal(false)}>Cancel</button>
                <button className="events-modal-btn pink" onClick={confirmAcceptRequest}>Confirm</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
