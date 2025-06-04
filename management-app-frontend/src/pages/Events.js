import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import '../events/Events.css';

// Dummy data for initial state
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

  // Main event overview data (stateful for adding/removing events)
  const [overviewEvents, setOverviewEvents] = useState([
    { name: 'Corporate Year-End Gala', client: 'ABC Consulting', date: '15 December 2025', status: 'In Progress', progress: 50, completed: 5, total: 10, colorClass: 'yellow' },
    { name: 'Wedding Reception', client: 'Emily & Daniel', date: '5 June 2025', status: 'In Progress', progress: 17, completed: 2, total: 12, colorClass: 'red' },
    { name: 'Tech Product Launch', client: 'InnovateX', date: '22 August 2025', status: 'In Progress', progress: 85, completed: 6, total: 7, colorClass: 'green' },
  ]);
  const [newEventData, setNewEventData] = useState({ name: '', client: '', date: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [requests, setRequests] = useState(initialRequests);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptRequestIndex, setAcceptRequestIndex] = useState(null);

  // Handle modal input changes
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewEventData({ ...newEventData, [name]: value });
  };

  // Add event from modal
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
          colorClass: 'yellow',
        },
      ]);
      setNewEventData({ name: '', client: '', date: '' });
      setShowAddModal(false);
    }
  };

  // Accept request modal logic
  const handleAcceptRequest = (index) => {
    setAcceptRequestIndex(index);
    setShowAcceptModal(true);
  };
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
      },
    ]);
    setRequests(requests.filter((_, i) => i !== acceptRequestIndex));
    setShowAcceptModal(false);
    setAcceptRequestIndex(null);
  };
  const handleDenyRequest = (index) => {
    setRequests(requests.filter((_, i) => i !== index));
  };

  return (
    <div className="events-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`events-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Events Overview */}
        <div className="events-card events-overview-card events-scroll-container">
          <h2 className="events-section-title">Events Overview</h2>
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
                <span className={`events-status-dot ${evt.colorClass}`}></span>
                <span>{evt.status}</span>
              </div>
              <div className="events-overview-progress">
                <div className="events-progress-bar-bg">
                  <div
                    className={`events-progress-bar-fill ${evt.colorClass}`}
                    style={{ width: `${evt.progress}%` }}
                  />
                </div>
                <span>{evt.progress}%</span>
              </div>
              <div className="events-overview-tasks">
                <span className="events-tasks-label">Tasks Completed:</span>
                <span className="events-tasks-value">{evt.completed} | {evt.total}</span>
              </div>
              <button
                className="events-view-btn"
                onClick={() => navigate('/event-tasks')}
              >
                View
              </button>
            </div>
          ))}
          <button className="events-add-btn" onClick={() => setShowAddModal(true)}>+</button>
        </div>

        {/* New Events Requests */}
        <div className="events-card events-requests-card">
          <h2 className="events-section-title">New Events Requests</h2>
          <div className="events-requests-list">
            {requests.map((req, idx) => (
              <div key={idx} className="events-request">
                <h3 className="events-request-title">{req.name}</h3>
                <p><b>Budget:</b> {req.budget}</p>
                <p><b>Client:</b> {req.client}</p>
                <p><b>Event Date:</b> {req.date}</p>
                <p><b>Tasks:</b> {req.tasks}</p>
                <div className="events-request-actions">
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
            <div className="events-modal-content">
              <h3>Add New Event</h3>
              <div className="events-modal-fields">
                <label>Name:</label>
                <input type="text" name="name" value={newEventData.name} onChange={handleAddInputChange} />
                <label>Client:</label>
                <input type="text" name="client" value={newEventData.client} onChange={handleAddInputChange} />
                <label>Date:</label>
                <input type="date" name="date" value={newEventData.date} onChange={handleAddInputChange} />
              </div>
              <div className="events-modal-actions">
                <button className="events-view-btn" onClick={handleAddEvent}>Save</button>
                <button className="events-view-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Accept Request Modal */}
        {showAcceptModal && (
          <div className="events-modal-overlay">
            <div className="events-modal-content">
              <h3>Confirm Add Event</h3>
              <p>Are you sure you want to add this event to the overview?</p>
              <div className="events-modal-actions">
                <button className="events-deny-btn" onClick={() => setShowAcceptModal(false)}>Cancel</button>
                <button className="events-accept-btn" onClick={confirmAcceptRequest}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
