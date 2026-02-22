# Talentra

A lightweight internal Applicant Tracking System (ATS) for managing job openings, candidate pipelines, and hiring workflows — built as a fullstack Turborepo monorepo.

## What This Does

Recruitment teams often manage hiring across disconnected tools — spreadsheets, email threads, and manual notes. Talentra consolidates the full hiring lifecycle into a single internal tool: post jobs, build a searchable candidate pool, and move applicants through a structured pipeline via a drag-and-drop Kanban board.

Built as a fullstack showcase project to demonstrate modern architecture patterns — server-first rendering, end-to-end type safety without codegen, and a polished interactive UI.

## Features

- **Dashboard** — real-time stats (open jobs, candidates, active applications, interviews) + 30-day application trend chart + stale pipeline alerts + recent activity feed
- **Job management** — create jobs, filter by status (Open / Draft / Closed), view per-job applicant breakdown by stage
- **Candidate pool** — searchable and filterable by name, skill, and minimum years of experience
- **Kanban pipeline** — per-job drag-and-drop board across 6 stages (Applied → Screening → Interview → Offer → Hired → Rejected) with optimistic updates
- **Auth** — email/password sign-in via better-auth, server-side session gating on all dashboard routes, protected write procedures at the API layer

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Monorepo | Turborepo + Bun workspaces | Shared packages, fast parallel builds |
| Framework | Next.js 16 (App Router) | Server Components for fast SSR, minimal client JS |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first with a component baseline |
| Server | Hono | Lightweight, edge-compatible request handler |
| API | oRPC + `@orpc/tanstack-query` | End-to-end type safety without codegen; built-in OpenAPI generation |
| Database | PostgreSQL + Drizzle ORM | SQL-first ORM, explicit queries, no runtime magic |
| Auth | better-auth | Self-managed sessions, works with any PostgreSQL instance |
| Deployment | Cloudflare Workers (OpenNext + Alchemy) | Edge deployment with infrastructure-as-code |
| Linting | Biome | Single tool for formatting and linting |

## Project Structure

```
talentra/
├── apps/
│   ├── web/          # Next.js 16 — App Router, Tailwind v4, shadcn/ui
│   └── server/       # Hono — oRPC router + better-auth handler
├── packages/
│   ├── api/          # oRPC procedures (jobs, candidates, applications)
│   ├── auth/         # better-auth config
│   ├── db/           # Drizzle schema, migrations, db singleton
│   ├── env/          # t3-oss/env — validated env vars for web + server
│   ├── config/       # Shared TypeScript config
│   └── infra/        # Alchemy — Cloudflare infrastructure as code
```

## Getting Started

**Prerequisites:** [Bun](https://bun.sh) 1.3.0+ and a PostgreSQL database.

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

**`apps/server/.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/talentra
BETTER_AUTH_SECRET=<random string, min 32 chars>
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
```

**`apps/web/.env`**
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/talentra
BETTER_AUTH_SECRET=<same secret as server>
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Push the database schema

```bash
bun run db:push
```

### 4. Start the dev servers

```bash
bun run dev
```

- Web app → [http://localhost:3001](http://localhost:3001)
- API server → [http://localhost:3000](http://localhost:3000)
- OpenAPI reference → [http://localhost:3000/api-reference](http://localhost:3000/api-reference)

## How It Works

**Data fetching split by context** — Server Components call the oRPC router directly via a server-side client (no HTTP round-trip). Client Components (modals, Kanban board) call over HTTP through `@orpc/tanstack-query`, sharing the same router types. No `fetch('/api/...')` anywhere.

**Auth as a real boundary** — The `(dashboard)` layout is an `async` Server Component that calls `auth.api.getSession()` on every request. No session → redirect to `/login`. All write procedures (`create`, `updateStatus`) are wrapped in `protectedProcedure` so unauthenticated API calls get `UNAUTHORIZED` at the RPC layer, not just the UI.

**Kanban with optimistic updates** — `@dnd-kit` handles drag interaction. On drop, local state updates immediately, then `applications.updateStatus` fires in the background. On error, state reverts to the pre-drag snapshot.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start all apps in development mode |
| `bun run build` | Build all apps |
| `bun run check-types` | TypeScript type check across all packages |
| `bun run db:push` | Push schema changes to the database |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:generate` | Generate migration files |
| `bun run check` | Biome format + lint (auto-fix) |
| `bun run deploy` | Deploy to Cloudflare via Alchemy |

## Roadmap

- [ ] Resume upload and storage (Cloudflare R2)
- [ ] Edit candidate profiles and application notes
- [ ] Full-text candidate search with PostgreSQL `tsvector`
- [ ] Email notifications on status change
- [ ] Time-to-hire reporting dashboard
