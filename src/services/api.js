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

  createTournament: (name, token) =>
    request(
      "/tournaments/",
      {
        method: "POST",
        body: { name },
        token,
      }
    ),


  closeTournament: (id, token) =>
    request(`/tournaments/${id}/close`, { method: "POST", token }),

  openTournament: (id, token) =>
    request(`/tournaments/${id}/open`, { method: "POST", token }),


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
  register: (username, email, password) =>
    request('/users/', {
      method: 'POST',
      body: { username, email, password },
    }),

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

  progress: (submissionId) => request(`/progress/${submissionId}`),

  downloadMyLatestCode: (tournamentId, token) =>
    fetch(`${BASE_URL}/tournaments/${tournamentId}/my-latest-code/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "No se pudo descargar el código");
      }
      return res.blob();
    }),

  deleteTournament: (tournamentId, token) =>
    request(`/tournaments/${tournamentId}`, {
      method: "DELETE",
      token,
    }),

  archiveTournament: (id, token) =>
    request(`/tournaments/${id}/archive`, {
      method: "POST",
      token,
    }),

  unarchiveTournament: (id, token) =>
    request(`/tournaments/${id}/unarchive`, {
      method: "POST",
      token,
    }),

  adminListTournaments: (token) =>
    request('/admin/tournaments', { token }),


  adminListUsers: (token) =>
    request("/admin/users", { token }),

  makeTeacher: (username, token) =>
    request(`/users/${encodeURIComponent(username)}/make_teacher`, {
      method: "POST",
      token,
    }),

  makeStudent: (username, token) =>
    request(`/users/${encodeURIComponent(username)}/make_student`, {
      method: "POST",
      token,
    }),

  deleteUser: (userId, token) =>
    request(`/users/${userId}`, {
      method: "DELETE",
      token,
    }),

  createUser: (data, token) =>
    request("/users/", {
      method: "POST",
      body: data,
      token,
    }),

  signup: (username, email, password) =>
    request('/auth/signup', {
      method: 'POST',
      body: { username, email, password },
    }),



};