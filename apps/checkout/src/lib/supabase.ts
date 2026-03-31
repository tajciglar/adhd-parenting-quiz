import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  const url = import.meta.env.SUPABASE_URL as string | undefined
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined

  if (!url || !key) {
    console.warn('[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set')
    return null
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}
