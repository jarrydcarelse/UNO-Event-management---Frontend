import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import '../budget/Budget.css';

const initialItems = [
  { id: 1, description: 'Venue Rental', category: 'Venue', amount: 1500, status: 'Approved', event: 'Wedding Reception' },
  { id: 2, description: 'Catering Services', category: 'Food', amount: 800, status: 'Pending', event: 'Wedding Reception' },
  { id: 3, description: 'Decorations', category: 'Setup', amount: 300, status: 'Approved', event: 'Corporate Year-End Gala' },
  { id: 4, description: 'Entertainment', category: 'Entertainment', amount: 500, status: 'Pending', event: 'Tech Product Launch' },
];

const eventOptions = [
  'Wedding Reception',
  'Corporate Year-End Gala',
  'Tech Product Launch'
];

export default function Budget() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [budgetItems, setBudgetItems] = useState(initialItems);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // add | edit
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({
    event: '', description: '', category: '', amount: '', status: 'Pending'
  });

  // Open Add/Edit Modal
  const openAddModal = () => {
    setModalType('add');
    setForm({ event: '', description: '', category: '', amount: '', status: 'Pending' });
    setShowModal(true);
    setSelectedItem(null);
  };
  const openEditModal = (item) => {
    setModalType('edit');
    setForm({
      event: item.event,
      description: item.description,
      category: item.category,
      amount: item.amount,
      status: item.status,
    });
    setSelectedItem(item);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setForm({ event: '', description: '', category: '', amount: '', status: 'Pending' });
  };

  // Handle Add/Edit Submit
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.event || !form.description || !form.category || !form.amount) return;
    if (modalType === 'add') {
      setBudgetItems([
        ...budgetItems,
        {
          ...form,
          id: Date.now(),
          amount: Number(form.amount),
        }
      ]);
    } else if (modalType === 'edit' && selectedItem) {
      setBudgetItems(
        budgetItems.map((item) =>
          item.id === selectedItem.id
            ? { ...form, id: selectedItem.id, amount: Number(form.amount) }
            : item
        )
      );
    }
    closeModal();
  };

  // Delete
  const handleDelete = (id) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  // Totals
  const totalBudget = budgetItems.reduce((total, item) => total + Number(item.amount), 0);
  const categoryTotals = budgetItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
    return acc;
  }, {});

  // Render
  return (
    <div className="budget-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`budget-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Main Header */}
        <h2 className="budget-main-header">Budget Overview</h2>

        {/* Total Budget */}
        <div className="budget-total-card">
          <span>Total Budget</span>
          <span className="budget-total-value">R{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        {/* Category Summary */}
        <div className="budget-summary-card">
          <h3>Budget by Category</h3>
          <div className="budget-category-cards">
            {Object.entries(categoryTotals).map(([cat, val], idx) => (
              <div key={idx} className="budget-category-card">
                <span className="budget-category-name">{cat}</span>
                <span className="budget-category-value">R{val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
            {Object.keys(categoryTotals).length === 0 && (
              <span className="budget-empty-msg">No categories yet.</span>
            )}
          </div>
        </div>

        {/* Add Button */}
        <div className="budget-add-btn-row">
          <button className="budget-add-btn" onClick={openAddModal}>
            <FiPlus style={{ marginRight: 7 }} /> Add Budget Item
          </button>
        </div>

        {/* Breakdown Table */}
        <div className="budget-breakdown-card">
          <h3>Budget Breakdown</h3>
          <div className="budget-table-scroll">
            <table className="budget-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount (R)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgetItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.event}</td>
                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>R{Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>
                      <span className={`budget-status-chip status-${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button className="budget-table-btn" title="Edit" onClick={() => openEditModal(item)}>
                        <FiEdit2 />
                      </button>
                      <button className="budget-table-btn" title="Delete" onClick={() => handleDelete(item.id)}>
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
                {budgetItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="budget-empty-msg">No budget items yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="budget-modal-overlay">
            <div className="budget-modal">
              <div className="budget-modal-header">
                <h3>{modalType === 'add' ? 'Add Budget Item' : 'Edit Budget Item'}</h3>
                <button className="budget-modal-close" onClick={closeModal}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="budget-modal-fields">
                  <label>Event</label>
                  <select name="event" value={form.event} onChange={handleFormChange} required>
                    <option value="">Select Event</option>
                    {eventOptions.map((ev, idx) => (
                      <option key={idx} value={ev}>{ev}</option>
                    ))}
                  </select>
                  <label>Description</label>
                  <input name="description" value={form.description} onChange={handleFormChange} required />
                  <label>Category</label>
                  <input name="category" value={form.category} onChange={handleFormChange} required />
                  <label>Amount (R)</label>
                  <input type="number" name="amount" value={form.amount} onChange={handleFormChange} required />
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleFormChange}>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="budget-modal-actions">
                  <button type="button" className="budget-modal-btn" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="budget-modal-btn pink">
                    {modalType === 'add' ? 'Add Item' : 'Save Changes'}
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
