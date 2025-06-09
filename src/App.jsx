import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Torneos from './pages/Torneos';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import TorneoDetalle from './pages/TorneoDetalle';
import Perfil from "./pages/Perfil";

function App() {
  return (
    <Router>
      <div className="bg-[#F7F2E5] min-h-screen font-space">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/torneos" element={<Torneos />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/torneos/:slug" element={<TorneoDetalle />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
