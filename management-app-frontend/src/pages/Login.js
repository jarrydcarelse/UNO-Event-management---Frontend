import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUserData } from '../utils/localStorage';
import '../login/Login.css';
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

  // PIN (OTP) Modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(Array(6).fill(''));
  const [pinError, setPinError] = useState('');
  const inputRefs = useRef([]);

  // Request-Event Modal state
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
      localStorage.setItem('token', res.data.token);
      setUserData(email);
      navigate('/dashboard');
    } catch (err) {
      setLoginError(
        err.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );
    }
  };

  // ─── PIN (OTP) HANDLERS ───────────────────────────
  const handlePinChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, '');
    if (val.length <= 1) {
      const next = [...pin];
      next[idx] = val;
      setPin(next);
      if (val && idx < 5) inputRefs.current[idx + 1].focus();
    }
  };
  const handlePinKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !pin[idx] && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };
  const handlePinSubmit = e => {
    e.preventDefault();
    const pinString = pin.join('');
    if (pinString === ADMIN_PIN) {
      setShowPinModal(false);
      setPin(Array(6).fill(''));
      setPinError('');
      navigate('/signup');
    } else {
      setPinError('Invalid PIN. Please try again.');
    }
  };

  // ─── REQUEST-EVENT HANDLERS ────────────────────────
  const handleRequestChange = e => {
    const { name, value } = e.target;
    setRequestData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmitRequest = async e => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess(false);
    const { title, description, date, requesterName, requesterEmail } =
      requestData;
    if (!title || !description || !date || !requesterName || !requesterEmail) {
      setRequestError('All fields are required.');
      return;
    }
    try {
      await axios.post(
        `${API_BASE}/api/EventRequests`,
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
      console.error('Request submission error:', err);
      setRequestError(
        err.response?.data?.message ||
        'Failed to submit request. Try again later.'
      );
    }
  };

  return (
    <div className="login-page">
      {/* ─── LEFT PANEL ──────────────────────────── */}
      <div
        className="login-left"
        style={{ backgroundImage: `url(${pattern})` }}
      >
        <div className="branding">
          <img src={logo} alt="Eventify Logo" className="logo-img" />
          <p className="welcome-text">
            Welcome to Eventify Events Management System.<br />
            Sign up to manage your events, track tasks, and stay connected.
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

      {/* ─── RIGHT PANEL ──────────────────────────── */}
      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Sign In</h2>
          <hr className="login-divider" />
          {loginError && <div className="form-error">{loginError}</div>}

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
                setPin(Array(6).fill(''));
                setPinError('');
              }}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>

      {/* ─── PIN (OTP) VERIFICATION MODAL ───────────── */}
      {showPinModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Admin PIN Verification</h3>
            </div>
            <hr className="login-divider" />

            <form className="modal-form" onSubmit={handlePinSubmit}>
              {pinError && <div className="form-error">{pinError}</div>}

              <div className="otp-container">
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    type="password"
                    maxLength="1"
                    className="otp-input"
                    value={digit}
                    onChange={e => handlePinChange(e, idx)}
                    onKeyDown={e => handlePinKeyDown(e, idx)}
                    ref={el => (inputRefs.current[idx] = el)}
                    inputMode="numeric"
                    pattern="\d*"
                    required
                  />
                ))}
              </div>

              <hr className="login-divider" />
              <div className="modal-actions">
                <button type="submit" className="btn-signin">
                  Verify
                </button>
                <button
                  type="button"
                  className="btn-signup"
                  onClick={() => {
                    setShowPinModal(false);
                    setPin(Array(6).fill(''));
                    setPinError('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>

            <button
              className="modal-close"
              onClick={() => {
                setShowPinModal(false);
                setPin(Array(6).fill(''));
                setPinError('');
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ─── Request Event Modal ─────────────────────── */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Request New Event</h3>
            </div>
            <hr className="login-divider" />

            <form className="modal-form" onSubmit={handleSubmitRequest}>
              {requestError && <div className="form-error">{requestError}</div>}
              {requestSuccess && (
                <div className="form-success">
                  Thanks! Your request has been submitted.
                </div>
              )}

              <input
                placeholder='Title'
                name="title"
                type="text"
                value={requestData.title}
                onChange={handleRequestChange}
                required
              />

              <textarea
                placeholder='Description'
                name="description"
                value={requestData.description}
                onChange={handleRequestChange}
                required
              />

              <input
                name="date"
                type="date"
                value={requestData.date}
                onChange={handleRequestChange}
                required
              />

              <input
                placeholder='Name'
                name="requesterName"
                type="text"
                value={requestData.requesterName}
                onChange={handleRequestChange}
                required
              />

              <input
                placeholder='Email'
                name="requesterEmail"
                type="email"
                value={requestData.requesterEmail}
                onChange={handleRequestChange}
                required
              />

              <hr className="login-divider" />
              <div className="modal-actions">
                <button type="submit" className="btn-signin">
                  Submit Request
                </button>
                <button
                  type="button"
                  className="btn-signup"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>

            <button
              className="modal-close"
              onClick={() => setShowRequestModal(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

