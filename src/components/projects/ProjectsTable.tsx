import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { ProjectStatusBadge, PriorityBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RowMenu } from '@/components/ui/RowMenu'
import { formatDate } from '@/lib/utils'
import type { ProjectWithClient } from '@/types'

interface ProjectsTableProps {
  projects: ProjectWithClient[]
  onEdit: (project: ProjectWithClient) => void
  onDelete: (project: ProjectWithClient) => void
}

export function ProjectsTable({ projects, onEdit, onDelete }: ProjectsTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-lg border border-ink-200 bg-white">
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="border-b border-ink-200 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-500">
          <tr>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Progress</th>
            <th className="px-4 py-3 font-medium">Deadline</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {projects.map((project) => (
            <tr
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="cursor-pointer hover:bg-ink-50/60"
            >
              <td className="px-4 py-3 font-medium text-ink-900">{project.name}</td>
              <td className="px-4 py-3 text-ink-600">{project.client?.name || '—'}</td>
              <td className="px-4 py-3">
                <ProjectStatusBadge status={project.status} />
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={project.priority} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <ProgressBar value={project.progress} className="w-20" />
                  <span className="text-xs text-ink-500">{project.progress}%</span>
                </div>
              </td>
              <td className="px-4 py-3 text-ink-500">{formatDate(project.deadline)}</td>
              <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <RowMenu
                  actions={[
                    { label: 'Edit', icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => onEdit(project) },
                    {
                      label: 'Delete',
                      icon: <Trash2 className="h-3.5 w-3.5" />,
                      onClick: () => onDelete(project),
                      danger: true,
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile card list */}
      <ul className="divide-y divide-ink-100 md:hidden">
        {projects.map((project) => (
          <li key={project.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                onClick={() => navigate(`/projects/${project.id}`)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-medium text-ink-900">{project.name}</p>
                <p className="truncate text-sm text-ink-500">{project.client?.name || 'No client'}</p>
              </button>
              <RowMenu
                actions={[
                  { label: 'Edit', icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => onEdit(project) },
                  {
                    label: 'Delete',
                    icon: <Trash2 className="h-3.5 w-3.5" />,
                    onClick: () => onDelete(project),
                    danger: true,
                  },
                ]}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ProjectStatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
              <span className="text-xs text-ink-500">Due {formatDate(project.deadline)}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <ProgressBar value={project.progress} className="flex-1" />
              <span className="text-xs text-ink-500">{project.progress}%</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
