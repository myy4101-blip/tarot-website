/* ============================================================
   app.js —— 主控制器
   Hash 路由 + 四页面状态机 + 洗牌动画 + 翻牌交互 + 复制
   ============================================================ */

import { ALL_CARDS, drawCards, getCardById, filterByCategory } from './tarot-data.js';
import { getCardSVG } from './card-svgs.js';
import {
  THEMES, interpretSingleCard, synthesizeInterpretation,
  whyToday, buildResultText
} from './interpretation.js';
import {
  getToday, saveToday, getHistory, addHistory, removeHistory,
  getSettings, saveSettings
} from './storage.js';
import { randomYis, randomJis } from './yi-ji-pool.js';

// ---------- DOM 引用 ----------
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// ---------- 全局状态 ----------
const state = {
  view: 'divine',          // 当前 view
  themeKey: null,          // 主题
  spreadKey: null,         // 阵型：'past-present-future' | 'single'
  question: '',
  uprightOnly: false,
  cards: [],               // 本次抽到的牌
  cardReadings: [],        // 每张牌的解读文本
  finalText: '',
  finalStyle: '',
  historyId: null,
  flippingNow: false       // 同一时刻只允许一张在翻
};

const POSITIONS_PPF = ['past', 'present', 'future'];
const POSITION_LABELS = { past: '过去', present: '现在', future: '未来', single: '指引' };
const SPREADS = [
  { key: 'past-present-future', label: '三张牌', sub: '过去 · 现在 · 未来', count: 3 },
  { key: 'single',              label: '单张牌', sub: '问事指引', count: 1 }
];

// ============================================================
// 页面渲染通用：牌面 HTML
// ============================================================

function cardSVG(card) {
  return getCardSVG(card);
}

function cardHTML(card, { size = 'normal', clickable = true, hidden = false, reversed = false } = {}) {
  const rev = (card.isReversed || reversed) ? ' reversed' : '';
  const sizeCls = size === 'mini' ? ' card--mini' : size === 'big' ? ' card card--big' : '';
  const clickCls = clickable ? '' : ' revealed';
  const clickArea = clickable ? `<div class="card-click-area"></div>` : '';
  return `
    <div class="card${rev}${sizeCls}${clickCls}" data-card-id="${card.id}" ${hidden ? 'style="visibility:hidden"' : ''}>
      <div class="card-face card-back">
        <span class="corner tl"></span><span class="corner tr"></span>
        <span class="corner bl"></span><span class="corner br"></span>
      </div>
      <div class="card-face card-front">
        <div class="card-svg">${cardSVG(card)}</div>
        <div class="card-name">${card.nameCn}</div>
        <div class="card-name-en">${card.nameEn}</div>
      </div>
      ${clickArea}
    </div>
  `;
}

// ============================================================
// Hash 路由 + 底部标签栏
// ============================================================

function goView(name) {
  state.view = name;
  $$('.view').forEach(v => v.hidden = v.dataset.view !== name);
  $$('.tab').forEach(t => t.classList.toggle('is-active', t.dataset.go === name));
  // 进入时渲染
  if (name === 'today') renderToday();
  if (name === 'library') renderLibrary();
  if (name === 'history') renderHistory();
  if (name === 'divine') renderDivine();
  history.replaceState(null, '', `#${name}`);
}

window.addEventListener('hashchange', () => {
  const name = location.hash.replace('#','') || 'divine';
  goView(['today','divine','library','history'].includes(name) ? name : 'divine');
});

// ---------- 底部标签栏 ----------
document.addEventListener('click', (e) => {
  const tab = e.target.closest('[data-go]');
  if (tab) {
    e.preventDefault();
    goView(tab.dataset.go);
    return;
  }
  const closer = e.target.closest('[data-drawer-close]');
  if (closer) closeDrawer();
});

// ============================================================
// Toast
// ============================================================
let toastTimer = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.hidden = true, 2000);
}

// ============================================================
// 页面一：今日运势
// ============================================================

function renderToday() {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  $('#today-date').textContent = `今天是 ${dateStr}`;

  let cached = getToday();
  if (!cached) {
    // 用日期做种子抽一张
    const seedSum = [...dateStr].reduce((a,c) => a + c.charCodeAt(0), 0);
    const idx = seedSum % ALL_CARDS.length;
    const uprightOnly = getSettings().uprightOnly;
    const card = { ...ALL_CARDS[idx], isReversed: uprightOnly ? false : seedSum % 2 === 1 };
    saveToday(card, dateStr);
    cached = { card, date: dateStr };
  }

  const c = cached.card;
  const why = whyToday(c, dateStr);
  const yis = randomYis(3);
  const jis = randomJis(3);

  $('#today-body').innerHTML = `
    <div class="today-card-display">
      ${cardHTML(c, { clickable: false })}
    </div>
    <div class="today-info">
      <div class="reading-block" style="text-align:center;">
        <p class="card-title">
          ${c.nameCn}
          <span class="ori-badge ${c.isReversed ? 'ori-rev' : 'ori-up'}">
            ${c.isReversed ? '逆位' : '正位'}
          </span>
        </p>
        <div class="keywords" style="justify-content:center;">
          ${c.keywords.map(k => `<span class="kw">${k}</span>`).join('')}
        </div>
        <div class="yi-ji">
          <div class="yi">✨ 宜：${yis.join(' · ')}</div>
          <div class="ji">⚠️ 忌：${jis.join(' · ')}</div>
        </div>
        <p class="today-why">${why}</p>
        <button class="btn btn--ghost" id="refresh-today">🔄 换一张试试（仅供娱乐）</button>
      </div>
    </div>
  `;

  $('#refresh-today')?.addEventListener('click', () => {
    // 手动清缓存重新抽
    localStorage.removeItem(`${NS}:todayCard`);
    renderToday();
    toast('宇宙给你换了一张～');
  });
}

// ============================================================
// 页面二：占卜（状态机）
// ============================================================

function renderDivine() {
  // 重置所有 stage
  $('#stage-theme').hidden = false;
  $('#stage-spread').hidden = true;
  $('#stage-question').hidden = true;
  $('#stage-shuffle').hidden = true;
  $('#stage-reveal').hidden = true;

  // 主题 chip
  $('#theme-chips').innerHTML = THEMES.map(t =>
    `<button class="chip" data-theme="${t.key}">${t.emoji} ${t.label}</button>`
  ).join('');

  // 阵型
  $('#spread-cards').innerHTML = SPREADS.map(s => `
    <button class="spread-card" data-spread="${s.key}">
      <strong>${s.label}</strong>
      <span>${s.sub}</span>
    </button>
  `).join('');

  // 正逆位开关
  const settings = getSettings();
  $('#upright-only').checked = settings.uprightOnly;

  // 事件：主题
  $$('#theme-chips .chip').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#theme-chips .chip').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.themeKey = btn.dataset.theme;
      $('#stage-theme').hidden = true;
      $('#stage-spread').hidden = false;
    });
  });
  $('#divine-skip-theme')?.addEventListener('click', () => {
    state.themeKey = 'self';
    $('#stage-theme').hidden = true;
    $('#stage-spread').hidden = false;
  });

  // 事件：阵型
  $$('#spread-cards .spread-card').forEach(btn => {
    btn.addEventListener('click', () => {
      state.spreadKey = btn.dataset.spread;
      $('#stage-spread').hidden = true;
      $('#stage-question').hidden = false;
    });
  });
  $('#divine-back-theme')?.addEventListener('click', () => {
    $('#stage-spread').hidden = true;
    $('#stage-theme').hidden = false;
  });

  // 事件：返回阵型
  $('#divine-back-spread')?.addEventListener('click', () => {
    $('#stage-question').hidden = true;
    $('#stage-spread').hidden = false;
  });

  // 正逆位开关
  $('#upright-only').addEventListener('change', (e) => {
    state.uprightOnly = e.target.checked;
    saveSettings({ uprightOnly: e.target.checked });
  });

  // 开始占卜
  $('#divine-start')?.addEventListener('click', startDivination);
  $('#divine-restart')?.addEventListener('click', () => {
    if (confirm('确定要重新开始？当前进度会丢失。')) {
      renderDivine();
    }
  });
  $('#copy-result')?.addEventListener('click', copyResult);
  $('#save-result')?.addEventListener('click', saveResultToHistory);
}

function startDivination() {
  const question = $('#question-input').value.trim();
  state.question = question;

  $('#stage-question').hidden = true;
  $('#stage-shuffle').hidden = false;
  runShuffleAnimation().then(skip => {
    if (!skip) {
      // 抽牌
      const spread = SPREADS.find(s => s.key === state.spreadKey);
      state.cards = drawCards(spread.count, { uprightOnly: state.uprightOnly });
    }
    // 进入翻牌
    $('#stage-shuffle').hidden = true;
    $('#stage-reveal').hidden = false;
    renderRevealStage();
  });
}

// ---------- 洗牌动画 ----------
let shuffleSkip = false;

function runShuffleAnimation() {
  return new Promise(resolve => {
    shuffleSkip = false;
    const area = $('#shuffle-area');
    area.innerHTML = '';

    // 双击跳过
    let lastTap = 0;
    const dblTap = (e) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        shuffleSkip = true;
        cleanup();
        resolve(true);
      }
      lastTap = now;
    };
    const cleanup = () => area.removeEventListener('click', dblTap);
    area.addEventListener('click', dblTap);

    // 生成一堆 mini 牌
    const STACK_COUNT = 18;
    const stack = document.createElement('div');
    stack.className = 'shuffle-stack';
    area.appendChild(stack);

    const miniCards = [];
    for (let i = 0; i < STACK_COUNT; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute; width:70px; height:112px;
        border-radius:8px;
        background: linear-gradient(135deg, var(--gold-lo), var(--gold-hi), var(--gold-lo));
        left: 50%; top: 50%;
        transform: translate(-50%,-50%);
        opacity: 0;
      `;
      area.appendChild(el);
      miniCards.push(el);
    }

    // 散开（1.2s）
    const scatterTimer = setTimeout(() => {
      miniCards.forEach((el, i) => {
        const angle = (i / STACK_COUNT) * Math.PI * 2;
        const dist = 70 + Math.random() * 40;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        const rot = (Math.random() - 0.5) * 120;
        el.animate([
          { transform: 'translate(-50%,-50%) scale(.6)', opacity: 0 },
          { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rot}deg) scale(1)`, opacity: 1 }
        ], { duration: 600, delay: i * 20, easing: 'ease-out', fill: 'forwards' });
      });
    }, 100);

    // 收拢（1.2s）
    const gatherTimer = setTimeout(() => {
      miniCards.forEach((el, i) => {
        el.animate([
          { transform: getComputedTransform(el), opacity: 1 },
          { transform: 'translate(-50%,-50%) rotate(0) scale(.9)', opacity: 1 }
        ], { duration: 600, delay: i * 15, easing: 'cubic-bezier(.5,-.2,.5,1.2)', fill: 'forwards' });
      });
    }, 1200);

    // 结束
    const endTimer = setTimeout(() => {
      cleanup();
      if (!shuffleSkip) {
        area.innerHTML = '';
        resolve(false);
      }
    }, 2400);

    // 跳过也会触发 resolve
    const checkSkip = setInterval(() => {
      if (shuffleSkip) {
        clearTimeout(scatterTimer);
        clearTimeout(gatherTimer);
        clearTimeout(endTimer);
        clearInterval(checkSkip);
        area.innerHTML = '';
        resolve(true);
      }
    }, 50);
  });
}

// 工具：获取当前 transform
function getComputedTransform(el) {
  const cs = getComputedStyle(el);
  const m = cs.transform;
  if (m === 'none') return 'translate(-50%,-50%)';
  return m;
}

// ---------- 翻牌阶段 ----------
function renderRevealStage() {
  const spread = SPREADS.find(s => s.key === state.spreadKey);
  const positions = state.spreadKey === 'single' ? ['single'] : POSITIONS_PPF;

  // 逐张落位，间隔 120ms
  const row = $('#spread-row');
  row.innerHTML = '';
  state.cards.forEach((card, i) => {
    setTimeout(() => {
      const posLabel = positions[i];
      const wrap = document.createElement('div');
      wrap.style.display = 'flex';
      wrap.style.flexDirection = 'column';
      wrap.style.alignItems = 'center';
      wrap.style.gap = '6px';
      wrap.style.opacity = '0';
      wrap.style.transform = 'translateY(20px)';
      wrap.innerHTML = `
        <span style="font-size:12px; color:var(--gold-lo); letter-spacing:2px;">
          ${POSITION_LABELS[posLabel]}
        </span>
        ${cardHTML(card, { clickable: true })}
      `;
      row.appendChild(wrap);
      wrap.animate([
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 300, easing: 'ease-out', fill: 'forwards' });
    }, i * 120);
  });

  // 翻牌事件（每张翻完后生成解读）
  $('#spread-row').addEventListener('click', async (e) => {
    const cardEl = e.target.closest('.card');
    if (!cardEl || cardEl.classList.contains('flipped')) return;
    if (state.flippingNow) return;
    state.flippingNow = true;

    cardEl.classList.add('flipping');
    cardEl.classList.add('flipped');

    await new Promise(r => setTimeout(r, 650)); // 600ms 翻完
    cardEl.classList.add('revealed');
    cardEl.classList.remove('flipping');
    state.flippingNow = false;

    // 生成这张牌的解读
    const idx = [...row.querySelectorAll('.card')].indexOf(cardEl);
    generateCardReading(idx, positions);
  });

  $('#final-block').hidden = true;
}

function generateCardReading(idx, positions) {
  const card = state.cards[idx];
  const posKey = positions[idx];
  const text = interpretSingleCard(card, posKey, state.themeKey);

  state.cardReadings[idx] = {
    posCn: POSITION_LABELS[posKey],
    text
  };

  const readings = $('#readings');
  // 如果这是最后一张，先清空再全部渲染（保证顺序）
  if (state.cardReadings.filter(Boolean).length === state.cards.length) {
    // 全部翻完
    readings.innerHTML = state.cardReadings.map((r, i) => readingHTML(state.cards[i], r)).join('');
    generateFinal(positions);
  } else {
    // 只渲染当前这张
    readings.insertAdjacentHTML('beforeend', readingHTML(card, { posCn: POSITION_LABELS[posKey], text }));
  }
}

function readingHTML(card, r) {
  return `
    <div class="reading-block">
      <div class="pos-label">${r.posCn}</div>
      <div class="card-title">
        ${card.nameCn}
        <span class="ori-badge ${card.isReversed ? 'ori-rev' : 'ori-up'}">
          ${card.isReversed ? '逆位' : '正位'}
        </span>
      </div>
      <p>${r.text}</p>
      <div class="keywords">
        ${card.keywords.map(k => `<span class="kw">${k}</span>`).join('')}
      </div>
    </div>
  `;
}

function generateFinal(positions) {
  const result = synthesizeInterpretation(state.cards, positions, state.themeKey);
  state.finalText = result.text;
  state.finalStyle = result.styleName;

  const finalBlock = $('#final-block');
  finalBlock.hidden = false;

  // 综合解读渲染（打字机效果）
  const readings = $('#readings');
  const div = document.createElement('div');
  div.className = 'reading-block';
  div.innerHTML = `<div class="pos-label">综合解读 · ${result.styleName}</div>
                   <p id="final-text" style="white-space:pre-wrap;">●</p>`;
  readings.appendChild(div);

  typeWriter($('#final-text'), result.text);
}

function typeWriter(el, text) {
  let i = 0;
  el.textContent = '';
  const timer = setInterval(() => {
    if (i >= text.length) {
      clearInterval(timer);
      return;
    }
    el.textContent += text[i++];
  }, 18);
}

// ---------- 复制 & 保存 ----------
function copyResult() {
  const theme = THEMES.find(t => t.key === state.themeKey);
  const spread = SPREADS.find(s => s.key === state.spreadKey);
  const text = buildResultText({
    question: state.question,
    themeLabel: theme?.label || '自我',
    spreadLabel: spread?.label || '单张牌',
    cards: state.cards,
    cardReadings: state.cardReadings,
    finalText: state.finalText
  });
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast('✅ 已复制到剪贴板'));
  } else {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    toast('✅ 已复制');
  }
}

function saveResultToHistory() {
  const theme = THEMES.find(t => t.key === state.themeKey);
  const spread = SPREADS.find(s => s.key === state.spreadKey);
  const entry = {
    id: Date.now().toString(36),
    date: new Date().toISOString(),
    question: state.question,
    themeLabel: theme?.label,
    spreadLabel: spread?.label,
    cards: state.cards.map(c => ({ id: c.id, nameCn: c.nameCn, isReversed: c.isReversed })),
    cardReadings: state.cardReadings,
    finalText: state.finalText
  };
  addHistory(entry);
  state.historyId = entry.id;
  toast('💾 已保存到记录');
}

// ============================================================
// 页面三：牌库
// ============================================================

let libFilter = 'all';
let libSearch = '';

function renderLibrary() {
  const filters = [
    { key: 'all',        label: '全部' },
    { key: 'major',      label: '大阿卡纳' },
    { key: 'wands',      label: '权杖' },
    { key: 'cups',       label: '圣杯' },
    { key: 'swords',     label: '宝剑' },
    { key: 'pentacles',  label: '星币' }
  ];
  $('#lib-filters').innerHTML = filters.map(f =>
    `<button class="lib-filter${f.key === libFilter ? ' is-active' : ''}" data-filter="${f.key}">${f.label}</button>`
  ).join('');

  // 搜索 + 筛选
  let list = filterByCategory(libFilter);
  if (libSearch) {
    const q = libSearch.toLowerCase();
    list = list.filter(c =>
      c.nameCn.includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.keywords.some(k => k.includes(q))
    );
  }

  $('#lib-grid').innerHTML = list.map(c => `
    <button class="lib-item" data-card="${c.id}">
      <div class="mini-card">
        <svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg" style="width:40px;height:50px;color:var(--gold-lo);">
          ${svgMajorOrMinor(c)}
        </svg>
        <div class="nm">${c.nameCn}</div>
        <div class="rank">${c.suitCn || ''}${c.rank}</div>
      </div>
      <span class="lb">${c.nameCn}</span>
    </button>
  `).join('');

  // 事件
  $$('.lib-filter').forEach(b => b.addEventListener('click', () => {
    libFilter = b.dataset.filter;
    renderLibrary();
  }));
  $('#lib-search').oninput = (e) => { libSearch = e.target.value; renderLibrary(); };
  $$('#lib-grid .lib-item').forEach(b => b.addEventListener('click', () => openDrawer(b.dataset.card)));
}

function svgMajorOrMinor(card) {
  return getCardSVG(card);
}

// ============================================================
// 页面四：记录
// ============================================================

function renderHistory() {
  const list = getHistory();
  $('#history-list').innerHTML = '';
  $('#history-empty').hidden = list.length > 0;

  list.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'history-item';
    const d = new Date(entry.date);
    div.innerHTML = `
      <div class="h-top">
        <span class="h-date">${d.toLocaleString('zh-CN')}</span>
        <span class="h-spread">${entry.themeLabel || ''} · ${entry.spreadLabel}</span>
      </div>
      ${entry.question ? `<div class="h-q">💬 ${entry.question}</div>` : ''}
      <div class="h-cards">
        ${entry.cards.map(c => `<span>${c.nameCn}${c.isReversed ? '（逆）' : ''}</span>`).join('')}
      </div>
      <div class="h-actions">
        <button data-view-entry="${entry.id}">👁 查看</button>
        <button data-copy-entry="${entry.id}">📋 复制</button>
        <button data-del-entry="${entry.id}">🗑 删除</button>
      </div>
    `;
    $('#history-list').appendChild(div);
  });

  // 事件
  document.querySelectorAll('[data-del-entry]').forEach(b => {
    b.addEventListener('click', () => {
      if (confirm('删除这条记录？')) {
        removeHistory(b.dataset.delEntry);
        renderHistory();
      }
    });
  });
  document.querySelectorAll('[data-copy-entry]').forEach(b => {
    b.addEventListener('click', () => {
      const entry = list.find(e => e.id === b.dataset.copyEntry);
      if (!entry) return;
      const text = buildResultText({
        question: entry.question,
        themeLabel: entry.themeLabel,
        spreadLabel: entry.spreadLabel,
        cards: entry.cards.map(c => ({ ...c, ...getCardById(c.id) })),
        cardReadings: entry.cardReadings,
        finalText: entry.finalText
      });
      navigator.clipboard?.writeText(text);
      toast('✅ 已复制');
    });
  });
  document.querySelectorAll('[data-view-entry]').forEach(b => {
    b.addEventListener('click', () => {
      const entry = list.find(e => e.id === b.dataset.viewEntry);
      if (entry) {
        alert(entry.finalText);
      }
    });
  });
}

// ============================================================
// 抽屉：牌库详情
// ============================================================
let drawerOri = 'up';

function openDrawer(cardId) {
  const card = getCardById(cardId);
  if (!card) return;
  drawerOri = 'up';
  renderDrawer(card);
  $('#card-drawer').hidden = false;
}

function renderDrawer(card) {
  const meaning = drawerOri === 'up' ? card.upright : card.reversed;
  const flipClass = drawerOri === 'up' ? '' : ' reversed';
  const yiList = randomYis(3).join(' · ');
  const jiList = randomJis(3).join(' · ');

  $('#drawer-body').innerHTML = `
    <div class="card${flipClass} card-big" style="position:relative;width:160px;height:260px;">
      <div class="card-face card-back">
        <span class="corner tl"></span><span class="corner tr"></span>
        <span class="corner bl"></span><span class="corner br"></span>
      </div>
      <div class="card-face card-front flipped" style="transform:rotateY(180deg);">
        <div class="card-svg" style="flex:1;display:flex;align-items:center;justify-content:center;">
          <svg viewBox="0 0 120 192" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;max-height:150px;color:var(--gold-lo);">
            ${cardSVG(card)}
          </svg>
        </div>
        <div class="card-name">${card.nameCn}</div>
        <div class="card-name-en">${card.nameEn}</div>
      </div>
    </div>
    <h2>${card.nameCn} <span style="font-size:16px;color:var(--ink-dim);">${card.nameEn}</span></h2>
    <div style="text-align:center;font-size:13px;color:var(--ink-dim);">
      ${card.type === 'major' ? '大阿卡纳' : (card.suitCn + ' · ' + card.element + '元素')} · ${card.rank}
    </div>
    <div class="ori-toggle">
      <button class="${drawerOri === 'up' ? 'is-active' : ''}" data-ori="up">正位</button>
      <button class="${drawerOri === 'rev' ? 'is-active' : ''}" data-ori="rev">逆位</button>
    </div>
    <section>
      <h3>释义</h3>
      <p>${meaning}</p>
    </section>
    <section>
      <h3>关键词</h3>
      <div class="keywords" style="justify-content:center;">
        ${card.keywords.map(k => `<span class="kw">${k}</span>`).join('')}
      </div>
    </section>
    <section>
      <h3>宜 / 忌</h3>
      <div class="yi-ji">
        <div class="yi">✨ 宜：${yiList}</div>
        <div class="ji">⚠️ 忌：${jiList}</div>
      </div>
    </section>
  `;

  // 正逆位切换
  $$('#drawer-body .ori-toggle button').forEach(b => {
    b.addEventListener('click', () => {
      drawerOri = b.dataset.ori;
      renderDrawer(card);
    });
  });
}

function closeDrawer() {
  $('#card-drawer').hidden = true;
}

// ============================================================
// 启动
// ============================================================

// 从 hash 恢复
const initHash = (location.hash || '#divine').replace('#', '');
if (['today','divine','library','history'].includes(initHash)) {
  goView(initHash);
} else {
  goView('divine');
}
