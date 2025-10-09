import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petitionSchema, type PetitionSchemaType } from "../schemas/petitionSchema";
import { useNavigate } from "react-router-dom";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { GradientText } from "./GradientText";

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
    ? import.meta.env.VITE_API_BASE
    : "https://api-6n6hw37u3a-ew.a.run.app";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PetitionSchemaType>({
    resolver: zodResolver(petitionSchema),
  });

  const onSubmit = async (data: PetitionSchemaType) => {
    setErrorMessage(null);

    if (!captchaToken) {
      setErrorMessage("Si us plau, completa el captcha!");
      return;
    }

    try {
      const datanaixement = data.datanaixement.replaceAll("-", "");
      const tipusid = data.dni?.toUpperCase();

      const payload = {
        nom: data.nom,
        cognom1: data.cognom1,
        cognom2: data.cognom2 || "",
        datanaixement,
        tipusid,
        address: data.address || "",
        captchaToken,
      };

      const res = await fetch(`${API_BASE}/api/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json: ApiResponse = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      setSubmitted(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      setErrorMessage(error || "S'ha produït un error en enviar la signatura.");
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-black text-white">
        <div className="z-10 text-center space-y-4 bg-white/10 border border-white/30 backdrop-blur-xl shadow-lg p-8 rounded-2xl">
          <h2 className="text-2xl font-bold">Gràcies per signar la petició!</h2>
          <p className="text-lg">Redirigint a la pàgina principal...</p>
        </div>
      </div>
    );
  }

  return (
    <main
      className="
        relative min-h-screen flex items-center justify-center px-4
        bg-neutral-100 text-black
        dark:bg-black dark:text-white
        transition-colors duration-300
      "
    >
      <div
        className="
          relative z-10 w-full max-w-lg p-6 rounded-2xl 
          bg-white/70 border border-black/60 backdrop-blur-xl shadow-lg
          dark:bg-white/10 dark:border-white/30
          transition-colors duration-300
        "
      >
        <div className="flex justify-center">
          <GradientText
            text="Signa la Petició"
            gradient="linear-gradient(90deg, #0004ff 0%, #ffcc00 30%, #ff0000 60%, #ffcc00 80%, #0004ff 100%)"
            className="font-vastago text-3xl md:text-5xl font-bold tracking-tight"
            neon
          />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
          noValidate
        >
          {/* Nom */}
          <div>
            <label className="block mb-1 font-semibold">Nom</label>
            <input
              {...register("nom")}
              className="
                w-full px-3 py-2 rounded-lg
                bg-neutral-200/70 border border-black/40 text-black
                dark:bg-black/30 dark:border-white/20 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition-colors duration-300
              "
            />
            {errors.nom && <p className="text-red-500 mt-1">{errors.nom.message}</p>}
          </div>

          {/* Cognoms */}
          <div>
            <label className="block mb-1 font-semibold">Primer cognom</label>
            <input
              {...register("cognom1")}
              className="
                w-full px-3 py-2 rounded-lg
                bg-neutral-200/70 border border-black/40 text-black
                dark:bg-black/30 dark:border-white/20 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition-colors duration-300
              "
            />
            {errors.cognom1 && <p className="text-red-500 mt-1">{errors.cognom1.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Segon cognom (opcional)</label>
            <input
              {...register("cognom2")}
              className="
                w-full px-3 py-2 rounded-lg
                bg-neutral-200/70 border border-black/40 text-black
                dark:bg-black/30 dark:border-white/20 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition-colors duration-300
              "
            />
            {errors.cognom2 && <p className="text-red-500 mt-1">{errors.cognom2.message}</p>}
          </div>

          {/* Data */}
          <div>
            <label className="block mb-1 font-semibold">Data de naixement</label>
            <input
              type="date"
              {...register("datanaixement")}
              className="
                w-full px-3 py-2 rounded-lg
                bg-neutral-200/70 border border-black/40 text-black
                dark:bg-black/30 dark:border-white/20 dark:text-white
                placeholder-gray-400 font-vastago tracking-tight
                focus:outline-none focus:ring-2 focus:ring-blue-400
                [&::-webkit-calendar-picker-indicator]:invert
                [&::-webkit-calendar-picker-indicator]:opacity-70
                [&::-webkit-calendar-picker-indicator]:hover:opacity-100
                transition-colors duration-300
              "
            />
            {errors.datanaixement && <p className="text-red-500 mt-1">{errors.datanaixement.message}</p>}
          </div>

          {/* DNI */}
          <div>
            <label className="block mb-1 font-semibold">DNI / NIE</label>
            <input
              {...register("dni")}
              className="
                w-full px-3 py-2 rounded-lg
                bg-neutral-200/70 border border-black/40 text-black
                dark:bg-black/30 dark:border-white/20 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition-colors duration-300
              "
            />
            {errors.dni && <p className="text-red-500 mt-1">{errors.dni.message}</p>}
          </div>

          {/* Adreça */}
          <div>
            <label className="block mb-1 font-semibold">Adreça</label>
            <input
              {...register("address")}
              className="
                w-full px-3 py-2 rounded-lg
                bg-neutral-200/70 border border-black/40 text-black
                dark:bg-black/30 dark:border-white/20 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition-colors duration-300
              "
            />
            {errors.address && <p className="text-red-500 mt-1">{errors.address.message}</p>}
          </div>

          {/* Consent */}
          <div className="mt-4">
            <label
              className="
                flex items-center gap-3 p-3 rounded-lg cursor-pointer
                bg-neutral-200/70 border border-black/40 backdrop-blur-md
                dark:bg-black/30 dark:border-white/20
                hover:bg-neutral-300/70 dark:hover:bg-black/40
                transition-colors duration-300
              "
            >
              <input
                type="checkbox"
                {...register("consent")}
                className="
                  h-5 w-5 rounded-md border border-black/50 bg-white/80
                  dark:border-white/30 dark:bg-black/50
                  checked:bg-black dark:checked:bg-white
                  cursor-pointer transition-colors duration-300
                "
              />
              <span className="text-base font-semibold text-black dark:text-white leading-snug">
                Accepto el tractament de dades per a aquesta ILP <br />
                <span className="font-normal text-sm text-neutral-700 dark:text-gray-300">
                  (vegeu la política de privacitat)
                </span>
              </span>
            </label>
            {errors.consent && <p className="text-red-500 text-sm mt-2">{errors.consent.message}</p>}
          </div>

          {/* Captcha */}
          <div className="flex justify-center mt-6">
            <HCaptcha
              ref={captchaRef}
              sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
              languageOverride="ca"
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full mt-4 cursor-pointer rounded-2xl px-6 py-3 text-base font-semibold 
              text-black dark:text-white relative border
              bg-white/70 border border-black/60 backdrop-blur-xl
              dark:bg-black/40 dark:border-white/30
              before:absolute before:inset-0 before:rounded-2xl 
              before:p-[2px] before:bg-gradient-to-r before:from-blue-500 before:via-red-500 before:to-yellow-500
              before:opacity-0 hover:before:opacity-100
              hover:scale-105
              transition-all duration-300 ease-in-out
              disabled:opacity-50
              shadow-lg overflow-hidden
            "
          >
            <span className="relative z-10">{isSubmitting ? "Enviant..." : "Enviar"}</span>
          </button>
        </form>
      </div>
    </main>
  );
}