/**
 * Brevo transactional email sender.
 * Sends the PDF delivery email after a successful purchase.
 */

interface SendDeliveryEmailOpts {
  toEmail: string
  toName: string
  childName: string
  mainPdfUrl: string
  bumps: Array<{ name: string; pdfUrl: string }>
}

function buildEmailHtml(opts: SendDeliveryEmailOpts): string {
  const { childName, mainPdfUrl, bumps } = opts

  const bumpLinksHtml = bumps.length > 0
    ? `
      <tr>
        <td style="padding: 0 0 24px;">
          <p style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #1a1a1a;">
            Your bonus resources:
          </p>
          ${bumps.map(b => `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
              <tr>
                <td style="background: #f8f5ff; border-radius: 8px; padding: 14px 18px;">
                  <p style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #7040CA;">${b.name}</p>
                  <a href="${b.pdfUrl}" style="display: inline-block; font-size: 14px; color: #7040CA; text-decoration: underline;">
                    Download PDF →
                  </a>
                </td>
              </tr>
            </table>
          `).join('')}
        </td>
      </tr>`
    : ''

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background: #f4f4f5; font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: #7040CA; padding: 28px 32px; text-align: center;">
              <p style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                ${childName}'s ADHD Personality Report is ready! 💜
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <tr>
                  <td style="padding: 0 0 20px;">
                    <p style="margin: 0; font-size: 16px; color: #444; line-height: 1.7;">
                      Thank you for your purchase! ${childName}'s personalised ADHD report is attached below.
                      Understanding how ${childName}'s brain works is the first step to making everything easier.
                    </p>
                  </td>
                </tr>

                <!-- Main PDF CTA -->
                <tr>
                  <td style="padding: 0 0 28px; text-align: center;">
                    <a href="${mainPdfUrl}"
                      style="display: inline-block; background: #7040CA; color: #ffffff; font-size: 16px; font-weight: 700;
                             padding: 16px 32px; border-radius: 10px; text-decoration: none; letter-spacing: 0.01em;">
                      Download ${childName}'s Report →
                    </a>
                    <p style="margin: 10px 0 0; font-size: 13px; color: #888;">
                      Click the button above to download your PDF report.
                    </p>
                  </td>
                </tr>

                ${bumpLinksHtml}

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 0 20px; border-top: 1px solid #eee;"></td>
                </tr>

                <!-- Support note -->
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 13px; color: #888; line-height: 1.6; text-align: center;">
                      Questions? Reply to this email or contact us at
                      <a href="mailto:info@adhdparenting.com" style="color: #7040CA;">info@adhdparenting.com</a><br/>
                      14-day money-back guarantee — no questions asked.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendDeliveryEmail(opts: SendDeliveryEmailOpts): Promise<void> {
  const apiKey = import.meta.env.BREVO_API_KEY as string | undefined
  const senderEmail = import.meta.env.BREVO_SENDER_EMAIL as string | undefined
  const senderName = (import.meta.env.BREVO_SENDER_NAME as string | undefined) ?? 'Strategic Parenting'

  if (!apiKey || !senderEmail) {
    console.warn('[Brevo] BREVO_API_KEY or BREVO_SENDER_EMAIL not set — skipping email')
    return
  }

  const subject = `${opts.childName}'s ADHD Personality Report is here!`
  const htmlContent = buildEmailHtml(opts)

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: opts.toEmail, name: opts.toName || opts.toEmail }],
      subject,
      htmlContent,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('[Brevo] Failed to send delivery email:', res.status, body)
    return
  }

  console.log('[Brevo] Delivery email sent to:', opts.toEmail)
}
