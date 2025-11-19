import "./index.css";
import Counter from "./components/Counter";
import { useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Particles from "./components/Particles";
import TextType from "./components/TextType";
import AnimatedContent from "./components/AnimatedContent";
import Carousel from "./components/Carousel";
import Faqs from "./components/FAQs";
import ProfileCard from './components/ProfileCard'
import RotatingQA from "./components/RotatingQA";

function App() {
  const navigate = useNavigate();

  const goToForm = () => {
    // navigate("/sign"); // This is for when it is up and running
    navigate("/under-construction");
  };

  const rotatingTexts = [
    {
      q: "Quin és el nostre proper objectiu?",
      a: "Difondre i donar a conèixer el projecte de país que representa la ILP Llei Electoral Catalana. És un projecte per a tothom i necessita una implicació àmplia.",
    },
    {
      q: "Com ho volem fer?",
      a: "Aquesta serà la primera ILP que planteja la recollida electrònica de signatures, utilitzant identitats digitals com l'idCAT Mòbil.",
    },
    {
      q: "Ens hi heu d’ajudar tots!",
      a: "Necessitarem voluntaris que expliquin el projecte, ajudin a difondre’l i contribueixin a fer-lo arribar arreu del país.",
    },
    {
      q: "Com pots ajudar?",
      a: "Pots signar la ILP, oferir-te com a voluntari, organitzar actes al teu municipi o difondre’ns a les xarxes. Tot suport és valuós.",
    },
    {
      q: "Què és el que voldríem?",
      a: "Que els representants de la sobirania catalana trobin el consens per aprovar la llei i avançar cap a un sistema electoral més just.",
    },
  ];

  return (
    <>
      <NavBar />

      {/* Hero Section */}
      <main
        id="top"
        className="
          scroll-smooth relative min-h-screen w-full overflow-hidden
          flex flex-col items-center justify-center text-center
          bg-white text-neutral-900
          dark:bg-black dark:text-white
        "
      >
        {/* Particle background */}
        <div className="absolute inset-0 z-0">
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

        {/* Content + rotating text now share the same stable z-layer */}
        <div className="relative z-10 max-w-4xl px-6 flex flex-col items-center mt-30">

          {/* Hero Title */}
          <h1 className="relative text-4xl md:text-6xl font-vastago font-bold leading-tight">
            <span className="invisible block">ILP per una llei electoral justa.</span>
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

          <p className="mt-4 text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
            Dona suport a la ILP per una llei electoral justa a Catalunya.
          </p>

          <div className="mt-8 w-full flex justify-center">
            <Counter />
          </div>

          <button
            onClick={goToForm}
            className="
              mt-10 mb-10 cursor-pointer shrink-0 whitespace-nowrap rounded-2xl px-8 py-4 text-base font-semibold 
              text-black dark:text-white border border-black/60 dark:border-white/30
              bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-lg
              transition-all duration-300 hover:scale-105 hover:bg-white/80 dark:hover:bg-white/20
            "
          >
            Signa la Petició
          </button>

          <RotatingQA items={rotatingTexts} interval={5000} fadeDuration={500} />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white dark:to-black z-20" />
      </main>


      {/* Info Section */}
      <section
        id="info"
        className="
          info-section relative py-20 scroll-mt-75
          bg-white text-neutral-900
          dark:bg-black dark:text-white
        "
      >
        <div
          className="
            mx-auto max-w-8xl 
            px-6 sm:px-10 md:px-20 md:ml-20 
            grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start
          "
        >
          {/* Left side: text + 3 cards */}
          <div className="space-y-8 text-center mx-auto md:text-left md:mx-0">
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
              Per què aquesta ILP?
            </h2>

            <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.1}>
              <p className="text-lg md:text-xl leading-relaxed text-neutral-600 dark:text-gray-300">
                Aquesta iniciativa neix després de dècades d’intents per dotar Catalunya 
                d’una{" "}
                <span className="font-semibold text-neutral-900 dark:text-white">
                llei electoral pròpia
                </span>
                . Les dificultats de vot, especialment per a la 
                Catalunya exterior, i la manca d’un model adaptat al país han fet evident{" "}
                <span className="font-semibold text-neutral-900 dark:text-white">
                la necessitat d’un canvi 
                </span>
                . L’ILP vol garantir un sistema més accessible, 
                modern i representatiu per a tota la ciutadania.
              </p>
            </AnimatedContent>

            <div className="grid gap-8 md:grid-cols-3 text-center items-stretch">
              <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.1}>
                <div
                  className="
                    h-full rounded-2xl p-6 flex flex-col shadow-lg
                    bg-white border border-neutral-200
                    dark:bg-white/10 dark:border-white/20 dark:backdrop-blur-md
                  "
                >
                  <h3 className="text-xl font-semibold mb-3">Simplificar el vot</h3>
                  <p className="text-neutral-600 dark:text-gray-300 flex-grow">
                    La ILP vol facilitar la participació, especialment dels catalans 
                    que viuen a l’exterior, assegurant que votar sigui més fàcil i accessible.
                  </p>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.3}>
                <div
                  className="
                    h-full rounded-2xl p-6 flex flex-col shadow-lg
                    bg-white border border-neutral-200
                    dark:bg-white/10 dark:border-white/20 dark:backdrop-blur-md
                  "
                >
                  <h3 className="text-xl font-semibold mb-3">Autogestió electoral</h3>
                  <p className="text-neutral-600 dark:text-gray-300 flex-grow">
                    La proposta vol que Catalunya gestioni el seu propi cens 
                    i els seus processos electorals mitjançant una Sindicatura Electoral pròpia.
                  </p>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.5}>
                <div
                  className="
                    h-full rounded-2xl p-6 flex flex-col shadow-lg
                    bg-white border border-neutral-200
                    dark:bg-white/10 dark:border-white/20 dark:backdrop-blur-md
                  "
                >
                  <h3 className="text-xl font-semibold mb-3">Un sistema modern</h3>
                  <p className="text-neutral-600 dark:text-gray-300 flex-grow">
                    La ILP aposta per millores com les vegueries, 
                    una circumscripció exterior i nous tipus de vot com el vot delegat 
                    i el vot electrònic.
                  </p>
                </div>
              </AnimatedContent>
            </div>
          </div>

          {/* Right side: video */}
          <div className="flex items-center justify-center py-15">
            <div className="aspect-video w-full max-w-xl rounded-2xl overflow-hidden border shadow-lg border-neutral-200 dark:border-white/20">
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

      {/* Sobre Nosaltres + Accions Parlamentàries */}
      <section
        id="about"
        className="
          relative py-20
          bg-white text-neutral-900
          dark:bg-black dark:text-white
        "
      >
        <div className="mx-auto max-w-7xl px-6 space-y-16">

          {/* MAIN SECTION TITLE */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-center">
            Sobre...
          </h2>

          {/* === 2-COLUMN GRID === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

            {/* LEFT COLUMN – TITLE + TIMELINE */}
            <div>
              {/* LEFT COLUMN TITLE */}
              <h3 className="text-2xl font-bold mb-8 text-left">
                Sobre nosaltres
              </h3>

              <div className="relative border-l pl-8 space-y-12 border-neutral-200 dark:border-white/20">

                <AnimatedContent distance={60} direction="horizontal" reverse duration={1}>
                  <div className="relative">
                    <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-blue-600 shadow-lg" />
                    <h4 className="text-xl font-semibold mb-2">Qui som</h4>
                    <p className="leading-relaxed text-neutral-600 dark:text-gray-300">
                      La ILP Llei Electoral 2025 està impulsada per un grup de sis persones,
                      cinc residents a la Catalunya exterior i una resident a Catalunya.
                    </p>
                  </div>
                </AnimatedContent>

                <AnimatedContent distance={60} direction="horizontal" duration={1} delay={0.2}>
                  <div className="relative">
                    <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-black dark:bg-white shadow-lg" />
                    <h4 className="text-xl font-semibold mb-2">La Comissió Promotora</h4>
                    <p className="leading-relaxed text-neutral-600 dark:text-gray-300">
                      Aquest grup format per dos homes i quatre dones és la Comissió
                      Promotora de la ILP i la representa davant el Parlament.
                    </p>
                  </div>
                </AnimatedContent>

                <AnimatedContent distance={60} direction="horizontal" reverse duration={1} delay={0.4}>
                  <div className="relative">
                    <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-red-500 shadow-lg" />
                    <h4 className="text-xl font-semibold mb-2">Què hem fet fins ara</h4>
                    <p className="leading-relaxed text-neutral-600 dark:text-gray-300">
                      Hem redactat el text, creat la memòria, constituït la Comissió Promotora
                      i registrat la ILP al Parlament el 15 de setembre de 2025.
                    </p>
                  </div>
                </AnimatedContent>

                <AnimatedContent distance={60} direction="horizontal" duration={1} delay={0.6}>
                  <div className="relative">
                    <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-yellow-500 shadow-lg" />
                    <h4 className="text-xl font-semibold mb-2">El nostre origen</h4>
                    <p className="leading-relaxed text-neutral-600 dark:text-gray-300">
                      L’ILP neix del treball de Catalans al Món i la FIEC, que durant anys han
                      reclamat una llei electoral catalana pròpia.
                    </p>
                  </div>
                </AnimatedContent>

              </div>
            </div>

            {/* RIGHT COLUMN – TITLE + TIMELINE */}
            <div>
              {/* RIGHT COLUMN TITLE */}
              <h3 className="text-2xl font-bold mb-8 text-left">
                Sobre els lletrats del Parlament i la Mesa
              </h3>

              <div className="relative border-l pl-8 space-y-12 border-neutral-200 dark:border-white/20">

                <AnimatedContent distance={60} direction="horizontal" reverse duration={1}>
                  <div className="relative">
                    <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-blue-600 shadow-lg" />
                    <h4 className="text-xl font-semibold mb-2">Informe jurídic favorable</h4>
                    <p className="leading-relaxed text-neutral-600 dark:text-gray-300">
                      Els lletrats del Parlament van validar legalment la ILP i en van autoritzar
                      l’admissió inicial.
                    </p>
                  </div>
                </AnimatedContent>

                <AnimatedContent distance={60} direction="horizontal" duration={1} delay={0.2}>
                  <div className="relative">
                    <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-black dark:bg-white shadow-lg" />
                    <h4 className="text-xl font-semibold mb-2">
                      Acord del Govern sobre l’afectació pressupostària
                    </h4>
                    <p className="leading-relaxed text-neutral-600 dark:text-gray-300">
                      El Govern va confirmar que caldria dotació pressupostària per implementar la llei.
                    </p>
                  </div>
                </AnimatedContent>

                <AnimatedContent distance={60} direction="horizontal" reverse duration={1} delay={0.4}>
                  <div className="relative">
                    <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-red-500 shadow-lg" />
                    <h4 className="text-xl font-semibold mb-2">
                      Qualificació i admissió a tràmit
                    </h4>
                    <p className="leading-relaxed text-neutral-600 dark:text-gray-300">
                      La Mesa del Parlament en les sessions del 30/9 i 28/10 va admetre la ILP a tràmit.
                    </p>
                  </div>
                </AnimatedContent>

                <AnimatedContent distance={60} direction="horizontal" duration={1} delay={0.6}>
                  <div className="relative">
                    <span className="absolute -left-4 top-2 h-3 w-3 rounded-full bg-yellow-500 shadow-lg" />
                    <h4 className="text-xl font-semibold mb-2">
                      Publicació al BOPC
                    </h4>
                    <p className="leading-relaxed text-neutral-600 dark:text-gray-300">
                      El BOPC núm. 341 del 4/11 va publicar el text articulat de la ILP.
                    </p>
                  </div>
                </AnimatedContent>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Seguretat Section */}
      <section
        id="security"
        className="
          relative py-35 scroll-mt-40
          bg-white text-neutral-900
          dark:bg-black dark:text-white
        "
      >
        <div className="mx-auto max-w-8xl px-20 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          {/* Left side: text */}
          <div className="space-y-6 text-center elf-start mt-[-100px]">
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide mt-15">Seguretat</h2>
            <AnimatedContent distance={80} direction="vertical" duration={1} delay={0.1}>
              <p className="text-lg md:text-xl leading-relaxed text-neutral-600 dark:text-gray-300">
                La protecció de les teves{" "}
                <span className="font-semibold text-neutral-900 dark:text-white">dades personals </span>
                i la transparència del procés són fonamentals per a nosaltres. La nostra plataforma utilitza
                tecnologies modernes com el xifratge TLS 1.3 i el processament amb hash SHA-256 per garantir que la
                informació es mantingui segura i anonimitzada. A més, complim amb la normativa europea
                <span className="font-semibold text-neutral-900 dark:text-white"> GDPR</span>, assegurant drets com el
                dret a l’oblit i el dret de rectificació. Tot això té un objectiu clar: oferir la màxima
                <span className="font-semibold text-neutral-900 dark:text-white"> seguretat i confiança</span> perquè
                cada ciutadà pugui participar amb tranquil·litat i transparència. Per garantir-ho, realitzem
                <span className="font-semibold text-neutral-900 dark:text-white"> auditories periòdiques</span> i
                mantenim tots els processos sota{" "}
                <span className="font-semibold text-neutral-900 dark:text-white">codi obert</span>, de manera que
                qualsevol persona pugui verificar el correcte funcionament de la plataforma.
              </p>
            </AnimatedContent>
          </div>

          {/* Right side: carousel */}
          <div className="flex justify-center self-start">
            <div style={{ position: "relative" }}>
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
                    icon: <img src="/Lock Logo.png" alt="Protecció de dades" className="-mt-2" />,
                  },
                  {
                    title: "Compliment GDPR",
                    description:
                      "Ens ajustem a la normativa europea per garantir privadesa, dret a l’oblit i transparència.",
                    id: 2,
                    icon: <img src="/GDRP Logo.png" alt="Compliment GDPR" />,
                  },
                  {
                    title: "Infraestructura segura",
                    description:
                      "Les dades es guarden en servidors europeus amb xifratge TLS 1.3 i proteccions avançades.",
                    id: 3,
                    icon: <img src="/Shield Logo.png" alt="Infraestructura segura" />,
                  },
                  {
                    title: "Control ciutadà",
                    description:
                      "L’accés és limitat a administradors verificats, amb auditories públiques disponibles.",
                    id: 4,
                    icon: <img src="/Group Logo.png" alt="Control ciutadà" className="-mt-2" />,
                  },
                  {
                    title: "Transparència total",
                    description:
                      "Cada pas del procés és documentat i obert a revisió pública per assegurar la confiança.",
                    id: 5,
                    icon: <img src="/Globe Logo.png" alt="Protecció de dades" />,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Contact Section */}
      <section
        id="FAQ"
        className="
          relative scroll-mt-40
          bg-white text-neutral-900
          dark:bg-black dark:text-white
        "
      >
        <div
          className="
            mx-auto max-w-8xl px-6 sm:px-10 md:px-20
            grid grid-cols-1 gap-12 md:grid-cols-2
            items-center
          "
          style={{ minHeight: "80vh" }}
        >
          {/* Left side: FAQ */}
          <div className="flex flex-col justify-center items-center md:items-start md:pl-10 lg:pl-20">
            <div className="w-full max-w-3xl">
              <Faqs />
            </div>
          </div>

          {/* Right side: Contact card */}
          <div className="flex justify-center md:justify-center items-center mb-10 sm:mb-0">
            <ProfileCard
              avatarUrl="/RahulPic.png"
              miniAvatarUrl="/hq720.png"
              iconUrl="/iconpattern.png"
              grainUrl="/grain.png"
              name="Rahul M-I"
              title="Big Fella"
              handle="Eab0u"
              status="Online"
              contactText="Contact"
              onContactClick={() =>
                alert("Lloc web properament! \nEmail: rahulm7411@gmail.com")
              }
            />
          </div>
        </div>
      </section>

    </>
  );
}

export default App;
