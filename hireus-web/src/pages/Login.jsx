import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleSubmit} className="feature-card glass-panel" style={{ width: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '1.5rem' }}>Log In</h2>
        {error && <p style={{ color: '#ff4d4f', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#bbb', display: 'block', marginBottom: '0.5rem' }}>Username</label>
          <input 
            type="text" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            className="search-input" style={{ width: '100%' }} required 
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ color: '#bbb', display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <input 
            type="password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            className="search-input" style={{ width: '100%' }} required 
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#888' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#00c2ff' }}>Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
