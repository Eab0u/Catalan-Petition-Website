import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

// ----------------- Schema -----------------
const petitionSchema = z.object({
  nom: z.string().min(1, "Nom obligatori"),
  cognom1: z.string().min(1, "Primer cognom obligatori"),
  cognom2: z.string().optional(),
  datanaixement: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data en format YYYY-MM-DD"),
  tipusid: z
    .string()
    .toUpperCase()
    .regex(/^[0-9]{7,8}[A-Z]$/, "DNI vàlid requerit"),
  address: z.string().min(5, "Adreça massa curta"),
  consent: z.literal(true, {
    message: "Has d’acceptar el consentiment",
  }),
});

type PetitionFormData = z.infer<typeof petitionSchema>;

// ----------------- Component -----------------
const PetitionForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetitionFormData>({
    resolver: zodResolver(petitionSchema),
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // TEMP: auto-set captcha for dev/demo purposes.
  // Replace this with real hCaptcha or FriendlyCaptcha widget integration.
  React.useEffect(() => {
    setCaptchaToken("test-captcha-token");
  }, []);

  const onSubmit = async (data: PetitionFormData) => {
    setErrorMessage(null);

    if (!captchaToken) {
      setErrorMessage("Si us plau, completa el captcha!");
      return;
    }

    try {
      const payload = {
        ...data,
        datanaixement: data.datanaixement.replace(/-/g, ""), // convert YYYY-MM-DD → YYYYMMDD
        captchaToken,
      };

      const res = await fetch("/api/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Error del servidor");
      }

      setSubmitted(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("Error submitting petition:", err);
      setErrorMessage("S'ha produït un error en enviar la signatura.");
    }
  };

  if (submitted) {
    return (
      <div>
        <h2>Gràcies per signar!</h2>
        <p>Seràs redirigit a la pàgina principal en breu...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: "400px" }}>
      <div>
        <input placeholder="Nom" {...register("nom")} />
        {errors.nom && <p>{errors.nom.message}</p>}
      </div>

      <div>
        <input placeholder="Primer cognom" {...register("cognom1")} />
        {errors.cognom1 && <p>{errors.cognom1.message}</p>}
      </div>

      <div>
        <input placeholder="Segon cognom" {...register("cognom2")} />
        {errors.cognom2 && <p>{errors.cognom2.message}</p>}
      </div>

      <div>
        <input type="date" {...register("datanaixement")} />
        {errors.datanaixement && <p>{errors.datanaixement.message}</p>}
      </div>

      <div>
        <input placeholder="DNI (ex: 12345678Z)" {...register("tipusid")} />
        {errors.tipusid && <p>{errors.tipusid.message}</p>}
      </div>

      <div>
        <input placeholder="Adreça" {...register("address")} />
        {errors.address && <p>{errors.address.message}</p>}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register("consent")} /> Accepto el
          consentiment
        </label>
        {errors.consent && <p>{errors.consent.message}</p>}
      </div>

      {/* Captcha widget placeholder (replace with hCaptcha later) */}
      <div style={{ margin: "15px 0" }}>
        <p>[Captcha widget aquí]</p>
      </div>

      <div>
        <button type="submit">Enviar</button>
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
};

export default PetitionForm;
