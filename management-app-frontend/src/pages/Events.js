import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import '../events/Events.css';

const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

// Search icon SVG component
const SearchIcon = () => (
  <svg
    className="search-icon"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function Events() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Filter + search
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Events
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState('');

  // Requests
  const [requests, setRequests] = useState([]);
  const [loadingReq, setLoadingReq] = useState(true);
  const [reqError, setReqError] = useState('');

  // Modal + form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', description: '', date: '',
    priority: 'Low', assignedToEmail: '', budget: ''
  });

  // Users for dropdown
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch events & users when filter changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    // Events
    (async () => {
      setLoadingEvents(true);
      try {
        const url = filter === 'all' ? '/api/events/all' : '/api/events';
        const res = await axios.get(API_BASE + url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data.map(e => ({
          id: e.id,
          name: e.title,
          client: e.description,
          date: new Date(e.date).toLocaleDateString(),
          status: 'In Progress',
          progress: 0,
          completed: 0,
          total: 0,
          colorClass: 'yellow'
        })));
      } catch {
        setEventsError('Failed to load events');
      } finally {
        setLoadingEvents(false);
      }
    })();

    // Users
    (async () => {
      setLoadingUsers(true);
      try {
        const res = await axios.get(`${API_BASE}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const unique = Array.from(new Set(res.data.map(u => u.email)))
          .map(email => ({ email }))
          .sort((a, b) => a.email.localeCompare(b.email));
        setUsers(unique);
      } catch {
        setUsersError('Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, [filter, navigate]);

  // Fetch pending requests once
  useEffect(() => {
    const token = localStorage.getItem('token');
    (async () => {
      setLoadingReq(true);
      try {
        const res = await axios.get(`${API_BASE}/api/EventRequests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data
          .filter(r => r.status === 'Pending')
          .map(r => ({
            id: r.id,
            title: r.title,
            date: new Date(r.date).toLocaleDateString(),
            requesterName: r.requesterName
          }))
        );
      } catch {
        setReqError('Failed to load requests');
      } finally {
        setLoadingReq(false);
      }
    })();
  }, []);

  // Handlers
  const onNewChange = e => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };
  const addEvent = async () => {
    const { title, description, date, priority, assignedToEmail, budget } = newEvent;
    if (!title || !description || !date || !assignedToEmail || !budget)
      return alert('Fill all required');
    const token = localStorage.getItem('token');
    try {
      const ev = await axios.post(
        `${API_BASE}/api/events`,
        { title, description, date: new Date(date).toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await axios.post(
        `${API_BASE}/api/eventtasks`,
        {
          title, description,
          dueDate: new Date(date).toISOString(),
          priority, assignedToEmail, budget,
          completed: false, eventId: ev.data.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddModal(false);
      setNewEvent({ title: '', description: '', date: '', priority: 'Low', assignedToEmail: '', budget: '' });
      
      // Show success message
      setSuccessMessage('Event added successfully!');
      setShowSuccessModal(true);
      
      // Refresh events list
      const res = await axios.get(API_BASE + '/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data.map(e => ({
        id: e.id,
        name: e.title,
        client: e.description,
        date: new Date(e.date).toLocaleDateString(),
        status: 'In Progress',
        progress: 0,
        completed: 0,
        total: 0,
        colorClass: 'yellow'
      })));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add');
    }
  };
  const acceptRequest = async id => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_BASE}/api/EventRequests/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(rs => rs.filter(r => r.id !== id));
    } catch {
      alert('Could not accept');
    }
  };
  const denyRequest = async id => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE}/api/EventRequests/${id}/deny`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(rs => rs.filter(r => r.id !== id));
    } catch {
      alert('Could not deny');
    }
  };

  const filteredEvents = events.filter(e => {
    const q = searchQuery.toLowerCase();
    return e.name.toLowerCase().includes(q)
      || e.client.toLowerCase().includes(q)
      || e.date.toLowerCase().includes(q);
  });

  if (loadingEvents || loadingReq || loadingUsers) {
    return (
      <div className="events-layout">
        <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`events-page${sidebarOpen ? '' : ' collapsed'}`}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="events-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`events-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Header + Filter */}
        <div className="events-header-bar">
          <h1 className="events-main-header">Events</h1>
        </div>

        {/* Pending Requests */}
        <div className="card requests-overview-card scroll-container">
          <h2>Pending Event Requests</h2>
          <hr className="pink-divider" />
          {loadingReq && <p>Loading…</p>}
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
                <button className="btn-signin" onClick={() => acceptRequest(r.id)}>Accept</button>
                <button className="btn-signup" onClick={() => denyRequest(r.id)}>Deny</button>
              </div>
            </div>
          ))}
        </div>

        <hr className="section-divider" />

        {/* Active Events */}
        <div className="card events-overview-card scroll-container">
          <div className="events-overview-header">
            <h2>All Events</h2>
          </div>
          <hr className="pink-divider" />
          <div className="search-add-container">
            <div className="events-search-container">
              <SearchIcon />
              <input
                className="events-search-input"
                type="text"
                placeholder="Search by name, client, or date..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="btn-signup add-event-btn"
              onClick={() => setShowAddModal(true)}
            >+ Add New Event</button>
          </div>
          {loadingEvents && <p>Loading…</p>}
          {eventsError && <p className="error-text">{eventsError}</p>}
          {!loadingEvents && filteredEvents.length === 0 && <p>No events found.</p>}
          {filteredEvents.map((e, i) => (
            <div key={i} className="events-overview-row">
              <div className="events-overview-main">
                <span className="events-overview-name">{e.name}</span>
                <div className="events-overview-details">
                  <span><b>Client:</b> {e.client}</span>
                  <span><b>Date:</b> {e.date}</span>
                </div>
              </div>
              <div className="events-overview-progress">
                <div className="progress-bar-bg">
                  <div
                    className={`progress-bar-fill ${e.colorClass}`}
                    style={{ width: `${e.progress}%` }}
                  />
                </div>
                <span>{e.progress}%</span>
              </div>
              <button
                className="btn-signin view-tasks-btn"
                onClick={() => navigate(`/event-tasks/${e.id}`)}
              >View Tasks</button>
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
            <hr className="pink-divider" />

            <div className="events-modal-fields">
              <input
                name="title" type="text"
                placeholder="Title *"
                value={newEvent.title}
                onChange={onNewChange}
                required
              />
              <input
                name="description" type="text"
                placeholder="Description *"
                value={newEvent.description}
                onChange={onNewChange}
                required
              />
              <input
                name="date" type="datetime-local"
                placeholder="Date *"
                value={newEvent.date}
                onChange={onNewChange}
                required
              />
              <select
                name="priority"
                value={newEvent.priority}
                onChange={onNewChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {loadingUsers ? (
                <p>Loading users…</p>
              ) : usersError ? (
                <p className="error-text">{usersError}</p>
              ) : (
                <select
                  name="assignedToEmail"
                  value={newEvent.assignedToEmail}
                  onChange={onNewChange}
                  required
                >
                  <option value="">Select a user *</option>
                  {users.map((u, i) => <option key={i} value={u.email}>{u.email}</option>)}
                </select>
              )}
              <input
                name="budget" type="text"
                placeholder="Budget e.g. R10 000 *"
                value={newEvent.budget}
                onChange={onNewChange}
                required
              />
            </div>

            <div className="events-modal-actions">
              <button className="btn-signup" onClick={addEvent}>Save</button>
              <button className="btn-signin" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="events-modal-overlay">
          <div className="events-modal success-modal">
            <div className="events-modal-header">
              <h3>Success!</h3>
              <button 
                className="events-modal-close" 
                onClick={() => setShowSuccessModal(false)}
              >×</button>
            </div>
            <hr className="pink-divider" />
            <div className="events-modal-content">
              <p>{successMessage}</p>
            </div>
            <div className="events-modal-actions">
              <button 
                className="btn-signup" 
                onClick={() => setShowSuccessModal(false)}
              >Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




