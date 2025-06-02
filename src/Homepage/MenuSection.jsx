import { useState } from 'react';
import styles from './MenuSection.module.css';

// Icons for meal categories (unchanged)
const ClockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const LunchBoxIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M12 10v11" /></svg>;
const CoffeeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}><path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /><path d="M6 16c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4" /></svg>;
const DinnerIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}><path d="M3 14h18v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7z" /><path d="M12 3L2 14h20L12 3" /><path d="M12 14v5" /></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#4dabf7" strokeWidth="3" className={styles.checkIcon}><polyline points="20 6 9 17 4 12" /></svg>;

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  
  const mealCategories = [
    { id: 'breakfast', name: 'Breakfast Boost', color: '#ffc107', Icon: ClockIcon },
    { id: 'lunch', name: 'Lunch Load-Up', color: '#ff7f34', Icon: LunchBoxIcon },
    { id: 'snacks', name: 'Evening Snacks', color: '#f783ac', Icon: CoffeeIcon },
    { id: 'dinner', name: 'Dinner Delight', color: '#4dabf7', Icon: DinnerIcon }
  ];
  
  const features = [
    'Instant Token System',
    'Real-Time Meal Count',
    'Zero Paperwork'
  ];
  
  return (
    <div id= "Discover"className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleHighlight}>Discover Your Daily</span> Menu
        </h1>
        <h2 className={styles.subtitle}>Meals That Keep You Going</h2>
      </header>
      
      <div className={styles.mealGrid}>
        {mealCategories.map(({ id, name, color, Icon }) => (
          <div 
            key={id}
            className={`${styles.mealCard} ${activeCategory === id ? styles.active : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => setActiveCategory(id)}
          >
            <div className={styles.iconContainer}>
              <Icon />
            </div>
            <div className={styles.mealName}>
              {name.split(' ').map((word, idx) => (
                <div key={idx} className={styles.nameRow}>{word}</div>
              ))}
            </div>
            <div className={styles.cardGlow}></div>
          </div>
        ))}
      </div>
      
      <div className={styles.features}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <CheckIcon />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSection;