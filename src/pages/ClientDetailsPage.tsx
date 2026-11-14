import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Pencil, Trash2, FolderKanban, CheckSquare } from 'lucide-react'
import { ClientStatusBadge } from '@/components/ui/StatusBadge'
import { ProjectStatusBadge, TaskStatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ClientFormModal } from '@/components/clients/ClientFormModal'
import { useClient, useDeleteClient } from '@/hooks/useClients'
import { useProjectsByClient } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'
import { useToast } from '@/context/ToastContext'
import { formatDate } from '@/lib/utils'

export function ClientDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const { data: client, isLoading, isError, refetch } = useClient(id)
  const { data: projects } = useProjectsByClient(id)
  const { data: allTasks } = useTasks()
  const deleteClient = useDeleteClient()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const recentTasks = useMemo(() => {
    if (!allTasks) return []
    return allTasks
      .filter((task) => task.project?.client_id === id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6)
  }, [allTasks, id])

  const activeProjects = useMemo(() => (projects ?? []).filter((p) => p.status !== 'completed'), [projects])

  async function handleDelete() {
    if (!client) return
    try {
      await deleteClient.mutateAsync(client.id)
      showToast({ variant: 'success', title: 'Client deleted' })
      navigate('/clients')
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Could not delete client',
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (isError || !client) {
    return <ErrorState message="This client may have been deleted." onRetry={refetch} />
  }

  return (
    <div>
      <Link to="/clients" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-ink-800">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to clients
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold text-ink-900 sm:text-2xl">{client.name}</h1>
            <ClientStatusBadge status={client.status} />
          </div>
          {client.company && <p className="mt-1 text-sm text-ink-600">{client.company}</p>}
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-ink-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Email</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-800">
            {client.email ? (
              <>
                <Mail className="h-3.5 w-3.5 text-ink-500" /> {client.email}
              </>
            ) : (
              '—'
            )}
          </p>
        </div>
        <div className="rounded-lg border border-ink-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Phone</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-800">
            {client.phone ? (
              <>
                <Phone className="h-3.5 w-3.5 text-ink-500" /> {client.phone}
              </>
            ) : (
              '—'
            )}
          </p>
        </div>
        <div className="rounded-lg border border-ink-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Client since</p>
          <p className="mt-1 text-sm text-ink-800">{formatDate(client.created_at)}</p>
        </div>
      </div>

      {client.notes && (
        <div className="mt-4 rounded-lg border border-ink-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Notes</p>
          <p className="mt-1.5 whitespace-pre-line text-sm text-ink-700">{client.notes}</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-ink-900">Active projects</h2>
        <div className="mt-3">
          {activeProjects.length === 0 ? (
            <EmptyState icon={FolderKanban} title="No active projects" description="This client has no projects in progress." />
          ) : (
            <ul className="divide-y divide-ink-100 rounded-lg border border-ink-200 bg-white">
              {activeProjects.map((project) => (
                <li key={project.id}>
                  <Link
                    to={`/projects/${project.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-ink-50/60"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">{project.name}</p>
                      <p className="text-xs text-ink-600">Deadline {formatDate(project.deadline)}</p>
                    </div>
                    <ProjectStatusBadge status={project.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-ink-900">Recent tasks</h2>
        <div className="mt-3">
          {recentTasks.length === 0 ? (
            <EmptyState icon={CheckSquare} title="No tasks yet" description="Tasks from this client's projects will show up here." />
          ) : (
            <ul className="divide-y divide-ink-100 rounded-lg border border-ink-200 bg-white">
              {recentTasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">{task.title}</p>
                    <p className="text-xs text-ink-600">{task.project?.name ?? 'No project'}</p>
                  </div>
                  <TaskStatusBadge status={task.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ClientFormModal isOpen={isEditOpen} client={client} onClose={() => setIsEditOpen(false)} />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete client"
        description={`This will permanently delete ${client.name} and unlink their projects. This can't be undone.`}
        confirmLabel="Delete client"
        isLoading={deleteClient.isPending}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  )
}
