// src/pages/TorneoDetalle.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getRanking, api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProgressBar from "../components/ProgressBar.jsx";

const POLL_MS = 1500;

const TorneoDetalle = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [submissionId, setSubmissionId] = useState(null);
  const [progress, setProgress] = useState(null);

  const pollRef = useRef(null);

  // 1) Cargar torneo REAL + saber si está inscrito
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/tournaments/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setTournament(data);
        if (data?.participants?.includes(user?.username)) {
          setIsEnrolled(true);
        }
      })
      .catch(() => toast.error("No se pudo cargar el torneo."));
  }, [slug, user?.username]);

  // 2) Cargar ranking
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getRanking(slug);
        if (!mounted) return;

        if (data.error) setError(data.error);
        else setRanking(data.ranking || []);
      } catch {
        if (mounted) setError("No se pudo obtener el ranking.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [slug]);

  // ===========================================================
  // INSCRIPCIÓN
  // ===========================================================
  const handleEnroll = async () => {
    try {
      await api.enroll(slug, user.token);

      toast.success("Inscrito correctamente 🎉");
      setIsEnrolled(true);
    } catch (e) {
      toast.error(e.message || "No se pudo inscribir");
    }
  };

  // ===========================================================
  // POLLING DE SUBMISSIONS
  // ===========================================================
  const startPolling = (id) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const res = await api.progress(id);

        setProgress({
          status: res.status,
          progress: res.progress,
          message: res.message,
          result: res.result || null,
        });

        if (res.status === "COMPLETADO" || res.status === "ERROR") {
          clearInterval(pollRef.current);
          pollRef.current = null;

          if (res.status === "COMPLETADO") {
            toast.success("¡Ejecución completada 🎉!");
            const updated = await getRanking(slug);
            setRanking(updated.ranking || []);
          } else {
            toast.error(res.message || "Error en la ejecución");
          }
        }
      } catch (e) {
        clearInterval(pollRef.current);
        pollRef.current = null;
        toast.error(e.message || "Fallo consultando el progreso");
      }
    }, POLL_MS);
  };

  // ===========================================================
  // SUBIDA DE CÓDIGO
  // ===========================================================
  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("El código no puede estar vacío.");
      return;
    }

    setSubmitting(true);

    try {
      const resp = await api.submitCodeAsync(
        { tournament_id: tournament.id, code },
        user.token
      );

      setSubmissionId(resp.submission_id);
      setProgress({ status: "PENDIENTE", progress: 0, message: "En cola..." });

      startPolling(resp.submission_id);

      toast.info("Código enviado. Procesando en JupyterHub…");
    } catch (err) {
      toast.error(err.message || "Error al enviar el código");
    } finally {
      setSubmitting(false);
    }
  };

  // ===========================================================
  // RENDER
  // ===========================================================

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

      {/* Botón para profesores */}
      {user?.role === "teacher" && tournament && (
        <button
          onClick={() => navigate(`/admin/validator?t=${tournament.name}`)}
          className="mb-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Subir validador
        </button>
      )}

      {/* ==============================
          PARTICIPACIÓN
         ============================== */}
      <div className="mb-8 border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg">
        <h2 className="text-md font-semibold mb-4">Participación</h2>

        {!isEnrolled ? (
          <>
            <p className="text-gray-700 mb-4">
              Debes inscribirte para poder participar en este torneo.
            </p>
            <button
              onClick={handleEnroll}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Inscribirme
            </button>
          </>
        ) : (
          <>
            <textarea
              className="w-full h-40 p-4 rounded-md border border-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="# Escribe tu código Python aquí..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                {submitting ? "Enviando..." : "Subir código"}
              </button>

              {submissionId && (
                <span className="text-sm text-gray-700">
                  ID de envío: <b>{submissionId}</b>
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* ==============================
          PROGRESO
         ============================== */}
      {progress && (
        <div className="mb-8 border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">
              Estado: <b>{progress.status}</b>
            </span>
            <span className="text-sm">{progress.message}</span>
          </div>

          <ProgressBar value={progress.progress ?? 0} />

          {progress.result && (
            <div className="mt-4 text-sm grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border border-black rounded-md bg-white">
                <h3 className="font-semibold mb-1">Score</h3>
                <p className="text-2xl font-bold">{progress.result.score}</p>
              </div>

              <div className="p-3 border border-black rounded-md bg-white">
                <h3 className="font-semibold mb-1">Tiempo</h3>
                <p>{progress.result.execution_time}s</p>
              </div>

              <div className="p-3 border border-black rounded-md bg-white md:col-span-1">
                <h3 className="font-semibold mb-1">Validador</h3>
                <pre className="text-xs whitespace-pre-wrap">
                  {progress.result.validator_output}
                </pre>
              </div>

              <div className="p-3 border border-black rounded-md bg-white md:col-span-3">
                <h3 className="font-semibold mb-1">Salida del alumno</h3>
                <pre className="text-xs whitespace-pre-wrap">
                  {progress.result.student_output}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==============================
          RANKING
         ============================== */}
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
            {ranking.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-600">
                  Todavía no hay envíos en este torneo.
                </td>
              </tr>
            ) : (
              ranking.map((fila) => (
                <tr key={fila.username} className="border-t border-gray-300">
                  <td className="py-2">{fila.position}</td>
                  <td>{fila.username}</td>
                  <td>{fila.score}</td>
                  <td>{fila.execution_time}s</td>
                </tr>
              ))
            )}  

          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
export default TorneoDetalle;
