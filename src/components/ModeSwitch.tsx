'use client';

import { motion } from 'framer-motion';
import styles from './ModeSwitch.module.css';

interface ModeSwitchProps {
  mode: 'mock' | 'real';
  onChange: (mode: 'mock' | 'real') => void;
}

export default function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className={styles.container}>
      <span className={`${styles.label} ${mode === 'mock' ? styles.active : ''}`}>模拟数据</span>
      <button 
        className={`${styles.switch} ${mode === 'real' ? styles.on : ''}`}
        onClick={() => onChange(mode === 'mock' ? 'real' : 'mock')}
        aria-label={`切换到${mode === 'mock' ? '真实' : '模拟'}数据`}
      >
        <motion.div 
          className={styles.handle}
          animate={{ x: mode === 'real' ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      <span className={`${styles.label} ${mode === 'real' ? styles.active : ''}`}>真实数据</span>
    </div>
  );
}
