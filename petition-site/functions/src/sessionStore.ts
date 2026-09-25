// Short-lived Firestore sessions that hold OAuth state and access tokens
// between the browser redirect hops. Sessions expire after 30 minutes.

import * as admin from "firebase-admin";
import { UserInfo } from "./validClient";

const SESSION_TTL_MS = 30 * 60 * 1000;

export interface Session {
  state: string;
  createdAt: number;
  expiresAt: number;
  consent: boolean;
  accessToken?: string;
  userInfo?: UserInfo;
  signatureCode?: string;
  status: "pending_auth" | "pending_sign" | "completed" | "error";
}

function col(): admin.firestore.CollectionReference {
  return admin.firestore().collection("sessions");
}

export async function createSession(state: string, consent: boolean): Promise<void> {
  const now = Date.now();
  const session: Session = {
    state,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    consent,
    status: "pending_auth",
  };
  await col().doc(state).set(session);
}

export async function getSession(state: string): Promise<Session | null> {
  const snap = await col().doc(state).get();
  if (!snap.exists) return null;

  const session = snap.data() as Session;
  if (Date.now() > session.expiresAt) {
    await col().doc(state).delete();
    return null;
  }
  return session;
}

export async function updateSession(
  state: string,
  updates: Partial<Session>
): Promise<void> {
  await col().doc(state).update(updates as admin.firestore.UpdateData<Session>);
}

export async function getSessionBySignatureCode(
  signatureCode: string
): Promise<Session | null> {
  const snap = await col()
    .where("signatureCode", "==", signatureCode)
    .limit(1)
    .get();

  if (snap.empty) return null;

  const session = snap.docs[0].data() as Session;
  if (Date.now() > session.expiresAt) {
    await col().doc(session.state).delete();
    return null;
  }
  return session;
}

export async function deleteSession(state: string): Promise<void> {
  await col().doc(state).delete();
}
