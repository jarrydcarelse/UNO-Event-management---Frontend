import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaUser, FaTasks, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';
import { FiChevronDown, FiX } from 'react-icons/fi';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import PageSkeleton from '../components/SkeletonLoader';
import '../employees/Employees.css';


const API_BASE = 'https://eventify-backend-kgtm.onrender.com';


axios.defaults.baseURL = API_BASE;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

export default function EmployeeStats() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('completion'); 
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeTasks, setEmployeeTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTab, setSelectedTab] = useState('tasks'); 


  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
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


  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

     
        const usersResponse = await axios.get('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        
        const employeeStats = usersResponse.data.map(user => {
          const userTasks = allTasks.filter(task => task.assignedToEmail === user.email);
          const completedTasks = userTasks.filter(task => task.completed).length;
          const totalTasks = userTasks.length;
          const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          console.log(`Employee: ${user.name || user.email}, Total: ${totalTasks}, Completed: ${completedTasks}, Rate: ${completionRate.toFixed(1)}%`);

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

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
    
    setEmployees(prev => {
      const sorted = [...prev].sort((a, b) => {
        if (newSortBy === 'completion') {
          return parseFloat(b.completionRate) - parseFloat(a.completionRate);
        } else if (newSortBy === 'total') {
          return b.totalTasks - a.totalTasks;
        } else if (newSortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
      return sorted;
    });
  };

  const getSortLabel = () => {
    switch(sortBy) {
      case 'completion': return 'Completion Rate';
      case 'total': return 'Total Tasks';
      case 'name': return 'Name';
      default: return 'Completion Rate';
    }
  };

  const getProgressColor = (rate) => {
    if (rate >= 80) return '#34C759'; 
    if (rate >= 50) return '#FFCC00'; 
    return '#FF3B30'; 
  };

  const getRankBadge = (index) => {
    if (index === 0) return {color: '#FFD700', label: 'Top Performer' };
    if (index === 1) return {color: '#C0C0C0', label: '2nd Place' };
    if (index === 2) return {color: '#CD7F32', label: '3rd Place' };
    return null;
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEmployees = employees.length;
  const avgCompletionRate = employees.length > 0 
    ? (employees.reduce((sum, emp) => sum + parseFloat(emp.completionRate), 0) / employees.length).toFixed(1)
    : 0;
  const totalTasksCount = employees.reduce((sum, emp) => sum + emp.totalTasks, 0);
  const bestPerformer = employees.length > 0 ? employees[0] : null;

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeTasks(employee.tasks);
    setSelectedTab('tasks');
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
          <PageSkeleton type="employees" />
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
          <div className="header-actions">
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="6" rx="1"/>
                  <rect x="9" y="1" width="6" height="6" rx="1"/>
                  <rect x="1" y="9" width="6" height="6" rx="1"/>
                  <rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="2" width="14" height="2" rx="1"/>
                  <rect x="1" y="7" width="14" height="2" rx="1"/>
                  <rect x="1" y="12" width="14" height="2" rx="1"/>
                </svg>
              </button>
            </div>
            <div className="employees-sort" onClick={() => setShowSortDropdown(!showSortDropdown)}>
              <span>Sort By: {getSortLabel()}</span>
              <FiChevronDown className="sort-icon" style={{ transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }} />
              {showSortDropdown && (
                <div className="employees-sort-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div 
                    className={`employees-sort-option ${sortBy === 'completion' ? 'active' : ''}`}
                    onClick={() => handleSortChange('completion')}
                  >
                    <FaCheckCircle /> Completion Rate
                  </div>
                  <div 
                    className={`employees-sort-option ${sortBy === 'total' ? 'active' : ''}`}
                    onClick={() => handleSortChange('total')}
                  >
                    <FaTasks /> Total Tasks
                  </div>
                  <div 
                    className={`employees-sort-option ${sortBy === 'name' ? 'active' : ''}`}
                    onClick={() => handleSortChange('name')}
                  >
                    <FaUser /> Name
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="overview-stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <FaUser />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Employees</div>
              <div className="stat-value">{totalEmployees}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <div className="stat-label">Avg Completion</div>
              <div className="stat-value">{avgCompletionRate}%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <FaTasks />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Tasks</div>
              <div className="stat-value">{totalTasksCount}</div>
            </div>
          </div>
          <div className="stat-card best-performer">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}>
              🏆
            </div>
            <div className="stat-content">
              <div className="stat-label">Top Performer</div>
              <div className="stat-value" style={{ fontSize: '1rem' }}>{bestPerformer?.name || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar-container">
          <div className="search-bar">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search employees by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <FiX />
              </button>
            )}
          </div>
          {filteredEmployees.length > 0 && (
            <div className="results-count">
              Showing {filteredEmployees.length} of {totalEmployees} employees
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className={`employees-cards-grid ${viewMode}`}>
          {filteredEmployees.length === 0 ? (
            <div className="employees-empty-state">
              <div className="empty-illustration">👥</div>
              <h3>{searchQuery ? 'No employees found' : 'No Employee Data Available'}</h3>
              <p>{searchQuery ? 'Try adjusting your search terms' : 'There are no employees registered in the system yet.'}</p>
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            filteredEmployees.map((employee, index) => {
              const rankBadge = getRankBadge(index);
              const progressColor = getProgressColor(parseFloat(employee.completionRate));
              const pendingTasks = employee.totalTasks - employee.completedTasks;
              
              return (
                <div 
                  className={`employees-card ${viewMode}`}
                  key={employee.id}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  {rankBadge && (
                    <div className="rank-badge" style={{ background: rankBadge.color }}>
                      <span className="rank-emoji">{rankBadge.emoji}</span>
                      <span className="rank-label">{rankBadge.label}</span>
                    </div>
                  )}
                  
                  <div className="employees-card-header">
                    <div className="profile-section">
                      <div className="profile-icon">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=FF8FAB&color=fff&size=80&bold=true`} 
                          alt={employee.name}
                          className="profile-image"
                        />
                        <div className="online-indicator"></div>
                      </div>
                      <div className="employee-info">
                        <h3 className="employees-card-title">{employee.name}</h3>
                        <p className="employee-email">{employee.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="employees-card-body">
                    <div className="stats-row">
                      <div className="stat-item">
                        <FaTasks className="stat-icon-small" />
                        <div>
                          <div className="stat-number">{employee.totalTasks}</div>
                          <div className="stat-label-small">Total Tasks</div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <FaCheckCircle className="stat-icon-small" style={{ color: '#34C759' }} />
                        <div>
                          <div className="stat-number">{employee.completedTasks}</div>
                          <div className="stat-label-small">Completed</div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <FaClock className="stat-icon-small" style={{ color: '#FF9500' }} />
                        <div>
                          <div className="stat-number">{pendingTasks}</div>
                          <div className="stat-label-small">Pending</div>
                        </div>
                      </div>
                    </div>

                    <div className="employees-notes-section">
                      <div className="progress-header">
                        <span className="employees-label">Completion Rate</span>
                        <span className="progress-text" style={{ color: progressColor, fontWeight: 'bold' }}>
                          {employee.completionRate}%
                        </span>
                      </div>
                      <div className="employees-notes">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${employee.completionRate}%`,
                              background: `linear-gradient(90deg, ${progressColor}, ${progressColor}dd)`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="action-btn primary">
                      <FaTasks style={{ marginRight: 6 }} /> View Tasks
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Task Modal */}
        {selectedEmployee && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content enhanced" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-header-content">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedEmployee.name)}&background=FF8FAB&color=fff&size=60&bold=true`} 
                    alt={selectedEmployee.name}
                    className="modal-avatar"
                  />
                  <div>
                    <h3>{selectedEmployee.name}</h3>
                    <p className="modal-email">{selectedEmployee.email}</p>
                  </div>
                </div>
                <button className="modal-close" onClick={closeModal}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-tabs">
                <button 
                  className={`modal-tab ${selectedTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setSelectedTab('overview')}
                >
                  <FaUser /> Overview
                </button>
                <button 
                  className={`modal-tab ${selectedTab === 'tasks' ? 'active' : ''}`}
                  onClick={() => setSelectedTab('tasks')}
                >
                  <FaTasks /> Tasks ({employeeTasks.length})
                </button>
              </div>

              <div className="modal-body">
                {selectedTab === 'overview' && (
                  <div className="overview-tab">
                    <div className="overview-stats">
                      <div className="overview-stat-card">
                        <div className="overview-stat-icon" style={{ background: '#4facfe' }}>
                          <FaTasks />
                        </div>
                        <div>
                          <div className="overview-stat-value">{selectedEmployee.totalTasks}</div>
                          <div className="overview-stat-label">Total Tasks</div>
                        </div>
                      </div>
                      <div className="overview-stat-card">
                        <div className="overview-stat-icon" style={{ background: '#34C759' }}>
                          <FaCheckCircle />
                        </div>
                        <div>
                          <div className="overview-stat-value">{selectedEmployee.completedTasks}</div>
                          <div className="overview-stat-label">Completed</div>
                        </div>
                      </div>
                      <div className="overview-stat-card">
                        <div className="overview-stat-icon" style={{ background: '#FF9500' }}>
                          <FaClock />
                        </div>
                        <div>
                          <div className="overview-stat-value">{selectedEmployee.totalTasks - selectedEmployee.completedTasks}</div>
                          <div className="overview-stat-label">Pending</div>
                        </div>
                      </div>
                    </div>
                    <div className="performance-section">
                      <h4>Performance</h4>
                      <div className="performance-bar-large">
                        <div className="performance-label">
                          <span>Completion Rate</span>
                          <span className="performance-value">{selectedEmployee.completionRate}%</span>
                        </div>
                        <div className="progress-bar-large">
                          <div 
                            className="progress-fill-large" 
                            style={{ 
                              width: `${selectedEmployee.completionRate}%`,
                              background: `linear-gradient(90deg, ${getProgressColor(parseFloat(selectedEmployee.completionRate))}, ${getProgressColor(parseFloat(selectedEmployee.completionRate))}dd)`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'tasks' && (
                  <div className="tasks-tab">
                    {employeeTasks.length === 0 ? (
                      <div className="no-tasks-message">
                        <FaTasks style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }} />
                        <p>No tasks assigned to this employee.</p>
                      </div>
                    ) : (
                      <div className="tasks-list">
                        {employeeTasks.map(task => (
                          <div key={task.id} className="task-item">
                            <div className="task-header">
                              <h4>{task.title}</h4>
                              <span className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
                                {task.completed ? '✓ Completed' : '⏳ Pending'}
                              </span>
                            </div>
                            <p className="task-description">{task.description}</p>
                            <div className="task-details">
                              <span className="task-priority">
                                <span className={`priority-dot ${task.priority?.toLowerCase()}`}></span>
                                {task.priority}
                              </span>
                              <span className="task-due-date">
                                📅 {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                              <span className="task-budget">
                                💰 {task.budget}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
