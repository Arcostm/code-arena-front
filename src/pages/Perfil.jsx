import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import avatar from "../assets/avatar.png";
import { useEffect, useState } from "react";
import { getUserSubmissions } from "../services/api";

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada con éxito 👋");

    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  useEffect(() => {
    if (user) {
      getUserSubmissions(user.username)
        .then(setSubmissions)
        .catch(() => toast.error("No se pudo cargar el historial"));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F7F2E5] font-space flex flex-col items-center p-10 text-black">
      <h1 className="text-4xl font-bold mb-8">Mi Arena</h1>

      <img
        src={avatar}
        alt="Avatar"
        className="w-32 h-32 rounded-full border border-black object-cover mb-4"
      />

      <h2 className="text-xl font-bold">{user?.username || "Gladiador"}</h2>
      <p className="underline text-sm mb-6">{user?.email || "usuario@codearena.dev"}</p>

      <div className="text-center text-sm space-y-2 mb-8">
        <p>⚔️ Puntuación global: <strong>1.860 pts</strong></p>
        <p>🎯 Torneos jugados: <strong>5</strong></p>
        <p>🏆 Mejores puestos: <strong>1, 2</strong></p>
      </div>

      {/* Historial de envíos */}
      <div className="w-full max-w-2xl bg-[#E5E0D3] border border-black rounded-xl p-6 shadow-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Historial de envíos</h3>
        {submissions.length === 0 ? (
          <p className="text-sm text-gray-700">Aún no tienes envíos.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Torneo</th>
                <th>Puntuación</th>
                <th>Tiempo</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, i) => (
                <tr key={i} className="border-t border-gray-300">
                  <td className="py-2">{s.tournament_id}</td>
                  <td>{s.score}</td>
                  <td>{s.execution_time}s</td>
                  <td>{new Date(s.created_at * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-4">
        <button
          disabled
          className="bg-gray-400 text-white px-6 py-2 rounded-md opacity-60 cursor-not-allowed"
        >
          Editar
        </button>
        <button
          onClick={handleLogout}
          className="border border-black px-6 py-2 rounded-md hover:bg-black hover:text-white transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Perfil;
