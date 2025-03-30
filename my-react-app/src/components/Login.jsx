import React, { useState } from "react";
import { isValidEmail, isValidPassword } from "../helpers/authHelpers";
import './Login.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      isValidEmail(email);
      isValidPassword(password);
      
      // TODO: Implement login logic
      const loginUser = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password
      });

      if (loginUser.status !== 200) {
        throw loginUser.data.error;
      }
      if (loginUser.data && loginUser.data.token && loginUser.data.payload) {
        login(loginUser.data.token, loginUser.data.payload);

        navigate(from, { replace: true });


      }else {
        console.error("Login response missing token or user data:", loginUser.data);
        setError('Login failed: Invalid response from server.');

      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-form">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Welcome Back</h1>
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;