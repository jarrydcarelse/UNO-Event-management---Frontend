import React, { useState } from 'react';
import '../styles/Dashboard.css';

const activeEvents = [
  { name: 'Wedding Reception', status: 'In Progress', progress: 17, colorClass: 'red' },
  { name: 'Corporate Year-End Gala', status: 'In Progress', progress: 50, colorClass: 'yellow' },
  { name: 'Tech Product Launch', status: 'In Progress', progress: 80, colorClass: 'green' },
  { name: 'UI Workshop', status: 'In Progress', progress: 25, colorClass: 'red' },
  { name: 'Catering Approval', status: 'In Progress', progress: 40, colorClass: 'yellow' },
  { name: 'Venue Setup', status: 'In Progress', progress: 60, colorClass: 'green' },
];

const notifications = [
  { text: 'New Event Request' },
  { text: 'New Event Request' },
  { text: 'Budget Warning' },
  { text: 'System Maintenance' },
  { text: 'New Comment Added' },
  { text: 'Overdue Task Alert' },
  { text: 'Invitation Accepted' },
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

export default function Dashboard() {
  // pagination for tasks
  const perPage = 3;
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(tasks.length / perPage);
  const pagedTasks = tasks.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="dashboard-container">
      <aside className="sidebar-placeholder" />

      <main className="dashboard-main">
        {/* Top row */}
        <div className="dashboard-top">
          <section className="card overview-card">
            <h2>Active Events Overview</h2>
            <hr className="section-divider" />
            <div className="scroll-container">
              {activeEvents.map((e,i) => (
                <div key={i} className="row event-row">
                  <span className="event-name">{e.name}</span>
                  <div className="status-group">
                    <span className={`status-dot ${e.colorClass}`}></span>
                    <span className="status-text">{e.status}</span>
                  </div>
                  <div className="progress-group">
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${e.colorClass}`}
                        style={{ width: `${e.progress}%` }}
                      />
                    </div>
                    <span className="progress-text">{e.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card notifications-card">
            <h2>Notifications</h2>
            <hr className="section-divider" />
            <div className="scroll-container">
              {notifications.map((n,i) => (
                <div key={i} className="row notification-row">
                  <span className="notification-icon">🔔</span>
                  <span className="notification-text">{n.text}</span>
                  <button className="notification-trash">🗑️</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Task Management with pagination */}
        <section className="card tasks-card">
          <h2>Task Management</h2>
          <hr className="section-divider" />

          <div className="tasks-container">
            {pagedTasks.map((t,i) => (
              <div key={i} className="task-block">
                <div className="task-header">
                  <span className="task-name">{t.event}</span>
                  <hr className="inner-divider" />
                </div>
                <p className="task-title">{t.title}</p>
                <div className="status-group">
                  <span className={`status-dot ${t.priorityClass}`}></span>
                  <span>Priority: {t.priority}</span>
                </div>
                <div className="task-meta">
                  <p>Assigned To: {t.assignedTo}</p>
                  <p>Due Date: {t.dueDate}</p>
                  <p>Status: {t.status}</p>
                </div>
                <div className="task-actions">
                  <button className="edit-btn">✎ Edit</button>
                  <button className="reassign-btn">⟲ Reassign</button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              ‹ Prev
            </button>
            <span>Page {page + 1} / {pageCount}</span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, pageCount - 1))}
              disabled={page === pageCount - 1}
            >
              Next ›
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
