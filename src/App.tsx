import { useState } from 'react'
import { useCards } from './useCards'
import { HomePage } from './components/HomePage'
import { EditorPage } from './components/EditorPage'
import type { Card } from './types'

type View = { page: 'home' } | { page: 'editor'; card?: Card }

function App() {
  const { cards, addCard, updateCard, deleteCard, punchCard } = useCards()
  const [view, setView] = useState<View>({ page: 'home' })

  const handleSave = (card: Card) => {
    if (view.page === 'editor' && view.card) {
      updateCard(card)
    } else {
      addCard(card)
    }
    setView({ page: 'home' })
  }

  if (view.page === 'editor') {
    return (
      <EditorPage
        initial={view.card}
        onSave={handleSave}
        onCancel={() => setView({ page: 'home' })}
      />
    )
  }

  return (
    <HomePage
      cards={cards}
      onNew={() => setView({ page: 'editor' })}
      onEdit={card => setView({ page: 'editor', card })}
      onDelete={deleteCard}
      onPunch={punchCard}
    />
  )
}

export default App
