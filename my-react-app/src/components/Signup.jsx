import React from 'react'
import { useState } from 'react';
import { isValidPassword, isValidEmail, isValidFirstName, isValidLastName } from '../helpers/authHelpers';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            isValidEmail(email);
            isValidPassword(password);
            isValidFirstName(firstName);
            isValidLastName(lastName);
            
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }
            
            // TODO: Implement signup logic
            console.log(email, firstName, lastName, password, confirmPassword);
            console.log(`${apiUrl}/api/auth/`);
            const createUser = await axios.post(`${apiUrl}/api/auth/`, {
                email,
                firstName,
                lastName,
                password
            });

            console.log(createUser);
            // if the user is not created, throw an error
            if (createUser.status !== 201) {
                throw createUser.data.error;
            }
            // if the user is created, navigate to the login page
            navigate('/login');
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
            setError(e.message);
        }
    }

    if (loading) {
        return (
            <div className="login-container">
                <div className="login-form">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <h1 className="login-title">Create Account</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Create Account
                    </button>
                </form>
                <div className="signup-link">
                    Already have an account? <a href="/login">Log in</a>
                </div>
            </div>
        </div>
    );
}

export default Signup;
