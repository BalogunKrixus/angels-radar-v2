import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { LinkButton } from "@/components/ui/Button";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect(`/${session.user.role}`);

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-28 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Discover. Connect. Introduce.
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            A curated network for African startups and investors.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-ink-soft">
            AngelsRadar connects approved investors with vetted African startups &mdash; a simple
            way to discover relevant opportunities and request an introduction.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <LinkButton href="/signup?role=investor" size="lg">
              I&apos;m an Investor
            </LinkButton>
            <LinkButton href="/signup?role=founder" variant="secondary" size="lg">
              I&apos;m a Founder
            </LinkButton>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
