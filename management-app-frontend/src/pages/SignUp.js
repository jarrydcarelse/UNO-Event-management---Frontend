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
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess(false);

    // Validate passwords match
    if (password !== repeatPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/api/users/register`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setSignupSuccess(true);
      setSignupError('');
      // Redirect to login after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setSignupError(
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
            Welcome to Eventify Events Management System.<br />
            Create an account to manage your events, track tasks, and stay connected.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="signup-right">
        <form className="signup-form" onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
          <hr className="signup-divider" />
          
          {signupError && <div className="form-error">{signupError}</div>}
          {signupSuccess && (
            <div className="form-success">
              Registration successful! Redirecting to login...
            </div>
          )}
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
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="repeat-password">Repeat Password</label>
          <input
            id="repeat-password"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
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
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
