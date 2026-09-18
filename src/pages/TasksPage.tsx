import { useMemo, useState } from 'react'
import { Plus, CheckSquare } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskFormModal } from '@/components/tasks/TaskFormModal'
import { Pagination } from '@/components/ui/Pagination'
import { useDeleteTask, useTasks } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { usePagination } from '@/hooks/usePagination'
import { useToast } from '@/context/ToastContext'
import { PRIORITY_META, PRIORITY_OPTIONS, TASK_STATUS_META, TASK_STATUS_OPTIONS } from '@/lib/status'
import type { Priority, TaskStatus, TaskWithProject } from '@/types'

const PAGE_SIZE = 10

export function TasksPage() {
  const { data: tasks, isLoading, isError, refetch } = useTasks()
  const { data: projects } = useProjects()
  const deleteTask = useDeleteTask()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [projectFilter, setProjectFilter] = useState<string | 'all'>('all')
  const [formState, setFormState] = useState<{ open: boolean; task?: TaskWithProject }>({ open: false })
  const [deleteTarget, setDeleteTarget] = useState<TaskWithProject | null>(null)

  const filteredTasks = useMemo(() => {
    if (!tasks) return []
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      const matchesProject = projectFilter === 'all' || task.project_id === projectFilter
      const matchesQuery = !query || task.title.toLowerCase().includes(query)
      return matchesStatus && matchesPriority && matchesProject && matchesQuery
    })
  }, [tasks, search, statusFilter, priorityFilter, projectFilter])

  const { page, setPage, pageCount, pageItems, totalItems, rangeStart, rangeEnd } = usePagination(
    filteredTasks,
    PAGE_SIZE,
  )

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteTask.mutateAsync({ id: deleteTarget.id, projectId: deleteTarget.project_id })
      showToast({ variant: 'success', title: 'Task deleted' })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Could not delete task',
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Everything on your plate, across every project."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormState({ open: true })}>
            Add task
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search tasks…" className="sm:max-w-xs" />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
          className="sm:w-40"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {TASK_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {TASK_STATUS_META[status].label}
            </option>
          ))}
        </Select>
        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
          className="sm:w-40"
          aria-label="Filter by priority"
        >
          <option value="all">All priorities</option>
          {PRIORITY_OPTIONS.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_META[priority].label}
            </option>
          ))}
        </Select>
        <Select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="sm:w-48"
          aria-label="Filter by project"
        >
          <option value="all">All projects</option>
          {(projects ?? []).map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
      </div>

      {isLoading && <SkeletonRows rows={6} />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && tasks && tasks.length === 0 && (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Add your first task to start tracking your work."
          action={
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormState({ open: true })}>
              Add task
            </Button>
          }
        />
      )}

      {!isLoading && !isError && tasks && tasks.length > 0 && filteredTasks.length === 0 && (
        <EmptyState icon={CheckSquare} title="No tasks match your filters" description="Try a different search or filter." />
      )}

      {!isLoading && !isError && filteredTasks.length > 0 && (
        <>
          <TaskList
            tasks={pageItems}
            showProject
            onEdit={(task) => setFormState({ open: true, task })}
            onDelete={(task) => setDeleteTarget(task)}
          />
          <Pagination
            page={page}
            pageCount={pageCount}
            totalItems={totalItems}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            itemLabel="task"
            onPageChange={setPage}
          />
        </>
      )}

      <TaskFormModal
        isOpen={formState.open}
        task={formState.task}
        onClose={() => setFormState({ open: false })}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete task"
        description={`This will permanently delete "${deleteTarget?.title ?? 'this task'}". This can't be undone.`}
        confirmLabel="Delete task"
        isLoading={deleteTask.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
