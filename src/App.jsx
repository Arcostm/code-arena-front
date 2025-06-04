import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <div className="bg-[#F7F2E5] min-h-screen font-space">
      <Navbar />
      <Home />
    </div>
  );
}

export default App;
