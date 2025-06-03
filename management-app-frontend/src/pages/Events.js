import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar"; 
import '../styles/Events.css';
import { FiPlus } from 'react-icons/fi';

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
  // State for events overview
  const [overviewEvents, setOverviewEvents] = useState([
    { name: 'Corporate Year-End Gala', client: 'ABC Consulting', date: '15 December 2025', status: 'In Progress', progress: 50, completed: 5, total: 10, colorClass: 'yellow' },
    { name: 'Wedding Reception', client: 'Emily & Daniel', date: '5 June 2025', status: 'In Progress', progress: 17, completed: 2, total: 12, colorClass: 'red' },
    { name: 'Tech Product Launch', client: 'InnovateX', date: '22 August 2025', status: 'In Progress', progress: 85, completed: 6, total: 7, colorClass: 'green' },
  ]);

  // State for sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // State for Add Event modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    name: '',
    client: '',
    date: ''
  });

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewEventData({ ...newEventData, [name]: value });
  };

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
      setNewEventData({
        name: '',
        client: '',
        date: ''
      });
      setShowAddModal(false);
    }
  };

  // State for requests
  const [requests, setRequests] = useState(initialRequests);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptRequestIndex, setAcceptRequestIndex] = useState(null);

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
      }
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
      <div className={`main-content${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Events Overview Section */}
        <div className="overview-section card">
          <div className="overview-header">
            <h2>Events Overview</h2>
            <button className="add-btn" onClick={() => setShowAddModal(true)}>+</button>
          </div>
          <div className="overview-list">
            {overviewEvents.map((evt, idx) => (
              <div key={idx} className="overview-row">
                <div className="overview-info">
                  <span className="overview-name">{evt.name}</span>
                  <span className="overview-detail">Client: {evt.client}</span>
                  <span className="overview-detail">Event Date: {evt.date}</span>
                </div>
                <div className="overview-status">
                  <span className={`status-dot ${evt.colorClass}`}></span>
                  <span>{evt.status}</span>
                </div>
                <div className="overview-progress">
                  <div className="progress-bar-bg">
                    <div
                      className={`progress-bar-fill ${evt.colorClass}`}
                      style={{ width: `${evt.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{evt.progress}%</span>
                </div>
                <span className="overview-tasks">
                  Tasks Completed: {evt.completed} | {evt.total}
                </span>
                <button
                  className="view-btn"
                  onClick={() => navigate('/event-tasks')}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Event Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add New Event</h3>
              <div className="modal-fields">
                <label>Name:</label>
                <input type="text" name="name" value={newEventData.name} onChange={handleAddInputChange} />

                <label>Client:</label>
                <input type="text" name="client" value={newEventData.client} onChange={handleAddInputChange} />

                <label>Date:</label>
                <input type="date" name="date" value={newEventData.date} onChange={handleAddInputChange} />
              </div>
              <div className="modal-actions">
                <button className="view-btn" onClick={handleAddEvent}>Save</button>
                <button className="view-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* New Events Requests Section */}
        <div className="requests-section card">
          <h2>New Events Requests</h2>
          <div className="requests-list">
            {requests.map((req, idx) => (
              <div key={idx} className="request-card">
                <h3>{req.name}</h3>
                <p>Budget: {req.budget}</p>
                <p>Client: {req.client}</p>
                <p>Event Date: {req.date}</p>
                <p>Tasks: {req.tasks}</p>
                <div className="request-actions">
                  <button className="accept-btn" onClick={() => handleAcceptRequest(idx)}>Accept</button>
                  <button className="deny-btn" onClick={() => handleDenyRequest(idx)}>Deny</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showAcceptModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirm Add Event</h3>
              <p>Are you sure you want to add this event to the overview?</p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowAcceptModal(false)}>Cancel</button>
                <button className="view-btn" onClick={confirmAcceptRequest}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;