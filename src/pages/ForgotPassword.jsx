// D:\cade-arena-front\frontend\src\pages\ForgotPassword.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      toast.error('Introduce tu correo');
      return;
    }

    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      toast.success(
        'Si el correo existe, te hemos enviado un email con instrucciones'
      );
    } catch (err) {
      toast.error(err.message || 'Error enviando el email');
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
          Recuperar contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            Enviar instrucciones
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          <Link to="/login" className="underline">
            Volver al login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
