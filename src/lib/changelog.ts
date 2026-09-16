export type ChangelogItem = {
  title: string
  date: string
  link: string
  source: string
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
  },
]

function decodeXml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '')
    .trim()
}

function parseRssItems(xml: string): ChangelogItem[] {
  const items: ChangelogItem[] = []
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? []
  for (const block of itemBlocks) {
    const title = decodeXml((block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim())
    const link = decodeXml((block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? '').trim())
    const pubDateRaw = (block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ?? '').trim()
    if (!title || !link) continue
    let date = ''
    if (pubDateRaw) {
      const d = new Date(pubDateRaw)
      if (!Number.isNaN(d.getTime())) {
        date = d.toISOString().slice(0, 10)
      }
    }
    items.push({
      title,
      date,
      link,
      source: 'Base44 Product Changelog',
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
    (await tryFetchRss(PRODUCT_RSS)) ??
    (await tryFetchRss(PRODUCT_RSS_ALT))

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

export { PRODUCT_PAGE, STATUS_PAGE }
