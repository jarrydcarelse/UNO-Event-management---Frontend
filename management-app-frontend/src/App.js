import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventTasks from './pages/EventTasks';
import Budget from './pages/Budget';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event-tasks" element={<EventTasks />} />
        <Route path="/budget" element={<Budget />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
