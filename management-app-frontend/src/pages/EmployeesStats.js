import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import '../employeesstats/EmployeesStats.css';

const EmployeesStats = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="employeesstats-layout">
        <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`employeesstats-page${sidebarOpen ? '' : ' collapsed'}`}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="employeesstats-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`employeesstats-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Rest of the component content */}
      </div>
    </div>
  );
};

export default EmployeesStats; 