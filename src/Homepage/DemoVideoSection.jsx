import React from 'react';
import styles from './DemoVideoSection.module.css';

const DemoVideoSection = () => {
  return (
    <section className={styles.videoSection}>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <h2 className={styles.heading}>
            <span className={styles.headingHighlight}>See How</span> MessMate Works
          </h2>
          <p className={styles.subtext}>
            Discover how MessMate simplifies your hostel mess experience with meal booking, real-time updates, and effortless feedback.
          </p>
        </div>
        
        <div className={styles.videoContainer}>
          <div className={styles.videoWrapper}>
            <div className={styles.playButtonCircle} aria-hidden="true">
              <div className={styles.playButtonInner}></div>
            </div>
            <iframe
              className={styles.video}
              src="https://www.youtube.com/embed/qzGxK6Uiu04?si=xYSFab7SjGahShfi"
              title="MessMate Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className={styles.videoGlow}></div>
        </div>
      </div>
    </section>
  );
};

export default DemoVideoSection;