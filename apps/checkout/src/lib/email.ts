import { Resend } from 'resend'
import { readFileSync } from 'fs'
import { join } from 'path'
import { getSupabaseAdmin } from './supabase'

async function getPdfUrlByEmail(email: string): Promise<string | null> {
  const sb = getSupabaseAdmin()
  if (!sb) return null

  const { data } = await sb
    .from('quiz_submissions')
    .select('pdf_url')
    .eq('email', email.toLowerCase())
    .not('pdf_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)

  return data?.[0]?.pdf_url ?? null
}

export async function sendFulfillmentEmail({
  email,
  firstName,
  bumpIncluded,
}: {
  email: string
  firstName: string
  bumpIncluded: boolean
}): Promise<void> {
  const apiKey = import.meta.env.RESEND_API_KEY as string | undefined
  const from = (import.meta.env.RESEND_FROM as string | undefined) ?? 'orders@strategicparenting.com'

  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping fulfillment email')
    return
  }

  // Look up the personalised PDF download URL from Supabase
  const pdfUrl = await getPdfUrlByEmail(email)
  if (!pdfUrl) {
    console.warn('[email] No pdf_url found for:', email)
  }

  const reportSection = pdfUrl
    ? `<p style="text-align:center;margin:24px 0;">
        <a href="${pdfUrl}"
           style="background:#6c3fc1;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
          Download Your Child's Report
        </a>
       </p>`
    : `<p>Your personalised report will be available shortly.</p>`

  const attachments = []

  if (bumpIncluded) {
    const pdfsDir = join(process.cwd(), 'public', 'pdfs')
    attachments.push(
      {
        filename: 'Anger-Management-Adventures.pdf',
        content: readFileSync(join(pdfsDir, 'Anger-Management-Adventures-StrategicParenting.pdf')),
      },
      {
        filename: 'The-ADHD-Game-Plan.pdf',
        content: readFileSync(join(pdfsDir, 'the-adhd-game-plan-strategicparenting.pdf')),
      },
    )
  }

  const bumpsSection = bumpIncluded
    ? `<p>Your two bonus resources are attached to this email:</p>
       <ul>
         <li><strong>Anger Management Adventures</strong></li>
         <li><strong>The ADHD Game Plan</strong></li>
       </ul>`
    : ''

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: `Your ADHD Parenting order is ready, ${firstName}!`,
    html: `
      <p>Hi ${firstName},</p>
      <p>Thank you for your purchase! Your child's personalised ADHD Personality Type Report is ready.</p>
      ${reportSection}
      ${bumpsSection}
      <p>Warmly,<br>The Strategic Parenting Team</p>
    `,
    attachments,
  })

  if (error) {
    console.error('[email] Failed to send fulfillment email:', error)
  } else {
    console.log('[email] Fulfillment email sent to:', email)
  }
}
