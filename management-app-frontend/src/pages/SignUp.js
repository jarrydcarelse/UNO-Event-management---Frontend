import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${API_BASE}/api/users/register`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccess('Registration successful!');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* LEFT PANEL */}
      <div
        className="signup-left"
        style={{ backgroundImage: `url(${pattern})` }}
      >
        <div className="branding">
          <img src={logo} alt="Eventify Logo" className="logo-img" />
          <p className="welcome-text">
            Welcome to Eventify Events Management System.
            <br />
            Sign up to manage your events, track tasks, and stay connected.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="signup-right">
        <form className="signup-form" onSubmit={handleSignUp}>
          <h2>Sign Up</h2>

          <hr className="signup-divider" />

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          {isLoading && (
            <div className="signup-loading">
              <LoadingSpinner />
            </div>
          )}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="repeatPassword">Repeat Password</label>
          <input
            id="repeatPassword"
            type="password"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <hr className="signup-divider" />

          <div className="signup-buttons">
            <button
              type="submit"
              className="btn-signup"
              disabled={isLoading}
            >
              Sign Up
            </button>
            <button
              type="button"
              className="btn-signin"
              onClick={() => navigate('/login')}
              disabled={isLoading}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
