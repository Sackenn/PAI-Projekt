import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="section">
      <h2>404 - Strona nie znaleziona</h2>
      <p>Przepraszamy, ale strona, której szukasz, nie istnieje.</p>
      <div className="cta-buttons">
        <Link to="/">
          <button>Powrót do strony głównej</button>
        </Link>
      </div>
    </section>
  );
};

export default NotFound;