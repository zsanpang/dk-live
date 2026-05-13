<script setup lang="ts">
import { ref } from 'vue'
import { Motion, Presence } from '@motionone/vue'

// 类型定义
interface GiftItem {
  rank: number
  avatar: string
  nickname: string
  giftName: string
  giftCount: number
  totalValue: number
}

interface LiveRoomData {
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
const mode = ref<'mock' | 'real'>('mock')
const loading = ref(false)
const data = ref<LiveRoomData | null>(null)
const prevData = ref<LiveRoomData | null>(null)

// 模拟数据生成
function generateMockData(inputVal: string): LiveRoomData {
  const baseOnline = Math.floor(Math.random() * 5000) + 1000
  const baseLikes = Math.floor(Math.random() * 100000) + 50000
  const baseIncome = Math.floor(Math.random() * 50000) + 10000
  const fluctuate = () => (Math.random() - 0.5) * 0.1

  const giftNames = ['火箭', '跑车', '城堡', '仙女棒', '小心心', '大啤酒', '花瓣', '仙女']
  const nicknames = ['用户1234', '直播间老铁', '土豪玩家', '小明同学', '隔壁老王', '忠实粉丝', '路人甲', '爱心大使', '榜一大哥', '神秘人']

  const giftList: GiftItem[] = []
  for (let i = 0; i < 10; i++) {
    giftList.push({
      rank: i + 1,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      nickname: nicknames[i],
      giftName: giftNames[i % giftNames.length],
      giftCount: Math.floor(Math.random() * 100) + 10,
      totalValue: Math.floor(Math.random() * 10000) + 500,
    })
  }

  return {
    roomId: 'mock_' + Date.now(),
    anchorName: extractAnchorName(inputVal),
    roomTitle: '直播间标题 - ' + new Date().toLocaleTimeString(),
    coverUrl: 'https://picsum.photos/400/300?random=1',
    onlineCount: Math.floor(baseOnline * (1 + fluctuate())),
    likeCount: Math.floor(baseLikes * (1 + fluctuate())),
    giftIncome: Math.floor(baseIncome * (1 + fluctuate())),
    giftList,
  }
}

function extractAnchorName(inputVal: string): string {
  if (inputVal.includes('douyin.com')) {
    const match = inputVal.match(/douyin\.com\/(\w+)/)
    if (match) return match[1]
  }
  return inputVal.replace(/[^a-zA-Z0-9_]/g, '') || '主播'
}

// 格式化
function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

function formatMoney(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(2) + 'w'
  return num.toString()
}

// 查询
async function fetchData() {
  if (!input.value.trim()) return

  if (mode.value === 'mock') {
    prevData.value = data.value
    data.value = generateMockData(input.value)
  } else {
    loading.value = true
    // TODO: 真实 API
    setTimeout(() => {
      prevData.value = data.value
      data.value = generateMockData(input.value)
      loading.value = false
    }, 1000)
  }
}

// 自动刷新
let timer: number | null = null
function startAutoRefresh() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (data.value) fetchData()
  }, 3000)
}

// 提交
function handleSubmit() {
  fetchData()
  startAutoRefresh()
}

// 粘贴
async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText()
    input.value = text
  } catch (e) {
    console.error('粘贴失败', e)
  }
}

// 清空
function handleClear() {
  input.value = ''
  data.value = null
  prevData.value = null
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 计算属性
const isUp = (current: number, prev?: number) => prev !== undefined && current > prev
const isDown = (current: number, prev?: number) => prev !== undefined && current < prev
</script>

<template>
  <div class="app">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="orb1"></div>
      <div class="orb2"></div>
    </div>

    <main class="main">
      <!-- 头部 -->
      <header class="header">
        <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }" :transition="{ duration: 0.5 }">
          <div class="logo">
            <span class="logo-icon">🎬</span>
            <h1 class="title">dk<span class="vue-inline">Vue</span>抖音直播</h1>
          </div>
        </Motion>
        <span class="vue-badge-top">Vue</span>
        <p class="subtitle">实时掌握直播间数据</p>
      </header>

      <!-- 搜索框 -->
      <Motion :initial="{ y: 20, opacity: 0 }" :animate="{ y: 0, opacity: 1 }" :transition="{ duration: 0.4, delay: 0.1 }">
        <form class="search-box" @submit.prevent="handleSubmit">
          <div class="input-wrapper">
            <input
              v-model="input"
              type="text"
              placeholder="粘贴直播间链接或输入抖音号"
              class="input"
            />
            <div class="input-actions">
              <button v-if="input" type="button" class="action-btn" @click="handleClear">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
              <button type="button" class="action-btn" @click="handlePaste">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
          </div>
          <button type="submit" class="search-btn" :disabled="loading || !input.trim()">
            {{ loading ? '查询中...' : '查询' }}
          </button>
        </form>
      </Motion>

      <!-- 模式切换 -->
      <Motion :initial="{ y: 20, opacity: 0 }" :animate="{ y: 0, opacity: 1 }" :transition="{ duration: 0.4, delay: 0.2 }">
        <div class="mode-switch">
          <span :class="{ active: mode === 'mock' }">模拟数据</span>
          <button class="switch" :class="{ on: mode === 'real' }" @click="mode = mode === 'mock' ? 'real' : 'mock'">
            <div class="handle"></div>
          </button>
          <span :class="{ active: mode === 'real' }">真实数据</span>
        </div>
      </Motion>

      <!-- 数据展示 -->
      <Presence>
        <Motion v-if="data" :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: -20 }" :transition="{ duration: 0.3 }">
          <div class="data-section">
            <!-- 直播间信息 -->
            <div class="room-info">
              <img :src="data.coverUrl" :alt="data.roomTitle" class="cover" />
              <div class="room-detail">
                <h2 class="anchor-name">{{ data.anchorName }}</h2>
                <p class="room-title">{{ data.roomTitle }}</p>
              </div>
            </div>

            <!-- 数据卡片 -->
            <div class="cards">
              <div class="card">
                <div class="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <div class="card-content">
                  <span class="label">在线人数</span>
                  <span class="value number">{{ formatNumber(data.onlineCount) }}</span>
                  <span v-if="prevData" class="change" :class="{ up: isUp(data.onlineCount, prevData?.onlineCount), down: isDown(data.onlineCount, prevData?.onlineCount) }">
                    {{ isUp(data.onlineCount, prevData?.onlineCount) ? '↑' : isDown(data.onlineCount, prevData?.onlineCount) ? '↓' : '' }}
                  </span>
                </div>
                <div class="live-indicator">
                  <span class="live-dot"></span>
                  LIVE
                </div>
              </div>

              <div class="card">
                <div class="icon-wrapper" style="background: linear-gradient(135deg, #FFA502 0%, #FF6B00 100%)">
                  <svg viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <div class="card-content">
                  <span class="label">点赞数</span>
                  <span class="value number">{{ formatNumber(data.likeCount) }}</span>
                  <span v-if="prevData" class="change" :class="{ up: isUp(data.likeCount, prevData?.likeCount), down: isDown(data.likeCount, prevData?.likeCount) }">
                    {{ isUp(data.likeCount, prevData?.likeCount) ? '↑' : isDown(data.likeCount, prevData?.likeCount) ? '↓' : '' }}
                  </span>
                </div>
              </div>

              <div class="card">
                <div class="icon-wrapper" style="background: linear-gradient(135deg, #2ED573 0%, #1DB954 100%)">
                  <svg viewBox="0 0 24 24" fill="white"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>
                </div>
                <div class="card-content">
                  <span class="label">礼物收入</span>
                  <span class="value number">{{ formatMoney(data.giftIncome) }}</span>
                  <span v-if="prevData" class="change" :class="{ up: isUp(data.giftIncome, prevData?.giftIncome), down: isDown(data.giftIncome, prevData?.giftIncome) }">
                    {{ isUp(data.giftIncome, prevData?.giftIncome) ? '↑' : isDown(data.giftIncome, prevData?.giftIncome) ? '↓' : '' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 礼物榜单 -->
            <div class="gift-list">
              <div class="gift-header">
                <h3>礼物榜单</h3>
                <span class="badge">TOP 10</span>
              </div>
              <div class="gift-items">
                <Motion
                  v-for="(item, index) in data.giftList"
                  :key="item.rank"
                  :initial="{ opacity: 0, x: -20 }"
                  :animate="{ opacity: 1, x: 0 }"
                  :transition="{ duration: 0.3, delay: index * 0.05 }"
                >
                  <div class="gift-item" :class="{ gold: item.rank === 1, silver: item.rank === 2, bronze: item.rank === 3 }">
                    <div class="rank">
                      <span v-if="item.rank <= 3">🏅</span>
                      <span v-else class="rank-num">{{ item.rank }}</span>
                    </div>
                    <img :src="item.avatar" :alt="item.nickname" class="avatar" />
                    <div class="info">
                      <span class="nickname">{{ item.nickname }}</span>
                      <span class="gift-info">送出 <strong>{{ item.giftName }}</strong> × {{ item.giftCount }}</span>
                    </div>
                    <div class="value">
                      <span class="value-num number">{{ formatNumber(item.totalValue) }}</span>
                      <span class="value-unit">币</span>
                    </div>
                  </div>
                </Motion>
              </div>
            </div>

            <!-- 刷新提示 -->
            <div class="refresh-tip">
              <span class="refresh-dot"></span>
              每3秒自动刷新
            </div>
          </div>
        </Motion>
      </Presence>

      <!-- 空状态 -->
      <Motion v-if="!data" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ delay: 0.3 }">
        <div class="empty">
          <div class="empty-icon">📊</div>
          <p>输入直播间链接或抖音号开始查询</p>
        </div>
      </Motion>
    </main>

    <footer class="footer">
      <p>© 2024 dk抖音直播数据查询</p>
    </footer>
  </div>
</template>

<style>
:root {
  --primary: #FF4757;
  --primary-dark: #E84148;
  --secondary: #2ED573;
  --accent: #FFA502;
  --background: #0F0F14;
  --surface: #1A1A24;
  --surface-light: #252532;
  --text-primary: #FFFFFF;
  --text-secondary: #8E8E99;
  --border: #2D2D3A;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--background);
  color: var(--text-primary);
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.orb1 {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 71, 87, 0.2) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  filter: blur(60px);
  animation: float 8s ease-in-out infinite;
}

.orb2 {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(46, 213, 115, 0.15) 0%, transparent 70%);
  bottom: 100px;
  left: -50px;
  filter: blur(50px);
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 30px); }
}

.main {
  flex: 1;
  padding: 24px 16px;
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.logo-icon {
  font-size: 36px;
}

.vue-badge {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.vue-inline {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.title {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary) 0%, #FF6B7A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.input-wrapper {
  flex: 1;
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.input-wrapper:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.1);
}

.input {
  flex: 1;
  height: 48px;
  font-size: 16px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  outline: none;
}

.input::placeholder {
  color: var(--text-secondary);
}

.input-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--surface-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  border: none;
  cursor: pointer;
}

.action-btn:hover {
  background: var(--border);
  color: var(--text-primary);
}

.search-btn {
  height: 48px;
  padding: 0 24px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  border: none;
  cursor: pointer;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.4);
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mode-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.mode-switch span {
  font-size: 13px;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.mode-switch span.active {
  color: var(--text-primary);
  font-weight: 500;
}

.switch {
  width: 52px;
  height: 28px;
  border-radius: 14px;
  background: var(--surface-light);
  position: relative;
  cursor: pointer;
  border: 1px solid var(--border);
}

.switch.on {
  background: var(--primary);
  border-color: var(--primary);
}

.handle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.switch.on .handle {
  transform: translateX(24px);
}

.data-section {
  margin-top: 24px;
}

.room-info {
  display: flex;
  gap: 16px;
  background: var(--surface);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border);
}

.cover {
  width: 100px;
  height: 75px;
  border-radius: 12px;
  object-fit: cover;
  background: var(--surface-light);
}

.room-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.anchor-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.room-title {
  font-size: 13px;
  color: var(--text-secondary);
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.card {
  background: var(--surface);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--border);
  position: relative;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper svg {
  width: 24px;
  height: 24px;
}

.card-content {
  flex: 1;
}

.label {
  font-size: 13px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 4px;
}

.value {
  font-size: 24px;
  font-weight: 700;
}

.number {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.change {
  font-size: 14px;
  margin-left: 6px;
}

.change.up { color: var(--secondary); }
.change.down { color: var(--primary); }

.live-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  color: var(--primary);
  background: rgba(255, 71, 87, 0.15);
  padding: 4px 8px;
  border-radius: 20px;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.gift-list {
  background: var(--surface);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.gift-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.gift-header h3 {
  font-size: 16px;
}

.badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  background: rgba(255, 165, 2, 0.15);
  padding: 4px 10px;
  border-radius: 20px;
}

.gift-items {
  max-height: 400px;
  overflow-y: auto;
}

.gift-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.gift-item:last-child {
  border-bottom: none;
}

.gift-item.gold {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, transparent 100%);
}

.gift-item.silver {
  background: linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, transparent 100%);
}

.gift-item.bronze {
  background: linear-gradient(90deg, rgba(205, 127, 50, 0.1) 0%, transparent 100%);
}

.rank {
  width: 28px;
  text-align: center;
}

.rank-num {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface-light);
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nickname {
  font-size: 14px;
  font-weight: 500;
}

.gift-info {
  font-size: 12px;
  color: var(--text-secondary);
}

.gift-info strong {
  color: var(--primary);
  font-weight: 600;
}

.value {
  text-align: right;
}

.value-num {
  font-size: 16px;
  font-weight: 700;
  color: var(--accent);
}

.value-unit {
  font-size: 11px;
  color: var(--text-secondary);
  margin-left: 2px;
}

.refresh-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 16px;
  padding: 8px;
  background: var(--surface);
  border-radius: 20px;
}

.refresh-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--secondary);
  animation: pulse 1.5s ease-in-out infinite;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.footer {
  text-align: center;
  padding: 20px;
  color: var(--text-secondary);
  font-size: 12px;
}

@media (max-width: 480px) {
  .title { font-size: 24px; }
  .search-box { flex-direction: column; }
  .search-btn { width: 100%; }
}
</style>
