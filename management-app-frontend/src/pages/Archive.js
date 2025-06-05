// src/pages/Archive.js

import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Adjust the path if needed
import { FaEye, FaTrash } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import '../archive/Archive.css';

// Dummy data for now; replace with real API data later
const archiveItems = [
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
  {
    id: 3,
    eventName: 'Charity Auction – Hope Foundation',
    status: 'Completed',
    dateCompleted: '28 Jan 2025',
    completedTasks: '10/10',
    totalBudget: 'R75,000',
    notes: 'Great turnout. Raised more than expected.'
  },
  {
    id: 4,
    eventName: 'Product Launch – AlphaTech X3',
    status: 'Completed',
    dateCompleted: '15 Apr 2025',
    completedTasks: '12/12',
    totalBudget: 'R300,000',
    notes: 'Launch event went smoothly with excellent media coverage.'
  },
  {
    id: 5,
    eventName: 'Employee Retreat – Team Synergy',
    status: 'Completed',
    dateCompleted: '22 Mar 2025',
    completedTasks: '8/8',
    totalBudget: 'R120,000',
    notes: 'Great team-building activities and positive feedback from staff.'
  },
  {
    id: 6,
    eventName: 'Charity Ball – Hope Foundation',
    status: 'Completed',
    dateCompleted: '10 May 2025',
    completedTasks: '18/18',
    totalBudget: 'R200,000',
    notes: 'Raised significant funds for charity, seamless organization.'
  },
  {
    id: 7,
    eventName: 'Annual Conference – TechFuture 2025',
    status: 'Completed',
    dateCompleted: '30 Apr 2025',
    completedTasks: '25/25',
    totalBudget: 'R450,000',
    notes: 'Speakers were on time, venue setup was top-notch, positive attendee reviews.'
  },
  {
    id: 8,
    eventName: 'Fashion Show – South Style Expo',
    status: 'Completed',
    dateCompleted: '05 Jun 2025',
    completedTasks: '10/10',
    totalBudget: 'R180,000',
    notes: 'Models showcased perfectly, strong audience turnout and press coverage.'
  },
  {
    id: 9,
    eventName: 'Music Festival – Summer Beats',
    status: 'Completed',
    dateCompleted: '12 Jun 2025',
    completedTasks: '30/30',
    totalBudget: 'R600,000',
    notes: 'All acts performed on schedule, excellent crowd control, zero incidents.'
  }
];

const Archive = () => {
  // Control whether the side navbar is open or collapsed
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      {/* Navbar with open/collapse functionality */}
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content wrapper */}
      <div className={`archive-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Header: Title + Sort control */}
        <div className="archive-header">
          <h2>Archive</h2>
          <div className="sort-control">
            <span>Sort By Date Completed</span>
            <FiChevronDown className="sort-icon" />
          </div>
        </div>

        {/* Grid of archive cards */}
        <div className="archive-container">
          {archiveItems.map((item) => (
            <div key={item.id} className="archive-card">
              {/* Event Title */}
              <h3>{item.eventName}</h3>

              {/* Status Row (dot + label) */}
              <div className="archive-row">
                <span className="label">Status:</span>
                <div className="status-group">
                  <span className="status-dot green" />
                  <span className="value">{item.status}</span>
                </div>
              </div>

              {/* Date Completed */}
              <div className="archive-row">
                <span className="label">Date Completed:</span>
                <span className="value">{item.dateCompleted}</span>
              </div>

              {/* Completed Tasks */}
              <div className="archive-row">
                <span className="label">Completed Tasks:</span>
                <span className="value">{item.completedTasks}</span>
              </div>

              {/* Total Budget Used */}
              <div className="archive-row">
                <span className="label">Total Budget Used:</span>
                <span className="value">{item.totalBudget}</span>
              </div>

              {/* Notes Box */}
              <div className="notes-section">
                <span className="label">Notes</span>
                <div className="archive-notes">
                  {item.notes}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="archive-actions">
                <button className="action-btn view">
                  <FaEye className="icon" />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Archive;