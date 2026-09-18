import { Modal } from '@/components/ui/Modal'
import { ClientForm } from '@/components/clients/ClientForm'
import { useCreateClient, useUpdateClient } from '@/hooks/useClients'
import { useToast } from '@/context/ToastContext'
import type { Client, ClientInput } from '@/types'

interface ClientFormModalProps {
  isOpen: boolean
  onClose: () => void
  client?: Client
}

export function ClientFormModal({ isOpen, onClose, client }: ClientFormModalProps) {
  const { showToast } = useToast()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient(client?.id ?? '')

  const isSubmitting = createClient.isPending || updateClient.isPending

  async function handleSubmit(input: ClientInput) {
    try {
      if (client) {
        await updateClient.mutateAsync(input)
        showToast({ variant: 'success', title: 'Client updated' })
      } else {
        await createClient.mutateAsync(input)
        showToast({ variant: 'success', title: 'Client added' })
      }
      onClose()
    } catch (error) {
      showToast({
        variant: 'error',
        title: client ? 'Could not update client' : 'Could not add client',
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client ? 'Edit client' : 'Add client'}
      description={client ? undefined : 'Add a new client to start tracking their projects and tasks.'}
    >
      <ClientForm
        initialValue={client}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
