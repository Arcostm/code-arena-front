import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import avatar from "../assets/avatar.png";

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada con éxito 👋");

    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${user.username}/history`
        );
        if (!res.ok) throw new Error("Error al obtener historial");
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        toast.error("No se pudo cargar el historial");
      }
    };

    if (user) fetchHistory();
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
      <p className="underline text-sm mb-6">
        {user?.email || "usuario@codearena.dev"}
      </p>

      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-bold mb-4">Historial de envíos</h3>
        {history.length === 0 ? (
          <p className="text-gray-600">No tienes envíos todavía.</p>
        ) : (
          <table className="w-full text-sm border border-black rounded-md overflow-hidden">
            <thead className="bg-[#E5E0D3]">
              <tr>
                <th className="px-4 py-2 text-left">Torneo</th>
                <th className="px-4 py-2">Puntuación</th>
                <th className="px-4 py-2">Tiempo</th>
                <th className="px-4 py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{h.tournament}</td>
                  <td className="px-4 py-2 text-center">{h.score}</td>
                  <td className="px-4 py-2 text-center">{h.execution_time}s</td>
                  <td className="px-4 py-2 text-center">
                    {new Date(h.timestamp * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-4 mt-8">
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
