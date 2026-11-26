/* ============================================================
   interpretation.js —— 本地解读引擎
   4 套主题模板 × 3 种句式轮换 × 具体行动建议
   ============================================================ */

// ---------- 主题配置 ----------
export const THEMES = [
  { key: 'love',   label: '感情', emoji: '💕',
    questions: ['我和TA会怎样？','这段关系怎么发展？','我该怎么表达心意？'] },
  { key: 'study',  label: '学业', emoji: '📖',
    questions: ['我该怎么准备考试？','当前学习状态如何？','要不要换方向？'] },
  { key: 'work',   label: '工作', emoji: '💼',
    questions: ['要不要换工作？','项目能不能成？','和同事/上司的关系如何？'] },
  { key: 'self',   label: '自我', emoji: '🌱',
    questions: ['我现在最需要关注什么？','我的状态怎么样？','接下来要做什么调整？'] }
];

// 四种主题下，同一关键词的措辞滤镜
const THEME_FILTERS = {
  love: {
    '起点': '一段关系或互动的萌芽',
    '平衡': '感情中的天平需要校准',
    '合作': '双方的配合与共识',
    '稳定': '稳固的情感地基',
    '动摇': '关系里出现了裂痕',
    '给予': '关系中的付出与接纳',
    '评估': '审视这段感情值不值得',
    '推进': '关系在加速升温',
    '临成': '感情即将进入新阶段',
    '完成': '关系到达一个里程碑',
    '行动': '大胆去表达或推进关系',
    '情感': '感受和情绪',
    '选择': '关于关系的重要决定',
    '挑战': '感情里的考验',
    '新开始': '感情翻开新的一页',
    '等待': '在感情里需要耐心',
    '直觉': '关于TA的直觉判断',
  },
  study: {
    '起点': '学习新东西的开始',
    '平衡': '学习与休息的节奏',
    '合作': '组队、交流、互助',
    '稳定': '扎实的基础和习惯',
    '动摇': '心态或进度出了问题',
    '给予': '分享知识、帮助同学',
    '评估': '复盘、自测、查漏补缺',
    '推进': '进度在加快',
    '临成': '考试或项目临近交付',
    '完成': '阶段性目标达成',
    '行动': '执行力和专注力',
    '思考': '思维方式和认知',
    '沟通': '请教和讨论',
    '真相': '找到自己的薄弱点',
    '新开始': '学习路径的新方向',
    '等待': '需要沉下心来积累',
    '稳定': '有规律的学习节奏',
  },
  work: {
    '起点': '新项目或新岗位的开始',
    '平衡': '工作与生活的平衡',
    '合作': '团队协作、跨部门配合',
    '稳定': '稳固的职场地位',
    '动摇': '职场中的变数或摇摆',
    '给予': '在职场中贡献价值',
    '评估': '复盘、做决策',
    '推进': '项目在加速',
    '临成': 'KPI 即将达成',
    '完成': '一个项目/周期收尾',
    '行动': '果断执行',
    '思考': '策略和决策',
    '沟通': '汇报、对齐、争取资源',
    '真相': '看清职场中的真实情况',
    '新开始': '职业转型或新机会',
    '等待': '时机未到，先准备',
    '稳定': '稳扎稳打不冒进',
  },
  self: {
    '起点': '自我探索的新起点',
    '平衡': '内在的和谐与均衡',
    '合作': '和外界的健康互动',
    '稳定': '内在的安稳和笃定',
    '动摇': '内心的波动和迷茫',
    '给予': '接纳自己的同时付出',
    '评估': '自我审视和反思',
    '推进': '在某个方向快速成长',
    '临成': '内在的成长即将显现',
    '完成': '一个成长周期结束',
    '行动': '对自己负责的行动',
    '直觉': '聆听内心的声音',
    '情感': '允许情绪流动',
    '真相': '看见真实的自己',
    '新开始': '人生新阶段',
    '等待': '给自己时间疗愈',
    '稳定': '建立内在的定海神针',
  }
};

// ---------- 牌位模板 ----------
const POSITION_TEMPLATES = {
  past: {
    cn: '过去',
    up: '「{card}」出现在过去，是一个关于{focus}的能量。{keyword}的种子在那时已经种下，构成了你此刻的底色。',
    rev: '「{card}」以逆位出现在过去，关于{focus}，有些事情没能顺畅完成，那份未竟之力至今仍在影响你。'
  },
  present: {
    cn: '现在',
    up: '「{card}」正位在现在，{focus}的能量正在充分流动。这张牌在告诉你：{meaning}',
    rev: '「{card}」逆位在现在，像一面镜子。{focus}方面需要调整方向，{meaning}'
  },
  future: {
    cn: '未来',
    up: '「{card}」正位在未来，关于{focus}，这是一个有希望的信号。当下的行动正在把你推向这个方向。',
    rev: '「{card}」逆位在未来——不是"不好的预兆"，而是一张警告牌。如果沿着当前的路走下去，可能遇到这个结果，是时候重新选择了。'
  },
  single: {
    cn: '指引',
    up: '「{card}」是这次抽牌的指引。关于{focus}，{meaning}',
    rev: '「{card}」逆位是这次抽牌的提醒。关于{focus}，{meaning}'
  }
};

// ---------- 三种句式轮换 ----------
const SYNTAX_STYLES = ['causal', 'tension', 'advice'];
const SYNTAX_TEMPLATES = {
  causal: {
    label: '因果式',
    build: (readings, theme) => {
      const [p, n, f] = readings;
      return `${p.cardName}埋下的因，在${n.cardName}中显化，而${f.cardName}则告诉你当下的选择会结出什么果。这不是命运的剧本，而是你的过去如何影响现在、现在又如何决定未来的图景。`;
    }
  },
  tension: {
    label: '张力式',
    build: (readings, theme) => {
      const [p, n, f] = readings;
      return `${p.cardName}和${f.cardName}之间形成了一股张力——过去的惯性拉着你，未来的可能性推着你。而${n.cardName}正站在中间，提醒你：此刻就是做选择的时刻。`;
    }
  },
  advice: {
    label: '建议式',
    build: (readings, theme) => {
      const [p, n, f] = readings;
      return `从${p.cardName}到${n.cardName}再到${f.cardName}，这组牌其实是在给你一份建议：你需要${n.yi}，避免${n.ji}，并且勇敢地迈向${f.keywords[0] || '新的一步'}。`;
    }
  }
};

// ---------- 行动锚点生成 ----------
const ACTION_ANCHORS = {
  love:  ['今天跟TA说一句真心话','写一封简短的信','约TA去你们第一次见面的地方'],
  study: ['每天复盘 15 分钟','找一个同学一起讨论','列一个本周学习清单'],
  work:  ['给上司发一条简短的进展汇报','找同事聊一聊他的近况','列三个本周必须完成的任务'],
  self:  ['今天独处 30 分钟写日记','关掉手机散 20 分钟步','写三件今天让你感恩的小事']
};

// ---------- 核心导出 ----------

/**
 * 生成单张牌解读（指定牌位 + 主题）
 */
export function interpretSingleCard(card, positionKey, themeKey = 'self') {
  const tpl = POSITION_TEMPLATES[positionKey];
  if (!tpl) return '';

  const filter = THEME_FILTERS[themeKey] || THEME_FILTERS.self;
  const meaning = card.isReversed ? card.reversed : card.upright;

  // 找一个和关键词匹配的焦点词
  const keyword = card.keywords[0] || '某个方面';
  let focus = filter[keyword] || card.keywords[0] || '当前的处境';

  const tplText = card.isReversed ? tpl.rev : tpl.up;
  let text = tplText
    .replace('{card}', card.nameCn)
    .replace('{focus}', focus)
    .replace('{meaning}', meaning);

  return text;
}

/**
 * 生成综合解读（三张牌 + 主题）
 * @returns { text, styleName, action }
 */
export function synthesizeInterpretation(cards, positions, themeKey = 'self') {
  // 从过去到未来
  const ordered = positions.map((posKey, i) => ({
    ...cards[i],
    cardName: cards[i].nameCn,
    yi: cards[i].yi,
    ji: cards[i].ji,
    keywords: cards[i].keywords
  }));

  // 三种句式轮换（用时间戳模 3）
  const styleIdx = Math.floor(Date.now() / 1000) % 3;
  const style = SYNTAX_STYLES[styleIdx];
  const builder = SYNTAX_TEMPLATES[style].build;
  const text = builder(ordered, themeKey);

  // 行动锚点（最后一句必须是具体可做的小动作）
  const anchors = ACTION_ANCHORS[themeKey] || ACTION_ANCHORS.self;
  const action = anchors[Math.floor(Math.random() * anchors.length)];

  return {
    styleName: SYNTAX_TEMPLATES[style].label,
    text: text + `\n\n💡 今天可以试试：${action}。`,
    action
  };
}

/**
 * 今日牌的"为什么是这张牌"说明
 */
export function whyToday(card, dateStr) {
  const seedSum = [...dateStr].reduce((a, c) => a + c.charCodeAt(0), 0) % 78;
  return `今天是 ${dateStr}，宇宙用一个古老的算法算出了这张牌——它不是随机的巧合，而是今天的能量底色。让它给你一点指引，但选择权始终在你手中。`;
}

/**
 * 把一次占卜结果拼成纯文本（用于复制）
 */
export function buildResultText(ctx) {
  const { question, themeLabel, spreadLabel, cards, cardReadings, finalText } = ctx;
  let out = `🌙 月相塔罗 · 占卜结果\n\n`;
  if (question) out += `💬 问题：${question}\n`;
  out += `🎯 主题：${themeLabel} | 📐 阵型：${spreadLabel}\n\n`;
  cardReadings.forEach((r, i) => {
    const c = cards[i];
    out += `━━━ ${r.posCn} ━━━\n`;
    out += `🃏 ${c.nameCn}（${c.nameEn}）${c.isReversed ? '· 逆位' : '· 正位'}\n`;
    out += `🔑 ${c.keywords.join(' · ')}\n`;
    out += `${r.text}\n\n`;
  });
  out += `━━━ 综合解读 ━━━\n${finalText}\n\n`;
  out += `⚠️ 内容仅供娱乐，不构成任何建议。`;
  return out;
}
