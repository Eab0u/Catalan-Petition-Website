// Admin endpoints — require a valid Firebase Auth ID token with the admin
// custom claim set to true, OR a UID listed in the ADMIN_UIDS env var.
//
// To grant admin access to a user (run once in Cloud Shell or locally):
//   firebase auth:export doesn't work; use the Admin SDK or Firebase Console.
//   Programmatically:
//     admin.auth().setCustomUserClaims(uid, { admin: true })
//
// Alternatively, add the UID to the ADMIN_UIDS comma-separated env var.

import express from "express";
import * as admin from "firebase-admin";

const router = express.Router();

async function verifyAdmin(req: express.Request, res: express.Response): Promise<string | null> {
  const authHeader = req.headers.authorization ?? "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    res.status(401).json({ error: "Missing auth token" });
    return null;
  }

  let decoded: admin.auth.DecodedIdToken;
  try {
    decoded = await admin.auth().verifyIdToken(match[1]);
  } catch {
    res.status(401).json({ error: "Invalid auth token" });
    return null;
  }

  const adminUids = (process.env.ADMIN_UIDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const isAdmin = decoded.admin === true || adminUids.includes(decoded.uid);
  if (!isAdmin) {
    res.status(403).json({ error: "Admin only" });
    return null;
  }

  return decoded.uid;
}

// GET /api/admin/export.csv
// Streams a CSV of all petition records. Excludes internal hash fields.
router.get("/export.csv", async (req, res) => {
  const uid = await verifyAdmin(req, res);
  if (!uid) return;

  try {
    const db = admin.firestore();
    const snap = await db.collection("petitions").orderBy("createdAt").get();

    const headers = [
      "nom",
      "cognom1",
      "cognom2",
      "nif",
      "assuranceLevel",
      "method",
      "signatureCode",
      "evidencePath",
      "createdAt",
    ];

    const escape = (v: unknown): string => {
      const s = v == null ? "" : String(v);
      // Wrap in quotes if the value contains a comma, quote, or newline
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="peticions-${Date.now()}.csv"`
    );

    res.write(headers.join(",") + "\n");

    snap.forEach((doc) => {
      const d = doc.data() as Record<string, unknown>;
      const createdAt =
        d.createdAt instanceof admin.firestore.Timestamp
          ? (d.createdAt as admin.firestore.Timestamp).toDate().toISOString()
          : "";

      const row = [
        escape(d.nom),
        escape(d.cognom1),
        escape(d.cognom2),
        escape(d.nif),
        escape(d.assuranceLevel),
        escape(d.method),
        escape(d.signatureCode),
        escape(d.evidencePath),
        escape(createdAt),
      ].join(",");
      res.write(row + "\n");
    });

    res.end();
  } catch (err) {
    console.error("export.csv error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
