export type ClientStatus = 'active' | 'inactive' | 'lead'
export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Client {
  id: string
  user_id: string
  name: string
  company: string | null
  email: string | null
  phone: string | null
  status: ClientStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  client_id: string | null
  name: string
  description: string | null
  status: ProjectStatus
  priority: Priority
  start_date: string | null
  deadline: string | null
  progress: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  project_id: string | null
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  due_date: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface AppUser {
  id: string
  email: string
  fullName: string | null
}

/** Payload shapes for writes — server-assigned fields are omitted. */
export type ClientInput = {
  name: string
  company: string | null
  email: string | null
  phone: string | null
  status: ClientStatus
  notes: string | null
}

export type ProjectInput = {
  client_id: string | null
  name: string
  description: string | null
  status: ProjectStatus
  priority: Priority
  start_date: string | null
  deadline: string | null
  progress: number
}

export type TaskInput = {
  project_id: string | null
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  due_date: string | null
}

/** Read-side shapes joined for list/detail views. */
export type ProjectWithClient = Project & {
  client: Pick<Client, 'id' | 'name' | 'company'> | null
}

export type TaskWithProject = Task & {
  project: Pick<Project, 'id' | 'name' | 'client_id'> | null
}
