const Torneos = () => {
  return (
    <div className="py-16 px-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 font-space text-black">Torneos disponibles</h1>
      <p className="text-lg md:text-xl text-gray-800 font-space">Participa, compite y escala en el ranking.</p>

      <div className="mt-12 flex flex-col gap-6 items-center">
        <div className="border p-6 rounded-xl shadow-md bg-white w-full max-w-xl">
          <h2 className="text-2xl font-semibold text-black">Demo Tournament 01</h2>
          <p className="text-gray-700 mt-2">Estado: Activo</p>
          <p className="text-gray-700">Ranking disponible</p>
        </div>
      </div>
    </div>
  );
};

export default Torneos;
