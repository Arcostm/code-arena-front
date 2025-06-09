import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const torneosData = [
  { id: 1, nombre: 'Algorithm Showdown', estado: 'Activo', slug: 'algorithm-showdown' },
  { id: 2, nombre: 'Python Sprint', estado: 'Próximo', slug: 'python-sprint' },
  { id: 3, nombre: 'Rust Challenge', estado: 'Cerrado', slug: 'rust-challenge' },
];

const Torneos = () => {
  return (
    <div className="py-16 px-8 bg-[#F7F2E5] min-h-screen font-space">
      {/* Título animado */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center text-black"
      >
        Torneos disponibles
      </motion.h1>

      {/* Subtítulo animado */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-lg md:text-xl text-gray-800 mb-12 text-center"
      >
        Participa, compite y escala en el ranking.
      </motion.p>

      {/* Cards con animación secuencial */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {torneosData.map((torneo, i) => (
          <motion.div
            key={torneo.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#E5E0D3] p-6 rounded-2xl shadow-lg border border-black flex flex-col justify-between transition-shadow cursor-pointer"
          >
            <div>
              <h2 className="text-2xl font-semibold text-black mb-2">
                {torneo.nombre}
              </h2>
              <p className="text-gray-700">Estado: {torneo.estado}</p>
            </div>
            <Link
              to={`/torneos/${torneo.slug}`}
              className="mt-4 inline-block bg-[#D3CABF] text-black px-4 py-2 rounded-md border border-black text-sm font-medium text-center hover:bg-black hover:text-white transition-colors"
            >
              Ver detalles
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Torneos;
