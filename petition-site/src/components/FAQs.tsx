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
        py-2 cursor-pointer
        border-b border-neutral-300 last:border-b-0
        dark:border-white/20
        transition-none
      "
      onClick={() => setOpen(!open)}
    >
      <button
        className="
          flex w-full items-center justify-between text-lg font-semibold cursor-pointer
          text-neutral-900 dark:text-white
          transition-none
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
      </button>

      <div
        className={`
          grid overflow-hidden transition-all duration-500 ease-in-out
          ${open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 -mt-8"}
        `}
      >
        <div
          className="
            text-neutral-700 dark:text-gray-300 leading-relaxed
            transition-none
          "
        >
          {answer}
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
        "És una oportunitat de defensar un sistema electoral més just i representatiu per a tots els ciutadans de Catalunya. La teva signatura és la manera més directa de fer sentir la teva veu.",
    },
    {
      question: "Qui pot signar la ILP?",
      answer:
        "Qualsevol ciutadà major d’edat empadronat a Catalunya amb dret de vot pot participar. És un procés obert i inclusiu.",
    },
    {
      question: "Com puc verificar que la meva signatura s’ha comptabilitzat?",
      answer:
        "Després de signar rebràs una confirmació i el comptador públic del web s’actualitza en temps real amb el total de signatures.",
    },
    {
      question: "Què passa si s’arriba a l’objectiu de signatures?",
      answer:
        "Quan assolim el nombre necessari, la proposta es presentarà al Parlament de Catalunya per ser debatuda i votada.",
    },
    {
      question: "Què passa si no s’arriba al nombre de signatures?",
      answer:
        "Encara que no s’arribi a l’objectiu, les signatures serveixen com a mostra clara de suport ciutadà i ajuden a pressionar les institucions per impulsar un sistema electoral més just.",
    },
  ];

  return (
    <section
      id="faq"
      className="
        relative py-10 scroll-mt-20
        bg-white text-neutral-900
        dark:bg-black dark:text-white
        transition-none
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
                transition-none
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
            transition-none
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
