import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaUser, FaTasks, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';
import { FiChevronDown, FiX } from 'react-icons/fi';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import '../employees/Employees.css';

// Update API_BASE to use the deployed backend URL
const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

// Add axios default configuration
axios.defaults.baseURL = API_BASE;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

export default function EmployeeStats() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('completion'); // 'completion' or 'total'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeTasks, setEmployeeTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [allTasks, setAllTasks] = useState([]);

  // Fetch all tasks
  useEffect(() => {
    const fetchAllTasks = async () => {
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
        setAllTasks(response.data);
      } catch (error) {
        console.error('Error fetching all tasks:', error);
        setError('Failed to load tasks. Please try again later.');
      }
    };

    fetchAllTasks();
  }, []);

  // Fetch employees and calculate their statistics
  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch all users
        const usersResponse = await axios.get('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Calculate statistics for each user based on their assigned tasks
        const employeeStats = usersResponse.data.map(user => {
          const userTasks = allTasks.filter(task => task.assignedToEmail === user.email);
          const completedTasks = userTasks.filter(task => task.completed).length;
          const totalTasks = userTasks.length;
          const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            totalTasks,
            completedTasks,
            completionRate: completionRate.toFixed(1),
            tasks: userTasks
          };
        });

        // Sort employees by completion rate
        const sortedEmployees = employeeStats.sort((a, b) => parseFloat(b.completionRate) - parseFloat(a.completionRate));
        setEmployees(sortedEmployees);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee statistics:', error);
        setError('Failed to load employee statistics. Please try again later.');
        setLoading(false);
      }
    };

    if (allTasks.length > 0) {
      fetchEmployeeStats();
    }
  }, [allTasks]);

  const handleSortChange = () => {
    setSortBy(prev => prev === 'completion' ? 'total' : 'completion');
    setEmployees(prev => {
      const sorted = [...prev].sort((a, b) => {
        if (sortBy === 'completion') {
          return b.totalTasks - a.totalTasks;
        }
        return parseFloat(b.completionRate) - parseFloat(a.completionRate);
      });
      return sorted;
    });
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeTasks(employee.tasks);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setEmployeeTasks([]);
  };

  if (loading) {
    return (
      <div className="employees-layout">
        <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`employees-page${sidebarOpen ? '' : ' collapsed'}`}>
          <div className="employees-header-row">
            <h2 className="employees-title">Employee Statistics</h2>
          </div>
          <div className="employees-cards-grid" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: 'calc(100vh - 200px)'
          }}>
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employees-layout">
        <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`employees-page${sidebarOpen ? '' : ' collapsed'}`}>
          <div className="employees-header-row">
            <h2 className="employees-title">Employee Statistics</h2>
          </div>
          <div className="employees-cards-grid">
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employees-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`employees-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Header */}
        <div className="employees-header-row">
          <h2 className="employees-title">Employee Statistics</h2>
          <div className="employees-sort" onClick={handleSortChange}>
            <span>Sort By {sortBy === 'completion' ? 'Completion Rate' : 'Total Tasks'}</span>
            <FiChevronDown className="sort-icon" />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="employees-cards-grid">
          {employees.length === 0 ? (
            <div className="employees-empty-state">
              <h3>No Employee Data Available</h3>
              <p>There are no employees registered in the system yet.</p>
            </div>
          ) : (
            employees.map((employee) => (
              <div 
                className="employees-card" 
                key={employee.id}
                onClick={() => handleEmployeeClick(employee)}
                style={{ cursor: 'pointer' }}
              >
                <div className="employees-card-title">
                  <div className="profile-icon">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=FF8FAB&color=fff`} 
                      alt={employee.name}
                      className="profile-image"
                    />
                  </div>
                  {employee.name}
                </div>
                <div className="employees-meta-row">
                  <span className="employees-label">Email:</span>
                  <span className="employees-value">{employee.email}</span>
                </div>
                <div className="employees-meta-row">
                  <span className="employees-label">User ID:</span>
                  <span className="employees-value">{employee.id}</span>
                </div>
                <div className="employees-meta-row">
                  <span className="employees-label">Total Tasks:</span>
                  <span className="employees-value">
                    <FaTasks style={{ marginRight: 8 }} />
                    {employee.totalTasks}
                  </span>
                </div>
                <div className="employees-meta-row">
                  <span className="employees-label">Completed:</span>
                  <span className="employees-value">
                    <FaCheckCircle style={{ marginRight: 8, color: '#34C759' }} />
                    {employee.completedTasks}
                  </span>
                </div>
                <div className="employees-notes-section">
                  <span className="employees-label">Completion Rate:</span>
                  <div className="employees-notes">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${employee.completionRate}%` }}
                      />
                    </div>
                    <span className="progress-text">{employee.completionRate}%</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Task Modal */}
        {selectedEmployee && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selectedEmployee.name}'s Tasks</h3>
                <button className="modal-close" onClick={closeModal}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                {employeeTasks.length === 0 ? (
                  <p>No tasks assigned to this employee.</p>
                ) : (
                  <div className="tasks-list">
                    {employeeTasks.map(task => (
                      <div key={task.id} className="task-item">
                        <div className="task-header">
                          <h4>{task.title}</h4>
                          <span className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
                            {task.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                        <p className="task-description">{task.description}</p>
                        <div className="task-details">
                          <span className="task-priority">Priority: {task.priority}</span>
                          <span className="task-due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          <span className="task-budget">Budget: {task.budget}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
