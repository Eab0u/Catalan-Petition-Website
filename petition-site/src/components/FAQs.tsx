import { useState } from "react";
import AnimatedContent from "./AnimatedContent";

interface Faq {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: Faq) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        py-3 select-none
        border-b border-neutral-300 last:border-b-0
        dark:border-white/20
      "
    >
      {/* CLICKABLE AREA ALWAYS FULL HEIGHT */}
      <div
        className="
          w-full cursor-pointer
        "
        onClick={() => setOpen(!open)}
      >
        {/* QUESTION ROW */}
        <div
          className="
            flex w-full items-center justify-between
            text-lg font-semibold
            text-neutral-900 dark:text-white
            cursor-pointer
          "
        >
          {question}

          <span
            className={`
              transition-transform duration-300
              text-neutral-500 dark:text-gray-400
              ${open ? "rotate-45" : ""}
            `}
          >
            +
          </span>
        </div>

        {/* ANSWER — ONLY RENDERS WHEN OPEN */}
        <div
          className={`
            overflow-hidden transition-all duration-300
            ${open ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}
          `}
        >
          <div
            className="
              text-neutral-700 dark:text-gray-300 leading-relaxed
              cursor-pointer
            "
          >
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Faqs() {
  const faqs: Faq[] = [
    {
      question: "Per què hauria de signar aquesta ILP?",
      answer:
        "Perquè aquesta és una Llei electoral que equipara els drets de tots els catalans i facilita l’accés al vot. Signant-hi, dónes suport a un sistema electoral més just, modern i representatiu.",
    },
    {
      question: "Qui pot signar la ILP?",
      answer:
        "Pot signar qualsevol persona que no estigui privada de drets polítics i que compleixi els requisits següents: condició política de català; més de setze anys i nacionalitat espanyola; ciutadans de la UE, Islàndia, Liechtenstein, Noruega o Suïssa empadronats a Catalunya; o residents legals a Espanya inscrits al padró.",
    },
    {
      question: "Com puc verificar que la meva signatura s’ha comptabilitzat?",
      answer:
        "Després de signar rebràs una confirmació immediata. El comptador públic del web s’actualitza en temps real amb el total de suports rebuts.",
    },
    {
      question: "Què passa si s’arriba a l’objectiu de signatures?",
      answer:
        "Quan s’assoleixin les 50.000 signatures, la ILP es presentarà al Parlament per iniciar el debat a la Comissió d’Afers Institucionals (CAI).",
    },
    {
      question: "Què passarà amb les signatures que s’han recollit?",
      answer:
        "Un cop verificades per la Comissió de Control, la Comissió Promotora està obligada legalment a destruir-les. Del procés se n’informa oficialment al Parlament.",
    },
  ];

  return (
    <section
      id="faq"
      className="
        relative py-10 scroll-mt-20
        bg-white text-neutral-900
        dark:bg-black dark:text-white
      "
    >
      <div className="mx-auto max-w-4xl px-6">
        <AnimatedContent distance={80} direction="vertical" duration={1}>
          <div className="space-y-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
              Preguntes Freqüents
            </h2>
            <p
              className="
                text-lg md:text-xl leading-relaxed
                text-neutral-700 dark:text-gray-300
              "
            >
              Tens dubtes sobre la iniciativa o el procés de signatures? Aquí
              trobaràs respostes clares perquè puguis participar amb seguretat i
              confiança.
            </p>
          </div>
        </AnimatedContent>

        <div
          className="
            mt-12 rounded-2xl p-6 shadow-lg backdrop-blur-md border divide-y
            bg-white/60 border-neutral-300 divide-neutral-300
            dark:bg-white/10 dark:border-white/20 dark:divide-white/20
          "
        >
          {faqs.map((faq, idx) => (
            <FaqItem key={idx} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
