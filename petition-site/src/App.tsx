import React from "react";
import "./App.css";
import Counter from "./components/Counter";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const goToForm = () => {
    navigate("/sign");
  };

  return (
    <>
      {/* Hero Section */}
      <main className="hero">
        {/* Background image */}
        <img
          src="/GDCSagradaFamilia.png" // 👈 place image in /public/
          alt="Catalan background"
          className="hero__bg"
        />

        {/* Yellow overlay */}
        <div className="hero__overlay" />

        {/* Content */}
        <div className="hero__content">
          <h1 className="hero__title">Recollida de Signatures</h1>

          <p className="hero__subtitle">
            Dona suport a la ILP per una llei electoral justa a Catalunya.
          </p>

          <Counter />

          <button onClick={goToForm} className="hero__button">
            Signa la Petició
          </button>
        </div>
      </main>

      {/* Black Section */}
      <section className="info-section">
        <div className="info-content">
          <h2>Per què aquesta ILP?</h2>
          <p>
            Aquesta iniciativa busca establir una llei electoral més justa i
            representativa per a Catalunya. Junts podem fer-ho realitat.
          </p>
        </div>
      </section>
    </>
  );
}

export default App;
