import React from "react";
import "./index.css";
import Counter from "./components/Counter";
import { useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Particles from "./components/Particles";
import TextType from "./components/TextType";
import AnimatedContent from "./components/AnimatedContent";
import Carousel from './components/Carousel';
import Faqs from "./components/FAQs";

function App() {
  const navigate = useNavigate();

  const goToForm = () => {
    navigate("/sign");
  };

  return (
    <>
      <NavBar />
      {/* Hero Section */}
      
      <main id ="top" className="scroll-smooth relative min-h-screen w-full overflow-hidden flex items-center justify-center text-center bg-black">
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
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-black z-20"></div>
      </main>

      {/* Info Section */}
      <section id="info" className="info-section relative bg-black py-20 text-white scroll-mt-75">
        <div className="mx-auto max-w-8xl px-20 ml-20 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
          
          {/* Left side: text + 3 cards */}
          <div className="space-y-8 text-center md:text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
              Per què aquesta ILP?
            </h2>
            
            <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.1}>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              El nostre sistema electoral actual a Catalunya és{" "}
              <span className="font-semibold text-white">desigual i poc representatiu</span>. 
              Aquesta Iniciativa Legislativa Popular vol posar fi a les distorsions i garantir 
              que la veu de tots els ciutadans compti de veritat.
            </p>
            </AnimatedContent>

            <div className="grid gap-8 md:grid-cols-3 text-center items-stretch">
              <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.1}>
                <div className="h-full rounded-2xl bg-white/10 border border-white/20 p-6 backdrop-blur-md shadow-lg flex flex-col">
                  <h3 className="text-xl font-semibold mb-3">Igualtat del vot</h3>
                  <p className="text-gray-300 flex-grow">
                    Cada vot ha de tenir el mateix pes, visquis on visquis. 
                    L’ILP busca equilibrar la representació al Parlament.
                  </p>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.3}>
                <div className="h-full rounded-2xl bg-white/10 border border-white/20 p-6 backdrop-blur-md shadow-lg flex flex-col">
                  <h3 className="text-xl font-semibold mb-3">Més transparència</h3>
                  <p className="text-gray-300 flex-grow">
                    Un sistema clar i just reforça la confiança de la ciutadania 
                    i la qualitat democràtica del nostre país.
                  </p>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.5}>
                <div className="h-full rounded-2xl bg-white/10 border border-white/20 p-6 backdrop-blur-md shadow-lg flex flex-col">
                  <h3 className="text-xl font-semibold mb-3">Representació real</h3>
                  <p className="text-gray-300 flex-grow">
                    Tots els ciutadans mereixen que la seva veu sigui escoltada 
                    i reflectida a les institucions.
                  </p>
                </div>
              </AnimatedContent>
            </div>
          </div>

          {/* Right side: video */}
          <div className="flex items-center justify-center py-15">
            <div className="aspect-video w-full max-w-xl rounded-2xl overflow-hidden border border-white/20 shadow-lg">
              <video 
                className="w-full h-full object-cover" 
                autoPlay 
                loop 
                muted 
                playsInline
                controls
              >
                <source src="/GDCvideo1.mp4" type="video/mp4" />
                El teu navegador no suporta el vídeo.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nosaltres Section */}
      <section id="about" className="relative bg-black py-20 text-white scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 space-y-16">
          <h2 className="md:text-5xl font-bold tracking-wide text-center">
            Sobre nosaltres
          </h2>

          <div className="relative border-l border-white/20 pl-8 space-y-12">
            <AnimatedContent distance={60} direction="horizontal" reverse duration={1}>
              <div className="relative">
                <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-blue-600 shadow-lg"></span>
                <h3 className="text-xl font-semibold mb-2">Un moviment ciutadà</h3>
                <p className="text-gray-300 leading-relaxed">
                  Aquesta ILP sorgeix de la mobilització de ciutadans i entitats
                  compromeses amb la millora democràtica. La nostra força prové de
                  la participació col·lectiva i la voluntat de canvi.
                </p>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={60} direction="horizontal" duration={1} delay={0.2}>
              <div className="relative">
                <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-white shadow-lg"></span>
                <h3 className="text-xl font-semibold mb-2">Objectiu comú</h3>
                <p className="text-gray-300 leading-relaxed">
                  El nostre objectiu és establir una llei electoral més justa i
                  representativa per a Catalunya, on cada vot tingui el mateix pes
                  i cap territori quedi sobrerrepresentat.
                </p>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={60} direction="horizontal" reverse duration={1} delay={0.4}>
              <div className="relative">
                <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-red-500 shadow-lg"></span>
                <h3 className="text-xl font-semibold mb-2">Treball en xarxa</h3>
                <p className="text-gray-300 leading-relaxed">
                  Som una xarxa de persones, organitzacions i voluntaris que
                  col·laboren per recollir signatures, difondre la iniciativa i
                  aconseguir el suport necessari per portar-la al Parlament.
                </p>
              </div>
            </AnimatedContent>

            <AnimatedContent distance={60} direction="horizontal" duration={1} delay={0.6}>
              <div className="relative">
                <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-yellow-500 shadow-lg"></span>
                <h3 className="text-xl font-semibold mb-2">Compromís democràtic</h3>
                <p className="text-gray-300 leading-relaxed">
                  Creiem en la participació ciutadana com a eina de transformació.
                  Aquesta ILP és una oportunitat per demostrar que la societat civil
                  pot impulsar canvis legislatius reals i necessaris.
                </p>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* Seguretat Section */}
      <section id="security" className="relative bg-black py-35 text-white scroll-mt-40">
        <div className="mx-auto max-w-8xl px-20 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          
          {/* Left side: text */}
          <div className="space-y-6 text-center elf-start mt-[-100px]">
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide mt-15">
              Seguretat
            </h2>
            <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.1}>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                La protecció de les teves <span className="font-semibold text-white">dades personals </span> 
                i la transparència del procés són fonamentals per a nosaltres. La nostra plataforma utilitza 
                tecnologies modernes com el xifratge TLS 1.3 i el processament amb hash SHA-256 per garantir 
                que la informació es mantingui segura i anonimitzada. A més, complim amb la normativa europea 
                <span className="font-semibold text-white"> GDPR</span>, assegurant drets com el dret a l’oblit 
                i el dret de rectificació. Tot això té un objectiu clar: oferir la màxima 
                <span className="font-semibold text-white"> seguretat i confiança</span> perquè cada ciutadà 
                pugui participar amb tranquil·litat i transparència. Per garantir-ho, realitzem 
                <span className="font-semibold text-white"> auditories periòdiques</span> i mantenim tots els processos 
                sota <span className="font-semibold text-white">codi obert</span>, de manera que qualsevol persona pugui 
                verificar el correcte funcionament de la plataforma.
              </p>
            </AnimatedContent>
          </div>

          {/* Right side: carousel */}
          <div className="flex justify-center self-start">
            <div style={{position: "relative"}}>
              <Carousel
                baseWidth={500}
                autoplay={true}
                autoplayDelay={3000}
                pauseOnHover={true}
                loop={true}
                round={false}
                items={[
                  {
                    title: "Protecció de dades",
                    description:
                      "Les signatures es processen amb hash SHA-256 i emmagatzemades de forma anonimitzada.",
                    id: 1,
                    icon: <img src="/Lock Logo.png" alt="Protecció de dades" className="-mt-2"/>,
                  },
                  {
                    title: "Compliment GDPR",
                    description:
                      "Ens ajustem a la normativa europea per garantir privadesa, dret a l’oblit i transparència.",
                    id: 2,
                    icon: <img src="/GDRP Logo.png" alt="Compliment GDPR"/>,
                  },
                  {
                    title: "Infraestructura segura",
                    description:
                      "Les dades es guarden en servidors europeus amb xifratge TLS 1.3 i proteccions avançades.",
                    id: 3,
                    icon: <img src="/Shield Logo.png" alt="Infraestructura segura"/>,
                  },
                  {
                    title: "Control ciutadà",
                    description:
                      "L’accés és limitat a administradors verificats, amb auditories públiques disponibles.",
                    id: 4,
                    icon: <img src="/Group Logo.png" alt="Control ciutadà" className="-mt-2"/>,
                  },
                  {
                    title: "Transparència total",
                    description:
                      "Cada pas del procés és documentat i obert a revisió pública per assegurar la confiança.",
                    id: 5,
                    icon: <img src="/Globe Logo.png" alt="Protecció de dades"/>,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="FAQ">
        <Faqs />
      </section>
    </>
  );
}

export default App;