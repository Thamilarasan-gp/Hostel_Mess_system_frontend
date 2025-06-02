import React, { useEffect, useState, useRef } from 'react';
import styles from './About.module.css';
import { Users, Utensils, Clock, BarChart2 } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionsRef = useRef([]);
  const shapesRef = useRef([]);
  
  const isInViewport = (element, offset = 150) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top + offset < window.innerHeight && 
      rect.bottom > 0
    );
  };

  useEffect(() => {
    setIsVisible(true);
    
    sectionsRef.current = document.querySelectorAll(`.${styles.animatedSection}`);
    shapesRef.current = document.querySelectorAll(`.${styles.shape}`);
    
    const handleScroll = () => {
      sectionsRef.current.forEach(section => {
        if (isInViewport(section)) {
          section.classList.add(styles.animated);
        } else {
          section.classList.remove(styles.animated);
        }
      });
      
      if (window.innerWidth > 768) {
        const scrollPosition = window.scrollY;
        shapesRef.current.forEach((shape, index) => {
          const speed = 0.05 + (index * 0.02);
          const yPos = scrollPosition * speed;
          const rotation = scrollPosition * (index % 2 === 0 ? 0.02 : -0.02);
          shape.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: <Utensils className={styles.featureIcon} />,
      title: "Meal Tracking",
      description: "Simplify meal management with our intuitive tracking system"
    },
    {
      icon: <BarChart2 className={styles.featureIcon} />,
      title: "Reduce Waste",
      description: "Minimize food wastage through smart analytics and forecasting"
    },
    {
      icon: <Users className={styles.featureIcon} />,
      title: "Student Satisfaction",
      description: "Enhance dining experience with personalized options"
    },
    {
      icon: <Clock className={styles.featureIcon} />,
      title: "Time Efficiency",
      description: "Streamline operations and reduce wait times"
    }
  ];

  return (
    <div id="About"className={styles.aboutContainer}>
      {/* Animated background shapes - hidden on mobile */}
      <div className={`${styles.shape} ${styles.circle}`} data-speed="0.3"></div>
      <div className={`${styles.shape} ${styles.square}`} data-speed="0.5"></div>
      <div className={`${styles.shape} ${styles.triangle}`} data-speed="0.2"></div>
      <div className={`${styles.shape} ${styles.donut}`} data-speed="0.4"></div>
      <div className={`${styles.shape} ${styles.plus}`} data-speed="0.6"></div>

      <div className={`${styles.contentWrapper} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.twoColumnLayout}>
          {/* Right Column - Image (comes first on mobile) */}
          <div className={styles.rightColumn}>
            <div className={`${styles.heroImageWrapper} ${styles.animatedSection}`} data-animation="fadeInUp">
              <img 
                src="../../src/assets/About.png" 
                alt="MessMate interface illustration" 
                className={styles.heroImage}
              />
            </div>
          </div>

          {/* Left Column - Content */}
          <div className={styles.leftColumn}>
            <div className={`${styles.headerSection} ${styles.animatedSection}`} data-animation="fadeInUp">
              <div className={styles.logoSection}>
                <h1 className={styles.title}>About MessMate</h1>
              </div>
            </div>

            <div className={`${styles.descriptionSection} ${styles.animatedSection}`} data-animation="fadeInUp">
              <p className={styles.description}>
                MessMate is a digital mess management platform designed to simplify meal tracking,
                reduce food wastage, and enhance student satisfaction through innovative technology
                and user-centered design.
              </p>
              
              <button className={styles.exploreButton}>
                Explore Dashboard
                <span className={styles.buttonArrow}>→</span>
              </button>
            </div>

            {/* <div className={`${styles.featuresSection} ${styles.animatedSection}`} data-animation="fadeInUp">
              <div className={styles.featuresGrid}>
                {features.map((feature, index) => (
                  <div key={index} className={styles.featureCard}>
                    <div className={styles.featureIconWrapper}>
                      {feature.icon}
                    </div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;