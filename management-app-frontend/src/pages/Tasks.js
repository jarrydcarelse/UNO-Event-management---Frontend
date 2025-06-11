import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../tasks/Tasks.css';

// Update API_BASE to use the deployed backend URL
const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

// Add axios default configuration
axios.defaults.baseURL = API_BASE;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

export default function Tasks() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/eventtasks', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Transform the tasks data to match our display format
        const formattedTasks = response.data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          priorityClass: task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'yellow' : 'green',
          assignedTo: task.assignedToEmail,
          completed: task.completed,
          budget: task.budget,
          eventId: task.eventId
        }));

        setTasks(formattedTasks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks. Please try again later.');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const inProgressTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const completedCount = completedTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="tasks-layout">
        <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`tasks-page${sidebarOpen ? '' : ' collapsed'}`}>
          <div className="tasks-header">
            <h1>Tasks Overview</h1>
          </div>
          <div className="tasks-section">
            <p>Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-layout">
        <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`tasks-page${sidebarOpen ? '' : ' collapsed'}`}>
          <div className="tasks-header">
            <h1>Tasks Overview</h1>
          </div>
          <div className="tasks-section">
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`tasks-page${sidebarOpen ? '' : ' collapsed'}`}>
        <div className="tasks-header">
          <h1>Tasks Overview</h1>
        </div>

        {/* Progress Bar Section */}
        <div className="tasks-progress-section">
          <div className="progress-stats">
            <div className="progress-stat">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{totalTasks}</span>
            </div>
            <div className="progress-stat">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{completedCount}</span>
            </div>
            <div className="progress-stat">
              <span className="stat-label">In Progress</span>
              <span className="stat-value">{inProgressTasks.length}</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: progressPercentage === 100 ? '#FF8FAB' : progressPercentage > 50 ? '#FF8FAB' : '#FF8FAB'
                }}
              />
            </div>
            <span className="progress-percentage">{progressPercentage}%</span>
          </div>
        </div>

        {/* In Progress Tasks Section */}
        <div className="tasks-section">
          <h2>In Progress</h2>
          <div className="tasks-grid">
            {inProgressTasks.length === 0 ? (
              <p className="no-tasks">No tasks in progress</p>
            ) : (
              inProgressTasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3 className="task-name">{task.title}</h3>
                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
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
                      Budget: <strong>{task.budget}</strong>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Tasks Section */}
        <div className="tasks-section">
          <h2>Completed</h2>
          <div className="tasks-grid">
            {completedTasks.length === 0 ? (
              <p className="no-tasks">No completed tasks</p>
            ) : (
              completedTasks.map(task => (
                <div key={task.id} className="task-card completed">
                  <div className="task-header">
                    <h3 className="task-name">{task.title}</h3>
                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
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
                      Budget: <strong>{task.budget}</strong>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 