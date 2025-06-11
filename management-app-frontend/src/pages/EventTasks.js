import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiPlus, FiEdit, FiCheck, FiTrash2, FiX } from 'react-icons/fi';
import '../eventtasks/EventTasks.css';

// Update API_BASE to use the deployed backend URL
const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

// Add axios default configuration
axios.defaults.baseURL = API_BASE;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

// Add axios interceptor for debugging
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response Error:', error);
    if (error.response) {
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Headers:', error.response.headers);
    }
    return Promise.reject(error);
  }
);

export default function EventTasks() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [eventDetails, setEventDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: '',
    priority: 'Low',
    assignedToEmail: '',
    budget: '',
    description: '',
    dueDate: ''
  });

  // Computed values for tasks
  const tasksInProgress = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
      }
    };

    fetchUsers();
  }, [navigate]);

  // Fetch event details and tasks
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch event details
        const eventResponse = await axios.get(`/api/events/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Fetch tasks separately
        const tasksResponse = await axios.get(`${API_BASE}/api/eventtasks/byevent/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Validate and format tasks data
        let tasks = [];
        if (tasksResponse.data && Array.isArray(tasksResponse.data)) {
          tasks = tasksResponse.data.map(task => ({
            id: task.id,
            title: task.title,
            priority: task.priority,
            priorityClass: task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'yellow' : 'green',
            assignedTo: task.assignedToEmail,
            budget: task.budget,
            completed: task.completed,
            description: task.description,
            dueDate: formatDateForDisplay(task.dueDate),
            archived: task.archived
          }));
        }

        // Calculate completion percentage and budget totals
        const completedTasks = tasks.filter(t => t.completed).length;
        const totalTasks = tasks.length;
        const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Calculate overall budget (sum of all task budgets)
        const overallBudget = tasks.reduce((total, task) => {
          const budget = task.budget.replace(/[^0-9]/g, ''); // Remove 'R' and any other non-numeric characters
          return total + parseInt(budget || 0);
        }, 0);

        // Calculate spent amount (sum of completed task budgets)
        const spentAmount = tasks
          .filter(task => task.completed)
          .reduce((total, task) => {
            const budget = task.budget.replace(/[^0-9]/g, '');
            return total + parseInt(budget || 0);
          }, 0);

        // Set event details
        setEventDetails({
          name: eventResponse.data.title || 'Untitled Event',
          client: eventResponse.data.description || 'No description',
          deadline: formatDateForDisplay(eventResponse.data.date) || 'No deadline',
          progress: completionPercentage,
          completed: completedTasks,
          totalTasks: totalTasks,
          budget: `R${overallBudget.toLocaleString()}`,
          spent: `R${spentAmount.toLocaleString()}`,
          colorClass: completionPercentage === 100 ? 'green' : 'yellow'
        });

        setTasks(tasks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event data:', error);
        setError('Failed to load event data. Please try again later.');
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, navigate]);

  // Modal controls
  const openAddModal = () => {
    setModalType('add');
    setTaskForm({
      title: '',
      priority: 'Low',
      assignedToEmail: '',
      budget: '',
      description: '',
      dueDate: ''
    });
    setShowModal(true);
    setSelectedTask(null);
  };

  const openEditModal = (task) => {
    setModalType('edit');
    setTaskForm({
      title: task.title,
      priority: task.priority,
      assignedToEmail: task.assignedTo,
      budget: task.budget,
      description: task.description,
      dueDate: task.dueDate
    });
    setSelectedTask(task);
    setShowModal(true);
  };

  const openDeleteModal = (task) => {
    setModalType('delete');
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    setTaskForm({
      title: '',
      priority: 'Low',
      assignedToEmail: '',
      budget: '',
      description: '',
      dueDate: ''
    });
  };

  // Form handling
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  // Helper function to format date for API
  const formatDateForAPI = (dateString) => {
    if (!dateString) return new Date().toISOString();
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString();
      }
      return date.toISOString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date().toISOString();
    }
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Task operations
  const handleAddTask = async () => {
    if (!taskForm.title || !taskForm.assignedToEmail || !taskForm.budget) {
      setError('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    try {
      const formattedBudget = taskForm.budget.startsWith('R') 
        ? taskForm.budget.replace('R', '')
        : taskForm.budget;

      const taskData = {
        title: taskForm.title,
        priority: taskForm.priority,
        completed: false,
        description: taskForm.description || '',
        dueDate: formatDateForAPI(taskForm.dueDate),
        eventId: parseInt(eventId),
        assignedToEmail: taskForm.assignedToEmail,
        budget: formattedBudget
      };

      const response = await axios.post(
        `${API_BASE}/api/eventtasks`,
        taskData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        }
      );

      // Add new task immediately
      const newTask = {
        id: response.data.id,
        title: response.data.title,
        priority: response.data.priority,
        description: response.data.description,
        dueDate: response.data.dueDate ? formatDateForDisplay(response.data.dueDate) : null,
        assignedTo: response.data.assignedUser?.email || 'Unassigned',
        completed: false,
        budget: response.data.budget,
        eventId: response.data.eventId,
        archived: false
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      closeModal();
    } catch (err) {
      console.error('Error adding task:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`Failed to add task: ${err.response.data.message || 'Please try again.'}`);
      } else {
        setError('Failed to add task. Please try again.');
      }
    }
  };

  const handleEditTask = async () => {
    if (!taskForm.title || !taskForm.assignedToEmail || !taskForm.budget) {
      setError('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    try {
      const formattedBudget = taskForm.budget.startsWith('R') 
        ? taskForm.budget.replace('R', '')
        : taskForm.budget;

      const taskData = {
        title: taskForm.title,
        priority: taskForm.priority,
        completed: selectedTask.completed,
        description: taskForm.description || '',
        dueDate: formatDateForAPI(taskForm.dueDate),
        eventId: parseInt(eventId),
        assignedToEmail: taskForm.assignedToEmail,
        budget: formattedBudget
      };

      await axios.put(
        `${API_BASE}/api/eventtasks/${selectedTask.id}`,
        taskData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        }
      );

      // Update tasks immediately
      const updatedTasks = tasks.map(t => 
        t.id === selectedTask.id ? {
          ...t,
          title: taskForm.title,
          priority: taskForm.priority,
          description: taskForm.description || '',
          dueDate: taskForm.dueDate,
          assignedTo: taskForm.assignedToEmail,
          budget: formattedBudget
        } : t
      );
      setTasks(updatedTasks);
      closeModal();
    } catch (err) {
      console.error('Error updating task:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`Failed to update task: ${err.response.data.message || 'Please try again.'}`);
      } else {
        setError('Failed to update task. Please try again.');
      }
    }
  };

  const handleCompleteTask = async (task) => {
    const token = localStorage.getItem('token');
    try {
      const taskData = {
        id: task.id,
        title: task.title,
        priority: task.priority,
        completed: true,
        description: task.description,
        dueDate: task.dueDate ? formatDateForAPI(task.dueDate) : new Date().toISOString(),
        eventId: parseInt(eventId),
        assignedToEmail: task.assignedTo,
        budget: task.budget,
        archived: task.archived || false
      };

      await axios.put(
        `${API_BASE}/api/eventtasks/${task.id}`,
        taskData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // Update tasks immediately
      const updatedTasks = tasks.map(t => 
        t.id === task.id ? { ...t, completed: true } : t
      );
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Error completing task:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`Failed to complete task: ${err.response.data.message || 'Please try again.'}`);
      } else {
        setError('Failed to complete task. Please try again.');
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `${API_BASE}/api/eventtasks/${taskId}`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        }
      );

      // Update tasks immediately
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      closeModal();
    } catch (err) {
      console.error('Error deleting task:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`Failed to delete task: ${err.response.data.message || 'Please try again.'}`);
      } else {
        setError('Failed to delete task. Please try again.');
      }
    }
  };

  const toggleTaskCompletion = async (task) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Not authenticated');
      return;
    }
    try {
      await axios.put(
        `${API_BASE}/api/eventtasks/${task.id}`,
        {
          ...task,
          completed: !task.completed
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      // Refresh tasks after updating
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      if (err.response?.data?.error) {
        alert(`Failed to update task: ${err.response.data.error}`);
      } else {
        alert('Failed to update task. Please try again.');
      }
    }
  };

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Not authenticated');
      return;
    }
    try {
      // Archive the task on the backend
      await axios.put(
        `${API_BASE}/api/eventtasks/${taskId}`,
        {
          ...tasks.find(t => t.id === taskId),
          archived: true
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      // Remove the task from the frontend state
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error archiving task:', err);
      if (err.response?.data?.error) {
        alert(`Failed to archive task: ${err.response.data.error}`);
      } else {
        alert('Failed to archive task. Please try again.');
      }
    }
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${API_BASE}/api/eventtasks/byevent/${eventId}`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        }
      );

      const formattedTasks = response.data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? formatDateForDisplay(task.dueDate) : null,
        priority: task.priority,
        assignedTo: task.assignedUser?.email || 'Unassigned',
        completed: task.completed,
        budget: task.budget,
        eventId: task.eventId,
        archived: task.archived
      }));

      setTasks(formattedTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`Failed to load tasks: ${err.response.data.message || 'Please try again.'}`);
      } else {
        setError('Failed to load tasks. Please try again.');
      }
    }
  };

  // Make sure we fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, [eventId]);

  if (loading) {
    return (
      <div className="eventtasks-layout">
        <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`eventtasks-page${sidebarOpen ? '' : ' collapsed'}`}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!eventDetails) return <div>Event not found</div>;

  return (
    <div className="eventtasks-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`eventtasks-page${sidebarOpen ? '' : ' collapsed'}`}>
        {error && (
          <div className="eventtasks-error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Event Header */}
        <div className="eventtasks-header-card">
          <div>
            <h2 className="eventtasks-event-title">{eventDetails.name}</h2>
            <span className="eventtasks-event-client">{eventDetails.client}</span>
          </div>
          <span className={`status-dot ${eventDetails.colorClass}`} />
        </div>

        {/* Progress Card */}
        <div className="eventtasks-progress-card">
          <div className="eventtasks-progress-bar-bg">
            <div
              className="eventtasks-progress-bar-fill"
              style={{
                width: `${eventDetails.progress}%`,
                background:
                  eventDetails.colorClass === 'yellow'
                    ? '#FFCC00'
                    : eventDetails.colorClass === 'red'
                    ? '#FF3B30'
                    : '#34C759',
              }}
            />
          </div>
          <div className="eventtasks-stats-row">
            <span>Deadline: {eventDetails.deadline}</span>
            <span>Overall Progress: {eventDetails.progress}%</span>
            <span>
              Tasks Completed: {eventDetails.completed} | {eventDetails.totalTasks}
            </span>
            <span>Overall Budget: {eventDetails.budget}</span>
            <span>Overall Spent: {eventDetails.spent}</span>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="eventtasks-tasksection-card">
          <div className="eventtasks-tasksection-header">
            <h2>Task Management</h2>
            <button className="eventtasks-add-btn" onClick={openAddModal}>
              <FiPlus style={{ marginRight: 6 }} /> Add Task
            </button>
          </div>

          {/* Pending Tasks */}
          <div className="eventtasks-task-status-heading">Pending Tasks</div>
          <div className="eventtasks-tasks-grid">
            {tasksInProgress.length === 0 ? (
              <span className="eventtasks-empty-msg">No tasks in progress.</span>
            ) : (
              tasksInProgress.map((task) => (
                <div className="eventtasks-taskcard" key={task.id}>
                  <div className="eventtasks-taskcard-title-row">
                    {task.title}
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="eventtasks-taskbtn" title="Edit" onClick={() => openEditModal(task)}>
                        <FiEdit />
                      </button>
                      <button className="eventtasks-taskbtn" title="Delete" onClick={() => openDeleteModal(task)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <div className="eventtasks-taskcard-priority-row">
                    <span className={`eventtasks-status-dot ${task.priority ? task.priority.toLowerCase() : 'low'}`} />
                    Priority: {task.priority || 'Low'}
                  </div>
                  <div className="eventtasks-taskcard-meta">
                    <span>Assigned To: {task.assignedTo}</span>
                    <span>Budget: {task.budget}</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                  <div className="eventtasks-taskcard-description">
                    {task.description}
                  </div>
                  <div className="eventtasks-taskcard-actions">
                    <button className="eventtasks-taskbtn" onClick={() => handleCompleteTask(task)}>
                      <FiCheck style={{ marginRight: 4 }} /> Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Completed Tasks */}
          <div className="eventtasks-task-status-heading" style={{ marginTop: 36 }}>Completed Tasks</div>
          <div className="eventtasks-tasks-grid">
            {completedTasks.length === 0 ? (
              <span className="eventtasks-empty-msg">No completed tasks yet.</span>
            ) : (
              completedTasks.map((task) => (
                <div className="eventtasks-taskcard completed" key={task.id}>
                  <div className="eventtasks-taskcard-title-row">
                    {task.title}
                    <span className="eventtasks-check-circle">
                      <FiCheck />
                    </span>
                  </div>
                  <div className="eventtasks-taskcard-priority-row">
                    <span className={`eventtasks-status-dot ${task.priority ? task.priority.toLowerCase() : 'low'}`} />
                    Priority: {task.priority || 'Low'}
                  </div>
                  <div className="eventtasks-taskcard-meta">
                    <span>Assigned To: {task.assignedTo}</span>
                    <span>Budget: {task.budget}</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                  <div className="eventtasks-taskcard-description">
                    {task.description}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modals */}
        {showModal && (
          <div className="eventtasks-modal-overlay">
            <div className="eventtasks-modal">
              <div className="eventtasks-modal-header">
                <h3>
                  {modalType === 'add'
                    ? 'Add New Task'
                    : modalType === 'edit'
                    ? 'Edit Task'
                    : 'Delete Task'}
                </h3>
                <button className="eventtasks-modal-close" onClick={closeModal}>
                  <FiX />
                </button>
              </div>

              {modalType === 'delete' ? (
                <div className="eventtasks-modal-content">
                  <p>Are you sure you want to delete this task?</p>
                  <div className="eventtasks-modal-actions">
                    <button className="eventtasks-modal-btn pink" onClick={() => handleDeleteTask(selectedTask.id)}>
                      Delete
                    </button>
                    <button className="eventtasks-modal-btn" onClick={closeModal}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="eventtasks-modal-content">
                  <div className="eventtasks-modal-fields">
                    <label>Title: *</label>
                    <input
                      name="title"
                      value={taskForm.title}
                      onChange={handleFormChange}
                      placeholder="Task title"
                      required
                    />

                    <label>Priority: *</label>
                    <select 
                      name="priority" 
                      value={taskForm.priority} 
                      onChange={handleFormChange}
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>

                    <label>Assigned To: *</label>
                    <select
                      name="assignedToEmail"
                      value={taskForm.assignedToEmail}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option key={user.id} value={user.email}>
                          {user.email}
                        </option>
                      ))}
                    </select>

                    <label>Budget: *</label>
                    <input
                      name="budget"
                      value={taskForm.budget}
                      onChange={handleFormChange}
                      placeholder="e.g. R10 000"
                      required
                    />

                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={taskForm.description}
                      onChange={handleFormChange}
                      placeholder="Task description"
                    />

                    <label>Due Date:</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={taskForm.dueDate}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="eventtasks-modal-actions">
                    <button 
                      className="eventtasks-modal-btn pink"
                      onClick={modalType === 'add' ? handleAddTask : handleEditTask}
                    >
                      {modalType === 'add' ? 'Add Task' : 'Save Changes'}
                    </button>
                    <button className="eventtasks-modal-btn" onClick={closeModal}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
