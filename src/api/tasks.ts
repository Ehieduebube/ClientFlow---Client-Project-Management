import { supabase } from '@/lib/supabase'
import type { Task, TaskInput, TaskStatus, TaskWithProject } from '@/types'

const TASK_WITH_PROJECT_SELECT = '*, project:projects(id, name, client_id)'

export async function fetchTasks(userId: string): Promise<TaskWithProject[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_WITH_PROJECT_SELECT)
    .eq('user_id', userId)
    .order('due_date', { ascending: true, nullsFirst: false })

  if (error) throw error
  return data as unknown as TaskWithProject[]
}

export async function fetchTasksByProject(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('due_date', { ascending: true, nullsFirst: false })

  if (error) throw error
  return data as Task[]
}

export async function createTask(userId: string, input: TaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...input, user_id: userId })
    .select('*')
    .single()

  if (error) throw error
  return data as Task
}

export async function updateTask(id: string, input: Partial<TaskInput>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(input)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data as Task
}

export async function setTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status, completed_at: status === 'done' ? new Date().toISOString() : null })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data as Task
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}
