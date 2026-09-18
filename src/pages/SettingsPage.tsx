import { useState, type FormEvent } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { required } from '@/lib/validation'

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-ink-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function SettingsPage() {
  const { user, signOut, updateProfile, updatePassword } = useAuth()
  const { showToast } = useToast()

  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [nameError, setNameError] = useState<string | undefined>()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  async function handleProfileSubmit(event: FormEvent) {
    event.preventDefault()
    const error = required(fullName)
    setNameError(error)
    if (error) return

    setIsSavingProfile(true)
    const { error: updateError } = await updateProfile(fullName.trim())
    setIsSavingProfile(false)

    if (updateError) {
      showToast({ variant: 'error', title: 'Could not update profile', description: updateError })
    } else {
      showToast({ variant: 'success', title: 'Profile updated' })
    }
  }

  async function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault()

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    setPasswordError(undefined)

    setIsSavingPassword(true)
    const { error } = await updatePassword(newPassword)
    setIsSavingPassword(false)

    if (error) {
      showToast({ variant: 'error', title: 'Could not update password', description: error })
    } else {
      showToast({ variant: 'success', title: 'Password updated' })
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account details." />

      <div className="flex flex-col gap-6">
        <Panel title="Profile">
          <form onSubmit={handleProfileSubmit} noValidate className="flex flex-col gap-4 sm:max-w-sm">
            <Input label="Email" value={user?.email ?? ''} disabled hint="Your email can't be changed here." />
            <Input
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={nameError}
              required
            />
            <div>
              <Button type="submit" isLoading={isSavingProfile}>
                Save changes
              </Button>
            </div>
          </form>
        </Panel>

        <Panel title="Password" description="Choose a new password for your account.">
          <form onSubmit={handlePasswordSubmit} noValidate className="flex flex-col gap-4 sm:max-w-sm">
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={passwordError}
              required
            />
            <div>
              <Button type="submit" isLoading={isSavingPassword}>
                Update password
              </Button>
            </div>
          </form>
        </Panel>

        <Panel title="Session">
          <p className="text-sm text-ink-500">Signed in as {user?.email}</p>
          <Button variant="secondary" className="mt-4" onClick={signOut}>
            Sign out
          </Button>
        </Panel>
      </div>
    </div>
  )
}
