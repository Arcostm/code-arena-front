import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="w-full px-10 py-6 max-w-7xl mx-auto bg-[#F7F2E5] flex justify-between items-center font-space">
      {/* Logo a la izquierda (que también lleva a la home) */}
      <Link to="/">
        <img
          src={logo}
          alt="Code Arena Logo"
          className="w-[170px] h-[61px] object-contain"
        />
      </Link>

      {/* Bloque de navegación */}
      <div className="flex items-center gap-6">
        <Link
          to="/signup"
          className="bg-black text-[#F7F2E5] px-6 py-2 rounded-xl text-lg hover:bg-gray-800 transition-colors"
        >
          Empezar
        </Link>

        <Link
          to="/torneos"
          className="text-black text-lg hover:text-gray-600 transition-colors"
        >
          Torneos
        </Link>

        <Link
          to="/about"
          className="text-black text-lg hover:text-gray-600 transition-colors"
        >
          Cómo funciona
        </Link>
      </div>

      {/* Placeholder para equilibrar con el logo */}
      <div className="w-[170px]" />
    </nav>
  );
};

export default Navbar;
