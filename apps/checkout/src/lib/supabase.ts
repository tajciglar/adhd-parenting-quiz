import { createClient } from '@supabase/supabase-js'

export function getSupabase() {
  const url = import.meta.env.SUPABASE_URL as string | undefined
  const key = import.meta.env.SUPABASE_SERVICE_KEY as string | undefined

  if (!url || !key) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_KEY not set')
  }

  return createClient(url, key)
}

export async function getPdfUrlByEmail(email: string): Promise<string | null> {
  try {
    const sb = getSupabase()
    const { data } = await sb
      .from('quiz_submissions')
      .select('pdf_url')
      .eq('email', email.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    return data?.pdf_url ?? null
  } catch {
    return null
  }
}
