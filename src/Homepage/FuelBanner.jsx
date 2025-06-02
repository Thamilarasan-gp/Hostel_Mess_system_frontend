// FuelBanner.jsx
import React from 'react';
import styles from './FuelBanner.module.css';
import { Utensils } from 'lucide-react';

const FuelBanner = () => {
  return (
    <div id="explore"className={styles.bannerContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.iconWrapper}>
          <Utensils className={styles.icon} size={36} />
        </div>
        <h1 className={styles.title}>Fuel Every Meal with MessMate</h1>
        <p className={styles.subtitle}>
          From breakfast to dinner, ensure every student is served right—smartly, efficiently, and happily.
        </p>
        <div className={styles.divider}></div>
        <button className={styles.ctaButton}>Start Now</button>
      </div>
    </div>
  );
};

export default FuelBanner;