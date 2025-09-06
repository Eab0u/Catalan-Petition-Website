import React from "react";
import "./App.css";
import Counter from "./components/Counter";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const goToForm = () => {
    navigate("/sign"); // Redirects to the PetitionForm page
  };

  return (
    <div className="App text-center mt-10">
      <h1>Recollida de Signatures</h1>
      <Counter />
      <h3>Signa per donar suport a la ILP per la llei electoral catalana</h3>

      <button
        onClick={goToForm}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
      >
        Signa la Petició
      </button>
    </div>
  );
}

export default App;