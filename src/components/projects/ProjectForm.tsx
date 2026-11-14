import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useClients } from '@/hooks/useClients'
import { PRIORITY_META, PRIORITY_OPTIONS, PROJECT_STATUS_META, PROJECT_STATUS_OPTIONS } from '@/lib/status'
import { required, type Errors } from '@/lib/validation'
import type { Priority, Project, ProjectInput, ProjectStatus } from '@/types'

type Field = 'name' | 'clientId' | 'deadline'

interface ProjectFormProps {
  initialValue?: Project
  defaultClientId?: string
  onSubmit: (input: ProjectInput) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function ProjectForm({ initialValue, defaultClientId, onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
  const { data: clients } = useClients()

  const [name, setName] = useState(initialValue?.name ?? '')
  const [clientId, setClientId] = useState(initialValue?.client_id ?? defaultClientId ?? '')
  const [description, setDescription] = useState(initialValue?.description ?? '')
  const [status, setStatus] = useState<ProjectStatus>(initialValue?.status ?? 'planning')
  const [priority, setPriority] = useState<Priority>(initialValue?.priority ?? 'medium')
  const [startDate, setStartDate] = useState(initialValue?.start_date ?? '')
  const [deadline, setDeadline] = useState(initialValue?.deadline ?? '')
  const [progress, setProgress] = useState(initialValue?.progress ?? 0)
  const [errors, setErrors] = useState<Errors<Field>>({})

  function validate(): boolean {
    const next: Errors<Field> = {
      name: required(name),
      clientId: required(clientId, 'Select a client'),
      deadline:
        startDate && deadline && deadline < startDate ? 'Deadline must be after the start date' : undefined,
    }
    setErrors(next)
    return !next.name && !next.clientId && !next.deadline
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return

    await onSubmit({
      client_id: clientId || null,
      name: name.trim(),
      description: description.trim() || null,
      status,
      priority,
      start_date: startDate || null,
      deadline: deadline || null,
      progress,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input label="Project name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />

      <Select label="Client" value={clientId} onChange={(e) => setClientId(e.target.value)} error={errors.clientId} required>
        <option value="">Select a client…</option>
        {(clients ?? []).map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </Select>

      <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
          {PROJECT_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {PROJECT_STATUS_META[option].label}
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <Input
          label="Deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          error={errors.deadline}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="progress" className="flex items-center justify-between text-sm font-medium text-ink-700">
          <span>Progress</span>
          <span className="text-ink-600">{progress}%</span>
        </label>
        <input
          id="progress"
          type="range"
          min={0}
          max={100}
          step={5}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="h-2 w-full cursor-pointer accent-ink-900"
        />
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialValue ? 'Save changes' : 'Create project'}
        </Button>
      </div>
    </form>
  )
}
