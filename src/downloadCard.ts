import { toPng } from 'html-to-image'
import type { Card } from './types'

export async function downloadCard(card: Card, node: HTMLElement) {
  await document.fonts.ready
  const hide = node.querySelectorAll<HTMLElement>('[data-hole], [data-counter]')
  hide.forEach(el => { el.style.visibility = 'hidden' })
  const dataUrl = await toPng(node, { pixelRatio: 3 })
  hide.forEach(el => { el.style.visibility = '' })
  const link = document.createElement('a')
  link.download = `${card.title.trim().toLowerCase().replace(/\s+/g, '-')}-card.png`
  link.href = dataUrl
  link.click()
}
