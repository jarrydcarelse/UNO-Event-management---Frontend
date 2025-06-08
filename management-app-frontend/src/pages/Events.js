import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../events/Events.css';

const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

export default function Events() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // ─── Active Events ───────────────────────────────
  const [overviewEvents, setOverviewEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // ─── “Add Event” Modal State ─────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: '',
    description: '',
    date: '',
  });

  // ─── “Request Event” Modal State ─────────────────
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    date: '',
    requesterName: '',
    requesterEmail: '',
  });
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  // ─── Load Active Events ──────────────────────────
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
          client: e.description,
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

  // ─── Handlers for “Add Event” ───────────────────
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
        { title, description, date: new Date(date).toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
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

  // ─── Handlers for “Request Event” ──────────────
  const handleRequestChange = e => {
    const { name, value } = e.target;
    setRequestData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmitRequest = async e => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess(false);

    const { title, description, date, requesterName, requesterEmail } = requestData;
    if (!title || !description || !date || !requesterName || !requesterEmail) {
      setRequestError('All fields are required.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/api/event-requests`,
        {
          title,
          description,
          date: new Date(date).toISOString(),
          requesterName,
          requesterEmail,
          status: 'Pending',
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setRequestSuccess(true);
      setRequestData({
        title: '',
        description: '',
        date: '',
        requesterName: '',
        requesterEmail: '',
      });
    } catch (err) {
      setRequestError(
        err.response?.data?.message ||
        'Failed to submit request.'
      );
    }
  };

  return (
    <div className="events-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`events-page${sidebarOpen ? '' : ' collapsed'}`}>
        <h1 className="events-main-header">Events</h1>

        {/* ─── Toolbar ─── */}
        <div className="events-toolbar">
          <button
            className="events-add-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add New Event
          </button>
          <button
            className="events-request-btn"
            onClick={() => {
              setShowRequestModal(true);
              setRequestError('');
              setRequestSuccess(false);
            }}
          >
            + Request Event
          </button>
        </div>

        <hr className="section-divider" />

        {/* ─── Active Events Grid ─── */}
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
                  {evt.completed} / {evt.total}
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

      {/* ─── Add Event Modal ─── */}
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

      {/* ─── Request Event Modal ─── */}
      {showRequestModal && (
        <div className="events-modal-overlay">
          <div className="events-modal">
            <div className="events-modal-header">
              <h3>Request New Event</h3>
              <button
                className="events-modal-close"
                onClick={() => setShowRequestModal(false)}
              >
                ×
              </button>
            </div>
            <form
              className="events-modal-fields"
              onSubmit={handleSubmitRequest}
            >
              {requestError && (
                <div className="form-error">{requestError}</div>
              )}
              {requestSuccess && (
                <div className="form-success">
                  Your request has been submitted!
                </div>
              )}
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={requestData.title}
                onChange={handleRequestChange}
              />
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={requestData.description}
                onChange={handleRequestChange}
              />
              <label>Date:</label>
              <input
                type="datetime-local"
                name="date"
                value={requestData.date}
                onChange={handleRequestChange}
              />
              <label>Your Name:</label>
              <input
                type="text"
                name="requesterName"
                value={requestData.requesterName}
                onChange={handleRequestChange}
              />
              <label>Your Email:</label>
              <input
                type="email"
                name="requesterEmail"
                value={requestData.requesterEmail}
                onChange={handleRequestChange}
              />

              <div className="events-modal-actions">
                <button type="submit" className="events-modal-btn pink">
                  Submit
                </button>
                <button
                  type="button"
                  className="events-modal-btn"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

