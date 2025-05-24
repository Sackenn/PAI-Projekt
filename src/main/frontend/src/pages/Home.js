import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/boards');
    } else {
      navigate('/login');
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setMessage('Nazwa użytkownika nie może być pusta');
      setMessageType('error');
      return;
    }

    const result = await updateProfile('username', username);
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage('Email nie może być pusty');
      setMessageType('error');
      return;
    }

    const result = await updateProfile('email', email);
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword.trim() || !newPassword.trim()) {
      setMessage('Oba pola hasła są wymagane');
      setMessageType('error');
      return;
    }

    const result = await updateProfile('password', { currentPassword, newPassword });
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');
    
    if (result.success) {
      setCurrentPassword('');
      setNewPassword('');
    }
  };

  return (
    <section className="section">
      <h2>Witaj w Menedzerze Zadan</h2>
      <p>Prosta aplikacja do zarzadzania zadaniami i projektami.</p>
      
      <div className="cta-buttons">
        <button onClick={handleGetStarted}>Rozpocznij</button>
      </div>

      {currentUser && (
        <div className="user-profile-section">
          <h3>Twój Profil</h3>

          {/* Formularz aktualizacji nazwy użytkownika */}
          <form onSubmit={handleUsernameSubmit} className="profile-form">
            <h4>Aktualizacja nazwy użytkownika</h4>
            <div className="form-group">
              <label htmlFor="profile-username">Nazwa Użytkownika</label>
              <input 
                type="text" 
                id="profile-username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            <button type="submit">Aktualizuj nazwę użytkownika</button>
          </form>

          {/* Formularz aktualizacji emaila */}
          <form onSubmit={handleEmailSubmit} className="profile-form">
            <h4>Aktualizacja adresu email</h4>
            <div className="form-group">
              <label htmlFor="profile-email">Email</label>
              <input 
                type="email" 
                id="profile-email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <button type="submit">Aktualizuj email</button>
          </form>

          {/* Formularz aktualizacji hasła */}
          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <h4>Aktualizacja hasła</h4>
            <div className="form-group">
              <label htmlFor="profile-current-password">Aktualne Hasło</label>
              <input 
                type="password" 
                id="profile-current-password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile-password">Nowe Hasło</label>
              <input 
                type="password" 
                id="profile-password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
              />
            </div>
            <button type="submit">Aktualizuj hasło</button>
          </form>

          {message && (
            <div 
              id="profile-message" 
              className={messageType === 'success' ? 'success-message' : 'error-message'}
            >
              {message}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Home;