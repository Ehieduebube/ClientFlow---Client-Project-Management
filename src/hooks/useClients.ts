import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as clientsApi from '@/api/clients'
import { queryKeys } from '@/lib/queryClient'
import { useAuth } from '@/context/AuthContext'
import type { ClientInput } from '@/types'

export function useClients() {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.clients(user?.id ?? ''),
    queryFn: () => clientsApi.fetchClients(user!.id),
    enabled: !!user,
  })
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.client(id ?? ''),
    queryFn: () => clientsApi.fetchClient(id!),
    enabled: !!id,
  })
}

export function useCreateClient() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ClientInput) => clientsApi.createClient(user!.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients(user!.id) })
    },
  })
}

export function useUpdateClient(id: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: Partial<ClientInput>) => clientsApi.updateClient(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients(user!.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.client(id) })
    },
  })
}

export function useDeleteClient() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => clientsApi.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients(user!.id) })
    },
  })
}
