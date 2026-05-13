# dk抖音直播数据查询 - 项目规格文档

## 1. 项目概述

- **项目名称**：dk抖音直播数据查询
- **项目类型**：Web 应用（移动端优先）
- **核心功能**：实时查看抖音直播间数据（在线人数、点赞、礼物榜单、收入等）
- **目标用户**：主播、运营人员、观众

## 2. UI/UX 规格

### 布局结构

- **移动端优先设计**（主要场景）
- **单页面应用**：输入 → 展示
- **底部安全区域适配**

### 页面结构

1. **首页（数据查询）**
   - 顶部 Logo + 标题
   - 输入框：支持粘贴直播间链接或主播抖音号
   - 模式切换：模拟数据 / 真实数据
   - 查询按钮

2. **数据展示页**
   - 直播间基本信息（主播名、直播间标题）
   - 核心指标卡片（在线人数、点赞数、礼物收入）
   - 礼物榜单列表
   - 实时更新指示器

### 视觉设计

#### 配色方案（健康积极）

```
--primary: #FF4757        /* 抖音红 - 主色 */
--primary-dark: #E84148   /* 抖音红深色 */
--secondary: #2ED573      /* 绿色 - 正向指标 */
--accent: #FFA502         /* 橙色 - 点赞 */
--background: #0F0F14     /* 深色背景 */
--surface: #1A1A24        /* 卡片背景 */
--surface-light: #252532 /* 输入框背景 */
--text-primary: #FFFFFF   /* 主文字 */
--text-secondary: #8E8E99 /* 次要文字 */
--border: #2D2D3A         /* 边框 */
```

#### 字体

- **主字体**：系统字体（-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif）
- **数字字体**：'SF Pro Display', 'DIN Alternate', sans-serif

#### 间距

- 页面内边距：16px
- 卡片间距：12px
- 卡片内边距：16px

#### 视觉效果

- 卡片圆角：16px
- 按钮圆角：12px
- 轻微阴影：0 4px 20px rgba(0,0,0,0.3)
- 数字变化动画：平滑过渡

### 组件

1. **输入框**
   - 大字号（18px）
   - 清空按钮
   - 粘贴按钮

2. **数据卡片**
   - 图标 + 标签 + 数值
   - 数值变化动画
   - 实时刷新指示

3. **礼物榜单**
   - 排名 + 头像 + 昵称 + 礼物价值
   - 前三名特殊样式

4. **切换开关**
   - 模拟/真实数据切换
   - 滑动动画

## 3. 功能规格

### 核心功能

1. **直播间查询**
   - 支持直播间链接输入
   - 支持抖音号输入
   - 输入验证

2. **数据展示**
   - 在线人数（实时更新）
   - 点赞数
   - 礼物收入总额
   - 礼物榜单 Top 10

3. **数据模式**
   - 模拟数据：随机生成波动数据
   - 真实数据：预留接口，可接入第三方

4. **自动刷新**
   - 每 3 秒更新一次数据
   - 刷新时显示加载状态

### 数据接口（模拟）

```typescript
interface LiveRoomData {
  roomId: string;
  anchorName: string;
  roomTitle: string;
  coverUrl: string;
  onlineCount: number;
  likeCount: number;
  giftIncome: number;
  giftList: GiftItem[];
}

interface GiftItem {
  rank: number;
  avatar: string;
  nickname: string;
  giftName: string;
  giftCount: number;
  totalValue: number;
}
```

## 4. 技术栈

- **框架**：Next.js 14 + TypeScript
- **样式**：CSS Modules + CSS 动画
- **动画**：Framer Motion
- **图标**：内置 SVG

## 5. 验收标准

- [ ] 页面在移动端显示正常
- [ ] 可以输入直播间链接或抖音号
- [ ] 模式切换正常工作
- [ ] 模拟数据显示正确且有波动动画
- [ ] 礼物榜单正确展示
- [ ] 自动刷新功能正常
- [ ] 页面美观专业
