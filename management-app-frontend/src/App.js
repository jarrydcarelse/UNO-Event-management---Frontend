import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventTasks from './pages/EventTasks';
import Tasks from './pages/Tasks';
import Budget from './pages/Budget';
import Archive from './pages/Archive';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event-tasks/:eventId" element={<EventTasks />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
