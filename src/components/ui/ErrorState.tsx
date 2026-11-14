import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Something went wrong while loading this data.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50/50 px-6 py-14 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-ink-800">Couldn't load this data</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-600">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  )
}
