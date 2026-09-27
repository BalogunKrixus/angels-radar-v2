export function fileUrl(storagePath: string | null | undefined): string | null {
  return storagePath ? `/api/files/${storagePath}` : null;
}
