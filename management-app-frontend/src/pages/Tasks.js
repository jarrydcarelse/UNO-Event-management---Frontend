import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FiPlus, FiEdit, FiCheck, FiTrash2, FiX } from 'react-icons/fi';
import '../tasks/Tasks.css';

// Dummy data
const dummyTasks = [
  {
    id: 1,
    title: 'Finalize Guest List',
    description: 'Review and confirm final guest list for the wedding reception',
    dueDate: '2024-06-15',
    priority: 'High',
    assignedTo: 'Sarah Thompson',
    eventId: 1,
    eventName: 'Wedding Reception',
    completed: false
  },
  {
    id: 2,
    title: 'Caterer Selection',
    description: 'Choose and book catering service for corporate event',
    dueDate: '2024-06-20',
    priority: 'Medium',
    assignedTo: 'John Smith',
    eventId: 2,
    eventName: 'Corporate Year-End Gala',
    completed: false
  },
  {
    id: 3,
    title: 'Venue Setup',
    description: 'Coordinate with venue staff for event setup',
    dueDate: '2024-06-10',
    priority: 'High',
    assignedTo: 'Mike Johnson',
    eventId: 1,
    eventName: 'Wedding Reception',
    completed: true
  },
  {
    id: 4,
    title: 'Entertainment Booking',
    description: 'Book DJ and entertainment for the wedding',
    dueDate: '2024-06-05',
    priority: 'Medium',
    assignedTo: 'Sarah Thompson',
    eventId: 1,
    eventName: 'Wedding Reception',
    completed: true
  },
  {
    id: 5,
    title: 'Marketing Materials',
    description: 'Prepare and print marketing materials for product launch',
    dueDate: '2024-06-25',
    priority: 'Low',
    assignedTo: 'Not Assigned',
    eventId: 3,
    eventName: 'Tech Product Launch',
    completed: false
  }
];

export default function Tasks() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState(dummyTasks);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    assignedTo: '',
    eventId: ''
  });

  const handleAddTask = () => {
    setModalType('add');
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      assignedTo: '',
      eventId: ''
    });
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setModalType('edit');
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      assignedTo: task.assignedTo,
      eventId: task.eventId
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      const newTask = {
        ...formData,
        id: Date.now(),
        completed: false,
        eventName: 'New Event' // In a real app, this would come from the event data
      };
      setTasks([...tasks, newTask]);
    } else {
      setTasks(tasks.map(task => 
        task.id === selectedTask.id ? { ...task, ...formData } : task
      ));
    }
    setShowModal(false);
  };

  const handleCompleteTask = (task) => {
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, completed: true } : t
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const inProgressTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="tasks-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`tasks-page${sidebarOpen ? '' : ' collapsed'}`}>
        <div className="tasks-header">
          <h1>Tasks Overview</h1>
          <button className="add-task-btn" onClick={handleAddTask}>
            <FiPlus /> Add Task
          </button>
        </div>

        {/* In Progress Tasks Section */}
        <div className="tasks-section">
          <h2>In Progress</h2>
          <div className="tasks-grid">
            {inProgressTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <span>Event: {task.eventName}</span>
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  <span>Assigned to: {task.assignedTo}</span>
                </div>
                <div className="task-actions">
                  <button 
                    className="complete-btn"
                    onClick={() => handleCompleteTask(task)}
                  >
                    <FiCheck /> Complete
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditTask(task)}
                  >
                    <FiEdit /> Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Tasks Section */}
        <div className="tasks-section">
          <h2>Completed</h2>
          <div className="tasks-grid">
            {completedTasks.map(task => (
              <div key={task.id} className="task-card completed">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <span>Event: {task.eventName}</span>
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  <span>Assigned to: {task.assignedTo}</span>
                </div>
                <div className="task-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditTask(task)}
                  >
                    <FiEdit /> Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{modalType === 'add' ? 'Add Task' : 'Edit Task'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned To</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="save-btn">
                    {modalType === 'add' ? 'Add Task' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 