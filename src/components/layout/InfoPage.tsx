import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-soft">{children}</div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
