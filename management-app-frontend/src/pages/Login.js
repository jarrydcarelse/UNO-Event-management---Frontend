// src/pages/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUserData } from '../utils/localStorage';
import '../styles/Login.css';
import logo from '../assets/logo.png';
import pattern from '../assets/pink-pattern.png';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  'https://eventify-backend-kgtm.onrender.com';

const ADMIN_PIN = '123123'; // 6-digit admin PIN

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // PIN Verification Modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

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
      const res = await axios.post(
        `${API_BASE}/api/users/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      // Store token and user email
      localStorage.setItem('token', res.data.token);
      setUserData(email);
      
      navigate('/events');
    } catch (err) {
      setLoginError(
        err.response?.data?.message ||
          'Login failed. Please check your credentials.'
      );
    }
  };

  // ─── PIN VERIFICATION ─────────────────────────────
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setShowPinModal(false);
      setPin('');
      setPinError('');
      navigate('/signup');
    } else {
      setPinError('Invalid PIN. Please try again.');
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

    const {
      title,
      description,
      date,
      requesterName,
      requesterEmail,
    } = requestData;

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
      await axios.post(
        // <- CAPITAL E & R in EventRequests
        `${API_BASE}/api/EventRequests`,
        {
          title,
          description,
          // include full ISO timestamp if you want time too:
          date: new Date(date).toISOString(),
          requesterName,
          requesterEmail,
          status: 'Pending'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
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
      console.error('Request submission error:', err);
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
            Welcome to Eventify. Sign in or sign up to manage your events.
          </p>
          <button
            className="link-btn"
            onClick={() => {
              setShowRequestModal(true);
              setRequestError('');
              setRequestSuccess(false);
            }}
          >
            Request a New Event
          </button>
        </div>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Sign In</h2>
          <hr className="login-divider" />

          {loginError && <div className="login-error">{loginError}</div>}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
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
              onClick={() => {
                setShowPinModal(true);
                setPin('');
                setPinError('');
              }}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>

      {/* ─── PIN Verification Modal ─── */}
      {showPinModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Admin PIN Verification</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowPinModal(false);
                  setPin('');
                  setPinError('');
                }}
              >
                ×
              </button>
            </div>

            <form className="modal-form" onSubmit={handlePinSubmit}>
              {pinError && <div className="form-error">{pinError}</div>}

              <label>Enter 6-digit Admin PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
                required
                placeholder="Enter PIN"
              />

              <div className="modal-actions">
                <button type="submit" className="btn-signin">
                  Verify
                </button>
                <button
                  type="button"
                  className="btn-signup"
                  onClick={() => {
                    setShowPinModal(false);
                    setPin('');
                    setPinError('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Request Event Modal ──────────────────────────── */}
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
              {requestError && (
                <div className="form-error">{requestError}</div>
              )}
              {requestSuccess && (
                <div className="form-success">
                  Thanks! Your request has been submitted.
                </div>
              )}

              <label>Title</label>
              <input
                name="title"
                type="text"
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
                name="date"
                type="date"
                value={requestData.date}
                onChange={handleRequestChange}
                required
              />

              <label>Your Name</label>
              <input
                name="requesterName"
                type="text"
                value={requestData.requesterName}
                onChange={handleRequestChange}
                required
              />

              <label>Your Email</label>
              <input
                name="requesterEmail"
                type="email"
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
