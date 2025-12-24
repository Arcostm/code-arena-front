// 📄 src/components/ui/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-[#F7F2E5] py-6 font-space relative">
      <div className="w-full px-10 flex items-center justify-between">

        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src={logo}
              alt="Code Arena Logo"
              className="w-[170px] h-[61px] object-contain"
            />
          </Link>
        </div>

        {/* Menú centrado */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-8">
          <Link to="/torneos" className="text-black text-lg hover:text-gray-600 transition-colors">
            Torneos
          </Link>
          <Link to="/about" className="text-black text-lg hover:text-gray-600 transition-colors">
            Cómo funciona
          </Link>
        </div>

        {/* Acciones a la derecha */}
        <div className="flex-shrink-0 relative" ref={menuRef}>
          {user ? (
            <div className="relative">
              <img
                src={avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full border border-black object-cover cursor-pointer"
                onClick={() => setShowMenu((prev) => !prev)}
              />
              <div
                className={`absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md z-50 transition-all duration-200 ease-in-out transform ${showMenu
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
              >
                {/* Dashboard */}
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/dashboard");
                    setShowMenu(false);
                  }}
                >
                  Dashboard
                </button>

                {/* Perfil */}
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/perfil");
                    setShowMenu(false);
                  }}
                >
                  Ver perfil
                </button>

                {/* Profesor */}
                {user.role === "teacher" && (
                  <>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        navigate("/admin/validator");
                        setShowMenu(false);
                      }}
                    >
                      Administrar torneos
                    </button>

                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        navigate("/admin/users");
                        setShowMenu(false);
                      }}
                    >
                      Administrar usuarios
                    </button>
                  </>
                )}



                {/* Logout */}
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>

            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="bg-[#E5E0D3] text-black border border-black px-4 py-2 rounded-xl text-sm hover:bg-black hover:text-[#F7F2E5] transition-colors"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/signup"
                className="bg-black text-[#F7F2E5] px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
