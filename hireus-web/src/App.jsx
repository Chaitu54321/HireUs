import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './index.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <Link to="/">Hire<span className="highlight">US</span></Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Find Jobs</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard ({user.role})</Link>
            <span style={{ color: '#aaa', margin: '0 10px' }}>Hi, {user.username}!</span>
            <button onClick={handleLogout} className="nav-link btn btn-outline" style={{ cursor: 'pointer' }}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link btn btn-outline">Log in</Link>
            <Link to="/signup" className="nav-link btn btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-gradient"></div>
        <div className="bg-gradient-2"></div>
        
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
