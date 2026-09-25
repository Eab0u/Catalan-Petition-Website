// VALId 2.0 API client — Consorci AOC.
// Pre-prod base: https://valid-pre.aoc.cat
// Production base: https://valid.aoc.cat  (swap via VALID_BASE_URL env var)

import fetch from "node-fetch";
import crypto from "crypto";
import { PETITION_TEXT } from "./petitionConfig";

export interface ValidConfig {
  baseUrl: string;         // e.g. https://valid-pre.aoc.cat
  clientId: string;
  clientSecret: string;
  redirectUri: string;     // OAuth auth callback — must be a backend endpoint
  signCallbackUri: string; // Sign page result callback — must be a backend endpoint
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Full getUserInfo response as per VALId 2.0 spec.
// identifierType: 1=NIF, 2=NIE, 3=Passaport, 4=Altres
// assuranceLevel: "low" | "substantial" | "high"
// idCAT Mòbil may return surnames as a combined `surnames` string OR
// as separate `surname1`/`surname2` fields depending on how the account
// was originally registered — both cases must be handled.
export interface UserInfo {
  status: string;
  identifier: string;
  prefix?: string;
  phone?: string;
  identifierType: number;
  name: string;
  surnames?: string;     // combined "Primer Segon" — may be present instead of surname1/2
  surname1?: string;
  surname2?: string;
  countryCode?: string;
  email?: string;
  userCertificate?: string;
  certificateType?: string;
  companyId?: string;
  companyName?: string;
  method?: string;       // "idcatmobil" for our flow
  assuranceLevel: string;
  error?: string;
}

// Split surnames defensively: prefer explicit fields, fall back to splitting
// the combined `surnames` string on the first space.
export function splitSurnames(u: UserInfo): { surname1: string; surname2: string } {
  if (u.surname1) {
    return { surname1: u.surname1, surname2: u.surname2 ?? "" };
  }
  if (u.surnames) {
    const idx = u.surnames.indexOf(" ");
    if (idx === -1) return { surname1: u.surnames, surname2: "" };
    return {
      surname1: u.surnames.slice(0, idx),
      surname2: u.surnames.slice(idx + 1),
    };
  }
  return { surname1: "", surname2: "" };
}

export interface InitSignatureResult {
  status: string;        // "ok" | "ko"
  signatureCode: string; // present when status="ok"
  error?: string;        // description when status="ko"
}

// getBasicSignature response — status "ok" on success, "ko" on failure.
export interface GetSignatureResult {
  status: string;    // "ok" | "ko"
  evidence: string;  // base64-encoded XAdES-T signature (present when status="ok")
  error?: string;    // description when status="ko"
}

export function buildAuthUrl(config: ValidConfig, state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    scope: "autenticacio_usuari",
    redirect_uri: config.redirectUri,
    state,
  });
  return `${config.baseUrl}/o/oauth2/auth?${params}`;
}

export async function exchangeCodeForToken(
  config: ValidConfig,
  code: string
): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
  });

  const res = await fetch(`${config.baseUrl}/o/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed ${res.status}: ${text}`);
  }

  return res.json() as Promise<TokenResponse>;
}

export async function getUserInfo(
  config: ValidConfig,
  accessToken: string
): Promise<UserInfo> {
  const res = await fetch(`${config.baseUrl}/serveis-rest/getUserInfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getUserInfo failed ${res.status}: ${text}`);
  }

  const data = (await res.json()) as UserInfo;
  if (data.status && data.status !== "ok" && data.error) {
    throw new Error(`getUserInfo returned error: ${data.error}`);
  }
  return data;
}

// Returns the SHA-256 hash of the petition text as a base64 string.
// VALId spec: "the base64 encoding of the bit string viewed as a 32-byte stream."
export function hashPetitionText(): string {
  return crypto.createHash("sha256").update(PETITION_TEXT, "utf8").digest("base64");
}

export async function initBasicSignature(
  config: ValidConfig,
  accessToken: string
): Promise<InitSignatureResult> {
  const res = await fetch(`${config.baseUrl}/serveis-rest/initBasicSignature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documents: [
        {
          name: "peticio-ilp",
          algorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
          hash: hashPetitionText(),
          metadata: "",
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`initBasicSignature failed ${res.status}: ${text}`);
  }

  const data = (await res.json()) as InitSignatureResult;
  if (data.status === "ko") {
    throw new Error(`initBasicSignature returned ko: ${data.error ?? "unknown error"}`);
  }
  if (!data.signatureCode) {
    throw new Error("initBasicSignature returned ok but signatureCode is missing");
  }
  return data;
}

export function buildSignPageUrl(
  config: ValidConfig,
  signatureCode: string
): string {
  const params = new URLSearchParams({
    signature_code: signatureCode,
    redirect_uri: config.signCallbackUri,
  });
  return `${config.baseUrl}/o/sign?${params}`;
}

export async function getBasicSignature(
  config: ValidConfig,
  accessToken: string,
  signatureCode: string
): Promise<GetSignatureResult> {
  const res = await fetch(`${config.baseUrl}/serveis-rest/getBasicSignature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ signatureCode }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getBasicSignature failed ${res.status}: ${text}`);
  }

  const data = (await res.json()) as GetSignatureResult;
  if (data.status === "ko") {
    throw new Error(`getBasicSignature returned ko: ${data.error ?? "unknown error"}`);
  }
  if (!data.evidence) {
    throw new Error("getBasicSignature returned ok but evidence field is empty");
  }
  return data;
}
