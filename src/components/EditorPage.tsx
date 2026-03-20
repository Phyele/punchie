import { useState, useRef, type ElementType } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import {
  ChatTeardrop, Circle, Diamond, Heart, Hexagon,
  HouseSimple, Lightning, Moon, Notches, Octagon, Parallelogram, Pentagon, Play, Rectangle, Seal,
  Shield, Square, Star, StarFour, TagChevron, TagSimple, Triangle,
  DropSimple, Club, CrownSimple, Spade,
  Book, BookmarkSimple, FilmScript, FolderSimple,
  CheckFat,
} from '@phosphor-icons/react'
import { downloadCard } from '../downloadCard'
import type { Card, SlotShape, HoleShape } from '../types'
import { PunchCard } from './PunchCard'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

const COLORS: { bg: string; slot: string; text: string; subtext: string }[] = [
  { bg: '#fecaca', slot: '#fca5a5', text: '#7f1d1d', subtext: '#b91c1c' }, // Red
  { bg: '#fed7aa', slot: '#fdba74', text: '#7c2d12', subtext: '#c2410c' }, // Orange
  { bg: '#fde68a', slot: '#fcd34d', text: '#78350f', subtext: '#b45309' }, // Amber
  { bg: '#fef08a', slot: '#fde047', text: '#713f12', subtext: '#a16207' }, // Yellow
  { bg: '#d9f99d', slot: '#bef264', text: '#365314', subtext: '#4d7c0f' }, // Lime
  { bg: '#bbf7d0', slot: '#86efac', text: '#14532d', subtext: '#15803d' }, // Green
  { bg: '#a7f3d0', slot: '#6ee7b7', text: '#064e3b', subtext: '#047857' }, // Emerald
  { bg: '#99f6e4', slot: '#5eead4', text: '#134e4a', subtext: '#0f766e' }, // Teal
  { bg: '#a5f3fc', slot: '#67e8f9', text: '#164e63', subtext: '#0e7490' }, // Cyan
  { bg: '#bae6fd', slot: '#7dd3fc', text: '#0c4a6e', subtext: '#0369a1' }, // Sky
  { bg: '#bfdbfe', slot: '#93c5fd', text: '#1e3a8a', subtext: '#1d4ed8' }, // Blue
  { bg: '#c7d2fe', slot: '#a5b4fc', text: '#312e81', subtext: '#4338ca' }, // Indigo
  { bg: '#ddd6fe', slot: '#c4b5fd', text: '#4c1d95', subtext: '#6d28d9' }, // Violet
  { bg: '#e9d5ff', slot: '#d8b4fe', text: '#581c87', subtext: '#7e22ce' }, // Purple
  { bg: '#f5d0fe', slot: '#f0abfc', text: '#701a75', subtext: '#a21caf' }, // Fuchsia
  { bg: '#fbcfe8', slot: '#f9a8d4', text: '#831843', subtext: '#be185d' }, // Pink
  { bg: '#fecdd3', slot: '#fda4af', text: '#881337', subtext: '#be123c' }, // Rose
  { bg: '#e2e8f0', slot: '#cbd5e1', text: '#0f172a', subtext: '#334155' }, // Slate
]

const SLOT_SHAPE_OPTIONS: { value: SlotShape; icon: ElementType }[] = [
  { value: 'chatteardrop', icon: ChatTeardrop },
  { value: 'circle', icon: Circle },
  { value: 'diamond', icon: Diamond },
  { value: 'dropsimple', icon: DropSimple },
  { value: 'heart', icon: Heart },
  { value: 'hexagon', icon: Hexagon },
  { value: 'housesimple', icon: HouseSimple },
  { value: 'lightning', icon: Lightning },
  { value: 'moon', icon: Moon },
  { value: 'notches', icon: Notches },
  { value: 'octagon', icon: Octagon },
  { value: 'parallelogram', icon: Parallelogram },
  { value: 'pentagon', icon: Pentagon },
  { value: 'play', icon: Play },
  { value: 'rectangle', icon: Rectangle },
  { value: 'seal', icon: Seal },
  { value: 'shield', icon: Shield },
  { value: 'square', icon: Square },
  { value: 'star', icon: Star },
  { value: 'starfour', icon: StarFour },
  { value: 'tagchevron', icon: TagChevron },
  { value: 'tagsimple', icon: TagSimple },
  { value: 'book', icon: Book },
  { value: 'bookmarksimple', icon: BookmarkSimple },
  { value: 'club', icon: Club },
  { value: 'crownsimple', icon: CrownSimple },
  { value: 'filmscript', icon: FilmScript },
  { value: 'foldersimple', icon: FolderSimple },
  { value: 'spade', icon: Spade },
  { value: 'triangle', icon: Triangle },
]

const HOLE_SHAPE_OPTIONS: { value: HoleShape; icon: ElementType }[] = [
  { value: 'check', icon: CheckFat },
  { value: 'circle', icon: Circle },
  { value: 'diamond', icon: Diamond },
  { value: 'hexagon', icon: Hexagon },
  { value: 'seal', icon: Seal },
  { value: 'square', icon: Square },
  { value: 'triangle', icon: Triangle },
  { value: 'star', icon: Star },
  { value: 'starfour', icon: StarFour },
  { value: 'heart', icon: Heart },
]

interface Props {
  initial?: Card
  onSave: (card: Card) => void
  onCancel: () => void
}

export function EditorPage({ initial, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [reward, setReward] = useState(initial?.reward ?? '')
  const [colorIndex, setColorIndex] = useState(
    () => Math.max(0, COLORS.findIndex(c => c.bg === initial?.color))
  )
  const [slotShape, setSlotShape] = useState<SlotShape>(initial?.slotShape ?? 'circle')
  const [holeShape, setHoleShape] = useState<HoleShape>(initial?.holeShape ?? 'star')
  const [submitted, setSubmitted] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const preview: Card = {
    id: initial?.id ?? 'preview',
    title: title || '???',
    reward: reward || '???',
    color: COLORS[colorIndex].bg,
    slotColor: COLORS[colorIndex].slot,
    textColor: COLORS[colorIndex].text,
    subtextColor: COLORS[colorIndex].subtext,
    slotShape,
    holeShape,
    punches: Array(10).fill(false),
    createdAt: initial?.createdAt ?? Date.now(),
  }

  const titleError = submitted && title.trim().length === 0
  const rewardError = submitted && reward.trim().length === 0

  const handleSave = () => {
    setSubmitted(true)
    if (title.trim().length === 0 || reward.trim().length === 0) return
    onSave({
      ...preview,
      id: initial?.id ?? crypto.randomUUID(),
      punches: initial?.punches ?? Array(10).fill(false),
      createdAt: initial?.createdAt ?? Date.now(),
    })
  }

  const handleDownload = async () => {
    setSubmitted(true)
    if (title.trim().length === 0 || reward.trim().length === 0) return
    if (!previewRef.current) return
    setDownloading(true)
    try {
      await downloadCard(preview, previewRef.current)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white py-10">
        <div className="w-full max-w-[1440px] mx-auto px-20 flex items-center gap-4">
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={24} weight="bold" />
          </button>
          <h1 className="text-4xl font-bold text-slate-800 flex-1 text-center">
            {initial ? 'Edit card' : 'New punch card'}
          </h1>
        </div>
      </header>

      <div className="w-full max-w-[1440px] mx-auto px-20 py-10 grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Drink water"
              value={title}
              onChange={e => setTitle(e.target.value)}
              aria-invalid={titleError}
            />
            {titleError && <p className="text-sm text-destructive">Choose a title for your card</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reward">Reward</Label>
            <Input
              id="reward"
              placeholder="e.g. Matcha latte"
              value={reward}
              onChange={e => setReward(e.target.value)}
              aria-invalid={rewardError}
            />
            {rewardError && <p className="text-sm text-destructive">Choose a reward for completing the card</p>}
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c, i) => (
                <button
                  key={c.bg}
                  onClick={() => setColorIndex(i)}
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c.bg,
                    borderColor: colorIndex === i ? '#1e293b' : 'transparent',
                    boxShadow: colorIndex === i ? '0 0 0 1px #1e293b' : 'none',
                  }}
                  aria-label={`Color ${c.bg}`}
                />
              ))}
            </div>
          </div>

          {/* Slot shape */}
          <div className="space-y-2">
            <Label>Slot shape</Label>
            <div className="flex gap-2 flex-wrap">
              {SLOT_SHAPE_OPTIONS.map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSlotShape(value)}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors
                    ${slotShape === value
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-400'}`}
                  aria-label={value}
                >
                  <Icon weight="fill" size={22} className={slotShape === value ? 'text-slate-900' : 'text-slate-400'} />
                </button>
              ))}
            </div>
          </div>

          {/* Hole shape */}
          <div className="space-y-2">
            <Label>Stamp icon</Label>
            <div className="flex gap-2">
              {HOLE_SHAPE_OPTIONS.map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setHoleShape(value)}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors
                    ${holeShape === value
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-400'}`}
                  aria-label={value}
                >
                  <Icon weight="fill" size={22} className={holeShape === value ? 'text-slate-900' : 'text-slate-400'} />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex">
            <Button className="h-12 px-8 text-base" onClick={handleSave}>Save</Button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-base font-medium text-slate-400 uppercase tracking-wider mb-3">Preview</p>
            <div ref={previewRef}>
              <PunchCard card={{ ...preview, punches: [true, true, true, false, false, false, false, false, false, false] }} />
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <Button variant="outline" disabled={downloading} onClick={handleDownload}>
              {downloading ? '...' : 'Download'}
            </Button>
            <p className="text-base text-slate-400 text-center">
              Download as PNG and print it to have a physical card.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
