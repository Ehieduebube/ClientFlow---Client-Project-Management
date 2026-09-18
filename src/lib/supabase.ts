import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Falls back to obviously-fake values when unconfigured so createClient()
// doesn't throw at import time — main.tsx checks isSupabaseConfigured and
// renders a setup screen instead of ever using this client in that case.
export const supabase = createClient(
  supabaseUrl || 'https://missing-config.supabase.co',
  supabaseAnonKey || 'missing-config',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
)
