import type { ReactNode } from 'react'

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600">
            <span className="text-sm font-bold text-white">C</span>
          </div>
          <h1 className="mt-4 text-lg font-semibold text-ink-900">{title}</h1>
          <p className="mt-1 text-sm text-ink-500">{description}</p>
        </div>

        <div className="rounded-lg border border-ink-200 bg-white p-6 shadow-sm">{children}</div>

        <p className="mt-6 text-center text-sm text-ink-500">{footer}</p>
      </div>
    </div>
  )
}
