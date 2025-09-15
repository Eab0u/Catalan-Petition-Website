// functions/src/index.ts
import * as admin from "firebase-admin";
import express from "express";
import helmet from "helmet";
import { z } from "zod";
import ExcelJS from "exceljs";
import crypto from "crypto";
import fetch from "node-fetch";
import { onRequest } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

// ---------- Helpers ----------
const normalizeWhitespace = (s: string) => s.trim().replace(/\s+/g, " ");
const removeDiacritics = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
const normName = (s: string) => normalizeWhitespace(removeDiacritics(s));

const sha256Hex = (input: string) =>
  crypto.createHash("sha256").update(input, "utf8").digest("hex");

function getClientIp(req: express.Request) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.ip || req.connection.remoteAddress || "unknown";
}

// ---------- Validation schema ----------
const signSchema = z.object({
  nom: z.string().min(1).max(30),
  cognom1: z.string().min(1).max(50),
  cognom2: z.string().max(50).optional().or(z.literal("")),
  address: z.string().max(200).optional().default(""),
  datanaixement: z.string().regex(/^\d{8}$/, "datanaixement must be YYYYMMDD"),
  tipusid: z
    .string()
    .regex(/^(?:[0-9]{7,8}[A-Z]|[XYZ][0-9]{7}[A-Z])$/, "Invalid DNI/NIE")
    .transform((v) => v.toUpperCase()),
  captchaToken: z.string().min(1),
});

// ---------- Rate limiter ----------
const RATE_LIMITS = {
  ip: { windowMs: 60 * 60 * 1000, max: 20 },
  tipusid: { windowMs: 24 * 60 * 60 * 1000, max: 5 },
};

async function checkAndIncrementRateLimit(
  kind: "ip" | "tipusid",
  key: string
) {
  const docRef = db.collection("rate_limits").doc(`${kind}:${key}`);
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
      tx.set(docRef, { count: 1, windowStart: now });
      return { allowed: true, count: 1 };
    } else if (count + 1 > limit) {
      return { allowed: false, count };
    } else {
      tx.update(docRef, { count: count + 1 });
      return { allowed: true, count: count + 1 };
    }
  });
}

// ---------- Captcha verification ----------
async function verifyCaptcha(token: string) {
  const hcaptchaSecret = process.env.HCAPTCHA_SECRET;
  if (!hcaptchaSecret) throw new Error("Captcha secret not configured.");

  const params = new URLSearchParams();
  params.append("secret", hcaptchaSecret);
  params.append("response", token);

  const res = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const json = (await res.json()) as any;
  return json.success === true;
}

// ---------- Express app ----------
const app = express();
app.use(helmet());

// ✅ Manual CORS middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://petition-site-22334.web.app",
  "https://petition-site-22334.firebaseapp.com",
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

app.use(express.json({ limit: "1mb" }));

// ---------- Routes ----------

// POST /api/sign
app.post("/api/sign", async (req, res) => {
  try {
    const parseResult = signSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.flatten(),
      });
    }
    const data = parseResult.data;

    const captchaOk = await verifyCaptcha(data.captchaToken);
    if (!captchaOk) {
      return res.status(400).json({ success: false, message: "Captcha failed" });
    }

    const ip = getClientIp(req).slice(0, 40);
    const ipRate = await checkAndIncrementRateLimit("ip", ip);
    if (!ipRate.allowed)
      return res
        .status(429)
        .json({ success: false, message: "Too many requests from this IP" });

    const numid = data.tipusid.replace(/\D/g, "");
    const idRate = await checkAndIncrementRateLimit("tipusid", numid);
    if (!idRate.allowed)
      return res
        .status(429)
        .json({ success: false, message: "Too many requests for this ID today" });

    const canonical = `${normName(data.nom)}|${normName(
      data.cognom1
    )}|${data.cognom2 ? normName(data.cognom2) : ""}|${data.datanaixement}|${data.tipusid.toUpperCase()}`;
    const signatureHash = sha256Hex(canonical);
    const ipHash = sha256Hex(ip);

    await db.collection("petitions").add({
      nom: normName(data.nom),
      cognom1: normName(data.cognom1),
      cognom2: data.cognom2 ? normName(data.cognom2) : "",
      datanaixement: data.datanaixement,
      tipusid: data.tipusid.toUpperCase(),
      numid,
      address: data.address ?? "",
      signatureHash,
      ipHash,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.doc("stats/global").set(
      { totalSignatures: admin.firestore.FieldValue.increment(1) },
      { merge: true }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Sign error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/counter
app.get("/api/counter", async (_req, res) => {
  try {
    const snap = await db.doc("stats/global").get();
    const total = snap.exists ? snap.data()?.totalSignatures || 0 : 0;
    return res.json({ success: true, totalSignatures: total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});

// GET /api/export.xlsx (admin only)
app.get("/api/export.xlsx", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) return res.status(401).send("Missing auth token");
    const idToken = match[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    const ADMIN_UIDS = (process.env.ADMIN_UIDS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!(decoded.admin === true || ADMIN_UIDS.includes(decoded.uid)))
      return res.status(403).send("Admin only");

    const qSnap = await db.collection("petitions").orderBy("createdAt").get();
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
        ...d,
        createdAt: d.createdAt ? d.createdAt.toDate().toISOString() : "",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="petitions.xlsx"`
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).send("Server error");
  }
});

// ---------- Export ----------
export const api = onRequest({ region: "europe-west1" }, app);