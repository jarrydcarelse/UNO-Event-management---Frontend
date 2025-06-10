// src/components/Navbar.js

import React, { useState, useEffect } from "react";
import { 
  FiChevronLeft, 
  FiChevronRight,
  FiHome,
  FiCalendar,
  FiCheckSquare,
  FiUsers,
  FiLogOut,
  FiUser
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserData, clearUserData } from "../utils/localStorage";
import axios from "axios";
import "../styles/Navbar.css";

const API_BASE = 'https://eventify-backend-kgtm.onrender.com';

const Navbar = ({ isOpen: propIsOpen, setIsOpen: propSetIsOpen }) => {
  // Allow controlled or internal open/collapse state
  const [internalIsOpen, internalSetIsOpen] = useState(true);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const setIsOpen = propSetIsOpen !== undefined ? propSetIsOpen : internalSetIsOpen;
  const [userData, setUserData] = useState({ email: '', userId: '' });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`${API_BASE}/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Find the current user by email
        const currentUser = response.data.find(user => user.email === getUserData().email);
        if (currentUser) {
          setUserData({
            email: currentUser.email,
            userId: currentUser.id
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const navItems = [
    { name: "Dashboard", icon: <FiHome size={20} />, path: "/dashboard" },
    { name: "Events", icon: <FiCalendar size={20} />, path: "/events" },
    { name: "Tasks", icon: <FiCheckSquare size={20} />, path: "/tasks" },
    { name: "Employees", icon: <FiUsers size={20} />, path: "/employees" }
  ];

  return (
    <div className={`sidebar${isOpen ? "" : " collapsed"}`}>
      {/* Sidebar Toggle */}
      <button 
        className="toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Collapse menu" : "Expand menu"}
      >
        {isOpen ? (
          <FiChevronLeft size={18} className="toggle-icon" />
        ) : (
          <FiChevronRight size={18} className="toggle-icon" />
        )}
      </button>

      {/* Profile Section */}
      <div className="profile">
        <div className="avatar">
          <FiUser size={18} />
        </div>
        {isOpen && (
          <div className="user-info">
            <p className="email">{userData.email}</p>
            <p className="user-id">ID: {userData.userId}</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="nav-links">
        {navItems.map((item, index) => (
          <Link 
            to={item.path}
            key={index}
            className={location.pathname.startsWith(item.path) ? "active" : ""}
            title={!isOpen ? item.name : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-text">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="logout">
        <button
          title={!isOpen ? "Logout" : ""}
          onClick={() => {
            clearUserData();
            navigate("/login");
          }}
        >
          <FiLogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
