// src/pages/SignUp.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignUp.css';
import logo from '../assets/logo.png';
import pattern from '../assets/pink-pattern.png';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Call the Render backend directly
      const res = await axios.post(
        "https://eventify-backend-kgtm.onrender.com/api/users/signup",
        {
          email,
          password
        }
      );

      const msg = res.data?.message || "Registration successful! Redirecting to login...";
      setSuccess(msg);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.log("Registration error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      const msg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        "Registration failed. Please try again.";
      setError(msg);
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
            Welcome to Eventify Events Management System.
            Sign up to manage your events, track tasks, and stay connected.
          </p>
        </div>
      </div>

      <div className="signup-right">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <hr className="signup-divider" />

          {error && <div className="signup-error">{error}</div>}
          {success && <div className="signup-success">{success}</div>}

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

          <label htmlFor="repeat-password">Repeat Password</label>
          <input
            id="repeat-password"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
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
    </div>
  );
};

export default SignUp;
