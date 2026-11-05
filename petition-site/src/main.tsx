import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./theme";

// Route-level code splitting: AdminPage alone pulls in the whole
// firebase/auth SDK, which has no business being in the bundle every
// visitor downloads just to see the homepage.
const PetitionForm = lazy(() => import("./components/PetitionForm"));
const SignResult = lazy(() => import("./pages/SignResult"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const UnderConstruction = lazy(() => import("./pages/UnderConstruction"));
const Documents = lazy(() => import("./pages/Documents"));

const routeFallback = (
  <div className="flex min-h-dvh items-center justify-center text-lg font-semibold text-neutral-500 dark:text-gray-400">
    Carregant…
  </div>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={routeFallback}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/sign" element={<PetitionForm />} />
            <Route path="/sign/result" element={<SignResult />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/under-construction" element={<UnderConstruction />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
