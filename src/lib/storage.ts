import { mkdir, writeFile, unlink, stat } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Uploaded files live outside /public so nothing is reachable by guessing a
// URL — every read goes through an authorized route handler (see
// src/app/api/files/**). This is what makes pitch decks actually private
// rather than merely hidden from navigation.
const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

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

/** Saves an uploaded file under a random, non-guessable name and returns its storage-relative path. */
export async function saveUpload(kind: UploadKind, ownerId: string, file: File): Promise<string> {
  validateUpload(kind, file);
  const dir = path.join(UPLOAD_ROOT, kind);
  await mkdir(dir, { recursive: true });
  const filename = `${ownerId}-${crypto.randomBytes(8).toString("hex")}${extensionFor(file, kind)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return `${kind}/${filename}`;
}

export async function deleteUpload(storagePath: string) {
  try {
    await unlink(path.join(UPLOAD_ROOT, storagePath));
  } catch {
    // Already gone — nothing to clean up.
  }
}

export async function readUpload(storagePath: string): Promise<{ buffer: Buffer; size: number }> {
  const fullPath = path.join(UPLOAD_ROOT, storagePath);
  if (!fullPath.startsWith(UPLOAD_ROOT)) throw new UploadError("Invalid path");
  const info = await stat(fullPath);
  const { readFile } = await import("fs/promises");
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
