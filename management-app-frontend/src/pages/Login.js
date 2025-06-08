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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Request‐Event Modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    date: '',
    requesterName: '',
    requesterEmail: '',
  });
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  // ─── LOGIN ───────────────────────────────────────
  const handleLogin = async e => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await axios.post(`${API_BASE}/api/users/login`, {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/events');
    } catch (err) {
      setLoginError(
        err.response?.data?.message ||
        err.response?.data?.title ||
        'Login failed. Please check your credentials.'
      );
    }
  };

  // ─── REQUEST EVENT ───────────────────────────────
  const handleRequestChange = e => {
    const { name, value } = e.target;
    setRequestData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async e => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess(false);

    const { title, description, date, requesterName, requesterEmail } = requestData;
    if (!title || !description || !date || !requesterName || !requesterEmail) {
      setRequestError('All fields are required.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/api/event-requests`,
        {
          title,
          description,
          date: new Date(date).toISOString(),
          requesterName,
          requesterEmail,
          status: 'Pending',
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setRequestSuccess(true);
      setRequestData({
        title: '',
        description: '',
        date: '',
        requesterName: '',
        requesterEmail: '',
      });
    } catch (err) {
      setRequestError(
        err.response?.data?.message ||
        'Failed to submit request. Try again later.'
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
            Welcome to Eventify. Log in to manage your events, or request one below.
          </p>
        </div>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Sign In</h2>
          <hr className="login-divider" />

          {loginError && <div className="login-error">{loginError}</div>}

          <label htmlFor="email">Email</label>
          <input
            id="email" type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password" type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <hr className="login-divider" />

          <div className="login-buttons">
            <button type="submit" className="btn-signin">
              Sign In
            </button>
            <button
              type="button"
              className="btn-signup"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="login-request">
          <button
            className="link-btn"
            onClick={() => {
              setShowRequestModal(true);
              setRequestError('');
              setRequestSuccess(false);
            }}
          >
            Request an Event
          </button>
        </div>
      </div>

      {/* ─── Request Event Modal ─── */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Request New Event</h3>
              <button
                className="modal-close"
                onClick={() => setShowRequestModal(false)}
              >
                ×
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmitRequest}>
              {requestError && <div className="form-error">{requestError}</div>}
              {requestSuccess && (
                <div className="form-success">
                  Thanks! Your request has been submitted.
                </div>
              )}

              <label>Title</label>
              <input
                name="title" type="text"
                value={requestData.title}
                onChange={handleRequestChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                value={requestData.description}
                onChange={handleRequestChange}
                required
              />

              <label>Date</label>
              <input
                name="date" type="date"
                value={requestData.date}
                onChange={handleRequestChange}
                required
              />

              <label>Your Name</label>
              <input
                name="requesterName" type="text"
                value={requestData.requesterName}
                onChange={handleRequestChange}
                required
              />

              <label>Your Email</label>
              <input
                name="requesterEmail" type="email"
                value={requestData.requesterEmail}
                onChange={handleRequestChange}
                required
              />

              <div className="modal-actions">
                <button type="submit" className="btn-signin">
                  Submit Request
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
