import React from "react";

export const LandingPage = () => {
  return (
    <div className="bg-[#f7f2e5] flex justify-center w-full font-montserrat">
      <div className="bg-[#f7f2e5] w-full max-w-[1280px] min-h-[832px] relative">
        <header className="flex items-center justify-between px-10 py-6">
          <div className="flex items-center">
            <img
              className="w-[170px] h-[61px] object-cover"
              alt="Codearena"
              src="https://c.animaapp.com/mb88q58bfdPEcA/img/codearena-2.png"
            />
          </div>

          <div className="flex items-center gap-8">
            <button className="bg-black text-[#f7f2e5] rounded-xl h-12 px-7 font-grotesk text-xl">
              Empezar
            </button>

            <nav className="flex items-center gap-8 font-grotesk text-xl text-black">
              <a href="#">Torneos</a>
              <a href="#">Cómo funciona</a>
            </nav>
          </div>
        </header>

        <main className="flex flex-col items-center mt-16 text-center">
          <h1 className="font-grotesk text-black text-9xl">CODE ARENA</h1>

          <div className="mt-16 flex flex-col items-center text-[32px] font-grotesk font-bold text-black leading-normal">
            <p>Sube tu código.</p>
            <p>Escala en el ranking.</p>
            <p>Deja huella en cada línea.</p>
          </div>

          <div className="relative mt-4">
            <img
              className="w-[284px] h-[270px] object-cover"
              alt="Logo sobre columna"
              src="https://c.animaapp.com/mb88q58bfdPEcA/img/logo-removebg-preview-1.png"
            />
            <img
              className="w-[455px] h-[261px] object-cover mt-4"
              alt="Columna decorativa"
              src="https://c.animaapp.com/mb88q58bfdPEcA/img/chatgpt-image-3-abr-2025--12-59-19-1.png"
            />
          </div>
        </main>
      </div>
    </div>
  );
};
