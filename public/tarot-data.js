// ============================================================
// 韦特塔罗 · 78 张完整牌库
// 每张牌包含：编号 / 中英文名 / 花色 / 正逆位含义 / 关键词 / 视觉符号
// ============================================================

// ---------- 22 张大阿卡纳 ----------
const MAJOR_ARCANA = [
  {
    id: 'm0', type: 'major', rank: '0', suit: null,
    nameCn: '愚者', nameEn: 'The Fool', symbol: '🌞',
    upright: '象征新的开始、无限的可能与纯真的勇气。像一个准备好跨越悬崖的旅人，信任未知的每一步都有意义。',
    reversed: '轻率、莽撞或犹豫不决。缺乏规划的冲动可能带来意外，也可能只是在逃避真正想要的生活。',
    keywords: ['新的开始', '冒险', '纯真', '信任', '自由']
  },
  {
    id: 'm1', type: 'major', rank: 'I', suit: null,
    nameCn: '魔术师', nameEn: 'The Magician', symbol: '🎩',
    upright: '你拥有实现目标所需的全部资源。意志和专注是点燃灵感的火花，沟通和行动力让想法落地。',
    reversed: '有才华却未充分发挥，或是把精力用在了错误的方向。也可能代表自欺欺人或被他人误导。',
    keywords: ['创造', '意志', '沟通', '技能', '显化']
  },
  {
    id: 'm2', type: 'major', rank: 'II', suit: null,
    nameCn: '女祭司', nameEn: 'The High Priestess', symbol: '🌙',
    upright: '直觉、潜意识和内在智慧正在引导你。答案藏在沉默之中，学会倾听自己内心的声音。',
    reversed: '过度依赖直觉而忽略现实信号，或是内心有噪音让你看不清真相。也可能是秘密被隐瞒。',
    keywords: ['直觉', '神秘', '智慧', '潜意识', '耐心']
  },
  {
    id: 'm3', type: 'major', rank: 'III', suit: null,
    nameCn: '女皇', nameEn: 'The Empress', symbol: '🌿',
    upright: '丰盛、滋养与创造力的化身。关系中的温柔、母性的包容，以及物质和感情上的满足。',
    reversed: '创造受阻、关系中过度依赖或窒息感。也可能是自我关怀被忽视，精力消耗殆尽。',
    keywords: ['丰盛', '滋养', '母性', '创造', '感官享受']
  },
  {
    id: 'm4', type: 'major', rank: 'IV', suit: null,
    nameCn: '皇帝', nameEn: 'The Emperor', symbol: '♔',
    upright: '秩序、权威与稳定。理性的结构和清晰的规则帮你建立稳固的基础，领导力和行动力并存。',
    reversed: '僵化、独断或缺乏方向感。规则可能成了枷锁，也可能是失去权威或遇到了混乱。',
    keywords: ['权威', '秩序', '理性', '稳定', '领导力']
  },
  {
    id: 'm5', type: 'major', rank: 'V', suit: null,
    nameCn: '教皇', nameEn: 'The Hierophant', symbol: '⛪',
    upright: '传统、信仰与指引。在他人的经验和既定规则中寻找答案，也代表教导、婚姻和共同的价值观。',
    reversed: '反叛传统、教条僵化，或是不被理解。也可能是在权威与自由之间感到拉扯。',
    keywords: ['传统', '教导', '信仰', '规则', '指引']
  },
  {
    id: 'm6', type: 'major', rank: 'VI', suit: null,
    nameCn: '恋人', nameEn: 'The Lovers', symbol: '💕',
    upright: '真诚的连接与重要的抉择。关系中的信任与价值观共鸣，或是人生路上需要做出的关键选择。',
    reversed: '关系失衡、三角纠葛，或是做出了与内心不一致的选择。也可能代表自我矛盾。',
    keywords: ['爱', '抉择', '价值观', '亲密', '和谐']
  },
  {
    id: 'm7', type: 'major', rank: 'VII', suit: null,
    nameCn: '战车', nameEn: 'The Chariot', symbol: '🚩',
    upright: '凭借意志力驾驭矛盾的力量，迈向胜利。专注和自我掌控让你穿越障碍，一往无前。',
    reversed: '失控、方向迷失或是两败俱伤。也可能是在冲突中无法平衡，被情绪拖垮。',
    keywords: ['意志', '胜利', '前进', '掌控', '决心']
  },
  {
    id: 'm8', type: 'major', rank: 'VIII', suit: null,
    nameCn: '力量', nameEn: 'Strength', symbol: '🦁',
    upright: '温柔的力量和内在的勇气。以柔克刚，用耐心和同理心驯服内心的野兽。',
    reversed: '自我怀疑、情绪失控或是在脆弱面前封闭自己。也可能是失去了应有的自信。',
    keywords: ['勇气', '温柔', '耐心', '自信', '内在力量']
  },
  {
    id: 'm9', type: 'major', rank: 'IX', suit: null,
    nameCn: '隐士', nameEn: 'The Hermit', symbol: '🕯️',
    upright: '独处、内省与灵魂的指引。在安静中寻找答案，一盏灯照亮自己和前行的路。',
    reversed: '孤立、逃避或拒绝帮助。也可能是过度沉溺于内心世界而错过了现实中的机会。',
    keywords: ['内省', '独处', '指引', '智慧', '放慢']
  },
  {
    id: 'm10', type: 'major', rank: 'X', suit: null,
    nameCn: '命运之轮', nameEn: 'Wheel of Fortune', symbol: '☯️',
    upright: '转机正在到来。循环往复之中，幸运的转动带来新的机遇和命运的转折。',
    reversed: '运气不佳或循环被打破。也可能是抗拒变化而让自己困在原地。',
    keywords: ['转变', '机遇', '循环', '命运', '幸运']
  },
  {
    id: 'm11', type: 'major', rank: 'XI', suit: null,
    nameCn: '正义', nameEn: 'Justice', symbol: '⚖️',
    upright: '公平、真理与因果。做出合乎良心的决定，事情会按照应有的秩序发展。',
    reversed: '偏袒、不公或是回避了应有的抉择。也可能是法律纠纷或自责。',
    keywords: ['公平', '真相', '因果', '抉择', '平衡']
  },
  {
    id: 'm12', type: 'major', rank: 'XII', suit: null,
    nameCn: '倒吊人', nameEn: 'The Hanged Man', symbol: '🙃',
    upright: '暂停、牺牲与新的视角。主动停下来，换一个角度看世界，会看到原来看不到的风景。',
    reversed: '无谓的牺牲、固执或停滞不前。也可能是被卡住太久需要果断放下。',
    keywords: ['暂停', '牺牲', '视角', '等待', '平静']
  },
  {
    id: 'm13', type: 'major', rank: 'XIII', suit: null,
    nameCn: '死神', nameEn: 'Death', symbol: '🦋',
    upright: '结束与重生。一个阶段必须落幕，空间才会留给新的成长。蜕变虽然痛苦，但很必要。',
    reversed: '抗拒结束、停滞不前或难以放下。也可能是蜕变的过程比预想的更漫长。',
    keywords: ['结束', '重生', '蜕变', '放手', '转化']
  },
  {
    id: 'm14', type: 'major', rank: 'XIV', suit: null,
    nameCn: '节制', nameEn: 'Temperance', symbol: '🏺',
    upright: '平衡、调和与耐心。在相反的事物之间找到和谐的中点，稳步前行。',
    reversed: '失衡、过度或缺乏方向感。也可能是急于求成而忽略了慢的力量。',
    keywords: ['平衡', '调和', '耐心', '中庸', '节制']
  },
  {
    id: 'm15', type: 'major', rank: 'XV', suit: null,
    nameCn: '恶魔', nameEn: 'The Devil', symbol: '😈',
    upright: '被欲望、恐惧或物质束缚。看似无法挣脱的锁链，其实钥匙一直在自己手里。',
    reversed: '摆脱束缚、重拾自由。也可能是认清了什么才是真正值得的，不再被幻象迷惑。',
    keywords: ['束缚', '欲望', '执念', '诱惑', '阴影']
  },
  {
    id: 'm16', type: 'major', rank: 'XVI', suit: null,
    nameCn: '塔', nameEn: 'The Tower', symbol: '⚡',
    upright: '突如其来的颠覆。看似稳固的结构崩塌，这是打破幻象、重建真实的契机。',
    reversed: '避免了一场灾难，或是震荡之后逐渐恢复。也可能是不敢面对真相而拖垮更多。',
    keywords: ['剧变', '崩塌', '觉醒', '破坏', '真相']
  },
  {
    id: 'm17', type: 'major', rank: 'XVII', suit: null,
    nameCn: '星星', nameEn: 'The Star', symbol: '⭐',
    upright: '希望、灵感与平静。风雨过后，清澈的星光指引你看见更广阔的可能。',
    reversed: '失望、信念动摇或感到迷茫。也可能是理想与现实之间还有距离需要跨越。',
    keywords: ['希望', '灵感', '平静', '疗愈', '指引']
  },
  {
    id: 'm18', type: 'major', rank: 'XVIII', suit: null,
    nameCn: '月亮', nameEn: 'The Moon', symbol: '🌕',
    upright: '迷雾、潜意识和幻象。真相被层层遮掩，相信你的直觉来分辨梦境与现实。',
    reversed: '迷雾逐渐散去，真相浮出水面。也可能是不再被恐惧支配，走出了内心的阴影。',
    keywords: ['幻象', '潜意识', '迷雾', '梦境', '直觉']
  },
  {
    id: 'm19', type: 'major', rank: 'XIX', suit: null,
    nameCn: '太阳', nameEn: 'The Sun', symbol: '☀️',
    upright: '喜悦、成功与内在的光。你正处于生命的高光时刻，自信和快乐向外发光。',
    reversed: '短暂的阴霾、过度乐观或成功延迟。也可能是忘记了停下来享受当下。',
    keywords: ['喜悦', '成功', '自信', '温暖', '活力']
  },
  {
    id: 'm20', type: 'major', rank: 'XX', suit: null,
    nameCn: '审判', nameEn: 'Judgement', symbol: '📯',
    upright: '自我觉醒、呼召与第二次机会。过去的经验汇聚成清晰的方向，勇敢回应内心的召唤。',
    reversed: '自我怀疑、逃避抉择或忽略内心的信号。也可能是在等待一个永远不会来的信号。',
    keywords: ['觉醒', '呼召', '重生', '评估', '行动']
  },
  {
    id: 'm21', type: 'major', rank: 'XXI', suit: null,
    nameCn: '世界', nameEn: 'The World', symbol: '🌍',
    upright: '圆满、完成与整合。一个周期的完美收束，带着经验与喜悦迎接下一段旅程。',
    reversed: '接近完成但还差最后一步，或是对结束感到遗憾。也可能是计划被推迟。',
    keywords: ['完成', '圆满', '整合', '成就', '新阶段']
  }
];

// ---------- 花色配置 ----------
const SUITS = {
  wands:     { nameCn: '权杖', nameEn: 'Wands',     element: '火', symbol: '🔥', color: '#e87a5a' },
  cups:      { nameCn: '圣杯', nameEn: 'Cups',      element: '水', symbol: '💧', color: '#7ab8e8' },
  swords:    { nameCn: '宝剑', nameEn: 'Swords',    element: '风', symbol: '⚔️', color: '#a8a8c8' },
  pentacles: { nameCn: '星币', nameEn: 'Pentacles', element: '土', symbol: '💰', color: '#c8a85a' }
};

// ---------- 小阿卡纳：按花色和点数模板化生成 ----------
// 四个花色 × 14 张（A, 2-10, 侍从, 骑士, 王后, 国王）= 56 张

// 权杖（火元素 · 行动、热情、创造）
const WANDS_RANKS = [
  // 点数牌
  { rank: 'A',  nameCn: '权杖王牌',  nameEn: 'Ace of Wands',   kws: ['灵感', '新机会', '创造力', '热情', '火花'],
    upright: '灵感的火花点燃行动。一个充满热情的新想法或机会正在敲门，大胆抓住它。',
    reversed: '灵感受阻或拖延。热情消退，需要重新找回让你兴奋的理由。' },
  { rank: '2',  nameCn: '权杖二',    nameEn: 'Two of Wands',   kws: ['规划', '远见', '选择', '拓展', '雄心'],
    upright: '站在高处眺望远方，手握已有的资源。需要做出一个决定：留在原地还是拓展新的可能。',
    reversed: '计划搁置或远见不够。信息不足让你犹豫，需要更清晰的目标。' },
  { rank: '3',  nameCn: '权杖三',    nameEn: 'Three of Wands', kws: ['扩张', '远航', '收获', '观望', '远景'],
    upright: '前方的道路已经清晰。远航的船正在回来，前期的努力开始带来回报。',
    reversed: '扩张受阻或预期落空。风浪比想象中大，需要耐心等待或调整方向。' },
  { rank: '4',  nameCn: '权杖四',    nameEn: 'Four of Wands',  kws: ['庆祝', '和谐', '新家', '社交', '稳定'],
    upright: '庆祝一个里程碑。一个稳定的结构已经建立，可以和身边人一起分享这份喜悦。',
    reversed: '庆祝被打断、关系不和或归属感缺失。你可能在一个新环境里还没站稳脚跟。' },
  { rank: '5',  nameCn: '权杖五',    nameEn: 'Five of Wands',  kws: ['竞争', '分歧', '冲突', '摩擦', '混乱'],
    upright: '意见不合或资源竞争。这场混战未必是坏事——它让你看清自己真正想要什么。',
    reversed: '冲突平息或回避了分歧。但也可能是把矛盾压了下去，没有真正解决。' },
  { rank: '6',  nameCn: '权杖六',    nameEn: 'Six of Wands',   kws: ['胜利', '认可', '领导', '荣耀', '掌声'],
    upright: '公开的胜利和认可。你的努力被看到了，人们为你欢呼，自信地享受这份荣光。',
    reversed: '胜利来得勉强，或是在聚光灯下感到不安。也可能是骄傲带来了隐患。' },
  { rank: '7',  nameCn: '权杖七',    nameEn: 'Seven of Wands', kws: ['防御', '勇气', '坚守', '反击', '考验'],
    upright: '处于有利位置，需要守住阵地。来自背后的挑战正在逼近，准备好为你的立场辩护。',
    reversed: '防御失手或疲惫不堪。也可能是你在守一个不值得的阵地。' },
  { rank: '8',  nameCn: '权杖八',    nameEn: 'Eight of Wands', kws: ['速度', '消息', '进展', '旅行', '清晰'],
    upright: '事情在快速推进。消息、旅行或好消息很快就来，你会感到一切都顺了。',
    reversed: '信息延迟或交通受阻。也可能是来得太快，让你有些不知所措。' },
  { rank: '9',  nameCn: '权杖九',    nameEn: 'Nine of Wands',  kws: ['坚持', '韧性', '最后一战', '疲劳', '警戒'],
    upright: '你已经走了很远，身上带着伤但还没倒下。黎明前的黑暗最考验人，坚持住。',
    reversed: '精疲力竭、放弃警戒或真的撑不住了。给自己一个休息的许可。' },
  { rank: '10', nameCn: '权杖十',    nameEn: 'Ten of Wands',   kws: ['负担', '压力', '责任', '过度承担', '完成'],
    upright: '肩上扛了太多的责任。你快到终点了，但需要学会分担才能走得更远。',
    reversed: '终于放下了包袱，或是放弃了原本坚持的东西。也可能是担子变轻了。' },
  // 宫廷牌
  { rank: 'Pa', nameCn: '权杖侍从',  nameEn: 'Page of Wands',  kws: ['好奇', '探索', '新消息', '热情', '初学者'],
    upright: '一个充满好奇的初学者，渴望尝试新鲜事物。好消息正在路上，保持开放和热情。',
    reversed: '热情三分钟，或是在一个项目开始前就失去了兴趣。需要找到真正让你投入的事。' },
  { rank: 'Kn', nameCn: '权杖骑士',  nameEn: 'Knight of Wands',kws: ['冒险', '热情', '冲动', '行动', '速度'],
    upright: '骑着马勇往直前的冒险者。充满冲劲地奔向目标，但要注意别快到摔下马。',
    reversed: '冲动鲁莽、方向迷失或半途而废。热情来得快去得也快。' },
  { rank: 'Qn', nameCn: '权杖王后',  nameEn: 'Queen of Wands', kws: ['自信', '魅力', '热情', '创造', '独立'],
    upright: '充满活力的创造者和领导者。她温暖而自信，知道自己想要什么并鼓励别人成长。',
    reversed: '嫉妒、自我中心或热情消退。魅力被不安取代。' },
  { rank: 'Kg', nameCn: '权杖国王',  nameEn: 'King of Wands',  kws: ['领导', '远见', '创造', '成就', '果断'],
    upright: '有远见的领袖，把想法变成现实。果断、热情、能激励他人一起完成大事业。',
    reversed: '独断专行、冲动冒险或执行力不足。理想远大但落地困难。' }
];

// 圣杯（水元素 · 情感、关系、直觉）
const CUPS_RANKS = [
  { rank: 'A',  nameCn: '圣杯王牌',  nameEn: 'Ace of Cups',    kws: ['新感情', '灵感', '直觉', '祝福', '打开心'],
    upright: '心中涌出清澈的泉水。新的感情、灵感或直觉正在打开你，接纳这份丰盛。',
    reversed: '情感关闭或心门紧闭。也可能是一段关系还没准备好开始。' },
  { rank: '2',  nameCn: '圣杯二',    nameEn: 'Two of Cups',    kws: ['连接', '合作', '亲密', '配对', '吸引'],
    upright: '两颗心真诚地相遇。一段重要的关系、合作或吸引在你面前展开，基础是相互认可。',
    reversed: '关系失衡、合作破裂或价值不匹配。曾经的默契可能已经不在了。' },
  { rank: '3',  nameCn: '圣杯三',    nameEn: 'Three of Cups',  kws: ['庆祝', '友谊', '社交', '分享', '团结'],
    upright: '庆祝友谊和社区的温暖。与朋友分享快乐，或是某个群体为共同成果举杯。',
    reversed: '过度社交、团体内部不和或在欢乐中感到孤独。' },
  { rank: '4',  nameCn: '圣杯四',    nameEn: 'Four of Cups',   kws: ['无聊', '沉思', '错过机会', '不满', '内省'],
    upright: '你在沉思，对面前的机会视而不见。看似好事可能就在窗外，但你还没准备好抬头。',
    reversed: '重新燃起兴趣，或终于注意到了被忽略的机会。从沉思中走出来。' },
  { rank: '5',  nameCn: '圣杯五',    nameEn: 'Five of Cups',   kws: ['失落', '悲伤', '后悔', '接受', '治愈'],
    upright: '为失去的东西而悲伤是正常的。但别忘记——还有三杯没有倒。',
    reversed: '开始接受现实并向前走，悲伤中逐渐看见希望。' },
  { rank: '6',  nameCn: '圣杯六',    nameEn: 'Six of Cups',    kws: ['回忆', '童年', '纯真', '重逢', '善意'],
    upright: '温暖的回忆涌上心头，或是某个人、某个机会带着过去的温柔回到你身边。',
    reversed: '过度沉溺于过去，或无法放下旧有的模式。' },
  { rank: '7',  nameCn: '圣杯七',    nameEn: 'Seven of Cups',  kws: ['选择', '幻想', '诱惑', '可能性', '决策'],
    upright: '面前充满了诱人的选择，但许多可能只是幻象。擦亮眼睛，辨认什么是真实的。',
    reversed: '幻想破灭，或是做出了清晰的选择。面对现实，不再被迷惑。' },
  { rank: '8',  nameCn: '圣杯八',    nameEn: 'Eight of Cups',  kws: ['离开', '寻找', '放下', '放弃', '求索'],
    upright: '你决定离开一个已不再满足你的场景，去追寻更深处的意义。安静地做出这个选择。',
    reversed: '离开的计划搁置，或是在旧关系/旧场景中犹豫不决。' },
  { rank: '9',  nameCn: '圣杯九',    nameEn: 'Nine of Cups',   kws: ['满足', '愿望成真', '感恩', '情感富足', '享乐'],
    upright: '情感上的满足。你想要的东西大多已经拥有，这一刻值得感恩和享受。',
    reversed: '表面满足但内心有缺口，或愿望实现后发现不是你想的那样。' },
  { rank: '10', nameCn: '圣杯十',    nameEn: 'Ten of Cups',    kws: ['圆满', '家庭', '和谐', '幸福', '归属'],
    upright: '家庭或情感关系达到和谐圆满。归属感、信任和爱的联结让每个人都发光。',
    reversed: '家庭矛盾、关系疏离或表面和谐实则疏远。' },
  { rank: 'Pa', nameCn: '圣杯侍从',  nameEn: 'Page of Cups',   kws: ['灵感', '创意', '好消息', '敏感', '想象'],
    upright: '像诗人一样敏感，一个创意灵感或温暖的消息正在到来。保持开放的心态接收它。',
    reversed: '情绪化、不切实际或错过好消息。也可能是在情感上太容易受伤。' },
  { rank: 'Kn', nameCn: '圣杯骑士',  nameEn: 'Knight of Cups', kws: ['浪漫', '魅力', '理想', '诗意', '追求'],
    upright: '温柔的追求者骑着白马而来。充满爱意的提议、浪漫的邀约或理想主义的憧憬。',
    reversed: '多情却不可靠，或是浪漫只停留在想象里没有落实。' },
  { rank: 'Qn', nameCn: '圣杯王后',  nameEn: 'Queen of Cups',  kws: ['慈悲', '共情', '直觉', '情感智慧', '温柔'],
    upright: '情感智慧极高的人，能够共情和滋养他人。她的温柔像港湾，同时保有自己内心的清澈。',
    reversed: '情绪化、过度依赖或失去自我边界。共情变成了负担。' },
  { rank: 'Kg', nameCn: '圣杯国王',  nameEn: 'King of Cups',   kws: ['情感平衡', '外交', '掌控', '从容', '温和'],
    upright: '能够掌控自己情绪而又温和坚定的领袖。他知道何时表达、何时克制，游刃有余。',
    reversed: '情绪失控、两面三刀或压抑情感导致爆发。' }
];

// 宝剑（风元素 · 思维、沟通、挑战）
const SWORDS_RANKS = [
  { rank: 'A',  nameCn: '宝剑王牌',  nameEn: 'Ace of Swords',   kws: ['真相', '清晰', '突破', '洞见', '决策'],
    upright: '像一道闪电划破迷雾。清晰的想法、真相或突破终于出现，锐利地切破混乱。',
    reversed: '被迷雾蒙蔽或不敢面对真相。想法模糊，需要更多时间思考。' },
  { rank: '2',  nameCn: '宝剑二',    nameEn: 'Two of Swords',   kws: ['僵局', '平衡', '回避', '做决定', '困惑'],
    upright: '你蒙着眼睛，手里举着两把剑不肯放下。一个必须做出的抉择，你在拖延面对它。',
    reversed: '僵局被打破，或终于下定决心。也可能是做了一个仓促的决定。' },
  { rank: '3',  nameCn: '宝剑三',    nameEn: 'Three of Swords', kws: ['心碎', '悲伤', '背叛', '揭露', '痛苦'],
    upright: '真相带来了痛苦，或是被人伤害。三把剑扎进心里，承认这份痛是治愈的第一步。',
    reversed: '伤口开始愈合，或痛苦逐渐减轻。但也要留意有没有形成新的防御。' },
  { rank: '4',  nameCn: '宝剑四',    nameEn: 'Four of Swords',  kws: ['休息', '恢复', '冥想', '暂停', '疗愈'],
    upright: '给自己一张病床，好好休息。经过一段消耗之后，你需要停下来恢复能量。',
    reversed: '被迫休息或休息被打断。也可能是你还没休息够就想撑起来。' },
  { rank: '5',  nameCn: '宝剑五',    nameEn: 'Five of Swords',  kws: ['冲突', '失败', '两面俱伤', '竞争', '代价'],
    upright: '一场你赢了但并不觉得光荣的战斗。胜利有代价，关系的裂痕可能比想象中深。',
    reversed: '放下无谓的胜负，或从冲突中学到了东西。和解的可能出现。' },
  { rank: '6',  nameCn: '宝剑六',    nameEn: 'Six of Swords',   kws: ['过渡', '离开', '平静', '前进', '疗伤'],
    upright: '你离开一片动荡的水域，驶向更平静的彼岸。这段过渡虽然带着过去的伤痕，但前方是宁静。',
    reversed: '在离开的过程中被拖慢，或无法真正放下。还需要更多时间。' },
  { rank: '7',  nameCn: '宝剑七',    nameEn: 'Seven of Swords', kws: ['策略', '隐藏', '策略性撤退', '聪明', '诚实'],
    upright: '用智慧而不是蛮力解决问题。策略是必要的，但也要自问：我对自己诚实吗？',
    reversed: '被抓到了小伎俩，或放弃了小聪明选择光明正大。' },
  { rank: '8',  nameCn: '宝剑八',    nameEn: 'Eight of Swords', kws: ['被困', '束缚', '自我限制', '受害者', '看清'],
    upright: '你被蒙着眼睛、绑着手，但脚下还有空间可以走。很多束缚其实是你给自己套的。',
    reversed: '挣脱束缚，或开始看到原来自己一直有选择。' },
  { rank: '9',  nameCn: '宝剑九',    nameEn: 'Nine of Swords',  kws: ['焦虑', '噩梦', '担心', '恐惧', '失眠'],
    upright: '深夜里被恐惧和焦虑啃噬。很多担心其实被放大了，但当下的痛苦是真实的。',
    reversed: '焦虑减轻，或发现担忧的事并不会真的发生。说出你的恐惧会好很多。' },
  { rank: '10', nameCn: '宝剑十',    nameEn: 'Ten of Swords',   kws: ['结束', '崩溃', '谷底', '痛苦', '黎明前'],
    upright: '看起来是最糟的时刻，一切都跌到谷底。但谷底是反弹的起点——天快亮了。',
    reversed: '开始从谷底回升，或发现情况没有想的那么糟。伤口在愈合。' },
  { rank: 'Pa', nameCn: '宝剑侍从',  nameEn: 'Page of Swords',  kws: ['好奇', '警觉', '好消息', '观察', '小消息'],
    upright: '警觉而好奇的观察者。你正在接收信息、学习新东西，一条重要的消息可能正在路上。',
    reversed: '八卦、冲动发言或信息失误。说话之前先想一想。' },
  { rank: 'Kn', nameCn: '宝剑骑士',  nameEn: 'Knight of Swords',kws: ['果断', '行动', '理想主义', '速度', '锋利'],
    upright: '骑着白马挥剑冲锋的理想主义者。果断、勇敢、直奔目标——但要注意别伤到人。',
    reversed: '鲁莽、暴躁或方向错误。速度太快反而坏事。' },
  { rank: 'Qn', nameCn: '宝剑王后',  nameEn: 'Queen of Swords', kws: ['独立', '清晰', '判断', '边界', '锋利'],
    upright: '头脑清晰、独立果断的思考者。她能一针见血地看到问题，同时保持冷静。',
    reversed: '冷酷、刻薄或被嫉妒蒙蔽了判断力。锋利变成了伤害。' },
  { rank: 'Kg', nameCn: '宝剑国王',  nameEn: 'King of Swords',  kws: ['权威', '理性', '沟通', '知识', '原则'],
    upright: '理性而有原则的权威。他能用清晰的逻辑和公正的判断领导，知识和纪律并重。',
    reversed: '独断、冷漠或滥用权威。理性变成了借口。' }
];

// 星币（土元素 · 物质、稳定、价值）
const PENTACLES_RANKS = [
  { rank: 'A',  nameCn: '星币王牌',  nameEn: 'Ace of Pentacles', kws: ['机会', '新财富', '物质起点', '稳定', '播种'],
    upright: '一颗金子从云端落下。一个物质层面的机会或新的稳定开始，是时候好好耕耘了。',
    reversed: '机会被错过或需要更稳的基础才能抓住。也可能是初期投入失败。' },
  { rank: '2',  nameCn: '星币二',    nameEn: 'Two of Pentacles', kws: ['平衡', '多任务', '灵活', '适应', '优先级'],
    upright: '你在多个事物之间跳舞，游刃有余地保持着平衡。灵活是关键，别让任何一个掉下来。',
    reversed: '手忙脚乱、优先级混乱或平衡被打破。需要重新排序。' },
  { rank: '3',  nameCn: '星币三',    nameEn: 'Three of Pentacles',kws: ['合作', '学习', '质量', '团队', '细节'],
    upright: '精湛技艺的工匠与他人合作，共同创造一件美好的作品。重视质量和协作。',
    reversed: '团队失和、技艺不精或细节被忽略。合作出了问题。' },
  { rank: '4',  nameCn: '星币四',    nameEn: 'Four of Pentacles', kws: ['稳定', '控制', '吝啬', '安全', '执着'],
    upright: '你紧紧抱着已有的东西，不想失去。这给你安全感，但也让你对变化抗拒。',
    reversed: '终于愿意放手或分享，或是发现执着反而让你失去了更多。' },
  { rank: '5',  nameCn: '星币五',    nameEn: 'Five of Pentacles', kws: ['困难', '匮乏', '孤立', '考验', '寻求帮助'],
    upright: '在寒冷中艰难前行，感觉被排除在外。但别绝望——你可能没有注意到身边已有帮助。',
    reversed: '走出困境，或终于接受了帮助。情况开始好转。' },
  { rank: '6',  nameCn: '星币六',    nameEn: 'Six of Pentacles',  kws: ['给予', '接受', '平衡', '慷慨', '互助'],
    upright: '有人给予，有人接受，天平在中间保持平衡。这是关于慷慨与感恩的时刻。',
    reversed: '给予与接受失衡、债务或权力不平等。' },
  { rank: '7',  nameCn: '星币七',    nameEn: 'Seven of Pentacles',kws: ['耐心', '评估', '收获', '耕耘', '等待'],
    upright: '你看着自己种下的植物，等待它们成熟。耐心——好的事物需要时间生长。',
    reversed: '投资回报不及预期，或失去了耐心过早放弃。也可能是重新评估方向。' },
  { rank: '8',  nameCn: '星币八',    nameEn: 'Eight of Pentacles',kws: ['技艺', '专注', '学习', '质量', '精进'],
    upright: '手艺人专注地打磨每一件作品。你正在精进一门技能，专注和勤奋终会带来认可。',
    reversed: '敷衍了事、缺乏动力或追求完美变成了拖延。' },
  { rank: '9',  nameCn: '星币九',    nameEn: 'Nine of Pentacles', kws: ['独立', '富足', '享受', '优雅', '自给自足'],
    upright: '独自享受着自己建立的富足。优雅、自由、自给自足，你值得这份宁静和丰盛。',
    reversed: '财务不稳、失去独立或表面富足实则空虚。' },
  { rank: '10', nameCn: '星币十',    nameEn: 'Ten of Pentacles',  kws: ['家族', '传承', '稳定', '物质圆满', ' legacy'],
    upright: '家族几代人围绕着稳固的财富和幸福。传统、传承和长期的稳定在这里交汇。',
    reversed: '家族矛盾、财务纷争或稳定表面下的暗流。' },
  { rank: 'Pa', nameCn: '星币侍从',  nameEn: 'Page of Pentacles', kws: ['学习', '新机会', '耐心', '实践', '规划'],
    upright: '认真的学习者，手里捧着一枚星币凝视。新机会出现了，脚踏实地去了解它。',
    reversed: '拖延、不切实际或机会来得太慢让你失去耐心。' },
  { rank: 'Kn', nameCn: '星币骑士',  nameEn: 'Knight of Pentacles',kws: ['可靠', '稳定', '勤奋', '保守', '脚踏实地'],
    upright: '稳扎稳打、绝不急躁的骑士。你用耐心和可靠逐步达成目标，一步一个脚印。',
    reversed: '固执、僵化或过于保守。缺乏变通让进度变慢。' },
  { rank: 'Qn', nameCn: '星币王后',  nameEn: 'Queen of Pentacles',kws: ['滋养', '物质支持', '务实', '自然', '养育'],
    upright: '温暖而务实的养育者。她能照顾好自己和他人，在物质世界里创造舒适和安全。',
    reversed: '物质焦虑、过度保护或忽略了自己的需求。' },
  { rank: 'Kg', nameCn: '星币国王',  nameEn: 'King of Pentacles', kws: ['财富', '成功', '稳定', '商人', '掌控'],
    upright: '成功的企业家或管理者。他懂得如何创造和保持物质财富，同时可靠而务实。',
    reversed: '贪婪、物质至上或在成功中失去了生活的平衡。' }
];

// ---------- 把四套花色合并成小阿卡纳 ----------
function buildMinorArcana() {
  const suitsData = [
    { suit: 'wands',     ranks: WANDS_RANKS },
    { suit: 'cups',      ranks: CUPS_RANKS },
    { suit: 'swords',    ranks: SWORDS_RANKS },
    { suit: 'pentacles', ranks: PENTACLES_RANKS }
  ];
  const all = [];
  for (const { suit, ranks } of suitsData) {
    const suitCfg = SUITS[suit];
    for (const r of ranks) {
      all.push({
        id: `mi_${suit}_${r.rank}`,
        type: 'minor',
        rank: r.rank,
        suit: suit,
        suitCn: suitCfg.nameCn,
        suitEn: suitCfg.nameEn,
        element: suitCfg.element,
        nameCn: r.nameCn,
        nameEn: r.nameEn,
        symbol: suitCfg.symbol,       // 小阿卡纳统一用花色 emoji 作为视觉符号
        upright: r.upright,
        reversed: r.reversed,
        keywords: r.kws
      });
    }
  }
  return all;
}

// ---------- 合并成完整牌库 ----------
const ALL_CARDS = [...MAJOR_ARCANA, ...buildMinorArcana()];

// ---------- 导出具象牌 ----------
// 供其他模块 import 时使用
export function getAllCards() { return ALL_CARDS; }

// 按 Fisher-Yates 洗牌，返回前 n 张不重复的牌
// opts: { count?: number, uprightOnly?: boolean }
export function drawCards(opts = {}) {
  const count = opts.count ?? 3;
  const uprightOnly = !!opts.uprightOnly;
  const pool = [...ALL_CARDS];
  // Fisher-Yates
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const drawn = pool.slice(0, count);
  return drawn.map(card => ({
    ...card,
    isReversed: uprightOnly ? false : Math.random() < 0.5
  }));
}

// 三牌阵的三个牌位
export const THREE_CARD_POSITIONS = [
  { key: 'past',   zh: '过去', en: 'Past' },
  { key: 'present',zh: '现在', en: 'Present' },
  { key: 'future', zh: '未来', en: 'Future' }
];

// 默认导出整副牌（调试用）
export default ALL_CARDS;
