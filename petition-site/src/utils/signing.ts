// Stops visitors reaching the real idCAT Mòbil / AOC flow before the AOC
// credentials arrive. Every "Signa la Petició" button should route through
// SIGN_PATH instead of hardcoding "/sign".
export const SIGNING_ENABLED = import.meta.env.VITE_SIGNING_ENABLED === "true";
export const SIGN_PATH = SIGNING_ENABLED ? "/sign" : "/under-construction";
