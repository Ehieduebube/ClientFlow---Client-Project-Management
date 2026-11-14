import { Pencil, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/Checkbox'
import { PriorityBadge, TaskStatusBadge } from '@/components/ui/StatusBadge'
import { RowMenu } from '@/components/ui/RowMenu'
import { useSetTaskStatus } from '@/hooks/useTasks'
import { useToast } from '@/context/ToastContext'
import { cn, dueDateLabel, isOverdue } from '@/lib/utils'
import type { TaskWithProject } from '@/types'

interface TaskListProps {
  tasks: TaskWithProject[]
  showProject?: boolean
  onEdit: (task: TaskWithProject) => void
  onDelete: (task: TaskWithProject) => void
}

export function TaskList({ tasks, showProject = false, onEdit, onDelete }: TaskListProps) {
  const setTaskStatus = useSetTaskStatus()
  const { showToast } = useToast()

  async function toggleDone(task: TaskWithProject) {
    const nextStatus = task.status === 'done' ? 'todo' : 'done'
    try {
      await setTaskStatus.mutateAsync({ id: task.id, status: nextStatus, projectId: task.project_id })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Could not update task',
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ink-200 bg-white">
      <ul className="divide-y divide-ink-100">
        {tasks.map((task) => {
          const overdue = task.status !== 'done' && isOverdue(task.due_date)
          return (
            <li key={task.id} className="flex items-start gap-3 px-4 py-3">
              <div className="pt-0.5">
                <Checkbox
                  checked={task.status === 'done'}
                  onChange={() => toggleDone(task)}
                  label={task.status === 'done' ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
                  disabled={setTaskStatus.isPending}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      'truncate text-sm font-medium text-ink-900',
                      task.status === 'done' && 'text-ink-500 line-through',
                    )}
                  >
                    {task.title}
                  </p>
                  <RowMenu
                    actions={[
                      { label: 'Edit', icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => onEdit(task) },
                      {
                        label: 'Delete',
                        icon: <Trash2 className="h-3.5 w-3.5" />,
                        onClick: () => onDelete(task),
                        danger: true,
                      },
                    ]}
                  />
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <TaskStatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                  {showProject && task.project && (
                    <span className="text-xs text-ink-600">{task.project.name}</span>
                  )}
                  <span className={cn('text-xs', overdue ? 'font-medium text-red-600' : 'text-ink-600')}>
                    {dueDateLabel(task.due_date)}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
