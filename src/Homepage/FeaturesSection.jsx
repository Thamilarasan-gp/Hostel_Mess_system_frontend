import { useState, useEffect } from 'react';
import styles from './FeaturesSection.module.css';
import { Calendar, Users, BarChart3, CreditCard } from 'lucide-react';

export default function FeaturesSection() {
  const [animateFeatures, setAnimateFeatures] = useState({});
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimateFeatures(prev => ({ ...prev, [entry.target.dataset.feature]: true }));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    document.querySelectorAll(`.${styles.featureCard}`).forEach(card => {
      observer.observe(card);
    });
    
    return () => observer.disconnect();
  }, []);
  
  const features = [
    {
      id: 'track',
      icon: <Calendar className={styles.featureIcon} />,
      title: 'Track Meals',
      description: 'Monitor daily meal consumption patterns with real-time updates and detailed attendance logs.',
      color: 'blue'
    },
    {
      id: 'tokens',
      icon: <CreditCard className={styles.featureIcon} />,
      title: 'Issue Tokens',
      description: 'Generate and distribute digital meal tokens to students with secure authentication.',
      color: 'orange'
    },
    {
      id: 'analytics',
      icon: <BarChart3 className={styles.featureIcon} />,
      title: 'Live Analytics',
      description: 'Get instant insights on attendance, food waste, and popularity of menu items.',
      color: 'purple'
    },
    {
      id: 'users',
      icon: <Users className={styles.featureIcon} />,
      title: 'Student Management',
      description: 'Easily manage student profiles, dietary preferences, and attendance history.',
      color: 'green'
    }
  ];

  return (
    <section id="features" className={styles.featuresSection}>
      <div className={styles.featuresBg}></div>
      
      <div className={styles.featuresContainer}>
        <h2 className={styles.featuresTitle}>Powerful Features</h2>
        <p className={styles.featuresSubtitle}>Everything you need to manage your hostel mess efficiently</p>
        
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div 
              key={feature.id}
              data-feature={feature.id}
              className={`${styles.featureCard} ${styles[`feature${feature.color}`]} ${animateFeatures[feature.id] ? styles.animateIn : ''}`}
            >
              <div className={styles.featureIconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
              
              <div className={styles.featureGlow}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}