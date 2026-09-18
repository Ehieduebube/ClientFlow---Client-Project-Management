import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as tasksApi from '@/api/tasks'
import { queryKeys } from '@/lib/queryClient'
import { useAuth } from '@/context/AuthContext'
import type { TaskInput, TaskStatus } from '@/types'

export function useTasks() {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.tasks(user?.id ?? ''),
    queryFn: () => tasksApi.fetchTasks(user!.id),
    enabled: !!user,
  })
}

export function useTasksByProject(projectId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tasksByProject(projectId ?? ''),
    queryFn: () => tasksApi.fetchTasksByProject(projectId!),
    enabled: !!projectId,
  })
}

function useInvalidateTasks() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return (projectId?: string | null) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tasks(user!.id) })
    if (projectId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasksByProject(projectId) })
    }
  }
}

export function useCreateTask() {
  const { user } = useAuth()
  const invalidate = useInvalidateTasks()

  return useMutation({
    mutationFn: (input: TaskInput) => tasksApi.createTask(user!.id, input),
    onSuccess: (task) => invalidate(task.project_id),
  })
}

export function useUpdateTask(id: string, projectId?: string | null) {
  const invalidate = useInvalidateTasks()

  return useMutation({
    mutationFn: (input: Partial<TaskInput>) => tasksApi.updateTask(id, input),
    onSuccess: (task) => invalidate(task.project_id ?? projectId),
  })
}

export function useSetTaskStatus() {
  const invalidate = useInvalidateTasks()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus; projectId?: string | null }) =>
      tasksApi.setTaskStatus(id, status),
    onSuccess: (task) => invalidate(task.project_id),
  })
}

export function useDeleteTask() {
  const invalidate = useInvalidateTasks()

  return useMutation({
    mutationFn: ({ id }: { id: string; projectId?: string | null }) => tasksApi.deleteTask(id),
    onSuccess: (_data, variables) => invalidate(variables.projectId),
  })
}
