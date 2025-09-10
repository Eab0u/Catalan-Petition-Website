// functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { z } from "zod";
import ExcelJS from "exceljs";
import crypto from "crypto";
import { https } from "firebase-functions/v2";

admin.initializeApp();
const db = admin.firestore();

// region: prefer an EU region
const region = "europe-west1";

// ---------- Helpers ----------
const normalizeWhitespace = (s: string) => s.trim().replace(/\s+/g, " ");
const removeDiacritics = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
const normName = (s: string) => normalizeWhitespace(removeDiacritics(s));

const sha256Hex = (input: string) =>
  crypto.createHash("sha256").update(input, "utf8").digest("hex");

// Extract client IP from headers (works behind proxies like Firebase)
function getClientIp(req: express.Request) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  // fallback
  return req.ip || req.connection.remoteAddress || "unknown";
}

// ---------- Validation schema (server-side) ----------
const signSchema = z.object({
  nom: z.string().min(1).max(30),
  cognom1: z.string().min(1).max(50),
  cognom2: z.string().max(50).optional().or(z.literal("")),
  address: z.string().max(200).optional().default(""),
  datanaixement: z
    .string()
    .regex(/^\d{8}$/, "datanaixement must be YYYYMMDD"), // server expects YYYYMMDD
  tipusid: z
  .string()
  .regex(/^(?:[0-9]{7,8}[A-Z]|[XYZ][0-9]{7}[A-Z])$/, "Invalid DNI/NIE")
  .transform((v) => v.toUpperCase()),
  captchaToken: z.string().min(1), // token from hCaptcha / FriendlyCaptcha client
  // optional: add email/contact fields later
});

// ---------- Rate limiter (Firestore-based; simple sliding window) ----------
const RATE_LIMITS = {
  ip: { windowMs: 60 * 60 * 1000, max: 20 }, // 20 submissions per IP per hour
  tipusid: { windowMs: 24 * 60 * 60 * 1000, max: 5 }, // 5 submissions per DNI/NIE per 24h
};

async function checkAndIncrementRateLimit(kind: "ip" | "tipusid", key: string) {
  const collection = db.collection("rate_limits");
  const docRef = collection.doc(`${kind}:${key}`);
  return db.runTransaction(async (tx) => {
    const doc = await tx.get(docRef);
    const now = Date.now();
    if (!doc.exists) {
      tx.set(docRef, { count: 1, windowStart: now });
      return { allowed: true, count: 1 };
    }
    const data = doc.data() as any;
    const windowStart = data.windowStart as number;
    const count = data.count as number;
    const limit = RATE_LIMITS[kind].max;
    const windowMs = RATE_LIMITS[kind].windowMs;
    if (now - windowStart > windowMs) {
      // reset
      tx.set(docRef, { count: 1, windowStart: now });
      return { allowed: true, count: 1 };
    } else {
      if (count + 1 > limit) {
        return { allowed: false, count };
      } else {
        tx.update(docRef, { count: count + 1 });
        return { allowed: true, count: count + 1 };
      }
    }
  });
}

// ---------- Captcha verification ----------
async function verifyCaptcha(token: string) {
  // we support hCaptcha as example. Set functions config: hcaptcha.secret
  const hcaptchaSecret = (functions.config && functions.config().hcaptcha?.secret) || process.env.HCAPTCHA_SECRET;
  if (!hcaptchaSecret) {
    // If not configured, fail safe: reject (or optionally bypass in dev)
    throw new Error("Captcha secret not configured.");
  }
  const params = new URLSearchParams();
  params.append("secret", hcaptchaSecret);
  params.append("response", token);

  const res = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const json = await res.json();
  return json.success === true;
}

// ---------- Express app ----------
const app = express();
app.use(helmet());
app.use(cors({ origin: true })); // adjust origin to your frontend URL in production
app.use(express.json({ limit: "1mb" }));

// POST /api/sign
app.post("/sign", async (req, res) => {
  try {
    const parseResult = signSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, errors: parseResult.error.flatten() });
    }
    const data = parseResult.data;

    // Basic server-side normalization
    const nom = normName(data.nom);
    const cognom1 = normName(data.cognom1);
    const cognom2 = data.cognom2 ? normName(data.cognom2) : "";
    const datanaixement = data.datanaixement; // already YYYYMMDD
    const tipusid = data.tipusid.toUpperCase();
    const address = normalizeWhitespace(data.address);


    // 1) Verify captcha
    const captchaOk = await verifyCaptcha(data.captchaToken);
    if (!captchaOk) {
      return res.status(400).json({ success: false, message: "Captcha failed" });
    }

    // 2) Rate limiting per IP
    const ip = getClientIp(req);
    const ipTrunc = ip.slice(0, 40); // some truncation to avoid ultra long keys
    const ipRate = await checkAndIncrementRateLimit("ip", ipTrunc);
    if (!ipRate.allowed) {
      return res.status(429).json({ success: false, message: "Too many requests from this IP" });
    }

    // 3) Rate limiting per DNI
    const numid = tipusid.replace(/\D/g, "");
    const idRate = await checkAndIncrementRateLimit("tipusid", numid);
    if (!idRate.allowed) {
      return res.status(429).json({ success: false, message: "Too many requests for this ID today" });
    }

    // 4) Duplicate detection: create signatureHash server-side
    const canonical = `${nom}|${cognom1}|${cognom2}|${datanaixement}|${tipusid}`;
    const signatureHash = sha256Hex(canonical);

    // Optionally reject exact duplicates (uncomment if desired)
    // const dupQuery = await db.collection("petitions").where("signatureHash", "==", signatureHash).limit(1).get();
    // if (!dupQuery.empty) {
    //   return res.status(409).json({ success: false, message: "Duplicate signature detected" });
    // }

    // 5) IP hash (truncate then hash)
    const ipForHash = ipTrunc; // optionally remove port
    const ipHash = sha256Hex(ipForHash);

    // 6) Insert petition document with server timestamp & metadata
    const petitionRef = await db.collection("petitions").add({
      nom,
      cognom1,
      cognom2,
      datanaixement,
      tipusid,
      numid,
      address,
      signatureHash,
      ipHash,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 7) Increment counter atomically in stats/global
    const statsRef = db.doc("stats/global");
    await statsRef.set({ totalSignatures: admin.firestore.FieldValue.increment(1) }, { merge: true });

    return res.status(200).json({ success: true, id: petitionRef.id });
  } catch (err: any) {
    console.error("Sign error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/counter
app.get("/counter", async (req, res) => {
  try {
    const snap = await db.doc("stats/global").get();
    const data = snap.exists ? snap.data() : { totalSignatures: 0 };
    return res.json({ success: true, totalSignatures: data?.totalSignatures ?? 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});

// Admin-only export to xlsx
app.get("/export.xlsx", async (req, res) => {
  try {
    // Verify Firebase ID token in Authorization: Bearer <token>
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) return res.status(401).send("Missing auth token");
    const idToken = match[1];

    const decoded = await admin.auth().verifyIdToken(idToken);
    // Check custom claim "admin" OR check UID against a configured list
    const isAdminClaim = decoded.admin === true;
    const ADMIN_UIDS = (functions.config && functions.config().admins?.uids) || process.env.ADMIN_UIDS || "";
    const adminUidList = typeof ADMIN_UIDS === "string" ? ADMIN_UIDS.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const isAdminUid = adminUidList.includes(decoded.uid);
    if (!isAdminClaim && !isAdminUid) {
      return res.status(403).send("Admin only");
    }

    // Query petitions (you may want to paginate in production)
    const qSnap = await db.collection("petitions").orderBy("createdAt", "asc").get();

    // Build Excel file
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("petitions");
    sheet.columns = [
      { header: "Nom", key: "nom", width: 20 },
      { header: "Cognom1", key: "cognom1", width: 20 },
      { header: "Cognom2", key: "cognom2", width: 20 },
      { header: "DataNaixement", key: "datanaixement", width: 12 },
      { header: "TipusID", key: "tipusid", width: 12 },
      { header: "NumID", key: "numid", width: 12 },
      { header: "Address", key: "address", width: 30 },
      { header: "CreatedAt", key: "createdAt", width: 25 },
    ];

    qSnap.forEach((doc) => {
      const d = doc.data() as any;
      sheet.addRow({
        nom: d.nom,
        cognom1: d.cognom1,
        cognom2: d.cognom2,
        datanaixement: d.datanaixement,
        tipusid: d.tipusid,
        numid: d.numid,
        address: d.address,
        createdAt: d.createdAt ? d.createdAt.toDate().toISOString() : "",
      });
    });

    // Stream back as xlsx
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="petitions.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).send("Server error");
  }
});

// Export the Express app as a Cloud Function
export const api = https.onRequest({ region: "europe-west1" }, app);
