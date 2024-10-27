import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css'; 

const LoginRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(''); 
    setLoading(true); 
    try {
      
      console.log('Logging in with:', { username, password });
      
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      
      localStorage.setItem('user', JSON.stringify(response.data));
      
      
      navigate('/app', { state: { username: response.data.user.username } });
    } catch (error) {
      
      setError(error.response?.data?.message );
      console.error('Login error:', error);
    } finally {
      
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(''); 
    setLoading(true); // Show loading state
    try {
      // Log the registration attempt
      console.log('Registering with:', { username, password });
      
      // Send registration request
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
      });

      // Automatically log in the user after registration
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/app', { state: { username: response.data.user.username } });
    } catch (error) {
      // Handle error during registration
      setError(error.response?.data?.message);
      console.error('Registration error:', error);
    } finally {
      // Hide loading state
      setLoading(false);
    }
  };

  return (
    <div className="login-register-container">
      <div className="form-wrapper">
        <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Loading...</div>}
        <div className="form">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="submit-btn" onClick={isLoginMode ? handleLogin : handleRegister}>
            {isLoginMode ? 'Login' : 'Register'}
          </button>
          <div className="toggle-message">
            {isLoginMode ? (
              <>
                Don't have an account? <span onClick={() => setIsLoginMode(false)}>Register</span>
              </>
            ) : (
              <>
                Already have an account? <span onClick={() => setIsLoginMode(true)}>Login</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
