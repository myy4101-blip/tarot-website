// ============================================================
// 本地模板解读引擎
// 即使没有大模型，网站也能输出完整解读
// ============================================================

import { THREE_CARD_POSITIONS } from './tarot-data.js';

// ---------- 每个牌位的"视角滤镜" ----------
// 同一张牌，在不同牌位下有不同的解读侧重
const POSITION_LENS = {
  past: {
    intro: '在「过去」的位置，',
    // 正位 → 过去给现在带来的积极遗产
    upright: (card) => {
      const base = card.upright.replace(/[。！？]$/, '');
      return `${base}。这张牌出现在过去，说明你曾经种下的种子现在正在发芽——你之前做出的选择、积累的经验，构成了此刻的底色。`;
    },
    // 逆位 → 过去的功课或未完成的事
    reversed: (card) => {
      const base = card.reversed.replace(/[。！？]$/, '');
      return `${base}。这可能是你过去未完成的一段功课，或是曾经有过的一个遗憾，它至今仍在悄悄影响着你。`;
    }
  },
  present: {
    intro: '落在「现在」，',
    upright: (card) => {
      const base = card.upright.replace(/[。！？]$/, '');
      return `${base}。这就是你此刻正在经历的——让它的能量充分流动，你会发现当下比你想象的更清晰。`;
    },
    reversed: (card) => {
      const base = card.reversed.replace(/[。！？]$/, '');
      return `${base}。现在这个位置的逆位不是坏消息，它是一面镜子，提醒你当下有什么地方需要调整方向。`;
    }
  },
  future: {
    intro: '指向「未来」，',
    upright: (card) => {
      const base = card.upright.replace(/[。！？]$/, '');
      return `${base}。这是一个有希望的信号——你当下的行动正在把你引向这个方向，保持当前的节奏，它就会到来。`;
    },
    reversed: (card) => {
      const base = card.reversed.replace(/[。！？]$/, '');
      return `${base}。未来的逆位牌并不是"不好"的预告，它更像一张警告牌：如果继续走当前的路，可能会遇到这个结果。现在还有时间调整。`;
    }
  }
};

// ---------- 单张牌 · 单牌位解读 ----------
// 返回 2-3 段适合阅读的文字
export function interpretSingleCard(card, positionKey) {
  const lens = POSITION_LENS[positionKey];
  if (!lens) return card.upright;

  const positionInfo = THREE_CARD_POSITIONS.find(p => p.key === positionKey);
  const zh = positionInfo?.zh ?? positionKey;
  const upright = card.upright;
  const reversed = card.reversed;

  const part1 = card.uprightCardText ?? ''; // 预留给扩展
  const part2 = card.isReversed ? lens.reversed(card) : lens.upright(card);

  // 组合：[牌名介绍] + [位置视角解读]
  const sentences = [];

  sentences.push(
    `「${card.nameCn}」（${card.nameEn}）出现在${zh}位置，是一张${card.isReversed ? '逆位' : '正位'}的${card.type === 'major' ? '大阿卡纳' : card.suitCn}牌。`
  );
  sentences.push(part2);

  // 加一段建议句（基于正/逆位 + 元素）
  const hint = buildHint(card, positionKey);
  if (hint) sentences.push(hint);

  return sentences;
}

// ---------- 建议句生成 ----------
function buildHint(card, positionKey) {
  const elem = card.element || (card.type === 'major' ? '精神' : '');
  const baseTag = card.isReversed ? '逆位' : '正位';

  const advices = {
    upright: {
      major: [
        '这张大阿卡纳牌提醒你：注意它代表的那个生命主题，最近可能特别活跃。',
        '大阿卡纳代表生命的重大议题，不必急着"解决"，先观察它在你身上的体现。'
      ],
      wands:     ['火元素给你行动力，大胆去做你已经想了很久的那件事。'],
      cups:      ['水元素关乎情感，问问自己的心真正想要什么。'],
      swords:    ['风元素带来清晰的思维，用理性梳理一下当前的局面。'],
      pentacles: ['土元素脚踏实地，先照顾好你的基本盘：身体、钱、环境。']
    },
    reversed: {
      major: [
        '大阿卡纳逆位，建议你放慢节奏，不要硬顶。',
        '这张牌是在提醒你：有什么东西需要放下或调整，不是对抗的时候。'
      ],
      wands:     ['火元素逆位，先别冲动。等一等，让热情沉淀一下再行动。'],
      cups:      ['水元素逆位，情绪可能有些起伏。给自己一点时间感受它，不要压抑。'],
      swords:    ['风元素逆位，思维容易绕弯。写下来或者和信任的人聊聊，会清楚很多。'],
      pentacles: ['土元素逆位，物质或身体层面可能需要多加留意。']
    }
  };

  const pool = advices[card.isReversed ? 'reversed' : 'upright'][card.type === 'major' ? 'major' : (card.suit || card.element)] || [];
  return pool[Math.floor(Math.random() * pool.length)] || null;
}

// ---------- 综合解读（本地模板版） ----------
// 把三张牌串成一个时间线故事
export function synthesizeLocalInterpretation(cards, question) {
  const [p, now, f] = cards;
  const parts = [];

  // 开场
  if (question && question.trim()) {
    parts.push(`你问的是「${question.trim()}」。让我们顺着时间线看下去——`);
  } else {
    parts.push(`好的，让我们顺着时间线看看这三张牌在说什么——`);
  }

  // 过去 → 现在 → 未来 的串联
  const pastRole = describeCardRole(p, 'past');
  const nowRole  = describeCardRole(now, 'present');
  const futureRole = describeCardRole(f, 'future');

  parts.push(
    `过去的「${p.nameCn}」（${p.isReversed ? '逆位' : '正位'}）${pastRole}。`
  );
  parts.push(
    `到了现在，「${now.nameCn}」（${now.isReversed ? '逆位' : '正位'}）${nowRole}。`
  );
  parts.push(
    `而未来向你展开的是「${f.nameCn}」（${f.isReversed ? '逆位' : '正位'}）${futureRole}。`
  );

  // 串联总结
  const transition = buildTransition(p, now, f);
  if (transition) parts.push(transition);

  // 行动建议
  const advice = buildAdvice(p, now, f);
  parts.push(advice);

  return parts.join('\n\n');
}

// 过去/现在/未来 的简短描述
function describeCardRole(card, pos) {
  const dir = card.isReversed ? '逆位' : '正位';
  // 从牌的 upright/reversed 文本里截取第一句或关键词
  const meaning = card.isReversed ? card.reversed : card.upright;
  const firstClause = meaning.split(/[。；;]/)[0] || meaning;
  return `代表着${dir}的${firstClause.replace(/^你/, '').trim()}的能量`;
}

// 过去→现在→未来 的过渡逻辑
function buildTransition(p, now, f) {
  const allUpright = !p.isReversed && !now.isReversed && !f.isReversed;
  const allReversed = p.isReversed && now.isReversed && f.isReversed;

  if (allUpright) {
    return '三张都是正位，这是一条顺畅的能量流：过去给你打了好基础，现在你在正确的路上，未来也会顺着这个方向开花。继续保持现在的节奏。';
  }
  if (allReversed) {
    return '三张都是逆位，这可能是一个信号：你当前的人生阶段需要停下来重新校准方向。不必焦虑，逆位的能量是在帮你发现"什么不对"，而不是宣判失败。';
  }

  // 混合情况
  const hasPastLesson = p.isReversed;
  const hasFutureWarning = f.isReversed;

  if (hasPastLesson && !hasFutureWarning) {
    return '过去可能有些没有处理完的事，但好消息是——你已经在慢慢从中走出来，现在的能量正在转向，未来看起来是积极的。';
  }
  if (!hasPastLesson && hasFutureWarning) {
    return '过去给你留了不错的基础，现在也还算稳，但未来有一个需要注意的信号：你现在做的一些选择，很可能会把你推向那个结果。现在调整还来得及。';
  }
  if (p.isReversed && f.isReversed) {
    return '过去和未来都是逆位，中间的现在是关键转折点。你此刻的每一个决定都会放大成未来的样子——不要被过去的包袱绑住，也不要对未来的警告视而不见。';
  }
  return '这个组合很有意思，它告诉你：能量在变化，方向在调整。你正处在一个动态的过程中，而非一个静态的结果。';
}

// 行动建议
function buildAdvice(p, now, f) {
  // 选一张牌的关键词作为行动锚点
  const anchorCard = !now.isReversed ? now : (!p.isReversed ? p : f);
  const kws = anchorCard.keywords.slice(0, 3).join('、');

  const templates = [
    `综合来看，塔罗给你的建议是：${kws}——让这几个词成为你接下来的行动锚点。`,
    `最后给你一个可以带走的东西：在接下来的一周里，多留意和「${kws}」相关的情境，它们可能就是牌在给你发的信号。`,
    `总结成一句话：无论结果如何，你现在正处在一个关键节点上，专注做好眼前的事，答案会自己浮现。`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}
