import Link from "next/link";
import type { Startup } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { labelFor, STAGES } from "@/lib/constants";
import { fileUrl } from "@/lib/file-url";

export function StartupCard({ startup }: { startup: Startup }) {
  const amount =
    startup.amountRaising != null ? `${startup.currency} ${startup.amountRaising.toLocaleString()}` : null;
  const logoUrl = fileUrl(startup.logo);

  return (
    <Link href={`/investor/startups/${startup.id}`}>
      <Card className="h-full transition-colors hover:border-accent/40">
        <div className="flex items-start gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-12 w-12 rounded-lg object-cover border border-border" />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-paper border border-border flex items-center justify-center font-semibold text-ink-soft">
              {startup.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-ink">{startup.name}</h3>
            <p className="mt-0.5 line-clamp-2 text-sm text-ink-soft">{startup.tagline}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
          <Meta>{startup.industry}</Meta>
          <Meta>{startup.country}</Meta>
          <Meta>{labelFor(startup.stage, STAGES)}</Meta>
          {amount && <Meta>{amount}</Meta>}
        </div>
      </Card>
    </Link>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-paper border border-border px-2.5 py-0.5 text-ink-soft">
      {children}
    </span>
  );
}
