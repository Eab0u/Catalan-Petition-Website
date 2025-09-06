import * as z from "zod";

export const petitionSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  dob: z.string().min(1, "Date of birth is required"), // later you can add date format validation
  dni: z.string().min(5, "DNI is required"), // adjust length rules if needed
  address: z.string().min(1, "Address is required"),
});

export type PetitionSchemaType = z.infer<typeof petitionSchema>;