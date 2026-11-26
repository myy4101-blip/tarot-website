// ============================================================
// 塔罗占卜 · 主流程控制器
// 阶段: intro → shuffling → cards → interpret
// ============================================================

import { drawCards, THREE_CARD_POSITIONS, getAllCards } from './tarot-data.js';
import { interpretSingleCard, synthesizeLocalInterpretation } from './interpretation.js';
import { getCardSVG } from './card-svgs.js';

// ---------- 全局状态 ----------
const state = {
  stage: 'intro',
  question: '',
  uprightOnly: false,
  drawnCards: [],          // [{...card, positionKey, positionZh, isReversed}]
  flippedCount: 0,
  flipQueue: [],
  aiStreaming: false,
  followupHistory: []      // 格式 [{role:'user'|'assistant', content:string}]
};

// ---------- DOM 引用 ----------
const $ = (sel) => document.querySelector(sel);
const el = {
  intro:     $('#stageIntro'),
  shuffling: $('#stageShuffling'),
  cards:     $('#stageCards'),
  interpret: $('#stageInterpret'),

  questionInput: $('#questionInput'),
  uprightOnly:   $('#uprightOnly'),
  btnStart:      $('#btnStart'),
  btnReset:      $('#btnReset'),
  deckArea:      $('#deckArea'),

  cardsRow:    $('.cards-row'),
  revealHint:  $('#revealHint'),

  interpretBody:   $('#interpretBody'),
  interpretLoading:$('#interpretLoading'),
  interpretHint:   $('#interpretHint'),
  interpretSource:  $('#interpretSource'),

  cardsReadings: null,   // 动态创建
  readingBlocks: null,   // 动态创建

  followupInput:  $('#followupInput'),
  btnFollowup:    $('#btnFollowup'),
  followupHistory:$('#followupHistory'),

  toast: $('#toast')
};

// ---------- Toast 工具 ----------
function toast(msg, ms = 2500) {
  el.toast.textContent = msg;
  el.toast.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.toast.classList.add('hidden'), ms);
}

// ---------- 阶段切换 ----------
function showStage(name) {
  state.stage = name;
  el.intro.classList.toggle('hidden',     name !== 'intro');
  el.shuffling.classList.toggle('hidden', name !== 'shuffling');
  el.cards.classList.toggle('hidden',     name !== 'cards');
  el.interpret.classList.toggle('hidden', name !== 'interpret');
}

// ---------- 初始化绑定 ----------
function bind() {
  el.btnStart.addEventListener('click', onStart);
  el.btnReset.addEventListener('click', onReset);
  el.uprightOnly.addEventListener('change', () => {
    state.uprightOnly = el.uprightOnly.checked;
  });

  // 追问输入监听
  el.followupInput.addEventListener('input', () => {
    el.btnFollowup.disabled = el.followupInput.value.trim().length === 0 || state.aiStreaming;
  });
  el.btnFollowup.addEventListener('click', onFollowup);
  // Enter 发送（Shift+Enter 换行）
  el.followupInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !state.aiStreaming) {
      e.preventDefault();
      onFollowup();
    }
  });

  // 回车快捷开始
  el.questionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onStart();
    }
  });
}

// ---------- 阶段 1: 开始 ----------
function onStart() {
  state.question = el.questionInput.value.trim();
  state.uprightOnly = el.uprightOnly.checked;

  // 进入洗牌
  showStage('shuffling');
  startShuffle();
}

// ---------- 阶段 2: 洗牌动画 ----------
function startShuffle() {
  el.deckArea.innerHTML = '';
  el.deckArea.classList.add('shuffling');

  // 取 24 张 mini-card 铺在牌堆区域（不是真的 78，太多会溢出）
  const miniCount = 24;
  const cards = getAllCards();
  for (let i = 0; i < miniCount; i++) {
    const mini = document.createElement('div');
    mini.className = 'mini-card';
    const deg = (Math.random() - 0.5) * 60;
    const spread = 160;
    mini.style.setProperty('--rot', deg + 'deg');
    mini.style.setProperty('--sx', ((Math.random() - 0.5) * spread * 2) + 'px');
    mini.style.setProperty('--sy', ((Math.random() - 0.5) * spread) + 'px');
    // 随机轻微的错层
    mini.style.zIndex = i;
    mini.style.left = `calc(50% + ${(Math.random() - 0.5) * 10}px)`;
    el.deckArea.appendChild(mini);
  }

  // 动画总时长 2.4s（散开 1.2s + 收拢 1.2s）+ 300ms 缓冲
  setTimeout(() => {
    el.deckArea.classList.remove('shuffling');
    // 清空 mini-card
    el.deckArea.innerHTML = '';
    drawAndShow();
  }, 2700);
}

// ---------- 抽牌并渲染 ----------
function drawAndShow() {
  // 抽 3 张 + 绑定牌位
  const rawCards = drawCards({ count: 3, uprightOnly: state.uprightOnly });
  state.drawnCards = rawCards.map((card, i) => ({
    ...card,
    positionKey: THREE_CARD_POSITIONS[i].key,
    positionZh: THREE_CARD_POSITIONS[i].zh,
    positionEn: THREE_CARD_POSITIONS[i].en
  }));
  state.flippedCount = 0;

  // 渲染三张卡
  el.cardsRow.innerHTML = '';
  state.drawnCards.forEach((card, i) => {
    const slot = document.createElement('div');
    slot.className = 'card-slot';
    slot.dataset.index = i;

    const label = document.createElement('div');
    label.className = 'position-label';
    label.innerHTML = `<span class="zh">${card.positionZh}</span><span>${card.positionEn}</span>`;

    slot.appendChild(label);

    // 卡牌本体（3D 翻牌结构）
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.index = i;
    if (card.isReversed) cardEl.classList.add('reversed');

    // 牌背（默认可见）
    const back = document.createElement('div');
    back.className = 'card-face card-back';
    back.innerHTML = `
      <span class="corner tl"></span>
      <span class="corner tr"></span>
      <span class="corner bl"></span>
      <span class="corner br"></span>
    `;

    // 牌面（翻转后可见，已做 rotateY(180deg)）
    const front = document.createElement('div');
    front.className = 'card-face card-front';
    front.innerHTML = `
      <div class="rank">${card.type === 'major' ? card.rank : (card.suitCn + ' · ' + card.rank)}</div>
      <div class="symbol-area">${getCardSVG(card)}</div>
      <div class="name-cn">${card.nameCn}</div>
      <div class="name-en">${card.nameEn}</div>
    `;

    cardEl.appendChild(back);
    cardEl.appendChild(front);

    // 点击翻开
    cardEl.addEventListener('click', () => flipCard(i));

    slot.appendChild(cardEl);
    el.cardsRow.appendChild(slot);
  });

  // 清空上一轮的 reading blocks
  if (el.cardsReadings) el.cardsReadings.remove();
  el.cardsReadings = null;

  showStage('cards');
  el.revealHint.textContent = '点击卡牌逐一翻开';
}

// ---------- 翻牌 ----------
function flipCard(index) {
  const cardEl = el.cardsRow.querySelector(`.card[data-index="${index}"]`);
  if (!cardEl || cardEl.classList.contains('flipped')) return;

  const card = state.drawnCards[index];

  // 触发翻转
  cardEl.classList.add('flipping');
  cardEl.classList.add('flipped');

  // 翻转完成后（CSS 过渡 0.35s）显示解读块
  setTimeout(() => {
    cardEl.classList.remove('flipping');
    showReadingForCard(index, card);
    state.flippedCount++;

    // 全部翻开后
    if (state.flippedCount >= state.drawnCards.length) {
      el.revealHint.textContent = '';
      setTimeout(() => {
        showInterpretStage();
      }, 800);
    } else {
      el.revealHint.textContent = `已翻开 ${state.flippedCount}/${state.drawnCards.length}，继续翻下一张`;
    }
  }, 380);
}

// ---------- 单张牌解读块 ----------
function showReadingForCard(index, card) {
  // 确保 cardsReadings 容器存在
  if (!el.cardsReadings) {
    el.cardsReadings = document.createElement('div');
    el.cardsReadings.className = 'cards-readings';
    el.cards.appendChild(el.cardsReadings);
  }

  // 生成解读文本
  const paragraphs = interpretSingleCard(card, card.positionKey);
  const meaningHtml = paragraphs.map(p => `<p>${p}</p>`).join('');

  const kwHtml = card.keywords.map(k => `<span>${k}</span>`).join('');

  const block = document.createElement('div');
  block.className = 'card-reading';
  block.dataset.index = index;

  block.innerHTML = `
    <div class="reading-header">
      <span class="tag-${card.isReversed ? 'reversed' : 'upright'}">
        ${card.isReversed ? '逆位' : '正位'}
      </span>
      <strong>${card.nameCn}</strong>
      <span style="color:var(--ink-dim);font-style:italic;font-size:12px;">${card.nameEn}</span>
      <span style="margin-left:auto;color:var(--gold);font-size:12px;letter-spacing:2px;">${card.positionZh}</span>
    </div>
    <div class="reading-meaning">${meaningHtml}</div>
    <div class="reading-keywords">${kwHtml}</div>
  `;

  el.cardsReadings.appendChild(block);
}

// ---------- 阶段 4: 综合解读 ----------
async function showInterpretStage() {
  showStage('interpret');

  // 先显示本地解读作为兜底
  const localInterp = synthesizeLocalInterpretation(state.drawnCards, state.question);

  // 检查是否配置了 LLM（通过 /api/status）
  let llmReady = false;
  try {
    const st = await fetch('/api/status');
    const json = await st.json();
    llmReady = !!json.llmConfigured;
  } catch {
    llmReady = false;
  }

  if (!llmReady) {
    // 无 LLM → 直接显示本地解读
    renderTextAsStream(localInterp, el.interpretBody, {
      hideLoading: true,
      onDone: () => {
        el.interpretSource.textContent = '（本地模板解读 · 未配置 LLM API Key）';
      }
    });
    return;
  }

  // 有 LLM → 先显示本地解读占位 + 加载动画，然后流式返回 AI 解读覆盖/追加
  el.interpretLoading.style.display = '';
  el.interpretHint.textContent = '正在连接星象...';
  el.interpretSource.textContent = '';

  try {
    // 先发本地解读作为即时体验（后台继续请求 LLM）
    renderTextAsStream(localInterp, el.interpretBody, {
      hideLoading: false,
      speed: 8,
      doneMarker: false
    });

    // 构造请求 payload
    const payload = {
      question: state.question,
      cards: state.drawnCards.map(c => ({
        position: c.positionZh,
        nameCn: c.nameCn,
        nameEn: c.nameEn,
        upright: !c.isReversed,
        keywords: c.keywords,
        type: c.type,
        suit: c.suitCn || c.element
      }))
    };

    // 等待本地打字机动画至少完成 60% 再开始 LLM 展示
    await new Promise(r => setTimeout(r, 1500));

    // 清空 loading 提示，追加一个分隔然后是 AI 解读
    const aiSeg = document.createElement('div');
    aiSeg.style.marginTop = '24px';
    aiSeg.innerHTML = `<div style="font-size:12px;color:var(--gold);letter-spacing:3px;margin-bottom:8px;">— 来自 AI 塔罗师的补充 —</div>`;
    el.interpretBody.appendChild(aiSeg);

    const aiContentDiv = document.createElement('div');
    aiContentDiv.id = 'aiContent';
    aiSeg.appendChild(aiContentDiv);

    await streamAIInterpretation('/api/interpret', payload, aiContentDiv);

    el.interpretSource.textContent = '（本地解读 + AI 个性化解读）';
  } catch (err) {
    // 出错 → 降级到本地解读
    console.error(err);
    el.interpretLoading.style.display = 'none';
    renderTextAsStream(localInterp, el.interpretBody, { hideLoading: true });
    el.interpretSource.textContent = '（本地模板解读 · AI 服务暂不可用）';
  }
}

// ---------- 流式 LLM 请求 ----------
async function streamAIInterpretation(endpoint, payload, targetDiv, opts = {}) {
  state.aiStreaming = true;

  // 确保 loading 是隐藏的
  el.interpretLoading.style.display = 'none';

  let fullText = '';

  // 带一个光标开始
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'cursor';
  targetDiv.appendChild(cursorSpan);

  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // 如果返回的是 JSON（降级响应），直接显示
    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('text/event-stream')) {
      const json = await resp.json();
      if (json.degraded) {
        targetDiv.innerHTML = '';
        targetDiv.appendChild(cursorSpan);
        appendWithTypewriter(targetDiv, json.message);
      }
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx;
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line.startsWith('data:')) continue;
        const payloadStr = line.slice(5).trim();
        if (!payloadStr) continue;
        if (payloadStr === '[DONE]') {
          break;
        }
        let parsed; try { parsed = JSON.parse(payloadStr); } catch { continue; }

        if (parsed.token) {
          // 直接插入到光标前面（让光标保持在末尾闪烁）
          const textNode = document.createTextNode(parsed.token);
          targetDiv.insertBefore(textNode, cursorSpan);
          fullText += parsed.token;
        } else if (parsed.degraded) {
          // 中间降级：清空内容显示提示
          targetDiv.innerHTML = '';
          targetDiv.appendChild(cursorSpan);
          appendWithTypewriter(targetDiv, parsed.message);
          fullText += parsed.message;
        }
      }
    }

    // 保存到 followup 历史
    state.followupHistory.push({ role: 'assistant', content: fullText });
  } catch (err) {
    const fallback = document.createElement('p');
    fallback.style.color = 'var(--ink-dim)';
    fallback.textContent = '（AI 解读暂时不可用，建议使用上方的本地解读）';
    targetDiv.insertBefore(fallback, cursorSpan);
  } finally {
    cursorSpan.remove();
    state.aiStreaming = false;
    el.btnFollowup.disabled = false;
  }
}

// ---------- 本地打字机渲染 ----------
function renderTextAsStream(text, targetDiv, opts = {}) {
  const { hideLoading = true, speed = 12, doneMarker = true } = opts;

  if (hideLoading) el.interpretLoading.style.display = 'none';

  targetDiv.innerHTML = '';
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'cursor';
  targetDiv.appendChild(cursorSpan);

  appendWithTypewriter(targetDiv, text, { cursorSpan, speed });

  if (doneMarker) {
    // 打字结束后保存到 history
    state.followupHistory.push({ role: 'assistant', content: text });
  }
}

// 通用打字机
function appendWithTypewriter(container, text, opts = {}) {
  const cursor = opts.cursorSpan || (() => {
    // 如果没传 cursor，找最后一个 cursor 或新建
    const existing = container.querySelector('.cursor');
    if (existing) return existing;
    const c = document.createElement('span');
    c.className = 'cursor';
    container.appendChild(c);
    return c;
  })();

  const speed = opts.speed || 10;
  let i = 0;
  // 分段处理换行
  const lines = text.split('\n');

  function next() {
    if (i >= lines.length) return;
    const line = lines[i];
    if (i > 0) {
      // 换行：插入一个 <br>
      const br = document.createElement('br');
      container.insertBefore(br, cursor);
    }
    let j = 0;
    function charNext() {
      if (j >= line.length) {
        i++;
        setTimeout(next, speed);
        return;
      }
      const node = document.createTextNode(line[j++]);
      container.insertBefore(node, cursor);
      setTimeout(charNext, speed);
    }
    charNext();
  }
  next();
}

// ---------- 追问 ----------
async function onFollowup() {
  const question = el.followupInput.value.trim();
  if (!question || state.aiStreaming) return;

  // 插入用户气泡
  appendBubble('user', question);
  state.followupHistory.push({ role: 'user', content: question });
  el.followupInput.value = '';
  el.btnFollowup.disabled = true;

  // 创建 AI 气泡容器
  const aiBubble = appendBubble('ai', '');

  // 先加一个光标占位
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'cursor';
  aiBubble.appendChild(cursorSpan);

  // 先尝试调用后端
  try {
    const resp = await fetch('/api/followup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: state.followupHistory.slice(-12), question })
    });

    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('text/event-stream')) {
      const json = await resp.json();
      if (json.degraded) {
        // 降级：本地简单回复
        const fallback = buildLocalFollowup(question);
        aiBubble.innerHTML = '';
        aiBubble.appendChild(cursorSpan);
        appendWithTypewriter(aiBubble, fallback, { cursorSpan });
        state.followupHistory.push({ role: 'assistant', content: fallback });
      }
      return;
    }

    // SSE 流式
    const reader = resp.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullText = '';

    state.aiStreaming = true;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line.startsWith('data:')) continue;
        const ps = line.slice(5).trim();
        if (!ps || ps === '[DONE]') continue;
        let parsed; try { parsed = JSON.parse(ps); } catch { continue; }
        if (parsed.token) {
          const tn = document.createTextNode(parsed.token);
          aiBubble.insertBefore(tn, cursorSpan);
          fullText += parsed.token;
        } else if (parsed.degraded) {
          aiBubble.innerHTML = parsed.message;
        }
      }
    }

    cursorSpan.remove();
    state.followupHistory.push({ role: 'assistant', content: fullText });
    state.aiStreaming = false;
  } catch (err) {
    console.error(err);
    aiBubble.innerHTML = '（追问服务暂时不可用）';
    state.aiStreaming = false;
  }
}

// 本地追问降级（简单模板回复）
function buildLocalFollowup(q) {
  const templates = [
    `关于你问的"${q}"——这是个好问题。不过目前追问的 AI 服务还没配置好，你可以先参考上方的三张牌解读，结合你的问题自己再想一想。塔罗的真正价值常常不在于给你一个答案，而在于帮你看见自己已经知道的东西。`,
    `"${q}" 这个方向很值得深挖。如果你之后配置好了 LLM API，我可以给你更具体的分析。现在建议你可以把三张牌的解读记下来，过几天再回看，可能会有新的启发。`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

// 气泡
function appendBubble(role, text) {
  const b = document.createElement('div');
  b.className = `followup-bubble ${role}`;
  b.textContent = text;
  el.followupHistory.appendChild(b);
  // 滚动到底
  el.followupHistory.parentElement.scrollTop = el.followupHistory.parentElement.scrollHeight;
  return b;
}

// ---------- 重置 ----------
function onReset() {
  state.drawnCards = [];
  state.flippedCount = 0;
  state.followupHistory = [];
  el.cardsRow.innerHTML = '';
  el.deckArea.innerHTML = '';
  el.interpretBody.innerHTML = '';
  el.interpretLoading.style.display = '';
  el.interpretSource.textContent = '';
  el.followupHistory.innerHTML = '';
  el.questionInput.value = '';
  if (el.cardsReadings) el.cardsReadings.remove();
  el.cardsReadings = null;
  showStage('intro');
}

// ---------- 启动 ----------
document.addEventListener('DOMContentLoaded', () => {
  bind();
  showStage('intro');
});
