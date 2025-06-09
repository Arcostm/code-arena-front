// src/pages/Dashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F7F2E5] p-8 font-space">
      {/* Título principal animado */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-black mb-2 text-center"
      >
        Bienvenido, {user?.username || 'Gladiador'}
      </motion.h1>

      {/* Subtítulo animado */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-lg text-gray-700 italic mb-10 text-center"
      >
        Prepárate para tu próximo reto
      </motion.p>

      {/* Secciones y cards con animación escalonada */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Tus torneos */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-black border-b border-gray-400 pb-1">
            Tus torneos
          </h2>
          <Card titulo="Algorithm Showdown" subtitulo="3 días restantes" tipo="activo" slug="algorithm-showdown" delay={0.3} />
          <Card titulo="Python Sprint"       subtitulo="8 días restantes" tipo="activo" slug="python-sprint"       delay={0.5} />
        </motion.section>

        {/* Torneos disponibles */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-black border-b border-gray-400 pb-1">
            Torneos disponibles
          </h2>
          <Card titulo="JS Masters" tipo="disponible" slug="js-masters" delay={0.7} />
        </motion.section>

        {/* Torneos vencidos */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="space-y-6 md:col-span-2"
        >
          <h2 className="text-2xl font-semibold text-black border-b border-gray-400 pb-1">
            Torneos vencidos
          </h2>
          <Card titulo="Rust Challenge" subtitulo="2ª Posición" tipo="vencido" slug="rust-challenge" delay={0.9} />
        </motion.section>
      </div>
    </div>
  );
};

const Card = ({ titulo, subtitulo, tipo, slug, delay = 0 }) => {
  const navigate = useNavigate();
  let textoBoton = 'Ver';
  let icono = null;
  let destino = `/torneos/${slug}`;

  switch (tipo) {
    case 'activo':
      textoBoton = 'Continuar';
      icono = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M18 8a6 6 0 11-12 0 6 6 0 0112 0z" />
          <path d="M12 14v7m0 0h4m-4 0H8" />
        </svg>
      );
      break;
    case 'disponible':
      textoBoton = 'Unirse';
      icono = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 4v16m8-8H4" />
        </svg>
      );
      break;
    case 'vencido':
      textoBoton = 'Ver resultados';
      destino += '/resultados';
      icono = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 17v-6h6v6m-3-6V5m9 14H6a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z" />
        </svg>
      );
      break;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-[#E5E0D3] p-6 rounded-2xl border border-black shadow-lg flex justify-between items-center hover:shadow-2xl transition-shadow"
    >
      <div>
        <h3 className="text-xl font-semibold text-black mb-1">{titulo}</h3>
        {subtitulo && <p className="text-sm text-gray-700 italic">{subtitulo}</p>}
      </div>
      <button
        onClick={() => navigate(destino)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D3CABF] border border-black text-black font-medium hover:bg-black hover:text-white transition-colors"
      >
        {icono}
        {textoBoton}
      </button>
    </motion.div>
  );
};

export default Dashboard;
