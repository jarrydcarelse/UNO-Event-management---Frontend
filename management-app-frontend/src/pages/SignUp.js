import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';
import logo from '../assets/logo.png';
import pattern from '../assets/pink-pattern.png';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: hook up real auth here
        navigate('/dashboard');
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
                        Welcome to Eventify Events Management System. Securely log in to
                        manage your events, track tasks, and stay connected.
                    </p>
                </div>
            </div>

            <div className="signup-right">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h2>Sign Up</h2>
                    <hr className="signup-divider" />

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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
