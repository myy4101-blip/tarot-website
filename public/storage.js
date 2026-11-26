/* ============================================================
   storage.js —— localStorage 封装
   1. 今日牌缓存（同一天内不重复抽）
   2. 历史记录列表
   ============================================================ */

const NS = 'moonTarot';

function read(key, def) {
  try {
    const raw = localStorage.getItem(`${NS}:${key}`);
    return raw ? JSON.parse(raw) : def;
  } catch { return def; }
}
function write(key, val) {
  try { localStorage.setItem(`${NS}:${key}`, JSON.stringify(val)); } catch {}
}

// ---------- 今日牌 ----------
const TODAY_KEY = 'todayCard';

export function getToday() {
  const cached = read(TODAY_KEY, null);
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  if (cached && cached.date === today) return cached;
  return null;
}

export function saveToday(card, dateStr) {
  write(TODAY_KEY, { card, date: dateStr });
}

// ---------- 历史记录 ----------
const HIST_KEY = 'history';
const HIST_MAX = 50;

export function getHistory() {
  return read(HIST_KEY, []);
}

export function addHistory(entry) {
  const list = [entry, ...getHistory()];
  if (list.length > HIST_MAX) list.length = HIST_MAX;
  write(HIST_KEY, list);
  return entry;
}

export function removeHistory(id) {
  const list = getHistory().filter(e => e.id !== id);
  write(HIST_KEY, list);
}

// ---------- 设置 ----------
const SETTINGS_KEY = 'settings';

export function getSettings() {
  return read(SETTINGS_KEY, { uprightOnly: false });
}

export function saveSettings(patch) {
  const cur = getSettings();
  write(SETTINGS_KEY, { ...cur, ...patch });
}
