import { useState, useEffect } from 'react'
import type { Card } from './types'

const STORAGE_KEY = 'punchie-cards'

const BG_TO_TEXT: Record<string, string> = {
  '#fecaca': '#7f1d1d', '#fed7aa': '#7c2d12', '#fde68a': '#78350f',
  '#fef08a': '#713f12', '#d9f99d': '#365314', '#bbf7d0': '#14532d',
  '#a7f3d0': '#064e3b', '#99f6e4': '#134e4a', '#a5f3fc': '#164e63',
  '#bae6fd': '#0c4a6e', '#bfdbfe': '#1e3a8a', '#c7d2fe': '#312e81',
  '#ddd6fe': '#4c1d95', '#e9d5ff': '#581c87', '#f5d0fe': '#701a75',
  '#fbcfe8': '#831843', '#fecdd3': '#881337', '#e2e8f0': '#0f172a',
}
const BG_TO_SUBTEXT: Record<string, string> = {
  '#fecaca': '#b91c1c', '#fed7aa': '#c2410c', '#fde68a': '#b45309',
  '#fef08a': '#a16207', '#d9f99d': '#4d7c0f', '#bbf7d0': '#15803d',
  '#a7f3d0': '#047857', '#99f6e4': '#0f766e', '#a5f3fc': '#0e7490',
  '#bae6fd': '#0369a1', '#bfdbfe': '#1d4ed8', '#c7d2fe': '#4338ca',
  '#ddd6fe': '#6d28d9', '#e9d5ff': '#7e22ce', '#f5d0fe': '#a21caf',
  '#fbcfe8': '#be185d', '#fecdd3': '#be123c', '#e2e8f0': '#334155',
}

function load(): Card[] {
  try {
    const cards: Card[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    // Migrate old cards missing slotColor
    const validSlotShapes = [
      'book', 'bookmarksimple', 'chatteardrop', 'circle', 'club', 'crownsimple', 'diamond', 'dropsimple',
      'filmscript', 'foldersimple', 'heart', 'hexagon', 'housesimple', 'lightning', 'moon', 'notches',
      'octagon', 'parallelogram', 'pentagon', 'play', 'rectangle', 'seal', 'shield', 'spade', 'square',
      'star', 'starfour', 'tagchevron', 'tagsimple', 'triangle',
    ]
    const validHoleShapes = ['check', 'circle', 'diamond', 'hexagon', 'seal', 'square', 'triangle', 'star', 'starfour', 'heart']
    return cards.map(c => {
      const base = { ...c, slotColor: c.slotColor ?? '#fcd34d' }
      return {
        ...base,
        textColor: BG_TO_TEXT[base.color] ?? '#78350f',
        subtextColor: BG_TO_SUBTEXT[base.color] ?? '#b45309',
        slotShape: validSlotShapes.includes(base.slotShape) ? base.slotShape : 'circle',
        holeShape: validHoleShapes.includes(base.holeShape) ? base.holeShape : 'star',
      }
    })
  } catch {
    return []
  }
}

function save(cards: Card[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

export function useCards() {
  const [cards, setCards] = useState<Card[]>(load)

  useEffect(() => {
    save(cards)
  }, [cards])

  const addCard = (card: Card) => setCards(prev => [card, ...prev])

  const updateCard = (card: Card) =>
    setCards(prev => prev.map(c => (c.id === card.id ? card : c)))

  const deleteCard = (id: string) =>
    setCards(prev => prev.filter(c => c.id !== id))

  const punchCard = (id: string, slot: number) =>
    setCards(prev =>
      prev.map(c => {
        if (c.id !== id) return c
        const punches = [...c.punches]
        punches[slot] = !punches[slot]
        return { ...c, punches }
      })
    )

  return { cards, addCard, updateCard, deleteCard, punchCard }
}
