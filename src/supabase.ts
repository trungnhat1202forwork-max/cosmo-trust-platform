import { createClient } from '@supabase/supabase-js'

// Public client configuration for the COSMO demo project.
// These values are safe to expose in browser code because the project uses a
// Supabase publishable key plus Row Level Security. Environment variables can
// override them later without changing source code.
const defaultUrl = 'https://jxqfqsvmrmhsxrvobnci.supabase.co'
const defaultPublishableKey = 'sb_publishable_3pFe2LOMQTQJlfkjRvdNRA_TDeHqS2v'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || defaultUrl
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) || defaultPublishableKey

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
})

export const hasSupabase = Boolean(url && key)
