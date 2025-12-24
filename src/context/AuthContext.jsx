// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from "react";
import { api } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const hasShownExpiryToast = useRef(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // Al iniciar, cargamos usuario+token (+role) desde localStorage
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null; // { username, token, role }
  });

    // Guardar en state + localStorage
    function saveAuth(next) {
      setUser(next);
      if (next) localStorage.setItem('auth', JSON.stringify(next));
      else localStorage.removeItem('auth');
    }

    useEffect(() => {
      if (!user?.token) return;
    
      api.me(user.token)
        .then((data) => {
          saveAuth({
            username: data.username,
            token: user.token,
            role: data.role,
          });
        })
        .catch(() => {
          saveAuth(null);
    
          if (!hasShownExpiryToast.current) {
            toast.info('Tu sesión ha expirado. Vuelve a iniciar sesión.');
            hasShownExpiryToast.current = true;
          }
        });
    }, [user?.token]);          




  // Registro
  async function register(username, password) {
    await api.register(username, password);
    toast.success('Usuario creado. ¡Inicia sesión!');
  }

  // Login real (pide token al backend)
  async function login(username, password) {
    const { access_token, role } = await api.login(username, password);

    saveAuth({ username, token: access_token, role });

    toast.success('Sesión iniciada ✅');
    return true;
  }

  // Logout
  function logout() {
    saveAuth(null);
    navigate('/login');  
  }
  

  const value = {
    user,                        
    token: user?.token || null,
    role: user?.role || null,    
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
