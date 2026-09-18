import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as projectsApi from '@/api/projects'
import { queryKeys } from '@/lib/queryClient'
import { useAuth } from '@/context/AuthContext'
import type { ProjectInput } from '@/types'

export function useProjects() {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.projects(user?.id ?? ''),
    queryFn: () => projectsApi.fetchProjects(user!.id),
    enabled: !!user,
  })
}

export function useProjectsByClient(clientId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.projectsByClient(clientId ?? ''),
    queryFn: () => projectsApi.fetchProjectsByClient(clientId!),
    enabled: !!clientId,
  })
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.project(id ?? ''),
    queryFn: () => projectsApi.fetchProject(id!),
    enabled: !!id,
  })
}

export function useCreateProject() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ProjectInput) => projectsApi.createProject(user!.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects(user!.id) })
    },
  })
}

export function useUpdateProject(id: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: Partial<ProjectInput>) => projectsApi.updateProject(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects(user!.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.project(id) })
    },
  })
}

export function useDeleteProject() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectsApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects(user!.id) })
    },
  })
}
