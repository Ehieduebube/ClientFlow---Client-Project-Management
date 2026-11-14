import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, Plus, CheckSquare, PlusCircle, CircleDot } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ProjectStatusBadge, PriorityBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ProjectFormModal } from '@/components/projects/ProjectFormModal'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskFormModal } from '@/components/tasks/TaskFormModal'
import { useProject, useDeleteProject } from '@/hooks/useProjects'
import { useTasksByProject, useDeleteTask } from '@/hooks/useTasks'
import { useToast } from '@/context/ToastContext'
import { formatDate, parseDate, pluralize } from '@/lib/utils'
import type { Task, TaskWithProject } from '@/types'

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const { data: project, isLoading, isError, refetch } = useProject(id)
  const { data: tasks } = useTasksByProject(id)
  const deleteProject = useDeleteProject()
  const deleteTask = useDeleteTask()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [taskFormState, setTaskFormState] = useState<{ open: boolean; task?: Task }>({ open: false })
  const [deleteTaskTarget, setDeleteTaskTarget] = useState<Task | null>(null)

  const tasksWithProject: TaskWithProject[] = useMemo(
    () => (tasks ?? []).map((task) => ({ ...task, project: null })),
    [tasks],
  )

  const taskStats = useMemo(() => {
    const total = tasks?.length ?? 0
    const completed = tasks?.filter((t) => t.status === 'done').length ?? 0
    return { total, completed, remaining: total - completed }
  }, [tasks])

  const recentActivity = useMemo(() => {
    if (!tasks) return []
    return [...tasks]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 6)
  }, [tasks])

  async function handleDeleteProject() {
    if (!project) return
    try {
      await deleteProject.mutateAsync(project.id)
      showToast({ variant: 'success', title: 'Project deleted' })
      navigate('/projects')
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Could not delete project',
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  async function handleDeleteTask() {
    if (!deleteTaskTarget) return
    try {
      await deleteTask.mutateAsync({ id: deleteTaskTarget.id, projectId: deleteTaskTarget.project_id })
      showToast({ variant: 'success', title: 'Task deleted' })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Could not delete task',
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setDeleteTaskTarget(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    )
  }

  if (isError || !project) {
    return <ErrorState message="This project may have been deleted." onRetry={refetch} />
  }

  return (
    <div>
      <Link to="/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-ink-800">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to projects
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-semibold text-ink-900 sm:text-2xl">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
          {project.client && (
            <Link to={`/clients/${project.client.id}`} className="mt-1 inline-block text-sm text-ink-600 hover:text-ink-800 hover:underline">
              {project.client.name}
            </Link>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setIsEditOpen(true)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" leftIcon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => setIsDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      {project.description && <p className="mt-4 max-w-2xl text-sm text-ink-700">{project.description}</p>}

      <div className="mt-6 rounded-lg border border-ink-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink-800">Overall progress</p>
          <p className="text-sm text-ink-600">{project.progress}%</p>
        </div>
        <ProgressBar value={project.progress} className="mt-2" />
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Start date</p>
            <p className="mt-1 text-sm text-ink-800">{formatDate(project.start_date)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Deadline</p>
            <p className="mt-1 text-sm text-ink-800">{formatDate(project.deadline)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Tasks completed</p>
            <p className="mt-1 text-sm text-ink-800">
              {taskStats.completed} of {taskStats.total}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Remaining</p>
            <p className="mt-1 text-sm text-ink-800">{taskStats.remaining} {pluralize(taskStats.remaining, 'task')}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">Tasks</h2>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => setTaskFormState({ open: true })}
            >
              Add task
            </Button>
          </div>
          <div className="mt-3">
            {tasksWithProject.length === 0 ? (
              <EmptyState icon={CheckSquare} title="No tasks yet" description="Break this project down into tasks to track progress." />
            ) : (
              <TaskList
                tasks={tasksWithProject}
                onEdit={(task) => setTaskFormState({ open: true, task })}
                onDelete={(task) => setDeleteTaskTarget(task)}
              />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink-900">Recent activity</h2>
          <div className="mt-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-ink-600">No activity yet.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {recentActivity.map((task) => (
                  <li key={task.id} className="flex gap-2.5 text-sm">
                    <div className="mt-0.5">
                      {task.status === 'done' ? (
                        <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
                      ) : task.created_at === task.updated_at ? (
                        <PlusCircle className="h-3.5 w-3.5 text-ink-500" />
                      ) : (
                        <CircleDot className="h-3.5 w-3.5 text-blue-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-ink-700">
                        <span className="font-medium text-ink-900">{task.title}</span>{' '}
                        {task.status === 'done' ? 'completed' : task.created_at === task.updated_at ? 'created' : 'updated'}
                      </p>
                      <p className="text-xs text-ink-500">{formatDistanceToNow(parseDate(task.updated_at), { addSuffix: true })}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <ProjectFormModal isOpen={isEditOpen} project={project} onClose={() => setIsEditOpen(false)} />

      <TaskFormModal
        isOpen={taskFormState.open}
        task={taskFormState.task}
        defaultProjectId={project.id}
        lockProject
        onClose={() => setTaskFormState({ open: false })}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete project"
        description={`This will permanently delete ${project.name} and all of its tasks. This can't be undone.`}
        confirmLabel="Delete project"
        isLoading={deleteProject.isPending}
        onConfirm={handleDeleteProject}
        onCancel={() => setIsDeleteOpen(false)}
      />

      <ConfirmDialog
        isOpen={!!deleteTaskTarget}
        title="Delete task"
        description={`This will permanently delete "${deleteTaskTarget?.title ?? 'this task'}". This can't be undone.`}
        confirmLabel="Delete task"
        isLoading={deleteTask.isPending}
        onConfirm={handleDeleteTask}
        onCancel={() => setDeleteTaskTarget(null)}
      />
    </div>
  )
}
