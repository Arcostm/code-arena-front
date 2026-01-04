import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import avatarFallback from "../assets/avatar.png";

const Perfil = () => {
  const navigate = useNavigate();
  const { user, token, logout, setUser } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar_url || avatarFallback
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.avatar_url) setAvatarPreview(user.avatar_url);
  }, [user]);

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (password && password !== confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      let newAvatarUrl = user?.avatar_url;

      if (avatarFile) {
        const res = await api.uploadAvatar(avatarFile, token);
        newAvatarUrl = res.avatar_url;
      }

      const updated = await api.updateProfile(
        {
          email,
          new_password: password || undefined,
        },
        token
      );

      // 🔥 Actualizar sesión en caliente
      setUser({
        ...user,
        email: updated.email,
        avatar_url: newAvatarUrl,
      });

      toast.success("Perfil actualizado correctamente");
    } catch (err) {
      toast.error(err.message || "Error actualizando perfil");
    } finally {
      setLoading(false);
    }
  }


  function handleLogout() {
    logout();
    toast.success("Sesión cerrada 👋");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#F7F2E5] flex justify-center items-start p-10">
      <div className="bg-white rounded-xl shadow-md w-full max-w-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Mi Perfil</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border bg-gray-100 mb-2">
            <img
              src={avatarPreview}
              onError={(e) => (e.currentTarget.src = avatarFallback)}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <label className="text-sm underline cursor-pointer">
            Cambiar foto
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </label>
        </div>




        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Usuario</label>
            <input
              value={user?.username}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Nueva contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Confirmar contraseña</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            Guardar cambios
          </button>

          <button
            onClick={handleLogout}
            className="border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
