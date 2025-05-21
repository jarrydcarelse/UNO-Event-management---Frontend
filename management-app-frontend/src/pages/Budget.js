// src/pages/Budget.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Budget.css';

const Budget = ({ sidebarOpen }) => {
    const [budgetItems, setBudgetItems] = useState([
        { id: 1, description: 'Venue Rental', category: 'Venue', amount: 1500, status: 'Approved', event: 'Wedding Reception' },
        { id: 2, description: 'Catering Services', category: 'Food', amount: 800, status: 'Pending', event: 'Wedding Reception' },
        { id: 3, description: 'Decorations', category: 'Setup', amount: 300, status: 'Approved', event: 'Corporate Year-End Gala' },
        { id: 4, description: 'Entertainment', category: 'Entertainment', amount: 500, status: 'Pending', event: 'Tech Product Launch' },
    ]);
    const [newItem, setNewItem] = useState({ description: '', category: '', amount: '', status: 'Pending', event: '' });
    const [editItem, setEditItem] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editItem) {
            setEditItem({ ...editItem, [name]: value });
        } else {
            setNewItem({ ...newItem, [name]: value });
        }
    };

    const handleAddOrUpdateItem = (e) => {
        e.preventDefault();
        if (newItem.description && newItem.category && newItem.amount && newItem.event) {
            if (editItem) {
                setBudgetItems(budgetItems.map(item => item.id === editItem.id ? editItem : item));
                setEditItem(null);
            } else {
                setBudgetItems([...budgetItems, { ...newItem, id: Date.now(), status: newItem.status }]);
            }
            setNewItem({ description: '', category: '', amount: '', status: 'Pending', event: '' });
        }
    };

    const handleEditItem = (item) => {
        setEditItem(item);
        setNewItem({ description: item.description, category: item.category, amount: item.amount, status: item.status, event: item.event });
    };

    const handleDeleteItem = (id) => {
        setBudgetItems(budgetItems.filter(item => item.id !== id));
    };

    const totalBudget = budgetItems.reduce((total, item) => total + Number(item.amount), 0);

    const categoryTotals = budgetItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
        return acc;
    }, {});

    return (
        <>
            <Navbar sidebarOpen={sidebarOpen} />

            <div className={`budget-page${sidebarOpen ? '' : ' collapsed'}`}>
                <h1>Event Budget Overview</h1>
                <h2>Total Budget: R{totalBudget.toFixed(2)}</h2>

                <div className="budget-summary">
                    <h3>Budget by Category</h3>
                    {Object.keys(categoryTotals).length === 0 ? (
                        <p>No categories yet.</p>
                    ) : (
                        <div className="category-cards">
                            {Object.entries(categoryTotals).map(([category, total], idx) => (
                                <div key={idx} className="category-card">
                                    <h4>{category}</h4>
                                    <p>R{total.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="budget-form">
                    <h3>{editItem ? 'Edit Budget Item' : 'Add Budget Item'}</h3>
                    <form onSubmit={handleAddOrUpdateItem}>
                        <div>
                            <label>Event: </label>
                            <select
                                name="event"
                                value={editItem ? editItem.event : newItem.event}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Event</option>
                                <option value="Wedding Reception">Wedding Reception</option>
                                <option value="Corporate Year-End Gala">Corporate Year-End Gala</option>
                                <option value="Tech Product Launch">Tech Product Launch</option>
                            </select>
                        </div>
                        <div>
                            <label>Description: </label>
                            <input
                                type="text"
                                name="description"
                                value={editItem ? editItem.description : newItem.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Category: </label>
                            <input
                                type="text"
                                name="category"
                                value={editItem ? editItem.category : newItem.category}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Amount (R): </label>
                            <input
                                type="number"
                                name="amount"
                                value={editItem ? editItem.amount : newItem.amount}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Status: </label>
                            <select
                                name="status"
                                value={editItem ? editItem.status : newItem.status}
                                onChange={handleInputChange}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <button type="submit">{editItem ? 'Update Item' : 'Add Item'}</button>
                        {editItem && <button className="cancel" onClick={() => { setEditItem(null); setNewItem({ description: '', category: '', amount: '', status: 'Pending', event: '' }); }}>Cancel</button>}
                    </form>
                </div>

                <div className="budget-table">
                    <h3>Budget Breakdown</h3>
                    {budgetItems.length === 0 ? (
                        <p>No budget items yet.</p>
                    ) : (
                        <table>
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
                                {budgetItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.event}</td>
                                        <td>{item.description}</td>
                                        <td>{item.category}</td>
                                        <td>R{item.amount.toFixed(2)}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <button className="edit" onClick={() => handleEditItem(item)}>Edit</button>
                                            <button className="delete" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default Budget;
