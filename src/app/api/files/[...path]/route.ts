import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readUpload, contentTypeFor } from "@/lib/storage";
import { canAccessStartup, canAccessAvatar } from "@/lib/file-access";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  if (!segments?.length || segments.some((s) => s.includes("..") || s.includes("/"))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const storagePath = segments.join("/");
  const kind = segments[0];

  let authorized = false;

  if (kind === "avatars") {
    authorized = await canAccessAvatar(storagePath);
  } else if (kind === "logos" || kind === "decks") {
    const startup = await prisma.startup.findFirst({
      where: kind === "logos" ? { logo: storagePath } : { pitchDeckPath: storagePath },
      select: { id: true },
    });
    if (!startup) return NextResponse.json({ error: "Not found" }, { status: 404 });
    authorized = await canAccessStartup(startup.id);
  } else {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { buffer } = await readUpload(storagePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentTypeFor(storagePath),
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
