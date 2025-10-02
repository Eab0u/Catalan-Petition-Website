import React from "react";
import "./index.css";
import Counter from "./components/Counter";
import { useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Particles from "./components/Particles";
import TextType from "./components/TextType";

function App() {
  const navigate = useNavigate();

  const goToForm = () => {
    navigate("/sign");
  };

  return (
    <>
      <NavBar />
      {/* Hero Section */}
      <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center text-center bg-black">
        {/* Particle background */}
        <div className="absolute inset-0">
          <Particles
            particleColors={["#ff0000", "#ffee00", "#0004ff"]}
            particleCount={300}
            particleSpread={10}
            speed={0.15}
            particleBaseSize={300}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="relative text-4xl md:text-6xl font-vastago font-bold text-white leading-tight">
            {/* Invisible sizer to lock height/width */}
            <span className="invisible block">
              ILP per una llei electoral justa.
            </span>

            {/* Overlayed typing effect */}
            <span className="absolute inset-0 flex items-center justify-center">
              <TextType
                text={[
                  "Recollida de Signatures.",
                  "ILP per una llei electoral justa.",
                  "Dona suport a Catalunya!",
                ]}
                typingSpeed={60}
                pauseDuration={2500}
                showCursor={true}
                cursorCharacter="|"
                className="whitespace-nowrap"
              />
            </span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-white font-bold">
            Dona suport a la ILP per una llei electoral justa a Catalunya.
          </p>

          <div className="mt-8">
            <Counter />
          </div>

          <button
            onClick={goToForm}
            className="mt-8 cursor-pointer shrink-0 whitespace-nowrap rounded-2xl px-8 py-4 text-base font-semibold text-white bg-white/10 border border-white/30 backdrop-blur-xl shadow-lgtransition-colors duration-300 hover:bg-white/20">
            Signa la Petició
          </button>
        </div>
      </main>

      {/* Info Section */}
      <section className="info-section py-12 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
        <div className="w-20 h-20 bg-debugpink"></div>
          <h2 className="text-2xl font-bold">Per què aquesta ILP?</h2>
          <p className="text-lg text-gray-700">
            Aquesta iniciativa busca establir una llei electoral més justa i
            representativa per a Catalunya. Junts podem fer-ho realitat.
          </p>
        </div>
      </section>
    </>
  );
}

export default App;
