import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../events/Events.css';

const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

export default function Events() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Active events
  const [overviewEvents, setOverviewEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState('');

  // Pending requests
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState('');

  // “Add Event” modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: '',
    description: '',
    date: '',
  });

  // “Request Event” modal
  const [showReqModal, setShowReqModal] = useState(false);
  const [reqData, setReqData] = useState({
    title: '',
    description: '',
    date: '',
    requesterName: '',
    requesterEmail: '',
  });
  const [reqError, setReqError] = useState('');
  const [reqSuccess, setReqSuccess] = useState(false);

  // load events + requests
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setEventsError('Not authenticated.');
      setRequestsError('Not authenticated.');
      setLoadingEvents(false);
      setLoadingRequests(false);
      return;
    }

    // fetch active events
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
        setEventsError('Failed to load events.');
      })
      .finally(() => setLoadingEvents(false));

    // fetch pending requests
    axios
      .get(`${API_BASE}/api/event-requests`)
      .then(res => {
        setPendingRequests(
          res.data.map(r => ({
            id: r.id,
            title: r.title,
            date: new Date(r.date).toLocaleDateString(),
            requesterName: r.requesterName,
            requesterEmail: r.requesterEmail,
            status: r.status,
          }))
        );
      })
      .catch(err => {
        console.error(err);
        setRequestsError('Failed to load requests.');
      })
      .finally(() => setLoadingRequests(false));
  }, []);

  // Add Event handlers
  const handleAddChange = e => {
    const { name, value } = e.target;
    setNewEventData(prev => ({ ...prev, [name]: value }));
  };
  const handleAddEvent = () => {
    const { title, description, date } = newEventData;
    if (!title || !description || !date) {
      alert('Fill Title, Description & Date.');
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

  // Request Event handlers
  const handleReqChange = e => {
    const { name, value } = e.target;
    setReqData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmitReq = async e => {
    e.preventDefault();
    setReqError('');
    setReqSuccess(false);

    const { title, description, date, requesterName, requesterEmail } = reqData;
    if (!title || !description || !date || !requesterName || !requesterEmail) {
      setReqError('All fields required.');
      return;
    }

    try {
      const res = await axios.post(
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
      setReqSuccess(true);
      setPendingRequests(prev => [
        ...prev,
        {
          id: res.data.id,
          title: res.data.title,
          date: new Date(res.data.date).toLocaleDateString(),
          requesterName: res.data.requesterName,
          requesterEmail: res.data.requesterEmail,
          status: res.data.status,
        },
      ]);
      setReqData({
        title: '',
        description: '',
        date: '',
        requesterName: '',
        requesterEmail: '',
      });
    } catch (err) {
      setReqError('Failed to submit request.');
    }
  };

  return (
    <div className="events-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`events-page${sidebarOpen ? '' : ' collapsed'}`}>
        <h1 className="events-main-header">Events</h1>

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
              setShowReqModal(true);
              setReqError('');
              setReqSuccess(false);
            }}
          >
            + Request Event
          </button>
        </div>

        <hr className="section-divider" />

        {/* Pending Requests */}
        <div className="card requests-overview-card scroll-container">
          <h2>Pending Event Requests</h2>
          {loadingRequests && <p>Loading requests…</p>}
          {requestsError && <p className="error-text">{requestsError}</p>}
          {!loadingRequests && pendingRequests.length === 0 && (
            <p>No pending requests.</p>
          )}
          {pendingRequests.map(req => (
            <div key={req.id} className="events-overview-row">
              <div className="events-overview-main">
                <span className="events-overview-name">{req.title}</span>
                <div className="events-overview-details">
                  <span><b>Date:</b> {req.date}</span>
                  <span><b>By:</b> {req.requesterName}</span>
                </div>
              </div>
              <div className="events-overview-status">
                <span className="status-dot yellow"></span>
                <span>{req.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Active Events */}
        <div className="card events-overview-card scroll-container">
          <h2>Events Overview</h2>
          {loadingEvents && <p>Loading events…</p>}
          {eventsError && <p className="error-text">{eventsError}</p>}
          {!loadingEvents && overviewEvents.map((evt, i) => (
            <div key={i} className="events-overview-row">
              <div className="events-overview-main">
                <span className="events-overview-name">{evt.name}</span>
                <div className="events-overview-details">
                  <span><b>Client:</b> {evt.client}</span>
                  <span><b>Date:</b> {evt.date}</span>
                </div>
              </div>
              <div className="events-overview-status">
                <span className={`status-dot ${evt.colorClass}`}></span>
                <span>{evt.status}</span>
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
              <label>Title:</label>
              <input
                name="title"
                value={newEventData.title}
                onChange={handleAddChange}
              />
              <label>Description:</label>
              <input
                name="description"
                value={newEventData.description}
                onChange={handleAddChange}
              />
              <label>Date:</label>
              <input
                type="datetime-local"
                name="date"
                value={newEventData.date}
                onChange={handleAddChange}
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

      {/* Request Event Modal */}
      {showReqModal && (
        <div className="events-modal-overlay">
          <div className="events-modal">
            <div className="events-modal-header">
              <h3>Request New Event</h3>
              <button
                className="events-modal-close"
                onClick={() => setShowReqModal(false)}
              >
                ×
              </button>
            </div>
            <form className="events-modal-fields" onSubmit={handleSubmitReq}>
              {reqError && <div className="form-error">{reqError}</div>}
              {reqSuccess && (
                <div className="form-success">Request submitted!</div>
              )}
              <label>Title:</label>
              <input
                name="title"
                value={reqData.title}
                onChange={handleReqChange}
              />
              <label>Description:</label>
              <input
                name="description"
                value={reqData.description}
                onChange={handleReqChange}
              />
              <label>Date:</label>
              <input
                type="datetime-local"
                name="date"
                value={reqData.date}
                onChange={handleReqChange}
              />
              <label>Your Name:</label>
              <input
                name="requesterName"
                value={reqData.requesterName}
                onChange={handleReqChange}
              />
              <label>Your Email:</label>
              <input
                name="requesterEmail"
                type="email"
                value={reqData.requesterEmail}
                onChange={handleReqChange}
              />

              <div className="events-modal-actions">
                <button type="submit" className="events-modal-btn pink">
                  Submit
                </button>
                <button
                  type="button"
                  className="events-modal-btn"
                  onClick={() => setShowReqModal(false)}
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


