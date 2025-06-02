import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <h1>Menedzer Zadan</h1>
      <nav>
        <ul>
          <li>
            <NavLink to="/" end>
              Strona Glowna
            </NavLink>
          </li>

          {currentUser && (
            <>
              <li>
                <NavLink to="/boards">
                  Moje Tablice
                </NavLink>
              </li>
              <li>
                <NavLink to="/user">
                  Uzytkownik
                </NavLink>
              </li>
            </>
          )}

          {!currentUser && (
            <>
              <li>
                <NavLink to="/login">
                  Logowanie
                </NavLink>
              </li>
              <li>
                <NavLink to="/register">
                  Rejestracja
                </NavLink>
              </li>
            </>
          )}

          {currentUser && (
            <li>
              <button onClick={handleLogout} className="nav-button">
                Wyloguj
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
