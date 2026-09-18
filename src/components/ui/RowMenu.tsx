import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RowMenuAction {
  label: string
  icon?: ReactNode
  onClick: () => void
  danger?: boolean
}

const MENU_WIDTH = 160

export function RowMenu({ actions }: { actions: RowMenuAction[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleClick(event: MouseEvent) {
      const target = event.target as Node
      if (buttonRef.current?.contains(target)) return
      if (menuRef.current && !menuRef.current.contains(target)) setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return

    function updatePosition() {
      const rect = buttonRef.current!.getBoundingClientRect()
      setPosition({ top: rect.bottom + 4, left: rect.right - MENU_WIDTH })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Open row actions"
        aria-expanded={isOpen}
        className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-600"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {isOpen &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH, transformOrigin: 'top right' }}
            className="fixed z-50 overflow-hidden rounded-md border border-ink-200 bg-white py-1 shadow-md animate-scale-in"
          >
            {actions.map((action) => (
              <button
                key={action.label}
                role="menuitem"
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  action.onClick()
                }}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-ink-50',
                  action.danger ? 'text-red-600' : 'text-ink-700',
                )}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}
