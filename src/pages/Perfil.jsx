import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import avatar from "../assets/avatar.png";

const Perfil = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Sesión cerrada con éxito 👋");

        setTimeout(() => {
            navigate("/");
        }, 100); // Esperamos 100ms antes de redirigir
    };

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
