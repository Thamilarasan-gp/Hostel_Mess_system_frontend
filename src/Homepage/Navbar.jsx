import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleVisitClick = () => {
    // You can change this to any route you want
    navigate('/login'); 
    // Or for specific dashboards:
    // navigate('/studentdash');
    // navigate('/wardendash');
    // navigate('/messdash');
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>MessMate</div>
      
      {/* Hamburger Menu Icon */}
      <div 
        className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} 
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </div>

      {/* Navigation Links with Glass Effect */}
      <div className={`${styles.navContainer} ${isMenuOpen ? styles.active : ''}`}>
        <ul className={styles.navLinks}>
          <li><a href="#" onClick={() => setIsMenuOpen(false)}>Home</a></li>
          <li><a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a></li>
          <li><a href="#Discover" onClick={() => setIsMenuOpen(false)}>Discover</a></li>
          <li><a href="#About" onClick={() => setIsMenuOpen(false)}>About</a></li>
          <li><a href="login" onClick={() => setIsMenuOpen(false)}>Warden</a></li>
          <li><a href="messLogin" onClick={() => setIsMenuOpen(false)}>Mess</a></li>
          <li><a href="login" onClick={() => setIsMenuOpen(false)}>Student</a></li>
        </ul>
        <button className={styles.mobileLoginBtn} onClick={handleVisitClick}>
         Login
        </button>
      </div>

      <button className={styles.desktopLoginBtn} onClick={handleVisitClick}>
      Login
      </button>
    </nav>
  );
};

export default Navbar;