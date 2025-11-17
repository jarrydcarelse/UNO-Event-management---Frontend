import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import PageSkeleton from '../components/SkeletonLoader';
import '../dashboard/Dashboard.css';

const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`${API_BASE}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data || []))
      .catch((err) => {
        console.error('Fetch events error:', err);
        setError('Could not load active events.');
      });

    axios
      .get(`${API_BASE}/api/eventtasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then((res) => {
        const formatted = res.data.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          dueDate: t.dueDate,
          completed: t.completed,
          assignedTo: t.assignedToEmail,
        }));
        setTasks(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch tasks error:', err);
        setError('Could not load tasks.');
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    const scrollContainer = document.getElementById('tasks-scroll');
    const tasksCard = document.querySelector('.tasks-card');
    
    if (!scrollContainer || !tasksCard) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      
      if (isAtBottom) {
        tasksCard.classList.add('scrolled-to-bottom');
      } else {
        tasksCard.classList.remove('scrolled-to-bottom');
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [tasks]);

  return (
    <div className="dashboard-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`dashboard-page${sidebarOpen ? '' : ' collapsed'}`}>
        <h1 className="dashboard-main-header">Dashboard</h1>

        {loading ? (
          <PageSkeleton type="dashboard" />
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>{events.length}</h3>
                <p>Active Events</p>
              </div>
              <div className="stat-card">
                <h3>{tasks.filter((t) => !t.completed).length}</h3>
                <p>Open Tasks</p>
              </div>
              <div className="stat-card">
                <h3>{tasks.filter((t) => t.completed).length}</h3>
                <p>Completed Tasks</p>
              </div>
            </div>

            <div className="dashboard-content">
              <div className="card overview-card">
                <h2>My Events</h2>
                <div className="scroll-container">
                  {error && <p className="error-text">{error}</p>}
                  {!error && events.length === 0 && (
                    <p>No active events found.</p>
                  )}
                  {events.map((evt) => (
                    <div key={evt.id} className="overview-row">
                      <div className="overview-main">
                        <span className="overview-name">{evt.title}</span>
                        <div className="overview-details">
                          <span>
                            <b>Event Date:</b>{' '}
                            {new Date(evt.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="overview-status">
                        <span
                          className={`status-dot ${
                            evt.status === 'Completed' ? 'green' : 'yellow'
                          }`}
                        />
                        <span>{evt.status || 'In Progress'}</span>
                      </div>
                      <div className="overview-progress">
                        <div className="progress-bar-bg">
                          <div
                            className={`progress-bar-fill ${
                              evt.status === 'Completed' ? 'green' : 'yellow'
                            }`}
                            style={{ width: evt.progress + '%' }}
                          />
                        </div>
                        <span>{evt.progress || 0}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card tasks-card">
                <div className="tasks-header">
                  <h2>Recent Tasks</h2>
                  <span className="task-count">{tasks.length} total</span>
                </div>
                <div className="scroll-container" id="tasks-scroll">
                  {error && <p className="error-text">{error}</p>}
                  {!error && tasks.length === 0 && <p>No tasks found.</p>}
                  <div className="task-cards">
                    {tasks
                      .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
                      .slice(0, 4)
                      .map((task) => (
                        <div key={task.id} className="task-block">
                          <h3 className="task-name">{task.title}</h3>
                          <hr className="inner-divider" />

                          <p className="task-desc">
                            Description: <strong>{task.description}</strong>
                          </p>
                          <hr className="inner-divider" />

                          <div className="task-meta">
                            <p>
                              Assigned To: <strong>{task.assignedTo}</strong>
                            </p>
                            <p>
                              Due Date: <strong>{new Date(task.dueDate).toLocaleDateString()}</strong>
                            </p>
                            <p>
                              Status: <strong>{task.completed ? 'Completed' : 'In Progress'}</strong>
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  {tasks.length > 2 && (
                    <div className="scroll-indicator">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                      <span>Scroll for more</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}