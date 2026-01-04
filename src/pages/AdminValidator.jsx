// D:\cade-arena-front\frontend\src\pages\AdminValidator.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { api } from "../services/api";

const AdminValidator = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const activeTournaments = tournaments.filter(t => !t.is_archived);
  const archivedTournaments = tournaments.filter(t => t.is_archived);
  const [selected, setSelected] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newTournament, setNewTournament] = useState("");
  const [creating, setCreating] = useState(false);


  useEffect(() => {
    (async () => {
      try {
        const ts = await api.adminListTournaments(user.token);

        setTournaments(ts);
        if (ts?.length) setSelected(ts[0].name);
      } catch {
        // ignore
      }
    })();
  }, []);

  const createTournament = async () => {
    if (!newTournament.trim()) {
      toast.error("El nombre del torneo no puede estar vacío");
      return;
    }

    setCreating(true);
    try {
      await api.createTournament(newTournament, user.token);
      toast.success("Torneo creado");

      const ts = await api.adminListTournaments(user.token);

      setTournaments(ts);
      setNewTournament("");
    } catch (e) {
      toast.error(e.message || "Error al crear torneo");
    } finally {
      setCreating(false);
    }
  };


  const onUpload = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión.");
      return;
    }
    if (!selected || !file) {
      toast.error("Elige torneo y archivo (.py o .sh).");
      return;
    }
    setUploading(true);
    try {
      const res = await api.uploadValidator(selected, file, user.token);
      toast.success(
        `Validador subido: ${res.validator_lang} → ${res.validator_path}`
      );
    } catch (e) {
      toast.error(e.message || "Error al subir validador");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#F7F2E5] p-8 font-space text-black"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold mb-6">Administrar torneos</h1>

      {/* CREAR TORNEO */}
      <div className="border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg max-w-xl mb-8">
        <h2 className="font-semibold mb-4">Crear torneo</h2>

        <input
          type="text"
          value={newTournament}
          onChange={(e) => setNewTournament(e.target.value)}
          placeholder="Nombre del torneo"
          className="w-full border border-black rounded-md p-2 bg-white mb-3"
        />

        <button
          onClick={createTournament}
          disabled={creating}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          {creating ? "Creando..." : "Crear torneo"}
        </button>
      </div>


      <div className="border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg max-w-xl">
        <label className="block text-sm mb-2">Torneo</label>
        <select
          className="w-full border border-black rounded-md p-2 bg-white mb-4"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {/* ACTIVOS */}
          {activeTournaments.length > 0 && (
            <optgroup label="🟢 Torneos activos">
              {activeTournaments.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </optgroup>
          )}

          {/* ARCHIVADOS */}
          {archivedTournaments.length > 0 && (
            <optgroup label="📦 Torneos archivados">
              {archivedTournaments.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>


        <div className="flex gap-3 mb-4">
          <button
            onClick={async () => {
              try {
                const t = tournaments.find(t => t.name === selected);
                await api.closeTournament(t.id, user.token);
                toast.success("Torneo cerrado");

                const ts = await api.adminListTournaments(user.token);

                setTournaments(ts);
              } catch {
                toast.error("Error al cerrar torneo");
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Cerrar torneo
          </button>

          <button
            onClick={async () => {
              try {
                const t = tournaments.find(t => t.name === selected);
                await api.openTournament(t.id, user.token);
                toast.success("Torneo abierto");

                const ts = await api.adminListTournaments(user.token);

                setTournaments(ts);
              } catch {
                toast.error("Error al abrir torneo");
              }
            }}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Abrir torneo
          </button>

          {(() => {
            const t = tournaments.find(t => t.name === selected);
            if (!t) return null;

            // 📂 DESARCHIVAR
            if (t.is_archived) {
              return (
                <button
                  onClick={async () => {
                    const ok = window.confirm(
                      `📂 ¿Restaurar el torneo "${t.name}"?\n\n` +
                      `• Volverá a estar visible\n` +
                      `• Se abrirá automáticamente`
                    );
                    if (!ok) return;

                    try {
                      await api.unarchiveTournament(t.id, user.token);
                      toast.success("Torneo restaurado");

                      const ts = await api.adminListTournaments(user.token);

                      setTournaments(ts);
                      setSelected(
                        ts.find(t => !t.is_archived)?.name || ""
                      );
                      
                    } catch (e) {
                      toast.error(e.message || "Error al restaurar torneo");
                    }
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  📂 Desarchivar torneo
                </button>
              );
            }

            // 📦 ARCHIVAR
            return (
              <button
                onClick={async () => {
                  const ok = window.confirm(
                    `📦 ¿Archivar el torneo "${t.name}"?\n\n` +
                    `• Se ocultará a los alumnos\n` +
                    `• Se conservarán envíos y ranking`
                  );
                  if (!ok) return;

                  try {
                    await api.archiveTournament(t.id, user.token);
                    toast.success("Torneo archivado");

                    const ts = await api.adminListTournaments(user.token);

                    setTournaments(ts);
                    setSelected(
                      ts.find(t => !t.is_archived)?.name || ""
                    );
                    
                  } catch (e) {
                    toast.error(e.message || "Error al archivar torneo");
                  }
                }}
                className="bg-gray-700 text-white px-3 py-1 rounded"
              >
                📦 Archivar torneo
              </button>
            );
          })()}



          <button
            onClick={async () => {
              const t = tournaments.find(t => t.name === selected);
              if (!t) return;

              const ok = window.confirm(
                `🗑️ ELIMINAR TORNEO "${t.name}"\n\n` +
                `⚠️ ESTA ACCIÓN ES PERMANENTE\n` +
                `• Se borran envíos\n` +
                `• Se borra ranking\n` +
                `• NO se puede deshacer\n\n` +
                `¿Seguro que quieres continuar?`
              );

              if (!ok) return;

              try {
                await api.deleteTournament(t.id, user.token);
                toast.success("Torneo eliminado");

                const ts = await api.adminListTournaments(user.token);

                setTournaments(ts);
                setSelected(
                  ts.find(t => !t.is_archived)?.name || ""
                );
                
              } catch (e) {
                toast.error(e.message || "Error al eliminar torneo");
              }
            }}
            className="bg-black text-white px-3 py-1 rounded"
          >
            🗑️ Eliminar torneo
          </button>
        </div>



        <label className="block text-sm mb-2">Archivo (.py / .sh)</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full bg-white p-2 border border-black rounded-md"
          accept=".py,.sh"
        />

        <button
          className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          disabled={uploading}
          onClick={onUpload}
        >
          {uploading ? "Subiendo..." : "Subir validador"}
        </button>
      </div>
    </motion.div>
  );
};

export default AdminValidator;
