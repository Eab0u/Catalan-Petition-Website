import React from "react";
import Particles from "../components/Particles";
import AnimatedContent from "../components/AnimatedContent";
import { useNavigate } from "react-router-dom";

export default function Documents() {
  const navigate = useNavigate();

  return (
    <main
      className="
        relative min-h-screen w-full overflow-hidden flex flex-col items-center text-center
        bg-neutral-100 dark:bg-black transition-colors duration-300
      "
    >
      {/* Background Particles */}
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

      <div className="relative z-10 max-w-6xl w-full px-6 pt-8 pb-16 space-y-8">


        {/* Title */}
        <AnimatedContent distance={60} direction="vertical" duration={1}>
          <h2 className="text-4xl md:text-5xl font-vastago font-bold text-black dark:text-white drop-shadow-lg">
            Documents
          </h2>
        </AnimatedContent>

        {/* Subtitle */}
        <AnimatedContent distance={70} direction="vertical" duration={1} delay={0.2}>
          <p className="text-lg md:text-xl text-neutral-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Aquí trobaràs tots els documents oficials relacionats amb la ILP.
            Pots descarregar-los directament o consultar-los en línia.
          </p>
        </AnimatedContent>

        {/* Return Home Button */}
        <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.35}>
          <button
            onClick={() => navigate("/")}
            className="
              cursor-pointer mt-4 inline-block px-8 py-4 rounded-2xl font-semibold
              text-black dark:text-white border border-black/60 dark:border-white/30
              bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-lg
              transition-all duration-300 hover:scale-105 hover:bg-white/80 dark:hover:bg-white/20
            "
          >
            Tornar a la pàgina principal
          </button>
        </AnimatedContent>

        {/* Grid of Documents */}
        <div className="grid gap-10 md:grid-cols-2">

          {/* Document 1 */}
          <AnimatedContent distance={60} direction="vertical" duration={1}>
            <div
              className="
                p-8 rounded-2xl shadow-xl h-full text-left
                bg-white/70 dark:bg-white/10 backdrop-blur-xl
                border border-black/20 dark:border-white/20
                transition-all duration-300
              "
            >
              <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                INFORME JURÍDIC.pdf
              </h3>

              <p className="text-neutral-700 dark:text-gray-300 mb-6 leading-relaxed">
                Informe jurídic emès pels lletrats del Parlament sobre la conformitat legal i l’admissió a tràmit de la Proposició de llei electoral de Catalunya.
              </p>

              <a
                href="/docs/INFORME JURIDIC.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-block px-6 py-3 rounded-2xl font-semibold
                  text-black dark:text-white border border-black/60 dark:border-white/30
                  bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-lg
                  transition-all duration-300 hover:scale-105 hover:bg-white/80 dark:hover:bg-white/20
                "
              >
                Descarregar PDF
              </a>
            </div>
          </AnimatedContent>

          {/* Document 2 */}
          <AnimatedContent distance={60} direction="vertical" duration={1} delay={0.15}>
            <div
              className="
                p-8 rounded-2xl shadow-xl h-full text-left
                bg-white/70 dark:bg-white/10 backdrop-blur-xl
                border border-black/20 dark:border-white/20
                transition-all duration-300
              "
            >
              <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                AUDA.pdf
              </h3>

              <p className="text-neutral-700 dark:text-gray-300 mb-6 leading-relaxed">
                Comunicació oficial de la Secretaria General del Parlament sobre l’afectació pressupostària de la ILP i els requisits establerts pel Reglament.
              </p>

              <a
                href="/docs/AUDA.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-block px-6 py-3 rounded-2xl font-semibold
                  text-black dark:text-white border border-black/60 dark:border-white/30
                  bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-lg
                  transition-all duration-300 hover:scale-105 hover:bg-white/80 dark:hover:bg-white/20
                "
              >
                Descarregar PDF
              </a>
            </div>
          </AnimatedContent>

          {/* Document 3 */}
          <AnimatedContent distance={60} direction="vertical" duration={1} delay={0.3}>
            <div
              className="
                p-8 rounded-2xl shadow-xl h-full text-left
                bg-white/70 dark:bg-white/10 backdrop-blur-xl
                border border-black/20 dark:border-white/20
                transition-all duration-300
              "
            >
              <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                ILP.pdf
              </h3>

              <p className="text-neutral-700 dark:text-gray-300 mb-6 leading-relaxed">
                Document complet de la presentació de la ILP: sol·licitud, annexos, text articulat, memòria justificativa i relació de membres de la Comissió Promotora.
              </p>

              <a
                href="/docs/ILP.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-block px-6 py-3 rounded-2xl font-semibold
                  text-black dark:text-white border border-black/60 dark:border-white/30
                  bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-lg
                  transition-all duration-300 hover:scale-105 hover:bg-white/80 dark:hover:bg-white/20
                "
              >
                Descarregar PDF
              </a>
            </div>
          </AnimatedContent>

          {/* Document 4 */}
          <AnimatedContent distance={60} direction="vertical" duration={1} delay={0.45}>
            <div
              className="
                p-8 rounded-2xl shadow-xl h-full text-left
                bg-white/70 dark:bg-white/10 backdrop-blur-xl
                border border-black/20 dark:border-white/20
                transition-all duration-300
              "
            >
              <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                PARLAMENT DE CATALUNYA.pdf
              </h3>

              <p className="text-neutral-700 dark:text-gray-300 mb-6 leading-relaxed">
                Acord de la Mesa del Parlament sobre la qualificació i admissió a tràmit de la ILP, amb notificació oficial a la Comissió Promotora.
              </p>

              <a
                href="/docs/PARLAMENT DE CATALUNYA.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-block px-6 py-3 rounded-2xl font-semibold
                  text-black dark:text-white border border-black/60 dark:border-white/30
                  bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-lg
                  transition-all duration-300 hover:scale-105 hover:bg-white/80 dark:hover:bg-white/20
                "
              >
                Descarregar PDF
              </a>
            </div>
          </AnimatedContent>

        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white dark:to-black z-20" />
    </main>
  );
}
