import fs from 'node:fs'
import path from 'node:path'

export type ChangelogItem = {
  title: string
  date: string
  link: string
  source: string
  category?: string
  summary?: string
  guid?: string
  /** RSS <title> when it looks like a date (e.g. "September 17, 2026") */
  dateLabel?: string
}

const PRODUCT_RSS = 'https://docs.base44.com/changelog/product/rss.xml'
const PRODUCT_RSS_ALT = 'https://base44.com/changelog/product/rss.xml'
const PRODUCT_PAGE = 'https://docs.base44.com/changelog/product'
const STATUS_PAGE = 'https://status.base44.com'

/** Honest fallback: never invent Base44 changelog headlines. */
const FALLBACK_ITEMS: ChangelogItem[] = [
  {
    title: 'See the official Base44 product changelog',
    date: '',
    link: PRODUCT_PAGE,
    source: 'Base44 Product Changelog',
    summary:
      'RSS was unavailable at build time. Open the official changelog for real feature notes — we never invent Base44 headlines.',
  },
]

function unwrapCdata(text: string): string {
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#x26;/gi, '&')
    .replace(/&#38;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .trim()
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  )
}

function tagText(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const raw = block.match(re)?.[1] ?? ''
  return decodeEntities(unwrapCdata(raw))
}

function encodedHtml(block: string): string {
  const contentEncoded =
    block.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i)?.[1] ?? ''
  const description = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ?? ''
  return unwrapCdata(contentEncoded || description)
}

function firstH3(html: string): string | null {
  const m = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)
  if (!m) return null
  const text = stripHtml(m[1])
  return text || null
}

function looksLikeDateTitle(title: string): boolean {
  if (/^\d{4}-\d{2}-\d{2}$/.test(title)) return true
  if (
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}$/i.test(
      title,
    )
  )
    return true
  if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2},?\s+\d{4}$/i.test(title))
    return true
  return false
}

function summarizeAfterH3(html: string, maxLen = 160): string {
  const withoutH3 = html.replace(/<h3[^>]*>[\s\S]*?<\/h3>/i, ' ')
  const text = stripHtml(withoutH3)
  if (!text) return ''
  if (text.length <= maxLen) return text
  const cut = text.slice(0, maxLen)
  const lastSpace = cut.lastIndexOf(' ')
  const trimmed = lastSpace > 80 ? cut.slice(0, lastSpace) : cut
  return `${trimmed.replace(/[.,;:\s]+$/, '')}…`
}

function parseRssItems(xml: string): ChangelogItem[] {
  const items: ChangelogItem[] = []
  const seen = new Set<string>()
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? []

  for (const block of itemBlocks) {
    const rssTitle = tagText(block, 'title')
    const link = tagText(block, 'link')
    const guid = tagText(block, 'guid') || undefined
    const category = tagText(block, 'category') || undefined
    const pubDateRaw = tagText(block, 'pubDate')
    const html = encodedHtml(block)
    const h3Title = html ? firstH3(html) : null

    const dateAsLabel = Boolean(rssTitle && looksLikeDateTitle(rssTitle))
    const title = h3Title || rssTitle
    if (!title || !link) continue

    const dedupeKey = guid || `${link}::${title}`
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)

    let date = ''
    if (pubDateRaw) {
      const d = new Date(pubDateRaw)
      if (!Number.isNaN(d.getTime())) {
        date = d.toISOString().slice(0, 10)
      }
    }

    const summary = html ? summarizeAfterH3(html) : undefined

    items.push({
      title,
      date,
      link,
      source: 'Base44 Product Changelog',
      category,
      summary: summary || undefined,
      guid,
      dateLabel: dateAsLabel ? rssTitle : undefined,
    })
  }
  return items
}

async function tryFetchRss(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
        'User-Agent': 'Base44ExpertBot/1.0 (+https://base44expert.com)',
      },
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) return null
    const text = await res.text()
    if (!text.includes('<item') && !text.includes('<entry')) return null
    return text
  } catch {
    return null
  }
}

export async function getChangelogItems(limit = 6): Promise<{
  items: ChangelogItem[]
  fromRss: boolean
  productPage: string
  statusPage: string
}> {
  const xml =
    (await tryFetchRss(PRODUCT_RSS)) ?? (await tryFetchRss(PRODUCT_RSS_ALT))

  if (xml) {
    const parsed = parseRssItems(xml).slice(0, limit)
    if (parsed.length > 0) {
      return {
        items: parsed,
        fromRss: true,
        productPage: PRODUCT_PAGE,
        statusPage: STATUS_PAGE,
      }
    }
  }

  return {
    items: FALLBACK_ITEMS,
    fromRss: false,
    productPage: PRODUCT_PAGE,
    statusPage: STATUS_PAGE,
  }
}

/** Last few studio ship notes from CHANGELOG.md (not Base44 product). */
export function getStudioShipNotes(limit = 3): string[] {
  try {
    const file = path.join(process.cwd(), 'CHANGELOG.md')
    if (!fs.existsSync(file)) return []
    const md = fs.readFileSync(file, 'utf8')
    const bullets: string[] = []
    for (const line of md.split('\n')) {
      const m = line.match(/^-\s+(.+)/)
      if (!m) continue
      const text = m[1].trim()
      if (/^park|^draft only|^sync note|^deploy:/i.test(text)) continue
      bullets.push(text)
      if (bullets.length >= limit) break
    }
    return bullets
  } catch {
    return []
  }
}

export { PRODUCT_PAGE, STATUS_PAGE }
