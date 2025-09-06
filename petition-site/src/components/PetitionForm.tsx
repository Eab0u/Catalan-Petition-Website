// src/components/PetitionForm.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petitionSchema } from "../schemas/petitionSchema";
import type { PetitionSchemaType } from "../schemas/petitionSchema";
import { db } from "../firebase"; // your firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function PetitionForm() {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PetitionSchemaType>({
    resolver: zodResolver(petitionSchema),
  });

  const onSubmit = async (data: PetitionSchemaType) => {
    try {
      await addDoc(collection(db, "petitions"), {
        ...data,
        createdAt: serverTimestamp(),
      });
      
    setSubmitted(true);

    setTimeout(() => {
    navigate("/");
    }, 3000);
      
    } catch (err) {
      console.error(err);
      alert("Error submitting petition.");
    }
  };

   if (submitted) {
    return (
      <div className="text-center mt-10">
        <h2>Gràcies per signar la petició!</h2>
        <p>Redirigint a la pàgina principal...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
      <div>
        <label>Full Name</label>
        <input {...register("fullName")} />
        {errors.fullName && <p>{errors.fullName.message}</p>}
      </div>

      <div>
        <label>Date of Birth</label>
        <input type="date" {...register("dob")} />
        {errors.dob && <p>{errors.dob.message}</p>}
      </div>

      <div>
        <label>DNI / NIE</label>
        <input {...register("dni")} />
        {errors.dni && <p>{errors.dni.message}</p>}
      </div>

      <div>
        <label>Address</label>
        <input {...register("address")} />
        {errors.address && <p>{errors.address.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        Submit Petition
      </button>
    </form>
  );
}
