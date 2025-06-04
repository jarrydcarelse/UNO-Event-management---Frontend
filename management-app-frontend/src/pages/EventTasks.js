import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../eventtasks/EventTasks.css';
import { FiEdit2, FiUsers, FiCheck, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const eventDetails = {
  name: 'Corporate Year-End Gala',
  client: 'ABC Consulting',
  deadline: '01 Jan 2025',
  progress: 50,
  completed: 5,
  totalTasks: 10,
  budget: 'R500 000',
  spent: 'R280 000',
};

const initialTasks = [
  { id: 1, title: 'Book Venue', priority: 'High', priorityClass: 'red', assignedTo: 'John Doe', budget: 'R120 000', completed: false },
  { id: 2, title: 'Caterer Selection', priority: 'Medium', priorityClass: 'yellow', assignedTo: 'Lisa Smith', budget: 'R80 000', completed: false },
  { id: 3, title: 'Guest List Management', priority: 'High', priorityClass: 'red', assignedTo: 'Michael Johnson', budget: 'R15 000', completed: false },
  { id: 4, title: 'Photography & Videography', priority: 'Medium', priorityClass: 'yellow', assignedTo: 'Lisa Smith', budget: 'R40 000', completed: false },
  { id: 5, title: 'Event Promotion & Invitations', priority: 'Low', priorityClass: 'green', assignedTo: 'John Doe', budget: 'R25 000', completed: false },
  { id: 6, title: 'Event Branding & Design', priority: 'Low', priorityClass: 'green', assignedTo: 'Michael Johnson', budget: 'R30 000', completed: true },
  { id: 7, title: 'Entertainment & Music', priority: 'High', priorityClass: 'red', assignedTo: 'N/A', budget: 'R50 000', completed: true },
  { id: 8, title: 'Seating Arrangement & Decor', priority: 'Medium', priorityClass: 'yellow', assignedTo: 'N/A', budget: 'R20 000', completed: true },
  { id: 9, title: 'Technical Setup', priority: 'High', priorityClass: 'red', assignedTo: 'N/A', budget: 'R35 000', completed: true },
];

function EventTasks() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState(initialTasks);

  // Modal & editing states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'Low', assignedTo: '', budget: '' });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  // --- Add Task ---
  const openAddModal = () => {
    setNewTask({ title: '', priority: 'Low', assignedTo: '', budget: '' });
    setShowAddModal(true);
  };
  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.budget) return;
    const id = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const priorityClass =
      newTask.priority === 'High' ? 'red' :
      newTask.priority === 'Medium' ? 'yellow' : 'green';
    setTasks([
      ...tasks,
      { ...newTask, id, priorityClass, completed: false }
    ]);
    setShowAddModal(false);
  };

  // --- Edit Task ---
  const openEditModal = (task) => {
    setEditTask({ ...task });
    setShowEditModal(true);
  };
  const handleEditTaskChange = (e) => {
    const { name, value } = e.target;
    setEditTask(prev => ({ ...prev, [name]: value }));
  };
  const handleSaveEdit = () => {
    const priorityClass =
      editTask.priority === 'High' ? 'red' :
      editTask.priority === 'Medium' ? 'yellow' : 'green';
    setTasks(tasks.map(t => t.id === editTask.id ? { ...editTask, priorityClass } : t));
    setShowEditModal(false);
  };

  // --- Delete Task ---
  const openDeleteModal = (taskId) => {
    setDeleteTaskId(taskId);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = () => {
    setTasks(tasks.filter(t => t.id !== deleteTaskId));
    setShowDeleteModal(false);
    setDeleteTaskId(null);
  };

  // --- Mark Complete ---
  const handleComplete = (taskId) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, completed: true } : t
    ));
  };

  // --- Stats update for header ---
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="eventtasks-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`eventtasks-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* --- Event Header --- */}
        <div className="eventtasks-header-card">
          <div className="eventtasks-header-main">
            <h2 className="eventtasks-event-title">{eventDetails.name}</h2>
            <div className="eventtasks-event-client">{eventDetails.client}</div>
          </div>
        </div>

        {/* --- Progress Card --- */}
        <div className="eventtasks-progress-card">
          <div className="eventtasks-progress-bar-bg">
            <div
              className="eventtasks-progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="eventtasks-stats-row">
            <span><b>Deadline</b> {eventDetails.deadline}</span>
            <span><b>Overall Progress</b> {progress}%</span>
            <span><b>Tasks Completed</b> {completedCount} | {totalCount}</span>
            <span><b>Overall Budget</b> {eventDetails.budget}</span>
            <span><b>Overall Spent</b> {eventDetails.spent}</span>
          </div>
        </div>

        {/* --- Add Task Button --- */}
        <div className="eventtasks-add-btn-row">
          <button className="eventtasks-add-btn" onClick={openAddModal}>
            <FiPlus style={{ marginRight: 6 }} /> Add Task
          </button>
        </div>

        {/* --- Task Management Section --- */}
        <div className="eventtasks-tasksection-card">
          <h2>Task Management</h2>
          <div className="eventtasks-tasks-grid">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`eventtasks-taskcard${task.completed ? ' completed' : ''}`}
              >
                <div className="eventtasks-taskcard-title-row">
                  <span>{task.title}</span>
                  {task.completed && (
                    <span className="eventtasks-check-circle">
                      <FiCheck />
                    </span>
                  )}
                </div>
                <div className="eventtasks-taskcard-priority-row">
                  <span className={`eventtasks-status-dot ${task.priorityClass}`}></span>
                  <span>Priority: {task.priority}</span>
                </div>
                <div className="eventtasks-taskcard-meta">
                  <div>Assigned To: <b>{task.assignedTo}</b></div>
                  <div>Budget: <b>{task.budget}</b></div>
                </div>
                <div className="eventtasks-taskcard-actions">
                  {!task.completed && (
                    <>
                      <button
                        className="eventtasks-taskbtn"
                        onClick={() => handleComplete(task.id)}
                        title="Mark Complete"
                      >
                        <FiCheck /> Complete
                      </button>
                      <button
                        className="eventtasks-taskbtn"
                        onClick={() => openEditModal(task)}
                        title="Edit"
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button
                        className="eventtasks-taskbtn"
                        onClick={() => openDeleteModal(task.id)}
                        title="Delete"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </>
                  )}
                  {task.completed && (
                    <button
                      className="eventtasks-taskbtn"
                      onClick={() => openEditModal(task)}
                      title="Edit"
                    >
                      <FiEdit2 /> Edit
                    </button>
                  )}
                  <button
                    className="eventtasks-taskbtn"
                    title="Reassign"
                  >
                    <FiUsers /> Reassign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Add Task Modal --- */}
        {showAddModal && (
          <div className="eventtasks-modal-overlay">
            <div className="eventtasks-modal-content">
              <div className="eventtasks-modal-title-row">
                <h3>Add New Task</h3>
                <button className="eventtasks-modal-close" onClick={() => setShowAddModal(false)}>
                  <FiX />
                </button>
              </div>
              <div className="eventtasks-modal-fields">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleNewTaskChange}
                  placeholder="Task title"
                />
                <label>Priority</label>
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleNewTaskChange}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <label>Assigned To</label>
                <input
                  type="text"
                  name="assignedTo"
                  value={newTask.assignedTo}
                  onChange={handleNewTaskChange}
                  placeholder="Who is responsible?"
                />
                <label>Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={newTask.budget}
                  onChange={handleNewTaskChange}
                  placeholder="e.g. R50 000"
                />
              </div>
              <div className="eventtasks-modal-actions">
                <button className="eventtasks-modal-btn pink" onClick={handleAddTask}>
                  Add Task
                </button>
                <button className="eventtasks-modal-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Edit Task Modal --- */}
        {showEditModal && editTask && (
          <div className="eventtasks-modal-overlay">
            <div className="eventtasks-modal-content">
              <div className="eventtasks-modal-title-row">
                <h3>Edit Task</h3>
                <button className="eventtasks-modal-close" onClick={() => setShowEditModal(false)}>
                  <FiX />
                </button>
              </div>
              <div className="eventtasks-modal-fields">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={editTask.title}
                  onChange={handleEditTaskChange}
                />
                <label>Priority</label>
                <select
                  name="priority"
                  value={editTask.priority}
                  onChange={handleEditTaskChange}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <label>Assigned To</label>
                <input
                  type="text"
                  name="assignedTo"
                  value={editTask.assignedTo}
                  onChange={handleEditTaskChange}
                />
                <label>Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={editTask.budget}
                  onChange={handleEditTaskChange}
                />
              </div>
              <div className="eventtasks-modal-actions">
                <button className="eventtasks-modal-btn pink" onClick={handleSaveEdit}>
                  Save Changes
                </button>
                <button className="eventtasks-modal-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Delete Modal --- */}
        {showDeleteModal && (
          <div className="eventtasks-modal-overlay">
            <div className="eventtasks-modal-content">
              <div className="eventtasks-modal-title-row">
                <h3>Delete Task?</h3>
                <button className="eventtasks-modal-close" onClick={() => setShowDeleteModal(false)}>
                  <FiX />
                </button>
              </div>
              <p>Are you sure you want to delete this task? This action cannot be undone.</p>
              <div className="eventtasks-modal-actions">
                <button className="eventtasks-modal-btn pink" onClick={handleConfirmDelete}>
                  Yes, Delete
                </button>
                <button className="eventtasks-modal-btn" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default EventTasks;
