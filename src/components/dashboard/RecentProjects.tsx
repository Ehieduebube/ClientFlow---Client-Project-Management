import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ProjectStatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { parseDate } from '@/lib/utils'
import type { ProjectWithClient } from '@/types'

export function RecentProjects({ projects }: { projects: ProjectWithClient[] }) {
  if (projects.length === 0) {
    return <p className="py-6 text-sm text-ink-500">No projects yet.</p>
  }

  return (
    <ul className="flex flex-col divide-y divide-ink-100">
      {projects.map((project) => (
        <li key={project.id} className="py-2.5">
          <Link to={`/projects/${project.id}`} className="flex items-center justify-between gap-3 hover:opacity-80">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-ink-900">{project.name}</p>
                <ProjectStatusBadge status={project.status} />
              </div>
              <p className="mt-1 text-xs text-ink-400">
                Updated {formatDistanceToNow(parseDate(project.updated_at), { addSuffix: true })}
              </p>
            </div>
            <div className="w-20 shrink-0">
              <ProgressBar value={project.progress} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
