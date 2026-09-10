import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * One shared password for /admin, from ADMIN_PASSWORD — never in the code or
 * the repo. A successful login sets a signed, httpOnly cookie good for twelve
 * hours. The signing key is derived from the password, so changing the
 * password signs everyone out. No accounts, so no per-person history.
 */

const COOKIE = "ccp_admin";
const TTL_SECONDS = 12 * 60 * 60;

const sha = (s: string) => createHash("sha256").update(s).digest();
const key = () => (process.env.ADMIN_PASSWORD ? sha(`ccp-admin-session:${process.env.ADMIN_PASSWORD}`) : null);
const sign = (payload: string, k: Buffer) => createHmac("sha256", k).update(payload).digest("base64url");

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export function passwordMatches(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  return Boolean(pw) && timingSafeEqual(sha(input), sha(pw!));
}

export async function startSession(): Promise<void> {
  const k = key(); if (!k) throw new Error("ADMIN_PASSWORD is not set.");
  const exp = String(Math.floor(Date.now() / 1000) + TTL_SECONDS);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp, k)}`, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/admin", maxAge: TTL_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).set(COOKIE, "", { path: "/admin", maxAge: 0 });
}

export async function isAdmin(): Promise<boolean> {
  const k = key(); if (!k) return false;
  const [exp, sig] = ((await cookies()).get(COOKIE)?.value ?? "").split(".");
  if (!exp || !sig || Number(exp) * 1000 < Date.now()) return false;
  const want = Buffer.from(sign(exp, k)), got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got);
}

/** Call at the top of every admin page AND every admin Server Action — actions are public endpoints. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
