import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, getTournaments } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminValidator = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [selected, setSelected] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const ts = await getTournaments();
        setTournaments(ts);
        if (ts?.length) setSelected(ts[0].name);
      } catch {
        // ignore
      }
    })();
  }, []);

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
      <h1 className="text-2xl font-bold mb-6">Subir validador de torneo</h1>

      <div className="border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg max-w-xl">
        <label className="block text-sm mb-2">Torneo</label>
        <select
          className="w-full border border-black rounded-md p-2 bg-white mb-4"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

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
