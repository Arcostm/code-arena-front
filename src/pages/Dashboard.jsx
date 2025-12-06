// src/pages/Dashboard.jsx
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listTournaments()
      .then((data) => {
        setTournaments(data || []);
      })
      .catch((err) => {
        console.error("Error cargando torneos:", err);
      })
      .finally(() => setLoading(false));
  }, []);

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

      {loading && (
        <p className="text-center text-gray-600 italic">Cargando torneos...</p>
      )}

      {!loading && (
        <div className="grid md:grid-cols-2 gap-12">

          {/* Tus torneos (activos) */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-black border-b border-gray-400 pb-1">
              Tus torneos
            </h2>

            {tournaments
              .filter(t => t.participants?.includes(user.username))
              .map((t, i) => (
                <Card
                  key={t.id}
                  titulo={t.name}
                  subtitulo={t.description}
                  tipo="activo"
                  slug={t.slug || t.name.toLowerCase().replace(/\s+/g, "-")}
                  delay={0.3 + i * 0.1}
                />
              ))}
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

            {tournaments
              .filter(t => !t.participants?.includes(user.username))
              .map((t, i) => (
                <Card
                  key={t.id}
                  titulo={t.name}
                  subtitulo={t.description}
                  tipo="disponible"
                  slug={t.slug || t.name.toLowerCase().replace(/\s+/g, "-")}
                  delay={0.7 + i * 0.1}
                />
              ))}
          </motion.section>

        </div>
      )}
    </div>
  );
};

const Card = ({ titulo, subtitulo, tipo, slug, delay = 0 }) => {
  const navigate = useNavigate();
  let textoBoton = 'Ver';
  let destino = `/torneos/${slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#E5E0D3] p-6 rounded-2xl border border-black shadow-lg flex justify-between items-center"
    >
      <div>
        <h3 className="text-xl font-semibold text-black mb-1">{titulo}</h3>
        {subtitulo && <p className="text-sm text-gray-700 italic">{subtitulo}</p>}
      </div>

      <button
        onClick={() => navigate(destino)}
        className="px-4 py-2 rounded-lg bg-[#D3CABF] border border-black text-black hover:bg-black hover:text-white transition"
      >
        {textoBoton}
      </button>
    </motion.div>
  );
};

export default Dashboard;
