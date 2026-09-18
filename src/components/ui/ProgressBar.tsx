import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  className?: string
  trackClassName?: string
}

export function ProgressBar({ value, className, trackClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const tone = clamped >= 100 ? 'bg-emerald-500' : clamped >= 50 ? 'bg-brand-500' : 'bg-ink-400'

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-ink-100', trackClassName)}
    >
      <div
        className={cn('h-full rounded-full transition-[width]', tone, className)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
