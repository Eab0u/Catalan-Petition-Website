// src/types.ts
export type PetitionFormData = {
  nom: string;
  cognom1: string;
  cognom2?: string;
  datanaixement: string; // YYYYMMDD (we transform client date -> this format)
  dni: string; // DNI/NIE uppercase, e.g. "12345678A" or "X1234567T"
  address?: string;
  consent: boolean;
};