// Handles the full idCAT Mòbil / VALId 2.0 OAuth + signature flow:
//
//   authRouter   mounts at /api/auth
//     GET /start        → /api/auth/start
//     GET /callback     → /api/auth/callback
//
//   signCallbackRouter  mounts at /api/sign
//     GET /callback     → /api/sign/callback  (VALId sign page result)

import express from "express";
import * as admin from "firebase-admin";
import crypto from "crypto";
import { getStorage } from "firebase-admin/storage";
import {
  buildAuthUrl,
  buildSignPageUrl,
  exchangeCodeForToken,
  getUserInfo,
  initBasicSignature,
  getBasicSignature,
  splitSurnames,
  ValidConfig,
} from "../validClient";
import {
  createSession,
  getSession,
  getSessionBySignatureCode,
  updateSession,
  deleteSession,
} from "../sessionStore";

const router = express.Router();

function getValidConfig(): ValidConfig {
  const baseUrl = process.env.VALID_BASE_URL;
  const clientId = process.env.VALID_CLIENT_ID;
  const clientSecret = process.env.VALID_CLIENT_SECRET;
  const redirectUri = process.env.VALID_REDIRECT_URI;
  const signCallbackUri = process.env.VALID_SIGN_CALLBACK_URI;

  if (!baseUrl || !clientId || !clientSecret || !redirectUri || !signCallbackUri) {
    throw new Error(
      "Missing VALId config. Set VALID_BASE_URL, VALID_CLIENT_ID, VALID_CLIENT_SECRET, VALID_REDIRECT_URI, VALID_SIGN_CALLBACK_URI."
    );
  }
  // IMPORTANT: the values of VALID_REDIRECT_URI and VALID_SIGN_CALLBACK_URI
  // must be byte-for-byte identical to what is registered with Consorci AOC.
  // Some OAuth servers do exact string matching, so "http://localhost:5000/..."
  // and "http://127.0.0.1:5000/..." are treated as different URIs.
  // Dev URIs to give AOC (choose one form and stick with it):
  //   http://127.0.0.1:5000/api/auth/callback
  //   http://127.0.0.1:5000/api/sign/callback
  return { baseUrl, clientId, clientSecret, redirectUri, signCallbackUri };
}

function getFrontendBase(): string {
  return process.env.FRONTEND_BASE_URL ?? "https://petition-site-22334.web.app";
}

function redirectToResult(
  res: express.Response,
  status: "success" | "cancelled" | "error",
  message?: string
) {
  const base = getFrontendBase();
  const params = new URLSearchParams({ status });
  if (message) params.set("message", message);
  res.redirect(`${base}/sign/result?${params}`);
}

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

// ── Rate limiting (IP-based, prevents abuse of the auth start endpoint) ──────

const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 10;

async function checkIpRateLimit(ip: string): Promise<boolean> {
  const db = admin.firestore();
  const docRef = db.collection("rate_limits").doc(`auth_start:${ip.slice(0, 40)}`);

  return db.runTransaction(async (tx) => {
    const doc = await tx.get(docRef);
    const now = Date.now();

    if (!doc.exists) {
      tx.set(docRef, { count: 1, windowStart: now });
      return true;
    }

    const { count, windowStart } = doc.data() as { count: number; windowStart: number };
    if (now - windowStart > RATE_WINDOW_MS) {
      tx.set(docRef, { count: 1, windowStart: now });
      return true;
    }
    if (count >= RATE_MAX) return false;
    tx.update(docRef, { count: count + 1 });
    return true;
  });
}

function getClientIp(req: express.Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

// ── Dedup: one signature per NIF ever ────────────────────────────────────────

async function nifAlreadySigned(nifHash: string): Promise<boolean> {
  const db = admin.firestore();
  const snap = await db
    .collection("petitions")
    .where("nifHash", "==", nifHash)
    .limit(1)
    .get();
  return !snap.empty;
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/auth/start
// Frontend navigates here after user checks consent. Creates an OAuth session
// and redirects the browser to VALId's authorization page.
router.get("/start", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const allowed = await checkIpRateLimit(ip);
    if (!allowed) {
      return redirectToResult(res, "error", "massa_peticions");
    }

    const consent = req.query.consent === "true";
    if (!consent) {
      return redirectToResult(res, "error", "consent_required");
    }

    const config = getValidConfig();
    const state = crypto.randomBytes(32).toString("hex");

    await createSession(state, true);

    const authUrl = buildAuthUrl(config, state);
    return res.redirect(authUrl);
  } catch (err) {
    console.error("auth/start error:", err);
    return redirectToResult(res, "error", "server_error");
  }
});

// GET /api/auth/callback
// VALId redirects here after the user authenticates with idCAT Mòbil.
// We exchange the code for a token, fetch user info, and start the signature.
router.get("/callback", async (req, res) => {
  const { code, state, error } = req.query as Record<string, string | undefined>;

  if (error) {
    console.warn("VALId auth error:", error);
    return redirectToResult(res, "cancelled");
  }

  if (!code || !state) {
    return redirectToResult(res, "error", "params_invalids");
  }

  let session;
  try {
    session = await getSession(state);
  } catch (err) {
    console.error("session lookup error:", err);
    return redirectToResult(res, "error", "server_error");
  }

  if (!session) {
    return redirectToResult(res, "error", "sessio_expirada");
  }

  try {
    const config = getValidConfig();

    const tokenResp = await exchangeCodeForToken(config, code);
    const accessToken = tokenResp.access_token;

    const userInfo = await getUserInfo(config, accessToken);

    // Dedup check before going further
    const nifHash = sha256Hex(userInfo.identifier.toUpperCase());
    const duplicate = await nifAlreadySigned(nifHash);
    if (duplicate) {
      await deleteSession(state);
      return redirectToResult(res, "error", "ja_signat");
    }

    const { signatureCode } = await initBasicSignature(config, accessToken);

    await updateSession(state, {
      accessToken,
      userInfo,
      signatureCode,
      status: "pending_sign",
    });

    const signPageUrl = buildSignPageUrl(config, signatureCode);
    return res.redirect(signPageUrl);
  } catch (err) {
    console.error("auth/callback error:", err);
    await updateSession(state, { status: "error" }).catch(() => {});
    return redirectToResult(res, "error", "server_error");
  }
});

// ── Sign callback router (mounts separately at /api/sign) ────────────────────

const signRouter = express.Router();

// GET /api/sign/callback
// VALId redirects here after the user signs (or cancels/errors).
// result: "OK" | "CANCEL" | "ERROR"
signRouter.get("/callback", async (req, res) => {
  const { result, signature_code: signatureCode } = req.query as Record<
    string,
    string | undefined
  >;

  if (!result || !signatureCode) {
    return redirectToResult(res, "error", "params_invalids");
  }

  if (result === "CANCEL") {
    return redirectToResult(res, "cancelled");
  }

  if (result !== "OK") {
    return redirectToResult(res, "error", "signatura_fallida");
  }

  let session;
  try {
    session = await getSessionBySignatureCode(signatureCode);
  } catch (err) {
    console.error("session lookup error:", err);
    return redirectToResult(res, "error", "server_error");
  }

  if (!session || !session.accessToken || !session.userInfo) {
    return redirectToResult(res, "error", "sessio_invalida");
  }

  const { accessToken, userInfo, state } = session;

  try {
    const config = getValidConfig();

    // getBasicSignature throws if status="ko" or evidence is missing
    const { evidence: evidenceB64 } = await getBasicSignature(
      config,
      accessToken,
      signatureCode
    );

    // Upload XAdES-T evidence to Cloud Storage
    const evidenceBucketName = process.env.EVIDENCE_BUCKET_NAME;
    if (!evidenceBucketName) throw new Error("EVIDENCE_BUCKET_NAME not set");

    const evidenceBuffer = Buffer.from(evidenceB64, "base64");
    const evidencePath = `evidence/${signatureCode}.xml`;
    const bucket = getStorage().bucket(evidenceBucketName);
    await bucket.file(evidencePath).save(evidenceBuffer, {
      contentType: "application/xml",
      metadata: { signatureCode, nifHash: sha256Hex(userInfo.identifier.toUpperCase()) },
    });

    // Write Firestore petition record
    const db = admin.firestore();
    const nifHash = sha256Hex(userInfo.identifier.toUpperCase());

    // Final dedup check in case of concurrent submissions
    const alreadySigned = await nifAlreadySigned(nifHash);
    if (alreadySigned) {
      await deleteSession(state);
      return redirectToResult(res, "error", "ja_signat");
    }

    // Split surnames defensively — VALId may return either surname1/surname2
    // separately or a combined `surnames` string depending on registration.
    const { surname1, surname2 } = splitSurnames(userInfo);

    await db.collection("petitions").add({
      nom: userInfo.name,
      cognom1: surname1,
      cognom2: surname2,
      nif: userInfo.identifier.toUpperCase(),
      nifHash,
      assuranceLevel: userInfo.assuranceLevel,
      method: "idcatmobil",
      signatureCode,
      evidencePath,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db
      .doc("stats/global")
      .set(
        { totalSignatures: admin.firestore.FieldValue.increment(1) },
        { merge: true }
      );

    await deleteSession(state);
    return redirectToResult(res, "success");
  } catch (err) {
    console.error("sign/callback error:", err);
    await updateSession(state, { status: "error" }).catch(() => {});
    return redirectToResult(res, "error", "server_error");
  }
});

export default router;
export { signRouter };
