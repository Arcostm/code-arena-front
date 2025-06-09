import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const TorneoDetalle = () => {
  const { slug } = useParams();
  const [isDragging, setIsDragging] = useState(false);
  const [archivoSubido, setArchivoSubido] = useState(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setArchivoSubido(files[0]);
      console.log("Archivo recibido:", files[0]);
    }
  };

  const torneo = {
    nombre: "Algorithm Showdown",
    estado: "Abierto",
    descripcion: "Resuelve problemas algorítmicos progresivamente más complejos.",
    ranking: [
      { usuario: "Arcos", puntuacion: 100, posicion: 1 },
      { usuario: "Manu", puntuacion: 99, posicion: 2 },
      { usuario: "Clara", puntuacion: 98, posicion: 3 },
    ],
    ultimoEnvio: {
      puntuacion: 100,
      tiempo: "1,30 s",
      fecha: "5 de abril a las 21:00",
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-[#F7F2E5] p-8 font-space text-black"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Cabecera */}
      <motion.div
        className="flex justify-between items-start mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold">{torneo.nombre}</h1>
        <span className="text-sm font-semibold">ESTADO: {torneo.estado}</span>
      </motion.div>

      {/* Zona principal */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Subir código */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg"
        >
          <div>
            <h2 className="text-md font-semibold mb-2">Descripción del reto</h2>
            <p className="border border-black rounded-md p-4 bg-[#D3CABF] text-sm">
              {torneo.descripcion}
            </p>
          </div>

          <div>
            <h2 className="text-md font-semibold mb-2">Subir código</h2>
            <div
              className={`border border-black rounded-md p-6 text-center text-sm text-gray-600 flex flex-col items-center gap-2 transition-colors duration-200 ${
                isDragging ? "bg-[#d3c8a8]" : "bg-[#D3CABF]"
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
                />
              </svg>
              <span>Arrastra tu archivo aquí</span>
            </div>

            {archivoSubido && (
              <p className="text-sm mt-2 text-gray-700">
                Archivo seleccionado: <span className="font-medium">{archivoSubido.name}</span>
              </p>
            )}
          </div>

          <button className="border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition-colors text-sm bg-[#D3CABF] font-medium">
            Subir versión
          </button>
        </motion.div>

        {/* Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg"
        >
          <h2 className="text-md font-semibold mb-4">Ranking</h2>
          <table className="w-full text-sm">
            <thead className="text-left">
              <tr>
                <th>Usuario</th>
                <th>Puntuación</th>
                <th>Posición</th>
              </tr>
            </thead>
            <tbody>
              {torneo.ranking.map((fila, i) => (
                <tr key={i} className="border-t border-gray-300">
                  <td className="py-2">{fila.usuario}</td>
                  <td>{fila.puntuacion}</td>
                  <td>{fila.posicion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Último envío */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="border border-black rounded-xl p-6 bg-[#E5E0D3] shadow-lg flex justify-between items-center text-sm"
      >
        <p>
          <span className="font-semibold">Último envío</span> <br />
          Puntuación {torneo.ultimoEnvio.puntuacion} pts · Tiempo {torneo.ultimoEnvio.tiempo} · Subido el {torneo.ultimoEnvio.fecha}
        </p>
        <button className="text-sm underline hover:text-gray-600">Descargar</button>
      </motion.div>
    </motion.div>
  );
};

export default TorneoDetalle;
