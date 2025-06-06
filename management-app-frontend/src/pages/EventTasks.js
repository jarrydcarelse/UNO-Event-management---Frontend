import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FiPlus, FiEdit, FiCheck, FiTrash2, FiX } from 'react-icons/fi';
import '../eventtasks/EventTasks.css';

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

export default function EventTasks() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // add | edit | delete
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '', priority: 'Low', assignedTo: '', budget: ''
  });

  // Modal controls
  const openAddModal = () => {
    setModalType('add');
    setTaskForm({ title: '', priority: 'Low', assignedTo: '', budget: '' });
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
    setTaskForm({ title: '', priority: 'Low', assignedTo: '', budget: '' });
  };

  // Add/Edit Task
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm({ ...taskForm, [name]: value });
  };
  const handleAddTask = () => {
    if (!taskForm.title || !taskForm.assignedTo || !taskForm.budget) return;
    const newTask = {
      id: Date.now(),
      ...taskForm,
      completed: false,
      priorityClass:
        taskForm.priority === 'High'
          ? 'red'
          : taskForm.priority === 'Medium'
          ? 'yellow'
          : 'green',
    };
    setTasks([...tasks, newTask]);
    closeModal();
  };
  const handleEditTask = () => {
    setTasks(
      tasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              ...taskForm,
              priorityClass:
                taskForm.priority === 'High'
                  ? 'red'
                  : taskForm.priority === 'Medium'
                  ? 'yellow'
                  : 'green',
            }
          : task
      )
    );
    closeModal();
  };

  // Complete Task
  const handleCompleteTask = (task) => {
    setTasks(
      tasks.map((t) =>
        t.id === task.id ? { ...t, completed: true } : t
      )
    );
  };

  // Delete Task
  const handleDeleteTask = () => {
    setTasks(tasks.filter((t) => t.id !== selectedTask.id));
    closeModal();
  };

  // Task lists
  const tasksInProgress = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  // Render
  return (
    <div className="eventtasks-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`eventtasks-page${sidebarOpen ? '' : ' collapsed'}`}>
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
                <>
                  <p>Are you sure you want to delete this task?</p>
                  <div className="eventtasks-modal-actions">
                    <button className="eventtasks-modal-btn" onClick={closeModal}>
                      Cancel
                    </button>
                    <button className="eventtasks-modal-btn pink" onClick={handleDeleteTask}>
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="eventtasks-modal-fields">
                    <label>Title:</label>
                    <input
                      name="title"
                      value={taskForm.title}
                      onChange={handleFormChange}
                      autoFocus
                    />
                    <label>Priority:</label>
                    <select
                      name="priority"
                      value={taskForm.priority}
                      onChange={handleFormChange}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <label>Assigned To:</label>
                    <input
                      name="assignedTo"
                      value={taskForm.assignedTo}
                      onChange={handleFormChange}
                    />
                    <label>Budget:</label>
                    <input
                      name="budget"
                      value={taskForm.budget}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="eventtasks-modal-actions">
                    <button className="eventtasks-modal-btn" onClick={closeModal}>
                      Cancel
                    </button>
                    <button
                      className="eventtasks-modal-btn pink"
                      onClick={modalType === 'add' ? handleAddTask : handleEditTask}
                    >
                      {modalType === 'add' ? 'Add Task' : 'Save'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
