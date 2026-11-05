import React, { useState } from "react";

const API_BASE = import.meta.env.DEV ? (import.meta.env.VITE_API_BASE as string) ?? "" : "";

export default function PetitionForm() {
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const handleSign = (e: React.MouseEvent) => {
    if (!consent) {
      e.preventDefault();
      setConsentError(true);
      return;
    }
    setConsentError(false);
    window.location.href = `${API_BASE}/api/auth/start?consent=true`;
  };

  return (
    <main
      className="
        relative min-h-dvh flex items-center justify-center px-4
        bg-neutral-100 text-black
        dark:bg-black dark:text-white
        transition-colors duration-300
      "
    >
      <div
        className="
          relative z-10 w-full max-w-lg p-8 rounded-2xl
          bg-white/70 border border-black/60 backdrop-blur-xl shadow-lg
          dark:bg-white/10 dark:border-white/30
          transition-colors duration-300
        "
      >
        <div className="flex justify-center mb-6">
          <h1 className="font-vastago text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
            Signa la Petició
          </h1>
        </div>

        {/* What is idCAT Mòbil */}
        <section className="mb-6 space-y-3 leading-relaxed text-neutral-700 dark:text-gray-300">
          <p>
            La signatura es realitza mitjançant{" "}
            <span className="font-semibold text-black dark:text-white">idCAT Mòbil</span>,
            el certificat digital mòbil del Consorci AOC. És un procés segur, verificat per
            l'administració catalana, que garanteix que cada signatura és única i autèntica.
          </p>
          <p>
            Si encara no tens l'idCAT Mòbil, ara pots obtenir-lo per{" "}
            <span className="font-semibold text-black dark:text-white">
              videoidentificació
            </span>{" "}
            sense desplaçar-te presencialment, sempre que tinguis un DNI o TIE espanyol
            vigent. Aquesta modalitat està disponible des del 29 d'octubre de 2025.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="https://www.aoc.cat/serveis-aoc/idcat-mobil/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-block px-4 py-2 rounded-xl text-sm font-semibold
                border border-black/40 dark:border-white/30
                bg-white/60 dark:bg-white/10 backdrop-blur-sm
                hover:bg-white/80 dark:hover:bg-white/20 transition-all duration-200
              "
            >
              Obtenir idCAT Mòbil →
            </a>
            <a
              href="https://www.youtube.com/watch?v=IdCATMobilDemo"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-block px-4 py-2 rounded-xl text-sm font-semibold
                border border-black/40 dark:border-white/30
                bg-white/60 dark:bg-white/10 backdrop-blur-sm
                hover:bg-white/80 dark:hover:bg-white/20 transition-all duration-200
              "
            >
              Vídeo explicatiu →
            </a>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-6 rounded-xl border border-black/20 dark:border-white/20 bg-neutral-100/60 dark:bg-white/5 p-4 space-y-1">
          <p className="font-semibold text-black dark:text-white mb-2">Com funciona</p>
          <ol className="list-decimal list-inside space-y-1 text-neutral-700 dark:text-gray-300">
            <li>Accepta el tractament de dades a continuació.</li>
            <li>Fes clic a «Signa amb idCAT Mòbil».</li>
            <li>Autentica't amb el teu idCAT Mòbil al portal del Consorci AOC.</li>
            <li>Signa el text de la ILP electrònicament.</li>
            <li>Seràs redirigit aquí amb la confirmació.</li>
          </ol>
        </section>

        {/* Consent checkbox */}
        <div className="mb-6">
          <label
            className="
              flex items-start gap-3 p-3 rounded-lg cursor-pointer
              bg-neutral-200/70 border border-black/40 backdrop-blur-md
              dark:bg-black/30 dark:border-white/20
              hover:bg-neutral-300/70 dark:hover:bg-black/40
              transition-colors duration-300
            "
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (e.target.checked) setConsentError(false);
              }}
              className="
                mt-0.5 h-5 w-5 shrink-0 rounded-md border border-black/50 bg-white/80
                dark:border-white/30 dark:bg-black/50
                checked:bg-black dark:checked:bg-white
                cursor-pointer transition-colors duration-300
              "
            />
            <span className="font-semibold text-black dark:text-white leading-snug">
              Accepto el tractament de les meves dades personals per a la present ILP
              d'acord amb la política de privacitat i el RGPD.{" "}
              <span className="font-normal text-neutral-600 dark:text-gray-400">
                Les dades verificades per idCAT Mòbil s'emmagatzemaran xifrades i
                s'usaran exclusivament per al recompte oficial de signatures.
              </span>
            </span>
          </label>
          {consentError && (
            <p className="mt-2 text-red-600 dark:text-red-400">
              Has d'acceptar el tractament de dades per continuar.
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleSign}
          className="
            w-full cursor-pointer rounded-2xl px-6 py-4 text-base font-semibold
            bg-senyera-red text-white
            shadow-lg
            transition-all duration-300 hover:scale-105 hover:bg-senyera-yellow hover:text-black
            disabled:opacity-50
          "
        >
          Signa amb idCAT Mòbil
        </button>

        <p className="mt-4 text-center text-neutral-500 dark:text-gray-500">
          La identitat és verificada per Consorci AOC. No compartim les teves dades
          amb tercers.
        </p>
      </div>
    </main>
  );
}
