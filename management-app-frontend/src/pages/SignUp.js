import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../signup/SignUp.css';
import logo from '../assets/logo.png';
import pattern from '../assets/pink-pattern.png';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  'https://eventify-backend-kgtm.onrender.com';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // ─── REQUEST-EVENT MODAL STATE ─────────────────────
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

  // ─── SIGN-UP FORM SUBMIT ────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/api/users/signup`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const msg =
        res.data?.message ||
        "Registration successful! Redirecting to login...";
      setSuccess(msg);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        "Registration failed. Please try again.";
      setError(msg);
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
    <div className="signup-page">
      <div
        className="signup-left"
        style={{ backgroundImage: `url(${pattern})` }}
      >
        <div className="branding">
          <img src={logo} alt="Eventify Logo" className="logo-img" />
          <p className="welcome-text">
            Welcome to Eventify Events Management System. <br/>
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

      <div className="signup-right">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <hr className="signup-divider" />

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

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

          <label htmlFor="repeat-password">Repeat Password</label>
          <input
            id="repeat-password"
            type="password"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            required
          />

          <hr className="signup-divider" />

          <div className="signup-buttons">
            <button type="submit" className="btn-signup">
              Sign Up
            </button>
            <button
              type="button"
              className="btn-signin"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>

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

            <form
              className="modal-form"
              onSubmit={handleSubmitRequest}
            >
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
                  className="btn-signup"
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
