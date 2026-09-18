import { useMemo, useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ClientsTable } from '@/components/clients/ClientsTable'
import { ClientFormModal } from '@/components/clients/ClientFormModal'
import { Pagination } from '@/components/ui/Pagination'
import { useClients, useDeleteClient } from '@/hooks/useClients'
import { usePagination } from '@/hooks/usePagination'
import { useToast } from '@/context/ToastContext'
import { CLIENT_STATUS_META, CLIENT_STATUS_OPTIONS } from '@/lib/status'
import type { Client, ClientStatus } from '@/types'

const PAGE_SIZE = 10

export function ClientsPage() {
  const { data: clients, isLoading, isError, refetch } = useClients()
  const deleteClient = useDeleteClient()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all')
  const [formState, setFormState] = useState<{ open: boolean; client?: Client }>({ open: false })
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)

  const filteredClients = useMemo(() => {
    if (!clients) return []
    const query = search.trim().toLowerCase()
    return clients.filter((client) => {
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter
      const matchesQuery =
        !query ||
        client.name.toLowerCase().includes(query) ||
        client.company?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query)
      return matchesStatus && matchesQuery
    })
  }, [clients, search, statusFilter])

  const { page, setPage, pageCount, pageItems, totalItems, rangeStart, rangeEnd } = usePagination(
    filteredClients,
    PAGE_SIZE,
  )

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteClient.mutateAsync(deleteTarget.id)
      showToast({ variant: 'success', title: 'Client deleted' })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Could not delete client',
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Every client relationship, in one place."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormState({ open: true })}>
            Add client
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search clients…" className="sm:max-w-xs" />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'all')}
          className="sm:w-44"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {CLIENT_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {CLIENT_STATUS_META[status].label}
            </option>
          ))}
        </Select>
      </div>

      {isLoading && <SkeletonRows rows={6} />}

      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && clients && clients.length === 0 && (
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Add your first client to start tracking their projects and tasks."
          action={
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormState({ open: true })}>
              Add client
            </Button>
          }
        />
      )}

      {!isLoading && !isError && clients && clients.length > 0 && filteredClients.length === 0 && (
        <EmptyState icon={Users} title="No clients match your filters" description="Try a different search or status." />
      )}

      {!isLoading && !isError && filteredClients.length > 0 && (
        <>
          <ClientsTable
            clients={pageItems}
            onEdit={(client) => setFormState({ open: true, client })}
            onDelete={(client) => setDeleteTarget(client)}
          />
          <Pagination
            page={page}
            pageCount={pageCount}
            totalItems={totalItems}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            itemLabel="client"
            onPageChange={setPage}
          />
        </>
      )}

      <ClientFormModal
        isOpen={formState.open}
        client={formState.client}
        onClose={() => setFormState({ open: false })}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete client"
        description={`This will permanently delete ${deleteTarget?.name ?? 'this client'} and unlink their projects. This can't be undone.`}
        confirmLabel="Delete client"
        isLoading={deleteClient.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
