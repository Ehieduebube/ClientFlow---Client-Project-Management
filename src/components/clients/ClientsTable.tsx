import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Mail, Phone } from 'lucide-react'
import { ClientStatusBadge } from '@/components/ui/StatusBadge'
import { RowMenu } from '@/components/ui/RowMenu'
import { formatDate } from '@/lib/utils'
import type { Client } from '@/types'

interface ClientsTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
}

export function ClientsTable({ clients, onEdit, onDelete }: ClientsTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-lg border border-ink-200 bg-white">
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="border-b border-ink-200 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-600">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {clients.map((client) => (
            <tr
              key={client.id}
              onClick={() => navigate(`/clients/${client.id}`)}
              className="cursor-pointer hover:bg-ink-50/60"
            >
              <td className="px-4 py-3 font-medium text-ink-900">{client.name}</td>
              <td className="px-4 py-3 text-ink-700">{client.company || '—'}</td>
              <td className="px-4 py-3 text-ink-700">
                <div className="flex flex-col gap-0.5">
                  {client.email && <span className="truncate">{client.email}</span>}
                  {client.phone && <span className="text-ink-500">{client.phone}</span>}
                  {!client.email && !client.phone && '—'}
                </div>
              </td>
              <td className="px-4 py-3">
                <ClientStatusBadge status={client.status} />
              </td>
              <td className="px-4 py-3 text-ink-600">{formatDate(client.created_at)}</td>
              <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <RowMenu
                  actions={[
                    { label: 'Edit', icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => onEdit(client) },
                    {
                      label: 'Delete',
                      icon: <Trash2 className="h-3.5 w-3.5" />,
                      onClick: () => onDelete(client),
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
        {clients.map((client) => (
          <li key={client.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                onClick={() => navigate(`/clients/${client.id}`)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-medium text-ink-900">{client.name}</p>
                {client.company && <p className="truncate text-sm text-ink-600">{client.company}</p>}
              </button>
              <RowMenu
                actions={[
                  { label: 'Edit', icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => onEdit(client) },
                  {
                    label: 'Delete',
                    icon: <Trash2 className="h-3.5 w-3.5" />,
                    onClick: () => onDelete(client),
                    danger: true,
                  },
                ]}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-600">
              <ClientStatusBadge status={client.status} />
              {client.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {client.email}
                </span>
              )}
              {client.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {client.phone}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
