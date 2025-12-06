// src/App.jsx
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/ui/Navbar.jsx";
import Home from "./pages/Home";
import About from "./pages/About";
import Torneos from "./pages/Torneos";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TorneoDetalle from "./pages/TorneoDetalle";
import Perfil from "./pages/Perfil";
import AdminValidator from "./pages/AdminValidator";
import TeacherRoute from "./components/ui/TeacherRoute.jsx";

import PrivateRoute from "./components/ui/PrivateRoute.jsx";
import PublicOnlyRoute from "./components/ui/PublicOnlyRoute.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="bg-[#F7F2E5] min-h-screen font-space">
      <Navbar />

      <Routes>

        {/* ============================
            RUTAS PÚBLICAS
           ============================ */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* ============================
            RUTAS SOLO PARA NO LOGGEADOS
           ============================ */}
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        {/* ============================
            RUTAS PRIVADAS (ALUMNOS + PROFES)
           ============================ */}
        <Route
          path="/torneos"
          element={
            <PrivateRoute>
              <Torneos />
            </PrivateRoute>
          }
        />

        <Route
          path="/torneos/:slug"
          element={
            <PrivateRoute>
              <TorneoDetalle />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />

        {/* ============================
            RUTA SOLO PROFESOR
           ============================ */}
        <Route
          path="/admin/validator"
          element={
            <TeacherRoute>
              <AdminValidator />
            </TeacherRoute>
          }
        />

      </Routes>

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}

export default App;
