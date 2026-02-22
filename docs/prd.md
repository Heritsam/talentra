# Talentra — Product Requirements Document

**Version:** 1.1
**Date:** 2026-02-21
**Author:** heritsam (Ariq Heritsa Maalik)
**Status:** Draft

## Problem Statement

Recruitment teams manage job openings, candidate relationships, and hiring pipelines across disconnected tools — spreadsheets, email threads, and manual notes. This creates:

- Duplicate or stale candidate records with no single source of truth
- No clear visibility into where each candidate sits in the hiring process
- Slow, error-prone status updates that require manual coordination
- No way to query or filter candidates by skill, experience, or availability
- Difficulty answering basic questions like "how many candidates are in interview stage for Job X?"

Recruiters need a single, unified internal system that tracks the full lifecycle of a hiring process — from job posting through to hire or rejection — with secure access control and the ability to attach candidate resumes.

## Solution

Talentra is a lightweight internal Applicant Tracking System (ATS) that gives recruitment consultants a single place to:

- Sign in securely and access a private workspace
- Create and manage job openings
- Maintain a searchable candidate pool with resume attachments
- Track each candidate's progress through a structured hiring pipeline
- Visualize per-job application stages on a Kanban board
- See a real-time dashboard of hiring activity

Built as a fullstack monorepo (Turborepo + Bun) using Next.js 16 for the web app and Hono + oRPC for the API server — server-rendered for fast load times, with interactive pipeline management on the client.

## User Stories

### Authentication
1. As a recruitment consultant, I want to sign in with my email and password, so that only authorized users can access the system.
2. As a recruitment consultant, I want to be redirected to the login page if I'm not authenticated, so that candidate data is protected.
3. As a recruitment consultant, I want to sign out, so that I can securely end my session.
4. As a recruitment consultant, I want my session to persist across page refreshes, so that I don't have to log in repeatedly during a work session.

### Dashboard
5. As a recruitment consultant, I want to see the total number of open jobs, so that I know how many active roles I'm managing.
6. As a recruitment consultant, I want to see the total number of candidates in the system, so that I understand the size of my talent pool.
7. As a recruitment consultant, I want to see the count of active applications (excluding hired and rejected), so that I know how much pipeline activity is ongoing.
8. As a recruitment consultant, I want to see how many candidates are currently in the interview stage, so that I can prioritize my follow-ups.
9. As a recruitment consultant, I want to see a recent activity feed of the last 10 application updates, so that I can quickly catch up on what changed.
10. As a recruitment consultant, I want each activity entry to show the candidate name, job title, new status, and timestamp, so that the feed is meaningful at a glance.

### Job Management
11. As a recruitment consultant, I want to see a list of all job openings, so that I have an overview of all active and inactive roles.
12. As a recruitment consultant, I want each job listing to show the title, department, location, status, and applicant count, so that I can assess each role quickly.
13. As a recruitment consultant, I want to filter the jobs list by status (Open, Draft, Closed), so that I can focus on the roles I'm actively working.
14. As a recruitment consultant, I want to create a new job opening with a title, department, description, location, and status, so that I can start tracking candidates for a new role.
15. As a recruitment consultant, I want to open a job's detail page and see its full description and all applicants, so that I can review the role context and pipeline together.
16. As a recruitment consultant, I want to see a breakdown of applicants by stage on the job detail page, so that I understand the pipeline health for that role.
17. As a recruitment consultant, I want to update a job's status (e.g. Open → Closed), so that I can mark roles as no longer active without deleting them.
18. As a recruitment consultant, I want jobs to be sorted by most recently created by default, so that the newest roles appear first.

### Candidate Management
19. As a recruitment consultant, I want to see a list of all candidates in the system, so that I have a full view of my talent pool.
20. As a recruitment consultant, I want each candidate entry to show their name, email, skills, years of experience, and number of applications, so that I can assess candidates at a glance.
21. As a recruitment consultant, I want to search candidates by name or email, so that I can quickly find a specific person.
22. As a recruitment consultant, I want to filter candidates by skill, so that I can find people with a specific expertise.
23. As a recruitment consultant, I want to filter candidates by minimum years of experience, so that I can narrow the pool to qualified candidates.
24. As a recruitment consultant, I want to create a new candidate with their name, email, phone, skills, experience, and notes, so that I can add someone to the talent pool.
25. As a recruitment consultant, I want to upload a candidate's resume (PDF) when creating or editing their profile, so that I have their CV accessible directly in the system.
26. As a recruitment consultant, I want to view or download a candidate's resume from their profile page, so that I can review it before making hiring decisions.
27. As a recruitment consultant, I want skills to be displayed as tags on the candidate card, so that I can quickly scan their expertise.
28. As a recruitment consultant, I want to open a candidate's profile page and see all their details, so that I have full context before making a decision.
29. As a recruitment consultant, I want to see a candidate's full application history (job title + current status) on their profile, so that I know which roles they have been or are being considered for.
30. As a recruitment consultant, I want to edit a candidate's profile (skills, notes, contact info, resume), so that I can keep their record up to date.

### Application Pipeline — Kanban Board
31. As a recruitment consultant, I want to view a Kanban board for a specific job, so that I can see all candidates organized by hiring stage.
32. As a recruitment consultant, I want the Kanban board to have six columns: Applied, Screening, Interview, Offer, Hired, and Rejected, so that the full hiring lifecycle is visible.
33. As a recruitment consultant, I want each column to show a count badge, so that I can see how many candidates are in each stage at a glance.
34. As a recruitment consultant, I want each Kanban card to show the candidate's name and application date, so that I can identify who applied and when.
35. As a recruitment consultant, I want to drag a candidate card from one column to another to update their status, so that I can move candidates through the pipeline quickly.
36. As a recruitment consultant, I want the database to be updated immediately when I drag a card, so that the change is persisted without a manual save.
37. As a recruitment consultant, I want to click a candidate card to view their profile in a side panel or modal, so that I can review their details without leaving the Kanban view.
38. As a recruitment consultant, I want to see a notes preview on each card if notes exist, so that important context is visible in the pipeline view.

### Application Management
39. As a recruitment consultant, I want to add an existing candidate as an applicant from within a job's detail page, so that I can link candidates to roles without navigating away.
40. As a recruitment consultant, I want to apply a candidate to a job from their profile page, so that I can take action from either direction.
41. As a recruitment consultant, I want to add and edit notes on an application, so that I can record context about a candidate's progress on a specific role.
42. As a recruitment consultant, I want to manually change an application's status from a dropdown, so that I have an alternative to drag-and-drop on the Kanban board.

## Implementation Decisions

### Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + Bun workspaces |
| Package manager | Bun 1.3.0 |
| Framework | Next.js 16 (App Router) via `apps/web` |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Backend | Hono (`apps/server`) |
| API layer | oRPC type-safe RPC (`/rpc` prefix) |
| Database | PostgreSQL (self-managed) |
| ORM | Drizzle ORM (`packages/db`) |
| Authentication | better-auth (`packages/auth`) |
| Linting | Biome |
| Deployment | Cloudflare Workers (OpenNext + Alchemy) |

### Modules

**Authentication Module**
- better-auth handles sign-in, sign-out, and session management via `/api/auth/*` on the Hono server
- Session extracted via `auth.api.getSession()` in oRPC context for protected procedures
- Cookies: `sameSite=none`, `secure=true`, `httpOnly=true`
- Next.js middleware protects all dashboard routes — unauthenticated requests are redirected to `/login`

**Database Layer**
- Drizzle ORM schema defines all tables (`jobs`, `candidates`, `applications`) and enums (`job_status`, `app_status`)
- A singleton Drizzle client wraps the PostgreSQL connection (defined in `packages/db`). All queries go through this client
- A seed module populates the database with realistic demo data (5 jobs, 20 candidates, 30 applications across all statuses)

**File Storage Module**
- Resume file upload and storage deferred to v2 (Cloudflare R2 integration)

**API Layer (oRPC)**
- Procedures defined in `packages/api/src/routers/`, mounted on Hono at `/rpc`
- `publicProcedure` for unauthenticated endpoints; `protectedProcedure` (via `requireAuth` middleware) for auth-gated endpoints
- All input validated via Zod (integrated via `@orpc/zod`)
- Client calls via `@orpc/tanstack-query` in the web app
- OpenAPI docs auto-generated at `/api-reference`
- Server Components query the database directly via the Drizzle client — they do not go through oRPC

**UI Layer**
- Pages are Server Components by default; interactive pieces (modals, Kanban board, file upload) are Client Components
- Dashboard aggregates four DB counts in a single server-rendered pass
- Candidates list supports server-side search and filter via query params (`?search=&skill=&minExp=`)
- Kanban board is a Client Component with optimistic UI on drag-and-drop

**Component Structure**
- Feature-scoped component folders inside `apps/web/components/`: `jobs/`, `candidates/`, `pipeline/`
- shadcn/ui for all base primitives (Button, Badge, Card, Dialog, Table, etc.)
- Sidebar navigation is a shared layout component in the dashboard route group

### Schema
- Three tables: `jobs`, `candidates`, `applications` (defined in `packages/db/src/schema.ts`)
- `candidates.skills` uses a PostgreSQL native text array
- `candidates.resume_url` deferred to v2
- `applications` enforces a unique (jobId, candidateId) pair — a candidate cannot apply to the same job twice
- `applications.updated_at` is updated on every status/notes change

### API Contracts (oRPC Procedures)
- Procedures live in `packages/api/src/routers/`
- `candidates.list` accepts `{ search?, skill?, minExp? }` input
- `applications.updateStatus` accepts `{ id, status?, notes? }` — either or both fields
- All procedures return typed objects; not-found cases throw `ORPCError` with `NOT_FOUND` code
- Public procedures: no auth required; protected procedures: require active session via `requireAuth` middleware

### Architectural Decisions
- Turborepo monorepo splits web (Next.js) and server (Hono) into separate apps, with shared packages for db, auth, api, and env validation
- better-auth over Supabase Auth — self-managed, works with any PostgreSQL instance, avoids vendor lock-in
- oRPC over REST Route Handlers — end-to-end type safety without codegen; client types derived directly from server router
- Drizzle ORM — SQL-first, no code generation step, lighter runtime
- Cloudflare Workers deployment via OpenNext + Alchemy for edge performance and infrastructure-as-code

## Testing Decisions

### What Makes a Good Test
- Tests verify **external behavior**, not implementation details
- A test should remain valid even if internal implementation is refactored
- Prefer integration-style tests for the API layer — test the full request/response cycle against a real test database

### Procedure Tests
- Test all oRPC procedures: jobs, candidates, applications (list, create, update)
- Use a local PostgreSQL instance with seeded data
- Assertions: correct response shape, DB side effects, and error codes
- Test error paths: invalid input (Zod → `INPUT_VALIDATION_FAILED`), missing resource (→ `NOT_FOUND`), unauthenticated (→ `UNAUTHORIZED`)

### Component Tests
- Test Kanban board drag-and-drop: simulate a drag, assert the oRPC `applications.updateStatus` procedure was called with the correct status
- Test candidates table search/filter: render with mock data, type in search box, assert correct rows shown
- Test form validation in create modals: submit empty form, assert error messages appear
- Use React Testing Library — assert on what the user sees, not component internals

## Out of Scope

- **Multi-tenancy** — single shared workspace; no per-user data isolation
- **Email notifications** — no alerts on status changes
- **AI-powered features** — no candidate scoring or job matching
- **Mobile-optimized layout** — desktop-first (1280px+); mobile is best-effort
- **Audit log** — no history of who changed what
- **Cloudflare D1 or R2 integration** — deferred to v2; resume storage not included in v1

## Further Notes

- This project is built as an interview showcase for a Full Stack Developer role at Anradus, a Singapore-based recruitment/staffing firm. The ATS concept directly mirrors Anradus's core business.
- The Turborepo monorepo structure demonstrates awareness of modern fullstack architecture — separating concerns (web, server, api, auth, db) while sharing types end-to-end without codegen.
- oRPC was chosen over REST to showcase type-safe RPC patterns that are gaining traction as an alternative to tRPC, with built-in OpenAPI generation as a bonus.
- The Kanban pipeline board is the primary showcase feature — it demonstrates real-time UI interaction, optimistic updates, and API integration in a way that's immediately understandable to a non-technical interviewer.
- Future roadmap talking points: Cloudflare R2 for resume storage, email notifications, full-text candidate search with PostgreSQL `tsvector`, a reporting dashboard for time-to-hire metrics, and multi-user isolation via better-auth organizations.
