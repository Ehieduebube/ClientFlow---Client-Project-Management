import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/nav'
import { useAuth } from '@/context/AuthContext'
import { cn, initials } from '@/lib/utils'

export function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto bg-brand-950 md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-5">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-500">
          <span className="text-xs font-bold text-white">C</span>
        </div>
        <span className="text-sm font-semibold tracking-tight text-white">ClientFlow</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white/90',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand-400" />
                )}
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
            {initials(user?.email ?? 'U')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white/90">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="shrink-0 rounded p-1.5 text-white/75 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
