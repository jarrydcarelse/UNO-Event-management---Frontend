import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignUp.css';
import logo from '../assets/logo.png';
import pattern from '../assets/pink-pattern.png';

const API_BASE = "https://eventify-backend-kgtm.onrender.com";

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

        // Frontend check for password match
        if (password !== repeatPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post(`${API_BASE}/api/Auth/register`, { email, password });
            setSuccess(res.data.message || "Registration successful! Redirecting to login...");
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            console.log("Registration error:", err, err.response);
            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                "Registration failed. Please try again."
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
                        Welcome to Eventify Events Management System. Sign up to manage your events, track tasks, and stay connected.
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
        </div>
    );

};

export default SignUp;
