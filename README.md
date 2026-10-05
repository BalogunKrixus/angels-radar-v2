# AngelsRadar

A curated startup-investor discovery and introduction platform for Africa, built per the AngelsRadar MVP PRD.

**Discover. Connect. Introduce.** Founders submit startup profiles, AngelsRadar admins review and approve them, approved investors discover and filter startups, and investors request introductions that AngelsRadar follows up on offline. The platform does not process investments, messaging, or payments.

## Stack

- **Next.js 16** (App Router, Server Actions, TypeScript)
- **Prisma 6** + Postgres
- **Auth.js (NextAuth v5)** — credentials + JWT sessions, role-based (`founder` / `investor` / `admin`)
- **Tailwind CSS 4**
- File storage for uploads (logos, pitch decks, avatars) served only through an authorization-checked route handler — nothing is under `/public`, so pitch decks are never publicly reachable by URL guessing. Locally this is a disk folder; in production it's Vercel Blob (selected automatically by the presence of `BLOB_READ_WRITE_TOKEN`), since a deployed serverless filesystem isn't writable at runtime.
- Email notifications via an abstraction that logs to the console in dev, and calls the Resend API when `RESEND_API_KEY` is set

## Getting started

You need a Postgres database (a free [Neon](https://neon.tech) or [Supabase](https://supabase.com) project both work, as does Vercel's own Postgres storage).

```bash
npm install
npx prisma migrate deploy   # create the schema
npm run db:seed             # load realistic dev data (marked isSeedData: true)
npm run dev
```

Visit `http://localhost:3000`. File uploads are stored on local disk in dev — no Blob token needed.

### Seeded dev accounts (password: `password123`)

- Admin: `admin@angelsradar.dev`
- Founders: `founder.greentech@angelsradar.dev`, `founder.paypoint@angelsradar.dev`, `founder.farmledger@angelsradar.dev`, `founder.mediconnect@angelsradar.dev` (pending), `founder.eduspark@angelsradar.dev` (changes requested), `founder.rejected@angelsradar.dev` (rejected), `founder.draft@angelsradar.dev` (draft)
- Investors: `investor.approved1@angelsradar.dev`, `investor.approved2@angelsradar.dev` (approved), `investor.pending@angelsradar.dev` (pending), `investor.changes@angelsradar.dev` (changes requested)

## Environment variables

See `.env.example`. At minimum you need `DATABASE_URL` (Postgres) and `AUTH_SECRET` (generate one with `openssl rand -base64 32`). Email works out of the box in dev with no external account; add `BLOB_READ_WRITE_TOKEN` + `BLOB_BASE_URL` only when deploying somewhere with a read-only filesystem.

## Deploying

Linked to Vercel, pushes build with `prisma migrate deploy && next build` (see `package.json`), so set `DATABASE_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN` and `BLOB_BASE_URL` as Production environment variables on the Vercel project before the first deploy.

## Project structure

- `src/app` — routes, grouped by role (`founder/`, `investor/`, `admin/`) plus public marketing-lite pages
- `src/lib/actions` — Server Actions (all mutations; permissions are re-checked server-side in every action, never only hidden in the UI)
- `src/lib/session.ts` — role-gated session helpers used by every protected page
- `src/proxy.ts` — coarse role-based route protection (defense in depth; the real checks are in the actions/pages)
- `src/components` — reusable UI primitives and feature components
- `prisma/schema.prisma` — data model
- `prisma/seed.ts` — dev seed data
