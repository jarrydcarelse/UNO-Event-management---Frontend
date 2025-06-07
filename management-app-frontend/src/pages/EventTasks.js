import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
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
  const [taskForm, setTaskForm] = useState({
    title: '',
    priority: 'Low',
    assignedTo: '',
    budget: '',
    description: '',
    dueDate: ''
  });

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
        const tasksResponse = await axios.get(`/api/events/${eventId}/tasks`, {
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
            assignedTo: task.assignedTo,
            budget: task.budget,
            completed: task.completed,
            description: task.description,
            dueDate: formatDateForDisplay(task.dueDate),
            archived: task.archived
          }));
        }

        // Calculate completion percentage
        const completedTasks = tasks.filter(t => t.completed).length;
        const totalTasks = tasks.length;
        const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Set event details
        setEventDetails({
          name: eventResponse.data.title || 'Untitled Event',
          client: eventResponse.data.description || 'No description',
          deadline: formatDateForDisplay(eventResponse.data.date) || 'No deadline',
          progress: completionPercentage,
          completed: completedTasks,
          totalTasks: totalTasks,
          budget: eventResponse.data.budget || 'R0',
          spent: eventResponse.data.spent || 'R0',
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
      assignedTo: '',
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
      assignedTo: task.assignedTo,
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
      assignedTo: '',
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
    if (!taskForm.title || !taskForm.assignedTo || !taskForm.budget) {
      setError('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    try {
      // Format the budget to ensure it's a string with R prefix
      const formattedBudget = taskForm.budget.startsWith('R') 
        ? taskForm.budget 
        : `R${taskForm.budget}`;

      // Create task data matching the API requirements exactly
      const taskData = {
        title: taskForm.title,
        priority: taskForm.priority,
        assignedTo: taskForm.assignedTo,
        budget: formattedBudget,
        description: taskForm.description || '',
        dueDate: formatDateForAPI(taskForm.dueDate),
        completed: false,
        archived: false,
        eventId: parseInt(eventId)
      };

      console.log('Sending task data:', taskData);

      const response = await axios({
        method: 'post',
        url: `/api/events/${eventId}/tasks`,
        data: taskData,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status >= 400) {
        throw new Error(response.data.message || 'Failed to add task');
      }

      console.log('Task added successfully:', response.data);

      // Create new task object from response data
      const newTask = {
        id: response.data.id,
        title: response.data.title,
        priority: response.data.priority,
        priorityClass: response.data.priority === 'High' ? 'red' : response.data.priority === 'Medium' ? 'yellow' : 'green',
        assignedTo: response.data.assignedTo,
        budget: response.data.budget,
        completed: response.data.completed,
        description: response.data.description,
        dueDate: formatDateForDisplay(response.data.dueDate),
        archived: response.data.archived
      };

      setTasks(prev => [...prev, newTask]);
      closeModal();

      // Refresh event stats
      const budgetRes = await axios({
        method: 'get',
        url: `/api/events/${eventId}/tasks/budget`,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      // Calculate new completion stats
      const updatedTasks = [...tasks, newTask];
      const completedTasks = updatedTasks.filter(t => t.completed).length;
      const totalTasks = updatedTasks.length;
      const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      setEventDetails(prev => ({
        ...prev,
        progress: completionPercentage,
        totalTasks: totalTasks,
        budget: `R${budgetRes.data.toLocaleString()}`,
        colorClass: completionPercentage === 100 ? 'green' : 'yellow'
      }));
    } catch (error) {
      console.error('Error adding task:', error);
      setError(error.response?.data?.message || 'Failed to add task. Please try again.');
    }
  };

  const handleEditTask = async () => {
    if (!taskForm.title || !taskForm.assignedTo || !taskForm.budget) {
      setError('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    try {
      // Format the budget to ensure it's a string with R prefix
      const formattedBudget = taskForm.budget.startsWith('R') 
        ? taskForm.budget 
        : `R${taskForm.budget}`;

      const taskData = {
        title: taskForm.title,
        priority: taskForm.priority,
        assignedTo: taskForm.assignedTo,
        budget: formattedBudget,
        description: taskForm.description || '',
        dueDate: formatDateForAPI(taskForm.dueDate),
        completed: selectedTask.completed,
        archived: false,
        eventId: parseInt(eventId)
      };

      console.log('Updating task with data:', taskData);

      const response = await axios({
        method: 'put',
        url: `/api/events/${eventId}/tasks/${selectedTask.id}`,
        data: taskData,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      });

      console.log('Task updated successfully:', response.data);

      // Update the task in the tasks list
      const updatedTask = {
        id: response.data.id,
        title: response.data.title,
        priority: response.data.priority,
        priorityClass: response.data.priority === 'High' ? 'red' : response.data.priority === 'Medium' ? 'yellow' : 'green',
        assignedTo: response.data.assignedTo,
        budget: response.data.budget,
        completed: response.data.completed,
        description: response.data.description,
        dueDate: formatDateForDisplay(response.data.dueDate),
        archived: response.data.archived
      };

      setTasks(prev =>
        prev.map(task =>
          task.id === selectedTask.id ? updatedTask : task
        )
      );

      // Close the modal
      closeModal();

      // Refresh event stats
      const budgetRes = await axios({
        method: 'get',
        url: `/api/events/${eventId}/tasks/budget`,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      });

      // Calculate new completion stats
      const updatedTasks = tasks.map(t => t.id === selectedTask.id ? updatedTask : t);
      const completedTasks = updatedTasks.filter(t => t.completed).length;
      const totalTasks = updatedTasks.length;
      const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      setEventDetails(prev => ({
        ...prev,
        progress: completionPercentage,
        budget: `R${budgetRes.data.toLocaleString()}`,
        colorClass: completionPercentage === 100 ? 'green' : 'yellow'
      }));
    } catch (err) {
      console.error('Error updating task:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        setError(`Failed to update task: ${err.response.data.message || 'Please try again.'}`);
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('No response received from server. Please check your connection and try again.');
      } else {
        console.error('Error message:', err.message);
        setError(`Failed to update task: ${err.message}`);
      }
    }
  };

  const handleCompleteTask = async (task) => {
    const token = localStorage.getItem('token');
    try {
      const taskData = {
        ...task,
        completed: true,
        eventId: parseInt(eventId),
        archived: false,
        dueDate: task.dueDate ? formatDateForAPI(task.dueDate) : new Date().toISOString()
      };

      console.log('Completing task with data:', taskData);

      const response = await axios.put(
        `/api/events/${eventId}/tasks/${task.id}`,
        taskData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Task completed successfully:', response.data);

      // Update the task in the tasks list
      const updatedTask = {
        ...task,
        completed: true
      };

      setTasks(prev =>
        prev.map(t =>
          t.id === task.id ? updatedTask : t
        )
      );

      // Calculate new completion stats
      const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
      const completedTasks = updatedTasks.filter(t => t.completed).length;
      const totalTasks = updatedTasks.length;
      const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Refresh budget
      const budgetRes = await axios.get(`/api/events/${eventId}/tasks/budget`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setEventDetails(prev => ({
        ...prev,
        progress: completionPercentage,
        completed: completedTasks,
        budget: `R${budgetRes.data.toLocaleString()}`,
        colorClass: completionPercentage === 100 ? 'green' : 'yellow'
      }));
    } catch (err) {
      console.error('Error completing task:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`Failed to complete task: ${err.response.data.message || 'Please try again.'}`);
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('No response received from server. Please check your connection.');
      } else {
        setError('Failed to complete task. Please try again.');
      }
    }
  };

  const handleDeleteTask = async () => {
    const token = localStorage.getItem('token');
    try {
      const taskData = {
        ...selectedTask,
        archived: true,
        eventId: parseInt(eventId),
        dueDate: formatDateForAPI(selectedTask.dueDate)
      };

      await axios.put(
        `/api/events/${eventId}/tasks/${selectedTask.id}`,
        taskData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );

      // Remove the task from the UI
      setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
      closeModal();

      // Calculate new completion stats
      const updatedTasks = tasks.filter(t => t.id !== selectedTask.id);
      const completedTasks = updatedTasks.filter(t => t.completed).length;
      const totalTasks = updatedTasks.length;
      const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Refresh budget
      const budgetRes = await axios.get(`/api/events/${eventId}/tasks/budget`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setEventDetails(prev => ({
        ...prev,
        progress: completionPercentage,
        totalTasks: totalTasks,
        budget: `R${budgetRes.data.toLocaleString()}`,
        colorClass: completionPercentage === 100 ? 'green' : 'yellow'
      }));
    } catch (err) {
      console.error('Error archiving task:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`Failed to archive task: ${err.response.data.message || 'Please try again.'}`);
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('No response received from server. Please check your connection.');
      } else {
        setError('Failed to archive task. Please try again.');
      }
    }
  };

  // Task lists
  const tasksInProgress = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (loading) return <div>Loading...</div>;
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

          {/* In Progress Tasks */}
          <div className="eventtasks-task-status-heading">Tasks To Do</div>
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
                    <span className={`eventtasks-status-dot ${task.priorityClass}`} />
                    Priority: {task.priority}
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
                    <span className={`eventtasks-status-dot ${task.priorityClass}`} />
                    Priority: {task.priority}
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
                    <button className="eventtasks-modal-btn pink" onClick={handleDeleteTask}>
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
                    <input
                      name="assignedTo"
                      value={taskForm.assignedTo}
                      onChange={handleFormChange}
                      placeholder="Assignee name"
                      required
                    />

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
