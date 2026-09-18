const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function required(value: string, message = 'This field is required'): string | undefined {
  return value.trim().length === 0 ? message : undefined
}

export type Errors<T extends string> = Partial<Record<T, string>>

export function hasErrors<T extends string>(errors: Errors<T>): boolean {
  return Object.values(errors).some((v) => !!v)
}
