// ============================================================
// 塔罗牌占卜网站后端
// 职责：1) 静态文件托管  2) LLM API 代理（流式 + 本地降级）
// ============================================================

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ------- 配置读取 -------
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_BASE_URL = (process.env.LLM_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
const LLM_MODEL = process.env.LLM_MODEL || 'gpt-3.5-turbo';

// ------- 中间件 -------
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ------- 健康检查 + 配置状态 -------
app.get('/api/status', (_req, res) => {
  res.json({
    llmConfigured: !!LLM_API_KEY,
    model: LLM_API_KEY ? LLM_MODEL : null,
    note: LLM_API_KEY
      ? 'LLM 已就绪，将同时返回本地解读 + AI 解读'
      : '未配置 LLM API Key，仅返回本地模板解读（可在 .env 中配置）'
  });
});

// ------- 流式解读接口 -------
// POST /api/interpret  { question, cards: [{position, nameCn, nameEn, upright, meaning}] }
// 返回 text/event-stream，逐块推送 AI 解读；如果没有 key，直接返回 JSON 降级提示
app.post('/api/interpret', async (req, res) => {
  const { question, cards } = req.body || {};

  if (!Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({ error: 'cards 不能为空' });
  }

  // 没有配置 key -> 直接返回降级 JSON，前端走本地解读
  if (!LLM_API_KEY) {
    return res.json({
      degraded: true,
      message: '未配置 LLM API Key，已为你展示本地模板解读。如需 AI 个性化解读，请联系网站管理员配置。'
    });
  }

  // 准备 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Nginx 场景下禁用缓冲

  // 构造 Prompt
  const cardSummary = cards
    .map((c, i) => `${i + 1}. 【${c.position}】${c.nameCn} / ${c.nameEn}（${c.upright ? '正位' : '逆位'}）`)
    .join('\n');

  const userQuestion = question && question.trim() ? `用户的问题是：「${question.trim()}」\n\n` : '';

  const messages = [
    {
      role: 'system',
      content:
        '你是一位温文尔雅、善于共情的塔罗师。请用温暖、清晰、有画面感的中文，基于牌面和牌位给出连贯的综合解读。' +
        '避免太玄学的措辞，要有实际的心理和行动建议。控制在 300-500 字。'
    },
    {
      role: 'user',
      content: `${userQuestion}本次抽到的三张牌（三牌阵：过去 / 现在 / 未来）是：\n${cardSummary}\n\n请给出一段综合解读。`
    }
  ];

  try {
    // 走兼容 OpenAI 的 /chat/completions 接口，stream: true
    const fetchUrl = `${LLM_BASE_URL}/chat/completions`;
    const fetchBody = JSON.stringify({
      model: LLM_MODEL,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 600
    });

    const fetch = require('node-fetch'); // 先尝试动态 require
  } catch {
    // fallback：用内置 http/https
  }

  // 使用原生 fetch（Node 18+ 自带）
  const nodeFetch = global.fetch;
  if (!nodeFetch) {
    // 这个环境没有全局 fetch（Node < 18），直接降级
    res.write(`data: ${JSON.stringify({ degraded: true, message: '运行环境不支持流式请求，请升级 Node 到 18+' })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();
  }

  let upstream;
  try {
    upstream = await nodeFetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LLM_API_KEY}`
      },
      body: fetchBody
    });
  } catch (err) {
    res.write(`data: ${JSON.stringify({ degraded: true, message: '连接 LLM 服务失败：' + err.message })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();
  }

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => '');
    res.write(`data: ${JSON.stringify({ degraded: true, message: 'LLM 接口返回错误：' + upstream.status + ' ' + errText.slice(0, 200) })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();
  }

  // 把上游 SSE 逐块转发给前端
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
        if (payload === '[DONE]') {
          res.write('data: [DONE]\n\n');
          return res.end();
        }

        let parsed;
        try {
          parsed = JSON.parse(payload);
        } catch {
          continue;
        }

        const delta = parsed?.choices?.[0]?.delta?.content;
        if (delta) {
          res.write(`data: ${JSON.stringify({ token: delta })}\n\n`);
        }
      }
    }
  } catch (streamErr) {
    // 客户端断开等异常
  }

  res.write('data: [DONE]\n\n');
  res.end();
});

// ------- 追问接口（同样走流式） -------
app.post('/api/followup', async (req, res) => {
  const { history, question } = req.body || {};

  if (!Array.isArray(history) || !question) {
    return res.status(400).json({ error: 'history 和 question 不能为空' });
  }

  if (!LLM_API_KEY) {
    return res.json({
      degraded: true,
      message: '未配置 LLM API Key，追问功能暂不可用。'
    });
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const messages = [
    {
      role: 'system',
      content:
        '你是一位温文尔雅、善于共情的塔罗师。请基于之前的占卜结果，用温暖清晰的中文回应用户的追问。' +
        '避免太玄学，给出实际的思考角度和行动建议。控制在 200-400 字。'
    },
    ...history, // 包含之前的解读对话
    { role: 'user', content: question }
  ];

  try {
    const upstream = await global.fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LLM_API_KEY}`
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      res.write(`data: ${JSON.stringify({ degraded: true, message: 'LLM 接口错误：' + upstream.status + ' ' + errText.slice(0, 200) })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const reader = upstream.body.getReader();
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
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') { res.write('data: [DONE]\n\n'); return res.end(); }
        let parsed; try { parsed = JSON.parse(payload); } catch { continue; }
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (delta) res.write(`data: ${JSON.stringify({ token: delta })}\n\n`);
      }
    }
  } catch (err) {
    res.write(`data: ${JSON.stringify({ degraded: true, message: '追问接口错误：' + err.message })}\n\n`);
    res.write('data: [DONE]\n\n');
  }
  res.end();
});

// ------- 兜底 404 全部回首页 -------
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------- 本地开发直接监听；Vercel Serverless 会 import 这个 app -------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🌙 塔罗牌占卜站已启动：http://localhost:${PORT}`);
    console.log(`\n  LLM 配置状态：${LLM_API_KEY ? '✅ 已配置（' + LLM_MODEL + '）' : '⚠️  未配置，将使用本地模板解读'}`);
    if (!LLM_API_KEY) {
      console.log('  如需 AI 解读，请复制 .env.example 为 .env 并填写 LLM_API_KEY\n');
    } else {
      console.log('  Base URL:', LLM_BASE_URL);
    }
  });
}

// Vercel Serverless Function 会 export 这个 app
module.exports = app;
