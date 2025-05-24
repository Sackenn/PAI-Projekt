import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Wszystkie pola są wymagane');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const result = await register(username, email, password);
      
      if (result.success) {
        setSuccess(result.message || 'Rejestracja zakończona pomyślnie. Możesz się teraz zalogować.');
        // Clear form
        setUsername('');
        setEmail('');
        setPassword('');
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <h2>Rejestracja</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-username">Nazwa Uzytkownika</label>
          <input 
            type="text" 
            id="reg-username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reg-email">Email</label>
          <input 
            type="email" 
            id="reg-email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reg-password">Haslo</label>
          <input 
            type="password" 
            id="reg-password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Rejestracja...' : 'Zarejestruj'}
        </button>
      </form>
      
      <p className="form-footer">
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </section>
  );
};

export default Register;