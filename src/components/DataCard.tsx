'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LiveRoomData, formatNumber, formatMoney } from '@/types/live';
import styles from './DataCard.module.css';

interface DataCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  type?: 'default' | 'money' | 'live';
  prevValue?: number;
}

export default function DataCard({ label, value, icon, type = 'default', prevValue }: DataCardProps) {
  const displayValue = typeof value === 'number' 
    ? (type === 'money' ? formatMoney(value) : formatNumber(value))
    : value;
    
  const isUp = prevValue !== undefined && typeof value === 'number' && value > prevValue;
  const isDown = prevValue !== undefined && typeof value === 'number' && value < prevValue;

  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <div className={styles.valueWrapper}>
          <motion.span 
            className={`${styles.value} number`}
            key={String(value)}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
          >
            {displayValue}
          </motion.span>
          {prevValue !== undefined && (
            <span className={`${styles.change} ${isUp ? styles.up : isDown ? styles.down : ''}`}>
              {isUp ? '↑' : isDown ? '↓' : ''}
            </span>
          )}
        </div>
      </div>
      {type === 'live' && (
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}></span>
          LIVE
        </div>
      )}
    </motion.div>
  );
}
