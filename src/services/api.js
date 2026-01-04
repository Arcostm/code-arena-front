// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL;

function authHeaders(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = "GET", body, token } = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(token),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const msg = data?.detail || data?.error || `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data;
}

export const api = {
    // =====================
    // AUTH
    // =====================
    login: (username, password) =>
        request("/login", {
            method: "POST",
            body: { username, password },
        }),

    signup: (username, email, password) =>
        request("/auth/signup", {
            method: "POST",
            body: { username, email, password },
        }),

    me: (token) => request("/me", { token }),

    // =====================
    // PERFIL
    // =====================
    updateProfile: (data, token) =>
        request("/me", {
            method: "PUT",
            body: data,
            token,
        }),

    uploadAvatar: (file, token) => {
        const form = new FormData();
        form.append("file", file);

        return fetch(`${BASE_URL}/me/avatar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: form,
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Error subiendo avatar");
            return data;
        });
    },

    // =====================
    // TORNEOS
    // =====================
    listTournaments: () => request("/tournaments"),

    createTournament: (name, token) =>
        request("/tournaments/", {
            method: "POST",
            body: { name },
            token,
        }),

    openTournament: (id, token) =>
        request(`/tournaments/${id}/open`, { method: "POST", token }),

    closeTournament: (id, token) =>
        request(`/tournaments/${id}/close`, { method: "POST", token }),

    archiveTournament: (id, token) =>
        request(`/tournaments/${id}/archive`, { method: "POST", token }),

    unarchiveTournament: (id, token) =>
        request(`/tournaments/${id}/unarchive`, { method: "POST", token }),

    deleteTournament: (id, token) =>
        request(`/tournaments/${id}`, { method: "DELETE", token }),

    ranking: (name) =>
        request(`/ranking/${encodeURIComponent(name)}`),

    // =====================
    // INSCRIPCIÓN
    // =====================
    enroll: (slug, token) =>
        request(`/tournaments/${slug}/enroll`, {
            method: "POST",
            body: {},
            token,
        }),

    unenroll: (slug, token) =>
        request(`/tournaments/${slug}/unenroll`, {
            method: "POST",
            body: {},
            token,
        }),

    isEnrolled: (slug, token) =>
        request(`/tournaments/${encodeURIComponent(slug)}/is_enrolled`, { token }),

    // =====================
    // SUBMISSIONS
    // =====================
    submitCode: ({ tournament_id, code }, token) =>
        request("/submit_code", {
            method: "POST",
            body: { tournament_id, code },
            token,
        }),

    submitCodeAsync: ({ tournament_id, code }, token) =>
        request("/submit_code_async", {
            method: "POST",
            body: { tournament_id, code },
            token,
        }),

    progress: (submissionId) =>
        request(`/progress/${submissionId}`),

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

    // =====================
    // HISTORIAL
    // =====================
    userHistory: (username, token) =>
        request(`/users/${encodeURIComponent(username)}/history`, { token }),

    // =====================
    // ADMIN
    // =====================
    adminListTournaments: (token) =>
        request("/admin/tournaments", { token }),

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

    getTournament: (name) =>
        request(`/tournaments/${encodeURIComponent(name)}`),

    // =====================
    // PASSWORD RESET
    // =====================
    forgotPassword: (email) =>
        request("/auth/forgot-password", {
            method: "POST",
            body: { email },
        }),

    resetPassword: (token, newPassword) =>
        request("/auth/reset-password", {
            method: "POST",
            body: {
                token,
                new_password: newPassword,
            },
        }),


    // =====================
    // USUARIOS (ADMIN)
    // =====================
    createUser: (username, email, password, role, token) =>
        request("/users/", {
            method: "POST",
            body: {
                username,
                email,
                password,
                role,
            },
            token,
        }),


    uploadValidator: (tournamentName, file, token) => {
        const form = new FormData();
        form.append("file", file);

        return fetch(
            `${BASE_URL}/tournaments/${encodeURIComponent(tournamentName)}/validator`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: form,
            }
        ).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Error subiendo validador");
            return data;
        });
    },
};
