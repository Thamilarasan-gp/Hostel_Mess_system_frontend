import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>MessMate</div>
          <div className={styles.gridIcon}>
            {/* Just a placeholder for the grid-style icon */}
            {[...Array(9)].map((_, i) => (
              <div key={i} className={styles.square}></div>
            ))}
          </div>
        </div>

        <div className={styles.linksSection}>
          <div>
            <h4>About Us</h4>
            <a href="#">Our Mission</a>
            <a href="#">Team</a>
            <a href="#">Newsletter</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="#">Contact</a>
            <a href="#">Refund Policy</a>
            <a href="#">FAQ's</a>
          </div>
          <div>
            <h4>Social</h4>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">YouTube</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} MessMate</p>
        <p><a href="#">Terms of Service</a></p>
        <p><a href="#">Back to top ↑</a></p>
      </div>
    </footer>
  );
};

export default Footer;
