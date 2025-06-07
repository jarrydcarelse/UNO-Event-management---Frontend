import React, { useState } from "react";
import { 
  FiChevronLeft, 
  FiChevronRight,
  FiHome,
  FiCalendar,
  FiCheckSquare,
  FiArchive,
  FiLogOut,
  FiUser
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ isOpen: propIsOpen, setIsOpen: propSetIsOpen }) => {
  // Allow controlled or internal open/collapse state
  const [internalIsOpen, internalSetIsOpen] = useState(true);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const setIsOpen = propSetIsOpen !== undefined ? propSetIsOpen : internalSetIsOpen;

  const location = useLocation();
  const navigate = useNavigate();

  // Get user email from localStorage (set this after login)
  const userEmail = localStorage.getItem("userEmail") || "user@eventify.com";
  // Extract name before @ and capitalize first letter
  const userName = userEmail.split("@")[0];
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const navItems = [
    { name: "Dashboard", icon: <FiHome size={20} />, path: "/dashboard" },
    { name: "Events", icon: <FiCalendar size={20} />, path: "/events" },
    { name: "Tasks", icon: <FiCheckSquare size={20} />, path: "/tasks" },
    { name: "Archive", icon: <FiArchive size={20} />, path: "/archive" }
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
            <p className="name">{displayName}</p>
            <p className="email">{userEmail}</p>
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
          onClick={() => navigate("/login")}
        >
          <FiLogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;