// D:\cade-arena-front\frontend\src\pages\AdminUsers.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState("student");
    const [creating, setCreating] = useState(false);

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

    const createUser = async () => {
        if (!newUsername.trim() || !newPassword.trim()) {
            toast.error("Usuario y contraseña obligatorios");
            return;
        }

        setCreating(true);
        try {
            await api.createUser(
                {
                    username: newUsername.trim(),
                    password: newPassword.trim(),
                    role: newRole,
                },
                user.token
            );

            toast.success("Usuario creado correctamente");
            setNewUsername("");
            setNewPassword("");
            setNewRole("student");
            loadUsers();
        } catch (e) {
            toast.error(e.message || "Error creando usuario");
        } finally {
            setCreating(false);
        }
    };


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

            {/* CREAR USUARIO */}
            <div className="border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg max-w-xl mb-8">
                <h2 className="font-semibold mb-4">Crear usuario</h2>

                <input
                    className="w-full p-2 border border-black rounded mb-3"
                    placeholder="Nombre de usuario"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full p-2 border border-black rounded mb-3"
                    placeholder="Contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <select
                    className="w-full p-2 border border-black rounded mb-4"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                >
                    <option value="student">Alumno</option>
                    <option value="teacher">Profesor</option>
                </select>

                <button
                    onClick={createUser}
                    disabled={creating}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    {creating ? "Creando..." : "Crear usuario"}
                </button>
            </div>

        </motion.div>
    );
};

export default AdminUsers;
