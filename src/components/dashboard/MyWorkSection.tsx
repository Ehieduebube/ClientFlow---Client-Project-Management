import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { PriorityBadge } from '@/components/ui/StatusBadge'
import { Pagination } from '@/components/ui/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { dueDateLabel } from '@/lib/utils'
import type { TaskWithProject } from '@/types'

type Section = 'overdue' | 'dueToday' | 'upcoming'

interface MyWorkSectionProps {
  overdue: TaskWithProject[]
  dueToday: TaskWithProject[]
  upcoming: TaskWithProject[]
}

interface WorkItem {
  section: Section
  task: TaskWithProject
}

const SECTION_META: Record<Section, { title: string; titleClass: string; dueClass?: string }> = {
  overdue: { title: 'Overdue', titleClass: 'text-red-600', dueClass: 'font-medium text-red-600' },
  dueToday: { title: 'Due today', titleClass: 'text-amber-700' },
  upcoming: { title: 'Upcoming', titleClass: 'text-ink-600' },
}

const PAGE_SIZE = 5

export function MyWorkSection({ overdue, dueToday, upcoming }: MyWorkSectionProps) {
  const isEmpty = overdue.length === 0 && dueToday.length === 0 && upcoming.length === 0

  const combined: WorkItem[] = [
    ...overdue.map((task) => ({ section: 'overdue' as const, task })),
    ...dueToday.map((task) => ({ section: 'dueToday' as const, task })),
    ...upcoming.map((task) => ({ section: 'upcoming' as const, task })),
  ]

  const totalCounts: Record<Section, number> = {
    overdue: overdue.length,
    dueToday: dueToday.length,
    upcoming: upcoming.length,
  }

  const { page, setPage, pageCount, pageItems, totalItems, rangeStart, rangeEnd } = usePagination(
    combined,
    PAGE_SIZE,
  )

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-brand-500" aria-hidden="true" />
        <p className="mt-2 text-sm font-medium text-ink-800">You're all caught up</p>
        <p className="mt-0.5 text-sm text-ink-600">No tasks need your attention this week.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-5">
        {pageItems.map((item, index) => {
          const meta = SECTION_META[item.section]
          const isNewSection = index === 0 || pageItems[index - 1].section !== item.section

          return (
            <div key={item.task.id}>
              {isNewSection && (
                <h3 className={`text-xs font-semibold uppercase tracking-wide ${meta.titleClass}`}>
                  {meta.title} <span className="text-ink-500">({totalCounts[item.section]})</span>
                </h3>
              )}
              <ul className="flex flex-col divide-y divide-ink-100">
                <li className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link
                      to={item.task.project_id ? `/projects/${item.task.project_id}` : '/tasks'}
                      className="truncate text-sm font-medium text-ink-900 hover:underline"
                    >
                      {item.task.title}
                    </Link>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-600">
                      {item.task.project?.name && <span className="truncate">{item.task.project.name}</span>}
                      {item.task.project?.name && <span className="text-ink-300">·</span>}
                      <span className={meta.dueClass}>{dueDateLabel(item.task.due_date)}</span>
                    </p>
                  </div>
                  <PriorityBadge priority={item.task.priority} />
                </li>
              </ul>
            </div>
          )
        })}
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        totalItems={totalItems}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        itemLabel="task"
        onPageChange={setPage}
      />
    </div>
  )
}
