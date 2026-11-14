import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof CheckCircle2; iconClass: string }> = {
  success: { icon: CheckCircle2, iconClass: 'text-brand-600' },
  error: { icon: AlertCircle, iconClass: 'text-red-600' },
  info: { icon: Info, iconClass: 'text-ink-600' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = ++idRef.current
      setToasts((current) => [...current, { ...toast, id }])
      window.setTimeout(() => dismiss(id), 5000)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6"
      >
        {toasts.map((toast) => {
          const { icon: Icon, iconClass } = VARIANT_STYLES[toast.variant]
          return (
            <div
              key={toast.id}
              role="status"
              className="flex items-start gap-3 rounded-md border border-ink-200 bg-white px-4 py-3 shadow-md animate-in"
            >
              <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', iconClass)} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-900">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-sm text-ink-600">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 rounded p-0.5 text-ink-500 hover:bg-ink-100 hover:text-ink-600"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
