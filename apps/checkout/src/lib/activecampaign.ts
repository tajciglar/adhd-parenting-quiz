/**
 * ActiveCampaign integration for the Astro checkout.
 * Syncs contacts and applies tags after purchase events.
 */

export async function syncContactWithTags({
  email,
  firstName,
  lastName,
  country,
  tags,
}: {
  email: string
  firstName: string
  lastName?: string
  country?: string
  tags: string[]
}): Promise<void> {
  const acApiUrl = (import.meta.env.AC_API_URL as string | undefined)?.replace(/\/$/, '')
  const acApiKey = import.meta.env.AC_API_KEY as string | undefined
  const acListId = import.meta.env.AC_LIST_ID as string | undefined

  if (!acApiUrl || !acApiKey) {
    console.warn('[AC] AC_API_URL or AC_API_KEY not set — skipping ActiveCampaign sync')
    return
  }

  // Skip internal team emails
  if (email.toLowerCase().includes('@wecreatecourses')) return

  const headers = {
    'Api-Token': acApiKey,
    'Content-Type': 'application/json',
  }

  try {
    // 1. Create or update contact
    const res = await fetch(`${acApiUrl}/api/3/contact/sync`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contact: {
          email,
          firstName,
          lastName: lastName ?? '',
          ...(country ? { fieldValues: [{ field: 'COUNTRY', value: country }] } : {}),
        },
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[AC] Failed to sync contact:', res.status, body)
      return
    }

    const contactData = (await res.json()) as { contact: { id: number | string } }
    const contactId = String(contactData.contact.id)
    console.log('[AC] Contact synced:', email, 'id:', contactId)

    // 2. Subscribe contact to list (if AC_LIST_ID is set)
    if (acListId) {
      const listRes = await fetch(`${acApiUrl}/api/3/contactLists`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contactList: { list: acListId, contact: contactId, status: 1 },
        }),
      })
      if (!listRes.ok) {
        const body = await listRes.text()
        console.error('[AC] Failed to subscribe contact to list:', listRes.status, body)
      } else {
        console.log('[AC] Contact subscribed to list:', acListId)
      }
    }

    // 3. Find or create each tag and apply to contact
    for (const tagName of tags) {
      const tagSearchRes = await fetch(
        `${acApiUrl}/api/3/tags?search=${encodeURIComponent(tagName)}`,
        { headers },
      )
      const tagSearchData = (await tagSearchRes.json()) as {
        tags: Array<{ id: number | string; tag: string }>
      }

      let tagId = String(
        tagSearchData.tags.find((t) => t.tag === tagName)?.id ?? '',
      )

      if (!tagId || tagId === 'undefined') {
        const createTagRes = await fetch(`${acApiUrl}/api/3/tags`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ tag: { tag: tagName, tagType: 'contact', description: '' } }),
        })
        const createTagData = (await createTagRes.json()) as { tag?: { id: number | string } }
        if (createTagData.tag?.id) tagId = String(createTagData.tag.id)
      }

      if (tagId && tagId !== 'undefined') {
        await fetch(`${acApiUrl}/api/3/contactTags`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
        })
        console.log('[AC] Tag applied:', tagName, 'to contact:', email)
      }
    }
  } catch (err) {
    console.error('[AC] Error syncing contact:', err)
  }
}
