import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import '../signup/SignUp.css';
import logo from '../assets/logo.png';
import pattern from '../assets/pink-pattern.png';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' 
    ? 'https://eventify-backend-kgtm.onrender.com'
    : '');

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
    console.log('=== SIGNUP FORM SUBMITTED ===');
    console.log('Email:', email);
    console.log('API Base URL:', API_BASE);
    
    setSignupError('');
    setSignupSuccess(false);

    if (password !== repeatPassword) {
      console.log('❌ Password validation failed - passwords do not match');
      setSignupError('Passwords do not match');
      return;
    }
    console.log('✅ Password validation passed');

    setIsLoading(true);
    console.log('🔄 Starting API request...');
    
    try {
      const requestURL = `${API_BASE}/api/users/signup`;
      const requestData = { email, password };
      const requestConfig = { headers: { 'Content-Type': 'application/json' } };
      
      console.log('📤 Request Details:');
      console.log('  URL:', requestURL);
      console.log('  Data:', { email, password: '***' });
      console.log('  Headers:', requestConfig.headers);
      
      const res = await axios.post(requestURL, requestData, requestConfig);
      
      console.log('✅ Registration successful!');
      console.log('📥 Response status:', res.status);
      console.log('📥 Response data:', res.data);
      
      setSignupSuccess(true);
      setSignupError('');
      
      console.log('⏱️ Redirecting to login in 2 seconds...');
      setTimeout(() => {
        console.log('➡️ Navigating to /login');
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('❌ Registration failed');
      console.error('Error object:', err);
      
      if (err.response) {
        console.error('📥 Server responded with error:');
        console.error('  Status:', err.response.status);
        console.error('  Data:', err.response.data);
        console.error('  Headers:', err.response.headers);
      } else if (err.request) {
        console.error('📡 Request made but no response received:');
        console.error('  Request:', err.request);
      } else {
        console.error('⚙️ Error setting up request:');
        console.error('  Message:', err.message);
      }
      
      setSignupError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
      console.log('🏁 Signup process completed');
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
            Welcome to Eventify Events Management System.<br />
            Create an account to manage your events, track tasks, and stay connected.
          </p>
        </div>
      </div>


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
