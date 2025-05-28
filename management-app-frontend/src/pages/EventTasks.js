import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/EventTasks.css';
import checkIcon from '../assets/images/check.png'; // adjust path if needed

const eventDetails = {
  name: 'Corporate Year-End Gala',
  client: 'ABC Consulting',
  deadline: '01 Jan 2025',
  progress: 50,
  completed: 5,
  totalTasks: 10,
  budget: 'R500 000',
  spent: 'R280 000',
  colorClass: 'yellow',
};

const tasks = [
  { title: 'Book Venue', priority: 'High', priorityClass: 'red', assignedTo: 'John Doe', budget: 'R120 000', completed: false },
  { title: 'Caterer Selection', priority: 'Medium', priorityClass: 'yellow', assignedTo: 'Lisa Smith', budget: 'R80 000', completed: false },
  { title: 'Guest List Management', priority: 'High', priorityClass: 'red', assignedTo: 'Michael Johnson', budget: 'R15 000', completed: false },
  { title: 'Photography & Videography', priority: 'Medium', priorityClass: 'yellow', assignedTo: 'Lisa Smith', budget: 'R40 000', completed: false },
  { title: 'Event Promotion & Invitations', priority: 'Low', priorityClass: 'green', assignedTo: 'John Doe', budget: 'R25 000', completed: false },
  { title: 'Event Branding & Design', priority: 'Low', priorityClass: 'green', assignedTo: 'Michael Johnson', budget: 'R30 000', completed: true },
  { title: 'Entertainment & Music', priority: 'High', priorityClass: 'red', assignedTo: 'N/A', budget: 'R50 000', completed: true },
  { title: 'Seating Arrangement & Decor', priority: 'Medium', priorityClass: 'yellow', assignedTo: 'N/A', budget: 'R20 000', completed: true },
  { title: 'Technical Setup', priority: 'High', priorityClass: 'red', assignedTo: 'N/A', budget: 'R35 000', completed: true },
];

const EventTasks = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="eventtasks-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`event-tasks-page${sidebarOpen ? '' : ' collapsed'}`}>
        <div className="event-header card">
          <div className="event-header-left">
            <h2>{eventDetails.name}</h2>
            <span className="event-client">{eventDetails.client}</span>
          </div>
          <div className="event-header-right">
            <span className={`status-dot ${eventDetails.colorClass}`}></span>
          </div>
        </div>

        <div className="event-progress card">
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${eventDetails.progress}%`,
                backgroundColor: eventDetails.colorClass === 'yellow' ? '#f59e0b' : eventDetails.colorClass === 'red' ? '#ef4444' : '#10b981'
              }}
            />
          </div>
          <div className="event-stats">
            <span>Deadline: {eventDetails.deadline}</span>
            <span>Overall Progress: {eventDetails.progress}%</span>
            <span>Tasks Completed: {eventDetails.completed} | {eventDetails.totalTasks}</span>
            <span>Overall Budget: {eventDetails.budget}</span>
            <span>Overall Spent: {eventDetails.spent}</span>
          </div>
        </div>

        <div className="task-management-section">
          <h2>Task Management</h2>
          <div className="task-list">
            {tasks.map((task, idx) => (
              <div key={idx} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-title-row">
                  <h3>{task.title}</h3>
                  {task.completed && <img src={checkIcon} className="check-icon" alt="Completed task" />}
                </div>
                <p className="task-priority">
                  <span className={`status-dot ${task.priorityClass}`}></span>
                  Priority: {task.priority}
                </p>
                <p>Assigned To: {task.assignedTo}</p>
                <p>Budget: {task.budget}</p>
                <div className="task-actions">
                  <button className="action-btn edit">✎ Edit</button>
                  <button className="action-btn reassign">⟲ Reassign</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTasks;