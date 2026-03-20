import { type ElementType } from 'react'
import {
  Star, Heart, CheckFat, Circle, Square,
  ChatTeardrop, Diamond, HouseSimple, Lightning, Moon,
  Notches, Octagon, Parallelogram, Pentagon, Play, Rectangle, Seal, Shield,
  StarFour, TagChevron, TagSimple, Triangle, Hexagon,
  DropSimple, Club, CrownSimple, Spade,
  Book, BookmarkSimple, FilmScript, FolderSimple,
} from '@phosphor-icons/react'
import type { Card, SlotShape, HoleShape } from '../types'

const SLOTS = 10

const SLOT_ICONS: Record<SlotShape, ElementType> = {
  // shapes
  chatteardrop: ChatTeardrop,
  circle: Circle, diamond: Diamond, heart: Heart,
  hexagon: Hexagon, housesimple: HouseSimple, lightning: Lightning, moon: Moon, notches: Notches,
  octagon: Octagon, parallelogram: Parallelogram, pentagon: Pentagon, play: Play,
  rectangle: Rectangle, seal: Seal, shield: Shield, square: Square,
  star: Star, starfour: StarFour, tagchevron: TagChevron,
  tagsimple: TagSimple, triangle: Triangle,
  dropsimple: DropSimple, club: Club, crownsimple: CrownSimple, spade: Spade,
  book: Book, bookmarksimple: BookmarkSimple, filmscript: FilmScript, foldersimple: FolderSimple,
}

const HOLE_ICONS: Record<HoleShape, ElementType> = {
  check: CheckFat,
  circle: Circle,
  diamond: Diamond,
  hexagon: Hexagon,
  seal: Seal,
  square: Square,
  triangle: Triangle,
  star: Star,
  starfour: StarFour,
  heart: Heart,
}

function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function iconPos(index: number, axis: number): number {
  return 30 + rand(index * 3 + axis) * 40
}

function iconRotation(index: number): number {
  return -10 + rand(index * 3 + 2) * 20
}

interface Props {
  card: Card
  interactive?: boolean
  onPunch?: (slot: number) => void
}

export function PunchCard({ card, interactive = false, onPunch }: Props) {
  const punchedCount = card.punches.filter(Boolean).length
  const SlotIcon = SLOT_ICONS[card.slotShape]
  const HoleIcon = HOLE_ICONS[card.holeShape]

  const row1 = Array.from({ length: 5 }, (_, i) => i)
  const row2 = Array.from({ length: 5 }, (_, i) => i + 5)

  return (
    <>
    <svg width="0" height="0" className="absolute">
      <defs>
        <filter id="hole-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
          <feOffset dx="0" dy="1.5" result="offset"/>
          <feComposite operator="out" in="SourceGraphic" in2="offset" result="inverse"/>
          <feFlood floodColor="rgba(0,0,0,0.35)" result="color"/>
          <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>
      </defs>
    </svg>
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        aspectRatio: '85.6 / 53.98',
        backgroundColor: card.color,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: '5%',
        paddingLeft: '7%',
        paddingRight: '7%',
        paddingBottom: '4%',
        containerType: 'inline-size',
      }}
    >
      {/* Title */}
      <h2
        className="font-bold leading-tight text-center truncate opacity-85"
        style={{ color: card.textColor, fontSize: '8.5cqw' }}
      >
        {card.title}
      </h2>

      {/* Slots — 2 rows of 5 */}
      <div className="flex flex-col gap-1.5">
        {[row1, row2].map((row, ri) => (
          <div key={ri} className="flex gap-1.5">
            {row.map(i => {
              const punched = card.punches[i] ?? false
              return (
                <button
                  key={i}
                  disabled={!interactive}
                  onClick={() => onPunch?.(i)}
                  className={`
                    relative flex-1 flex items-center justify-center transition-all duration-150
                    ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'}
                  `}
                  style={{ aspectRatio: '1 / 1', background: 'none', border: 'none', padding: 0 }}
                  aria-label={punched ? `Slot ${i + 1} stamped` : `Stamp slot ${i + 1}`}
                >
                  {/* Slot shape icon */}
                  <SlotIcon
                    weight="fill"
                    color={card.slotColor}
                    className="w-full h-full"
                  />
                  {/* Hole icon on top when punched */}
                  {punched && (
                    <HoleIcon
                      weight="fill"
                      color="white"
                      size="55%"
                      data-hole
                      className="absolute pointer-events-none"
                      style={{
                        filter: 'url(#hole-inner-shadow)',
                        left: `${iconPos(i, 0)}%`,
                        top: `${iconPos(i, 1)}%`,
                        transform: `translate(-50%, -50%) rotate(${iconRotation(i)}deg)`,
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium truncate" style={{ color: card.textColor, fontSize: '5.5cqw' }}>
          <span className="font-semibold tracking-widest uppercase opacity-50 mr-1" style={{ fontSize: '4.5cqw' }}>reward:</span>{card.reward}
        </span>
        <span data-counter className="tabular-nums font-medium opacity-50" style={{ color: card.textColor, fontSize: '5.5cqw' }}>
          {punchedCount}/{SLOTS}
        </span>
      </div>
    </div>
    </>
  )
}

