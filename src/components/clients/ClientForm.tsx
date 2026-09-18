import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { CLIENT_STATUS_META, CLIENT_STATUS_OPTIONS } from '@/lib/status'
import { isValidEmail, required, type Errors } from '@/lib/validation'
import type { Client, ClientInput } from '@/types'

type Field = 'name' | 'email'

interface ClientFormProps {
  initialValue?: Client
  onSubmit: (input: ClientInput) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function ClientForm({ initialValue, onSubmit, onCancel, isSubmitting }: ClientFormProps) {
  const [name, setName] = useState(initialValue?.name ?? '')
  const [company, setCompany] = useState(initialValue?.company ?? '')
  const [email, setEmail] = useState(initialValue?.email ?? '')
  const [phone, setPhone] = useState(initialValue?.phone ?? '')
  const [status, setStatus] = useState(initialValue?.status ?? 'active')
  const [notes, setNotes] = useState(initialValue?.notes ?? '')
  const [errors, setErrors] = useState<Errors<Field>>({})

  function validate(): boolean {
    const next: Errors<Field> = {
      name: required(name),
      email: email.trim() && !isValidEmail(email) ? 'Enter a valid email address' : undefined,
    }
    setErrors(next)
    return !next.name && !next.email
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return

    await onSubmit({
      name: name.trim(),
      company: company.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      status,
      notes: notes.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />
      <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as Client['status'])}>
        {CLIENT_STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {CLIENT_STATUS_META[option].label}
          </option>
        ))}
      </Select>
      <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialValue ? 'Save changes' : 'Add client'}
        </Button>
      </div>
    </form>
  )
}
