<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

// 类型
interface GiftItem {
  rank: number
  avatar: string
  nickname: string
  giftName: string
  giftCount: number
  totalValue: number
}

interface LiveData {
  roomId: string
  anchorName: string
  roomTitle: string
  coverUrl: string
  onlineCount: number
  likeCount: number
  giftIncome: number
  giftList: GiftItem[]
}

// 状态
const input = ref('')
const loading = ref(false)
const data = ref<LiveData | null>(null)
const darkMode = ref(true)
const autoRefresh = ref(false)
const refreshInterval = ref(5)
let timer: number | null = null

// 模拟数据
function generateMock(): LiveData {
  const baseOnline = Math.floor(Math.random() * 5000) + 1000
  const fluctuate = () => (Math.random() - 0.5) * 0.1
  
  const gifts = ['火箭', '跑车', '城堡', '仙女棒', '小心心']
  const names = ['用户1234', '直播间老铁', '小明同学', '隔壁老王', '忠实粉丝', '路人甲', '爱心大使', '榜一大哥', '神秘人', '土豪玩家']
  
  const giftList: GiftItem[] = names.map((nickname, i) => ({
    rank: i + 1,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    nickname,
    giftName: gifts[i % gifts.length],
    giftCount: Math.floor(Math.random() * 100) + 10,
    totalValue: Math.floor(Math.random() * 10000) + 500,
  })).sort((a, b) => b.totalValue - a.totalValue).map((item, i) => ({ ...item, rank: i + 1 }))

  return {
    roomId: 'mock_' + Date.now(),
    anchorName: input.value.replace(/[^a-zA-Z0-9_]/g, '') || '主播',
    roomTitle: '直播间标题',
    coverUrl: 'https://picsum.photos/400/300?random=1',
    onlineCount: Math.floor(baseOnline * (1 + fluctuate())),
    likeCount: Math.floor(Math.random() * 100000) + 50000,
    giftIncome: giftList.reduce((sum, g) => sum + g.totalValue, 0),
    giftList,
  }
}

function formatNum(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

function handleSearch() {
  if (!input.value.trim()) return
  loading.value = true
  setTimeout(() => {
    data.value = generateMock()
    loading.value = false
    if (autoRefresh.value) startAutoRefresh()
  }, 800)
}

function startAutoRefresh() {
  stopAutoRefresh()
  if (!data.value) return
  timer = window.setInterval(() => {
    data.value = generateMock()
  }, refreshInterval.value * 1000)
}

function stopAutoRefresh() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function toggleAutoRefresh() {
  autoRefresh.value = !autoRefresh.value
  if (autoRefresh.value) startAutoRefresh()
  else stopAutoRefresh()
}

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  document.documentElement.setAttribute('data-theme', darkMode.value ? 'dark' : 'light')
}

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<template>
  <div class="app" :data-theme="darkMode ? 'dark' : 'light'">
    <!-- Background Effect -->
    <div class="bg-gradient"></div>
    <div class="bg-noise"></div>
    
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <div class="logo-mark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        <span class="logo-text">dk.live</span>
      </div>
      <button class="theme-btn" @click="toggleDarkMode">
        <svg v-if="darkMode" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </header>

    <!-- Search -->
    <section class="search-section">
      <div class="search-box">
        <input 
          v-model="input" 
          type="text" 
          placeholder="输入抖音号或直播间链接"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch" :disabled="loading">
          <span v-if="!loading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <span v-else class="loading"></span>
        </button>
      </div>
    </section>

    <!-- Auto Refresh Toggle -->
    <div class="toggle-row">
      <label class="toggle">
        <input type="checkbox" :checked="autoRefresh" @change="toggleAutoRefresh" />
        <span class="slider"></span>
      </label>
      <span class="toggle-label">自动刷新</span>
      <select v-if="autoRefresh" v-model="refreshInterval" class="refresh-select">
        <option :value="3">3秒</option>
        <option :value="5">5秒</option>
        <option :value="10">10秒</option>
      </select>
    </div>

    <!-- Data Display -->
    <main v-if="data" class="main">
      <!-- Room Info -->
      <div class="card room-card">
        <div class="cover-wrapper">
          <img :src="data.coverUrl" class="cover" />
          <div class="live-badge">
            <span class="dot"></span>
            LIVE
          </div>
        </div>
        <div class="room-info">
          <h2>{{ data.anchorName }}</h2>
          <p>{{ data.roomTitle }}</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span class="stat-value">{{ formatNum(data.onlineCount) }}</span>
          <span class="stat-label">在线人数</span>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <span class="stat-value">{{ formatNum(data.likeCount) }}</span>
          <span class="stat-label">点赞</span>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <span class="stat-value">{{ formatNum(data.giftIncome) }}</span>
          <span class="stat-label">礼物收入</span>
        </div>
      </div>

      <!-- Gift List -->
      <div class="card gift-card">
        <div class="card-header">
          <h3>礼物榜单</h3>
          <span class="badge">TOP 10</span>
        </div>
        <div class="gift-list">
          <div 
            v-for="item in data.giftList" 
            :key="item.rank" 
            class="gift-item"
            :class="{ gold: item.rank === 1, silver: item.rank === 2, bronze: item.rank === 3 }"
          >
            <span class="rank">{{ item.rank }}</span>
            <img :src="item.avatar" class="avatar" />
            <div class="info">
              <span class="name">{{ item.nickname }}</span>
              <span class="gift">{{ item.giftName }} × {{ item.giftCount }}</span>
            </div>
            <span class="value">{{ formatNum(item.totalValue) }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Empty -->
    <div v-else class="empty">
      <div class="empty-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8M12 17v4"/>
        </svg>
      </div>
      <p>输入直播间链接开始查询</p>
    </div>

    <footer class="footer">
      <p>dk.live · 抖音直播数据查询</p>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap');

:root, [data-theme="dark"] {
  --bg: #0a0a0f;
  --bg-secondary: #12121a;
  --card: #18181f;
  --card-hover: #1f1f2a;
  --text: #f0f0f5;
  --text2: #8888a0;
  --accent: #6366f1;
  --accent-glow: rgba(99, 102, 241, 0.3);
  --gold: #fbbf24;
  --silver: #9ca3af;
  --bronze: #b45309;
  --gradient-1: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --gradient-2: linear-gradient(135deg, #f43f5e 0%, #f97316 100%);
}

[data-theme="light"] {
  --bg: #fafafa;
  --bg-secondary: #ffffff;
  --card: #ffffff;
  --card-hover: #f5f5f5;
  --text: #18181b;
  --text2: #71717a;
  --accent: #6366f1;
  --accent-glow: rgba(99, 102, 241, 0.15);
  --gold: #d97706;
  --silver: #6b7280;
  --bronze: #92400e;
  --gradient-1: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --gradient-2: linear-gradient(135deg, #f43f5e 0%, #f97316 100%);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Outfit', 'Noto Sans SC', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.app {
  max-width: 520px;
  margin: 0 auto;
  padding: 0 20px;
  min-height: 100vh;
  position: relative;
}

/* Background Effects */
.bg-gradient {
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 0%, var(--accent-glow) 0%, transparent 50%);
  pointer-events: none;
  z-index: -2;
}

.bg-noise {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  pointer-events: none;
  z-index: -1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* Header */
.header {
  padding: 50px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-mark {
  width: 40px;
  height: 40px;
  background: var(--gradient-1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px var(--accent-glow);
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.theme-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--card);
  border: 1px solid rgba(255,255,255,0.05);
  color: var(--text2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-btn:hover {
  background: var(--card-hover);
  color: var(--text);
  transform: rotate(15deg);
}

/* Search */
.search-section {
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  background: var(--card);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 4px 24px var(--accent-glow);
}

.search-box input {
  flex: 1;
  height: 56px;
  padding: 0 20px;
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 15px;
  font-family: inherit;
  outline: none;
}

.search-box input::placeholder {
  color: var(--text2);
}

.search-btn {
  width: 56px;
  height: 56px;
  background: var(--gradient-1);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.search-btn:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: scale(1.02);
}

.search-btn:disabled {
  opacity: 0.7;
}

.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toggle */
.toggle-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.toggle {
  position: relative;
  width: 44px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--card);
  border-radius: 24px;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: var(--text2);
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .slider {
  background: var(--accent);
}

.toggle input:checked + .slider:before {
  transform: translateX(20px);
  background: white;
}

.toggle-label {
  font-size: 14px;
  color: var(--text2);
}

.refresh-select {
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--card);
  border: 1px solid rgba(255,255,255,0.05);
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
}

/* Main */
.main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  background: var(--card);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

/* Room Card */
.room-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

.cover-wrapper {
  position: relative;
  flex-shrink: 0;
}

.cover {
  width: 100px;
  height: 70px;
  border-radius: 12px;
  object-fit: cover;
}

.live-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: rgba(0,0,0,0.7);
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  color: #ef4444;
  backdrop-filter: blur(4px);
}

.dot {
  width: 5px;
  height: 5px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.room-info h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.room-info p {
  font-size: 13px;
  color: var(--text2);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: var(--card);
  border-radius: 16px;
  padding: 20px 12px;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}

.stat-icon {
  width: 44px;
  height: 44px;
  margin: 0 auto 12px;
  background: var(--gradient-1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-value {
  display: block;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text2);
}

/* Gift Card */
.gift-card {
  padding-bottom: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  background: var(--gradient-1);
  color: white;
  border-radius: 20px;
}

.gift-list {
  max-height: 400px;
  overflow-y: auto;
}

.gift-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  transition: all 0.2s ease;
}

.gift-item:hover {
  background: var(--card-hover);
}

.gift-item.gold { 
  background: linear-gradient(90deg, rgba(251,191,36,0.1) 0%, transparent 100%);
}
.gift-item.silver { 
  background: linear-gradient(90deg, rgba(156,163,175,0.1) 0%, transparent 100%);
}
.gift-item.bronze { 
  background: linear-gradient(90deg, rgba(180,83,9,0.1) 0%, transparent 100%);
}

.rank {
  width: 24px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text2);
}

.gift-item.gold .rank { color: var(--gold); }
.gift-item.silver .rank { color: var(--silver); }
.gift-item.bronze .rank { color: var(--bronze); }

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--card);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 14px;
  font-weight: 500;
}

.gift {
  font-size: 12px;
  color: var(--text2);
}

.value {
  font-size: 15px;
  font-weight: 600;
  color: var(--accent);
}

/* Empty */
.empty {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  margin-bottom: 20px;
  color: var(--text2);
  opacity: 0.5;
}

.empty-icon svg {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty p {
  color: var(--text2);
  font-size: 15px;
}

/* Footer */
.footer {
  text-align: center;
  padding: 40px 0 30px;
}

.footer p {
  font-size: 12px;
  color: var(--text2);
}
</style>
