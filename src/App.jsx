import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Torneos from './pages/Torneos';
import Signup from './pages/Signup';

// Puedes importar más páginas en el futuro

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
          {/* Aquí irán más rutas */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
