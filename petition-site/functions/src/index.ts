import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { z } from "zod";
import crypto from "crypto";
import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2/options";

admin.initializeApp();
const db = admin.firestore();
const region = "europe-west1";

// ----------------- Helpers -----------------
const normalizeWhitespace = (s: string) => s.trim().replace(/\s+/g, " ");
const sha256Hex = (input: string) =>
  crypto.createHash("sha256").update(input, "utf8").digest("hex");

function getClientIp(req: express.Request) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.ip || "unknown";
}

// ----------------- Schema -----------------
const signSchema = z.object({
  nom: z.string().min(1).max(30),
  cognom1: z.string().min(1).max(50),
  cognom2: z.string().max(50).optional(),
  datanaixement: z.string().regex(/^\d{8}$/), // YYYYMMDD
  tipusid: z.string().regex(/^[0-9]{7,8}[A-Z]$/),
  address: z.string().optional(),
  consent: z.literal(true),
  captchaToken: z.string().min(1),
});

// ----------------- Express app -----------------
const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

// POST /api/sign
app.post("/sign", async (req, res) => {
  try {
    const parsed = signSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.flatten() });
    }

    const { nom, cognom1, cognom2, datanaixement, tipusid, address } =
      parsed.data;

    const ip = getClientIp(req);
    const ipHash = sha256Hex(ip);

    const canonical = `${nom}|${cognom1}|${cognom2 || ""}|${datanaixement}|${tipusid}`;
    const signatureHash = sha256Hex(canonical);

    await db.collection("petitions").add({
      nom: normalizeWhitespace(nom),
      cognom1: normalizeWhitespace(cognom1),
      cognom2: cognom2 ? normalizeWhitespace(cognom2) : "",
      datanaixement,
      tipusid,
      address: address ? normalizeWhitespace(address) : "",
      consent: true,
      signatureHash,
      ipHash,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db
      .doc("stats/global")
      .set({ totalSignatures: admin.firestore.FieldValue.increment(1) }, { merge: true });

    res.json({ success: true });
  } catch (err) {
    console.error("Sign error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/counter
app.get("/counter", async (_req, res) => {
  const snap = await db.doc("stats/global").get();
  const count = snap.exists ? snap.data()?.totalSignatures || 0 : 0;
  res.json({ success: true, totalSignatures: count });
});

setGlobalOptions({ region: "europe-west1" });
export const api = onRequest(app);