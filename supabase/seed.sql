-- ClientFlow demo/seed data
-- Fictional companies and projects only — no real people or private data.
--
-- Usage:
--   1. Sign up for an account in the running app (or Supabase Auth dashboard).
--   2. Copy that user's UUID from Authentication > Users.
--   3. Replace YOUR_USER_ID_HERE below with that UUID.
--   4. Run this whole script in the Supabase SQL editor.
--
-- Dates are generated relative to now() so the dashboard's "overdue / due
-- today / upcoming" logic looks correct no matter when you run this.

do $$
declare
  v_user_id uuid := 'YOUR_USER_ID_HERE';

  v_client_nova uuid;
  v_client_brightline uuid;
  v_client_fernwood uuid;
  v_client_pixelpine uuid;
  v_client_harbor uuid;

  v_project_nova_web uuid;
  v_project_nova_email uuid;
  v_project_brightline_fleet uuid;
  v_project_fernwood_site uuid;
  v_project_pixelpine_brand uuid;
  v_project_harbor_reporting uuid;
  v_project_harbor_mobile uuid;
begin
  if v_user_id = 'YOUR_USER_ID_HERE' then
    raise exception 'Replace YOUR_USER_ID_HERE with a real auth.users id before running this seed script.';
  end if;

  -- Clients ------------------------------------------------------------
  insert into public.clients (user_id, name, company, email, phone, status, notes, created_at)
  values (v_user_id, 'Elena Marsh', 'Nova Retail Co.', 'elena.marsh@novaretail.example', '(415) 555-0134', 'active', 'Prefers async updates over Slack. Quarterly planning call every first Monday.', now() - interval '145 days')
  returning id into v_client_nova;

  insert into public.clients (user_id, name, company, email, phone, status, notes, created_at)
  values (v_user_id, 'Marcus Odei', 'Brightline Logistics', 'marcus@brightlinelogistics.example', '(312) 555-0192', 'active', 'Technical stakeholder — CC their ops lead on all deploy notices.', now() - interval '98 days')
  returning id into v_client_brightline;

  insert into public.clients (user_id, name, company, email, phone, status, notes, created_at)
  values (v_user_id, 'Sofia Reyes', 'Fernwood Architecture', 'sofia@fernwoodarch.example', '(206) 555-0110', 'inactive', 'Project wrapped in the spring. Revisit for site refresh next year.', now() - interval '260 days')
  returning id into v_client_fernwood;

  insert into public.clients (user_id, name, company, email, phone, status, notes, created_at)
  values (v_user_id, 'Devon Clarke', 'Pixel & Pine Studio', 'devon@pixelandpine.example', '(503) 555-0177', 'active', 'Small studio, fast decision maker. Approves scope changes same-day.', now() - interval '40 days')
  returning id into v_client_pixelpine;

  insert into public.clients (user_id, name, company, email, phone, status, notes, created_at)
  values (v_user_id, 'Priya Nair', 'Harbor Analytics', 'priya.nair@harboranalytics.example', '(617) 555-0148', 'lead', 'Introductory call went well. Sending proposal for the reporting tool.', now() - interval '6 days')
  returning id into v_client_harbor;

  -- Projects -------------------------------------------------------------
  insert into public.projects (user_id, client_id, name, description, status, priority, start_date, deadline, progress, created_at)
  values (v_user_id, v_client_nova, 'Website Redesign', 'Full redesign of the Nova Retail storefront, including new PDP templates and checkout flow.', 'in_progress', 'high', current_date - 34, current_date + 9, 65, now() - interval '34 days')
  returning id into v_project_nova_web;

  insert into public.projects (user_id, client_id, name, description, status, priority, start_date, deadline, progress, created_at)
  values (v_user_id, v_client_nova, 'Q3 Email Campaign', 'Three-part lifecycle email series for the fall product launch.', 'review', 'medium', current_date - 20, current_date + 3, 85, now() - interval '20 days')
  returning id into v_project_nova_email;

  insert into public.projects (user_id, client_id, name, description, status, priority, start_date, deadline, progress, created_at)
  values (v_user_id, v_client_brightline, 'Fleet Tracking Dashboard', 'Internal dashboard for real-time fleet status, replacing their spreadsheet workflow.', 'in_progress', 'high', current_date - 52, current_date + 21, 45, now() - interval '52 days')
  returning id into v_project_brightline_fleet;

  insert into public.projects (user_id, client_id, name, description, status, priority, start_date, deadline, progress, created_at)
  values (v_user_id, v_client_fernwood, 'Portfolio Site', 'Static portfolio site with case study templates and a lightweight CMS.', 'completed', 'medium', current_date - 210, current_date - 150, 100, now() - interval '210 days')
  returning id into v_project_fernwood_site;

  insert into public.projects (user_id, client_id, name, description, status, priority, start_date, deadline, progress, created_at)
  values (v_user_id, v_client_pixelpine, 'Brand Identity Refresh', 'Logo refinement, color system, and updated brand guidelines document.', 'planning', 'low', current_date + 4, current_date + 45, 5, now() - interval '5 days')
  returning id into v_project_pixelpine_brand;

  insert into public.projects (user_id, client_id, name, description, status, priority, start_date, deadline, progress, created_at)
  values (v_user_id, v_client_harbor, 'Internal Reporting Tool', 'Proposal-stage project: a reporting dashboard pulling from their warehouse data.', 'planning', 'medium', current_date + 14, current_date + 90, 0, now() - interval '2 days')
  returning id into v_project_harbor_reporting;

  insert into public.projects (user_id, client_id, name, description, status, priority, start_date, deadline, progress, created_at)
  values (v_user_id, v_client_brightline, 'Mobile App MVP', 'Driver-facing companion app for the fleet dashboard, iOS + Android via one codebase.', 'in_progress', 'medium', current_date - 15, current_date + 60, 20, now() - interval '15 days')
  returning id into v_project_harbor_mobile;

  -- Tasks ------------------------------------------------------------
  -- Nova Retail — Website Redesign
  insert into public.tasks (user_id, project_id, title, description, status, priority, due_date, created_at) values
    (v_user_id, v_project_nova_web, 'Fix checkout form validation', 'Error states are not showing on the shipping step.', 'in_progress', 'high', current_date - 2, now() - interval '10 days'),
    (v_user_id, v_project_nova_web, 'Build product detail page template', 'Includes variant selector and reviews section.', 'done', 'high', current_date - 6, now() - interval '25 days'),
    (v_user_id, v_project_nova_web, 'Mobile navigation redesign', 'Simplify the mega-menu for small screens.', 'todo', 'high', current_date, now() - interval '4 days'),
    (v_user_id, v_project_nova_web, 'QA pass on cart edge cases', 'Empty cart, promo code errors, out-of-stock items.', 'todo', 'medium', current_date + 5, now() - interval '3 days'),
    (v_user_id, v_project_nova_web, 'Set up staging environment', null, 'done', 'medium', current_date - 20, now() - interval '30 days');

  -- Nova Retail — Q3 Email Campaign
  insert into public.tasks (user_id, project_id, title, description, status, priority, due_date, created_at) values
    (v_user_id, v_project_nova_email, 'Client review of email #2', 'Waiting on Elena''s feedback before finalizing copy.', 'in_progress', 'medium', current_date + 3, now() - interval '6 days'),
    (v_user_id, v_project_nova_email, 'Finalize subject line A/B tests', null, 'todo', 'low', current_date + 8, now() - interval '2 days'),
    (v_user_id, v_project_nova_email, 'Draft email #1 copy', null, 'done', 'medium', current_date - 12, now() - interval '18 days');

  -- Brightline — Fleet Tracking Dashboard
  insert into public.tasks (user_id, project_id, title, description, status, priority, due_date, created_at) values
    (v_user_id, v_project_brightline_fleet, 'Design live map component', 'Real-time vehicle markers with status color coding.', 'in_progress', 'high', current_date + 1, now() - interval '9 days'),
    (v_user_id, v_project_brightline_fleet, 'API integration for vehicle telemetry', 'Blocked on Brightline providing sandbox credentials.', 'todo', 'high', current_date - 3, now() - interval '14 days'),
    (v_user_id, v_project_brightline_fleet, 'Define alert thresholds with ops team', null, 'todo', 'medium', current_date + 12, now() - interval '7 days'),
    (v_user_id, v_project_brightline_fleet, 'Wireframe dashboard layout', null, 'done', 'medium', current_date - 40, now() - interval '50 days'),
    (v_user_id, v_project_brightline_fleet, 'Set up realtime data pipeline', 'Evaluate Supabase Realtime vs polling.', 'in_progress', 'high', current_date + 6, now() - interval '11 days');

  -- Fernwood — Portfolio Site (completed project, tasks mostly done)
  insert into public.tasks (user_id, project_id, title, description, status, priority, due_date, created_at) values
    (v_user_id, v_project_fernwood_site, 'Final client handoff walkthrough', null, 'done', 'medium', current_date - 150, now() - interval '160 days'),
    (v_user_id, v_project_fernwood_site, 'Write CMS usage guide', null, 'done', 'low', current_date - 155, now() - interval '165 days');

  -- Pixel & Pine — Brand Identity Refresh
  insert into public.tasks (user_id, project_id, title, description, status, priority, due_date, created_at) values
    (v_user_id, v_project_pixelpine_brand, 'Kickoff call and brand audit', null, 'todo', 'medium', current_date + 4, now() - interval '3 days'),
    (v_user_id, v_project_pixelpine_brand, 'Collect brand inspiration references', null, 'todo', 'low', current_date + 10, now() - interval '3 days');

  -- Harbor — Internal Reporting Tool
  insert into public.tasks (user_id, project_id, title, description, status, priority, due_date, created_at) values
    (v_user_id, v_project_harbor_reporting, 'Send proposal and statement of work', null, 'in_progress', 'high', current_date + 2, now() - interval '2 days'),
    (v_user_id, v_project_harbor_reporting, 'Schedule data-source discovery call', null, 'todo', 'medium', current_date + 7, now() - interval '1 days');

  -- Harbor / Brightline — Mobile App MVP
  insert into public.tasks (user_id, project_id, title, description, status, priority, due_date, created_at) values
    (v_user_id, v_project_harbor_mobile, 'Landing page review', 'Review the marketing landing page copy before dev starts.', 'todo', 'medium', current_date + 2, now() - interval '5 days'),
    (v_user_id, v_project_harbor_mobile, 'Choose cross-platform framework', 'React Native vs. Expo — document tradeoffs.', 'done', 'high', current_date - 10, now() - interval '15 days'),
    (v_user_id, v_project_harbor_mobile, 'Driver login + auth flow', null, 'todo', 'high', current_date - 1, now() - interval '8 days'),
    (v_user_id, v_project_harbor_mobile, 'Offline mode spec', 'Drivers frequently lose signal in warehouse areas.', 'todo', 'low', current_date + 25, now() - interval '4 days');

  raise notice 'Seed complete: 5 clients, 7 projects, 24 tasks created for user %', v_user_id;
end $$;
