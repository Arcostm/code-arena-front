// src\services\api.js
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

export async function getUserSubmissions(username) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/submissions/${username}`);
  if (!res.ok) throw new Error("Error al obtener historial");
  return res.json();
}




export const api = {

  isEnrolled: (slug, token) =>
    request(`/tournaments/${encodeURIComponent(slug)}/is_enrolled`, { token }),

  unenroll: (slug, token) =>
    request(`/tournaments/${slug}/unenroll`, {
      method: "POST",
      body: {},
      token
    }),  

  enroll: (slug, token) =>
    request(`/tournaments/${slug}/enroll`, {
      method: "POST",
      body: {},
      token
    }),

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
  submitCode: ({ tournament_id, code }, token) =>
    request('/submit_code', {
      method: 'POST',
      body: { tournament_id, code },
      token,
    }),

  // HISTORIAL
  userHistory: (username, token) =>
    request(`/users/${encodeURIComponent(username)}/history`, { token }),

  uploadValidator: (tournamentName, file, token) => {
    const form = new FormData();
    form.append('file', file);
    return fetch(`${BASE_URL}/tournaments/${encodeURIComponent(tournamentName)}/validator`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }, // sin content-type, lo pone el browser
      body: form
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error subiendo validador');
      return data;
    });
  },

  // submit asíncrono
  submitCodeAsync: ({ tournament_id, code }, token) =>
    request('/submit_code_async', { method: 'POST', body: { tournament_id, code }, token }),

  // progreso
  progress: (submissionId) => request(`/progress/${submissionId}`),
};