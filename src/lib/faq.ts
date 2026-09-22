import faqJson from '../data/faq.json'

export type FaqItem = {
  question: string
  answer: string
}

export type FaqCategory = {
  id: string
  title: string
  items: FaqItem[]
}

type FaqFile = {
  version: number
  title: string
  categories: FaqCategory[]
}

const data = faqJson as FaqFile

export const faqCategories: FaqCategory[] = data.categories

export const allFaqItems: FaqItem[] = faqCategories.flatMap((c) => c.items)

export function faqCount(): number {
  return allFaqItems.length
}

/** Strip tags for JSON-LD text */
export function plainAnswer(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}
