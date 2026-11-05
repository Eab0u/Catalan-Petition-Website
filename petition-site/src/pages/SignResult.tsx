import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AnimatedContent from "../components/AnimatedContent";

type ResultStatus = "success" | "cancelled" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  ja_signat: "Ja hem registrat una signatura amb aquest NIF/NIE. Cada persona pot signar una sola vegada.",
  sessio_expirada: "La sessió ha expirat. Torna a intentar-ho.",
  sessio_invalida: "Sessió invàlida. Torna a intentar-ho.",
  consent_required: "Has d'acceptar el tractament de dades per signar.",
  massa_peticions: "S'han realitzat massa intents des d'aquesta adreça IP. Torna-ho a provar d'aquí a una hora.",
  params_invalids: "Paràmetres invàlids rebuts del servei de signatura.",
  signatura_fallida: "El servei de signatura ha retornat un error.",
  server_error: "Error intern del servidor. Torna a intentar-ho en uns minuts.",
};

function SuccessView({ onHome }: { onHome: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl">✓</div>
      <h1 className="text-3xl md:text-4xl font-vastago font-bold text-black dark:text-white">
        Signatura registrada!
      </h1>
      <p className="text-lg text-neutral-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
        Gràcies per signar la ILP Llei Electoral Catalana. La teva signatura
        electrònica ha estat verificada i registrada correctament.
      </p>
      <p className="text-sm text-neutral-500 dark:text-gray-500">
        Rebràs una confirmació per correu electrònic si has facilitat la teva
        adreça en el procés d'idCAT Mòbil.
      </p>
      <button onClick={onHome} className="mt-4 cursor-pointer shrink-0 whitespace-nowrap rounded-2xl px-8 py-4 text-base font-semibold text-black dark:text-white border border-black/60 dark:border-white/30 bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/80 dark:hover:bg-white/20">
        Tornar a la pàgina principal
      </button>
    </div>
  );
}

function CancelledView({ onRetry, onHome }: { onRetry: () => void; onHome: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl">↩</div>
      <h1 className="text-3xl md:text-4xl font-vastago font-bold text-black dark:text-white">
        Signatura cancel·lada
      </h1>
      <p className="text-lg text-neutral-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
        Has cancel·lat el procés de signatura. Pots tornar a intentar-ho quan
        vulguis.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onRetry} className="cursor-pointer whitespace-nowrap rounded-2xl px-8 py-4 text-base font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors duration-150 shadow-lg">
          Tornar a signar
        </button>
        <button onClick={onHome} className="cursor-pointer shrink-0 whitespace-nowrap rounded-2xl px-8 py-4 text-base font-semibold text-black dark:text-white border border-black/60 dark:border-white/30 bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-105">
          Pàgina principal
        </button>
      </div>
    </div>
  );
}

function ErrorView({
  message,
  onRetry,
  onHome,
}: {
  message: string;
  onRetry: () => void;
  onHome: () => void;
}) {
  const isRetryable = !["ja_signat", "consent_required"].includes(message);

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl">✗</div>
      <h1 className="text-3xl md:text-4xl font-vastago font-bold text-black dark:text-white">
        Error en la signatura
      </h1>
      <p className="text-lg text-neutral-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
        {ERROR_MESSAGES[message] ?? "S'ha produït un error inesperat."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {isRetryable && (
          <button onClick={onRetry} className="cursor-pointer whitespace-nowrap rounded-2xl px-8 py-4 text-base font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors duration-150 shadow-lg">
            Tornar a intentar
          </button>
        )}
        <button onClick={onHome} className="cursor-pointer shrink-0 whitespace-nowrap rounded-2xl px-8 py-4 text-base font-semibold text-black dark:text-white border border-black/60 dark:border-white/30 bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-105">
          Pàgina principal
        </button>
      </div>
    </div>
  );
}

export default function SignResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = (searchParams.get("status") ?? "error") as ResultStatus;
  const message = searchParams.get("message") ?? "server_error";

  const goHome = () => navigate("/");
  const goSign = () => navigate("/sign");

  const bgColor =
    status === "success"
      ? "from-green-50 to-white dark:from-green-950/30 dark:to-black"
      : status === "cancelled"
      ? "from-yellow-50 to-white dark:from-yellow-950/20 dark:to-black"
      : "from-red-50 to-white dark:from-red-950/20 dark:to-black";

  return (
    <main
      className={`
        relative min-h-dvh w-full flex items-center justify-center px-4
        bg-gradient-to-b ${bgColor}
        transition-colors duration-300
      `}
    >
      <div className="relative z-10 w-full max-w-lg p-8 rounded-2xl bg-white/70 border border-black/20 dark:bg-white/10 dark:border-white/20 backdrop-blur-xl shadow-xl">
        <AnimatedContent distance={40} direction="vertical" duration={0.8}>
          {status === "success" && <SuccessView onHome={goHome} />}
          {status === "cancelled" && <CancelledView onRetry={goSign} onHome={goHome} />}
          {status === "error" && (
            <ErrorView message={message} onRetry={goSign} onHome={goHome} />
          )}
        </AnimatedContent>
      </div>
    </main>
  );
}
