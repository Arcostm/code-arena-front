// src/pages/TorneoDetalle.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProgressBar from "../components/ProgressBar.jsx";
import { MonacoEditor } from "../components/editor";
import { LANGUAGES } from "../constants/languages";
import { api } from "../services/api";



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

  const [latestSubmission, setLatestSubmission] = useState(null);

  const isClosed = tournament && tournament.is_open === false;


  const pollRef = useRef(null);

  // ===========================================================
  // CARGA TORNEO + ESTADO INSCRIPCIÓN
  // ===========================================================
  const loadRanking = async () => {
    try {
      const data = await api.ranking(slug);
      if (data?.ranking) {
        setRanking(data.ranking);
      }
    } catch {
      toast.error("No se pudo actualizar el ranking.");
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const t = await api.getTournament(slug);

        if (!mounted) return;
        setTournament(t);
        await loadMyLatestSubmission(t.id);

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
        await loadRanking();
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
      await api.enroll(slug, user.token);
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
      await api.unenroll(slug, user.token);
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
        { tournament_id: Number(tournament.id), code },
        user.token
      );

      setSubmissionId(resp.submission_id);
      setProgress({
        status: "PENDIENTE",
        progress: 0,
        message: "En cola...",
      });

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
          pollRef.current = null;

          if (res.status === "COMPLETADO") {
            await loadRanking();
            await loadMyLatestSubmission(tournament.id);
          }

        }

      } catch (e) {
        console.error("❌ POLLING ERROR:", e);
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }, POLL_MS);
  };

  // ===========================================================
  // DESCARGAR ÚLTIMO CÓDIGO
  // ===========================================================

  const loadMyLatestSubmission = async (tournamentId) => {
    try {
      const data = await api.getMyLatestCode(
        tournamentId,
        user.token
      );


      if (data?.code) {
        setLatestSubmission(data);
        setCode(data.code); // precarga editor
      }
    } catch {
      // no pasa nada si aún no hay envíos
    }
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
            {isClosed ? (
              <p className="text-red-700 font-semibold">
                ⛔ Este torneo está cerrado y no admite nuevas inscripciones.
              </p>
            ) : (
              <>
                <p className="mb-4">Debes inscribirte para participar</p>
                <button
                  onClick={handleEnroll}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Inscribirme
                </button>
              </>
            )}
          </>
        ) : (

          <>
            {isClosed && (
              <div className="mb-4 p-4 border border-red-600 rounded bg-[#FBEAEA] text-red-700">
                ⛔ Este torneo está cerrado. No se pueden enviar más soluciones.
              </div>
            )}

            {!isClosed && (
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

                <div className="h-80">
                  <MonacoEditor
                    key={LANGUAGES[language]?.monaco || "python"}
                    value={code}
                    language={LANGUAGES[language]?.monaco || "python"}
                    onChange={(value) => setCode(value ?? "")}
                  />
                </div>
              </div>
            )}

            {!isClosed && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-4 bg-black text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Subir código"}
              </button>
            )}


            {isEnrolled && (

              <button
                onClick={async () => {
                  try {
                    const blob = await api.downloadMyLatestCode(tournament.id, user.token);

                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `mi_codigo_${slug}.py`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (e) {
                    toast.info("Aún no tienes ningún código enviado");
                  }
                }}
                className="mt-3 ml-3 bg-[#E5E0D3] border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition"
              >
                📥 Descargar último código
              </button>
            )}





            {progress && (
              <div className="mt-6 border border-black rounded-xl p-4 bg-[#F7F2E5] shadow-inner">
                {/* Estado */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">
                    Estado de la ejecución
                  </span>

                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${progress.status === "COMPLETADO"
                      ? "bg-green-600 text-white"
                      : progress.status === "ERROR"
                        ? "bg-red-600 text-white"
                        : "bg-yellow-500 text-black"
                      }`}
                  >
                    {progress.status}
                  </span>
                </div>

                {/* Barra de progreso */}
                {typeof progress.progress === "number" && (
                  <div className="w-full h-3 bg-gray-300 rounded overflow-hidden mb-3">
                    <div
                      className={`h-full transition-all duration-500 ${progress.status === "COMPLETADO"
                        ? "bg-green-600"
                        : progress.status === "ERROR"
                          ? "bg-red-600"
                          : "bg-black"
                        }`}
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                )}

                {/* Texto de progreso */}
                {typeof progress.progress === "number" && (
                  <p className="text-xs mb-1">
                    Progreso: <b>{progress.progress}%</b>
                  </p>
                )}

                {/* Mensaje */}
                {progress.message && (
                  <p className="text-sm italic text-gray-700">
                    {progress.message}
                  </p>
                )}
              </div>
            )}


          </>
        )}
      </div>

      {/* PARTICIPANTES */}
      {
        tournament && (
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
        )
      }

      {/* RANKING */}
      <div className="border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg">
        <h2 className="font-semibold mb-4">Ranking</h2>

        {ranking.length === 0 ? (
          <p className="text-sm italic text-gray-600">
            Aún no hay envíos para este torneo.
          </p>
        ) : (
          <ul className="space-y-2">
            {ranking.map((r) => (
              <li
                key={r.username}
                className={`flex justify-between items-center border rounded px-3 py-2 ${r.username === user.username
                  ? "bg-black text-white"
                  : "bg-white"
                  }`}
              >
                <span className="text-sm">
                  #{r.position} — {r.username}
                  {r.username === user.username && " (tú)"}
                </span>

                <span className="font-semibold">
                  {r.score}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>


      {/* ZONA PELIGRO */}
      {
        isEnrolled && (
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
        )
      }

    </motion.div >
  );
};

export default TorneoDetalle;
