import Link from "next/link";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Alert } from "@/components/ui/Alert";
import { updateIntroductionStatusAction } from "@/lib/actions/admin.actions";
import { INTRO_STATUSES, statusLabel } from "@/lib/constants";

const PAGE_SIZE = 20;

export default async function AdminIntroductionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; updated?: string }>;
}) {
  await requireRole("admin");
  const { status, page: pageParam, updated } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const where = status ? { status } : {};

  const [requests, total] = await Promise.all([
    prisma.introductionRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { investor: { include: { user: true } }, startup: true },
    }),
    prisma.introductionRequest.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("page", String(p));
    return `/admin/introductions?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Introduction Requests</h1>
      {updated && <Alert tone="success">Status updated.</Alert>}

      <div className="flex gap-2">
        {[{ label: "All", value: "" }, ...INTRO_STATUSES.map((s) => ({ label: statusLabel(s), value: s }))].map(
          (tab) => (
            <Link
              key={tab.label}
              href={tab.value ? `/admin/introductions?status=${tab.value}` : "/admin/introductions"}
              className={`rounded-full border px-3 py-1 text-sm ${
                (status ?? "") === tab.value
                  ? "border-accent bg-accent text-white"
                  : "border-border text-ink-soft hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          )
        )}
      </div>

      {requests.length === 0 ? (
        <EmptyState title="No introduction requests" description="Nothing here yet." />
      ) : (
        <>
          <Table>
            <Thead>
              <Th>Investor</Th>
              <Th>Organisation</Th>
              <Th>Startup</Th>
              <Th>Date requested</Th>
              <Th>Status</Th>
            </Thead>
            <Tbody>
              {requests.map((r) => (
                <Tr key={r.id}>
                  <Td>
                    <p className="font-medium text-ink">{r.investor.fullName}</p>
                    <p className="text-xs text-ink-soft">{r.investor.user.email}</p>
                  </Td>
                  <Td>{r.investor.organisation || "—"}</Td>
                  <Td>
                    <Link href={`/admin/startups/${r.startup.id}`} className="text-ink hover:text-accent">
                      {r.startup.name}
                    </Link>
                  </Td>
                  <Td>{r.createdAt.toLocaleDateString()}</Td>
                  <Td>
                    <form action={updateIntroductionStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="introId" value={r.id} />
                      <Select name="status" defaultValue={r.status} className="!py-1.5 !text-xs w-32">
                        {INTRO_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {statusLabel(s)}
                          </option>
                        ))}
                      </Select>
                      <SubmitButton size="sm" variant="secondary" pendingText="…">
                        Update
                      </SubmitButton>
                    </form>
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
