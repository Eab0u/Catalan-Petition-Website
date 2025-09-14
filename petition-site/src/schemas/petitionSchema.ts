// src/schemas/petitionSchema.ts
import * as z from "zod";

/**
 * DNI and NIE:
 * - DNI: 7-8 digits + letter (e.g. 12345678A)
 * - NIE: starts with X/Y/Z followed by 7 digits + letter (e.g. X1234567T)
 */
const dniRegex = /^[0-9]{7,8}[A-Za-z]$/;
const nieRegex = /^[XYZxyz][0-9]{7}[A-Za-z]$/;

const dniOrNieSchema = z
  .string()
  .min(2, "DNI/NIE required")
  .refine((val) => dniRegex.test(val) || nieRegex.test(val), {
    message: "DNI/NIE format invalid",
  })
  .transform((val) => val.toUpperCase());

export const petitionSchema = z.object({
  nom: z.string().min(1, "El nom és obligatori").max(30, "Max 30 caràcters"),
  cognom1: z
    .string()
    .min(1, "El primer cognom és obligatori")
    .max(50, "Max 50 caràcters"),
  cognom2: z.string().max(50, "Max 50 caràcters").optional().or(z.literal("")),
  // Expect the date input as "YYYY-MM-DD"; transform to "YYYYMMDD"
  datanaixement: z
    .string()
    .min(10, "La data és obligatòria")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de data invàlid (YYYY-MM-DD)")
    .transform((val) => val.replace(/-/g, "")),
  tipusid: dniOrNieSchema,
  address: z.string().max(200, "Max 200 caràcters").optional(),
  // Use boolean + refine for compatibility and a clear error message
  consent: z
    .boolean()
    .refine((val) => val === true, { message: "Has d'acceptar el tractament de dades" }),
  captchaToken: z.string().min(1, "Captcha obligatori"),
});

export type PetitionSchemaType = z.infer<typeof petitionSchema>;