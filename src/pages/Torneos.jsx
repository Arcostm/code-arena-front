// D:\cade-arena-front\frontend\src\pages\Torneos.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const Torneos = () => {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
 
  useEffect(() => {
    api.listTournaments()
      .then((data) => {
        setTorneos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los torneos.");
        setLoading(false);
      });
  }, []);
  

  if (loading) return <p className="text-center mt-10">Cargando torneos...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="py-16 px-8 bg-[#F7F2E5] min-h-screen font-space">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center text-black"
      >
        Torneos disponibles
      </motion.h1>

      {torneos.length === 0 ? (
        <p className="text-center mt-10">Todavía no hay torneos creados.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {torneos.map((torneo, i) => (
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
                  {torneo.name}
                </h2>
                <p className="text-gray-700">
                  Creado: {new Date(torneo.created_at).toLocaleDateString()}
                </p>
              </div>
              <Link
                to={`/torneos/${torneo.name}`}
                className="mt-4 inline-block bg-[#D3CABF] text-black px-4 py-2 rounded-md border border-black text-sm font-medium text-center hover:bg-black hover:text-white transition-colors"
              >
                Ver detalles
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Torneos;
