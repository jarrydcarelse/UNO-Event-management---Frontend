import React from "react";
import { 
  FiChevronLeft, 
  FiChevronRight,
  FiHome,
  FiCalendar,
  FiCheckSquare,
  FiDollarSign,
  FiArchive,
  FiLogOut,
  FiUser
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navItems = [
    { name: "Dashboard", icon: <FiHome size={20} />, path: "/dashboard" },
    { name: "Events", icon: <FiCalendar size={20} />, path: "/events" },
    { name: "Tasks", icon: <FiCheckSquare size={20} />, path: "/event-tasks" },
    { name: "Budget", icon: <FiDollarSign size={20} />, path: "/budget" },
    { name: "Archive", icon: <FiArchive size={20} />, path: "/archive" }
  ];

  return (
    <div className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      {/* Enhanced Toggle Button */}
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
            <p className="name">Armand</p>
            <p className="email">armand@eventify.com</p>
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

      {/* Logout Section */}
      <div className="logout">
        <button title={!isOpen ? "Logout" : ""}>
          <FiLogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;