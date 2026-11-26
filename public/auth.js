/* ============================================================
   auth.js —— 前端认证管理
   封装注册/登录/登出/token 持久化
   ============================================================ */

const TOKEN_KEY = 'moonTarot:token';
const USER_KEY  = 'moonTarot:user';

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function getUser()  { return localStorage.getItem(USER_KEY); }
export function isLoggedIn() { return !!getToken(); }

function setAuth(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username);
}
function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function apiFetch(url, opts = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const r = await fetch(url, { ...opts, headers });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
  return data;
}

export const Auth = {
  async register(username, password) {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    setAuth(data.token, data.username);
    return data.username;
  },
  async login(username, password) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    setAuth(data.token, data.username);
    return data.username;
  },
  async logout() {
    try { await apiFetch('/api/auth/logout', { method: 'POST' }); } catch {}
    clearAuth();
  },
  async me() {
    try { return await apiFetch('/api/auth/me'); } catch { clearAuth(); return null; }
  },
  async getToday() {
    return apiFetch('/api/today');
  }
};
