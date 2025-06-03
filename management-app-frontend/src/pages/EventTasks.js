import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
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

const EventTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Book Venue', priority: 'High', priorityClass: 'red', assignedTo: 'John Doe', budget: 'R120 000', completed: false },
    { id: 2, title: 'Caterer Selection', priority: 'Medium', priorityClass: 'yellow', assignedTo: 'Lisa Smith', budget: 'R80 000', completed: false },
    { id: 3, title: 'Guest List Management', priority: 'High', priorityClass: 'red', assignedTo: 'Michael Johnson', budget: 'R15 000', completed: false },
    { id: 4, title: 'Photography & Videography', priority: 'Medium', priorityClass: 'yellow', assignedTo: 'Lisa Smith', budget: 'R40 000', completed: false },
    { id: 5, title: 'Event Promotion & Invitations', priority: 'Low', priorityClass: 'green', assignedTo: 'John Doe', budget: 'R25 000', completed: false },
    { id: 6, title: 'Event Branding & Design', priority: 'Low', priorityClass: 'green', assignedTo: 'Michael Johnson', budget: 'R30 000', completed: true },
    { id: 7, title: 'Entertainment & Music', priority: 'High', priorityClass: 'red', assignedTo: 'N/A', budget: 'R50 000', completed: true },
    { id: 8, title: 'Seating Arrangement & Decor', priority: 'Medium', priorityClass: 'yellow', assignedTo: 'N/A', budget: 'R20 000', completed: true },
    { id: 9, title: 'Technical Setup', priority: 'High', priorityClass: 'red', assignedTo: 'N/A', budget: 'R35 000', completed: true },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingData, setEditingData] = useState({ title: '', priority: '', assignedTo: '', budget: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskData, setNewTaskData] = useState({ title: '', priority: 'Low', assignedTo: '', budget: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditingData({ title: task.title, priority: task.priority, assignedTo: task.assignedTo, budget: task.budget });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingData({ ...editingData, [name]: value });
  };

  const handleSaveClick = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...editingData, priorityClass:
      editingData.priority === 'High' ? 'red' : editingData.priority === 'Medium' ? 'yellow' : 'green'
    } : task));
    setEditingTaskId(null);
  };

  const handleCancelClick = () => {
    setEditingTaskId(null);
  };

  const handleCompleteClick = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    ));
  };

  const handleDeleteClick = (id) => {
    setDeleteTaskId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = () => {
    setTasks(tasks.filter(task => task.id !== deleteTaskId));
    setShowDeleteModal(false);
    setDeleteTaskId(null);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewTaskData({ ...newTaskData, [name]: value });
  };

  const handleAddTask = () => {
    if (newTaskData.title && newTaskData.assignedTo && newTaskData.budget) {
      const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      setTasks([
        ...tasks,
        {
          id: newId,
          title: newTaskData.title,
          priority: newTaskData.priority,
          priorityClass: newTaskData.priority === 'High' ? 'red' : newTaskData.priority === 'Medium' ? 'yellow' : 'green',
          assignedTo: newTaskData.assignedTo,
          budget: newTaskData.budget,
          completed: false
        }
      ]);
      setNewTaskData({ title: '', priority: 'Low', assignedTo: '', budget: '' });
      setShowAddModal(false);
    }
  };

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
        <div className="add-task-container">
          <button
            className="add-task-btn"
            onClick={() => setShowAddModal(true)}
            title="Add Task"
          >
            <FiPlus className="plus-icon" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="task-management-section">
          <h2>Task Management</h2>
          {/* Still in Progress Tasks */}
          <div className="task-section">
            <h3>Still in Progress Tasks</h3>
            {tasks.filter(task => !task.completed).length === 0 ? (
              <p>No tasks in progress.</p>
            ) : (
              tasks.filter(task => !task.completed).map((task) => (
                <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  {editingTaskId === task.id ? (
                    // Edit mode
                    <>
                      <div className="task-title-row">
                        <input
                          type="text"
                          name="title"
                          value={editingData.title}
                          onChange={handleInputChange}
                          className="edit-input title-input"
                        />
                      </div>
                      <div className="edit-fields">
                        <div>
                          <label>Priority: </label>
                          <select
                            name="priority"
                            value={editingData.priority}
                            onChange={handleInputChange}
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                        <div>
                          <label>Assigned To: </label>
                          <input
                            type="text"
                            name="assignedTo"
                            value={editingData.assignedTo}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label>Budget: </label>
                          <input
                            type="text"
                            name="budget"
                            value={editingData.budget}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="task-actions">
                        <button className="action-btn save" onClick={() => handleSaveClick(task.id)}>Save</button>
                        <button className="action-btn cancel" onClick={handleCancelClick}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    // Display mode
                    <>
                      <div className="task-title-row">
                        <h3>{task.title}</h3>
                        <button className="action-btn edit" onClick={() => handleEditClick(task)}>Edit</button>
                      </div>
                      {task.completed && <img src={checkIcon} className="check-icon" alt="Completed task" />}
                      <p className="task-priority">
                        <span className={`status-dot ${task.priorityClass}`}></span>
                        Priority: {task.priority}
                      </p>
                      <p>Assigned To: {task.assignedTo}</p>
                      <p>Budget: {task.budget}</p>
                      <div className="task-actions">
                        {!task.completed && (
                          <button
                            className="action-btn complete"
                            onClick={() => handleCompleteClick(task.id)}
                          >
                            Complete
                          </button>
                        )}
                        {!task.completed && (
                          <button
                            className="delta-btn"
                            onClick={() => handleDeleteClick(task.id)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Completed Tasks */}
          <div className="task-section">
            <h3>Completed Tasks</h3>
            {tasks.filter(task => task.completed).length === 0 ? (
              <p>No completed tasks yet.</p>
            ) : (
              tasks.filter(task => task.completed).map((task) => (
                <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  {editingTaskId === task.id ? (
                    // Edit mode
                    <>
                      <div className="task-title-row">
                        <input
                          type="text"
                          name="title"
                          value={editingData.title}
                          onChange={handleInputChange}
                          className="edit-input title-input"
                        />
                      </div>
                      <div className="edit-fields">
                        <div>
                          <label>Priority: </label>
                          <select
                            name="priority"
                            value={editingData.priority}
                            onChange={handleInputChange}
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                        <div>
                          <label>Assigned To: </label>
                          <input
                            type="text"
                            name="assignedTo"
                            value={editingData.assignedTo}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label>Budget: </label>
                          <input
                            type="text"
                            name="budget"
                            value={editingData.budget}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="task-actions">
                        <button className="action-btn save" onClick={() => handleSaveClick(task.id)}>Save</button>
                        <button className="action-btn cancel" onClick={handleCancelClick}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    // Display mode
                    <>
                      <div className="task-title-row">
                        <h3>{task.title}</h3>
                        <button className="action-btn edit" onClick={() => handleEditClick(task)}>Edit</button>
                      </div>
                      {task.completed && <img src={checkIcon} className="check-icon" alt="Completed task" />}
                      <p className="task-priority">
                        <span className={`status-dot ${task.priorityClass}`}></span>
                        Priority: {task.priority}
                      </p>
                      <p>Assigned To: {task.assignedTo}</p>
                      <p>Budget: {task.budget}</p>
                      <div className="task-actions">
                        {!task.completed && (
                          <button
                            className="action-btn complete"
                            onClick={() => handleCompleteClick(task.id)}
                          >
                            Complete
                          </button>
                        )}
                        {!task.completed && (
                          <button
                            className="delta-btn"
                            onClick={() => handleDeleteClick(task.id)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
          {showAddModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Add New Task</h3>
                <div className="modal-fields">
                  <label>Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={newTaskData.title}
                    onChange={handleAddInputChange}
                  />
                  <label>Priority:</label>
                  <select
                    name="priority"
                    value={newTaskData.priority}
                    onChange={handleAddInputChange}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <label>Assigned To:</label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={newTaskData.assignedTo}
                    onChange={handleAddInputChange}
                  />
                  <label>Budget:</label>
                  <input
                    type="text"
                    name="budget"
                    value={newTaskData.budget}
                    onChange={handleAddInputChange}
                  />
                </div>
                <div className="modal-actions">
                  <button className="action-btn save" onClick={handleAddTask}>Save</button>
                  <button className="action-btn cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this task?</p>
                <div className="modal-actions">
                  <button className="action-btn cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button className="action-btn delete-confirm" onClick={confirmDeleteTask}>Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventTasks;