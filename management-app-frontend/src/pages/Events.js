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

  // events fetched from backend
  const [overviewEvents, setOverviewEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // full-form state for new event
  const [newEventData, setNewEventData] = useState({
    id: '',
    title: '',
    description: '',
    date: '',
    userId: '',
    createdAt: '',
    updatedAt: '',
  });

  const [showAddModal, setShowAddModal] = useState(false);

  // load existing events on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFetchError('Not authenticated.');
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const evts = res.data.map(e => ({
          id: e.id,
          name: e.title,
          client: e.description, // or however you want to display it
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

  // handle any form input change
  const handleAddInputChange = e => {
    const { name, value } = e.target;
    setNewEventData(prev => ({ ...prev, [name]: value }));
  };

  // submit new event exactly matching your API schema
  const handleAddEvent = () => {
    const {
      id,
      title,
      description,
      date,
      userId,
      createdAt,
      updatedAt,
    } = newEventData;

    // basic validation
    if (
      !id ||
      !title ||
      !description ||
      !date ||
      !userId ||
      !createdAt ||
      !updatedAt
    ) {
      alert('Please fill out all fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Not authenticated.');
      return;
    }

    // build payload, converting types where needed
    const payload = {
      id: Number(id),
      title,
      description,
      date: new Date(date).toISOString(),
      userId: Number(userId),
      createdAt: new Date(createdAt).toISOString(),
      updatedAt: new Date(updatedAt).toISOString(),
    };

    axios
      .post(`${API_BASE}/api/events`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
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
        // reset form
        setNewEventData({
          id: '',
          title: '',
          description: '',
          date: '',
          userId: '',
          createdAt: '',
          updatedAt: '',
        });
        setShowAddModal(false);
      })
      .catch(err => {
        console.error('Add event failed', err);
        alert('Failed to add event. See console for details.');
      });
  };

  return (
    <div className="events-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`events-page${sidebarOpen ? '' : ' collapsed'}`}>
        <h1 className="events-main-header">Events</h1>

        {/* Events Overview */}
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

      {/* Add Event Modal */}
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
              {/* ID */}
              <label>ID:</label>
              <input
                type="number"
                name="id"
                value={newEventData.id}
                onChange={handleAddInputChange}
              />

              {/* User ID */}
              <label>User ID:</label>
              <input
                type="number"
                name="userId"
                value={newEventData.userId}
                onChange={handleAddInputChange}
              />

              {/* Title */}
              <label>Title:</label>
              <input
                name="title"
                value={newEventData.title}
                onChange={handleAddInputChange}
              />

              {/* Description */}
              <label>Description:</label>
              <input
                name="description"
                value={newEventData.description}
                onChange={handleAddInputChange}
              />

              {/* Date (use datetime-local for full timestamp) */}
              <label>Date:</label>
              <input
                type="datetime-local"
                name="date"
                value={newEventData.date}
                onChange={handleAddInputChange}
              />

              {/* Created At */}
              <label>Created At:</label>
              <input
                type="datetime-local"
                name="createdAt"
                value={newEventData.createdAt}
                onChange={handleAddInputChange}
              />

              {/* Updated At */}
              <label>Updated At:</label>
              <input
                type="datetime-local"
                name="updatedAt"
                value={newEventData.updatedAt}
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
