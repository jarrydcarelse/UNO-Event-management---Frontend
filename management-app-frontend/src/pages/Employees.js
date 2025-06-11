import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import '../employees/Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="employees-layout">
        <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`employees-page${sidebarOpen ? '' : ' collapsed'}`}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="employees-layout">
      <Navbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`employees-page${sidebarOpen ? '' : ' collapsed'}`}>
        {/* Rest of the component content */}
      </div>
    </div>
  );
};

export default Employees; 