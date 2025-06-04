import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/casco.png';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes hacer la lógica real para enviar al backend
    if (!form.termsAccepted) return alert('Debes aceptar los términos.');
    if (form.password !== form.confirmPassword) return alert('Las contraseñas no coinciden.');
    console.log('Formulario enviado:', form);
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F2E5] px-4 font-space">
      <img src={logo} alt="Logo" className="w-36 mb-4" />
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">ÚNETE A LA BATALLA</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          className="px-4 py-2 rounded border shadow-md"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="px-4 py-2 rounded border shadow-md"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="px-4 py-2 rounded border shadow-md"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          className="px-4 py-2 rounded border shadow-md"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <label className="text-sm">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={form.termsAccepted}
            onChange={handleChange}
            className="mr-2"
          />
          <strong>He leído y acepto los Términos y Condiciones.</strong>
        </label>
        <button
          type="submit"
          className="bg-black text-white py-2 rounded-xl text-lg hover:bg-gray-800 transition-colors shadow-md"
        >
          CREAR CUENTA
        </button>
        <p className="text-center text-sm font-medium mt-2">
          ¿Ya tienes cuenta? <span className="underline cursor-pointer" onClick={() => navigate('/login')}>Inicia sesión</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
