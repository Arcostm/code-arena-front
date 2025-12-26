// D:\cade-arena-front\frontend\src\pages\Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import logo from '../assets/casco.png';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    termsAccepted: false,
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.termsAccepted) {
      toast.error('Debes aceptar los términos.');
      return;
    }
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error('Usuario y contraseña son obligatorios.');
      return;
    }

    try {
      await register(
        form.username.trim(),
        form.email.trim(),
        form.password.trim()
      );
    
      navigate('/dashboard');
    
    } catch (err) {
      toast.error(err.message || 'Error al registrar');
    }
    
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-[#F7F2E5] px-4 font-space"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.img
        src={logo}
        alt="Logo"
        className="w-36 mb-4"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-8 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.3 }}
      >
        ÚNETE A LA BATALLA
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {/* Username */}
        <motion.input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          className="px-4 py-2 rounded border shadow-md focus:outline-none focus:ring-2 focus:ring-black"
          value={form.username}
          onChange={handleChange}
          required
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        />

        <motion.input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="px-4 py-2 rounded border shadow-md focus:outline-none focus:ring-2 focus:ring-black"
          value={form.email}
          onChange={handleChange}
          required
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        />


        {/* Password */}
        <motion.input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="px-4 py-2 rounded border shadow-md focus:outline-none focus:ring-2 focus:ring-black"
          value={form.password}
          onChange={handleChange}
          required
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        />

        {/* Terms */}
        <motion.label
          className="text-sm flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <input
            type="checkbox"
            name="termsAccepted"
            checked={form.termsAccepted}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <strong>He leído y acepto los Términos y Condiciones.</strong>
        </motion.label>

        {/* Submit */}
        <motion.button
          type="submit"
          className="bg-black text-white py-2 rounded-xl text-lg hover:bg-gray-800 transition-colors shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          CREAR CUENTA
        </motion.button>

        <motion.p
          className="mt-6 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="underline">
            Inicia sesión
          </Link>
        </motion.p>
      </motion.form>
    </motion.div>
  );
};

export default Signup;
