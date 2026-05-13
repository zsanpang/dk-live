// 直播间数据类型定义

export interface GiftItem {
  rank: number;
  avatar: string;
  nickname: string;
  giftName: string;
  giftCount: number;
  totalValue: number;
}

export interface LiveRoomData {
  roomId: string;
  anchorName: string;
  roomTitle: string;
  coverUrl: string;
  onlineCount: number;
  likeCount: number;
  giftIncome: number;
  giftList: GiftItem[];
}

export interface QueryParams {
  input: string; // 直播间链接或抖音号
  mode: 'mock' | 'real'; // 模拟数据或真实数据
}

// 模拟数据生成
export function generateMockData(input: string): LiveRoomData {
  const baseOnline = Math.floor(Math.random() * 5000) + 1000;
  const baseLikes = Math.floor(Math.random() * 100000) + 50000;
  const baseIncome = Math.floor(Math.random() * 50000) + 10000;
  
  // 模拟波动
  const fluctuate = () => (Math.random() - 0.5) * 0.1;
  
  const giftNames = ['火箭', '跑车', '城堡', '仙女棒', '小心心', '大啤酒', '花瓣', '仙女'];
  const nicknames = ['用户1234', '直播间老铁', '土豪玩家', '小明同学', '隔壁老王', '忠实粉丝', '路人甲', '爱心大使', '榜一大哥', '神秘人'];
  
  const giftList: GiftItem[] = [];
  for (let i = 0; i < 10; i++) {
    giftList.push({
      rank: i + 1,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      nickname: nicknames[i],
      giftName: giftNames[i % giftNames.length],
      giftCount: Math.floor(Math.random() * 100) + 10,
      totalValue: Math.floor(Math.random() * 10000) + 500,
    });
  }
  
  return {
    roomId: 'mock_' + Date.now(),
    anchorName: extractAnchorName(input),
    roomTitle: '直播间标题 - ' + new Date().toLocaleTimeString(),
    coverUrl: 'https://picsum.photos/400/300?random=1',
    onlineCount: Math.floor(baseOnline * (1 + fluctuate())),
    likeCount: Math.floor(baseLikes * (1 + fluctuate())),
    giftIncome: Math.floor(baseIncome * (1 + fluctuate())),
    giftList,
  };
}

// 从输入中提取主播名
function extractAnchorName(input: string): string {
  // 如果是链接，尝试提取抖音号
  if (input.includes('douyin.com')) {
    const match = input.match(/douyin\.com\/(\w+)/);
    if (match) return match[1];
  }
  // 直接返回输入作为主播名
  return input.replace(/[^a-zA-Z0-9_]/g, '') || '主播';
}

// 格式化数字
export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

// 格式化金额
export function formatMoney(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + 'w';
  }
  return num.toString();
}
