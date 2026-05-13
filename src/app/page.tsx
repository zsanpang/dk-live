'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DataCard from '@/components/DataCard';
import GiftList from '@/components/GiftList';
import ModeSwitch from '@/components/ModeSwitch';
import { LiveRoomData, generateMockData } from '@/types/live';
import styles from './page.module.css';

// 在线人数图标
const LiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

// 点赞图标
const LikeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

// 礼物图标
const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
  </svg>
);

// 复制图标
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
);

// 清空图标
const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

export default function Home() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'mock' | 'real'>('mock');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LiveRoomData | null>(null);
  const [prevData, setPrevData] = useState<LiveRoomData | null>(null);

  // 查询直播间数据
  const fetchData = useCallback(async () => {
    if (!input.trim()) return;

    if (mode === 'mock') {
      // 模拟数据
      setPrevData(data);
      const newData = generateMockData(input);
      setData(newData);
    } else {
      // 真实数据 - 这里预留接口
      setLoading(true);
      try {
        // TODO: 调用真实 API
        // const response = await fetch(`/api/live?input=${encodeURIComponent(input)}`);
        // const newData = await response.json();
        
        // 暂时也用模拟数据
        setPrevData(data);
        const newData = generateMockData(input);
        setData(newData);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [input, mode, data]);

  // 自动刷新
  useEffect(() => {
    if (!data) return;
    
    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [data, fetchData]);

  // 处理查询
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    fetchData();
  };

  // 粘贴
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (error) {
      console.error('粘贴失败:', error);
    }
  };

  // 清空
  const handleClear = () => {
    setInput('');
    setData(null);
    setPrevData(null);
  };

  return (
    <div className={styles.container}>
      {/* 背景装饰 */}
      <div className={styles.bgDecoration}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
      </div>

      <main className={styles.main}>
        {/* 头部 */}
        <header className={styles.header}>
          <motion.div 
            className={styles.logo}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.logoIcon}>🎬</span>
            <h1 className={styles.title}>dk抖音直播</h1>
          </motion.div>
          <p className={styles.subtitle}>实时掌握直播间数据</p>
        </header>

        {/* 搜索区域 */}
        <motion.form 
          className={styles.searchBox}
          onSubmit={handleSubmit}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="粘贴直播间链接或输入抖音号"
              className={styles.input}
            />
            <div className={styles.inputActions}>
              {input && (
                <button type="button" onClick={handleClear} className={styles.actionBtn}>
                  <ClearIcon />
                </button>
              )}
              <button type="button" onClick={handlePaste} className={styles.actionBtn}>
                <CopyIcon />
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className={styles.searchBtn}
            disabled={loading || !input.trim()}
          >
            {loading ? '查询中...' : '查询'}
          </button>
        </motion.form>

        {/* 模式切换 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ModeSwitch mode={mode} onChange={setMode} />
        </motion.div>

        {/* 数据展示 */}
        <AnimatePresence mode="wait">
          {data && (
            <motion.div 
              className={styles.dataSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 直播间信息 */}
              <div className={styles.roomInfo}>
                <img src={data.coverUrl} alt={data.roomTitle} className={styles.cover} />
                <div className={styles.roomDetail}>
                  <h2 className={styles.anchorName}>{data.anchorName}</h2>
                  <p className={styles.roomTitle}>{data.roomTitle}</p>
                </div>
              </div>

              {/* 数据卡片 */}
              <div className={styles.cards}>
                <DataCard
                  label="在线人数"
                  value={data.onlineCount}
                  icon={<LiveIcon />}
                  type="live"
                  prevValue={prevData?.onlineCount}
                />
                <DataCard
                  label="点赞数"
                  value={data.likeCount}
                  icon={<LikeIcon />}
                  prevValue={prevData?.likeCount}
                />
                <DataCard
                  label="礼物收入"
                  value={data.giftIncome}
                  icon={<GiftIcon />}
                  type="money"
                  prevValue={prevData?.giftIncome}
                />
              </div>

              {/* 礼物榜单 */}
              <GiftList list={data.giftList} />

              {/* 刷新指示 */}
              <div className={styles.refreshTip}>
                <span className={styles.refreshDot}></span>
                每3秒自动刷新
              </div>
            </motion.div>
          )}

          {!data && (
            <motion.div 
              className={styles.empty}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.emptyIcon}>📊</div>
              <p>输入直播间链接或抖音号开始查询</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 底部安全区域 */}
      <footer className={styles.footer}>
        <p>© 2024 dk抖音直播数据查询</p>
      </footer>
    </div>
  );
}
