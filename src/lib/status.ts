import type { BadgeTone } from '@/components/ui/Badge'
import type { ClientStatus, Priority, ProjectStatus, TaskStatus } from '@/types'

export const CLIENT_STATUS_META: Record<ClientStatus, { label: string; tone: BadgeTone }> = {
  active: { label: 'Active', tone: 'green' },
  inactive: { label: 'Inactive', tone: 'neutral' },
  lead: { label: 'Lead', tone: 'blue' },
}

export const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; tone: BadgeTone }> = {
  planning: { label: 'Planning', tone: 'neutral' },
  in_progress: { label: 'In Progress', tone: 'blue' },
  review: { label: 'Review', tone: 'amber' },
  completed: { label: 'Completed', tone: 'green' },
}

export const TASK_STATUS_META: Record<TaskStatus, { label: string; tone: BadgeTone }> = {
  todo: { label: 'To Do', tone: 'neutral' },
  in_progress: { label: 'In Progress', tone: 'blue' },
  done: { label: 'Done', tone: 'green' },
}

export const PRIORITY_META: Record<Priority, { label: string; tone: BadgeTone }> = {
  low: { label: 'Low', tone: 'neutral' },
  medium: { label: 'Medium', tone: 'amber' },
  high: { label: 'High', tone: 'red' },
}

export const CLIENT_STATUS_OPTIONS: ClientStatus[] = ['active', 'lead', 'inactive']
export const PROJECT_STATUS_OPTIONS: ProjectStatus[] = ['planning', 'in_progress', 'review', 'completed']
export const TASK_STATUS_OPTIONS: TaskStatus[] = ['todo', 'in_progress', 'done']
export const PRIORITY_OPTIONS: Priority[] = ['low', 'medium', 'high']
