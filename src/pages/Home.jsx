import ilustracion from '../assets/columna-c.png';

const Home = () => {
  return (
    <div className="relative w-full h-screen bg-[#F7F2E5]">

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center text-center pt-20 gap-8 pb-48">
        <h1 className="text-[64px] md:text-[96px] font-bold text-black font-space">
          CODE ARENA
        </h1>

        <div className="text-black text-[20px] md:text-[28px] font-medium leading-relaxed font-space">
          <p>Sube tu código.</p>
          <p>Escala en el ranking.</p>
          <p>Deja huella en cada línea.</p>
        </div>
      </div>

      {/* Imagen de fondo ABSOLUTA pegada abajo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0">
        <img
          src={ilustracion}
          alt="3D Illustration"
          className="w-[300px] md:w-[400px] lg:w-[455px] object-contain"
        />
      </div>

    </div>
  );
};

export default Home;
