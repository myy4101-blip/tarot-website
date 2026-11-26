/* ============================================================
   tarot-data.js —— 78 张韦特塔罗完整数据
   22 张大阿卡纳手动写，56 张小阿卡纳用规则生成
   每张牌含：编号、中英文名、类型、正/逆位含义、关键词、宜/忌
   ============================================================ */

// ---------- 22 张大阿卡纳 ----------
const MAJOR_ARCANA = [
  { id: 'm0',  rank: '0',  nameCn: '愚者',     nameEn: 'The Fool',          upright: '象征新的开始，带着天真与勇气启程，眼前一片未知却充满可能。',  reversed: '轻率莽撞或犹豫不决，可能因忽视现实细节而踩空。',      keywords: ['新的开始','冒险','自由','天真','启程'],     yi: '迈出第一步', ji: '冲动行事' },
  { id: 'm1',  rank: 'I',  nameCn: '魔术师',   nameEn: 'The Magician',      upright: '你拥有实现目标所需的一切资源，意念所至，万物皆可为用。',       reversed: '能力尚未准备好，或意志力不够集中，事倍功半。',          keywords: ['创造','意志','显化','天赋','行动'],         yi: '集中意念做事', ji: '好高骛远' },
  { id: 'm2',  rank: 'II', nameCn: '女祭司',   nameEn: 'The High Priestess',upright: '直觉与潜意识正在发光，学会聆听内心的声音，答案自现。',      reversed: '忽视直觉，或被表象迷惑，真相被迷雾遮蔽。',              keywords: ['直觉','神秘','静观','潜意识','智慧'],       yi: '静下来听自己', ji: '急于求成' },
  { id: 'm3',  rank: 'III',nameCn: '皇后',     nameEn: 'The Empress',       upright: '创造力与丰盈之象，事情正以自然、舒展的节奏开花结果。',      reversed: '停滞、依赖或过度保护，需要重新与自身连接。',            keywords: ['丰收','创造力','母性','滋养','耐心'],       yi: '照顾自己/他人', ji: '过度干预' },
  { id: 'm4',  rank: 'IV', nameCn: '皇帝',     nameEn: 'The Emperor',       upright: '秩序与权威，你有能力建立规则、掌控局面，稳扎稳打。',          reversed: '过于僵化或失去权威，可能在失控边缘。',                  keywords: ['权威','秩序','自律','稳定','掌控'],         yi: '立规矩/做决定', ji: '独断专行' },
  { id: 'm5',  rank: 'V',  nameCn: '教皇',     nameEn: 'The Hierophant',    upright: '寻求传统、制度或智者的指引，遵从既定路径会让你更稳。',      reversed: '反传统，或感到被束缚，需要重新定义自己的道路。',        keywords: ['传统','信仰','导师','规范','传承'],         yi: '请教有经验的人', ji: '盲目从众' },
  { id: 'm6',  rank: 'VI', nameCn: '恋人',     nameEn: 'The Lovers',        upright: '深刻的联结与选择，不管是感情还是理念，都需要发自内心。',    reversed: '关系失衡或选择犹豫，价值观出现冲突。',                  keywords: ['爱情','选择','联结','价值观','和谐'],       yi: '真诚沟通', ji: '委屈求全' },
  { id: 'm7',  rank: 'VII',nameCn: '战车',     nameEn: 'The Chariot',       upright: '以意志力驾驭对立的力量，前进！目标就在前方。',              reversed: '方向混乱或失去控制，需要重新掌舵。',                    keywords: ['胜利','意志','方向','节奏','掌控'],         yi: '锁定目标前进', ji: '贪心多线' },
  { id: 'm8',  rank: 'VIII',nameCn: '力量',     nameEn: 'Strength',          upright: '真正的力量不是对抗，而是温柔坚定地引导，你有这份内在的柔刚。', reversed: '自我怀疑或情绪失控，需要与内在的阴影和解。',            keywords: ['勇气','温柔','耐心','内在力量','平衡'],     yi: '温柔坚持', ji: '以暴制暴' },
  { id: 'm9',  rank: 'IX', nameCn: '隐士',     nameEn: 'The Hermit',        upright: '向内求索的时刻，独处中你会找到真正的答案。',                reversed: '孤立过度或拒绝帮助，别把自己困得太久。',                keywords: ['独处','内省','指引','智慧','沉静'],         yi: '给自己一些独处时间', ji: '逃避社交' },
  { id: 'm10', rank: 'X',  nameCn: '命运之轮', nameEn: 'Wheel of Fortune',  upright: '运势正在转动，你无法完全掌控，但可以顺势而为。',            reversed: '运气暂时不好或抗拒变化，但轮转永不停歇。',              keywords: ['变化','机缘','循环','命运','转折点'],       yi: '顺势而为', ji: '强扭结果' },
  { id: 'm11', rank: 'XI', nameCn: '正义',     nameEn: 'Justice',           upright: '真相与公道，事情会按应有的方式被解决，保持客观。',          reversed: '不公或偏向，需要重新校准内心的标尺。',                  keywords: ['公正','真相','因果','决策','平衡'],         yi: '按规则来', ji: '偏袒自己' },
  { id: 'm12', rank: 'XII',nameCn: '倒吊人',   nameEn: 'The Hanged Man',    upright: '换个角度看世界，暂停不代表停止，是为了看清全貌。',          reversed: '拖延太久或无谓牺牲，该动的时候要动。',                  keywords: ['暂停','视角','牺牲','领悟','等待'],         yi: '停下来换视角', ji: '僵住不动' },
  { id: 'm13', rank: 'XIII',nameCn: '死神',     nameEn: 'Death',             upright: '结束与重生，旧的不去新的不来，告别才能腾出空间。',          reversed: '抗拒改变，卡在临界点迟迟不肯松手。',                   keywords: ['结束','重生','蜕变','放下','更新'],         yi: '主动告别旧事物', ji: '紧抓不放' },
  { id: 'm14', rank: 'XIV',nameCn: '节制',     nameEn: 'Temperance',        upright: '找到属于自己的平衡配方，耐心混合，恰到好处。',              reversed: '过度或不足，节奏失衡，需要调整剂量。',                  keywords: ['平衡','节制','耐心','调和','中道'],         yi: '慢慢来找到节奏', ji: '走极端' },
  { id: 'm15', rank: 'XV', nameCn: '恶魔',     nameEn: 'The Devil',         upright: '被欲望、恐惧或物质束缚，要看见锁链才能打破它。',          reversed: '正在挣脱，但旧习惯还在拉扯。',                         keywords: ['束缚','欲望','诱惑','阴影','觉醒'],         yi: '看清束缚你的东西', ji: '沉溺享乐' },
  { id: 'm16', rank: 'XVI',nameCn: '高塔',     nameEn: 'The Tower',         upright: '旧有的结构突然崩塌，这是解放也是重建的开始。',              reversed: '延迟的崩塌，或在废墟中不肯离开。',                     keywords: ['突变','崩塌','觉醒','解放','重建'],         yi: '接受不可避免的变化', ji: '硬撑' },
  { id: 'm17', rank: 'XVII',nameCn: '星星',     nameEn: 'The Star',          upright: '希望与灵感，在风暴之后你看见了那颗指引的星。',              reversed: '信念动摇或感到迷茫，重新点亮内心的星。',                keywords: ['希望','灵感','疗愈','平静','指引'],         yi: '心怀希望', ji: '自我否定' },
  { id: 'm18', rank: 'XVIII',nameCn: '月亮',     nameEn: 'The Moon',          upright: '潜意识涌上来，梦与直觉在告诉你什么，别怕黑暗。',          reversed: '迷雾散去，你能看清真实了。',                            keywords: ['幻想','潜意识','情绪','不安','边界'],       yi: '梳理情绪和梦', ji: '被幻想骗' },
  { id: 'm19', rank: 'XIX',nameCn: '太阳',     nameEn: 'The Sun',           upright: '阳光普照，成功、活力、喜悦——尽情绽放吧！',                reversed: '暂时的阴天，别因此否定自己的光。',                     keywords: ['成功','喜悦','活力','光明','自我'],         yi: '大胆展现自己', ji: '消极退缩' },
  { id: 'm20', rank: 'XX', nameCn: '审判',     nameEn: 'Judgement',         upright: '一个新的阶段开始，倾听内心的召唤，做出回应。',              reversed: '自我怀疑，或迟迟不做出判断。',                         keywords: ['召唤','觉醒','重生','抉择','宽恕'],         yi: '回应内心的召唤', ji: '自我审判过度' },
  { id: 'm21', rank: 'XXI',nameCn: '世界',     nameEn: 'The World',         upright: '圆满达成！一个周期顺利结束，准备好开启下一段旅程。',        reversed: '近在眼前的完成还差一步，别松懈。',                     keywords: ['圆满','完成','整合','旅行','成就'],         yi: '庆祝完成', ji: '功亏一篑' }
];

// ---------- 小阿卡纳生成器 ----------
// 花色元数据
const SUITS = [
  {
    suit: 'wands', suitCn: '权杖', suitEn: 'Wands', element: '火', elementEn: 'Fire',
    theme: '行动、热情、创造、野心',
    keywordsBase: ['行动','热情','灵感','推动力','创造']
  },
  {
    suit: 'cups',  suitCn: '圣杯', suitEn: 'Cups',  element: '水', elementEn: 'Water',
    theme: '情感、关系、直觉、爱',
    keywordsBase: ['情感','关系','共情','爱','内在']
  },
  {
    suit: 'swords',suitCn: '宝剑', suitEn: 'Swords',element: '风', elementEn: 'Air',
    theme: '想法、沟通、冲突、真理',
    keywordsBase: ['思考','沟通','真相','挑战','勇气']
  },
  {
    suit: 'pentacles',suitCn: '星币', suitEn: 'Pentacles',element: '土', elementEn: 'Earth',
    theme: '金钱、物质、现实、身体',
    keywordsBase: ['物质','金钱','稳定','技能','身体']
  }
];

// 数字元数据（1-10）
const NUMBERS = [
  { num: 1, rank: 'A',  cn: '首',  stage: '起点、种子、新机会',   tag: '新开始', uprightMod: '一个崭新的开始正在孕育，带着纯粹的能量。', reversedMod: '新想法被推迟或被压抑，尚未显化。' },
  { num: 2, rank: '2',  cn: '二',  stage: '平衡、对照、抉择',     tag: '平衡',   uprightMod: '两种力量需要找到平衡点，可能面临抉择。', reversedMod: '失衡加剧，犹豫让事情停滞。' },
  { num: 3, rank: '3',  cn: '三',  stage: '合作、表达、初成',     tag: '合作',   uprightMod: '团队或关系中的沟通顺畅，小有成果。',     reversedMod: '合作出现分歧，表达不够到位。' },
  { num: 4, rank: '4',  cn: '四',  stage: '稳固、沉淀、安全',     tag: '稳定',   uprightMod: '稳定的状态，可能需要固守已有成果。',     reversedMod: '过度保守或安全感被打破，需要调整。' },
  { num: 5, rank: '5',  cn: '五',  stage: '动摇、冲突、失落',     tag: '动摇',   uprightMod: '经历一段困难时期，低谷也是转机的契机。', reversedMod: '冲突即将结束，但阴影还在。' },
  { num: 6, rank: '6',  cn: '六',  stage: '给予、分享、恢复',     tag: '给予',   uprightMod: '给予或接受帮助，关系中的流动让人温暖。', reversedMod: '给予过度或感到被亏欠。' },
  { num: 7, rank: '7',  cn: '七',  stage: '评估、反思、选择',     tag: '评估',   uprightMod: '需要仔细评估，别被表象迷惑。',           reversedMod: '拖延太久或做了错误判断。' },
  { num: 8, rank: '8',  cn: '八',  stage: '推进、快速、执行',     tag: '推进',   uprightMod: '事情在加速推进，执行力强。',             reversedMod: '仓促或受阻，速度和质量需要平衡。' },
  { num: 9, rank: '9',  cn: '九',  stage: '接近完成、满足、焦虑', tag: '临成',   uprightMod: '离目标很近了，坚持住。',                 reversedMod: '焦虑或自我怀疑让最后的冲刺变难。' },
  { num: 10,rank: '10', cn: '十',  stage: '完成、收尾、承载',     tag: '完成',   uprightMod: '一个周期圆满完成，可以收获了。',         reversedMod: '收尾阶段还有小问题，别大意。' }
];

// 宫廷牌元数据
const COURTS = [
  { rank: 'Pa',  roleCn: '侍从', roleEn: 'Page',  stage: '消息、新技能、好奇',         tag: '消息', yi: '学习/收集信息', ji: '不切实际' },
  { rank: 'Kn',  roleCn: '骑士', roleEn: 'Knight',stage: '行动、热情、冲向目标',       tag: '行动', yi: '快速行动',       ji: '冲动鲁莽' },
  { rank: 'Qn',  roleCn: '王后', roleEn: 'Queen', stage: '内在、守护、深度连接',       tag: '内在', yi: '滋养/倾听',      ji: '过度敏感' },
  { rank: 'Kg',  roleCn: '国王', roleEn: 'King',  stage: '掌控、权威、成熟引导',       tag: '掌控', yi: '做决定/领导',    ji: '独断/固执' }
];

// 为每个花色+数字生成牌
function buildMinorCard(suit, numInfo) {
  const nameCn = `${suit.suitCn}${numInfo.cn === '首' ? '王牌' : numInfo.cn}`;
  const nameEn = `${suit.suitEn.charAt(0).toUpperCase() + suit.suitEn.slice(1)} of ${numInfo.num === 1 ? 'Aces' :
                  numInfo.num === 2 ? 'Twos' : numInfo.num === 3 ? 'Threes' : numInfo.num === 4 ? 'Fours' :
                  numInfo.num === 5 ? 'Fives' : numInfo.num === 6 ? 'Sixes' : numInfo.num === 7 ? 'Sevens' :
                  numInfo.num === 8 ? 'Eights' : numInfo.num === 9 ? 'Nines' : 'Tens'}`;
  const upright = `【${suit.theme}】${numInfo.uprightMod}`;
  const reversed = `【${suit.theme}】${numInfo.reversedMod}`;
  const keywords = [suit.suitCn, numInfo.tag, ...suit.keywordsBase.slice(0, 3)];
  return {
    id: `${suit.suit.charAt(0)}${numInfo.num}`,
    type: 'minor',
    suit: suit.suit, suitCn: suit.suitCn, suitEn: suit.suitEn,
    element: suit.element,
    rank: numInfo.rank,
    nameCn, nameEn,
    upright, reversed,
    keywords,
    yi: `在${suit.suitCn}领域${numInfo.tag}`,
    ji: `回避${suit.suitCn}方面的${numInfo.tag}`
  };
}

// 为每个花色+宫廷牌生成
function buildCourtCard(suit, court) {
  const nameCn = `${suit.suitCn}${court.roleCn}`;
  const nameEn = `${court.roleEn} of ${suit.suitEn.charAt(0).toUpperCase() + suit.suitEn.slice(1)}s`;
  const upright = `你正处在${suit.theme}的${court.stage}阶段，或需要这样的能量。`;
  const reversed = `${suit.theme}方面的${court.roleCn}能量失衡——${court.yi.replace('/','或')}不足或过度。`;
  const keywords = [suit.suitCn, court.tag, ...suit.keywordsBase.slice(0, 3)];
  return {
    id: `${suit.suit.charAt(0)}${court.rank}`,
    type: 'minor',
    suit: suit.suit, suitCn: suit.suitCn, suitEn: suit.suitEn,
    element: suit.element,
    rank: court.rank,
    nameCn, nameEn,
    upright, reversed,
    keywords,
    yi: court.yi,
    ji: court.ji
  };
}

// 生成全部 56 张小阿卡纳
function buildAllMinor() {
  const minor = [];
  for (const suit of SUITS) {
    for (const n of NUMBERS) minor.push(buildMinorCard(suit, n));
    for (const c of COURTS) minor.push(buildCourtCard(suit, c));
  }
  return minor;
}

// ---------- 合并导出 ----------
const MINOR_ARCANA = buildAllMinor();
export const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];

// 按 id 查找
export function getCardById(id) {
  return ALL_CARDS.find(c => c.id === id);
}

// Fisher-Yates 洗牌
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 抽 n 张不重复，uprightOnly 时 isReversed=false
export function drawCards(n, { uprightOnly = false } = {}) {
  const shuffled = shuffle(ALL_CARDS);
  return shuffled.slice(0, n).map(card => ({
    ...card,
    isReversed: uprightOnly ? false : Math.random() < 0.5
  }));
}

// 按分类筛选
export function filterByCategory(category) {
  if (category === 'all') return ALL_CARDS;
  if (category === 'major') return MAJOR_ARCANA;
  return ALL_CARDS.filter(c => c.suit === category);
}
