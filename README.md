# ClientFlow

ClientFlow is a client and project management workspace for freelancers and small agencies. It replaces the usual sprawl of spreadsheets, sticky notes, and half-remembered email threads with one place to see every client, every project, and everything that needs attention today.

## The problem

Once a freelancer or small studio has more than a couple of active clients, the same questions get harder to answer: *Which projects are actually behind? What's due this week? Which client hasn't heard from me in a while?* That information usually lives scattered across tools that don't talk to each other. ClientFlow keeps clients, projects, and tasks in one connected system, and puts "what needs my attention right now" on the front page instead of making you go find it.

## Main features

- **Dashboard** built around one question — what needs my attention — with a "My Work" panel that automatically sorts open tasks into Overdue / Due Today / Upcoming, plus active-client and active-project counts, upcoming deadlines, recently updated projects, and two small charts (projects by status, task completion over the last 8 weeks).
- **Clients** — searchable, filterable client list; full CRUD; a client detail page showing that client's active projects and recent tasks.
- **Projects** — searchable, filterable (status, priority) project list; full CRUD; a project detail page with a progress bar, completed/remaining task counts, the project's task list, and a derived recent-activity feed.
- **Tasks** — a dedicated task workspace with search and filtering by status, priority, and project; inline complete/reopen; full CRUD.
- **Auth** — email/password sign up and sign in via Supabase Auth, with every table gated by Row Level Security so users only ever see their own data.
- **Settings** — update display name and password, sign out.

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Server state | TanStack Query (caching, loading/error states, mutations, cache invalidation) |
| Backend | Supabase (Postgres, Auth, Row Level Security) |
| Charts | Recharts |
| Icons | Lucide React |
| Dates | date-fns |

No form library, animation library, or component kit — forms are plain controlled React state with small validation helpers, and every UI primitive (buttons, inputs, modals, tables, badges, toasts) is hand-built in `src/components/ui`. That's a deliberate choice for a portfolio piece: it demonstrates the fundamentals rather than a library's defaults.

## Architecture overview

```
src/
  api/            Thin Supabase query functions — one file per entity, no UI concerns
  hooks/          TanStack Query hooks (useClients, useProjects, useTasks, useDashboardData…)
  context/        AuthContext (session) and ToastContext (notifications)
  components/
    ui/           Reusable primitives: Button, Input, Select, Modal, Badge, EmptyState,
                   ErrorState, Skeleton, PageHeader, ConfirmDialog, RowMenu…
    layout/       AppLayout, Sidebar, MobileNav, AuthLayout, ProtectedRoute
    clients/      Client-specific form + table
    projects/     Project-specific form + table
    tasks/        Task-specific form + list
    dashboard/    Dashboard-only presentational pieces (My Work, charts, stat row…)
  pages/          One file per route, composing hooks + components
  lib/            supabase client, query client + query keys, status/priority metadata,
                   date/formatting utils, validation helpers, chart color mapping
  types/          Shared Client / Project / Task / AppUser types
```

Data access is intentionally layered: **`api/*`** knows about Supabase and nothing else; **`hooks/*`** wraps that in TanStack Query for caching, loading/error state, and mutation + invalidation; **`pages/*`** and **`components/*`** never call Supabase directly. This keeps presentation components dumb and testable, and means swapping the backend later would only touch the `api/` layer.

The dashboard's numbers (active counts, overdue tasks, "My Work" groupings, chart data) are all derived client-side in `hooks/useDashboardData.ts` from the same cached clients/projects/tasks queries the rest of the app uses — no separate aggregation endpoint, and no risk of the dashboard drifting out of sync with the list pages.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql). It creates the `clients`, `projects`, and `tasks` tables, an `updated_at` trigger, and Row Level Security policies scoping every row to `auth.uid()`.
3. (Optional) Seed demo data: sign up for an account in the running app, copy that user's UUID from **Authentication → Users**, paste it into the `v_user_id` placeholder at the top of [`supabase/seed.sql`](supabase/seed.sql), and run that script. It creates 5 fictional clients, 7 projects, and ~24 tasks with dates generated relative to "now," so the dashboard's overdue/due-today/upcoming logic looks correct immediately.
4. Copy your project's **URL** and **anon public key** from **Settings → API** into `.env` (see below). Never use the `service_role` key in the frontend — RLS is what keeps the anon key safe to ship to the browser.

## Environment variables

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## Running locally

```bash
npm install
npm run dev
```

Then sign up for an account from the running app (Supabase Auth handles email confirmation according to your project's auth settings) and, optionally, run the seed script described above.

Other scripts:

```bash
npm run build     # type-check (tsc -b) + production build
npm run lint       # oxlint
npm run preview    # preview the production build locally
```

## Database schema

**clients** — `id, user_id, name, company, email, phone, status (active | inactive | lead), notes, created_at, updated_at`

**projects** — `id, user_id, client_id → clients, name, description, status (planning | in_progress | review | completed), priority (low | medium | high), start_date, deadline, progress (0–100), created_at, updated_at`

**tasks** — `id, user_id, project_id → projects, title, description, status (todo | in_progress | done), priority (low | medium | high), due_date, completed_at, created_at, updated_at`

Every table has `user_id` and a matching RLS policy (`select`/`insert`/`update`/`delete`, all gated on `auth.uid() = user_id`), so a query never needs to filter by user manually to stay safe — it's enforced at the database layer even if the frontend had a bug.

## Key frontend decisions

- **TanStack Query as the single source of truth for server state.** Query keys are centralized in `lib/queryClient.ts` so cache invalidation after a mutation (e.g. creating a task invalidates both the flat task list and that task's project-scoped list) stays consistent instead of being re-derived ad hoc in every mutation.
- **Derived dashboard, not a duplicated one.** Rather than a separate "dashboard API," the dashboard reuses the exact same `useClients` / `useProjects` / `useTasks` queries as the list pages and computes stats/groupings with `useMemo`. One cache, one source of truth, less to keep in sync.
- **Progress is an explicit field, task completion is a derived count.** A project's `progress` is a value the freelancer sets deliberately (a project can be "70% done" without exactly 70% of tasks checked off), while "12 of 18 tasks complete" is always computed live from the tasks table. Conflating the two would have been simpler but less honest to how freelance work actually gets estimated.
- **Responsive tables become stacked lists, not scroll boxes.** Every data table (`ClientsTable`, `ProjectsTable`) renders a real `<table>` at `md+` and a distinct card-list layout below it — the mobile view was designed, not produced by `overflow-x: auto`.
- **No toast or form library.** A small `ToastContext` and small `required`/`isValidEmail` validation helpers cover everything the app needs without pulling in a dependency whose defaults would otherwise shape the UI.

## Challenges solved

- **Keeping "My Work" honest.** The dashboard's Overdue/Due Today/Upcoming grouping had to use the same due-date logic as the badges shown elsewhere (task rows, project deadlines), so `lib/utils.ts` centralizes `isOverdue` / `isDueToday` / `isDueThisWeek` / `dueDateLabel` — one definition of "overdue," used everywhere.
- **Mutations that touch two caches.** Tasks are cached both as a flat per-user list and as a per-project list; a task mutation needs to invalidate whichever of those are actually affected (including the *previous* project if a task's project changed) without over-invalidating and causing unnecessary refetches. `hooks/useTasks.ts` centralizes that in a single `useInvalidateTasks` helper.
- **Tailwind v4's CSS-first config.** This project uses Tailwind v4, so the design system (color scale, brand color, shadows) is declared as `@theme` tokens in `index.css` rather than a `tailwind.config.js` — worth calling out since most existing tutorials still show the v3 JS-config approach.

## What I'd improve next

- Real-time updates via Supabase Realtime (today the app relies on query invalidation after each mutation, not live sync across tabs/devices).
- Optimistic updates for task status toggles, so the checkbox feels instant even before the mutation resolves.
- A proper activity log table instead of deriving "recent activity" from task timestamps — it would let the project detail page show client-visible history, not just task edits.
- Bulk actions on the Tasks page (multi-select + bulk status/priority change).
- An automated test suite (component tests for the shared `ui/` primitives, integration tests for the mutation hooks against a local Supabase instance).
