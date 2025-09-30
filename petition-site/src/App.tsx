import React from "react";
import "./index.css";
import Counter from "./components/Counter";
import { useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";

function App() {
  const navigate = useNavigate();

  const goToForm = () => {
    navigate("/sign");
  };

  return (
    <>
      <NavBar />
      <main className="hero">
        <img
          src="/GDCSagradaFamilia.png"
          alt="Catalan background"
          className="hero__bg"
        />
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__title font-vastago font-bold">
            Recollida de Signatures
          </h1>
          <p className="hero__subtitle">
            Dona suport a la ILP per una llei electoral justa a Catalunya.
          </p>
          <div className="mt-8">
            <Counter />
          </div>
          <button
            onClick={goToForm}
            className="hero__button"
          >
            Signa la Peticio
          </button>
        </div>
      </main>

      <section className="info-section">
        <div className="info-content">
          <p className="text-red-500 text-3xl">Tailwind is working!</p>
          <h2>Per que aquesta ILP?</h2>
          <p>
            Aquesta iniciativa busca establir una llei electoral mes justa i
            representativa per a Catalunya. Junts podem fer-ho realitat.
          </p>
        </div>
      </section>
    </>
  );
}

export default App;
