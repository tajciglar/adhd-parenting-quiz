import { Resend } from 'resend'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function sendBumpEmail({
  email,
  firstName,
}: {
  email: string
  firstName: string
}): Promise<void> {
  const apiKey = import.meta.env.RESEND_API_KEY as string | undefined
  const from = (import.meta.env.RESEND_FROM as string | undefined) ?? 'orders@strategicparenting.com'

  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping bump email')
    return
  }

  // Read bump PDFs from static assets
  const pdfsDir = join(process.cwd(), 'public', 'pdfs')
  const angerPdf = readFileSync(join(pdfsDir, 'Anger-Management-Adventures-StrategicParenting.pdf'))
  const gamePlanPdf = readFileSync(join(pdfsDir, 'the-adhd-game-plan-strategicparenting.pdf'))

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: 'Your bonus resources are here!',
    html: `
      <p>Hi ${firstName},</p>
      <p>Thank you for your purchase! Your bonus PDFs are attached to this email.</p>
      <ul>
        <li><strong>Anger Management Adventures</strong></li>
        <li><strong>The ADHD Game Plan</strong></li>
      </ul>
      <p>Warmly,<br>The Strategic Parenting Team</p>
    `,
    attachments: [
      {
        filename: 'Anger-Management-Adventures.pdf',
        content: angerPdf,
      },
      {
        filename: 'The-ADHD-Game-Plan.pdf',
        content: gamePlanPdf,
      },
    ],
  })

  if (error) {
    console.error('[email] Failed to send bump email:', error)
  } else {
    console.log('[email] Bump email sent to:', email)
  }
}
