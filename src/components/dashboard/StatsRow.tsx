import type { LucideIcon } from 'lucide-react'
import { Users, FolderKanban, CalendarClock, AlertTriangle } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'

interface Stat {
  label: string
  value: number
  icon: LucideIcon
  tone?: 'default' | 'warning'
}

export function StatsRow({
  activeClients,
  activeProjects,
  dueThisWeek,
  overdue,
}: {
  activeClients: number
  activeProjects: number
  dueThisWeek: number
  overdue: number
}) {
  const animatedClients = useCountUp(activeClients)
  const animatedProjects = useCountUp(activeProjects)
  const animatedDueThisWeek = useCountUp(dueThisWeek)
  const animatedOverdue = useCountUp(overdue)

  const stats: Stat[] = [
    { label: 'Active clients', value: animatedClients, icon: Users },
    { label: 'Active projects', value: animatedProjects, icon: FolderKanban },
    { label: 'Due this week', value: animatedDueThisWeek, icon: CalendarClock },
    { label: 'Overdue', value: animatedOverdue, icon: AlertTriangle, tone: overdue > 0 ? 'warning' : 'default' },
  ]

  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-ink-200 rounded-lg border border-ink-200 bg-white sm:grid-cols-4 sm:divide-y-0">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 px-4 py-4 animate-fade-in-up"
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors ${
              stat.tone === 'warning' ? 'bg-red-50' : 'bg-ink-100'
            }`}
          >
            <stat.icon className={`h-4 w-4 ${stat.tone === 'warning' ? 'text-red-600' : 'text-ink-500'}`} aria-hidden="true" />
          </div>
          <div>
            <p
              className={`text-xl font-semibold tabular-nums transition-colors ${
                stat.tone === 'warning' ? 'text-red-600' : 'text-ink-900'
              }`}
            >
              {stat.value}
            </p>
            <p className="text-xs text-ink-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
