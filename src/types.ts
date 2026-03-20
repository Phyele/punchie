export type SlotShape =
  // shapes
  'book' | 'bookmarksimple' | 'chatteardrop' | 'circle' | 'club' | 'crownsimple' | 'diamond' | 'dropsimple' | 'filmscript' | 'foldersimple' | 'heart' | 'hexagon' | 'housesimple' | 'lightning' | 'moon' | 'notches' | 'octagon' | 'parallelogram' | 'pentagon' | 'play' | 'rectangle' | 'seal' | 'shield' | 'spade' | 'square' | 'star' | 'starfour' | 'tagchevron' | 'tagsimple' | 'triangle'
export type HoleShape = 'check' | 'circle' | 'diamond' | 'hexagon' | 'seal' | 'square' | 'triangle' | 'star' | 'starfour' | 'heart'

export interface Card {
  id: string
  title: string
  reward: string
  color: string
  slotColor: string
  textColor: string
  subtextColor: string
  slotShape: SlotShape
  holeShape: HoleShape
  punches: boolean[]
  createdAt: number
}
