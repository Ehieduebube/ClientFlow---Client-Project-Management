import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, className, required, children, ...props },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = error ? `${selectId}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink-700">
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            'h-9 w-full appearance-none rounded-md border bg-white px-3 pr-9 text-sm text-ink-900',
            'transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500',
            error ? 'border-red-400' : 'border-ink-300 hover:border-ink-400',
            'disabled:cursor-not-allowed disabled:bg-ink-100 disabled:text-ink-400',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})
