import { useMemo, useState } from 'react'
import { Plus, FolderKanban } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ProjectsTable } from '@/components/projects/ProjectsTable'
import { ProjectFormModal } from '@/components/projects/ProjectFormModal'
import { Pagination } from '@/components/ui/Pagination'
import { useProjects, useDeleteProject } from '@/hooks/useProjects'
import { usePagination } from '@/hooks/usePagination'
import { useToast } from '@/context/ToastContext'
import { PRIORITY_META, PRIORITY_OPTIONS, PROJECT_STATUS_META, PROJECT_STATUS_OPTIONS } from '@/lib/status'
import type { Priority, ProjectStatus, ProjectWithClient } from '@/types'

const PAGE_SIZE = 10

export function ProjectsPage() {
  const { data: projects, isLoading, isError, refetch } = useProjects()
  const deleteProject = useDeleteProject()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [formState, setFormState] = useState<{ open: boolean; project?: ProjectWithClient }>({ open: false })
  const [deleteTarget, setDeleteTarget] = useState<ProjectWithClient | null>(null)

  const filteredProjects = useMemo(() => {
    if (!projects) return []
    const query = search.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter
      const matchesQuery =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.client?.name.toLowerCase().includes(query)
      return matchesStatus && matchesPriority && matchesQuery
    })
  }, [projects, search, statusFilter, priorityFilter])

  const { page, setPage, pageCount, pageItems, totalItems, rangeStart, rangeEnd } = usePagination(
    filteredProjects,
    PAGE_SIZE,
  )

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteProject.mutateAsync(deleteTarget.id)
      showToast({ variant: 'success', title: 'Project deleted' })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Could not delete project',
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Track scope, progress, and deadlines across every engagement."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormState({ open: true })}>
            New project
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects…" className="sm:max-w-xs" />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
          className="sm:w-44"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {PROJECT_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {PROJECT_STATUS_META[status].label}
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
      </div>

      {isLoading && <SkeletonRows rows={6} />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && projects && projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start tracking progress."
          action={
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormState({ open: true })}>
              New project
            </Button>
          }
        />
      )}

      {!isLoading && !isError && projects && projects.length > 0 && filteredProjects.length === 0 && (
        <EmptyState icon={FolderKanban} title="No projects match your filters" description="Try a different search or filter." />
      )}

      {!isLoading && !isError && filteredProjects.length > 0 && (
        <>
          <ProjectsTable
            projects={pageItems}
            onEdit={(project) => setFormState({ open: true, project })}
            onDelete={(project) => setDeleteTarget(project)}
          />
          <Pagination
            page={page}
            pageCount={pageCount}
            totalItems={totalItems}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            itemLabel="project"
            onPageChange={setPage}
          />
        </>
      )}

      <ProjectFormModal
        isOpen={formState.open}
        project={formState.project}
        onClose={() => setFormState({ open: false })}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete project"
        description={`This will permanently delete ${deleteTarget?.name ?? 'this project'} and all of its tasks. This can't be undone.`}
        confirmLabel="Delete project"
        isLoading={deleteProject.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
