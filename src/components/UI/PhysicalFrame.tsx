import React from 'react';
import styles from './PhysicalFrame.module.css';

interface PhysicalFrameProps {
  children: React.ReactNode;
}

const PhysicalFrame: React.FC<PhysicalFrameProps> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      {/* The Coil/Hanger Detail */}
      <div className={styles.hanger}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className={styles.coilRing}></div>
        ))}
      </div>
      
      {/* The Calendar Body */}
      <div className={styles.frameBody}>
        {children}
      </div>

      {/* Decorative Shadow/Layer for 'stack' effects */}
      <div className={styles.bottomLayer}></div>
    </div>
  );
};

export default PhysicalFrame;
