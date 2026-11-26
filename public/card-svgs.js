// ============================================================
// 塔罗牌 · 纯 SVG 插画库
// 所有 SVG 用 stroke="currentColor" + fill="none"（或少量 currentColor 填充）
// 由 CSS 控制最终颜色（金色线条 + 深色底）
// 每张 viewBox 统一 "0 0 120 192"
// ============================================================

// ---------- 通用样式 ----------
// 每张 SVG 都会注入这些 attrs，保证风格一致
const SVG_WRAP = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 120 192',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
};

function wrap(inner, extra = '') {
  const attrs = Object.entries(SVG_WRAP)
    .map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<svg ${attrs} ${extra}>${inner}</svg>`;
}

// ============================================================
// 22 张大阿卡纳 · 每张独立插画
// ============================================================

export function svgMajor(rank) {
  const f = MAJOR_SVGS[rank];
  if (f) return f();
  return MAJOR_SVGS['0'](); // fallback
}

const MAJOR_SVGS = {

  // ---- 0 愚者 ----
  '0': () => wrap(`
    <!-- 太阳 / 光环 -->
    <circle cx="60" cy="28" r="14" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="60" cy="28" r="20" fill="none" stroke="currentColor" stroke-width="0.6" stroke-dasharray="2 2"/>
    <!-- 人物 -->
    <circle cx="60" cy="52" r="7" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M54 59 Q60 72 56 92" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M66 59 Q60 72 64 92" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M56 92 L52 130" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M64 92 L68 130" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <!-- 背包 -->
    <ellipse cx="48" cy="72" rx="6" ry="9" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 手杖 -->
    <line x1="72" y1="60" x2="86" y2="110" stroke="currentColor" stroke-width="1.2"/>
    <!-- 悬崖 / 地平线 -->
    <path d="M10 140 Q60 148 110 140" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <path d="M55 140 L60 135 L65 140" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <!-- 小狗 -->
    <circle cx="38" cy="136" r="2.5" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <line x1="38" y1="138" x2="38" y2="142" stroke="currentColor" stroke-width="0.6"/>
  `, 'stroke="currentColor"'),

  // ---- I 魔术师 ----
  'I': () => wrap(`
    <!-- 帽子 -->
    <path d="M46 48 L60 18 L74 48 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M42 48 L78 48" stroke="currentColor" stroke-width="1.3"/>
    <!-- 脸 -->
    <circle cx="60" cy="60" r="7" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 身体 -->
    <path d="M46 68 L44 110 L76 110 L74 68 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 举起的双臂 -->
    <path d="M46 72 L30 54" stroke="currentColor" stroke-width="1.4"/>
    <path d="M74 72 L90 54" stroke="currentColor" stroke-width="1.4"/>
    <!-- 魔杖 -->
    <line x1="90" y1="22" x2="90" y2="60" stroke="currentColor" stroke-width="1.5"/>
    <!-- 魔法符号 -->
    <circle cx="90" cy="20" r="3" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <!-- 桌面 -->
    <line x1="26" y1="112" x2="94" y2="112" stroke="currentColor" stroke-width="1.3"/>
    <!-- 桌上四件法器（权杖/圣杯/宝剑/星币） -->
    <line x1="34" y1="108" x2="34" y2="96" stroke="currentColor" stroke-width="1"/>
    <circle cx="34" cy="92" r="2" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <path d="M50 108 Q46 100 50 94 Q54 100 50 108 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <line x1="70" y1="108" x2="70" y2="94" stroke="currentColor" stroke-width="1"/>
    <path d="M66 98 L70 94 L74 98 L70 104 Z" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <circle cx="86" cy="100" r="4" fill="none" stroke="currentColor" stroke-width="1"/>
    <line x1="82" y1="100" x2="90" y2="100" stroke="currentColor" stroke-width="0.6"/>
  `, 'stroke="currentColor"'),

  // ---- II 女祭司 ----
  'II': () => wrap(`
    <!-- 月亮 -->
    <path d="M70 28 A12 12 0 1 0 70 52 A10 10 0 1 1 70 28 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 两根柱子 -->
    <rect x="24" y="60" width="8" height="80" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <rect x="88" y="60" width="8" height="80" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <line x1="20" y1="60" x2="40" y2="60" stroke="currentColor" stroke-width="1"/>
    <line x1="20" y1="140" x2="40" y2="140" stroke="currentColor" stroke-width="1"/>
    <line x1="80" y1="60" x2="100" y2="60" stroke="currentColor" stroke-width="1"/>
    <line x1="80" y1="140" x2="100" y2="140" stroke="currentColor" stroke-width="1"/>
    <!-- 人物 -->
    <circle cx="60" cy="78" r="7" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 兜帽 -->
    <path d="M50 74 Q60 46 70 74" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 身体/长袍 -->
    <path d="M48 86 Q60 92 72 86 L76 140 L44 140 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 卷轴 -->
    <rect x="52" y="102" width="16" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1"/>
    <line x1="52" y1="112" x2="68" y2="112" stroke="currentColor" stroke-width="0.6"/>
    <line x1="54" y1="108" x2="66" y2="108" stroke="currentColor" stroke-width="0.4"/>
  `, 'stroke="currentColor"'),

  // ---- III 女皇 ----
  'III': () => wrap(`
    <!-- 头顶星 -->
    <path d="M60 14 L62 20 L68 20 L63 24 L65 30 L60 26 L55 30 L57 24 L52 20 L58 20 Z" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
    <!-- 头 -->
    <circle cx="60" cy="40" r="8" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 皇冠 -->
    <path d="M50 36 L54 28 L58 34 L60 26 L62 34 L66 28 L70 36" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 身体/长袍 -->
    <path d="M44 50 Q60 56 76 50 L80 130 L40 130 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 肚子（怀孕） -->
    <ellipse cx="60" cy="90" rx="14" ry="16" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>
    <!-- 玫瑰 -->
    <circle cx="32" cy="140" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M32 140 L28 136 M32 140 L36 136 M32 140 L28 144 M32 140 L36 144" stroke="currentColor" stroke-width="0.6"/>
    <circle cx="88" cy="140" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M88 140 L84 136 M88 140 L92 136 M88 140 L84 144 M88 140 L92 144" stroke="currentColor" stroke-width="0.6"/>
    <!-- 藤蔓 -->
    <path d="M10 180 Q30 150 32 145" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <path d="M110 180 Q90 150 88 145" fill="none" stroke="currentColor" stroke-width="0.8"/>
  `, 'stroke="currentColor"'),

  // ---- IV 皇帝 ----
  'IV': () => wrap(`
    <!-- 皇冠 -->
    <path d="M46 28 L50 20 L56 26 L60 16 L64 26 L70 20 L74 28 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 头 -->
    <circle cx="60" cy="46" r="8" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 王座 -->
    <rect x="26" y="56" width="68" height="72" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M26 56 L26 40 L34 40 L34 56" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M94 56 L94 40 L86 40 L86 56" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 人物坐在王座上 -->
    <path d="M48 56 Q60 60 72 56 L74 96 L46 96 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 权杖 -->
    <line x1="32" y1="128" x2="32" y2="46" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="32" cy="44" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 圆球 -->
    <circle cx="88" cy="112" r="5" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 基座 -->
    <rect x="18" y="128" width="84" height="6" fill="none" stroke="currentColor" stroke-width="1.2"/>
  `, 'stroke="currentColor"'),

  // ---- V 教皇 ----
  'V': () => wrap(`
    <!-- 三角（三位一体） -->
    <path d="M60 18 L48 38 L72 38 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 教皇帽 -->
    <path d="M48 46 L72 46 L70 56 L50 56 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 脸 -->
    <circle cx="60" cy="64" r="8" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 胡须 -->
    <path d="M52 72 Q60 90 68 72" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 长袍 -->
    <path d="M44 74 Q60 80 76 74 L80 140 L40 140 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 胸前十字 -->
    <line x1="60" y1="92" x2="60" y2="108" stroke="currentColor" stroke-width="1.2"/>
    <line x1="54" y1="100" x2="66" y2="100" stroke="currentColor" stroke-width="1.2"/>
    <!-- 两侧两个人 -->
    <circle cx="28" cy="86" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M24 92 L22 130 L34 130 L32 92 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <circle cx="92" cy="86" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M88 92 L86 130 L98 130 L96 92 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 地面 -->
    <line x1="10" y1="140" x2="110" y2="140" stroke="currentColor" stroke-width="1"/>
  `, 'stroke="currentColor"'),

  // ---- VI 恋人 ----
  'VI': () => wrap(`
    <!-- 天使 / 丘比特 -->
    <circle cx="60" cy="24" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M48 22 Q60 14 72 22" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M54 30 L48 38 M66 30 L72 38" stroke="currentColor" stroke-width="1"/>
    <!-- 弓 -->
    <path d="M40 30 Q36 44 40 58" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <line x1="40" y1="26" x2="40" y2="62" stroke="currentColor" stroke-width="0.6"/>
    <!-- 树 -->
    <path d="M60 140 L60 70" stroke="currentColor" stroke-width="1.3"/>
    <circle cx="60" cy="60" r="16" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="50" cy="54" r="10" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <circle cx="70" cy="54" r="10" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <!-- 左边的人 -->
    <circle cx="40" cy="96" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M34 104 L32 140 L48 140 L46 104 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 右边的人 -->
    <circle cx="80" cy="96" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M74 104 L72 140 L88 140 L86 104 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 连接爱心 -->
    <path d="M56 82 Q60 90 64 82 Q68 76 64 78 Q60 82 56 78 Q52 76 56 82 Z" fill="none" stroke="currentColor" stroke-width="1"/>
  `, 'stroke="currentColor"'),

  // ---- VII 战车 ----
  'VII': () => wrap(`
    <!-- 两匹马 -->
    <path d="M14 120 Q10 100 18 90 L26 92 L26 130 L18 130 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="20" cy="88" r="3" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M106 120 Q110 100 102 90 L94 92 L94 130 L102 130 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="100" cy="88" r="3" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 车 -->
    <rect x="30" y="86" width="60" height="44" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <circle cx="38" cy="138" r="8" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="82" cy="138" r="8" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 武士 -->
    <circle cx="60" cy="66" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 头盔 -->
    <path d="M52 62 L60 44 L68 62" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M52 62 L68 62" stroke="currentColor" stroke-width="1"/>
    <!-- 身体 -->
    <path d="M52 72 L50 94 L70 94 L68 72 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 缰绳 -->
    <path d="M50 76 L30 90 M70 76 L90 90" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <!-- 旗帜 -->
    <path d="M60 44 L60 20" stroke="currentColor" stroke-width="1.2"/>
    <path d="M60 20 L78 24 L60 30" fill="none" stroke="currentColor" stroke-width="1"/>
  `, 'stroke="currentColor"'),

  // ---- VIII 力量 ----
  'VIII': () => wrap(`
    <!-- 女人 -->
    <circle cx="44" cy="60" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 头带 -->
    <path d="M38 56 L50 56" stroke="currentColor" stroke-width="1.2"/>
    <path d="M44 50 L46 44 M44 50 L42 44" stroke="currentColor" stroke-width="0.8"/>
    <!-- 身体 -->
    <path d="M36 68 Q44 74 52 68 L50 130 L38 130 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 手臂举起 -->
    <path d="M52 72 L70 54" stroke="currentColor" stroke-width="1.4"/>
    <!-- 头 -->
    <circle cx="44" cy="58" r="7" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 狮子 -->
    <path d="M56 110 Q60 88 72 86 L90 92 L92 120 Q88 140 72 142 L58 136 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 狮子鬃毛 -->
    <path d="M72 86 Q68 80 72 74 Q76 80 72 86" fill="none" stroke="currentColor" stroke-width="1"/>
    <circle cx="74" cy="96" r="4" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 爱心 -->
    <path d="M48 90 Q52 86 56 90 Q60 94 56 98 Q52 102 48 98 Q44 94 48 90 Z" fill="none" stroke="currentColor" stroke-width="1"/>
  `, 'stroke="currentColor"'),

  // ---- IX 隐士 ----
  'IX': () => wrap(`
    <!-- 星星 -->
    <path d="M90 20 L92 26 L98 26 L93 30 L95 36 L90 32 L85 36 L87 30 L82 26 L88 26 Z" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
    <!-- 老人头 -->
    <circle cx="60" cy="60" r="8" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 兜帽 -->
    <path d="M50 54 Q60 30 70 54" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 胡须 -->
    <path d="M52 68 Q60 84 68 68" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 身体 -->
    <path d="M48 72 Q60 80 72 72 L76 150 L44 150 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 灯笼 -->
    <line x1="78" y1="78" x2="84" y2="78" stroke="currentColor" stroke-width="1"/>
    <rect x="82" y="78" width="10" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="87" cy="87" r="3" fill="currentColor" stroke="currentColor" stroke-width="0.8" opacity="0.6"/>
    <!-- 光 -->
    <line x1="87" y1="82" x2="87" y2="68" stroke="currentColor" stroke-width="0.5" opacity="0.5" stroke-dasharray="2 2"/>
    <line x1="87" y1="94" x2="87" y2="110" stroke="currentColor" stroke-width="0.5" opacity="0.5" stroke-dasharray="2 2"/>
    <line x1="78" y1="87" x2="64" y2="87" stroke="currentColor" stroke-width="0.5" opacity="0.5" stroke-dasharray="2 2"/>
    <line x1="96" y1="87" x2="110" y2="87" stroke="currentColor" stroke-width="0.5" opacity="0.5" stroke-dasharray="2 2"/>
    <!-- 手杖 -->
    <line x1="38" y1="150" x2="42" y2="90" stroke="currentColor" stroke-width="1.2"/>
  `, 'stroke="currentColor"'),

  // ---- X 命运之轮 ----
  'X': () => wrap(`
    <!-- 中心轮 -->
    <circle cx="60" cy="96" r="46" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="60" cy="96" r="36" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 2"/>
    <circle cx="60" cy="96" r="16" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 八个辐条 -->
    <line x1="60" y1="50" x2="60" y2="142" stroke="currentColor" stroke-width="0.8"/>
    <line x1="14" y1="96" x2="106" y2="96" stroke="currentColor" stroke-width="0.8"/>
    <line x1="28" y1="64" x2="92" y2="128" stroke="currentColor" stroke-width="0.6"/>
    <line x1="92" y1="64" x2="28" y2="128" stroke="currentColor" stroke-width="0.6"/>
    <!-- 四角（四字母 T O T E 象征四方守护） -->
    <text x="60" y="44" text-anchor="middle" fill="currentColor" stroke="none" font-size="8" font-family="serif">T</text>
    <text x="60" y="156" text-anchor="middle" fill="currentColor" stroke="none" font-size="8" font-family="serif">E</text>
    <text x="14" y="100" text-anchor="middle" fill="currentColor" stroke="none" font-size="8" font-family="serif">O</text>
    <text x="106" y="100" text-anchor="middle" fill="currentColor" stroke="none" font-size="8" font-family="serif">T</text>
    <!-- 蛇（左下） -->
    <path d="M20 160 Q30 150 26 140 Q22 130 32 126" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 阿努比斯（右上升） -->
    <path d="M92 40 Q88 60 82 74" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="92" cy="38" r="4" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 斯芬克斯（顶部） -->
    <path d="M50 30 Q60 24 70 30 L72 40 L48 40 Z" fill="none" stroke="currentColor" stroke-width="1"/>
  `, 'stroke="currentColor"'),

  // ---- XI 正义 ----
  'XI': () => wrap(`
    <!-- 剑 -->
    <line x1="28" y1="20" x2="28" y2="100" stroke="currentColor" stroke-width="1.5"/>
    <path d="M20 24 L28 10 L36 24 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <line x1="22" y1="100" x2="34" y2="100" stroke="currentColor" stroke-width="1.3"/>
    <line x1="28" y1="100" x2="28" y2="108" stroke="currentColor" stroke-width="1.2"/>
    <!-- 天平 -->
    <line x1="88" y1="58" x2="88" y2="130" stroke="currentColor" stroke-width="1.3"/>
    <line x1="70" y1="70" x2="106" y2="70" stroke="currentColor" stroke-width="1"/>
    <path d="M70 70 L64 92 L76 92 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M106 70 L100 92 L112 92 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 蒙眼人物 -->
    <circle cx="60" cy="52" r="8" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <rect x="50" y="48" width="20" height="4" fill="currentColor" opacity="0.7"/>
    <!-- 身体 -->
    <path d="M46 60 Q60 66 74 60 L78 148 L42 148 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 手臂 -->
    <path d="M46 70 L34 62" stroke="currentColor" stroke-width="1.3"/>
    <path d="M74 70 L86 62" stroke="currentColor" stroke-width="1.3"/>
    <!-- 基座 -->
    <rect x="14" y="148" width="92" height="6" fill="none" stroke="currentColor" stroke-width="1"/>
  `, 'stroke="currentColor"'),

  // ---- XII 倒吊人 ----
  'XII': () => wrap(`
    <!-- 横梁 -->
    <line x1="10" y1="24" x2="110" y2="24" stroke="currentColor" stroke-width="2"/>
    <!-- 绳子 -->
    <line x1="42" y1="24" x2="42" y2="48" stroke="currentColor" stroke-width="1"/>
    <!-- 头（朝下） -->
    <circle cx="42" cy="56" r="7" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 身体（倒过来） -->
    <path d="M36 64 Q42 80 48 64 L46 110 L38 110 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 手臂交叉（在上） -->
    <path d="M46 66 L60 72 M38 66 L24 72" stroke="currentColor" stroke-width="1.3"/>
    <!-- 腿弯曲 -->
    <path d="M38 110 Q36 128 42 134 Q48 128 46 110" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 光环 -->
    <circle cx="42" cy="56" r="14" fill="none" stroke="currentColor" stroke-width="0.6" stroke-dasharray="2 2"/>
    <!-- 右侧休息（地面/山） -->
    <path d="M70 160 Q80 150 90 160 Q100 146 110 160" fill="none" stroke="currentColor" stroke-width="1"/>
  `, 'stroke="currentColor"'),

  // ---- XIII 死神 ----
  'XIII': () => wrap(`
    <!-- 骷髅头 -->
    <circle cx="60" cy="56" r="14" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="54" cy="54" r="3" fill="currentColor"/>
    <circle cx="66" cy="54" r="3" fill="currentColor"/>
    <path d="M58 62 L60 66 L62 62" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 兜帽 -->
    <path d="M44 48 Q60 18 76 48 L76 54 Q60 32 44 54 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 长袍 -->
    <path d="M42 68 Q60 76 78 68 L90 160 L30 160 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 手持镰刀 -->
    <path d="M70 120 Q100 110 108 80" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="70" y1="120" x2="60" y2="150" stroke="currentColor" stroke-width="1.3"/>
    <!-- 白玫瑰 -->
    <circle cx="32" cy="170" r="4" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M32 170 L28 166 M32 170 L36 166 M32 170 L28 174 M32 170 L36 174" stroke="currentColor" stroke-width="0.6"/>
    <!-- 旗子 -->
    <path d="M60 148 L60 100" stroke="currentColor" stroke-width="1.2"/>
    <path d="M60 100 L74 104 L60 112 Z" fill="none" stroke="currentColor" stroke-width="1"/>
  `, 'stroke="currentColor"'),

  // ---- XIV 节制 ----
  'XIV': () => wrap(`
    <!-- 天使头 -->
    <circle cx="60" cy="48" r="7" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 翅膀 -->
    <path d="M48 40 Q36 24 26 40 Q36 44 48 48" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M72 40 Q84 24 94 40 Q84 44 72 48" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 身体 -->
    <path d="M48 56 Q60 62 72 56 L74 140 L46 140 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 上方圣杯 -->
    <path d="M38 66 L32 86 L44 86 L38 66 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 水流 -->
    <path d="M38 86 Q44 100 48 114" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M42 88 Q48 102 52 116" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <!-- 下方圣杯 -->
    <path d="M54 114 L48 134 L60 134 L54 114 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 脚 -->
    <line x1="52" y1="140" x2="50" y2="152" stroke="currentColor" stroke-width="1.2"/>
    <line x1="68" y1="140" x2="70" y2="152" stroke="currentColor" stroke-width="1.2"/>
    <!-- 地面 -->
    <path d="M10 160 Q60 168 110 160" fill="none" stroke="currentColor" stroke-width="0.8"/>
  `, 'stroke="currentColor"'),

  // ---- XV 恶魔 ----
  'XV': () => wrap(`
    <!-- 角 -->
    <path d="M44 30 L40 14 L52 24" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M76 30 L80 14 L68 24" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 头 -->
    <circle cx="60" cy="46" r="12" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <!-- 眼睛 -->
    <circle cx="55" cy="44" r="2" fill="currentColor"/>
    <circle cx="65" cy="44" r="2" fill="currentColor"/>
    <!-- 嘴 -->
    <path d="M52 54 Q60 58 68 54" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 身体 -->
    <path d="M46 58 Q60 66 74 58 L78 130 L42 130 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 倒转的五芒星（在腹部） -->
    <path d="M52 90 L68 90 L60 104 L50 98 L70 98 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 脚下两个人 -->
    <circle cx="28" cy="136" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M24 142 L22 160 L34 160 L32 142 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <circle cx="92" cy="136" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M88 142 L86 160 L98 160 L96 142 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 锁链 -->
    <path d="M34 136 L42 130 M86 136 L78 130" stroke="currentColor" stroke-width="0.8"/>
    <circle cx="34" cy="136" r="2" fill="none" stroke="currentColor" stroke-width="0.6"/>
    <circle cx="86" cy="136" r="2" fill="none" stroke="currentColor" stroke-width="0.6"/>
  `, 'stroke="currentColor"'),

  // ---- XVI 塔 ----
  'XVI': () => wrap(`
    <!-- 闪电 -->
    <path d="M58 10 L48 40 L56 40 L44 78 L54 44 L46 44 L62 10" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <!-- 塔（被击毁） -->
    <path d="M46 62 L74 62 L76 80 L74 80 L74 130 L46 130 L44 80 L46 80 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 窗户 -->
    <rect x="52" y="78" width="6" height="10" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <rect x="62" y="78" width="6" height="10" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <rect x="52" y="100" width="6" height="10" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <rect x="62" y="100" width="6" height="10" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <!-- 被击中的顶部 -->
    <path d="M46 62 L50 48 L54 58 L60 44 L66 58 L70 48 L74 62" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 掉落的人 -->
    <circle cx="30" cy="86" r="4" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M26 90 L22 110" fill="none" stroke="currentColor" stroke-width="1"/>
    <circle cx="90" cy="90" r="4" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M94 94 L98 114" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 地面 -->
    <path d="M10 130 Q60 136 110 130" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <!-- 火花 -->
    <path d="M54 52 L50 44 M62 52 L66 44 M58 62 L58 54" stroke="currentColor" stroke-width="0.6"/>
  `, 'stroke="currentColor"'),

  // ---- XVII 星星 ----
  'XVII': () => wrap(`
    <!-- 大星（7角） -->
    <path d="M90 14 L93 22 L102 22 L95 28 L98 36 L90 30 L82 36 L85 28 L78 22 L87 22 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 小星 -->
    <circle cx="20" cy="24" r="2" fill="currentColor"/>
    <circle cx="32" cy="14" r="1.5" fill="currentColor"/>
    <circle cx="110" cy="50" r="2" fill="currentColor"/>
    <circle cx="14" cy="60" r="1.5" fill="currentColor"/>
    <!-- 女人 -->
    <circle cx="60" cy="50" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 头发 -->
    <path d="M54 46 Q60 32 66 46" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 身体（跪坐） -->
    <path d="M52 58 Q60 66 68 58 L70 92 L50 92 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 右臂举杯倒水 -->
    <path d="M68 66 L96 54" stroke="currentColor" stroke-width="1.3"/>
    <!-- 左手举杯 -->
    <path d="M52 66 L26 100" stroke="currentColor" stroke-width="1.3"/>
    <!-- 右手杯 -->
    <path d="M92 50 L86 68 L100 68 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 水流 -->
    <path d="M92 68 Q98 86 104 104" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 左手杯 -->
    <path d="M22 96 L16 114 L30 114 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 腿 -->
    <path d="M52 92 Q48 110 42 116" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M68 92 Q72 108 78 114" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 水 -->
    <path d="M14 120 Q60 128 110 120" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <!-- 花 -->
    <circle cx="38" cy="128" r="3" fill="none" stroke="currentColor" stroke-width="0.8"/>
  `, 'stroke="currentColor"'),

  // ---- XVIII 月亮 ----
  'XVIII': () => wrap(`
    <!-- 月亮 -->
    <circle cx="60" cy="44" r="24" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <!-- 月亮内画脸 -->
    <circle cx="52" cy="40" r="1.5" fill="currentColor"/>
    <circle cx="68" cy="40" r="1.5" fill="currentColor"/>
    <path d="M52 52 Q60 48 68 52" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <!-- 远山 -->
    <path d="M10 120 Q24 96 40 120" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M80 120 Q96 92 110 120" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 两只狗 -->
    <circle cx="38" cy="118" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M36 122 L36 134 L42 134" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M34 114 L30 108 M42 114 L46 108" stroke="currentColor" stroke-width="0.6"/>
    <circle cx="82" cy="118" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M80 122 L80 134 L86 134" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M78 114 L74 108 M86 114 L90 108" stroke="currentColor" stroke-width="0.6"/>
    <!-- 龙虾/螃蟹 -->
    <ellipse cx="60" cy="150" rx="6" ry="4" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M54 148 L48 144 M66 148 L72 144 M56 154 L52 160 M64 154 L68 160" stroke="currentColor" stroke-width="0.8"/>
    <!-- 小径 -->
    <path d="M60 120 Q56 134 60 144" fill="none" stroke="currentColor" stroke-width="0.6" stroke-dasharray="2 2"/>
    <!-- 小塔 -->
    <rect x="4" y="120" width="10" height="20" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <rect x="106" y="120" width="10" height="20" fill="none" stroke="currentColor" stroke-width="0.8"/>
  `, 'stroke="currentColor"'),

  // ---- XIX 太阳 ----
  'XIX': () => wrap(`
    <!-- 太阳（大圆 + 光芒） -->
    <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" stroke-width="0.6" stroke-dasharray="3 3"/>
    <!-- 12 道光芒 -->
    <g stroke="currentColor" stroke-width="1.2">
      <line x1="60" y1="26" x2="60" y2="10"/>
      <line x1="60" y1="110" x2="60" y2="126"/>
      <line x1="22" y1="60" x2="6" y2="60"/>
      <line x1="98" y1="60" x2="114" y2="60"/>
      <line x1="34" y1="34" x2="24" y2="24"/>
      <line x1="86" y1="86" x2="96" y2="96"/>
      <line x1="34" y1="86" x2="24" y2="96"/>
      <line x1="86" y1="34" x2="96" y2="24"/>
      <line x1="48" y1="28" x2="42" y2="16"/>
      <line x1="72" y1="28" x2="78" y2="16"/>
      <line x1="48" y1="92" x2="42" y2="104"/>
      <line x1="72" y1="92" x2="78" y2="104"/>
    </g>
    <!-- 小孩骑白马上 -->
    <circle cx="60" cy="96" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 花环 -->
    <path d="M54 92 Q60 84 66 92" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 马 -->
    <path d="M40 120 Q32 110 28 110 L22 130 L28 140 L36 136 L40 140 L52 140 L56 128 L68 128 L72 140 L84 140 L88 136 L96 140 L100 130 L94 110 Q84 110 80 120 Q70 116 60 120 Q50 116 40 120 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 挥舞的旗 -->
    <line x1="68" y1="112" x2="88" y2="88" stroke="currentColor" stroke-width="1"/>
    <path d="M88 88 Q96 84 94 94 Q88 92 88 88" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 地面 -->
    <path d="M10 160 Q60 168 110 160" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <!-- 向日葵 -->
    <circle cx="22" cy="156" r="4" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <line x1="22" y1="160" x2="22" y2="170" stroke="currentColor" stroke-width="0.6"/>
  `, 'stroke="currentColor"'),

  // ---- XX 审判 ----
  'XX': () => wrap(`
    <!-- 云 -->
    <path d="M10 40 Q20 30 32 34 Q40 24 54 32 Q66 24 78 34 Q90 30 100 40 Q100 46 90 46 L20 46 Q10 46 10 40 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 天使 -->
    <circle cx="60" cy="58" r="8" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 翅膀 -->
    <path d="M46 50 Q24 42 16 60 Q32 60 46 64" fill="none" stroke="currentColor" stroke-width="1.1"/>
    <path d="M74 50 Q96 42 104 60 Q88 60 74 64" fill="none" stroke="currentColor" stroke-width="1.1"/>
    <!-- 身体 -->
    <path d="M50 66 Q60 72 70 66 L72 100 L48 100 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 号角 -->
    <path d="M70 80 Q100 76 100 60 Q88 66 70 80" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 号角声 -->
    <path d="M100 54 Q106 50 108 44 M100 62 Q108 64 110 72 M100 68 Q106 72 106 80" fill="none" stroke="currentColor" stroke-width="0.6"/>
    <!-- 打开的棺材 / 复活的人 -->
    <path d="M26 120 L94 120 L88 160 L32 160 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <!-- 左边复活 -->
    <circle cx="42" cy="136" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M38 142 L36 158 L48 158 L46 142 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 中间复活 -->
    <circle cx="60" cy="132" r="6" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M54 140 L52 158 L68 158 L66 140 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 右边复活 -->
    <circle cx="78" cy="136" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M74 142 L72 158 L84 158 L82 142 Z" fill="none" stroke="currentColor" stroke-width="1"/>
  `, 'stroke="currentColor"'),

  // ---- XXI 世界 ----
  'XXI': () => wrap(`
    <!-- 花环（椭圆） -->
    <ellipse cx="60" cy="96" rx="46" ry="64" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <ellipse cx="60" cy="96" rx="50" ry="68" fill="none" stroke="currentColor" stroke-width="0.6" stroke-dasharray="2 2"/>
    <!-- 花环的叶子装饰（四角） -->
    <path d="M22 40 Q28 44 24 50" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M98 40 Q92 44 96 50" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M22 152 Q28 148 24 142" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M98 152 Q92 148 96 142" fill="none" stroke="currentColor" stroke-width="1"/>
    <!-- 中央舞者 -->
    <circle cx="60" cy="72" r="7" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 身体 -->
    <path d="M52 80 Q60 88 68 80 L70 120 L50 120 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 手臂伸展 -->
    <path d="M52 86 L28 70" stroke="currentColor" stroke-width="1.3"/>
    <path d="M68 86 L92 70" stroke="currentColor" stroke-width="1.3"/>
    <!-- 腿（一条弯一条直，跳舞姿势） -->
    <path d="M52 120 Q48 140 42 146" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M68 120 Q74 136 78 146" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <!-- 手持两根魔杖 -->
    <line x1="28" y1="70" x2="18" y2="52" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="18" cy="50" r="2" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <line x1="92" y1="70" x2="102" y2="52" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="102" cy="50" r="2" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <!-- 四角装饰 -->
    <text x="60" y="32" text-anchor="middle" fill="currentColor" stroke="none" font-size="10" font-family="serif">♈</text>
    <text x="104" y="100" text-anchor="middle" fill="currentColor" stroke="none" font-size="10" font-family="serif">♞</text>
    <text x="60" y="170" text-anchor="middle" fill="currentColor" stroke="none" font-size="10" font-family="serif">♌</text>
    <text x="16" y="100" text-anchor="middle" fill="currentColor" stroke="none" font-size="10" font-family="serif">♠</text>
  `, 'stroke="currentColor"')
};

// ============================================================
// 56 张小阿卡纳 · 参数化生成
// pip cards (A, 2-10) + court cards (侍从/骑士/王后/国王)
// ============================================================

// 花色符号（抽象几何造型，金色线条）
const SUIT_SYMBOLS = {
  wands: `
    <!-- 权杖：三根木棍捆在一起 -->
    <line x1="40" y1="30" x2="80" y2="160" stroke="currentColor" stroke-width="4"/>
    <line x1="60" y1="20" x2="36" y2="150" stroke="currentColor" stroke-width="3" opacity="0.7"/>
    <line x1="70" y1="40" x2="90" y2="170" stroke="currentColor" stroke-width="3" opacity="0.7"/>
    <path d="M36 60 Q42 56 48 60 Q42 64 36 60" fill="none" stroke="currentColor" stroke-width="1.2"/>
  `,
  cups: `
    <!-- 圣杯 -->
    <path d="M40 40 L50 130 L70 130 L80 40 Z" fill="none" stroke="currentColor" stroke-width="4"/>
    <path d="M40 40 L80 40" stroke="currentColor" stroke-width="3"/>
    <path d="M36 130 Q60 146 84 130" fill="none" stroke="currentColor" stroke-width="3"/>
    <circle cx="60" cy="70" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="60" cy="70" r="4" fill="currentColor" opacity="0.4"/>
  `,
  swords: `
    <!-- 宝剑 -->
    <path d="M60 20 L50 120 L70 120 Z" fill="none" stroke="currentColor" stroke-width="3.5"/>
    <line x1="50" y1="120" x2="70" y2="120" stroke="currentColor" stroke-width="4"/>
    <line x1="60" y1="120" x2="60" y2="160" stroke="currentColor" stroke-width="3"/>
    <path d="M50 160 L60 154 L70 160" fill="none" stroke="currentColor" stroke-width="2"/>
  `,
  pentacles: `
    <!-- 星币（五芒星 + 圆） -->
    <circle cx="60" cy="80" r="30" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M60 56 L78 78 L72 104 L48 104 L42 78 Z" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M60 56 L48 104 M78 78 L42 78 M72 104 L60 56" fill="none" stroke="currentColor" stroke-width="1.2"/>
  `
};

// 宫廷牌：人物轮廓（简化版，按花色拿不同武器）
const COURT_HOLD = {
  wands: `<!-- 持权杖 -->
    <line x1="82" y1="50" x2="82" y2="140" stroke="currentColor" stroke-width="2"/>
    <circle cx="82" cy="46" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/>
  `,
  cups: `<!-- 持圣杯 -->
    <path d="M74 70 L78 100 L86 100 L90 70 Z" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M72 100 Q82 112 92 100" fill="none" stroke="currentColor" stroke-width="1.5"/>
  `,
  swords: `<!-- 持剑 -->
    <path d="M82 48 L76 140 L88 140 Z" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="76" y1="140" x2="88" y2="140" stroke="currentColor" stroke-width="2"/>
  `,
  pentacles: `<!-- 持星币 -->
    <circle cx="82" cy="84" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M82 76 L88 84 L82 92 L76 84 Z" fill="none" stroke="currentColor" stroke-width="1"/>
  `
};

function svgPipCard(suit, count) {
  const symbol = SUIT_SYMBOLS[suit];
  const rankCount = count === 1 ? 1 : count; // A 也画 1 个
  
  // pip cards 用小符号阵列 + 中心大符号
  let smallSymbols = '';
  // 四角 + 两侧按 count 布局
  const positions = getPipPositions(count);
  positions.forEach(pos => {
    smallSymbols += `<g transform="translate(${pos.x}, ${pos.y}) scale(${pos.s || 0.4})">${getMiniSuitPath(suit)}</g>`;
  });

  return wrap(`
    ${smallSymbols}
    <g transform="translate(60, 100) scale(0.8) translate(-60, -80)">
      ${symbol}
    </g>
  `);
}

// 获取 pip card 的小符号坐标
function getPipPositions(count) {
  const pos = [];
  const corners = [
    { x: 18, y: 20, s: 0.28 },   // 左上
    { x: 102, y: 20, s: 0.28 },  // 右上
    { x: 18, y: 172, s: 0.28 },  // 左下
    { x: 102, y: 172, s: 0.28 }, // 右下
  ];
  const middles = [
    { x: 18, y: 96, s: 0.28 },
    { x: 102, y: 96, s: 0.28 },
  ];
  const centerTop = { x: 60, y: 40, s: 0.3 };
  const centerBottom = { x: 60, y: 152, s: 0.3 };
  const center = { x: 60, y: 96, s: 0.35 };

  switch (count) {
    case 1: // A - 四角大符号
      pos.push({ x: 24, y: 28, s: 0.4 });
      pos.push({ x: 96, y: 28, s: 0.4 });
      pos.push({ x: 24, y: 164, s: 0.4 });
      pos.push({ x: 96, y: 164, s: 0.4 });
      break;
    case 2: pos.push(corners[0], corners[1], corners[2], corners[3]); break;
    case 3: pos.push(corners[0], center, corners[3]); break;
    case 4: pos.push(...corners); break;
    case 5: pos.push(...corners, center); break;
    case 6: pos.push(...corners, centerTop, centerBottom); break;
    case 7: pos.push(...corners, center, centerTop, centerBottom); break;
    case 8: pos.push(...corners, ...middles, centerTop, centerBottom); break;
    case 9: pos.push(...corners, ...middles, center, centerTop, centerBottom); break;
    case 10: pos.push(...corners, ...middles, center, centerTop, centerBottom);
             // 第10个加一个中心小符号居中
             break;
  }
  return pos;
}

function getMiniSuitPath(suit) {
  // 迷你简化符号
  switch (suit) {
    case 'wands':
      return `<line x1="30" y1="10" x2="30" y2="70" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`;
    case 'cups':
      return `<path d="M20 10 L30 60 L40 10 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>`;
    case 'swords':
      return `<path d="M30 6 L24 70 L36 70 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>`;
    case 'pentacles':
      return `<circle cx="30" cy="38" r="28" fill="none" stroke="currentColor" stroke-width="3.5"/>`;
  }
}

function svgCourtCard(suit, role) {
  const hold = COURT_HOLD[suit];
  const hats = {
    Pa: `<!-- 侍从帽（短发） -->
      <path d="M46 36 Q60 22 74 36" fill="none" stroke="currentColor" stroke-width="1.3"/>`,
    Kn: `<!-- 骑士头盔 -->
      <path d="M44 34 L60 14 L76 34" fill="none" stroke="currentColor" stroke-width="1.3"/>
      <line x1="44" y1="34" x2="76" y2="34" stroke="currentColor" stroke-width="1.2"/>
      <path d="M56 14 L52 4 M64 14 L68 4" stroke="currentColor" stroke-width="1"/>`,
    Qn: `<!-- 王后冠 -->
      <path d="M46 32 L50 22 L56 28 L60 18 L64 28 L70 22 L74 32" fill="none" stroke="currentColor" stroke-width="1.3"/>
      <circle cx="60" cy="20" r="2" fill="currentColor"/>`,
    Kg: `<!-- 国王冠（更大） -->
      <path d="M44 30 L48 14 L54 22 L60 8 L66 22 L72 14 L76 30 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
      <circle cx="60" cy="10" r="2.5" fill="currentColor"/>`
  };
  const bodies = {
    Pa: `<!-- 侍从：年轻 -->
      <circle cx="60" cy="46" r="7" fill="none" stroke="currentColor" stroke-width="1.3"/>
      <path d="M50 54 Q60 60 70 54 L72 140 L48 140 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>`,
    Kn: `<!-- 骑士：骑马上 -->
      <circle cx="60" cy="46" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <path d="M52 52 Q60 58 68 52 L70 90 L50 90 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <!-- 马 -->
      <path d="M20 120 Q16 108 22 104 L30 106 L34 140 L26 140 M70 90 L72 110 L90 110 Q100 108 100 118 Q96 124 86 124 L74 124 L74 140 L66 140 L66 124 L34 124 L34 140 L26 140" fill="none" stroke="currentColor" stroke-width="1.2"/>`,
    Qn: `<!-- 王后：长袍 -->
      <circle cx="60" cy="46" r="7" fill="none" stroke="currentColor" stroke-width="1.3"/>
      <path d="M48 54 Q60 60 72 54 L80 150 L40 150 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>`,
    Kg: `<!-- 国王：王座上 -->
      <circle cx="60" cy="46" r="7" fill="none" stroke="currentColor" stroke-width="1.3"/>
      <path d="M48 54 Q60 60 72 54 L74 90 L46 90 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
      <!-- 王座 -->
      <path d="M30 90 L90 90 L86 150 L34 150 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <path d="M30 90 L30 74 L38 74 L38 90" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M90 90 L90 74 L82 74 L82 90" fill="none" stroke="currentColor" stroke-width="1"/>
      <!-- 权杖 -->
      <line x1="28" y1="50" x2="28" y2="90" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="28" cy="48" r="3" fill="none" stroke="currentColor" stroke-width="1"/>`
  };

  return wrap(`
    ${hats[role]}
    ${bodies[role]}
    ${hold}
  `);
}

// ---------- 导出：按 card.id 或 card 的 type+suit+rank 取 SVG ----------
export function getCardSVG(card) {
  if (card.type === 'major') {
    return svgMajor(card.rank);
  }
  // minor
  const suit = card.suit;
  const r = card.rank;
  if (r === 'Pa' || r === 'Kn' || r === 'Qn' || r === 'Kg') {
    return svgCourtCard(suit, r);
  }
  // pip: A=1, 2-10
  const count = r === 'A' ? 1 : parseInt(r, 10);
  return svgPipCard(suit, count);
}
