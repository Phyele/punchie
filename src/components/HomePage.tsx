import { useState } from 'react'
import type { Card } from '../types'
import { PunchCard } from './PunchCard'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogHeader, AlertDialogTitle,
} from './ui/alert-dialog'

interface Props {
  cards: Card[]
  onNew: () => void
  onEdit: (card: Card) => void
  onDelete: (id: string) => void
  onPunch: (id: string, slot: number) => void
}

function cardTilt(id: string, index: number): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  const magnitude = 0.2 + (hash % 1000) / 1000 * 0.8
  return index % 2 === 0 ? magnitude : -magnitude
}

function CardItem({ card, index, onEdit, onDelete, onPunch }: {
  card: Card
  index: number
  onEdit: (c: Card) => void
  onDelete: (id: string) => void
  onPunch: (id: string, slot: number) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="group flex flex-col gap-2 transition-transform duration-200 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
      style={{ transform: `rotate(${cardTilt(card.id, index)}deg)` }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)')}
      onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${cardTilt(card.id, index)}deg)`)}
    >
      <PunchCard card={card} interactive onPunch={slot => onPunch(card.id, slot)} />
      <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(card)}
          className="text-slate-500 text-sm px-3 py-1 rounded-full border border-slate-200 hover:border-slate-400 hover:text-slate-700 transition-colors"
        >
          edit
        </button>
        <button
          className="text-rose-400 text-sm px-3 py-1 rounded-full border border-rose-100 hover:border-rose-300 hover:text-rose-600 transition-colors"
          onClick={() => setOpen(true)}
        >
          delete
        </button>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Say goodbye to "{card.title}"?</AlertDialogTitle>
              <AlertDialogDescription>
                All those stamps, gone forever. Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-center mt-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(card.id)} className="bg-rose-500 hover:bg-rose-600">
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="w-full flex items-center gap-4 my-2">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-sm font-semibold tracking-widest text-slate-400 uppercase">{label}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  )
}

export function HomePage({ cards, onNew, onEdit, onDelete, onPunch }: Props) {
  const active = cards.filter(c => c.punches.filter(Boolean).length < 10)
  const completed = cards.filter(c => c.punches.filter(Boolean).length >= 10)

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white py-8 flex flex-col items-center text-center gap-1">
        <div className="w-full max-w-[1440px] mx-auto px-20">
          <h1 className="text-6xl font-bold text-slate-800 tracking-tight">punchie</h1>
          <p className="text-base text-slate-400">every stamp brings you closer</p>
        </div>
      </header>

      <main className="py-10">
        <div className="w-full max-w-[1440px] mx-auto px-20">
        {cards.length === 0 ? (
          <>
            <div className="flex flex-wrap justify-center gap-6">
              <NewCardButton onClick={onNew} index={0} />
            </div>
            <p className="text-slate-400 text-center max-w-md leading-relaxed mx-auto mt-8">
              A fun way to track habits and small goals. Run 10 times, read 10 chapters, drink 10 glasses of water — punch a slot each time, and treat yourself when the card is full.
            </p>
          </>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {active.map((card, i) => (
              <CardItem key={card.id} card={card} index={i} onEdit={onEdit} onDelete={onDelete} onPunch={onPunch} />
            ))}
            <NewCardButton onClick={onNew} index={active.length} />

            {completed.length > 0 && (
              <>
                <SectionLabel label="Completed" />
                {completed.map((card, i) => (
                  <CardItem key={card.id} card={card} index={active.length + 1 + i} onEdit={onEdit} onDelete={onDelete} onPunch={onPunch} />
                ))}
              </>
            )}
          </div>
        )}
        </div>
      </main>
      <footer className="py-8 text-center space-y-2">
        <p className="text-slate-400">© {new Date().getFullYear()} punchie — by <a href="https://github.com/phyele" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600 transition-colors">Phyele</a></p>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">Your cards are stored in your browser's localStorage. They will be lost if you clear your browser data, use a different browser, or browse in private mode.</p>
      </footer>
    </div>
  )
}

function NewCardButton({ onClick, index }: { onClick: () => void; index: number }) {
  const tilt = index % 2 === 0 ? 0.6 : -0.6
  return (
    <div
      className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col gap-2 transition-transform duration-200"
      style={{ transform: `rotate(${tilt}deg)` }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)')}
      onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${tilt}deg)`)}
    >
      <div style={{ aspectRatio: '85.6 / 53.98' }}>
        <button
          onClick={onClick}
          className="w-full h-full rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-slate-500 cursor-pointer"
        >
          <span className="text-3xl leading-none">+</span>
          <span className="text-sm font-semibold tracking-widest uppercase">add card</span>
        </button>
      </div>
      <div className="h-7" />
    </div>
  )
}
