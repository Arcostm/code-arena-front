import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getRanking, submitCode } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const TorneoDetalle = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getRanking(slug)
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else if (data.message) {
          setError(data.message);
        } else {
          setRanking(data.ranking);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo obtener el ranking.");
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para enviar código.");
      return;
    }
    if (!code.trim()) {
      toast.error("El código no puede estar vacío.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitCode(user.username, slug, code);
      toast.success("Código enviado con éxito ✅");

      // refrescar ranking
      setRanking(result.ranking || ranking);
    } catch (err) {
      console.error(err);
      toast.error("Error al enviar el código");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando ranking...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <motion.div
      className="min-h-screen bg-[#F7F2E5] p-8 font-space text-black"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-6">Torneo: {slug}</h1>

      {/* Subir código */}
      <div className="mb-8 border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg">
        <h2 className="text-md font-semibold mb-4">Sube tu intento</h2>
        <textarea
          className="w-full h-40 p-4 rounded-md border border-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Escribe tu código aquí..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          {submitting ? "Enviando..." : "Subir código"}
        </button>
      </div>

      {/* Ranking */}
      <div className="border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg">
        <h2 className="text-md font-semibold mb-4">Ranking</h2>
        <table className="w-full text-sm">
          <thead className="text-left">
            <tr>
              <th>Posición</th>
              <th>Usuario</th>
              <th>Puntuación</th>
              <th>Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((fila) => (
              <tr key={fila.username} className="border-t border-gray-300">
                <td className="py-2">{fila.position}</td>
                <td>{fila.username}</td>
                <td>{fila.score}</td>
                <td>{fila.execution_time}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TorneoDetalle;
