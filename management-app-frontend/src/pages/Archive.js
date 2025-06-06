import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FaEye, FaTrash } from 'react-icons/fa';
import { FiChevronDown, FiX } from 'react-icons/fi';
import '../archive/Archive.css';

const initialArchiveItems = [
  {
    id: 1,
    eventName: 'Wedding Reception – Sam & Alex',
    status: 'Completed',
    dateCompleted: '12 Feb 2025',
    completedTasks: '14/14',
    totalBudget: 'R180,000',
    notes: 'Seamless coordination. Venue staff was excellent.'
  },
  {
    id: 2,
    eventName: 'Corporate Gala – Q4 Summit',
    status: 'Completed',
    dateCompleted: '05 Mar 2025',
    completedTasks: '20/20',
    totalBudget: 'R250,000',
    notes: 'All sponsors happy. AV setup was flawless.'
  },
  // ... add the rest from your original code ...
];

export default function Archive() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [archiveItems, setArchiveItems] = useState(initialArchiveItems);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

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
          {archiveItems.map((item) => (
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
          ))}
          {archiveItems.length === 0 && (
            <span className="archive-empty-msg">No archived events.</span>
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
