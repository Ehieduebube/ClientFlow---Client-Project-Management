import { Badge } from '@/components/ui/Badge'
import { CLIENT_STATUS_META, PRIORITY_META, PROJECT_STATUS_META, TASK_STATUS_META } from '@/lib/status'
import type { ClientStatus, Priority, ProjectStatus, TaskStatus } from '@/types'

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const meta = CLIENT_STATUS_META[status]
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const meta = PROJECT_STATUS_META[status]
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const meta = TASK_STATUS_META[status]
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = PRIORITY_META[priority]
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}
