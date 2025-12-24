import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await api.adminListUsers(user.token);
      setUsers(data);
    } catch (e) {
      toast.error(e.message || "Error cargando usuarios");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-[#F7F2E5] p-8 font-space text-black"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-6">Administrar usuarios</h1>

      <div className="border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg max-w-3xl">
        <table className="w-full text-sm border border-black">
          <thead className="bg-[#D3CABF]">
            <tr>
              <th className="p-2 text-left">Usuario</th>
              <th className="p-2 text-left">Rol</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 flex gap-2 justify-center">
                  {u.role === "student" ? (
                    <button
                      onClick={async () => {
                        await api.makeTeacher(u.username, user.token);
                        toast.success("Ahora es profesor");
                        loadUsers();
                      }}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Hacer profesor
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await api.makeStudent(u.username, user.token);
                        toast.success("Ahora es alumno");
                        loadUsers();
                      }}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Hacer alumno
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      const ok = window.confirm(
                        `¿Eliminar usuario "${u.username}"?`
                      );
                      if (!ok) return;

                      await api.deleteUser(u.id, user.token);
                      toast.success("Usuario eliminado");
                      loadUsers();
                    }}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminUsers;
