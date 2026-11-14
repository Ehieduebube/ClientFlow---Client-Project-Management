import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type BadgeTone = 'neutral' | 'blue' | 'amber' | 'green' | 'red' | 'teal'

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  teal: 'bg-brand-50 text-brand-700',
}

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  )
}
