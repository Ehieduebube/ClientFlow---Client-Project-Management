import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className, required, rows = 4, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={cn(
          'w-full resize-y rounded-md border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-500',
          'transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500',
          error ? 'border-red-400' : 'border-ink-300 hover:border-ink-400',
          'disabled:cursor-not-allowed disabled:bg-ink-100 disabled:text-ink-400',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})
