// ============================================================
// 塔罗牌占卜网站后端
// 职责：
//   1) 静态文件托管
//   2) 用户注册/登录（文件存储）
//   3) 每用户每日固定今日牌（按 user+date 缓存）
//   4) LLM API 代理（流式 + 本地降级）
// ============================================================

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ------- 配置读取 -------
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_BASE_URL = (process.env.LLM_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
const LLM_MODEL = process.env.LLM_MODEL || 'gpt-3.5-turbo';

// ------- 数据目录（文件存储，Railway 重启可能清，但个人项目够用） -------
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const USERS_FILE = path.join(DATA_DIR, 'users.json');       // { username: { passwordHash, createdAt } }
const TOKENS_FILE = path.join(DATA_DIR, 'tokens.json');     // { token: { username, createdAt } }
const TODAY_FILE  = path.join(DATA_DIR, 'todayCards.json'); // { "username-YYYY-MM-DD": card }

function readJSON(file, def) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); } catch { return def; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
const loadUsers     = () => readJSON(USERS_FILE, {});
const saveUsers     = (u) => writeJSON(USERS_FILE, u);
const loadTokens    = () => readJSON(TOKENS_FILE, {});
const saveTokens    = (t) => writeJSON(TOKENS_FILE, t);
const loadToday     = () => readJSON(TODAY_FILE, {});
const saveToday     = (t) => writeJSON(TODAY_FILE, t);

// ------- 密码哈希 -------
function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw + 'tarot-salt-v1').digest('hex');
}
function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}

// ------- 中间件 -------
app.use(express.json({ limit: '1mb' }));

// 防缓存
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|html|svg)$/)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// 认证中间件：从 Authorization header 或 query 取 token
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : (req.query.token || '');
  const tokens = loadTokens();
  const rec = tokens[token];
  if (!rec) return res.status(401).json({ error: '未登录或登录已过期' });
  req.username = rec.username;
  next();
}

// ============================================================
// 健康检查
// ============================================================
app.get('/api/status', (_req, res) => {
  res.json({
    llmConfigured: !!LLM_API_KEY,
    model: LLM_API_KEY ? LLM_MODEL : null,
    note: LLM_API_KEY
      ? 'LLM 已就绪'
      : '未配置 LLM API Key，仅返回本地模板解读'
  });
});

// ============================================================
// 用户注册 / 登录
// ============================================================

// POST /api/auth/register  { username, password }
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: '用户名和密码都不能为空' });
  if (username.length < 2 || username.length > 20) return res.status(400).json({ error: '用户名 2-20 个字符' });
  if (password.length < 4) return res.status(400).json({ error: '密码至少 4 位' });

  const users = loadUsers();
  if (users[username]) return res.status(409).json({ error: '这个名字已经有人用了，换一个吧' });

  users[username] = {
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };
  saveUsers(users);

  // 注册成功自动登录
  const token = makeToken();
  const tokens = loadTokens();
  tokens[token] = { username, createdAt: new Date().toISOString() };
  saveTokens(tokens);

  res.json({ token, username });
});

// POST /api/auth/login  { username, password }
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: '用户名和密码都不能为空' });

  const users = loadUsers();
  const u = users[username];
  if (!u || u.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: '名字或密码不对' });
  }

  const token = makeToken();
  const tokens = loadTokens();
  tokens[token] = { username, createdAt: new Date().toISOString() };
  saveTokens(tokens);

  res.json({ token, username });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (token) {
    const tokens = loadTokens();
    delete tokens[token];
    saveTokens(tokens);
  }
  res.json({ ok: true });
});

// GET /api/auth/me  检查 token 是否有效
app.get('/api/auth/me', authRequired, (req, res) => {
  res.json({ username: req.username });
});

// ============================================================
// 今日牌：按用户 + 日期 固定
// ============================================================

// GET /api/today  ?token=xxx  →  返回该用户今日的牌（有就返回，没有就随机生成并存）
app.get('/api/today', authRequired, (req, res) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const key = `${req.username}-${today}`;

  const all = loadToday();
  if (all[key]) {
    // 已有：直接返回
    return res.json({ ...all[key], date: today, alreadyDrawn: true });
  }

  // 没有：从 78 张里随机抽一张，按日期做一点种子扰动
  // （不跟日期强绑定，每天都会变，保证新鲜感）
  const cards = require('./public/tarot-data.js').ALL_CARDS;
  const card = cards[Math.floor(Math.random() * cards.length)];
  const isReversed = Math.random() < 0.5;

  // 只存必要字段（不含函数/SVG 那种）
  const slim = {
    id: card.id,
    nameCn: card.nameCn,
    nameEn: card.nameEn,
    type: card.type,
    suit: card.suit,
    suitCn: card.suitCn,
    rank: card.rank,
    element: card.element,
    upright: card.upright,
    reversed: card.reversed,
    keywords: card.keywords,
    isReversed
  };

  all[key] = slim;
  saveToday(all);

  res.json({ ...slim, date: today, alreadyDrawn: false });
});

// ============================================================
// LLM 流式解读（保持原样）
// ============================================================
app.post('/api/interpret', async (req, res) => {
  const { question, cards } = req.body || {};
  if (!Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({ error: 'cards 不能为空' });
  }
  if (!LLM_API_KEY) {
    return res.json({
      degraded: true,
      message: '未配置 LLM API Key，已为你展示本地模板解读。'
    });
  }
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const cardSummary = cards
    .map((c, i) => `${i + 1}. 【${c.position}】${c.nameCn} / ${c.nameEn}（${c.upright ? '正位' : '逆位'}）`)
    .join('\n');
  const userQuestion = question && question.trim() ? `用户的问题是：「${question.trim()}」\n\n` : '';

  const messages = [
    { role: 'system', content: '你是一位温文尔雅、善于共情的塔罗师。请用温暖、清晰、有画面感的中文，基于牌面和牌位给出连贯的综合解读。避免太玄学的措辞，要有实际的心理和行动建议。控制在 300-500 字。' },
    { role: 'user', content: `${userQuestion}本次抽到的三张牌（三牌阵：过去 / 现在 / 未来）是：\n${cardSummary}\n\n请给出一段综合解读。` }
  ];

  if (!global.fetch) {
    res.write(`data: ${JSON.stringify({ degraded: true, message: '运行环境不支持流式请求，请升级 Node 到 18+' })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();
  }

  let upstream;
  try {
    upstream = await global.fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LLM_API_KEY}` },
      body: JSON.stringify({ model: LLM_MODEL, messages, stream: true, temperature: 0.7, max_tokens: 600 })
    });
  } catch (err) {
    res.write(`data: ${JSON.stringify({ degraded: true, message: '连接 LLM 服务失败：' + err.message })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();
  }
  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => '');
    res.write(`data: ${JSON.stringify({ degraded: true, message: 'LLM 接口错误：' + upstream.status + ' ' + errText.slice(0, 200) })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const rawLine = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        const line = rawLine.trim();
        if (!line || !line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') { res.write('data: [DONE]\n\n'); return res.end(); }
        let parsed; try { parsed = JSON.parse(payload); } catch { continue; }
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (delta) res.write(`data: ${JSON.stringify({ token: delta })}\n\n`);
      }
    }
  } catch {}
  res.write('data: [DONE]\n\n');
  res.end();
});

// ============================================================
// 兜底 404
// ============================================================
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
// 启动
// ============================================================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🌙 塔罗牌占卜站已启动：http://localhost:${PORT}`);
    console.log(`  数据目录: ${DATA_DIR}`);
    console.log(`  LLM: ${LLM_API_KEY ? '✅ 已配置' : '⚠️  未配置（本地模板解读）'}`);
  });
}
module.exports = app;
