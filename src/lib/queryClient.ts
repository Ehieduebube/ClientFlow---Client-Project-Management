import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export const queryKeys = {
  clients: (userId: string) => ['clients', userId] as const,
  client: (id: string) => ['clients', 'detail', id] as const,
  projects: (userId: string) => ['projects', userId] as const,
  projectsByClient: (clientId: string) => ['projects', 'by-client', clientId] as const,
  project: (id: string) => ['projects', 'detail', id] as const,
  tasks: (userId: string) => ['tasks', userId] as const,
  tasksByProject: (projectId: string) => ['tasks', 'by-project', projectId] as const,
}
