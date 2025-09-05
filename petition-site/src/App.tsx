import React from "react";
import './App.css';
import PetitionForm from "./components/PetitionForm";
import Counter from "./components/Counter";

function App() {
  return (
    <div className="App">
      <h1>Recollida de Signatures</h1>
      <Counter />
      <h3>Signa per donar suport a la ILP per la llei electoral catalana</h3>
      <PetitionForm />
    </div>
  );
}

export default App;