import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { app as firebaseApp } from "../firebase";
import AnimatedContent from "../components/AnimatedContent";

const API_BASE = import.meta.env.DEV ? (import.meta.env.VITE_API_BASE as string) ?? "" : "";

export default function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Created on first render of this route, not at module load — so a
  // missing/invalid Firebase web config only breaks /admin, not every page
  // (react-router statically imports every route's component up front).
  const auth = useMemo(() => getAuth(firebaseApp), []);
  const provider = useMemo(() => new GoogleAuthProvider(), []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, [auth]);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Sign in error:", err);
      setAuthError("Error en iniciar sessió. Torna-ho a provar.");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleExport = async () => {
    if (!user) return;
    setDownloading(true);
    try {
      const token = await user.getIdToken(true);
      const res = await fetch(`${API_BASE}/api/admin/export.csv`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        setAuthError(
          "No tens permisos d'administrador. Contacta amb l'administrador del sistema."
        );
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `peticions-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      setAuthError("Error en descarregar el CSV. Torna-ho a provar.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-neutral-100 dark:bg-black">
        <p className="text-neutral-500 dark:text-gray-400">Carregant...</p>
      </main>
    );
  }

  return (
    <main
      className="
        relative min-h-dvh flex items-center justify-center px-4
        bg-neutral-100 text-black dark:bg-black dark:text-white
        transition-colors duration-300
      "
    >
      <div
        className="
          relative z-10 w-full max-w-md p-8 rounded-2xl
          bg-white/70 border border-black/60 backdrop-blur-xl shadow-lg
          dark:bg-white/10 dark:border-white/30
          transition-colors duration-300
        "
      >
        <AnimatedContent distance={40} direction="vertical" duration={0.8}>
          <h1 className="text-2xl font-bold mb-6 text-center">
            Administració — ILP Electoral
          </h1>

          {!user ? (
            <div className="space-y-4 text-center">
              <p className="text-neutral-600 dark:text-gray-300 text-sm">
                Inicia sessió amb el compte d'administrador per accedir a les
                funcions d'exportació.
              </p>
              <button
                onClick={handleSignIn}
                className="
                  w-full cursor-pointer rounded-2xl px-6 py-3 text-base font-semibold
                  text-white bg-neutral-900 hover:bg-neutral-800
                  dark:bg-white dark:text-black dark:hover:bg-neutral-200
                  transition-colors duration-150 shadow-lg
                "
              >
                Inicia sessió amb Google
              </button>
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{user.displayName}</p>
                  <p className="text-sm text-neutral-600 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="
                    shrink-0 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold
                    border border-black/40 dark:border-white/30
                    bg-white/60 dark:bg-white/10
                    hover:bg-white/80 dark:hover:bg-white/20
                    transition-all duration-200
                  "
                >
                  Tancar sessió
                </button>
              </div>

              {authError && (
                <p className="text-red-500 text-sm text-center">{authError}</p>
              )}

              <div className="rounded-xl border border-black/20 dark:border-white/20 bg-neutral-100/60 dark:bg-white/5 p-4 space-y-3">
                <h2 className="font-semibold text-sm">Exportació de dades</h2>
                <p className="text-xs text-neutral-600 dark:text-gray-400 leading-relaxed">
                  Descarrega un CSV amb totes les signatures registrades. Inclou
                  nom, cognoms, NIF verificat, nivell d'autenticació, codi de
                  signatura i ruta de l'evidència XAdES-T.
                </p>
                <button
                  onClick={handleExport}
                  disabled={downloading}
                  className="
                    w-full cursor-pointer rounded-2xl px-6 py-3 text-sm font-semibold
                    text-black dark:text-white border border-black/60 dark:border-white/30
                    bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-lg
                    transition-all duration-300 hover:scale-105 hover:bg-white/80 dark:hover:bg-white/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {downloading ? "Descarregant..." : "Descarregar CSV de signatures"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-neutral-500 dark:text-gray-500 hover:underline"
            >
              ← Tornar a la pàgina principal
            </button>
          </div>
        </AnimatedContent>
      </div>
    </main>
  );
}
