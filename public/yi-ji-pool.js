/* ============================================================
   yi-ji-pool.js —— 宜/忌通用池子
   独立于牌义，需要时从池子里随机抽
   ============================================================ */

export const YI_POOL = [
  '睡觉',
  '赖床',
  '洗澡',
  '散步',
  '晒太阳',
  '发呆',
  '喝茶',
  '吃甜的',
  '早点下班',
  '洗衣服',
  '整理房间',
  '换个枕头套',
  '给绿萝浇水',
  '关掉通知',
  '听歌',
  '看云',
  '走楼梯',
  '记账',
  '数钱',
  '说句谢谢',
  '主动道歉',
  '请人喝奶茶',
  '拒绝一次',
  '跟人当面聊',
  '看完一集就停',
  '打游戏一小时',
  '出门买菜',
  '拍照',
  '剪指甲',
  '收拾桌面',
  '早点关灯',
  '吃顿热乎的',
  '多喝热水',
  '什么都不干'
];

export const JI_POOL = [
  '熬夜',
  '刷短视频到两点',
  '偷懒',
  '硬撑',
  '加班到很晚',
  '点第三次外卖',
  '冲动下单',
  '半夜发消息',
  '已读不回',
  '翻旧账',
  '跟人吵架',
  '空腹喝咖啡',
  '连喝三杯冰的',
  '边吃饭边看剧',
  '借钱',
  '借钱给人',
  '同时开三个坑',
  '一次改五个计划',
  '反复纠结',
  '想太多',
  '自我贬低',
  '跟人比较',
  '把话说满',
  '立 flag',
  '深夜做决定',
  '翻前任朋友圈',
  '修图修一小时',
  '空腹跑步',
  '周一提离职',
  '装懂',
  '抢话',
  '硬挤社交',
  '把手机带进厕所',
  '嘴上说没事'
];

// 从池子里随机抽 n 条不重复
function sample(pool, n) {
  const copy = [...pool];
  const out = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

// 对外接口
export function randomYi() { return YI_POOL[Math.floor(Math.random() * YI_POOL.length)]; }
export function randomJi() { return JI_POOL[Math.floor(Math.random() * JI_POOL.length)]; }
export function randomYis(n = 3) { return sample(YI_POOL, n); }
export function randomJis(n = 3) { return sample(JI_POOL, n); }
