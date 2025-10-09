import React from "react";
import PetitionForm from "../components/PetitionForm";
import { useNavigate } from "react-router-dom";

export default function SignPage() {
  const navigate = useNavigate();

  return (
    <div
      className="
        max-w-md mx-auto p-4
        bg-neutral-100 dark:bg-black
        text-black dark:text-white
        transition-colors duration-300
      "
    >
      <h1 className="text-center text-2xl mb-4 font-bold">Signa la Petició</h1>
      <PetitionForm />
      <button
        onClick={() => navigate("/")}
        className="
          mt-4 px-6 py-2 rounded-2xl font-semibold
          bg-white/70 text-black border border-black/60 backdrop-blur-md
          dark:bg-gray-500 dark:text-white dark:border-white/20
          hover:bg-white/80 dark:hover:bg-gray-600
          transition-all duration-300 shadow-md
        "
      >
        Tornar a la pàgina principal
      </button>
    </div>
  );
}
