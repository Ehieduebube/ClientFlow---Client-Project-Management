import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useProjects } from '@/hooks/useProjects'
import { PRIORITY_META, PRIORITY_OPTIONS, TASK_STATUS_META, TASK_STATUS_OPTIONS } from '@/lib/status'
import { required, type Errors } from '@/lib/validation'
import type { Priority, Task, TaskInput, TaskStatus } from '@/types'

type Field = 'title'

interface TaskFormProps {
  initialValue?: Task
  defaultProjectId?: string
  lockProject?: boolean
  onSubmit: (input: TaskInput) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function TaskForm({ initialValue, defaultProjectId, lockProject, onSubmit, onCancel, isSubmitting }: TaskFormProps) {
  const { data: projects } = useProjects()

  const [title, setTitle] = useState(initialValue?.title ?? '')
  const [description, setDescription] = useState(initialValue?.description ?? '')
  const [projectId, setProjectId] = useState(initialValue?.project_id ?? defaultProjectId ?? '')
  const [status, setStatus] = useState<TaskStatus>(initialValue?.status ?? 'todo')
  const [priority, setPriority] = useState<Priority>(initialValue?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initialValue?.due_date ?? '')
  const [errors, setErrors] = useState<Errors<Field>>({})

  function validate(): boolean {
    const next: Errors<Field> = { title: required(title) }
    setErrors(next)
    return !next.title
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return

    await onSubmit({
      project_id: projectId || null,
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} required />

      <Select
        label="Project"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        disabled={lockProject}
      >
        <option value="">No project</option>
        {(projects ?? []).map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </Select>

      <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
          {TASK_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {TASK_STATUS_META[option].label}
            </option>
          ))}
        </Select>
        <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {PRIORITY_META[option].label}
            </option>
          ))}
        </Select>
        <Input label="Due date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialValue ? 'Save changes' : 'Add task'}
        </Button>
      </div>
    </form>
  )
}
