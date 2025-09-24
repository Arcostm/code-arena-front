import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Al iniciar, cargamos usuario+token desde localStorage
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null; // { username, token }
  });

  // Guardar en state + localStorage
  function saveAuth(next) {
    setUser(next);
    if (next) localStorage.setItem('auth', JSON.stringify(next));
    else localStorage.removeItem('auth');
  }

  // Registro
  async function register(username, password) {
    await api.register(username, password);
    toast.success('Usuario creado. ¡Inicia sesión!');
  }

  // Login real (pide token al backend)
  async function login(username, password) {
    const { access_token } = await api.login(username, password);
    saveAuth({ username, token: access_token });
    toast.success('Sesión iniciada ✅');
    return true;
  }

  // Logout
  function logout() {
    saveAuth(null);
    toast.info('Sesión cerrada');
  }

  const value = {
    user,              // { username, token }
    token: user?.token || null,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para acceder al contexto
export function useAuth() {
  return useContext(AuthContext);
}
