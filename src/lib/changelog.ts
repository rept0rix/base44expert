export type ChangelogKind = 'product' | 'developer'

export type ChangelogItem = {
  title: string
  date: string
  link: string
  source: string
  kind: ChangelogKind
  category?: string
  summary?: string
  guid?: string
  /** Display date from RSS <title> when it looks like a date label */
  dateLabel?: string
}

const PRODUCT_RSS = 'https://docs.base44.com/changelog/product/rss.xml'
const PRODUCT_RSS_ALT = 'https://base44.com/changelog/product/rss.xml'
const DEVELOPER_RSS = 'https://docs.base44.com/changelog/developers/rss.xml'
const PRODUCT_PAGE = 'https://docs.base44.com/changelog/product'
const DEVELOPER_PAGE = 'https://docs.base44.com/changelog/developers'
const STATUS_PAGE = 'https://status.base44.com'

const SUMMARY_MAX = 300

/** Honest fallback shown when feeds are unavailable — calm copy, no fetch jargon. */
const FALLBACK_ITEMS: ChangelogItem[] = [
  {
    title: 'See the official Base44 product changelog',
    date: '',
    link: PRODUCT_PAGE,
    source: 'Base44 Product Changelog',
    kind: 'product',
    summary:
      'Open the official changelog for current feature notes from Base44. Pair it with platform status if something feels off.',
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

function summarizeAfterH3(html: string, maxLen = SUMMARY_MAX): string {
  const withoutH3 = html.replace(/<h3[^>]*>[\s\S]*?<\/h3>/i, ' ')
  const text = stripHtml(withoutH3)
  if (!text) return ''
  if (text.length <= maxLen) return text
  const cut = text.slice(0, maxLen)
  const lastSpace = cut.lastIndexOf(' ')
  const trimmed = lastSpace > 100 ? cut.slice(0, lastSpace) : cut
  return `${trimmed.replace(/[.,;:\s]+$/, '')}…`
}

function parseRssItems(xml: string, kind: ChangelogKind): ChangelogItem[] {
  const items: ChangelogItem[] = []
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? []
  const source =
    kind === 'developer' ? 'Base44 Developer Changelog' : 'Base44 Product Changelog'

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
      source,
      kind,
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

function dedupeMerge(all: ChangelogItem[]): ChangelogItem[] {
  const seen = new Set<string>()
  const out: ChangelogItem[] = []
  for (const item of all) {
    const key = item.guid || item.link
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  out.sort((a, b) => {
    const da = a.date || ''
    const db = b.date || ''
    if (da !== db) return db.localeCompare(da)
    return a.title.localeCompare(b.title)
  })
  return out
}

export async function getChangelogItems(limit = 6): Promise<{
  items: ChangelogItem[]
  fromRss: boolean
  productPage: string
  developerPage: string
  statusPage: string
}> {
  const [productXml, productAltXml, developerXml] = await Promise.all([
    tryFetchRss(PRODUCT_RSS),
    tryFetchRss(PRODUCT_RSS_ALT),
    tryFetchRss(DEVELOPER_RSS),
  ])

  const productFeed = productXml ?? productAltXml
  const parsed: ChangelogItem[] = []
  if (productFeed) parsed.push(...parseRssItems(productFeed, 'product'))
  if (developerXml) parsed.push(...parseRssItems(developerXml, 'developer'))

  const merged = dedupeMerge(parsed)
  if (merged.length > 0) {
    return {
      items: merged.slice(0, limit),
      fromRss: true,
      productPage: PRODUCT_PAGE,
      developerPage: DEVELOPER_PAGE,
      statusPage: STATUS_PAGE,
    }
  }

  return {
    items: FALLBACK_ITEMS,
    fromRss: false,
    productPage: PRODUCT_PAGE,
    developerPage: DEVELOPER_PAGE,
    statusPage: STATUS_PAGE,
  }
}

/** Studio blog posts for “From the studio” on /updates — never CHANGELOG.md. */
export function getStudioBlogNotes(): { href: string; title: string; blurb: string }[] {
  return [
    {
      href: '/blog/base44-not-working',
      title: 'Base44 not working: a calm triage order',
      blurb: 'Status first, then publish, blank screen, domain, schema.',
    },
    {
      href: '/blog/base44-publish-error',
      title: 'When publish says success but live is unchanged',
      blurb: 'Split build failure from stale output and wrong target.',
    },
    {
      href: '/blog/base44-custom-domain-ssl',
      title: 'Custom domain SSL still pending',
      blurb: 'DNS, Cloudflare proxy, and certificate timing.',
    },
    {
      href: '/blog/base44-changelog-what-changed',
      title: 'Reading Base44 updates as a builder',
      blurb: 'Official product and developer notes, paired with status.',
    },
  ]
}

export { PRODUCT_PAGE, DEVELOPER_PAGE, STATUS_PAGE }
