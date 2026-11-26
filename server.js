// ============================================================
// 塔罗牌占卜网站后端（安全加固版）
// 职责：
//   1) 静态文件托管
//   2) 用户注册/登录（文件存储 + 随机 salt 密码哈希）
//   3) 每用户每日固定今日牌（按 user+date 缓存）
//   4) LLM API 代理（流式 + 本地降级 + 登录要求 + 限流）
// ============================================================

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ------- 配置 -------
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_BASE_URL = (process.env.LLM_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
const LLM_MODEL = process.env.LLM_MODEL || 'gpt-3.5-turbo';
const TOKEN_TTL_MS = 7 * 24 * 3600 * 1000;   // token 7 天过期
const RATE_LIMIT_ANON = 3;                   // 匿名调用 LLM 次数限制
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 小时窗口

// ------- 数据目录 -------
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TOKENS_FILE = path.join(DATA_DIR, 'tokens.json');
const TODAY_FILE  = path.join(DATA_DIR, 'todayCards.json');
const RATE_FILE   = path.join(DATA_DIR, 'rateLimit.json');

function readJSON(file, def) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); } catch { return def; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
const loadUsers  = () => readJSON(USERS_FILE, {});
const saveUsers  = (u) => writeJSON(USERS_FILE, u);
const loadTokens = () => readJSON(TOKENS_FILE, {});
const saveTokens = (t) => writeJSON(TOKENS_FILE, t);
const loadToday  = () => readJSON(TODAY_FILE, {});
const saveToday  = (t) => writeJSON(TODAY_FILE, t);
const loadRate   = () => readJSON(RATE_FILE, {});
const saveRate   = (r) => writeJSON(RATE_FILE, r);

// ============================================================
// S1: 密码哈希 —— 随机 salt + sha256 迭代 10 次
// 用户密码存成 { salt, hash } 结构
// ============================================================
function hashPassword(pw, salt) {
  const s = salt || crypto.randomBytes(16).toString('hex');
  let h = crypto.createHash('sha256').update(pw + s).digest('hex');
  for (let i = 0; i < 10; i++) {
    h = crypto.createHash('sha256').update(h + pw + s).digest('hex');
  }
  return { salt: s, hash: h };
}
function verifyPassword(pw, salt, expectedHash) {
  const { hash } = hashPassword(pw, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
}
function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}
function nowIso() { return new Date().toISOString(); }

// 用户名正则：字母/数字/下划线/中文（2-20 字）
const USERNAME_RE = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/;

// ============================================================
// 中间件
// ============================================================
app.use(express.json({ limit: '1mb' }));

// 防缓存
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|html|svg)$/)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// 认证中间件（只认 Authorization header，不认 query 参数）
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: '请先登录' });
  const token = header.slice(7).trim();
  if (!token) return res.status(401).json({ error: '请先登录' });

  const tokens = loadTokens();
  const rec = tokens[token];
  if (!rec) return res.status(401).json({ error: '未登录或登录已过期' });

  // S2: 检查过期
  const createdAt = new Date(rec.createdAt).getTime();
  if (Date.now() - createdAt > TOKEN_TTL_MS) {
    delete tokens[token];
    saveTokens(tokens);
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }

  req.username = rec.username;
  next();
}

// S2: 启动时清理过期 token
(function cleanupExpired() {
  const tokens = loadTokens();
  const now = Date.now();
  let pruned = 0;
  for (const [t, rec] of Object.entries(tokens)) {
    if (now - new Date(rec.createdAt).getTime() > TOKEN_TTL_MS) {
      delete tokens[t]; pruned++;
    }
  }
  if (pruned) { saveTokens(tokens); console.log(`  🧹 清理过期 token: ${pruned} 条`); }
})();

// S4: 简单限流（按 IP + 时间窗口）
function rateLimit(ip, limit) {
  const all = loadRate();
  const now = Date.now();
  const cut = now - RATE_LIMIT_WINDOW_MS;

  // 清理旧窗口
  for (const k of Object.keys(all)) {
    all[k] = all[k].filter(t => t > cut);
    if (all[k].length === 0) delete all[k];
  }

  const key = ip;
  if (!all[key]) all[key] = [];
  if (all[key].length >= limit) {
    saveRate(all);
    return false;
  }
  all[key].push(now);
  saveRate(all);
  return true;
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
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: '用户名和密码都不能为空' });

    // M2: 用户名正则校验
    const name = String(username).trim();
    if (!USERNAME_RE.test(name)) {
      return res.status(400).json({ error: '用户名只能是字母、数字、下划线或中文，2-20 字' });
    }
    if (password.length < 4) return res.status(400).json({ error: '密码至少 4 位' });

    const users = loadUsers();
    if (users[name]) return res.status(409).json({ error: '这个名字已经有人用了，换一个吧' });

    const { salt, hash } = hashPassword(password);
    users[name] = { salt, hash, createdAt: nowIso() };
    saveUsers(users);

    // 自动登录
    const token = makeToken();
    const tokens = loadTokens();
    tokens[token] = { username: name, createdAt: nowIso() };
    saveTokens(tokens);

    res.json({ token, username: name });
  } catch (err) {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/auth/login  { username, password }
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: '用户名和密码都不能为空' });

    const name = String(username).trim();
    const users = loadUsers();
    const u = users[name];
    if (!u || !verifyPassword(password, u.salt, u.hash)) {
      return res.status(401).json({ error: '名字或密码不对' });
    }

    const token = makeToken();
    const tokens = loadTokens();
    tokens[token] = { username: name, createdAt: nowIso() };
    saveTokens(tokens);

    res.json({ token, username: name });
  } catch (err) {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (token) {
    const tokens = loadTokens();
    delete tokens[token];
    saveTokens(tokens);
  }
  res.json({ ok: true });
});

// GET /api/auth/me
app.get('/api/auth/me', authRequired, (req, res) => {
  res.json({ username: req.username });
});

// ============================================================
// 今日牌：按用户 + 日期 固定
// ============================================================
app.get('/api/today', authRequired, async (req, res) => {
  try {
    const today = req.query.date && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
      ? req.query.date
      : new Date().toISOString().slice(0, 10);
    const key = `${req.username}-${today}`;

    const all = loadToday();
    if (all[key]) {
      return res.json({ ...all[key], date: today, alreadyDrawn: true });
    }

    const mod = await import('./public/tarot-data.js');
    const card = mod.ALL_CARDS[Math.floor(Math.random() * mod.ALL_CARDS.length)];
    const isReversed = Math.random() < 0.5;

    const slim = {
      id: card.id, nameCn: card.nameCn, nameEn: card.nameEn,
      type: card.type, suit: card.suit, suitCn: card.suitCn,
      rank: card.rank, element: card.element,
      upright: card.upright, reversed: card.reversed,
      keywords: card.keywords, isReversed
    };

    all[key] = slim;
    saveToday(all);
    res.json({ ...slim, date: today, alreadyDrawn: false });
  } catch (err) {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// ============================================================
// S3+S4: LLM 流式解读 —— 可选登录 + 限流
//   已登录用户：不限 IP 限流（每个用户自然频率）
//   匿名用户：每 IP 每小时 RATE_LIMIT_ANON 次
// ============================================================
app.post('/api/interpret', async (req, res) => {
  try {
    const { question, cards } = req.body || {};
    if (!Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ error: 'cards 不能为空' });
    }

    // 检查登录（可选）+ 限流
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    const tokens = loadTokens();
    const userRec = token ? tokens[token] : null;
    const isAuthed = !!(userRec && (Date.now() - new Date(userRec.createdAt).getTime() <= TOKEN_TTL_MS));
    const rateKey = isAuthed ? `u:${userRec.username}` : `ip:${req.ip}`;

    if (!rateLimit(rateKey, isAuthed ? 30 : RATE_LIMIT_ANON)) {
      return res.status(429).json({ error: '请求太频繁，稍后再试' });
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
      .map((c, i) => `${i + 1}. 【${c.position}】${c.nameCn} / ${c.nameEn}（${c.isReversed ? '逆位' : '正位'}）`)
      .join('\n');
    const userQuestion = question && question.trim() ? `用户的问题是：「${String(question).trim().slice(0, 200)}」\n\n` : '';

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
      res.write(`data: ${JSON.stringify({ degraded: true, message: '连接 LLM 服务失败' })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }
    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      res.write(`data: ${JSON.stringify({ degraded: true, message: 'LLM 接口错误：' + upstream.status })}\n\n`);
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
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: '服务器内部错误' });
  }
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
    console.log(`  Token TTL: ${TOKEN_TTL_MS / 3600000 / 24} 天`);
    console.log(`  匿名限流: ${RATE_LIMIT_ANON} 次/小时/IP`);
    console.log(`  LLM: ${LLM_API_KEY ? '✅ 已配置' : '⚠️  未配置（本地模板解读）'}`);
  });
}
module.exports = app;
