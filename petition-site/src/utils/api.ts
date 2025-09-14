import type { PetitionSchemaType } from "../schemas/petitionSchema";

export async function signPetition(data: PetitionSchemaType) {
  const res = await fetch("/api/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to sign petition");
  }
  return res.json();
}

export async function fetchCounter(): Promise<number> {
  const res = await fetch("/api/counter");
  if (!res.ok) throw new Error("Failed to fetch counter");
  const { count } = await res.json();
  return count;
}