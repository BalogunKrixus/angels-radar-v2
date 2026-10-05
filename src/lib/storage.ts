import { mkdir, writeFile, unlink, stat, readFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Uploaded files are never reachable by guessing a URL — every read goes
// through an authorized route handler (see src/app/api/files/**). This is
// what makes pitch decks actually private rather than merely hidden from
// navigation.
//
// Locally (no BLOB_READ_WRITE_TOKEN) files live on disk outside /public.
// On Vercel, the filesystem is read-only at runtime, so uploads go to
// Vercel Blob instead — selected automatically by the presence of that
// token, no other code needs to know which backend is active.
//
// Either way, the value stored in the database (and used in the public
// /api/files/<storagePath> URL) is always the same short "kind/name.ext"
// key — never a full Blob URL — so the authorized route handler's path
// matching and the DB lookups it does stay identical across backends.
// BLOB_BASE_URL is the store's own public base (e.g.
// https://<id>.public.blob.vercel-storage.com), used to turn that key
// back into a fetchable URL.
const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_BASE_URL = process.env.BLOB_BASE_URL?.replace(/\/$/, "");

export type UploadKind = "logos" | "decks" | "avatars";

const MAX_SIZES: Record<UploadKind, number> = {
  logos: 5 * 1024 * 1024,
  avatars: 5 * 1024 * 1024,
  decks: 20 * 1024 * 1024,
};

const ALLOWED_TYPES: Record<UploadKind, string[]> = {
  logos: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
  avatars: ["image/png", "image/jpeg", "image/webp"],
  decks: ["application/pdf"],
};

export class UploadError extends Error {}

export function validateUpload(kind: UploadKind, file: File) {
  if (file.size > MAX_SIZES[kind]) {
    throw new UploadError(
      kind === "decks"
        ? "Your pitch deck could not be uploaded. Please check that it is a PDF under 20MB and try again."
        : "That file is too large. Please upload an image under 5MB."
    );
  }
  if (!ALLOWED_TYPES[kind].includes(file.type)) {
    throw new UploadError(
      kind === "decks"
        ? "Your pitch deck could not be uploaded. Please check that it is a PDF and try again."
        : "Please upload a PNG, JPEG or WEBP image."
    );
  }
}

function extensionFor(file: File, kind: UploadKind): string {
  if (kind === "decks") return ".pdf";
  const map: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
  };
  return map[file.type] ?? "";
}

function blobUrlFor(storagePath: string): string {
  if (!BLOB_BASE_URL) throw new UploadError("BLOB_BASE_URL is not configured");
  return `${BLOB_BASE_URL}/${storagePath}`;
}

/** Saves an uploaded file under a random, non-guessable name and returns its storage key ("kind/name.ext" — resolved against disk or Blob depending on the environment). */
export async function saveUpload(kind: UploadKind, ownerId: string, file: File): Promise<string> {
  validateUpload(kind, file);
  const filename = `${ownerId}-${crypto.randomBytes(8).toString("hex")}${extensionFor(file, kind)}`;
  const key = `${kind}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (USE_BLOB) {
    const { put } = await import("@vercel/blob");
    await put(key, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });
    return key;
  }

  const dir = path.join(UPLOAD_ROOT, kind);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return key;
}

export async function deleteUpload(storagePath: string) {
  try {
    if (USE_BLOB) {
      const { del } = await import("@vercel/blob");
      await del(blobUrlFor(storagePath));
      return;
    }
    await unlink(path.join(UPLOAD_ROOT, storagePath));
  } catch {
    // Already gone — nothing to clean up.
  }
}

export async function readUpload(storagePath: string): Promise<{ buffer: Buffer; size: number }> {
  if (USE_BLOB) {
    const response = await fetch(blobUrlFor(storagePath));
    if (!response.ok) throw new UploadError("Not found");
    const buffer = Buffer.from(await response.arrayBuffer());
    return { buffer, size: buffer.length };
  }

  const fullPath = path.join(UPLOAD_ROOT, storagePath);
  if (!fullPath.startsWith(UPLOAD_ROOT)) throw new UploadError("Invalid path");
  const info = await stat(fullPath);
  const buffer = await readFile(fullPath);
  return { buffer, size: info.size };
}

export function contentTypeFor(storagePath: string): string {
  if (storagePath.endsWith(".pdf")) return "application/pdf";
  if (storagePath.endsWith(".png")) return "image/png";
  if (storagePath.endsWith(".webp")) return "image/webp";
  if (storagePath.endsWith(".svg")) return "image/svg+xml";
  return "image/jpeg";
}
