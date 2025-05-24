import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <p>&copy; {currentYear} Menedzer Zadan. Wszelkie prawa zastrzezone.</p>
    </footer>
  );
};

export default Footer;