import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar"; 
import '../styles/Events.css';

const overviewEvents = [
  {
    name: 'Corporate Year-End Gala',
    client: 'ABC Consulting',
    date: '15 December 2025',
    status: 'In Progress',
    progress: 50,
    completed: 5,
    total: 10,
    colorClass: 'yellow',
  },
  {
    name: 'Wedding Reception',
    client: 'Emily & Daniel',
    date: '5 June 2025',
    status: 'In Progress',
    progress: 17,
    completed: 2,
    total: 12,
    colorClass: 'red',
  },
  {
    name: 'Tech Product Launch',
    client: 'InnovateX',
    date: '22 August 2025',
    status: 'In Progress',
    progress: 85,
    completed: 6,
    total: 7,
    colorClass: 'green',
  },
];

const newRequests = [
  {
    name: 'Workshop on Sustainable Design',
    budget: 'R40 000',
    client: 'Green Innovations Ltd.',
    date: '15 May 2025',
    tasks: 8,
  },
  {
    name: 'Networking Gala',
    budget: 'R110 000',
    client: 'Prestige Networking Group',
    date: '20 June 2025',
    tasks: 10,
  },
  {
    name: 'Charity Fundraising Dinner',
    budget: 'R120 000',
    client: 'Hope for All Foundation',
    date: '25 July 2025',
    tasks: 12,
  },
];

function Events() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  return (
    <div className="events-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`main-content${sidebarOpen ? '' : ' collapsed'}`}>
        <div className="overview-section card">
          <div className="overview-header">
            <h2>Events Overview</h2>
            <button className="add-btn">+</button>
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

        <div className="requests-section card">
          <h2>New Events Requests</h2>
          <div className="requests-list">
            {newRequests.map((req, idx) => (
              <div key={idx} className="request-card">
                <h3>{req.name}</h3>
                <p>Budget: {req.budget}</p>
                <p>Client: {req.client}</p>
                <p>Event Date: {req.date}</p>
                <p>Tasks: {req.tasks}</p>
                <div className="request-actions">
                  <button className="accept-btn">Accept</button>
                  <button className="deny-btn">Deny</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events;