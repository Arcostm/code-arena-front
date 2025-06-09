import { motion } from "framer-motion";
import ilustracion from '../assets/columna-c.png';

const Home = () => {
  return (
    <div className="relative w-full h-screen bg-[#F7F2E5] overflow-hidden">

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center pt-20 gap-8 pb-48"
      >
        <h1 className="text-[64px] md:text-[96px] font-bold text-black font-space">
          CODE ARENA
        </h1>

        <div className="text-black text-[20px] md:text-[28px] font-medium leading-relaxed font-space">
          <p>Sube tu código.</p>
          <p>Escala en el ranking.</p>
          <p>Deja huella en cada línea.</p>
        </div>
      </motion.div>

      {/* Imagen de fondo perfectamente centrada */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 flex justify-center z-0"
      >
        <img
          src={ilustracion}
          alt="3D Illustration"
          className="w-[300px] md:w-[400px] lg:w-[455px] object-contain"
        />
      </motion.div>

    </div>
  );
};

export default Home;
