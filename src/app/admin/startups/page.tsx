import Link from "next/link";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { STARTUP_STATUSES, statusLabel } from "@/lib/constants";

const PAGE_SIZE = 20;

export default async function AdminStartupsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  await requireRole("admin");
  const { status, q, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { industry: { contains: q } },
            { country: { contains: q } },
          ],
        }
      : {}),
  };

  const [startups, total] = await Promise.all([
    prisma.startup.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { founder: { include: { user: true } } },
    }),
    prisma.startup.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    params.set("page", String(p));
    return `/admin/startups?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Startups</h1>
      </div>

      <form className="flex flex-wrap items-end gap-3">
        <div className="w-48">
          <Select name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {STARTUP_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-64">
          <Input name="q" placeholder="Search name, industry, country" defaultValue={q ?? ""} />
        </div>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
        {(status || q) && (
          <Link href="/admin/startups" className="text-sm text-ink-soft hover:text-ink">
            Clear
          </Link>
        )}
      </form>

      {startups.length === 0 ? (
        <EmptyState
          title="No startups found"
          description="Try a different search or clear your filters."
        />
      ) : (
        <>
          <Table>
            <Thead>
              <Th>Name</Th>
              <Th>Founder</Th>
              <Th>Industry</Th>
              <Th>Country</Th>
              <Th>Status</Th>
              <Th>Submitted</Th>
            </Thead>
            <Tbody>
              {startups.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    <Link href={`/admin/startups/${s.id}`} className="font-medium text-ink hover:text-accent">
                      {s.name}
                    </Link>
                  </Td>
                  <Td>{s.founder.user.email}</Td>
                  <Td>{s.industry}</Td>
                  <Td>{s.country}</Td>
                  <Td>
                    <StatusBadge status={s.status} />
                  </Td>
                  <Td>{s.submittedAt ? s.submittedAt.toLocaleDateString() : "—"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
        </>
      )}
    </div>
  );
}
