import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-[#F7F2E5] font-space px-6 py-20 text-black">
      {/* Título principal animado */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-center mb-8"
      >
        ¿Cómo funciona Code Arena?
      </motion.h2>

      {/* Subtítulo */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-xl text-center max-w-2xl mx-auto mb-12"
      >
        Participa en torneos de código, sube tus soluciones, compite por puntos y asciende en el ranking. ¡Demuestra que eres el mejor gladiador del código!
      </motion.p>

      {/* Secciones explicativas */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#E5E0D3] rounded-2xl p-6 shadow-lg border border-black text-center"
          >
            <div className="text-4xl mb-4">{card.emoji}</div>
            <h3 className="text-xl font-semibold mb-2">{card.titulo}</h3>
            <p className="text-sm text-gray-700">{card.descripcion}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const cards = [
  {
    emoji: "⚔️",
    titulo: "Compite en torneos",
    descripcion: "Enfréntate a retos algorítmicos por tiempo limitado para demostrar tu habilidad.",
  },
  {
    emoji: "📤",
    titulo: "Sube tu código",
    descripcion: "Envía tus soluciones en distintos lenguajes y compite por la eficiencia y rapidez.",
  },
  {
    emoji: "🏆",
    titulo: "Gana puntos",
    descripcion: "Recibe puntuación por tus envíos y escala en el ranking de gladiadores del código.",
  },
];

export default About;
