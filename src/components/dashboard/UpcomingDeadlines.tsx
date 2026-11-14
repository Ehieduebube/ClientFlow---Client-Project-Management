import { Link } from 'react-router-dom'
import { ProjectStatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import type { ProjectWithClient } from '@/types'

export function UpcomingDeadlines({ projects }: { projects: ProjectWithClient[] }) {
  if (projects.length === 0) {
    return <p className="py-6 text-sm text-ink-600">No upcoming deadlines.</p>
  }

  return (
    <ul className="flex flex-col divide-y divide-ink-100">
      {projects.map((project) => (
        <li key={project.id} className="py-2.5">
          <Link to={`/projects/${project.id}`} className="flex items-center justify-between gap-3 hover:opacity-80">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink-900">{project.name}</p>
              <p className="text-xs text-ink-600">{project.client?.name ?? 'No client'}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-ink-600">{formatDate(project.deadline)}</span>
              <ProjectStatusBadge status={project.status} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
