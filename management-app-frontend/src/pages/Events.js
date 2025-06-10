// src/pages/Events.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
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
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function Events() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // ── Filter state ─────────────────────────────
  const [filter, setFilter] = useState('all'); // 'mine' or 'all'
  const [searchQuery, setSearchQuery] = useState('');

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
    priority: 'Low',
    assignedToEmail: '',
    budget: '',
    completed: false,
    eventId: 0
  });

  // ── Users ───────────────────────────────────
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');

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
      // Filter to only show pending requests
      const pendingRequests = res.data
        .filter(r => r.status === 'Pending')
        .map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          date: new Date(r.date).toLocaleDateString(),
          requesterName: r.requesterName,
          status: r.status,
        }));
      setRequests(pendingRequests);
    } catch (err) {
      console.error('Error loading requests:', err);
      setReqError('Failed to load requests');
    } finally {
      setLoadingReq(false);
    }
  };

  // ── Fetch users ─────────────────────────────
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setUsersError('Not authenticated');
      setLoadingUsers(false);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/api/users`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      // Remove duplicate emails and sort alphabetically
      const uniqueUsers = Array.from(new Set(res.data.map(user => user.email)))
        .map(email => ({ email }))
        .sort((a, b) => a.email.localeCompare(b.email));
      setUsers(uniqueUsers);
    } catch (err) {
      console.error('Error loading users:', err);
      setUsersError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // ── Effects ──────────────────────────────────
  useEffect(() => {
    fetchEvents();
    fetchUsers();
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
    const { title, description, date, priority, assignedToEmail, budget } = newEvent;
    if (!title || !description || !date || !assignedToEmail || !budget) {
      return alert('Please fill in all required fields');
    }
    const token = localStorage.getItem('token');
    try {
      // First create the event
      const eventResponse = await axios.post(
        `${API_BASE}/api/events`,
        { 
          title, 
          description, 
          date: new Date(date).toISOString() 
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          } 
        }
      );

      // Then create the task for the event
      const taskResponse = await axios.post(
        `${API_BASE}/api/eventtasks`,
        {
          title,
          description,
          dueDate: new Date(date).toISOString(),
          priority,
          assignedToEmail,
          budget,
          completed: false,
          eventId: eventResponse.data.id // Use the ID from the created event
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          } 
        }
      );

      await fetchEvents();
      setNewEvent({
        title: '',
        description: '',
        date: '',
        priority: 'Low',
        assignedToEmail: '',
        budget: '',
        completed: false,
        eventId: 0
      });
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding event:', err);
      if (err.response?.data?.error) {
        alert(`Failed to add event: ${err.response.data.error}`);
      } else {
        alert('Failed to add event. Please try again.');
      }
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
      
      // Remove the accepted request from the requests list
      setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
      
      // Refresh the events list to show the newly accepted event
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
      
      // Remove the denied request from the requests list
      setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    } catch (err) {
      console.error('Error denying request:', err);
      alert('Could not deny request');
    }
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event => {
    const searchLower = searchQuery.toLowerCase();
    return (
      event.name.toLowerCase().includes(searchLower) ||
      event.client.toLowerCase().includes(searchLower) ||
      event.date.toLowerCase().includes(searchLower)
    );
  });

  // ── Render ───────────────────────────────────
  return (
    <div className="events-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`events-page${sidebarOpen ? '' : ' collapsed'}`}>
        <h1 className="events-main-header">Events</h1>

        {/* ── Filter Toggle ──────────────────────── */}
        <div className="events-filter">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Events
          </button>
          <button
            className={`filter-btn ${filter === 'mine' ? 'active' : ''}`}
            onClick={() => setFilter('mine')}
          >
            My Events
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

          {/* Search Bar */}
          <div className="events-search-container">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name, client, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="events-search-input"
            />
          </div>

          {loadingEvents && <p>Loading events…</p>}
          {eventsError && <p className="error-text">{eventsError}</p>}
          {!loadingEvents && filteredEvents.length === 0 && (
            <p>No events found matching your search.</p>
          )}
          {!loadingEvents && filteredEvents.map((e, idx) => (
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
                  View Tasks
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
              <label>Title: *</label>
              <input type="text" name="title" value={newEvent.title} onChange={onNewChange} required />

              <label>Description: *</label>
              <input type="text" name="description" value={newEvent.description} onChange={onNewChange} required />

              <label>Date: *</label>
              <input type="datetime-local" name="date" value={newEvent.date} onChange={onNewChange} required />

              <label>Priority: *</label>
              <select name="priority" value={newEvent.priority} onChange={onNewChange} required>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <label>Assigned To: *</label>
              {loadingUsers ? (
                <p>Loading users...</p>
              ) : usersError ? (
                <p className="error-text">{usersError}</p>
              ) : (
                <select 
                  name="assignedToEmail" 
                  value={newEvent.assignedToEmail} 
                  onChange={onNewChange} 
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user, index) => (
                    <option key={index} value={user.email}>
                      {user.email}
                    </option>
                  ))}
                </select>
              )}

              <label>Budget: *</label>
              <input type="text" name="budget" value={newEvent.budget} onChange={onNewChange} placeholder="e.g. R10 000" required />
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



