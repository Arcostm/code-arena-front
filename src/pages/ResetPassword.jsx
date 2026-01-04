// D:\cade-arena-front\frontend\src\pages\ResetPassword.jsx
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!password || password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (!token) {
      toast.error('Token inválido');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(token, password);
      toast.success('Contraseña actualizada. Inicia sesión');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F2E5] px-4">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Nueva contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            Cambiar contraseña
          </button>
        </form>
      </motion.div>
    </div>
  );
}
