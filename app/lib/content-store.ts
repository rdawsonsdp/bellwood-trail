import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import { RESTAURANTS, type Restaurant } from "@/content/restaurants";
import { UPDATES, type Update } from "@/content/updates";

/**
 * Where the trail's content lives once /admin has saved it.
 *
 * - "blob": a Vercel Blob store (production). One JSON document holds every
 *   stop and update; photos are separate blobs. Writes carry the ETag they
 *   read, so two people saving at once cannot silently overwrite each other.
 * - "local": no Blob token on this machine, so saves go to .content/ and
 *   public/uploads/ (both git-ignored). Lets the admin be tried locally
 *   without touching production.
 * - "readonly": a production build with no store connected. The seed in
 *   content/ is served and the admin says it cannot save.
 *
 * Until the first save there is no document at all and the seed is served.
 */

export interface SiteContent { restaurants: Restaurant[]; updates: Update[] }
/** Content plus the version it was read at — pass the version back to save. */
export interface VersionedContent extends SiteContent { version: string }

export const CONTENT_TAG = "site-content";
const DOC = "content/site.json";
const LOCAL_DIR = path.join(process.cwd(), ".content");
const LOCAL_DOC = path.join(LOCAL_DIR, "site.json");
const SEED = "seed";

export class ConflictError extends Error {
  constructor() { super("Someone else saved changes since you opened this page. Reload to see them, then make your edit again."); }
}

export type StorageMode = "blob" | "local" | "readonly";
export function storageMode(): StorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return process.env.NODE_ENV === "production" ? "readonly" : "local";
}

const seed = (): VersionedContent => ({ restaurants: RESTAURANTS, updates: UPDATES, version: SEED });

/** Read straight from the store. The admin uses this so it always edits the latest copy. */
export async function readContent(): Promise<VersionedContent> {
  const mode = storageMode();
  if (mode === "blob") {
    const res = await get(DOC, { access: "public", useCache: false });
    if (!res || res.statusCode !== 200) return seed();
    const data = (await new Response(res.stream).json()) as SiteContent;
    return { restaurants: data.restaurants, updates: data.updates, version: res.blob.etag };
  }
  if (mode === "local") {
    try {
      const [raw, stat] = await Promise.all([fs.readFile(LOCAL_DOC, "utf8"), fs.stat(LOCAL_DOC)]);
      const data = JSON.parse(raw) as SiteContent;
      return { restaurants: data.restaurants, updates: data.updates, version: String(stat.mtimeMs) };
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return seed();
      throw e;
    }
  }
  return seed();
}

const cachedRead = unstable_cache(readContent, [CONTENT_TAG], { tags: [CONTENT_TAG] });

/** Read for the public page: cached until the next save expires CONTENT_TAG. */
export async function getContent(): Promise<SiteContent> {
  try {
    return await cachedRead();
  } catch (e) {
    // A store outage should not take the trail down — serve the seed for this request.
    console.error("[content-store] read failed, serving seed", e);
    return seed();
  }
}

/**
 * Save the whole document. `baseVersion` is the version the change was made
 * against; if the store has moved on since, throws ConflictError. The caller
 * (a Server Action) must then call updateTag(CONTENT_TAG).
 */
export async function writeContent(next: SiteContent, baseVersion: string): Promise<void> {
  const mode = storageMode();
  const body = JSON.stringify({ restaurants: next.restaurants, updates: next.updates }, null, 1);
  if (mode === "blob") {
    try {
      await put(DOC, body, {
        access: "public", contentType: "application/json", addRandomSuffix: false, cacheControlMaxAge: 60,
        ...(baseVersion === SEED ? { allowOverwrite: true } : { ifMatch: baseVersion }),
      });
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError) throw new ConflictError();
      throw e;
    }
    return;
  }
  if (mode === "local") {
    if ((await readContent()).version !== baseVersion) throw new ConflictError();
    await fs.mkdir(LOCAL_DIR, { recursive: true });
    await fs.writeFile(LOCAL_DOC, body);
    return;
  }
  throw new Error("Storage isn't connected, so changes can't be saved. Connect a Vercel Blob store to this project.");
}

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/gif": "gif" };
export const IMAGE_TYPES = Object.keys(EXT);
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Store a card photo and return the URL the card should use. */
export async function saveImage(data: Blob, slug: string): Promise<string> {
  const ext = EXT[data.type];
  if (!ext) throw new Error("Photos must be JPEG, PNG, WebP, AVIF or GIF.");
  if (data.size > MAX_IMAGE_BYTES) throw new Error("That photo is over 5 MB. Export it at about 1600 pixels wide and try again.");
  const name = `${slug}-${Date.now()}.${ext}`;
  const mode = storageMode();
  if (mode === "blob") {
    const blob = await put(`images/${name}`, data, { access: "public", contentType: data.type, addRandomSuffix: true });
    return blob.url;
  }
  if (mode === "local") {
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), Buffer.from(await data.arrayBuffer()));
    return `/uploads/${name}`;
  }
  throw new Error("Storage isn't connected, so photos can't be saved.");
}
