// Weekly backup: copies the Firestore petitions collection (as JSON) and all
// Cloud Storage evidence files to a second bucket in a separate GCP project.
//
// Required env vars:
//   EVIDENCE_BUCKET_NAME   — primary evidence bucket
//   BACKUP_BUCKET_NAME     — target backup bucket (separate GCP project)
//
// The service account running this function needs storage.objects.create on
// the backup bucket. Grant it from the backup project's IAM console.

import * as admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";

export async function runWeeklyBackup(): Promise<void> {
  const evidenceBucketName = process.env.EVIDENCE_BUCKET_NAME;
  const backupBucketName = process.env.BACKUP_BUCKET_NAME;

  if (!evidenceBucketName || !backupBucketName) {
    throw new Error("EVIDENCE_BUCKET_NAME and BACKUP_BUCKET_NAME must be set");
  }

  const storage = getStorage();
  const evidenceBucket = storage.bucket(evidenceBucketName);
  const backupBucket = storage.bucket(backupBucketName);
  const db = admin.firestore();

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  // 1. Export petitions collection as JSON
  console.log("Backing up petitions collection...");
  const snap = await db.collection("petitions").orderBy("createdAt").get();
  const records = snap.docs.map((doc) => {
    const d = doc.data() as Record<string, unknown>;
    return {
      id: doc.id,
      ...d,
      createdAt:
        d.createdAt instanceof admin.firestore.Timestamp
          ? (d.createdAt as admin.firestore.Timestamp).toDate().toISOString()
          : null,
    };
  });

  const jsonContent = JSON.stringify(records, null, 2);
  await backupBucket
    .file(`petitions/${timestamp}/petitions.json`)
    .save(Buffer.from(jsonContent, "utf8"), { contentType: "application/json" });

  console.log(`Exported ${records.length} petition records.`);

  // 2. Copy evidence files from primary bucket to backup bucket
  console.log("Backing up evidence files...");
  const [files] = await evidenceBucket.getFiles({ prefix: "evidence/" });

  let copied = 0;
  for (const file of files) {
    try {
      await file.copy(backupBucket.file(`evidence/${timestamp}/${file.name}`));
      copied++;
    } catch (err) {
      // Log but don't abort — partial backups are better than none
      console.error(`Failed to copy ${file.name}:`, err);
    }
  }

  console.log(`Copied ${copied}/${files.length} evidence files.`);
}
