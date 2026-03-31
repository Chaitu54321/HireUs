import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (token && username) {
      setUser({ token, username, role, userId: userId ? parseInt(userId) : null });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token, role, username: registeredUser, userId } = res.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('username', registeredUser);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    
    setUser({ token, username: registeredUser, role, userId });
  };

  const signup = async (username, email, password, role) => {
    await api.post('/auth/signup', { username, email, password, role });
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
