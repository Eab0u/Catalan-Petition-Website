// src/components/PetitionForm.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petitionSchema } from "../schemas/petitionSchema";
import type { PetitionSchemaType } from "../schemas/petitionSchema";
import { db } from "../firebase"; // your firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

/** helper: SHA-256 hex using Web Crypto API */
async function sha256Hex(message: string) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function PetitionForm() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PetitionSchemaType>({
    resolver: zodResolver(petitionSchema),
  });

  const onSubmit = async (rawData: PetitionSchemaType) => {
    try {
      // rawData.datanaixement is already transformed to YYYYMMDD by zod schema
      const { nom, cognom1, cognom2, datanaixement, tipusid, address } = rawData;

      // derive numid = digits-only part of DNI/NIE (useful for filename)
      const numid = tipusid.replace(/\D/g, "");

      // build a canonical string for signatureHash
      const canonical = `${nom}|${cognom1}|${cognom2 ?? ""}|${datanaixement}|${tipusid}`;
      const signatureHash = await sha256Hex(canonical);

      // write to Firestore petitions collection
      await addDoc(collection(db, "petitions"), {
        nom,
        cognom1,
        cognom2: cognom2 ?? "",
        datanaixement, // YYYYMMDD
        tipusid, // uppercase
        numid,
        address: address ?? "",
        signatureHash,
        // ipHash / server-side metadata should be added server-side later
        createdAt: serverTimestamp(),
      });

      // show immediate thank you
      setSubmitted(true);

      // redirect after 3s
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Error submitting petition:", err);
      alert("S'ha produït un error en enviar la signatura. Torna-ho a provar.");
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
        <label>Nom</label>
        <input {...register("nom")} />
        {errors.nom && <p className="text-red-600">{errors.nom.message}</p>}
      </div>

      <div>
        <label>Primer cognom</label>
        <input {...register("cognom1")} />
        {errors.cognom1 && <p className="text-red-600">{errors.cognom1.message}</p>}
      </div>

      <div>
        <label>Segon cognom (opcional)</label>
        <input {...register("cognom2")} />
        {errors.cognom2 && <p className="text-red-600">{errors.cognom2.message}</p>}
      </div>

      <div>
        <label>Data de naixement</label>
        <input type="date" {...register("datanaixement" as const)} />
        {errors.datanaixement && (
          <p className="text-red-600">{errors.datanaixement.message}</p>
        )}
      </div>

      <div>
        <label>DNI / NIE</label>
        <input {...register("tipusid")} />
        {errors.tipusid && <p className="text-red-600">{errors.tipusid.message}</p>}
      </div>

      <div>
        <label>Adreça</label>
        <input {...register("address")} />
        {errors.address && <p className="text-red-600">{errors.address.message}</p>}
      </div>

      <div className="mt-2">
        <label>
          <input type="checkbox" {...register("consent" as const)} /> Accepto el tractament
          de dades per a aquesta ILP (vegeu la política de privacitat)
        </label>
        {errors.consent && <p className="text-red-600">{errors.consent.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
      >
        Enviar
      </button>
    </form>
  );
}