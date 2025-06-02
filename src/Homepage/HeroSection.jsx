import { useState, useEffect, useRef } from 'react';
import styles from './HeroSection.module.css';
import { ChevronRight, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const [animate, setAnimate] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    setAnimate(true);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initialize intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.inView);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Select all elements with the animate-on-scroll class
    const animatedElements = document.querySelectorAll(`.${styles.animateOnScroll}`);
    animatedElements.forEach(el => observer.observe(el));
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className={styles.heroContainer} ref={sectionRef}>
      <div className={`${styles.heroContent} ${animate ? styles.animate : ''}`}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>
            <span className={styles.mainLine}>Track Meals</span>
            <span className={styles.accentLine}>Issue <span className={styles.highlightText}>Tokens</span>.</span>
            <span className={styles.accentLine}>Eat <span className={styles.highlightText}>Smart</span>.</span>
          </h1>
          <p className={styles.subtitle}>
            MessMate helps you manage your hostel meals efficiently with 
            token-based tracking, and real-time analytics.
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.checkIcon}>✓</div>
              <span>Easy to Use</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.checkIcon}>✓</div>
              <span>Live Analytics</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.checkIcon}>✓</div>
              <span>Meal Planning</span>
            </div>
          </div>
          
          <div className={styles.rating}>
            <div className={styles.starIcon}>★</div>
            <span className={styles.ratingText}>4.9 Rating from Students</span>
          </div>
          
          <button className={styles.ctaButton}>
            Get Started
            <ChevronRight size={18} />
          </button>
        </div>
        
        <div className={styles.heroVisual}>
          <div className={styles.mealTray}>
            <div className={styles.trayContent}>
              <div className={styles.idBadge}>
                <span>ID</span>
              </div>
              <div className={styles.riceSection}>
                <div className={styles.foodIcon}>🍚</div>
              </div>
              <div className={styles.currySection}>
                <div className={styles.foodIcon}>🍛</div>
              </div>
              <div className={styles.saladSection}>
                <div className={styles.foodIcon}>🥗</div>
              </div>
           
              <div className={styles.dessertSection}>
                <div className={styles.foodIcon}>🍗</div>
              </div>
            </div>
            <div className={styles.trayShadow}></div>
          </div>
          
          <div className={styles.floatingTokens}>
            <div className={`${styles.token} ${styles.token1}`}>🍽️</div>
            <div className={`${styles.token} ${styles.token2}`}>🥗</div>
            <div className={`${styles.token} ${styles.token3}`}>🍲</div>
            <div className={`${styles.token} ${styles.token4}`}>🍜</div>
            <div className={`${styles.token} ${styles.token5}`}>🥘</div>
          </div>
   
        </div>
      </div>
      
      <div className={`${styles.scrollIndicator} ${scrolled ? styles.hidden : ''}`} onClick={scrollToContent}>
        <span>Scroll to explore</span>
        <ChevronDown size={24} className={styles.scrollIcon} />
      </div>
      
      <div className={styles.particles}>
        {[...Array(15)].map((_, i) => (
          <div key={i} className={styles.particle}></div>
        ))}
      </div>
    </div>
  );
}
