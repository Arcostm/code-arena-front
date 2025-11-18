import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/ui/Navbar.jsx";   // ✅ FALTABA ESTE IMPORT

import Home from "./pages/Home";
import About from "./pages/About";
import Torneos from "./pages/Torneos";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TorneoDetalle from "./pages/TorneoDetalle";
import Perfil from "./pages/Perfil";
import AdminValidator from "./pages/AdminValidator";

import PrivateRoute from "./components/ui/PrivateRoute.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <Router>
      <div className="bg-[#F7F2E5] min-h-screen font-space">
        <Navbar />

        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/torneos" element={<Torneos />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/torneos/:slug" element={<TorneoDetalle />} />

          {/* Rutas privadas */}
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

          {/* Ruta privada para subir validadores */}
          <Route
            path="/admin/validator"
            element={
              <PrivateRoute>
                <AdminValidator />
              </PrivateRoute>
            }
          />
        </Routes>

        <ToastContainer position="top-right" autoClose={2500} />
      </div>
    </Router>
  );
}

export default App;
