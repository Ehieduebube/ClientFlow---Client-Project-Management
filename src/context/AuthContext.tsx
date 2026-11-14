import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { AppUser } from '@/types'

function toAppUser(session: Session | null): AppUser | null {
  if (!session?.user) return null
  const metadata = session.user.user_metadata as { full_name?: string } | undefined
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    fullName: metadata?.full_name ?? null,
  }
}

// iOS keyboard autofill/QuickType often appends a trailing space to emails,
// and may capitalize the first letter — both make Supabase reject the login.
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

interface AuthContextValue {
  user: AppUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (fullName: string) => Promise<{ error: string | null }>
  updatePassword: (password: string) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setIsLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email: normalizeEmail(email), password })
    return { error: error?.message ?? null }
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { error } = await supabase.auth.signUp({
      email: normalizeEmail(email),
      password,
      options: {
        data: { full_name: fullName.trim() },
        // Send the confirmation link back to this site (not Supabase's default
        // Site URL, which is often localhost and unreachable from a phone).
        emailRedirectTo: window.location.origin,
      },
    })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function updateProfile(fullName: string) {
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } })
    return { error: error?.message ?? null }
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })
    return { error: error?.message ?? null }
  }

  const value: AuthContextValue = {
    user: toAppUser(session),
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
