# Talentra — Claude Code Guidelines

## Project
ATS (Applicant Tracking System). Turborepo monorepo with Bun workspaces.
Stack: Next.js 16 App Router (`apps/web`), Hono + oRPC (`apps/server`), better-auth (`packages/auth`), Drizzle ORM + PostgreSQL (`packages/db`), Tailwind CSS v4, shadcn/ui. Deployed to Cloudflare Workers via OpenNext + Alchemy.

## Monorepo Layout
```
talentra/
├── apps/
│   ├── web/          # Next.js 16, React 19, Tailwind v4, shadcn/ui
│   └── server/       # Hono + oRPC + better-auth handler
├── packages/
│   ├── api/          # oRPC router definitions (procedures + middleware)
│   ├── auth/         # better-auth config
│   ├── db/           # Drizzle schema + migrations + db client singleton
│   ├── env/          # t3-oss/env — server + web env validation
│   ├── config/       # Shared TS config
│   └── infra/        # Alchemy — Cloudflare infrastructure as code
```

## Engineering Preferences
- Pragmatic over perfect. Solve the problem at hand.
- Minimal abstractions. Extract only when a pattern appears 3+ times.
- Explicit over clever. Prefer clear names over comments.
- DRY in data-fetching and shared components. Not in one-off pages.
- No unnecessary files. Only create helpers/utils if used in 2+ places.

## Decision Style
1. Make the pragmatic call and proceed.
2. Briefly explain what you chose and why (1–2 sentences).
3. Only pause to ask if the decision is irreversible or high-impact (e.g. schema changes, major restructures).

## File Naming
**All files and folders: kebab-case. No exceptions.**

| Type | Example |
|---|---|
| Page | `apps/web/app/(dashboard)/jobs/page.tsx` |
| Layout | `apps/web/app/(dashboard)/layout.tsx` |
| Component | `jobs-table.tsx`, `kanban-board.tsx` |
| oRPC router | `packages/api/src/routers/jobs.ts` |
| DB schema | `packages/db/src/schema.ts` |
| Server entry | `apps/server/src/index.ts` |

## Next.js Rules
- Default to Server Components. Add `"use client"` only for state, effects, events, or browser APIs.
- Fetch data in Server Components by importing from `packages/db` directly — never call oRPC procedures from Server Components.
- Keep pages thin. Pages compose components, not business logic.
- Add `loading.tsx` and `error.tsx` at the route segment level.

## oRPC Rules
- Procedures live in `packages/api/src/routers/`. One file per domain (jobs, candidates, applications).
- Use `publicProcedure` for unauthenticated endpoints; `protectedProcedure` for auth-gated ones.
- All input validated with Zod via `@orpc/zod`. Never skip input validation on mutations.
- Client calls via `@orpc/tanstack-query` in `apps/web`. Never call fetch/axios directly for API calls.
- Throw `ORPCError` for expected errors (`NOT_FOUND`, `UNAUTHORIZED`, etc.) — don't return error objects.

```ts
// packages/api/src/routers/jobs.ts
export const jobsRouter = router({
  list: publicProcedure.handler(async () => {
    return db.select().from(jobs).orderBy(desc(jobs.createdAt))
  }),

  create: protectedProcedure
    .input(createJobSchema)
    .handler(async ({ input }) => {
      const [row] = await db.insert(jobs).values(input).returning()
      return row
    }),
})
```

## Drizzle Rules
- Never import `db` in client components or `apps/web` pages — server-only.
- Use query builder style (`db.select().from()...`). Raw SQL only if clearly simpler.
- No N+1 queries. Use joins or batched queries for lists with relations.
- `db` singleton lives in `packages/db/src/index.ts`. Never instantiate elsewhere.
- Schema in `packages/db/src/schema.ts`. Migrate with `drizzle-kit push`.

## Auth Rules
- better-auth is configured in `packages/auth`. Never re-implement auth logic.
- Session available in oRPC context via `auth.api.getSession()` — use `protectedProcedure` to gate routes.
- Never expose session data to client components directly — pass only what's needed as props.

## Component & UI Rules
- Use shadcn/ui for all base UI. Don't reinvent buttons, tables, dialogs.
- One component, one job. Split if it fetches + renders + submits.
- Co-locate components by feature inside `apps/web/components/`: `jobs/`, `candidates/`, `pipeline/`.
- Tailwind only. No `style={{}}` unless dynamic (e.g. kanban column widths).
- Semantic HTML. ARIA labels on icon-only buttons.

## Tooling
- Package manager: **Bun**. Never use npm or yarn.
- Linter/formatter: **Biome**. Never use ESLint or Prettier.
- Run tasks from the repo root via Turborepo: `bun run dev`, `bun run build`, `bun run lint`.

## Before Shipping a Feature
- [ ] No N+1 queries
- [ ] `"use client"` is actually needed
- [ ] No new object/array literals passed as props to expensive children
- [ ] `loading.tsx` exists for list and detail pages
- [ ] Mutations go through `protectedProcedure` if auth is required

## Code Review Flags
- Duplicate fetch logic → extract to `packages/db/` or `packages/api/`
- `any` type → replace with proper type or `unknown`
- oRPC mutation without Zod input schema → add it
- `db` imported in a client component or `apps/web` → move to server
- `fetch('/api/...')` in client code → replace with `@orpc/tanstack-query`

## Current Project
Full spec in `docs/prd.md`.

## Design
Refer to `docs/design.md` for spacing, layout, and component guidelines.
