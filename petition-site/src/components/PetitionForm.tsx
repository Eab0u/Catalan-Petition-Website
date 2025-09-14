// src/components/PetitionForm.tsx
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petitionSchema, type PetitionSchemaType } from "../schemas/petitionSchema";
import { db } from "../firebase"; // your firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import HCaptcha from "@hcaptcha/react-hcaptcha";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PetitionSchemaType>({
    resolver: zodResolver(petitionSchema),
  });

  const onSubmit = async (data: PetitionSchemaType) => {
    setErrorMessage(null);

    if (!captchaToken) {
      setErrorMessage("Si us plau, completa el captcha!");
      return;
    }

    try {
      const { nom, cognom1, cognom2, datanaixement, tipusid, address } = data;
      const numid = tipusid.replace(/\D/g, "");
      const canonical = `${nom}|${cognom1}|${cognom2 ?? ""}|${datanaixement}|${tipusid}`;
      const signatureHash = await sha256Hex(canonical);

      await addDoc(collection(db, "petitions"), {
        nom,
        cognom1,
        cognom2: cognom2 ?? "",
        datanaixement,
        tipusid,
        numid,
        address: address ?? "",
        signatureHash,
        captchaToken,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("Error submitting petition:", err);
      setErrorMessage("S'ha produït un error en enviar la signatura. Torna-ho a provar.");
    }
  };

  if (submitted) {
    return (
      <div className="text-center mt-10" aria-live="polite">
        <h2>Gràcies per signar la petició!</h2>
        <p>Redirigint a la pàgina principal...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4" noValidate>
      <div>
        <label>Nom</label>
        <input {...register("nom")} className="input" />
        {errors.nom && <p className="text-red-600">{errors.nom.message}</p>}
      </div>

      <div>
        <label>Primer cognom</label>
        <input {...register("cognom1")} className="input" />
        {errors.cognom1 && <p className="text-red-600">{errors.cognom1.message}</p>}
      </div>

      <div>
        <label>Segon cognom (opcional)</label>
        <input {...register("cognom2")} className="input" />
        {errors.cognom2 && <p className="text-red-600">{errors.cognom2.message}</p>}
      </div>

      <div>
        <label>Data de naixement</label>
        <input type="date" {...register("datanaixement")} className="input" />
        {errors.datanaixement && <p className="text-red-600">{errors.datanaixement.message}</p>}
      </div>

      <div>
        <label>DNI / NIE</label>
        <input {...register("tipusid")} className="input" />
        {errors.tipusid && <p className="text-red-600">{errors.tipusid.message}</p>}
      </div>

      <div>
        <label>Adreça</label>
        <input {...register("address")} className="input" />
        {errors.address && <p className="text-red-600">{errors.address.message}</p>}
      </div>

      <div className="mt-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("consent")} />
          Accepto el tractament de dades per a aquesta ILP (vegeu la política de privacitat)
        </label>
        {errors.consent && <p className="text-red-600">{errors.consent.message}</p>}
      </div>

      <div>
        <HCaptcha
          ref={captchaRef}
          sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
          onVerify={(token) => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken(null)}
          languageOverride="ca"
        />
      </div>

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? "Enviant..." : "Enviar"}
      </button>
    </form>
  );
}