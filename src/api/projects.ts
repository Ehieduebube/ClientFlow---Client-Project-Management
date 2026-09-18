import { supabase } from '@/lib/supabase'
import type { Project, ProjectInput, ProjectWithClient } from '@/types'

const PROJECT_WITH_CLIENT_SELECT = '*, client:clients(id, name, company)'

export async function fetchProjects(userId: string): Promise<ProjectWithClient[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_WITH_CLIENT_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as unknown as ProjectWithClient[]
}

export async function fetchProjectsByClient(clientId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Project[]
}

export async function fetchProject(id: string): Promise<ProjectWithClient> {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_WITH_CLIENT_SELECT)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as unknown as ProjectWithClient
}

export async function createProject(userId: string, input: ProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...input, user_id: userId })
    .select('*')
    .single()

  if (error) throw error
  return data as Project
}

export async function updateProject(id: string, input: Partial<ProjectInput>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data as Project
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}
