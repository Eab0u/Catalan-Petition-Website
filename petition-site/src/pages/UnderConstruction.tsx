import React from "react";
import Particles from "../components/Particles";
import AnimatedContent from "../components/AnimatedContent";
import { useNavigate } from "react-router-dom";

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <main
      className="
        relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center
        bg-neutral-100 dark:bg-black transition-colors duration-300
      "
    >
      <div className="absolute inset-0">
        <Particles
          particleColors={["#ff0000", "#ffee00", "#0004ff"]}
          particleCount={250}
          particleSpread={10}
          speed={0.15}
          particleBaseSize={300}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="relative z-10 max-w-3xl px-6">
        <AnimatedContent distance={60} direction="vertical" duration={1}>
          <h1 className="text-5xl md:text-6xl font-vastago font-bold text-black dark:text-white leading-tight drop-shadow-lg transition-colors duration-300">
            🚧 Pàgina en construcció
          </h1>
        </AnimatedContent>

        <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.3}>
          <p className="mt-6 text-xl text-neutral-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
            Aquesta secció encara està en desenvolupament. Aviat podràs participar i donar suport a la ILP per una llei electoral justa.
          </p>
        </AnimatedContent>

        <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.5}>
          <button
            onClick={() => navigate("/")}
            className="
              mt-10 cursor-pointer shrink-0 whitespace-nowrap rounded-2xl px-8 py-4 text-base font-semibold 
              text-black dark:text-white border border-black/60 dark:border-white/30
              bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-lg
              transition-all duration-300 hover:scale-105 hover:bg-white/80 dark:hover:bg-white/20
            "
          >
            Tornar a la pàgina principal
          </button>
        </AnimatedContent>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white dark:to-black z-20" />
    </main>
  );
}
