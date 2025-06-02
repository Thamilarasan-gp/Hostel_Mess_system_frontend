import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import img from '../assets/boys.jpg';

const IntroDashboard = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    // Determine time of day for greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 18) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');

    // Animation trigger
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (path, buttonName) => {
    setActiveButton(buttonName);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  // Button data for cleaner code
  const buttons = [
    {
      name: 'student',
      path: '/studentLogin',
      text: 'Student',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    },
    {
      name: 'warden',
      path: '/wardenLogin',
      text: 'Warden',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          <path d="M9 8h6"/>
        </svg>
      )
    },
    {
      name: 'mess',
      path: '/messLogin',
      text: 'Mess',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a10 10 0 0 0-8 4v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a10 10 0 0 0-8-4z"/>
          <path d="M4 6h16"/>
        </svg>
      )
    }
  ];

  return (
    <div className={`${styles.dashboard} ${isAnimating ? styles.animateIn : ''}`}>
      <header className={styles.header}>
        <h1 className={styles.logo}>MESSMATE</h1>
        <p className={styles.greeting}>Good {timeOfDay}!</p>
      </header>
      
      <div className={styles.container}>
        {/* Left Side - Image with floating animation */}
        <div className={styles.imageSection}>
          <img 
            src={img}
            alt="Student entering room" 
            className={`${styles.image} ${styles.floatAnimation}`}
          />
          <div className={styles.imageOverlay}></div>
        </div>
        
        {/* Right Side - Buttons */}
        <div className={styles.buttonsSection}>
          <h2 className={styles.subtitle}>Who are you?</h2>
          <p className={styles.description}>Select your role to continue</p>
          
          {buttons.map((button) => (
            <button 
              key={button.name}
              className={`${styles.roleButton} ${
                activeButton === button.name ? styles.active : ''
              }`}
              onClick={() => handleNavigation(button.path, button.name)}
              aria-label={`Navigate to ${button.text} section`}
            >
              <span className={styles.buttonIcon}>
                {button.icon}
              </span>
              <span className={styles.buttonText}>{button.text}</span>
              <span className={styles.buttonArrow}>→</span>
            </button>
          ))}
          
          <div className={styles.footerNote}>
            <p>New here? <span className={styles.highlight}>Contact admin</span> for access</p>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={styles.circleDecoration}></div>
      <div className={styles.triangleDecoration}></div>
    </div>
  );
};

export default IntroDashboard;