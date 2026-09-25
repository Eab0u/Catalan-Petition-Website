import * as admin from "firebase-admin";
import * as functionsV1 from "firebase-functions/v1";
import express from "express";
import helmet from "helmet";
import { onRequest } from "firebase-functions/v2/https";
import authRouter, { signRouter } from "./routes/authRoutes";
import adminRouter from "./routes/adminRoutes";
import { runWeeklyBackup } from "./backup";

admin.initializeApp();

const app = express();
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────────
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
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

app.use(express.json({ limit: "1mb" }));

// ── Routes ────────────────────────────────────────────────────────────────────

app.use("/api/auth", authRouter);
app.use("/api/sign", signRouter);
app.use("/api/admin", adminRouter);

// ── Public counter ────────────────────────────────────────────────────────────
app.get("/api/counter", async (_req, res) => {
  try {
    const db = admin.firestore();
    const snap = await db.doc("stats/global").get();
    const total = snap.exists ? (snap.data()?.totalSignatures as number) ?? 0 : 0;
    return res.json({ success: true, totalSignatures: total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});

// ── Exports ───────────────────────────────────────────────────────────────────

export const api = onRequest({ region: "europe-west1" }, app);

// Weekly backup: v1 pubsub schedule so the Firebase emulator can load it
// without needing Cloud Scheduler API access. Behavior in production is
// identical: triggered every Monday at 00:00 Europe/Madrid time.
export const weeklyBackup = functionsV1.pubsub
  .schedule("every monday 00:00")
  .timeZone("Europe/Madrid")
  .onRun(async () => {
    await runWeeklyBackup();
  });
