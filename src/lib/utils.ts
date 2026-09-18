import { clsx, type ClassValue } from 'clsx'
import {
  differenceInCalendarDays,
  format,
  isToday,
  isPast,
  parseISO,
} from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** Parses a Postgres `date` or `timestamptz` string as a local Date. */
export function parseDate(value: string): Date {
  return parseISO(value)
}

export function formatDate(value: string | null, pattern = 'MMM d, yyyy'): string {
  if (!value) return '—'
  return format(parseDate(value), pattern)
}

export function formatDateTime(value: string | null): string {
  if (!value) return '—'
  return format(parseDate(value), 'MMM d, yyyy · h:mm a')
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false
  const date = parseDate(dueDate)
  return isPast(date) && !isToday(date)
}

export function isDueToday(dueDate: string | null): boolean {
  if (!dueDate) return false
  return isToday(parseDate(dueDate))
}

export function isDueThisWeek(dueDate: string | null): boolean {
  if (!dueDate) return false
  const days = differenceInCalendarDays(parseDate(dueDate), new Date())
  return days >= 0 && days <= 7
}

/** Human phrasing used in the "My Work" panel, e.g. "2 days overdue" / "Due Friday". */
export function dueDateLabel(dueDate: string | null): string {
  if (!dueDate) return 'No due date'
  const date = parseDate(dueDate)
  const days = differenceInCalendarDays(date, new Date())

  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days === -1) return '1 day overdue'
  if (days < -1) return `${Math.abs(days)} days overdue`
  if (days > 1 && days <= 6) return `Due ${format(date, 'EEEE')}`
  return `Due ${format(date, 'MMM d')}`
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}
