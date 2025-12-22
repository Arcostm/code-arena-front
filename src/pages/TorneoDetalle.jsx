// src/pages/TorneoDetalle.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getRanking, api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProgressBar from "../components/ProgressBar.jsx";
import { MonacoEditor } from "../components/editor";
import { LANGUAGES } from "../constants/languages";



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

  const [language, setLanguage] = useState("python");


  const pollRef = useRef(null);

  // ===========================================================
  // CARGA TORNEO + ESTADO INSCRIPCIÓN
  // ===========================================================
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const t = await fetch(
          `${import.meta.env.VITE_API_URL}/tournaments/${slug}`
        ).then((r) => r.json());

        if (!mounted) return;
        setTournament(t);

        const res = await api.isEnrolled(slug, user.token);
        if (!mounted) return;

        setIsEnrolled(!!res.enrolled);
      } catch {
        toast.error("No se pudo cargar el torneo.");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug, user?.token]);

  // ===========================================================
  // CARGAR RANKING
  // ===========================================================
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
  // INSCRIBIRSE / DESINSCRIBIRSE
  // ===========================================================
  const handleEnroll = async () => {
    try {
      await api.enroll(tournament.name, user.token);
      toast.success("Inscrito correctamente 🎉");
      navigate("/dashboard", { replace: true });
    } catch (e) {
      toast.error(e.message || "No se pudo inscribir");
    }
  };

  const handleUnenroll = async () => {
    const ok = window.confirm("¿Seguro que quieres desinscribirte?");
    if (!ok) return;

    try {
      await api.unenroll(tournament.name, user.token);
      toast.success("Te has desinscrito 👋");
      navigate("/dashboard", { replace: true });
    } catch (e) {
      toast.error(e.message || "No se pudo desinscribir");
    }
  };

  // ===========================================================
  // SUBIR CÓDIGO
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
    } catch (err) {
      toast.error(err.message || "Error al enviar el código");
    } finally {
      setSubmitting(false);
    }
  };

  // ===========================================================
  // POLLING
  // ===========================================================
  const startPolling = (id) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const res = await api.progress(id);

        setProgress(res);

        if (res.status === "COMPLETADO" || res.status === "ERROR") {
          clearInterval(pollRef.current);
        }
      } catch {
        clearInterval(pollRef.current);
      }
    }, POLL_MS);
  };

  // ===========================================================
  // RENDER
  // ===========================================================
  if (loading) return <p className="text-center mt-10">Cargando…</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <motion.div className="min-h-screen bg-[#F7F2E5] p-8 font-space text-black">
      <h1 className="text-3xl font-bold mb-6">Torneo: {slug}</h1>

      {/* PARTICIPACIÓN */}
      <div className="mb-8 border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg">
        {!isEnrolled ? (
          <>
            <p className="mb-4">Debes inscribirte para participar</p>
            <button onClick={handleEnroll} className="bg-black text-white px-4 py-2 rounded">
              Inscribirme
            </button>
          </>
        ) : (
          <>
            <div className="mt-4 border border-black rounded-xl overflow-hidden shadow-inner">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700 text-sm text-gray-300">
                <span>Editor de código</span>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-black text-white text-xs px-2 py-1 rounded"
                >
                  {Object.entries(LANGUAGES).map(([key, l]) => (
                    <option key={key} value={key}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>


              {/* Monaco */}
              <div className="h-80">
                <MonacoEditor
                  key={LANGUAGES[language]?.monaco || "python"}   // 🔥 fuerza remount al cambiar lenguaje
                  value={code}
                  language={LANGUAGES[language]?.monaco || "python"} // ✅ aquí va el lenguaje REAL de monaco
                  onChange={(value) => setCode(value ?? "")}
                />

              </div>
            </div>



            <button onClick={handleSubmit} className="mt-4 bg-black text-white px-4 py-2 rounded">
              Subir código
            </button>
          </>
        )}
      </div>

      {/* PARTICIPANTES */}
      {tournament && (
        <div className="mb-8 border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg">
          <h2 className="font-semibold mb-4">
            Participantes ({tournament.participants?.length ?? 0})

          </h2>

          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(tournament.participants ?? []).map((u) => (

              <li
                key={u}
                className={`px-3 py-2 border rounded ${u === user.username ? "bg-black text-white" : "bg-white"
                  }`}
              >
                👤 {u} {u === user.username && "(tú)"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* RANKING */}
      <div className="border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg">
        <h2 className="font-semibold mb-4">Ranking</h2>
        {/* tabla */}
      </div>

      {/* ZONA PELIGRO */}
      {isEnrolled && (
        <div className="mt-12 border border-red-600 rounded-xl p-6 bg-[#FBEAEA] shadow-lg">
          <h2 className="text-md font-semibold mb-4 text-red-700">
            Zona peligrosa
          </h2>

          <p className="text-sm text-red-700 mb-4">
            Si te desinscribes perderás el acceso a este torneo y no podrás enviar más código.
          </p>

          <button
            onClick={handleUnenroll}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Desinscribirme del torneo
          </button>
        </div>
      )}

    </motion.div>
  );
};

export default TorneoDetalle;
