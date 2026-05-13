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
      <div class="header-actions">
        <button class="icon-btn" @click="toggleDarkMode">
          {{ darkMode ? '🌙' : '☀️' }}
        </button>
      </div>
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
          <span v-if="!loading">→</span>
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
      <span class="toggle-label">自动刷新 ({{ refreshInterval }}s)</span>
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
        <img :src="data.coverUrl" class="cover" />
        <div class="room-info">
          <h2>{{ data.anchorName }}</h2>
          <p>{{ data.roomTitle }}</p>
        </div>
        <div class="live-badge">
          <span class="dot"></span>
          LIVE
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ formatNum(data.onlineCount) }}</span>
          <span class="stat-label">在线人数</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ formatNum(data.likeCount) }}</span>
          <span class="stat-label">点赞</span>
        </div>
        <div class="stat-card">
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
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
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
:root, [data-theme="dark"] {
  --bg: #000000;
  --card: #1c1c1e;
  --card2: #2c2c2e;
  --text: #ffffff;
  --text2: #8e8e93;
  --accent: #007aff;
  --gold: #ffd60a;
  --silver: #c0c0c0;
  --bronze: #cd7f32;
}

[data-theme="light"] {
  --bg: #f2f2f7;
  --card: #ffffff;
  --card2: #e5e5ea;
  --text: #000000;
  --text2: #8e8e93;
  --accent: #007aff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.app {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 20px;
  min-height: 100vh;
}

/* Header */
.header {
  padding: 60px 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 36px;
  height: 36px;
  background: var(--text);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg);
}

.logo-text {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--card);
  border: none;
  font-size: 16px;
  cursor: pointer;
}

/* Search */
.search-section {
  margin-bottom: 16px;
}

.search-box {
  display: flex;
  background: var(--card);
  border-radius: 14px;
  overflow: hidden;
}

.search-box input {
  flex: 1;
  height: 52px;
  padding: 0 20px;
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 16px;
  outline: none;
}

.search-box input::placeholder {
  color: var(--text2);
}

.search-btn {
  width: 52px;
  height: 52px;
  background: var(--accent);
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.search-btn:disabled {
  opacity: 0.7;
}

.loading {
  display: inline-block;
  width: 18px;
  height: 18px;
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
  margin-bottom: 20px;
}

.toggle {
  position: relative;
  width: 44px;
  height: 26px;
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
  background: var(--card2);
  border-radius: 26px;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .slider {
  background: var(--accent);
}

.toggle input:checked + .slider:before {
  transform: translateX(18px);
}

.toggle-label {
  font-size: 14px;
  color: var(--text2);
}

.refresh-select {
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--card);
  border: none;
  color: var(--text);
  font-size: 12px;
}

/* Main */
.main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: var(--card);
  border-radius: 20px;
  overflow: hidden;
}

/* Room Card */
.room-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  position: relative;
}

.cover {
  width: 80px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
}

.room-info h2 {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 4px;
}

.room-info p {
  font-size: 13px;
  color: var(--text2);
}

.live-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #ff3b30;
}

.dot {
  width: 6px;
  height: 6px;
  background: #ff3b30;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
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
  padding: 20px 16px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
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
  padding: 16px;
  border-bottom: 1px solid var(--card2);
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
}

.gift-list {
  max-height: 400px;
  overflow-y: auto;
}

.gift-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.gift-item.gold { background: linear-gradient(90deg, rgba(255,214,10,0.1) 0%, transparent 100%); }
.gift-item.silver { background: linear-gradient(90deg, rgba(192,192,192,0.1) 0%, transparent 100%); }
.gift-item.bronze { background: linear-gradient(90deg, rgba(205,127,50,0.1) 0%, transparent 100%); }

.rank {
  width: 24px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text2);
}

.gift-item.gold .rank { color: var(--gold); }
.gift-item.silver .rank { color: var(--silver); }
.gift-item.bronze .rank { color: var(--bronze); }

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
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
  margin-bottom: 16px;
  color: var(--text2);
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
