export function ConfigMissing() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-lg border border-ink-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Setup required</p>
        <h1 className="mt-2 text-lg font-semibold text-ink-900">Supabase isn't configured yet</h1>
        <p className="mt-2 text-sm text-ink-600">
          ClientFlow needs your Supabase project URL and anon key to run. Create a{' '}
          <code className="rounded bg-ink-100 px-1 py-0.5 text-xs">.env</code> file in the project root:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-md border border-ink-200 bg-ink-900 p-4 text-xs text-ink-50">
{`VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`}
        </pre>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-ink-600">
          <li>
            Run <code className="rounded bg-ink-100 px-1 py-0.5 text-xs">cp .env.example .env</code> in the project
            root.
          </li>
          <li>
            Get your URL and anon key from your Supabase project under <strong>Settings → API</strong>.
          </li>
          <li>Run the SQL in <code className="rounded bg-ink-100 px-1 py-0.5 text-xs">supabase/schema.sql</code> in the Supabase SQL editor.</li>
          <li>Restart the dev server (<code className="rounded bg-ink-100 px-1 py-0.5 text-xs">npm run dev</code>).</li>
        </ol>
        <p className="mt-4 text-xs text-ink-400">See the README for full setup instructions.</p>
      </div>
    </div>
  )
}
