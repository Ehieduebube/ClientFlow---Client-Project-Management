# ClientFlow

ClientFlow is a client and project management workspace for freelancers and small agencies — one place to track every client, project, and task instead of spreadsheets and scattered email threads.

## Features

- **Dashboard** — "My Work" panel sorting tasks into Overdue / Due Today / Upcoming, active client/project counts, upcoming deadlines, recent projects, and charts for project status and task completion.
- **Clients** — searchable/filterable list, full CRUD, detail page with that client's active projects and recent tasks.
- **Projects** — searchable/filterable list (status, priority), full CRUD, detail page with progress bar, task counts, task list, and recent activity.
- **Tasks** — dedicated workspace with search/filter by status, priority, and project; inline complete/reopen; full CRUD.
- **Auth** — email/password via Supabase Auth, with Row Level Security so users only see their own data.
- **Settings** — update display name/password, sign out.

## Tech stack

React 19 + TypeScript + Vite, Tailwind CSS v4, React Router, TanStack Query, Supabase (Postgres, Auth, RLS), Recharts, Lucide React, date-fns.

No form/animation/component library — UI primitives are hand-built in `src/components/ui`, and data flows through a thin `api/` layer wrapped by TanStack Query hooks (`hooks/`), keeping pages and components free of direct Supabase calls.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) — creates `clients`, `projects`, `tasks` tables plus RLS policies scoped to `auth.uid()`.
3. (Optional) Seed demo data: sign up in the running app, copy your user UUID from **Authentication → Users** into the `v_user_id` placeholder in [`supabase/seed.sql`](supabase/seed.sql), then run it.
4. Copy your project's **URL** and **anon public key** from **Settings → API** into `.env`. Never use the `service_role` key in the frontend.

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

Sign up from the running app, then optionally run the seed script above.

```bash
npm run build     # type-check + production build
npm run lint       # oxlint
npm run preview    # preview production build
```

## Database schema

**clients** — `id, user_id, name, company, email, phone, status, notes, created_at, updated_at`

**projects** — `id, user_id, client_id → clients, name, description, status, priority, start_date, deadline, progress, created_at, updated_at`

**tasks** — `id, user_id, project_id → projects, title, description, status, priority, due_date, completed_at, created_at, updated_at`

Every table has `user_id` and RLS policies gated on `auth.uid() = user_id`, enforced at the database layer.

## What I'd improve next

- Real-time updates via Supabase Realtime.
- Optimistic updates for task status toggles.
- A proper activity log table instead of deriving activity from task timestamps.
- Bulk actions on the Tasks page.
- An automated test suite.
