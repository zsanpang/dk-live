'use client';

import { motion } from 'framer-motion';
import { GiftItem, formatNumber } from '@/types/live';
import styles from './GiftList.module.css';

interface GiftListProps {
  list: GiftItem[];
}

const getRankStyle = (rank: number) => {
  if (rank === 1) return styles.gold;
  if (rank === 2) return styles.silver;
  if (rank === 3) return styles.bronze;
  return '';
};

export default function GiftList({ list }: GiftListProps) {
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>礼物榜单</h3>
        <span className={styles.badge}>TOP 10</span>
      </div>
      <div className={styles.list}>
        {list.map((item, index) => (
          <motion.div 
            key={item.rank}
            className={`${styles.item} ${getRankStyle(item.rank)}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className={styles.rank}>
              {item.rank <= 3 ? (
                <span className={styles.medal}>🏅</span>
              ) : (
                <span className={styles.rankNum}>{item.rank}</span>
              )}
            </div>
            <img 
              src={item.avatar} 
              alt={item.nickname}
              className={styles.avatar}
            />
            <div className={styles.info}>
              <span className={styles.nickname}>{item.nickname}</span>
              <span className={styles.giftInfo}>
                送出 <strong>{item.giftName}</strong> × {item.giftCount}
              </span>
            </div>
            <div className={styles.value}>
              <span className={`${styles.valueNum} number`}>
                {formatNumber(item.totalValue)}
              </span>
              <span className={styles.valueUnit}>币</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
