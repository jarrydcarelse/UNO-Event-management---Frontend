import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../assets/logo.png';
import pattern from '../assets/pink-pattern.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hook up real auth here
    navigate('/dashboard');
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
            Welcome to Eventify Events Management System. Securely log in to
            manage your events, track tasks, and stay connected.
          </p>
        </div>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <hr className="login-divider" />

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
              className="btn-signup"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
