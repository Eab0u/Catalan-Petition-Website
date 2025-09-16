// src/components/PetitionForm.tsx
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petitionSchema, type PetitionSchemaType } from "../schemas/petitionSchema";
import { useNavigate } from "react-router-dom";
import HCaptcha from "@hcaptcha/react-hcaptcha";

/** helper: SHA-256 hex using Web Crypto API */
async function sha256Hex(message: string) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Expected backend response
interface ApiResponse {
  success: boolean;
  message?: string;
}

export default function PetitionForm() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const API_BASE = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE // use Cloud Run in dev
  : ""; // in prod, use relative /api

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PetitionSchemaType>({
    resolver: zodResolver(petitionSchema),
  });

  const onSubmit = async (data: PetitionSchemaType) => {
    console.log("✅ onSubmit fired with data:", data, "captcha:", captchaToken);
    setErrorMessage(null);

    if (!captchaToken) {
      console.warn("⚠️ Captcha missing, blocking submission");
      setErrorMessage("Si us plau, completa el captcha!");
      return;
    }

    try {
      const { nom, cognom1, cognom2, datanaixement, dni, address } = data;
      const canonical = `${nom}|${cognom1}|${cognom2 ?? ""}|${datanaixement}|${dni}`;
      const signatureHash = await sha256Hex(canonical);

      console.log("📡 Sending POST /api/sign with payload:", {
        nom,
        cognom1,
        cognom2,
        datanaixement,
        dni,
        address,
        captchaToken,
        signatureHash,
      });

      const res = await fetch(`${API_BASE}/api/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          cognom1,
          cognom2,
          datanaixement,
          dni,
          address,
          captchaToken,
          signatureHash,
        }),
      });

      let json: ApiResponse;
      try {
        json = (await res.json()) as ApiResponse;
      } catch {
        throw new Error(`Invalid JSON response from server (status ${res.status})`);
      }

      console.log("📥 Sign response:", res.status, json);

      if (!res.ok || !json.success) {
        throw new Error(json.message || `Sign error, status ${res.status}`);
      }

      // success 🎉
      console.log("✅ Petition submitted successfully!");
      setSubmitted(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      console.error("❌ Error submitting petition:", error);
      setErrorMessage(error || "S'ha produït un error en enviar la signatura. Torna-ho a provar.");
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("📝 Raw form submit triggered");
        handleSubmit(onSubmit, (errors) => {
          console.warn("❌ Validation failed:", JSON.stringify(errors, null, 2));
        })(e);
      }}
      className="max-w-md mx-auto p-4 space-y-4"
      noValidate
    >
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
        <label>DNI</label>
        <input {...register("dni")} className="input" />
        {errors.dni && <p className="text-red-600">{errors.dni.message}</p>}
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
          onVerify={(token) => {
            console.log("✅ Captcha verified:", token);
            setCaptchaToken(token);
          }}
          onExpire={() => {
            console.warn("⚠️ Captcha expired");
            setCaptchaToken(null);
          }}
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