import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaEye, FaTrash } from 'react-icons/fa';
import { FiChevronDown, FiX } from 'react-icons/fi';
import axios from 'axios';
import '../archive/Archive.css';

// Update API_BASE to use the deployed backend URL
const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

// Add axios default configuration
axios.defaults.baseURL = API_BASE;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

export default function Archive() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [archiveItems, setArchiveItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch archived events
  useEffect(() => {
    const fetchArchivedEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/archives', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Transform the data to match our display format
        const formattedArchives = response.data.map(event => ({
          id: event.id,
          eventName: event.title,
          status: 'Completed',
          dateCompleted: new Date(event.completedDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          completedTasks: `${event.completedTasks}/${event.totalTasks}`,
          totalBudget: `R${event.totalBudget.toLocaleString()}`,
          notes: event.notes || 'No additional notes'
        }));

        setArchiveItems(formattedArchives);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching archived events:', error);
        setError('Failed to load archived events. Please try again later.');
        setLoading(false);
      }
    };

    fetchArchivedEvents();
  }, []);

  const openDeleteModal = (item) => {
    setToDelete(item);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setToDelete(null);
  };

  const confirmDelete = () => {
    setArchiveItems(archiveItems.filter(i => i.id !== toDelete.id));
    closeDeleteModal();
  };

  if (loading) {
    return (
      <div className="archive-layout">
        <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`archive-page${sidebarOpen ? '' : ' collapsed'}`}>
          <div className="archive-header-row">
            <h2 className="archive-title">Archive</h2>
          </div>
          <div className="archive-cards-grid">
            <p>Loading archived events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="archive-layout">
        <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`archive-page${sidebarOpen ? '' : ' collapsed'}`}>
          <div className="archive-header-row">
            <h2 className="archive-title">Archive</h2>
          </div>
          <div className="archive-cards-grid">
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="archive-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`archive-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Header */}
        <div className="archive-header-row">
          <h2 className="archive-title">Archive</h2>
          <div className="archive-sort">
            <span>Sort By Date Completed</span>
            <FiChevronDown className="sort-icon" />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="archive-cards-grid">
          {archiveItems.length === 0 ? (
            <div className="archive-empty-state">
              <h3>No Archived Events Yet</h3>
              <p>You better get a move on with completing tasks,<br />otherwise you won't hit your due dates!</p>
             
            </div>
          ) : (
            archiveItems.map((item) => (
              <div className="archive-card" key={item.id}>
                <div className="archive-card-title">{item.eventName}</div>
                <div className="archive-meta-row">
                  <span className="archive-label">Status:</span>
                  <span className="archive-dot green" />
                  <span className="archive-value">{item.status}</span>
                </div>
                <div className="archive-meta-row">
                  <span className="archive-label">Date Completed:</span>
                  <span className="archive-value">{item.dateCompleted}</span>
                </div>
                <div className="archive-meta-row">
                  <span className="archive-label">Completed Tasks:</span>
                  <span className="archive-value">{item.completedTasks}</span>
                </div>
                <div className="archive-meta-row">
                  <span className="archive-label">Total Budget Used:</span>
                  <span className="archive-value">{item.totalBudget}</span>
                </div>
                <div className="archive-notes-section">
                  <span className="archive-label">Notes:</span>
                  <div className="archive-notes">{item.notes}</div>
                </div>
                <div className="archive-actions-row">
                  <button className="archive-btn view">
                    <FaEye style={{ marginRight: 7 }} /> View
                  </button>
                  <button className="archive-btn del" onClick={() => openDeleteModal(item)}>
                    <FaTrash style={{ marginRight: 7 }} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="archive-modal-overlay">
            <div className="archive-modal">
              <div className="archive-modal-header">
                <h3>Delete Archived Event?</h3>
                <button className="archive-modal-close" onClick={closeDeleteModal}>
                  <FiX />
                </button>
              </div>
              <p>Are you sure you want to delete "{toDelete?.eventName}" from the archive? This cannot be undone.</p>
              <div className="archive-modal-actions">
                <button className="archive-modal-btn" onClick={closeDeleteModal}>Cancel</button>
                <button className="archive-modal-btn pink" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
