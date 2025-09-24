const BASE_URL = import.meta.env.VITE_API_URL;

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Si la API devuelve 204 o no JSON:
  let data = null;
  const text = await res.text();
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = data?.detail || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function getTournaments() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/tournaments`);
  if (!res.ok) {
    throw new Error("Error al cargar los torneos");
  }
  return res.json();
}

export async function getRanking(tournamentId) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/ranking/${tournamentId}`);
  if (!res.ok) {
    throw new Error("Error al obtener el ranking");
  }
  return res.json();
}

export async function submitCode(username, tournamentId, code) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/submit_code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      tournament_id: tournamentId,
      code,
    }),
  });

  if (!res.ok) {
    throw new Error("Error al enviar el código");
  }

  return res.json();
}

export async function getUserSubmissions(username) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/submissions/${username}`);
  if (!res.ok) throw new Error("Error al obtener historial");
  return res.json();
}




export const api = {
  // AUTH
  register: (username, password) =>
    request('/users/', { method: 'POST', body: { username, password } }),

  login: (username, password) =>
    request('/login', { method: 'POST', body: { username, password } }),

  me: (token) => request('/me', { token }),

  // TORNEOS
  listTournaments: () => request('/tournaments'),
  ranking: (tournamentName) => request(`/ranking/${encodeURIComponent(tournamentName)}`),

  // SUBMISSIONS
  submitCode: ({ username, tournament_id, code }, token) =>
    request('/submit_code', { method: 'POST', body: { username, tournament_id, code }, token }),

  // HISTORIAL
  userHistory: (username, token) =>
    request(`/users/${encodeURIComponent(username)}/history`, { token }),
};
