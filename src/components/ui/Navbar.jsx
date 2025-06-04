import logo from '../../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="w-full px-10 py-6 max-w-7xl mx-auto bg-[#F7F2E5] flex justify-between items-center font-space">
      {/* Logo a la izquierda */}
      <img
        src={logo}
        alt="Code Arena Logo"
        className="w-[170px] h-[61px] object-contain"
      />

      {/* Bloque de botones centrado */}
      <div className="flex items-center gap-6">
        {/* Botón principal */}
        <button className="bg-black text-[#F7F2E5] px-6 py-2 rounded-xl text-lg hover:bg-gray-800 transition-colors">
          Empezar
        </button>

        {/* Botones secundarios: solo texto */}
        <button className="text-black text-lg hover:text-gray-600 transition-colors">
          Torneos
        </button>
        <button className="text-black text-lg hover:text-gray-600 transition-colors">
          Cómo funciona
        </button>
      </div>

      {/* Placeholder para equilibrar con el logo */}
      <div className="w-[170px]" />
    </nav>
  );
};

export default Navbar;
