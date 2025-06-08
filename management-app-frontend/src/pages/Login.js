import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import logo from '../assets/logo.png';
import pattern from '../assets/pink-pattern.png';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  'https://eventify-backend-kgtm.onrender.com';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' or 'request'
  // ─── LOGIN STATE ─────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // ─── REQUEST STATE ────────────────────────────────
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  // ─── HANDLE LOGIN ─────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await axios.post(`${API_BASE}/api/users/login`, {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setLoginError(
        err.response?.data?.message ||
          err.response?.data?.title ||
          'Login failed. Check your credentials.'
      );
    }
  };

  // ─── HANDLE EVENT REQUEST ─────────────────────────
  const handleRequest = async (e) => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess(false);

    if (
      !title ||
      !description ||
      !date ||
      !requesterName ||
      !requesterEmail
    ) {
      setRequestError('All fields are required.');
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/event-requests`, {
        title,
        description,
        date: new Date(date).toISOString(),
        requesterName,
        requesterEmail,
        status: 'Pending',
      });
      setRequestSuccess(true);
      setTitle('');
      setDescription('');
      setDate('');
      setRequesterName('');
      setRequesterEmail('');
    } catch (err) {
      setRequestError(
        err.response?.data?.message ||
          'Failed to submit request. Please try again later.'
      );
    }
  };

  return (
    <div className="login-page">
      <div
        className="login-left"
        style={{ backgroundImage: `url(${pattern})` }}
      >
        <div className="branding">
          <img src={logo} alt="Eventify Logo" className="logo-img" />
          <p className="welcome-text">
            {mode === 'login'
              ? 'Welcome to Eventify. Securely log in to manage your events.'
              : 'Submit your event idea, and we’ll get back to you shortly.'}
          </p>
        </div>
      </div>

      <div className="login-right">
        {mode === 'login' && (
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Sign In</h2>
            <hr className="login-divider" />

            {loginError && (
              <div className="login-error">{loginError}</div>
            )}

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <hr className="login-divider" />

            <div className="login-buttons">
              <button type="submit" className="btn-signin">
                Sign In
              </button>
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setMode('request');
                  setLoginError('');
                }}
              >
                Request an Event
              </button>
            </div>
          </form>
        )}

        {mode === 'request' && (
          <form className="login-form" onSubmit={handleRequest}>
            <h2>Event Request</h2>
            <hr className="login-divider" />

            {requestError && (
              <div className="login-error">{requestError}</div>
            )}
            {requestSuccess && (
              <div className="login-success">
                Request submitted! We’ll be in touch.
              </div>
            )}

            <label htmlFor="req-title">Title</label>
            <input
              id="req-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label htmlFor="req-desc">Description</label>
            <textarea
              id="req-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label htmlFor="req-date">Date</label>
            <input
              id="req-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <label htmlFor="req-name">Your Name</label>
            <input
              id="req-name"
              type="text"
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              required
            />

            <label htmlFor="req-email">Your Email</label>
            <input
              id="req-email"
              type="email"
              value={requesterEmail}
              onChange={(e) => setRequesterEmail(e.target.value)}
              required
            />

            <hr className="login-divider" />

            <div className="login-buttons">
              <button type="submit" className="btn-signin">
                Submit Request
              </button>
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setMode('login');
                  setRequestError('');
                  setRequestSuccess(false);
                }}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
