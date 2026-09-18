import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  label: string
  disabled?: boolean
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors active:scale-90',
        checked ? 'border-brand-600 bg-brand-600' : 'border-ink-300 bg-white hover:border-ink-400',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {checked && <Check className="h-3.5 w-3.5 animate-pop text-white" strokeWidth={3} aria-hidden="true" />}
    </button>
  )
}
