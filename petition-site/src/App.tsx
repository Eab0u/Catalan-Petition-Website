import React from "react";
import "./index.css";
import Counter from "./components/Counter";
import { useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Particles from "./components/Particles";

function App() {
  const navigate = useNavigate();

  const goToForm = () => {
    navigate("/sign");
  };

  return (
    <>
      <NavBar />

      {/* Hero Section */}
      <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center text-center">
        {/* Particle background */}
        <div className="absolute inset-0">
          <Particles
            particleColors={["#ffffff", "#ffffff"]}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={60}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl px-6">
          <h1 className="text-4xl md:text-6xl font-vastago font-bold text-white">
            Recollida de Signatures
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200">
            Dona suport a la ILP per una llei electoral justa a Catalunya.
          </p>
          <div className="mt-8">
            <Counter />
          </div>
          <button
            onClick={goToForm}
            className="cursor-pointer shrink-0 whitespace-nowrap rounded-2xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-neutral-800"
          >
            Signa la Petició
          </button>
        </div>
      </main>

      {/* Info Section */}
      <section className="info-section py-12 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
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
