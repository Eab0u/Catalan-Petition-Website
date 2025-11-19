import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PetitionForm from "./components/PetitionForm";
import UnderConstruction from "./pages/UnderConstruction";
import { ThemeProvider } from "./theme";
import Documents from "./pages/Documents";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/sign" element={<PetitionForm />} />
          <Route path="/under-construction" element={<UnderConstruction />} />
          <Route path="/documents" element={<Documents />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);