import React from "react";
import './App.css';
import PetitionForm from "./components/PetitionForm";
import Counter from "./components/Counter";

function App() {
  return (
    <div className="App">
      <h1>Petition Site</h1>
      <Counter />
      <PetitionForm />
    </div>
  );
}

export default App;