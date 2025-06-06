import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import '../events/Events.css';

const initialRequests = [
  {
    name: 'Workshop on Sustainable Design',
    budget: 'R40 000',
    client: 'Green Innovations Ltd.',
    date: '15 May 2025',
    tasks: 8,
  },
  {
    name: 'Networking Gala',
    budget: 'R110 000',
    client: 'Prestige Networking Group',
    date: '20 June 2025',
    tasks: 10,
  },
  {
    name: 'Charity Fundraising Dinner',
    budget: 'R120 000',
    client: 'Hope for All Foundation',
    date: '25 July 2025',
    tasks: 12,
  },
];

function Events() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const [overviewEvents, setOverviewEvents] = useState([
    { name: 'Wedding Reception', client: 'Emily & Daniel', date: '5 June 2025', status: 'In Progress', progress: 17, completed: 2, total: 12, colorClass: 'red' },
    { name: 'Corporate Year-End Gala', client: 'ABC Consulting', date: '15 December 2025', status: 'In Progress', progress: 50, completed: 5, total: 10, colorClass: 'yellow' },
    { name: 'Tech Product Launch', client: 'InnovateX', date: '22 August 2025', status: 'In Progress', progress: 80, completed: 6, total: 7, colorClass: 'green' },
  ]);

  const [newEventData, setNewEventData] = useState({ name: '', client: '', date: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [requests, setRequests] = useState(initialRequests);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptRequestIndex, setAcceptRequestIndex] = useState(null);

  // Modal input handlers
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewEventData({ ...newEventData, [name]: value });
  };

  // Add new event from modal
  const handleAddEvent = () => {
    const { name, client, date } = newEventData;
    if (name && client && date) {
      setOverviewEvents([
        ...overviewEvents,
        {
          name,
          client,
          date,
          status: 'In Progress',
          completed: 0,
          total: 0,
          progress: 0,
          colorClass: 'yellow'
        }
      ]);
      setNewEventData({ name: '', client: '', date: '' });
      setShowAddModal(false);
    }
  };

  // Accept new event request (shows confirmation modal)
  const handleAcceptRequest = (index) => {
    setAcceptRequestIndex(index);
    setShowAcceptModal(true);
  };

  // Confirm accept, moves event to overview
  const confirmAcceptRequest = () => {
    const req = requests[acceptRequestIndex];
    setOverviewEvents([
      ...overviewEvents,
      {
        name: req.name,
        client: req.client,
        date: req.date,
        status: 'In Progress',
        completed: 0,
        total: req.tasks,
        progress: 0,
        colorClass: 'yellow',
      }
    ]);
    setRequests(requests.filter((_, i) => i !== acceptRequestIndex));
    setShowAcceptModal(false);
    setAcceptRequestIndex(null);
  };

  // Deny request (removes from requests)
  const handleDenyRequest = (index) => {
    setRequests(requests.filter((_, i) => i !== index));
  };

  return (
    <div className="events-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`events-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Page Header */}
        <h1 className="events-main-header">Events</h1>

        {/* Events Overview */}
        <div className="card events-overview-card scroll-container">
          <div className="events-overview-header">
            <h2>Events Overview</h2>
            <button className="events-add-btn" onClick={() => setShowAddModal(true)}>+ Add New Event</button>
          </div>
          <hr className="section-divider" />
          {overviewEvents.map((evt, idx) => (
            <div key={idx} className="events-overview-row">
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
                <span className="tasks-value">{evt.completed} | {evt.total}</span>
              </div>
              {/* View button in own block */}
              <div className="events-overview-viewbtn-block">
                <button
                  className="events-view-btn"
                  onClick={() => navigate('/event-tasks')}
                >
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
                <label>Name:</label>
                <input type="text" name="name" value={newEventData.name} onChange={handleAddInputChange} />
                <label>Client:</label>
                <input type="text" name="client" value={newEventData.client} onChange={handleAddInputChange} />
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
              <p>Are you sure you want to add this event to the overview?</p>
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

export default Events;
