import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserProfile(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/user/profile/${userId}`);
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/signin', { username, password });
      const { id } = response.data;
      localStorage.setItem('userId', id);
      await fetchUserProfile(id);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to login. Please check your credentials.'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/api/auth/signup', { username, email, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to register. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setCurrentUser(null);
  };

  const updateProfile = async (type, data) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not logged in');

      let endpoint;
      let payload;

      switch (type) {
        case 'username':
          endpoint = `/api/user/profile/${userId}/username`;
          payload = { username: data };
          break;
        case 'email':
          endpoint = `/api/user/profile/${userId}/email`;
          payload = { email: data };
          break;
        case 'password':
          endpoint = `/api/user/profile/${userId}/password`;
          payload = { currentPassword: data.currentPassword, password: data.newPassword };
          break;
        default:
          throw new Error('Invalid update type');
      }

      const response = await axios.put(endpoint, payload);
      
      // Update current user if username or email was changed
      if (type === 'username' || type === 'email') {
        await fetchUserProfile(userId);
      }
      
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || `Failed to update ${type}. Please try again.`
      };
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};