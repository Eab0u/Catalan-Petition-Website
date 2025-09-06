import React from "react";
import PetitionForm from "../components/PetitionForm";
import { useNavigate } from "react-router-dom";

export default function SignPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-center text-2xl mb-4">Signa la Petició</h1>
      <PetitionForm />
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-6 py-2 bg-gray-500 text-white rounded"
      >
        Tornar a la pàgina principal
      </button>
    </div>
  );
}