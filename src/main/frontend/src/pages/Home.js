import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/boards');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="section">
      <h2>Witaj w Menedzerze Zadan</h2>
      <p>Prosta aplikacja do zarzadzania zadaniami i projektami.</p>

      <div className="cta-buttons">
        <button onClick={handleGetStarted}>Rozpocznij</button>
      </div>
    </section>
  );
};

export default Home;
