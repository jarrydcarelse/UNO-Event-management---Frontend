import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

const activeEvents = [
  { name: 'Wedding Reception', status: 'In Progress', progress: 17, colorClass: 'red' },
  { name: 'Corporate Year-End Gala', status: 'In Progress', progress: 50, colorClass: 'yellow' },
  { name: 'Tech Product Launch', status: 'In Progress', progress: 80, colorClass: 'green' },
];

const notifications = [
  { text: 'New Event Request', variant: 'info' },
  { text: 'New Event Request', variant: 'info' },
  { text: 'Budget Warning', variant: 'warning' },
];

const tasks = [
  {
    event: 'Wedding Reception',
    title: 'Confirm Guest List',
    priority: 'High',
    priorityClass: 'red',
    assignedTo: 'Sarah Thompson',
    dueDate: '01 Jan 2025',
    status: 'In Progress',
  },
  {
    event: 'Corporate Year-End Gala',
    title: 'Caterer Selection',
    priority: 'Medium',
    priorityClass: 'yellow',
    assignedTo: 'Sarah Thompson',
    dueDate: '21 Jan 2025',
    status: 'In Progress',
  },
  {
    event: 'Tech Product Launch',
    title: 'Social Media Promotion',
    priority: 'Low',
    priorityClass: 'green',
    assignedTo: 'Not Assigned',
    dueDate: '01 Jan 2025',
    status: 'In Progress',
  },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`dashboard-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Active Events and Notifications */}
        <div className="dashboard-top">
          <div className="card overview-card">
            <h2>Active Events Overview</h2>
            {activeEvents.map((evt, idx) => (
              <div key={idx} className="overview-row">
                <span className="overview-name">{evt.name}</span>
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
                  <span>{evt.progress}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="card notifications-card">
            <h2>Notifications</h2>
            {notifications.map((note, idx) => (
              <div key={idx} className={`notification-item ${note.variant}`}>
                <span className="note-icon">•</span>
                <span>{note.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Management */}
        <div className="task-management">
          <h2>Task Management</h2>
          <div className="task-cards">
            {tasks.map((task, idx) => (
              <div key={idx} className="card task-card">
                <h3>{task.event}</h3>
                <p className="task-title">{task.title}</p>
                <p className="task-priority">
                  <span className={`status-dot ${task.priorityClass}`}></span>
                  Priority: {task.priority}
                </p>
                <p>Assigned To: {task.assignedTo}</p>
                <p>Due Date: {task.dueDate}</p>
                <p>Status: {task.status}</p>
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

export default Dashboard;