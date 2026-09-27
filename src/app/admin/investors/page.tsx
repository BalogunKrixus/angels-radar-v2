import Link from "next/link";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { INVESTOR_STATUSES, statusLabel, labelFor, INVESTOR_TYPES } from "@/lib/constants";

const PAGE_SIZE = 20;

export default async function AdminInvestorsPage({
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
            { fullName: { contains: q } },
            { organisation: { contains: q } },
            { country: { contains: q } },
          ],
        }
      : {}),
  };

  const [investors, total] = await Promise.all([
    prisma.investorProfile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: true },
    }),
    prisma.investorProfile.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    params.set("page", String(p));
    return `/admin/investors?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Investors</h1>

      <form className="flex flex-wrap items-end gap-3">
        <div className="w-48">
          <Select name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {INVESTOR_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-64">
          <Input name="q" placeholder="Search name, organisation, country" defaultValue={q ?? ""} />
        </div>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
        {(status || q) && (
          <Link href="/admin/investors" className="text-sm text-ink-soft hover:text-ink">
            Clear
          </Link>
        )}
      </form>

      {investors.length === 0 ? (
        <EmptyState title="No investors found" description="Try a different search or clear your filters." />
      ) : (
        <>
          <Table>
            <Thead>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Type</Th>
              <Th>Country</Th>
              <Th>Status</Th>
            </Thead>
            <Tbody>
              {investors.map((inv) => (
                <Tr key={inv.id}>
                  <Td>
                    <Link href={`/admin/investors/${inv.id}`} className="font-medium text-ink hover:text-accent">
                      {inv.fullName || "(no name yet)"}
                    </Link>
                  </Td>
                  <Td>{inv.user.email}</Td>
                  <Td>{labelFor(inv.investorType, INVESTOR_TYPES)}</Td>
                  <Td>{inv.country}</Td>
                  <Td>
                    <StatusBadge status={inv.status} />
                  </Td>
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
