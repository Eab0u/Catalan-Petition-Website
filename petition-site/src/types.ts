// Petition record as stored in Firestore after a successful idCAT Mòbil signature.
// All identity fields come from VALId's getUserInfo — not self-reported.
export type PetitionRecord = {
  nom: string;
  cognom1: string;
  cognom2: string;
  nif: string;           // Verified NIF/NIE from VALId (stored in plaintext for Parliament submission)
  nifHash: string;       // SHA-256 of uppercase NIF — used for dedup queries
  assuranceLevel: string;
  method: "idcatmobil";
  signatureCode: string;
  evidencePath: string;  // Cloud Storage path to the XAdES-T evidence file
  createdAt: unknown;    // Firestore Timestamp
};
