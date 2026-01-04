import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/icono.png';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    try {
      await login(username.trim(), password.trim());
    } catch (err) {
      toast.error(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-[#F7F2E5] px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.img
        src={logo}
        alt="Logo Code Arena"
        className="w-[200px] md:w-[200px] h-auto mb-6 object-contain"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      <motion.div
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center font-space"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-black">Inicia sesión</h2>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 text-left"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          />
          <motion.input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          />

          <motion.button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            Entrar
          </motion.button>
        </motion.form>

        <motion.div
          className="mt-6 text-sm text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/forgot-password" className="underline block">
            ¿Olvidaste tu contraseña?
          </Link>

          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/signup" className="underline">
              Regístrate
            </Link>
          </p>
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

export default Login;
