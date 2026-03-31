import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', role: 'CANDIDATE'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData.username, formData.email, formData.password, formData.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Failed to register account');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleSubmit} className="feature-card glass-panel" style={{ width: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '1.5rem' }}>Create Account</h2>
        {error && <p style={{ color: '#ff4d4f', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#bbb', display: 'block', marginBottom: '0.5rem' }}>Username</label>
          <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="search-input" style={{ width: '100%' }} required />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#bbb', display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="search-input" style={{ width: '100%' }} required />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#bbb', display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="search-input" style={{ width: '100%' }} required />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ color: '#bbb', display: 'block', marginBottom: '0.5rem' }}>I am a...</label>
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="search-input" style={{ width: '100%', backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <option value="CANDIDATE" style={{ backgroundColor: '#1a1a2e', color: '#fff' }}>Candidate looking for jobs</option>
            <option value="RECRUITER" style={{ backgroundColor: '#1a1a2e', color: '#fff' }}>Recruiter hiring talent</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign Up</button>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#888' }}>
          Already have an account? <Link to="/login" style={{ color: '#00c2ff' }}>Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
